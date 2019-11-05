const state = {
  name: 'toha'
}

const mutations = {
  set_name (state, payload) {
    state.name = payload
  }
}

const actions = {
  SET_NAME ({ commit }, payload) {
    commit('set_name', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
