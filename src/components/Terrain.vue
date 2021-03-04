<template>
  <div id="terrain" tabindex="1"
       @wheel.prevent="zoom" @keypress.prevent="pane">
    <div id="terrain--container" ref="container" :style="containerStyle">
      <transition-group name="terrain" tag="div" id="tile--grid" :style="gridStyle">
        <Tile v-for="tile in tiles" :tile="tile" :key="tile.key"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import {debounce, throttle, delay} from 'lodash'
import Tile from "@/components/Tile";
import {mapState, mapGetters} from "vuex";

export default {
  name: "Terrain",
  components: {Tile},

  data() {
    return {
      showLoader: null,
      animate: false,
      position: {}
    }
  },

  mounted() {
    this.resetScrollPosition()
    this.saveScrollPosition()

    delay(() => {
      this.animate = true
    }, 1000)
  },

  beforeUpdate() {
    this.saveScrollPosition()

    this.showLoader = debounce(() => {
      this.$store.commit('startWorking')
    }, 100)

    this.showLoader()
  },

  updated() {
    this.recoverScrollPosition()
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
      const {scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft} = this.$el

      this.position = {
        scrollHeight, scrollWidth,
        clientHeight, clientWidth,

        isScrolledTop: scrollTop === 0,
        isScrolledBottom: scrollTop + clientHeight === scrollHeight,
        isScrolledLeft: scrollLeft === 0,
        isScrolledRight: scrollLeft + clientWidth === scrollWidth,
      }
    },

    recoverScrollPosition() {
      const {scrollHeight, scrollWidth} = this.$el

      let scrollTopBy = 0
      if (this.position.isScrolledTop) {
        scrollTopBy = -scrollHeight
      } else if (this.position.isScrolledBottom) {
        scrollTopBy = scrollHeight
      } else {
        scrollTopBy = (scrollHeight - this.position.scrollHeight) / 2
      }

      let scrollLeftBy = 0
      if (this.position.isScrolledLeft) {
        scrollLeftBy = -scrollWidth
      } else if (this.position.isScrolledRight) {
        scrollLeftBy = scrollWidth
      } else {
        scrollLeftBy = (scrollWidth - this.position.scrollWidth) / 2
      }

      this.$el.scrollBy({
        top: scrollTopBy,
        left: scrollLeftBy
      })
    },

    resetScrollPosition() {
      const {scrollHeight, scrollWidth, clientHeight, clientWidth} = this.$el

      this.$el.scroll({
        top: (scrollHeight - clientHeight) / 2,
        left: (scrollWidth - clientWidth) / 2
      })
    }
  },

  computed: {
    containerStyle() {
      const tileSize = this.scale * 100
      const paddingY = Math.max((this.position.clientHeight - this.size.height * tileSize) / 2, 0)
      const paddingX = Math.max((this.position.clientWidth - this.size.width * tileSize) / 2, 0)

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
