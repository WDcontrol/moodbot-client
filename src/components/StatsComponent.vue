// IndexComponent.vue
<template>
  <div class="container">
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              v-if="globalUser.length!=0"
              class="modal-title"
              id="exampleModalLabel"
            >{{Object.keys(this.user.stats)[this.dataUserIndex]}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <chart-component
              class="small"
              v-if="globalUser.length!=0"
              :user="user"
              :globalUser="globalUser"
              :dataUserIndex="dataUserIndex"
              :timelapseFormat="timelapseFormat"
              :tabDate="tabDate"
            ></chart-component>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <TabStatsComponent
      :tabDate="tabDate"
      :timelapseFormat="timelapseFormat"
      :user="user"
      :globalUser="globalUser"
    ></TabStatsComponent>
  </div>
</template>
<script>
import ChartComponent from "./ChartComponent";
import TabStatsComponent from "./TabStatsComponent";
import moment from "moment";

export default {
  components: {
    ChartComponent,
    TabStatsComponent
  },
  data() {
    return {
      timelapseFormat: "LL",
      tabDate: "Heure",
      user: [],
      globalUser: [],
      dataUserIndex: 1
    };
  },
  mounted() {
    moment.locale("fr");
  },
  props:['userId'],
  created() {
    // this.user = {"_id":"5ca1eca5ba1aa96c043315ef","first_name":"Sean","last_name":"Mgd","messenger_id":"1953048051472940","stats":{"1 mars 2019":[{"_id":"5cac623d0f2e48956520bfd4","date":"2019-03-01T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"4","rate_challenge":"5","rate_energy":"2","rate_happiness":"4","rate_level":"4","rate_mental":"5","rate_qualify":"1"}],"5 mars 2019":[{"_id":"5cac623d0f2e48956520bfd5","date":"2019-03-05T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"4","rate_challenge":"4","rate_energy":"3","rate_happiness":"2","rate_level":"3","rate_mental":"5","rate_qualify":"2"}],"1 avril 2019":[{"_id":"5cac623d0f2e48956520bfd1","date":"2019-04-01T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"1","rate_challenge":"2","rate_energy":"5","rate_happiness":"3","rate_level":"4","rate_mental":"2","rate_qualify":"4"},{"_id":"5cac623d0f2e48956520bfd8","date":"2019-04-01T10:53:02.158Z","activity":"jbz","mood":"Imotep","category":"Travail","rate_ambience":"5","rate_challenge":"1","rate_energy":"5","rate_happiness":"5","rate_level":"5","rate_mental":"1","rate_qualify":"1"}],"2 avril 2019":[{"_id":"5cac623d0f2e48956520bfd2","date":"2019-04-02T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"3","rate_challenge":"4","rate_energy":"5","rate_happiness":"5","rate_level":"2","rate_mental":"3","rate_qualify":"3"}],"3 avril 2019":[{"_id":"5cac623d0f2e48956520bfd3","date":"2019-04-03T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"2","rate_challenge":"4","rate_energy":"2","rate_happiness":"4","rate_level":"4","rate_mental":"5","rate_qualify":"4"},{"_id":"5cac623d0f2e48956520bfd7","date":"2019-04-03T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"2","rate_challenge":"4","rate_energy":"4","rate_happiness":"2","rate_level":"4","rate_mental":"3","rate_qualify":"4"}],"4 avril 2019":[{"_id":"5cac623d0f2e48956520bfd6","date":"2019-04-04T10:51:14.228Z","activity":"kjl","mood":"Imotep","category":"Vie quotidienne","rate_ambience":"3","rate_challenge":"4","rate_energy":"3","rate_happiness":"4","rate_level":"3","rate_mental":"2","rate_qualify":"4"}]},"__v":0}
    const uri = `https://moodbot-ydays.herokuapp.com/user/${this.userId}`; // mettre a jour le lien dynamiquement avec ${this.$route.params.id}
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
    });
  }
};
</script>
<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
