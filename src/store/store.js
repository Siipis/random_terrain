import Vue from 'vue'
import Vuex from 'vuex'
import terrain from "@/store/modules/terrain";
import randomizer from "@/store/modules/randomizer";

Vue.use(Vuex)

const defaultTiles = {
    ['0:0']: {x: 0, y: 0, terrain: null}
}

export default new Vuex.Store({
    state: {
        working: false,
        config: {
            scale: 50,
        },
        scales: [25, 50, 75, 100, 150],
        tiles: {...defaultTiles},
        bounds: {
            x: {min: 0, max: 0},
            y: {min: 0, max: 0}
        }
    },

    getters: {
        tileAt: (state) => (x, y) => {
            const key = `${x}:${y}`
            return state.tiles[key]
        },

        size: state => {
            return {
                width: Math.abs(state.bounds.x.min) + Math.abs(state.bounds.x.max) + 1,
                height: Math.abs(state.bounds.y.min) + Math.abs(state.bounds.y.max) + 1,
            }
        },
    },

    actions: {
        extend({commit, getters}, {x, y}) {
            if (!getters.tileAt(x, y)) {
                commit('tile', {
                    x, y, terrain: null
                })
            }
        },
    },

    mutations: {
        startWorking(state) {
            state.working = true
        },

        stopWorking(state) {
            state.working = false
        },

        scale(state, scale) {
            state.config.scale = scale
        },

        zoomIn(state) {
            const scale = state.scales[state.scales.indexOf(state.config.scale) - 1]

            if (scale !== undefined) {
                state.config.scale = scale
            }
        },

        zoomOut(state) {
            const scale = state.scales[state.scales.indexOf(state.config.scale) + 1]

            if (scale !== undefined) {
                state.config.scale = scale
            }
        },

        tile(state, tile) {
            Object.freeze(tile)

            const key = `${tile.x}:${tile.y}`
            state.tiles = {...state.tiles, [key]: tile}
            state.bounds = {
                x: {
                    min: Math.min(state.bounds.x.min, tile.x),
                    max: Math.max(state.bounds.x.max, tile.x),
                },
                y: {
                    min: Math.min(state.bounds.y.min, tile.y),
                    max: Math.max(state.bounds.y.max, tile.y),
                }
            }
        },

        reset(state) {
            state.tiles = {...defaultTiles}
            state.bounds = {
                x: {min: 0, max: 0},
                y: {min: 0, max: 0}
            }
        }
    },

    modules: {
        terrain, randomizer
    }
})
