const state = {
  // deviceControl-喷灌面板显隐
  sprayShow: false,
  // deviceControl-滴灌面板显隐
  dropShow: false,
  // deviceControl-传感器面板显隐
  sensorShow: false,
  // deviceControl-工具箱显隐
  toolShow: false,
  // deviceControl-喷灌计划显隐
  pgPlanShow: false,
  // deviceControl-分区显隐
  partitionShow: false,
  // deviceControl-数据面板显隐
  dataPanelShow: false,
  // deviceControl-施肥机面板显隐
  ferShow: false,
  // deviceControl-水泵面板显隐
  pumpShow: false,
  // quick组件设置-数据面板采集对象(采集设备)
  dataPanelObj: {},
  // quick组件设置-喷灌机设备对象(控制设备)
  sprayDevice: {},
  // quick组件设置-滴灌对象(控制设备)
  dropDevice: {},
  // quick组件设置-施肥机对象(控制设备)
  ferDevice: {},
  // quick组件设置-水泵对象(控制设备)
  pumpDevice: {}
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
  SET_PARTITIONSHOW: (state, show) => {
    state.partitionShow = show
  },
  SET_DROPSHOW: (state, show) => {
    state.dropShow = show
  },
  SET_SENSORSHOW: (state, show) => {
    state.sensorShow = show
  },
  SET_FERSHOW: (state, show) => {
    state.ferShow = show
  },
  SET_DATAPANELSHOW: (state, show) => {
    state.dataPanelShow = show
  },
  SET_PUMPSHOW: (state, show) => {
    state.pumpShow = show
  },
  SET_DATAPANELOBJ: (state, device) => {
    state.dataPanelObj = device
  },
  SET_SPRAYDEVICE: (state, device) => {
    state.sprayDevice = device
  },
  SET_DROPDEVICE: (state, device) => {
    state.dropDevice = device
  },
  SET_FERDEVICE: (state, device) => {
    state.ferDevice = device
  },
  SET_PUMPDEVICE: (state, device) => {
    state.pumpDevice = device
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
  partitionShow: ({ commit }, show) => {
    commit('SET_PARTITIONSHOW', show)
  },
  dropShow: ({ commit }, show) => {
    commit('SET_DROPSHOW', show)
  },
  sensorShow: ({ commit }, show) => {
    commit('SET_SENSORSHOW', show)
  },
  ferShow: ({ commit }, show) => {
    commit('SET_FERSHOW', show)
  },
  pumpShow: ({ commit }, show) => {
    commit('SET_PUMPSHOW', show)
  },
  dataPanelShow: ({ commit }, show) => {
    commit('SET_DATAPANELSHOW', show)
  },
  dataPanelObj: ({ commit }, device) => {
    commit('SET_DATAPANELOBJ', device)
  },
  sprayDevice: ({ commit }, device) => {
    commit('SET_SPRAYDEVICE', device)
  },
  dropDevice: ({ commit }, device) => {
    commit('SET_DROPDEVICE', device)
  },
  ferDevice: ({ commit }, device) => {
    commit('SET_FERDEVICE', device)
  },
  pumpDevice: ({ commit }, device) => {
    commit('SET_PUMPDEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
