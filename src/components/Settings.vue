<template>
  <div id="settings">
    <div class="form--control">
      <label for="terrainSelect">Terrain</label>
      <select id="terrainSelect" @change="$store.commit('terrain', $event.target.value)">
        <option v-for="option in terrains" :key="option"
                :value="option" :selected="option === terrain">
          {{ option | capitalize }}
        </option>
      </select>
    </div>

    <div class="form--control">
      <label for="scaleSelect">Scale</label>
      <select id="scaleSelect" @change="$store.commit('scale', $event.target.value)">
        <option v-for="option in scales" :key="option"
                :value="option" :selected="option === scale">
          {{ option }}
        </option>
      </select>
    </div>

    <div class="form--control buttons">
      <button @click="$store.dispatch('expand')" :disabled="working">
        <expand-icon />
        Expand
      </button>
      <button @click="$store.dispatch('expand', {random: true})" :disabled="working">
        <random-icon />
        Random
      </button>
      <button @click="$store.commit('reset')">
        <reset-icon />
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ExpandIcon from 'vue-material-design-icons/CrosshairsGps';
import RandomIcon from 'vue-material-design-icons/CameraControl';
import ResetIcon from 'vue-material-design-icons/Close';

export default {
  name: "Settings",

  components: {
    ExpandIcon,
    RandomIcon,
    ResetIcon,
  },

  computed: {
    ...mapState({
      working: state => state.working,

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

  background: white;
  padding: 30px 20px;
  border: 2px solid gray;
  border-radius: 6px;
  box-shadow: 0 5px 10px rgba(black, 0.1);

  z-index: 100;
}

.form--control:not(:last-of-type) {
  margin-bottom: 0.5em;
  display: flex;
}

label {
  font-weight: bold;
  flex: 0 1 6em;
  display: block;
  padding: 4px 0;
  margin-right: 1em;
}

select, input {
  font-family: inherit;
  font-size: inherit;
  flex: 1 1 100%;
  padding: 4px 6px;
}

button {
  color: white;
  font-family: inherit;
  font-size: 14px;
  background: #444;
  border: 2px solid #333;
  padding: 0.4em 1.2em 0.4em 1em;
  border-radius: 5%;
  margin: 0.5em 0;
  transition: all 0.3s;

  &:disabled {
    background: #777;
  }

  &:not(:disabled):hover {
    background: #111;
  }

  & + button {
    margin-left: 0.25em;
  }
}
</style>
