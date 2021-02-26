<template>
    <div class="tile" :class="type" :style="style"
         @click="generate"
         v-if="terrain == null">
      +
    </div>

    <div class="tile" :class="type" :style="style"
         v-else>
      {{ terrain }}
    </div>
</template>

<script>
export default {
  name: "Tile",
  props: ['tile'],

  methods: {
    generate() {
      this.$store.commit('tile', {...this.tile, terrain: 'trees' })

      let above = this.$store.getters.tileAt(this.x, this.y - 1)
      if (!above) {
        this.$store.commit('addTile', {
          x: this.x,
          y: this.y - 1,
          terrain: null
        })
      }

      let below = this.$store.getters.tileAt(this.x, this.y + 1)
      if (!below) {
        this.$store.commit('addTile', {
          x: this.x,
          y: this.y + 1,
          terrain: null
        })
      }

      let left = this.$store.getters.tileAt(this.x - 1, this.y)
      if (!left) {
        this.$store.commit('addTile', {
          x: this.x - 1,
          y: this.y,
          terrain: null
        })
      }

      let right = this.$store.getters.tileAt(this.x + 1, this.y)
      if (!right) {
        this.$store.commit('addTile', {
          x: this.x + 1,
          y: this.y,
          terrain: null
        })
      }
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
      return this.terrain !== null ? 'terrain' : 'button'
    },

    style() {
      const center = `50% - ${this.scale / 2}px`

      return {
        top: `calc(${center} + ${this.y * this.scale}px)`,
        left: `calc(${center} + ${this.x * this.scale}px)`,
        height: this.scale + 'px',
        width: this.scale + 'px',
        lineHeight: this.scale + 'px',
      }
    },

    scale() {
      return this.$store.state.config.scale
    }
  }
}
</script>

<style scoped lang="scss">
.tile {
  border: 1px solid #ccc;
  background: white;
  position: absolute;
  cursor: pointer;
  transition: all .3s, font-size 0ms;

  &.button {
    text-align: center;
    font-size: 2em;
  }

  &.terrain {
    text-align: center;
    font-size: 12px;
  }
}
</style>
