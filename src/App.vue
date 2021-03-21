<template>
  <div id="app">
    <transition name="fade">
      <div id="loading" v-if="working">
        <div class="icon">
          <loading-icon/>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <TerrainConfig v-if="$store.state.config.editor" />
    </transition>

    <Settings v-on:reset="animateFade"/>
    <Terrain ref="terrain" :styles="stylesToCSS"/>
  </div>
</template>

<script>
import 'vue-material-design-icons/styles.css';

import {mapGetters, mapState} from "vuex";
import {debounce} from "lodash";
import TWEEN from "@tweenjs/tween.js"
import Terrain from "@/components/Terrain";
import Settings from "@/components/Settings";
import LoadingIcon from 'vue-material-design-icons/Refresh'
import TerrainConfig from "@/components/TerrainConfig";

export default {
  name: 'App',
  components: {
    TerrainConfig,
    Settings,
    Terrain,
    LoadingIcon,
  },

  data() {
    return {
      showLoader: null,
      tweened: {
        length: 1,
        scale: 1,
        padding: {
          x: 0, y: 0,
        },
        scrollTop: 0,
        scrollLeft: 0,
      }
    }
  },

  created() {
    this.$store.subscribe(({type}) => {
      if (type === 'container') {
        this.tweened.padding = this.padding()
      }
    })

    this.$store.subscribeAction(({type}) => {
      if (type === 'reset') {
        this.tweened.padding = this.padding({width: 1, height: 1})
      }
    })
  },

  mounted() {
    this.tweened = this.getTweens()

    setTimeout(() => {
      this.$store.commit('transition', true)
    }, 100)
  },

  beforeUpdate() {
    this.showLoader = debounce(() => {
      this.$store.commit('startWorking')
    }, 100)

    this.showLoader()
  },

  updated() {
    if (this.$store.state.working) {
      this.$store.commit('stopWorking')
    }
    this.showLoader.cancel()
  },

  methods: {
    getTweens() {
      return {
        length: Object.keys(this.tiles).length,
        scale: this.scale,
        padding: this.padding(),
        ...this.getScrollTo()
      }
    },

    getScrollTo() {
      const padding = this.padding()
      const gridTop = (this.zoomFocus.row - 1) * this.scale * 100
      const gridLeft = (this.zoomFocus.col - 1) * this.scale * 100

      const scrollTop = gridTop + padding.y - this.container.clientHeight / 2
      const scrollLeft = gridLeft + padding.x - this.container.clientWidth / 2

      return {
        scrollTop: Math.max(0, scrollTop),
        scrollLeft: Math.max(0, scrollLeft)
      }
    },

    padding(size) {
      if (size === undefined) {
        size = this.size
      }
      const {width, height} = size
      const {clientWidth, clientHeight} = this.container

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

    animate() {
      if (!this.$store.state.config.transition) {
        this.tweened = {...this.getTweens()}
        return
      }

      const terrain = this.$refs.terrain.$el
      new TWEEN.Tween(this.tweened)
          .to(this.getTweens(), 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(({scrollTop: top, scrollLeft: left}) => {
            terrain.scroll({top, left})
          })
          .start()

      this.nextFrame()
    },

    animateFade() {
      const terrain = this.$refs.terrain.$el
      new TWEEN.Tween(this.tweened)
          .to({
            ...this.tweened,
            length: 0
          }, 1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(({scrollTop: top, scrollLeft: left, length}) => {
            terrain.scroll({top, left})

            Object.values(this.tiles).slice(Math.ceil(length)).forEach(tile => {
              this.$store.commit('tileTerrain', {...tile, terrain: 'blank'})
            })
          })
          .onComplete(() => {
            this.$store.dispatch('reset')
          })
          .start()

      this.nextFrame()
    },

    nextFrame() {
      if (TWEEN.update()) {
        requestAnimationFrame(this.nextFrame)
      }
    }
  },

  computed: {
    working() {
      return this.$store.state.working
    },

    stylesToCSS() {
      const {width: cols, height: rows} = this.size
      const {padding, scale} = this.tweened
      const tileSize = scale * 100

      return {
        container: {
          paddingTop: `${padding.y}px`,
          paddingLeft: `${padding.x}px`
        },
        grid: {
          fontSize: `${scale * 50}px`,
          gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
          gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`
        },
        zoomFocus: {
          gridRow: this.zoomFocus.row,
          gridColumn: this.zoomFocus.col
        }
      }
    },

    ...mapState({
      transition: state => state.config.transition,

      zoomFocus: state => state.config.zoomFocus,

      tiles: state => state.tiles,

      scale: state => state.config.scale,

      container: state => state.container,
    }),

    ...mapGetters([
      'size'
    ])
  },

  watch: {
    zoomFocus() {
      this.animate()
    },

    tiles(newTiles, oldTiles) {
      if (Object.keys(newTiles).length > Object.keys(oldTiles).length) {
        this.tweened.padding = this.padding()
        this.animate()
      }
    },

    scale() {
      this.animate()
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.transition {
  transition-duration: .5s;
  transition-timing-function: ease-in-out;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #222;
  background: #eee;
  width: 100%;
  height: 100%;
}

#loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(black, .2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 20vmin;
    line-height: 0;
    text-shadow: 2px 2px 5px rgba(black, .2);
    animation: rotation 2s infinite linear;

    & .material-design-icon > .material-design-icon__svg {
      bottom: 0;
    }
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
