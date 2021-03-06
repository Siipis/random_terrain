<template>
  <div id="app" @keypress.prevent="pane">
    <transition name="fade">
      <div id="loading" v-if="working">
        <div class="icon">
          <loading-icon/>
        </div>
      </div>
    </transition>

    <Settings/>
    <Terrain ref="terrain" v-on:center="centerZoomFocus"/>
  </div>
</template>

<script>
import 'vue-material-design-icons/styles.css';

import {throttle} from "lodash";
import Terrain from "@/components/Terrain";
import Settings from "@/components/Settings";
import LoadingIcon from 'vue-material-design-icons/Refresh'

export default {
  name: 'App',
  components: {
    Settings,
    Terrain,
    LoadingIcon,
  },

  data() {
    return {
      animateInterval: false
    }
  },

  mounted() {
    this.container.focus()

    this.grid.addEventListener('transitionstart', this.handleTransitionStart)
  },

  methods: {
    handleTransitionStart(event) {
      if (event.target === this.grid) {
        this.animateZoomFocus()
      }
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

        this.container.scrollBy({
          top: scrollTopBy,
          left: scrollLeftBy,
          behavior: 'smooth'
        })
      }, 200)()
    },

    centerZoomFocus() {
      clearInterval(this.animateInterval)

      this.zoomFocus.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    },

    animateZoomFocus() {
      if (!this.animateInterval) {
        this.animateInterval = setInterval(this.animateZoomFocus, 1)
      }

      const {scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft} = this.container
      const {top, left, width, height} = this.zoomFocus.getBoundingClientRect()

      const isTop = scrollTop - top < 0
      const isBottom = scrollTop + clientHeight === scrollHeight
      const isCenteredY = top === Math.floor((clientHeight - height) / 2)

      const isLeft = scrollLeft - left >= 0
      const isRight = scrollLeft + clientWidth === scrollWidth
      const isCenteredX = left === Math.floor((clientWidth - width) / 2)

      if ((isTop || isBottom || isCenteredY) && (isLeft || isRight || isCenteredX)) {
        clearInterval(this.animateInterval)
      } else {
        this.zoomFocus.scrollIntoView({
          block: 'center',
          inline: 'center',
        })
      }
    }
  },

  computed: {
    working() {
      return this.$store.state.working
    },

    container() {
      return this.$refs.terrain.$el
    },

    grid() {
      return this.$refs.terrain.$refs.grid.$el
    },

    zoomFocus() {
      return this.$refs.terrain.$refs.zoomFocus
    }
  },

  watch: {
    '$store.state.tiles'() {
      this.animateZoomFocus()
    },

    '$store.state.config.zoomFocus'() {
      this.centerZoomFocus()
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
  transition-timing-function: ease-out;
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
