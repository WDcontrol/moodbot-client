<script>
import { Line } from 'vue-chartjs';
import moment from 'moment';
import { fr } from 'vuejs-datepicker/dist/locale';

export default {
  extends: Line,
  props: ['user', 'globalUser', 'dataUserIndex', 'timelapseFormat', 'options'],
  beforeUpdate() {
    this.fillData();
    this.renderChart(this.chartdata, this.options);
  },
  data() {
    return {
      chartdata: null,
      moment,
      fr,
    };
  },
  methods: {
    fillData() {
      const statsKey = Object.keys(this.$parent.user.stats)[this.$parent.dataUserIndex];
      const dataLength = this.$parent.user.stats[statsKey].length;
      let flowPotential = 0;
      const labels = [];
      const data = [];
      for (let i = 0; i < dataLength; i++) {
        flowPotential =
          parseInt(this.$parent.user.stats[statsKey][i].rate_ambience) +
          parseInt(this.$parent.user.stats[statsKey][i].rate_energy) +
          parseInt(this.$parent.user.stats[statsKey][i].rate_happiness) +
          parseInt(this.$parent.user.stats[statsKey][i].rate_mental) +
          parseInt(this.$parent.user.stats[statsKey][i].rate_qualify);
        flowPotential = parseInt((flowPotential / 5) * 2);
        labels.push(this.activityDate(this.$parent.user.stats[statsKey][i]));
        data.push(flowPotential);
      }
      this.chartdata = {
        labels,
        datasets: [
          {
            fill: false,
            label: ['Flow'],
            backgroundColor: [
              '#f87979',
            ],
            data,
          },
        ],
      };
      this.options = {
        responsive: true,

      };

      this.renderChart(this.chartdata, this.options);
    },
    activityDate(e) {
      switch (this.$parent.timelapseFormat) {
        case 'LL':
          return moment(e.date).format('LT');
        case 'MMMM':
          return (
            `${moment(e.date).format('DD')
            }/${
              moment(e.date).format('MM')
            }${'\n'}${
              moment(e.date).format('LT')}`
          ); // TODO le + numéro jour + à + heure
        case 'YYYY':
          return (
            `${moment(e.date).format('DD')
            }/${
              moment(e.date).format('MM')
            }${'\n'}${
              moment(e.date).format('LT')}`
          );
      }
    },
  },
  watch: {
    dataUserIndex() {
      this.dataUserIndex = '';
      this.fillData();
    },
  },
};
</script>

<style>
</style>
