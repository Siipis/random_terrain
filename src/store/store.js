import Vue from 'vue'
import Vuex from 'vuex'
import terrain from "@/store/modules/terrain";
import randomizer from "@/store/modules/randomizer";

Vue.use(Vuex)

const defaultTiles = [
    {x: 0, y: 0, terrain: null}
]

export default new Vuex.Store({
    state: {
        config: {
            scale: 50,
        },
        scales: [25, 50, 75, 100, 150],
        tiles: [...defaultTiles]
    },

    getters: {
        tileAt: (state) => (x, y) => {
            return state.tiles.find(tile => tile.x === x && tile.y === y)
        },
    },

    actions: {
        extend({commit, getters}, {x, y}) {
            if (!getters.tileAt(x, y)) {
                commit('addTile', {
                    x, y, terrain: null
                })
            }
        },
    },

    mutations: {
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
            state.tiles = state.tiles.map(t => {
                if (t.x === tile.x && t.y === tile.y) {
                    return tile
                }
                return t
            })
        },

        addTile(state, tile) {
            state.tiles = state.tiles.concat(tile)
        },

        reset(state) {
            state.tiles = [...defaultTiles]
        }
    },

    modules: {
        terrain, randomizer
    }
})
