<template>
  <div id="terrain" tabindex="1" @wheel.prevent="zoom">
    <div id="terrain--container" ref="container" :style="containerStyle">
      <transition-group name="terrain" tag="div" id="tile--grid" :style="gridStyle">
        <Tile v-for="tile in tiles" :tile="tile" :key="tile.key"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import {debounce, delay} from 'lodash'
import Tile from "@/components/Tile";
import {mapState, mapGetters} from "vuex";

export default {
  name: "Terrain",
  components: {Tile},

  data() {
    return {
      showLoader: null,
      animate: false,

      container: {
        clientHeight: 0,
        clientWidth: 0
      }
    }
  },

  mounted() {
    this.syncWithContainer()
    delay(() => {
      this.animate = true
    }, 1000)
  },

  beforeUpdate() {
    this.showLoader = debounce(() => {
      this.$store.commit('startWorking')
    }, 100)

    this.showLoader()
  },

  updated() {
    this.animate = true

    this.showLoader.cancel()
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

    syncWithContainer() {
      const {clientHeight, clientWidth} = this.$el

      this.container = {
        clientHeight, clientWidth
      }
    },
  },

  computed: {
    containerStyle() {
      const tileSize = this.scale * 100
      const paddingY = Math.max((this.container.clientHeight - this.size.height * tileSize) / 2, 0)
      const paddingX = Math.max((this.container.clientWidth - this.size.width * tileSize) / 2, 0)

      return {
        padding: `${Math.floor(paddingY)}px ${Math.floor(paddingX)}px`,
        transition: this.animate ? 'padding .5s ease-out' : null,
      }
    },

    gridStyle() {
      return {
        width: `${this.scale * 100 * this.size.width}px`,
        height: `${this.scale * 100 * this.size.height}px`,
        transition: this.animate ? 'width .5s ease-out, height .5s ease-out' : null,
      }
    },

    ...mapState({
      tiles: state => state.tiles,

      scale: state => state.config.scale
    }),

    ...mapGetters([
      'size'
    ])
  },

  watch: {
    tiles() {
      this.syncWithContainer()
      this.animate = false
    }
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
  min-width: 100%;
  min-height: 100%;
}

#tile--grid {
  display: inline-grid;
  justify-items: center;
  align-items: center;
}
</style>
