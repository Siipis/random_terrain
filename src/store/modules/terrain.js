import {terrains} from "@/terrains";
import {cloneDeep} from 'lodash';

export default {
    state: () => ({
        current: Object.keys(terrains)[0],
        list: cloneDeep(terrains),
    }),

    getters: {
        terrainAt: (state, getters, rootState, rootGetters) => (x, y) => {
            const tile = rootGetters.tileAt(x, y)
            if (tile) {
                return tile.terrain
            }
            return null
        },

        countTerrain: (state, getters, rootState, rootGetters) => (terrain, direction, {x, y}) => {
            if (terrain === null) {
                return 0
            }

            let count = 0
            const maxSize = Math.max(rootGetters.size.width, rootGetters.size.height)
            for (let tiles = 1; tiles <= maxSize; tiles++) {
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

                if (rootGetters.terrainAt(x, y) !== terrain) {
                    break
                }

                count++
            }
            return count
        },
    },

    mutations: {
        terrain(state, terrain) {
            state.current = terrain
        },

        setTerrainValue(state, {active, type, value}) {
            if (active === undefined || type === undefined || value === undefined) {
                throw TypeError()
            }
            state.list[state.current][active][type] = value
        },

        resetTerrainValue(state, {active, type}) {
            if (active === undefined || type === undefined) {
                throw TypeError()
            }
            state.list[state.current][active][type] = terrains[state.current][active][type]
        },

        resetTerrainValues(state) {
            state.list[state.current] = cloneDeep(terrains[state.current])
        }
    }
}
