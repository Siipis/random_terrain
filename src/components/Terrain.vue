<template>
  <div id="terrain" tabindex="1" @wheel.prevent="handleZoom">
    <div id="terrain--container" ref="container"
         :class="animationClasses" :style="containerStyle">

      <div class="grid zoom--grid" :class="animationClasses" :style="gridStyle">
        <div id="zoom-focus" ref="zoomFocus" :class="animationClasses" :style="focusStyle"></div>
      </div>

      <transition-group name="grid" tag="div" ref="grid"
                        class="grid" :class="animationClasses" :style="gridStyle">
        <Tile v-for="tile in tiles" :tile="tile" :key="tile.key" class="tile"/>
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
      unsubscribe: null,
      showLoader: null,
      transition: false,

      position: {
        clientHeight: 0,
        clientWidth: 0
      }
    }
  },

  created() {
    this.unsubscribe = this.$store.subscribeAction(({type}) => {
      if (type === 'expand') {
        const {width, height} = this.size
        const {scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft} = this.$el

        const isScrolledTop = scrollTop === 0
        const isScrolledBottom = scrollTop + clientHeight === scrollHeight
        const isScrolledLeft = scrollLeft === 0
        const isScrolledRight = scrollLeft + clientWidth === scrollWidth

        let row = Math.ceil(height / 2) + 1
        if (isScrolledTop && !isScrolledBottom) {
          row = 1
        } else if (isScrolledBottom && !isScrolledTop) {
          row = height
        }

        let col = Math.ceil(width / 2) + 1
        if (isScrolledLeft && !isScrolledRight) {
          col = 1
        } else if (isScrolledRight && !isScrolledLeft) {
          col = width
        }

        this.$store.commit('zoomFocus', {col, row})
      }
    })
  },

  destroyed() {
    this.unsubscribe()
  },

  mounted() {
    this.$emit('center')
    this.storePosition()
    delay(() => {
      this.transition = true
    }, 1000)
  },

  beforeUpdate() {
    this.showLoader = debounce(() => {
      this.$store.commit('startWorking')
    }, 100)

    this.showLoader()
  },

  updated() {
    this.transition = true

    if (this.$store.state.working) {
      this.$store.commit('stopWorking')
    }
    this.showLoader.cancel()
  },

  methods: {
    handleZoom($event) {
      const {width, height} = this.size
      const {top, bottom, left, right} = this.$refs.grid.$el.getBoundingClientRect()
      const {deltaY, clientX, clientY} = $event
      const tileSize = this.scale * 100

      let col = 1
      if (clientX > right) {
        col = width
      } else if (clientX > left) {
        col = Math.floor((clientX - left) / tileSize) + 1
      }

      let row = 1
      if (clientY > bottom) {
        row = height
      } else if (clientY > top) {
        row = Math.floor((clientY - top) / tileSize) + 1
      }

      this.$store.dispatch(
          deltaY > 0 ? 'zoomIn' : 'zoomOut',
          {row, col}
      )
    },

    storePosition() {
      const {clientHeight, clientWidth} = this.$el

      this.position = {
        clientHeight, clientWidth
      }
    },
  },

  computed: {
    animationClasses() {
      return {
        transition: this.transition,
        fade: this.$store.state.config.fade
      }
    },

    padding() {
      const {width, height} = this.size
      const {clientWidth, clientHeight} = this.position

      const singleTile = height === 1 && width === 1
      const tileSize = this.scale * 100 + (singleTile ? 4 : 0)

      return {
        x: Math.floor(
            Math.max((clientWidth - width * tileSize) / 2, 0)
        ),
        y: Math.floor(
            Math.max((clientHeight - height * tileSize) / 2, 0)
        ),
      }
    },

    containerStyle() {
      if (this.$store.state.config.fade) return {}

      return {
        padding: `${this.padding.y}px ${this.padding.x}px`
      }
    },

    focusStyle() {
      const {row, col} = this.$store.state.config.zoomFocus

      return {
        width: `${this.scale * 100}px`,
        height: `${this.scale * 100}px`,
        gridRow: row,
        gridColumn: col,
        border: '2px solid red',
        zIndex: '10'
      }
    },

    gridStyle() {
      const {width, height} = this.size
      const tileSize = this.scale * 100

      return {
        gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
        gridTemplateColumns: `repeat(${width}, ${tileSize}px)`
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
      this.storePosition()
      this.transition = false
    },

    scale() {
      this.$emit('center')
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
  position: relative;
  transition-property: width, height, padding;
}

.grid {
  display: inline-grid;
  justify-items: stretch;
  align-items: stretch;
  transition-property: width, height, grid-template-rows, grid-template-columns;

  &-enter {
    opacity: 0;
  }

  &-enter-active {
    transition: opacity .5s ease-out;
  }

  &.fade {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition-property: width, height, grid-template-rows, grid-template-columns, top, left;
  }
}

.zoom--grid {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}
</style>
