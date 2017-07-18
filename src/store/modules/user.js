const state = {
  user: null,
  token: null
}

const getters = {
  user: state => state.user,
  token: state => state.token
}

const mutations = {
  setUser (state, value) {
    state.user = value
    if (window.localStorage && typeof value === 'object' && value !== null) {
      window.localStorage.setItem('user', JSON.stringify(value))
    }
  },
  setToken (state, value) {
    state.token = value
    if (window.localStorage && typeof value === 'string') {
      window.localStorage.setItem('token', value)
    }
  },
  unauth (state, value) {
    state.token = null
    state.user = null
    if (window.localStorage) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
    }
  }
}

const actions = {
  setUser (ctx, value) {
    ctx.commit('setUser', value)
  },
  setToken (ctx, value) {
    ctx.commit('setToken', value)
  },
  unauth (ctx, value) {
    ctx.commit('unauth', value)
    this.$route.router.go('/login')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
