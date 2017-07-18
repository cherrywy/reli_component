const state = {
  callingAPI: false,
  searching: ''
}

const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  }
}

export default {
  state,
  mutations
}
