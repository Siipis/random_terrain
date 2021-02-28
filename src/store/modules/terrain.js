import {terrains} from "@/terrains";


export default {
    state: () => ({
        current: Object.keys(terrains)[0],
        list: terrains,
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
            for (let tiles = 1; tiles <= rootState.tiles.length; tiles++) {
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
    }
}
