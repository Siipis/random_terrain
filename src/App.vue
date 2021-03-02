<template>
  <div id="app">
    <Settings/>
    <Terrain/>
  </div>
</template>

<script>
import 'vue-material-design-icons/styles.css';

import Terrain from "@/components/Terrain";
import Settings from "@/components/Settings";

export default {
  name: 'App',
  components: {
    Settings,
    Terrain
  }
}
</script>

<style>
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
</style>
