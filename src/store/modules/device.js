const state = {
  drops: [],
  dropsCell: [],
  dropsValve: [],
  pump: [],
  fertilizer: [],
  soil: [],
  weather: [],
  spray: []
}

const mutations = {
  SET_DROPS: (state, drops) => {
    state.drops.push(drops)
  },

  SET_DROPS_CELL: (state, cell) => {
    state.dropsCell.push(cell)
  },

  SET_DROPS_VALVE: (state, valve) => {
    state.dropsValve.push(valve)
  },

  SET_PUMP: (state, pump) => {
    state.pump.push(pump)
  },

  SET_FERTILIZER: (state, fertilizer) => {
    state.fertilizer.push(fertilizer)
  },

  SET_SOIL: (state, soil) => {
    state.soil.push(soil)
  },

  SET_WEATHER: (state, weather) => {
    state.weather.push(weather)
  },
  SET_SPRAY: (state, spray) => {
    state.spray.push(spray)
  }

}

const actions = {
  setDrops({ commit }, drops) {
    commit('SET_DROPS', drops)
  },

  setDropsCell({ commit }, cell) {
    commit('SET_DROPS_CELL', cell)
  },

  setDropsValve({ commit }, valve) {
    commit('SET_DROPS_VALVE', valve)
  },

  setPump({ commit }, pump) {
    commit('SET_PUMP', pump)
  },

  setFertilizer({ commit }, fertilizer) {
    commit('SET_FERTILIZER', fertilizer)
  },

  setSoil({ commit }, soil) {
    commit('SET_SOIL', soil)
  },

  setWeather({ commit }, weather) {
    commit('SET_WEATHER', weather)
  },

  setSpray({ commit }, spray) {
    commit('SET_SPRAY', spray)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
