/**
 *  Sets relative weights for each type of terrain.
 *  When randomizing the terrain for a new tile, the
 *  weights of each neighbour are summed together.
 *
 * @type Object
 */
export const forest = {
    trees: {
        trees: 50,
        denseTrees: 10,
        trail: 2,
        rock: 2,
        shallowWater: 2,
    },

    denseTrees: {
        trees: 10,
        denseTrees: 30,
    },

    shallowWater: {
        shallowWater: 50,
        trees: 3,
        deepWater: 1,
    },

    deepWater: {
        deepWater: 100,
        trees: 10,
    },

    trail: {
        trail: 50,
        trees: 2,
    }
}

/**
 * Limits take two values, which are represented as an array [A, B].
 *
 * Limit A restricts the number of tiles on a single axis,
 * while limit B is used to restrict both axes at once.
 *
 * @type Object
 */
export const forestLimit = {
    shallowWater: [1, null],
    trail: [1, null],
    // denseTrees: [3, 3],
}
