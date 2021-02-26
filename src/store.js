import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        config: {
            terrain: 'Forest',
            scale: 50,
        },
        scales: [50, 75, 100, 150],
        terrains: [
            'Forest'
        ],
        tiles: [
            {x: 0, y: 0, terrain: null}
        ]
    },

    getters: {
        tileAt: (state) => (x, y) => {
            return state.tiles.find(tile => tile.x === x && tile.y === y)
        }
    },

    mutations: {
        terrain(state, terrain) {
            state.config.terrain = terrain
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
            state.tiles = state.tiles.map(t => {
                if (t.x === tile.x && t.y === tile.y) {
                    return tile
                }
                return t
            })
        },

        addTile(state, tile) {
            state.tiles = state.tiles.concat(tile)
        }
    }
})
