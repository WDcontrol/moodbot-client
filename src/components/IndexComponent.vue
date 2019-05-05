// Component achieved

<template>
  <div class="div">
    <div class="ach">
      <div class="icon">
        <i class="fa fa-flag" aria-hidden="true"></i>
      </div>
      <!-- Achievement skeleton -->
      <div class="text_wrap">
        <p class="title"></p>
        <span class="detail"></span>
      </div>
      <!-- Achievement skeleton -->
    </div>
    <div class="container">
      <div class="container-inner">
        <div class="main-content">
          <div class="welcome-headings">
            <div class="heading">
              <h3 id="heading1">Hello</h3>
              <h3 id="heading2"></h3>
              <h1 id="heading3" style="color:#86db74!important">{{this.$parent.user.first_name}}</h1>
            </div>
            <div class="short-bio">
              <p>
                Je suis Moodbot, l'expert de la psychologie du bonheur.
                <br>Ensemble, nous calculerons ton humeur quotidiennement, et
                d'ailleurs, voici les dernières statistiques !
              </p>
            </div>
            <div v-if="$parent.thereIsDataOnToday()" class="statToday">
              <div  class="more-info">
                <div class="progress" :data-percentage="$parent.flowByDay(moment().format('LL')) * 4">
                  <span class="progress-left">
                    <span class="progress-bar"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar"></span>
                  </span>
                  <div class="progress-value">
                    <div>
                      {{$parent.flowByDay(moment().format('LL')) * 4}} %
                      <br>
                      <span>heureux</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="textResult">
                <p>Aujourd'hui, tu es plutot...{{$parent.theoricalStateByDay(moment().format('LL'))}} !</p>
              </div>
              <div class="textResult">
              </div>
            </div>
            <div v-else class="textResult" style='color:red'>
                <p>Vous n'avez pas de donnée aujourd'hui </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import moment from 'moment'
import { isNull } from 'util';
import { fr } from "vuejs-datepicker/dist/locale";
export default {
  created() {
    moment.locale("fr");
  },
  props:['userId'],
  data(){
    return {
      moment,
      fr,
    }
    },
}
</script>
