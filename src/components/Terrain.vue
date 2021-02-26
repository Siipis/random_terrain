<template>
  <div id="terrain" tabindex="1"
       @wheel.prevent="zoom" @keypress.prevent="pane">
    <Tile v-for="(tile, index) in tiles" :tile="tile" :key="index"/>
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
    },

    pane($event) {
      const scrollBy = 100
      const scroll = {
        top: this.$el.scrollTop,
        left: this.$el.scrollLeft,
        behavior: 'smooth'
      }

      switch ($event.key) {
        case 'w':
          this.$el.scroll({...scroll, top: scroll.top - scrollBy})
          break
        case 's':
          this.$el.scroll({...scroll, top: scroll.top + scrollBy})
          break
        case 'd':
          this.$el.scroll({...scroll, left: scroll.left + scrollBy})
          break
        case 'a':
          this.$el.scroll({...scroll, left: scroll.left - scrollBy})
          break
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
