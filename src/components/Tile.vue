<template>
  <div v-if="tile.terrain == null" key="button"
       class="tile" :class="type" :style="style"
       @click="generate">
    <button>
      <plus-icon/>
    </button>
  </div>

  <div v-else key="terrain"
       class="tile" :class="type.concat(neighbours)" :style="style"
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

  methods: {
    generate() {
      this.$store.dispatch('randomize', this.tile)
    },

    reset() {
      this.$store.commit('tileTerrain', {...this.tile, terrain: null})
    },

    terrainAt(x, y) {
      return this.$store.getters.terrainAt(x, y)
    }
  },

  computed: {
    type() {
      const {terrain} = this.tile
      return terrain !== null ? ['terrain', terrain] : ['button']
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

    style() {
      const {x, y} = this.tile
      const bounds = this.$store.state.bounds

      return {
        fontSize: `${this.scale * 50}px`,
        width: `${this.scale * 100}px`,
        height: `${this.scale * 100}px`,
        gridRow: Math.abs(bounds.y.min) + y + 1,
        gridColumn: Math.abs(bounds.x.min) + x + 1,
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
  transition: width .5s ease-out, height .5s ease-out;

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
}
</style>
