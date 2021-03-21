import Vue from 'vue'
import Vuex from 'vuex'
import container from "@/store/modules/container";
import terrain from "@/store/modules/terrain";
import randomizer from "@/store/modules/randomizer";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        working: false,
        config: {
            scale: 1,
            zoomFocus: {
                row: 1,
                col: 1,
            },
            transition: false,
            editor: false,
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
        }
    },

    actions: {
        zoomIn({state, commit}, zoomFocus) {
            const scale = state.scales[state.scales.indexOf(state.config.scale) - 1]

            if (scale !== undefined) {
                commit('zoomFocus', zoomFocus)
                commit('scale', scale)
            }
        },

        zoomOut({state, commit}, zoomFocus) {
            const scale = state.scales[state.scales.indexOf(state.config.scale) + 1]

            if (scale !== undefined) {
                commit('zoomFocus', zoomFocus)
                commit('scale', scale)
            }
        },

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
            commit('scale', 1)
            commit('bounds', {
                x: {min: 0, max: 0},
                y: {min: 0, max: 0}
            })
            commit('zoomFocus', {
                row: 1, col: 1
            })
            commit('addTile', {
                x: 0, y: 0, terrain: null
            })
        }
    },

    mutations: {
        transition(state, transition) {
            state.config.transition = transition
        },

        editor(state, editor) {
            state.config.editor = editor
        },

        startWorking(state) {
            state.working = true
        },

        stopWorking(state) {
            state.working = false
        },

        scale(state, scale) {
            state.config.scale = parseFloat(scale)
        },

        zoomFocus(state, zoomFocus) {
            const {col, row} = state.config.zoomFocus
            if (zoomFocus.col === col && zoomFocus.row === row) return

            state.config.zoomFocus = zoomFocus
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
        container, terrain, randomizer
    }
})
