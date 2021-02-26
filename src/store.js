import Vue from 'vue'
import Vuex from 'vuex'
import forest from "@/terrains/forest";

Vue.use(Vuex)

const defaultTiles = [
    {x: 0, y: 0, terrain: null}
]

export default new Vuex.Store({
    state: {
        config: {
            terrain: 'forest',
            scale: 50,
        },
        scales: [50, 75, 100, 150],
        terrains: {
            forest
        },
        tiles: [...defaultTiles]
    },

    getters: {
        tileAt: (state) => (x, y) => {
            return state.tiles.find(tile => tile.x === x && tile.y === y)
        },

        weightsAt: (state, getters) => (x, y) => {
            const tile = getters.tileAt(x, y)

            if (tile) {
                const terrain = state.config.terrain
                const terrainConfig = state.terrains[terrain]

                return terrainConfig[tile.terrain] || {}
            }

            return {}
        },

        tileWeights: (state, getters) => (tile) => {
            const weights = new List()

            weights.add(getters.weightsAt(tile.x, tile.y - 1))
            weights.add(getters.weightsAt(tile.x, tile.y + 1))
            weights.add(getters.weightsAt(tile.x + 1, tile.y))
            weights.add(getters.weightsAt(tile.x - 1, tile.y))

            return weights
        },

        randomize: (state, getters) => (tile) => {
            const weights = getters.tileWeights(tile)

            if (weights.length === 0) {
                const terrain = state.config.terrain
                return Object.keys(state.terrains[terrain])[0]
            }

            const sum = weights.values().reduce((total, weight) => total + weight)
            let random = Math.floor(Math.random() * sum + 1)

            return weights.keys().find(terrain => {
                if (random <= weights[terrain]) {
                    return true
                }
                random -= weights[terrain]
                return false
            })
        },
    },

    actions: {
        randomize({commit, getters, dispatch}, tile) {
            commit('tile', {...tile, terrain: getters.randomize(tile)})

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

        expand({dispatch, state}) {
            state.tiles.forEach(tile => {
                if (tile.terrain === null) {
                    dispatch('randomize', tile)
                }
            })
        },
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
        },

        reset(state) {
            state.tiles = [...defaultTiles]
        }
    }
})

class List extends Object {
    add(value) {
        Object.keys(value).forEach(key => {
            if (this[key] === undefined) {
                this[key] = value[key]
            } else {
                this[key] += value[key]
            }
        })
    }

    values() {
        return Object.values(this)
    }

    keys() {
        return Object.keys(this)
    }

    get length() {
        return this.keys().length
    }
}
