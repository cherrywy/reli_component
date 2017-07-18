const state = {
  debug: false,
  debugIgniter: 0
}

const getters = {
  debug: state => state.debug,
  debugIgniter: state => state.debugIgniter
}

const mutations = {
  igniteDebug (state, value) {
    if (state.debug === true || state.debugIgniter >= 7) return false
    state.debugIgniter++
    if (state.debugIgniter >= 7) state.debug = true
  },

  resetDebug (state, value) {
    state.debug = false
    state.debugIgniter = 0
  }
}

const actions = {
  igniteDebug (ctx, value) {
    ctx.commit('igniteDebug', value)
  },
  resetDebug (ctx, value) {
    ctx.commit('resetDebug', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
