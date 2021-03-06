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

  mounted() {
    this.container.focus()
  },

  methods: {
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
      let timer = 0

      const focuser = setInterval(() => {
        timer++

        this.zoomFocus.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })

        if (timer > 500) {
          clearInterval(focuser)
        }
      }, 1)
    }
  },

  computed: {
    working() {
      return this.$store.state.working
    },

    container() {
      return this.$refs.terrain.$el
    },

    zoomFocus() {
      return this.$refs.terrain.$refs.zoomFocus
    }
  },

  watch: {
    '$store.config.zoomFocus'() {
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
