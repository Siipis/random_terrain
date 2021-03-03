<template>
  <div id="terrain" tabindex="1"
       @wheel.prevent="zoom" @keypress.prevent="pane">
    <transition-group name="terrain" tag="div" id="terrain--container" :style="containerStyle">
      <Tile v-for="tile in tiles" :tile="tile" :key="tile.key"/>
    </transition-group>
  </div>
</template>

<script>
import {debounce, throttle} from 'lodash'
import Tile from "@/components/Tile";
import {mapState} from "vuex";

export default {
  name: "Terrain",
  components: {Tile},

  data() {
    return {
      loader: null,
      scrollHeight: 0,
      scrollWidth: 0,
      scrollTop: 0,
      scrollBottom: 0,
      scrollLeft: 0,
      scrollRight: 0,
    }
  },

  created() {
    this.$store.commit('addTile', {x: 0, y: 0, terrain: null})
  },

  beforeUpdate() {
    this.saveScrollPosition()

    this.loader = debounce(() => {
      this.$store.commit('startWorking')
    }, 100)

    this.loader()
  },

  updated() {
    this.recoverScrollPosition()

    this.loader.cancel()
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
      throttle(() => {
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
      }, 200)()
    },

    saveScrollPosition() {
      this.scrollHeight = this.$el.scrollHeight
      this.scrollWidth = this.$el.scrollWidth
      this.scrollTop = this.$el.scrollTop
      this.scrollLeft = this.$el.scrollLeft
      this.scrollBottom = this.$el.scrollTop + this.$el.clientHeight
      this.scrollRight = this.$el.scrollLeft + this.$el.clientWidth
    },

    recoverScrollPosition() {
      let scrollTopBy = (this.$el.scrollHeight - this.scrollHeight) / 2
      let scrollLeftBy = (this.$el.scrollWidth - this.scrollWidth) / 2

      if (this.isScrolledTop()) {
        scrollTopBy = 0
      } else if (this.isScrolledBottom()) {
        scrollTopBy = this.$el.scrollHeight - this.scrollHeight
      }

      if (this.isScrolledLeft()) {
        scrollLeftBy = 0
      } else if (this.isScrolledRight()) {
        scrollLeftBy = this.$el.scrollWidth - this.scrollWidth
      }

      this.$el.scrollBy({
        top: scrollTopBy,
        left: scrollLeftBy
      })
    },

    isScrolledTop() {
      return this.scrollTop === 0
    },

    isScrolledBottom() {
      return this.scrollBottom === this.scrollHeight
    },

    isScrolledLeft() {
      return this.scrollLeft === 0
    },

    isScrolledRight() {
      return this.scrollRight === this.scrollWidth
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
