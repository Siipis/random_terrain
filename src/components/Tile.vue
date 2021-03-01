<template>
  <div class="tile" :class="type" :style="style"
       @click="generate"
       v-if="terrain == null">
  </div>

  <div class="tile" :class="type.concat(neighbours)" :style="style"
       @click.right="reset"
       v-else>
  </div>
</template>

<script>
export default {
  name: "Tile",
  props: ['tile'],

  methods: {
    generate() {
      this.$store.dispatch('randomize', this.$props.tile)
    },

    reset() {
      // this.$store.commit('tile', {...this.tile, terrain: null})
    },

    terrainAt(x, y) {
      return this.$store.getters.terrainAt(x, y)
    }
  },

  computed: {
    x() {
      return this.$props.tile.x
    },

    y() {
      return this.$props.tile.y
    },

    terrain() {
      return this.$props.tile.terrain
    },

    type() {
      return this.terrain !== null ? ['terrain', this.terrain] : ['button']
    },

    neighbours() {
      let neighbours = []

      const terrainTop = this.terrainAt(this.x, this.y - 1)
      if (terrainTop) {
        neighbours.push(terrainTop + '--top')
      }

      const terrainBottom = this.terrainAt(this.x, this.y + 1)
      if (terrainBottom) {
        neighbours.push(terrainBottom + '--bottom')
      }

      const terrainLeft = this.terrainAt(this.x - 1, this.y)
      if (terrainLeft) {
        neighbours.push(terrainLeft + '--left')
      }
      const terrainRight = this.terrainAt(this.x + 1, this.y)
      if (terrainRight) {
        neighbours.push(terrainRight + '--right')
      }

      return neighbours
    },

    style() {
      const center = `50% - ${this.scale / 2}px`

      return {
        fontSize: `${this.scale / 2}px`,
        lineHeight: `${this.scale / 2}px`,

        top: `calc(${center} + ${this.y * this.scale}px)`,
        left: `calc(${center} + ${this.x * this.scale}px)`,
        height: this.scale + 'px',
        width: this.scale + 'px',
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
  position: absolute;
  cursor: pointer;
  transition: all .3s, font-size 0ms;

  &.button {
    &:before {
      @include size(0.5);
      content: '+';
      text-align: center;
      background: white;
      border: 1px solid #cccccc;
      border-radius: 50%;
      box-shadow: 0 0 1rem rgba(black, .05);
      transition: all 0.3s;
    }

    &:hover {
      &:before {
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
