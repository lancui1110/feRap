import teamsApi from '@/teams/api'
import * as types from '@/store/mutation-types'
import util from '@/common/util'

// initial state
const state = {
  all: [],    // 所有数据
  curNode: {}  // 当前树节点
}

// getters
const getters = {
  allTeams: state => state.all,
  curNode: state => state.curNode
}

// actions
const actions = {
  getAllTeams ({ commit }) {
    teamsApi.getTeamsTree(teams => {
      commit(types.GET_ALL_TEAMS, { teams })
    })
  },
  setCurNode ({ commit }, node) {
    console.log(`node...${node}`)
    commit(types.SET_CUR_NODE, { node })
  }
}

// mutations
const mutations = {
  [types.GET_ALL_TEAMS] (state, { teams }) {
    state.all = teams
  },
  [types.SET_CUR_NODE] (state, { node }) {
    state.curNode = node
  }
}

export default {
  state,
  getters: util.initRoot('teams', getters),
  actions: util.initRoot('teams', actions),
  mutations
}
