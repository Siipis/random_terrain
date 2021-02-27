import Vue from 'vue'
import Vuex from 'vuex'
import List from "@/classes/List";
import {terrains, limits} from '@/terrains/index'

Vue.use(Vuex)

const defaultTiles = [
    {x: 0, y: 0, terrain: null}
]

export default new Vuex.Store({
    state: {
        config: {
            terrain: Object.keys(terrains)[0],
            scale: 50,
        },
        scales: [25, 50, 75, 100, 150],
        tiles: [...defaultTiles],
        terrains
    },

    getters: {
        tileAt: (state) => (x, y) => {
            return state.tiles.find(tile => tile.x === x && tile.y === y)
        },

        terrainAt: (state, getters) => (x, y) => {
            const tile = getters.tileAt(x, y)
            if (tile) {
                return tile.terrain
            }
            return null
        },

        countTerrain: (state, getters) => (terrain, direction, {x, y}) => {
            if (terrain === null) {
                return 0
            }

            let count = 0
            for (let tiles = 1; tiles <= state.tiles.length; tiles++) {
                switch (direction) {
                    case 'up':
                        y--
                        break
                    case 'down':
                        y++
                        break
                    case 'left':
                        x--
                        break
                    case 'right':
                        x++
                        break
                    default:
                        throw new TypeError()
                }

                if (getters.terrainAt(x, y) !== terrain) {
                    break
                }

                count++
            }
            return count
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

        tileWeights: (state, getters) => ({x, y}) => {
            const weights = new List()

            weights.add(getters.weightsAt(x, y - 1))
            weights.add(getters.weightsAt(x, y + 1))
            weights.add(getters.weightsAt(x + 1, y))
            weights.add(getters.weightsAt(x - 1, y))

            const lim = limits[state.config.terrain]

            return weights.filter((terrain) => {
                if (lim[terrain]) {
                    const start = {x, y}
                    const count = [
                        getters.countTerrain(terrain, 'up', start),
                        getters.countTerrain(terrain, 'down', start),
                        getters.countTerrain(terrain, 'left', start),
                        getters.countTerrain(terrain, 'right', start)
                    ].sort().reverse()

                    const limitA = lim[terrain][0]
                    const limitB = lim[terrain][1]

                    if (count[0] >= limitA) {
                        if (limitB !== null) {
                            return count[0] < limitB
                        }

                        return count[1] < limitA
                    }
                }
                return true
            })
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
