import Vue from 'vue'
import axios from 'axios'
/**
 * Mocking client-server processing
 */
const _products = [{
  id: 1,
  type: 1,
  label: '一级 1',
  children: [{
    id: 4,
    type: 2,
    label: '二级 1-1',
    children: [{
      id: 9,
      type: 3,
      label: '三级 1-1-1'
    }, {
      id: 10,
      type: 3,
      label: '三级 1-1-2'
    }]
  }]
}, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 5,
    label: '二级 2-1'
  }, {
    id: 6,
    label: '二级 2-2'
  }]
}, {
  id: 3,
  label: '一级 3',
  children: [{
    id: 7,
    label: '二级 3-1'
  }, {
    id: 8,
    label: '二级 3-2'
  }]
}]

export default {
  getUrl (key) {
    var rootPath = 'http://localhost:8080/team/'
    return rootPath + {
      getTeamsTree: 'getTeamsTree.json',
      getTeamList: 'getTeamList.json'
    }[key]
  },
  getTeamsTree (cb) {
    console.log(this.getUrl('getTeamsTree'))
    console.log(`axios==${axios}`)
    axios.get(this.getUrl('getTeamsTree'), {})
    .then(function (response) {
      cb(response.data.data)
    })
    .catch(function (response) {
      console.log(`faild: ${response}`)
    })
  },
  getTeamList () {
    axios.get(this.getUrl('getTeamList'), {})
    .then(function (response) {
      return response.data.data
    })
    .catch(function (response) {
      console.log(`faild: ${response}`)
    })
  }
}
