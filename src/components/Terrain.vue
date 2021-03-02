<template>
  <div id="terrain" tabindex="1"
       @wheel.prevent="zoom" @keypress.prevent="pane">
    <transition-group name="terrain" tag="div" id="terrain--container" :style="containerStyle">
      <Tile v-for="(tile, key) in tiles" :tile="tile" :key="key"/>
    </transition-group>
  </div>
</template>

<script>
import Tile from "@/components/Tile";
import {mapState} from "vuex";

export default {
  name: "Terrain",
  components: {Tile},

  beforeUpdate() {
    this.$store.commit('startWorking')
  },

  updated() {
    this.$store.commit('stopWorking')
  },

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
    containerStyle() {
      const size = this.$store.getters.size
      const padding = 100
      const width = size.width * this.scale + padding
      const height = size.height * this.scale + padding

      return {
        width: `${width}px`,
        height: `${height}px`,
      }
    },

    ...mapState({
      tiles: state => state.tiles,

      scale: state => state.config.scale
    })
  }
}
</script>

<style scoped lang="scss">
#terrain {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

#terrain--container {
  margin: auto;
  position: relative;
  min-height: 100%;
  min-width: 100%;
}
</style>
