<template>
  <div id="terrain" tabindex="1" @wheel.prevent="handleZoom" @keypress.prevent="pane">
    <div id="terrain--container" ref="container" :style="styles.container">
      <div class="grid zoom--grid" :style="styles.grid">
        <div id="zoom-focus" ref="zoomFocus" :style="styles.zoomFocus"></div>
      </div>

      <transition-group name="grid" tag="div" ref="grid"
                        class="grid" :style="styles.grid">
        <Tile v-for="tile in tiles" :tile="tile" :key="tile.key" class="tile"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import {throttle} from 'lodash'
import Tile from "@/components/Tile";
import {mapState, mapGetters} from "vuex";

export default {
  name: "Terrain",
  props: ['styles'],
  components: {Tile},

  data() {
    return {
      unsubscribe: {},
    }
  },

  created() {
    this.unsubscribe.action = this.$store.subscribeAction(({type}) => {
      if (type === 'expand') {
        this.handleExpand()
      }
    })
  },

  destroyed() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe()
    }
  },

  mounted() {
    this.$refs.container.focus()

    this.$refs.zoomFocus.scrollIntoView({
      block: 'center',
      inline: 'center',
    })

    this.syncContainer()
    window.addEventListener('resize', this.syncContainer, {passive: true})
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

    handleExpand() {
      const {width, height} = this.size
      const {scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft} = document.getElementById('terrain--container')

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
    },

    syncContainer() {
      const {clientHeight, clientWidth} = this.$el

      this.$store.commit('container', {
        clientHeight, clientWidth
      })
    },

    pane($event) {
      throttle(() => {
        const scrollBy = 100

        let scrollTopBy = 0
        let scrollLeftBy = 0

        switch ($event.key) {
          case 'w':
            scrollTopBy = -scrollBy
            break
          case 'a':
            scrollLeftBy = -scrollBy
            break
          case 's':
            scrollTopBy = scrollBy
            break
          case 'd':
            scrollLeftBy = scrollBy
            break
        }

        this.$el.scrollBy({
          top: scrollTopBy,
          left: scrollLeftBy,
          behavior: 'smooth'
        })
      }, 200)()
    },
  },

  computed: {
    ...mapState({
      scale: state => state.config.scale,

      transition: state => state.config.transition,

      tiles: state => state.tiles,
    }),

    ...mapGetters([
      'size'
    ])
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
}

.grid {
  display: inline-grid;
  justify-items: center;
  align-items: center;
  transition-property: opacity, font-size, grid-template-colums, grid-template-rows;

  &-leave {
    opacity: 0;
    width: 0;
    height: 0;
  }

  &-leave-active {
    transition: all .2s ease-out;
  }
}

.zoom--grid {
  position: absolute;
  z-index: 5;
  pointer-events: none;

  & #zoom-focus {
    width: 100%;
    height: 100%;
  }
}
</style>
