<template>
  <div id="terrain--config" ref="backdrop" @click.prevent="handleClick">
    <div class="container">
      <div class="row tabs">
        <ul>
          <li v-for="type in terrainTypes" :key="type"
              :class="{active: active === type}"
              @click="active=type">
            {{ type|startCase }}
          </li>
        </ul>
      </div>

      <div class="row scrollable">
        <table>
          <tr v-for="type in terrainTypes" :key="type">
            <th>
              <label :for="`${type}Input`">{{ type|startCase }}</label>
            </th>
            <td>
              <input :id="`${type}Input`" :name="type" type="number" min="0" max="1000"
                     :style="{color: hexColor}"
                     @change="handleInput" :value="terrainValue(type)" placeholder="0">
            </td>

            <td>
              <button @click="handleReset(type)">Reset</button>
            </td>
          </tr>
        </table>
      </div>

      <div class="row buttons">
        <div class="col">
          <button @click="$store.commit('resetTerrainValues')">Reset All</button>
        </div>

        <div class="col">
          <button @click="$store.commit('editor', false)">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {startCase} from 'lodash'
import TWEEN from "@tweenjs/tween.js";

export default {
  name: "TerrainConfig",

  data() {
    return {
      active: null,
      originalColor: {
        red: 34,
        green: 34,
        blue: 34,
      },
      textColor: {},
      transition: false
    }
  },

  created() {
    this.active = this.terrainTypes[0]
    this.textColor = {...this.originalColor}
  },

  mounted() {
    setTimeout(() => {
      this.transition = true
    }, 500)
  },

  filters: {
    startCase(string) {
      return startCase(string)
    }
  },

  methods: {
    handleClick($event) {
      if ($event.target === this.$refs.backdrop) {
        this.$store.commit('editor', false)
      }
    },

    handleInput($event) {
      const target = $event.target
      this.$store.commit('setTerrainValue', {
        active: this.active,
        type: target.name,
        value: parseInt(target.value)
      })
    },

    handleReset(type) {
      this.$store.commit('resetTerrainValue', {
        active: this.active,
        type: type
      })
    },

    terrainValue(type) {
      return this.terrain[this.active][type] || 0
    },

    animateInput() {
      if (!this.transition) return

      this.textColor = {
        red: 255,
        green: 255,
        blue: 255
      }

      new TWEEN.Tween(this.textColor)
          .to({...this.originalColor}, 400)
          .easing(TWEEN.Easing.Quadratic.In)
          .start()


      this.nextFrame()
    },

    nextFrame() {
      if (TWEEN.update()) {
        requestAnimationFrame(this.nextFrame)
      }
    }
  },

  computed: {
    terrain() {
      const current = this.$store.state.terrain.current

      return this.$store.state.terrain.list[current]
    },

    terrainTypes() {
      return Object.keys(this.terrain)
    },

    hexColor() {
      const {red, green, blue} = this.textColor
      return `rgb(${Math.ceil(red)}, ${Math.ceil(green)}, ${Math.ceil(blue)})`
    }
  },

  watch: {
    active() {
      this.animateInput()
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

$border-radius: 4px;

#terrain--config {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .25);
  z-index: 110;

  display: flex;
  flex-direction: column;
}

.container {
  display: inline-flex;
  flex-direction: column;
  max-width: 100%;
  max-height: calc(100% - 10vh);
  margin: 5vh auto;
  background: white;
  border: 1px solid #999;
  border-radius: $border-radius;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, .15);

  button {
    @include button;
  }

  table button {
    @include button($type: outline);
  }

  .row {
    flex: 0 1;
    display: flex;

    &.scrollable {
      flex: 1 1;
      overflow: auto;
    }

    .col {
      flex: 1 1;
    }
  }
}

.tabs ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;

  color: #eee;
  font-size: 85%;
  background: #606060;

  li {
    flex: 1;
    white-space: nowrap;
    padding: .5rem 2em;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;

    cursor: pointer;
    transition: all .3s ease-in;

    &:hover:not(.active) {
      background: #444;
    }

    &.active {
      color: #222;
      background: white;
    }
  }
}

.buttons {
  button {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .col {
    &:first-child {
      flex: 0 1 33%;

      button {
        border-right: 0;
        border-bottom-left-radius: $border-radius;
      }
    }

    &:last-child {
      flex: 1 0 67%;

      button {
        border-bottom-right-radius: $border-radius;
      }
    }
  }
}

table {
  width: calc(100% - 4em);
  margin: 2em 1em;
  text-align: left;
  border-collapse: collapse;

  tr:not(:last-child) {
    td, th {
      border-bottom: 1px solid #eee;
    }
  }

  th {
    font-weight: normal;
    width: 12em;
    padding: 0 1em;
    height: 3em;
    border-right: 2px solid #eee;

    label {
      display: block;
    }
  }

  td {
    padding: 0 1em;

    &:last-child {
      text-align: right;
    }
  }

  input {
    display: inline-block;
    border: 0;
    background: transparent;
    font-size: inherit;
    font-family: inherit;
    width: 6em;
    height: 3em;

    &:focus {
      outline: none;
    }
  }
}
</style>
