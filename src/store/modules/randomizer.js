import List from "@/classes/List";
import {limits} from "@/terrains";

export default {
    getters: {
        weightsAt: (state, getters, rootState, rootGetters) => (x, y) => {
            const tile = rootGetters.tileAt(x, y)

            if (tile) {
                const terrain = rootState.terrain.current
                const terrainConfig = rootState.terrain.list[terrain]

                return terrainConfig[tile.terrain] || {}
            }

            return {}
        },

        tileWeights: (state, getters, rootState, rootGetters) => ({x, y}) => {
            const weights = new List()

            weights.add(getters.weightsAt(x, y - 1))
            weights.add(getters.weightsAt(x, y + 1))
            weights.add(getters.weightsAt(x + 1, y))
            weights.add(getters.weightsAt(x - 1, y))

            const lim = limits[rootState.terrain.current]

            return weights.filter((terrain) => {
                if (lim[terrain]) {
                    const start = {x, y}
                    const count = [
                        rootGetters.countTerrain(terrain, 'up', start),
                        rootGetters.countTerrain(terrain, 'down', start),
                        rootGetters.countTerrain(terrain, 'left', start),
                        rootGetters.countTerrain(terrain, 'right', start)
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

        randomize: (state, getters, rootState) => (tile) => {
            const weights = getters.tileWeights(tile)

            if (weights.length === 0) {
                const terrain = rootState.terrain.current
                return Object.keys(rootState.terrain.list[terrain])[0]
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

        expand({dispatch, rootState}, options) {
            rootState.tiles.forEach(tile => {
                if (rootState.tiles.length > 1 && options && options.random) {
                    const ratio = options.ratio || 0.3
                    const random = Math.random()

                    if (random < ratio) {
                        return
                    }
                }

                if (tile.terrain === null) {
                    dispatch('randomize', tile)
                }
            })

        },
    }
}
