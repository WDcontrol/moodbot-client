<template>
  <div class="container">
    <div class="container-inner">
      <div class="main-content">
        <div class="main-headings" id="main-headings-js">
          <div class="short-bio" style="display:flex; justify-content:center">
            <p>
              Aujourd'hui, tu as répondu X fois aux questions !
              <br>C'est mieux que la veille, bien ouej !
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rate"]
};
</script>
