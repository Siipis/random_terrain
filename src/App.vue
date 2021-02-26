<template>
  <div id="app">
    <Settings/>
    <Terrain/>
  </div>
</template>

<script>
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
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222;
  background: #eee;
  width: 100%;
  height: 100%;
}
</style>
