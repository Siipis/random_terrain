<template>
  <div v-if="tile.terrain == null" key="button"
       :class="classes" :style="style"
       @click="generate">
    <button>
      <plus-icon/>
    </button>
  </div>

  <div v-else key="terrain"
       class="transition" :class="classes" :style="style"
       @click.left.prevent="generate"
       @click.right.prevent="reset">
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus';

export default {
  name: "Tile",
  props: ['tile'],

  components: {
    PlusIcon
  },

  data() {
    return {
      unsubscribe: null
    }
  },

  methods: {
    generate() {
      this.$store.dispatch('randomize', this.tile)

      if (this.tile.terrain === null) {
        this.$store.commit('zoomFocus', {
          row: this.row,
          col: this.col
        })
      }
    },

    reset() {
      this.$store.commit('tileTerrain', {...this.tile, terrain: null})

      this.$store.commit('zoomFocus', {
        row: this.row,
        col: this.col
      })
    },

    terrainAt(x, y) {
      return this.$store.getters.terrainAt(x, y)
    }
  },

  computed: {
    classes() {
      const classes = []

      if (this.$store.state.config.fade) {
        classes.push('fade')
      }

      if (this.tile.terrain === null) {
        return classes.concat('button')
      }

      classes.push('terrain', this.tile.terrain)
      classes.push(...this.neighbours)

      return classes
    },

    neighbours() {
      const {x, y} = this.tile
      let neighbours = []

      const terrainTop = this.terrainAt(x, y - 1)
      if (terrainTop) {
        neighbours.push(terrainTop + '--top')
      }

      const terrainBottom = this.terrainAt(x, y + 1)
      if (terrainBottom) {
        neighbours.push(terrainBottom + '--bottom')
      }

      const terrainLeft = this.terrainAt(x - 1, y)
      if (terrainLeft) {
        neighbours.push(terrainLeft + '--left')
      }
      const terrainRight = this.terrainAt(x + 1, y)
      if (terrainRight) {
        neighbours.push(terrainRight + '--right')
      }

      return neighbours
    },

    row() {
      const bounds = this.$store.state.bounds
      return Math.abs(bounds.y.min) + this.tile.y + 1
    },

    col() {
      const bounds = this.$store.state.bounds
      return Math.abs(bounds.x.min) + this.tile.x + 1
    },

    style() {
      return {
        fontSize: `${this.scale * 50}px`,
        gridRow: this.row,
        gridColumn: this.col,
      }
    },

    scale() {
      return this.$store.state.config.scale
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";
@import "../assets/scss/terrains";

.tile {
  cursor: pointer;
  transition-property: width, height;

  &.button {
    button {
      @include size(0.65);
      font-size: 0.65em;
      background: white;
      border: 1px solid #cccccc;
      border-radius: 50%;
      box-shadow: 0 0 1rem rgba(black, .05);
      transition: all 0.3s;
      padding: 0;
    }

    &:hover {
      button {
        transform: scale(1.3);
      }
    }
  }

  &.terrain {
    $border: 1px solid #666;
    border-top: $border;
    border-left: $border;

    &:not([class*="--right"]) {
      border-right: $border;
    }

    &:not([class*="--bottom"]) {
      border-bottom: $border;
    }
  }

  &.fade {
    opacity: 0;
    transition-property: opacity;
    transition-duration: 1s;
    transition-timing-function: ease-out;

    &:before, &:after, & * {
      opacity: 0;
      transition: all 1s ease-out;
    }
  }
}
</style>
