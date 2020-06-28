const state = {
  sprayShow: true,
  dropShow: true,
  toolShow: false,
  pgPlanShow: false
}

const mutations = {
  SET_SPRAYSHOW: (state, show) => {
    state.sprayShow = show
  },
  SET_TOOLSHOW: (state, show) => {
    state.toolShow = show
  },
  SET_PGPLANSHOW: (state, show) => {
    state.pgPlanShow = show
  },
  SET_DROPSHOW: (state, show) => {
    state.dropShow = show
  }
}

const actions = {
  sprayShow: ({ commit }, show) => {
    commit('SET_SPRAYSHOW', show)
  },
  toolShow: ({ commit }, show) => {
    commit('SET_TOOLSHOW', show)
  },
  pgPlanShow: ({ commit }, show) => {
    commit('SET_PGPLANSHOW', show)
  },
  dropShow: ({ commit }, show) => {
    commit('SET_DROPSHOW', show)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
