export default {
    state: {
        clientHeight: 0,
        clientWidth: 0
    },

    mutations: {
        container(state, container) {
            state.clientWidth = container.clientWidth
            state.clientHeight = container.clientHeight
        }
    }
}
