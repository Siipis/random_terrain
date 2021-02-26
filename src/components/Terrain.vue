<template>
  <div id="terrain" @wheel.prevent="zoom">
    <Tile v-for="(tile, index) in tiles" :tile="tile" :key="index" />
  </div>
</template>

<script>
import Tile from "@/components/Tile";

export default {
  name: "Terrain",
  components: {Tile},

  methods: {
    zoom($event) {
      if ($event.deltaY > 0) {
        this.$store.commit('zoomIn')
      } else {
        this.$store.commit('zoomOut')
      }
    }
  },

  computed: {
    tiles() {
      return this.$store.state.tiles
    }
  }
}
</script>

<style scoped lang="scss">
#terrain {
  width: 100%;
  height: 100%;
  overflow: auto;

  position: relative;
}
</style>
