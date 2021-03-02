<template>
  <div id="app">
    <div id="loading" v-if="working">
      <div class="icon">
        <loading-icon />
      </div>
    </div>
    <Settings/>
    <Terrain/>
  </div>
</template>

<script>
import 'vue-material-design-icons/styles.css';

import Terrain from "@/components/Terrain";
import Settings from "@/components/Settings";
import LoadingIcon from 'vue-material-design-icons/Refresh'

export default {
  name: 'App',
  components: {
    Settings,
    Terrain,
    LoadingIcon,
  },

  computed: {
    working() {
      return this.$store.state.working
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #222;
  background: #eee;
  width: 100%;
  height: 100%;
}

#loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(black, .2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 20vmin;
    line-height: 0;
    text-shadow: 2px 2px 5px rgba(black, .2);
    animation: rotation 2s infinite linear;

    & .material-design-icon > .material-design-icon__svg {
      bottom: 0;
    }
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
