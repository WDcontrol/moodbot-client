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
      this.globalUser = response.data,
      this.addFlowToGlobalUser(this.globalUser);
    });
  },
  methods:{
    theoricalState(rate_challenge, rate_level) {
      let res = "";
      if (rate_challenge > 2 && rate_level == 2) {
        res = "Stimulé";
      } else if (rate_challenge > 2 && rate_level < 2) {
        res = "Anxiété";
      } else if (rate_challenge == 2 && rate_level < 2) {
        res = "Inquiétude";
      } else if (rate_challenge < 2 && rate_level < 2) {
        res = "Apathie";
      } else if (rate_challenge < 2 && rate_level == 2) {
        res = "Ennui";
      } else if (rate_challenge < 2 && rate_level > 2) {
        res = "Relaxation";
      } else if (rate_challenge == 2 && rate_level > 2) {
        res = "Controle";
      } else if (rate_challenge > 2 && rate_level > 2) {
        res = "Flow";
      } else if (rate_challenge == 2 && rate_level == 2) {
        res = "Controle";
      }
      return res;
    },
    theoricalStateByDay(day){
      day = this.user.stats[moment(day).format('LL')]
      var moyRate_challenge = 0
      var moyRate_level = 0
      var numberOfElemInDay = 0
      for (var data in day){
        moyRate_challenge += parseInt(day[data].rate_challenge)
        moyRate_level += parseInt(day[data].rate_level)
        numberOfElemInDay += 1
      }
      moyRate_challenge = parseInt(moyRate_challenge / numberOfElemInDay) 
      moyRate_level = parseInt(moyRate_level / numberOfElemInDay) 
      
      return this.theoricalState(moyRate_challenge,moyRate_level)
    },
    thereIsDataOnToday(){
      try{
      var thereIsDataOnToday = moment(this.lastDateThatUserHasData()).format('LL') == moment().format('LL')
      return thereIsDataOnToday
      }catch(error){
        console.log('error')
      }
    }
    ,
    lastDateThatUserHasData(){
      try{
        var lastDate = this.globalUser.stats[this.globalUser.stats.length - 1].date;
        }catch(error){
          console.log('Length is defined after the data is charged ')
        }
        return lastDate // format 2019-04-24T15:18:23.590Z
      },

    flowByDay(day){
      var dayFlow = 0,
          numberOfElemInDay = 0
      var stat = this.user.stats[moment(day).format('LL')]
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