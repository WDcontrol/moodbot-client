// App.vue
<template>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <nav
      class="navbar navbar-expand-sm bg-dark navbar-dark"
      style="width:100%; background-color:rgba(210, 209, 209, 0.43) !important; color:black"
    >
      <ul class="navbar-nav container">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Accueil</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/posts" class="nav-link">Stats</router-link>
        </li>
      </ul>
    </nav>
    <br>
    <div class="second_animation">
      <img
        class="moodbot floating"
        src="./mooncake_transparent.png"
        alt="image of moodbot"
        style="position: absolute;right: 60px;"
      >
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data(){
    return{
      user:[],
      globalUser:[],
      dataUserIndex:[],
      moment:moment
    }
  },
  created(){
    const uri = `https://moodbot-ydays.herokuapp.com/user/${this.$route.query.id}`; // mettre a jour le lien dynamiquement avec ${this.$route.params.id}
    this.axios.get(uri).then(response => {
      this.user = {
        ...response.data,
        stats: response.data.stats.reduce((acc, curr) => {
          const newDate = moment(curr.date).format("LL");
          if (Object.keys(acc).includes(newDate)) {
            return { ...acc, [newDate]: [...acc[newDate], curr] };
          }
          return { ...acc, [newDate]: [curr] };
        }, {})
      };
      this.globalUser = response.data;
      this.dataUserIndex = Object.keys(this.user.stats)[0];
      this.addFlowToGlobalUser(this.globalUser);
    });
  },
  methods:{
    flowByDay(day){
      var dayFlow = 0,
          numberOfElemInDay = 0
      var stat = this.user.stats[moment().format('LL')]
      for(var elem in stat){
        dayFlow += stat[elem].flow
        numberOfElemInDay += 1
      }
      return parseInt(dayFlow / numberOfElemInDay) // 5 is the number of additionned element to be the flow cf TabUserStats flowPotential to see the list
    }
    ,
    addFlowToGlobalUser(){
      for (var i = 0; i < this.globalUser.stats.length ; i ++ ){
      var stat = this.globalUser.stats[i]
      var flow = 0,
          numberOfElementToCalculateFlow = 0,
          flowInPercent = 0
      for (var elem in stat){
        if (! elem.startsWith('rate_challenge') && !elem.startsWith('rate_level') && elem.startsWith('rate_') ){
          flow += parseInt(stat[elem])
          numberOfElementToCalculateFlow += 1
        }
      }
      flowInPercent = flow / numberOfElementToCalculateFlow * 20
      this.globalUser.stats[i].flow = flow
      }
    }
  }
}
</script>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/*Overriding bootstrap class*/
.small {
  margin: 0 !important;
}
.modal-header {
  display: none !important;
}
.table {
  min-width: 60vw;
  max-width: unset;
}
.progress {
  height: 250px !important;
  display: block !important;
  background-color: #f9f9f9 !important;
}
h5 {
  text-transform: capitalize !important;
}
</style> 