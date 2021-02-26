<template>
  <div class="tile" :class="type" :style="style"
       @click="generate"
       v-if="terrain == null">
    +
  </div>

  <div class="tile" :class="type" :style="style"
       @click.right.prevent="reset"
       v-else>
    &nbsp;
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
      this.$store.commit('tile', {...this.tile, terrain: null})
    },
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
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/terrains";

.tile {
  border: 1px solid #ccc;
  position: absolute;
  cursor: pointer;
  transition: all .3s, font-size 0ms;

  &.button {
    text-align: center;
    font-size: 2em;
    background: white;
  }
}
</style>
