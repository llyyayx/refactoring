const state = {
  map: {}
}

const mutations = {
  SET_MAP: (state, map) => {
    state.map = map
  }
}

const actions = {
  setMap({ commit }, map) {
    commit('SET_MAP', map)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
