/**
 *  Sets relative weights for each type of terrain.
 *  When randomizing the terrain for a new tile, the
 *  weights of each neighbour are summed together.
 *
 * @type Object
 */
export const forest = {
    trees: {
        trees: 30,
        denseTrees: 10,
        stream: 1,
    },

    denseTrees: {
        trees: 5,
        denseTrees: 20,
    },

    stream: {
        stream: 50,
        trees: 3,
    },
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
    stream: [1, null],
    // denseTrees: [3, 3],
}
