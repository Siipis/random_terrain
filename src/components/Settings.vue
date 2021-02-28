<template>
  <div id="settings">
    <div>
      <label for="terrainSelect">Terrain</label>
      <select id="terrainSelect" @change="$store.commit('terrain', $event.target.value)">
        <option v-for="option in terrains" :key="option"
                :value="option" :selected="option === terrain">
          {{ option | capitalize }}
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

    <div>
      <button @click="$store.dispatch('expand')">Expand</button>
      <button @click="$store.dispatch('expand', {random: true})">Random</button>
      <button @click="$store.commit('reset')">Reset</button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "Settings",

  computed: {
    ...mapState({
      terrain: state => state.terrain.current,

      terrains: state => Object.keys(state.terrain.list),

      scale: state => state.config.scale,

      scales: state => state.scales,
    })
  },

  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
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
