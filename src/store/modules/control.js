const state = {
  // deviceControl-喷灌面板显隐
  sprayShow: true,
  // deviceControl-滴灌面板显隐
  dropShow: true,
  // deviceControl-传感器面板显隐
  sensorShow: false,
  // deviceControl-工具箱显隐
  toolShow: false,
  // deviceControl-喷灌计划显隐
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
  },
  SET_SENSORSHOW: (state, show) => {
    state.sensorShow = show
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
  },
  sensorShow: ({ commit }, show) => {
    commit('SET_SENSORSHOW', show)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
