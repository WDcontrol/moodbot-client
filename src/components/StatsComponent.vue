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
  created() {
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
