<template>
  <div id="settings">
    <div>
      <label for="terrainSelect">Terrain</label>
      <select id="terrainSelect" @change="$store.commit('terrain', $event.target.value)">
        <option v-for="option in terrains" :key="option"
                :value="option" :selected="option === terrain">
          {{ option }}
        </option>
      </select>
    </div>

    <div>
      <label for="scaleSelect">Scale</label>
      <select id="scaleSelect" @change="$store.commit('scale', $event.target.value)">
        <option v-for="option in scales" :key="option"
                :value="option" :selected="option === scale">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",

  computed: {
    terrain() {
      return this.$store.state.config.terrain
    },

    terrains() {
      return this.$store.state.terrains
    },

    scale() {
      return this.$store.state.config.scale
    },

    scales() {
      return this.$store.state.scales
    },
  }
}
</script>

<style scoped lang="scss">
#settings {
  position: fixed;
  top: 10px;
  left: 10px;

  width: 200px;
  padding: 10px;
  border: 1px solid gray;
  background: #cccccc;

  z-index: 100;
}
</style>
