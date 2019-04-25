<template>
  <div>
    <datepicker
      :highlighted="highlighted"
      :includeDisabled="true"
      :disabledDates="disabledDates"
      :full-month-name="true"
      :language="fr"
      v-model="pickedDate"
      :clear-button="true"
    ></datepicker>
    <h1 v-if="pickedDate">{{moment(pickedDate).format("LL")}}</h1>
    <div
      v-if="pickedDate==null"
      class="btn-group"
      role="group"
      aria-label="Basic example"
      style="margin-bottom:32px"
    >
      <button v-on:click="$parent.timelapseFormat='LL'" type="button" class="btn btn-secondary">Day</button>
      <button
        v-on:click="$parent.timelapseFormat='MMMM' "
        type="button"
        class="btn btn-secondary"
      >Month</button>
      <button
        v-on:click="$parent.timelapseFormat='YYYY' "
        type="button"
        class="btn btn-secondary"
      >Year</button>
    </div>
    <div :key="index" v-for="(stats, key, index) in user.stats">
      <div v-if="dateExist(index)">
        <h5>
          {{key}}
          <button
            type="button"
            class="btn"
            data-toggle="modal"
            data-target="#exampleModal"
            v-on:click="setDataUserIndex(stats, index)"
          >
            <i class="fas fa-chart-line"></i>
          </button>
        </h5>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>{{tabDate}}</th>
              <th>Activité</th>
              <th>{{`${"Etat"}`}}</th>
              <th>Flow</th>
              <th>Catégorie</th>
              <th>Mood</th>
              <th>Défi</th>
              <th>Compétences</th>
              <th>Compétent</th>
              <th>Absorbé</th>
              <th>Social</th>
              <th>Bonheur</th>
              <th>Energie</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="index" v-for="(e,index) in stats">
              <!-- <th>{{moment(e.date).format(dateInTab)}}</th> -->
              <th>{{activityDate(e)}}</th>
              <th>{{e.activity}}</th>
              <th>{{theoricalState(e.rate_challenge, e.rate_level) }}</th>
              <th>{{flowPotential(e)}}/10</th>
              <th>{{e.category}}</th>
              <th>{{e.mood}}</th>
              <data-rate-component :rate="e.rate_challenge"></data-rate-component>
              <data-rate-component :rate="e.rate_level"></data-rate-component>
              <data-rate-component :rate="e.rate_qualify"></data-rate-component>
              <data-rate-component :rate="e.rate_mental"></data-rate-component>
              <data-rate-component :rate="e.rate_ambience"></data-rate-component>
              <data-rate-component :rate="e.rate_happiness"></data-rate-component>
              <data-rate-component :rate="e.rate_energy"></data-rate-component>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DataRateComponent from "./DataRateComponent";
import moment from "moment";
import { fr } from "vuejs-datepicker/dist/locale";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    DataRateComponent,
    Datepicker
  },
  props: ["user", "globalUser", "dataUserIndex", "timelapseFormat", "tabDate"],
  data() {
    return {
      moment,
      fr,
      pickedDate: null,
      disabledDates: {},
      highlighted: {}
    };
  },
  beforeUpdate() {
    this.disabledHighlightedDates();
  },
  beforeMounted() {
    moment.locale("fr");
  },
  watch: {
    timelapseFormat(val) {
      switch (val) {
        case "day":
          this.$parent.timelapseFormat = "LL";
          this.$parent.tabDate = "Heure";
          break;
        case "month":
          this.$parent.timelapseFormat = "MMMM";
          this.$parent.tabDate = "Date";
          break;
        case "year":
          this.$parent.timelapseFormat = "YYYY";
          this.$parent.tabDate = "Date";
          break;
      }
      this.$parent.user = {
        ...this.$parent.globalUser,
        stats: this.globalUser.stats.reduce((acc, curr) => {
          const newDate = moment(curr.date).format(
            this.$parent.timelapseFormat
          );
          if (Object.keys(acc).includes(newDate)) {
            return { ...acc, [newDate]: [...acc[newDate], curr] };
          }
          return { ...acc, [newDate]: [curr] };
        }, {})
      };
    },
    pickedDate() {
      this.$parent.timelapseFormat = "LL";
    }
  },
  methods: {
    setDataUserIndex(stats, index) {
      this.$parent.dataUserIndex = "pd";
      this.$parent.dataUserIndex = index;
    },
    activityDate(e) {
      switch (this.$parent.timelapseFormat) {
        case "LL":
          return moment(e.date).format("LT");
        case "MMMM":
          return `${moment(e.date).format("DD")}/${moment(e.date).format(
            "MM"
          )}${"\n"}${moment(e.date).format("LT")}`;
        case "YYYY":
          return `${moment(e.date).format("DD")}/${moment(e.date).format(
            "MM"
          )}${"\n"}${moment(e.date).format("LT")}`;
      }
    },
    disabledHighlightedDates() {
      const min = this.globalUser.stats[0].date;
      const numberOfForm = this.globalUser.stats.length;
      const max = this.globalUser.stats[numberOfForm - 1].date;
      const ranges = [];
      for (let i = 0; i < numberOfForm - 1; i++) {
        if (
          moment(this.globalUser.stats[i].date).format("LL") !=
          moment(this.globalUser.stats[i + 1].date).format("LL")
        ) {
          ranges.push({
            from: new Date(
              moment(this.globalUser.stats[i].date).add(1, "days")
            ),
            to: new Date(this.globalUser.stats[i + 1].date)
          });
        }
      }
      this.disabledDates = {
        to: new Date(min),
        from: new Date(moment(max).add(1, "days")),
        ranges
      };
      this.highlighted = {
        dates: [new Date(2016, 4, 4)]
      };
    },
    dateExist(index) {
      if (this.pickedDate != null) {
        this.$parent.timelapseFormat = "LL";
        return moment(this.pickedDate).format("LL") == index;
      }
      return true;
    },
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
    flowPotential(element) {
      const flowPotential =
        (parseInt(element.rate_ambience) +
          parseInt(element.rate_energy) +
          parseInt(element.rate_happiness) +
          parseInt(element.rate_mental) +
          parseInt(element.rate_qualify)) /
        5;

      return parseInt(flowPotential * 2);
    }
  }
};
</script>

<style>
.table thead th,
th {
  border: 1px solid black;
}
.table {
  max-width: 1110px;
}
</style>
