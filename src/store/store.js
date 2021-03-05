import Vue from 'vue'
import Vuex from 'vuex'
import terrain from "@/store/modules/terrain";
import randomizer from "@/store/modules/randomizer";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        working: false,
        config: {
            scale: 1,
        },
        scales: [0.25, 0.5, 0.75, 1, 1.5, 2, 3],
        tiles: {
            '0:0': {key: '0:0', x: 0, y: 0, terrain: null}
        },
        bounds: {
            x: {min: 0, max: 0},
            y: {min: 0, max: 0}
        }
    },

    getters: {
        tileAt: (state) => (x, y) => {
            return state.tiles[`${x}:${y}`]
        },

        size: state => {
            return {
                width: Math.abs(state.bounds.x.min) + Math.abs(state.bounds.x.max) + 1,
                height: Math.abs(state.bounds.y.min) + Math.abs(state.bounds.y.max) + 1,
            }
        },
    },

    actions: {
        tile({commit, dispatch}, tile) {
            commit('tileTerrain', tile)
            dispatch('extend', {...tile, y: tile.y + 1})
            dispatch('extend', {...tile, y: tile.y - 1})
            dispatch('extend', {...tile, x: tile.x + 1})
            dispatch('extend', {...tile, x: tile.x - 1})
        },

        extend({commit, getters}, {x, y}) {
            if (!getters.tileAt(x, y)) {
                commit('addTile', {
                    x, y, terrain: null
                })
            }
        },

        reset({commit}) {
            commit('tiles', {})
            commit('bounds', {
                x: {min: 0, max: 0},
                y: {min: 0, max: 0}
            })
            commit('addTile', {
                x: 0, y: 0, terrain: null
            })
        }
    },

    mutations: {
        startWorking(state) {
            state.working = true
        },

        stopWorking(state) {
            state.working = false
        },

        scale(state, scale) {
            state.config.scale = parseFloat(scale)
        },

        bounds(state, bounds) {
            state.bounds = bounds
        },

        boundWith(state, tile) {
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

        tiles(state, tiles) {
            state.tiles = tiles
        },

        addTile(state, tile) {
            tile.key = `${tile.x}:${tile.y}`
            state.tiles = {...state.tiles, [tile.key]: tile}
            this.commit('boundWith', tile)
        },

        tileTerrain(state, tile) {
            if (state.tiles[tile.key] !== undefined) {
                state.tiles[tile.key] = tile
            }
        },
    },

    modules: {
        terrain, randomizer
    }
})
