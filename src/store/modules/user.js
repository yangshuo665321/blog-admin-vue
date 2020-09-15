import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from 'js-md5'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 用户登陆
  login({ commit }, userInfo) { // 前面参数commit是固定的，后面传入的是用户对象userInfo
    const { username, password } = userInfo // 解构表达式，从userInfo中获取到用户名和密码
    return new Promise((resolve, reject) => {
      // 调用登陆接口
      login({ username: username.trim(), password: md5(password) }).then(response => { // 成功后返回
        console.log(response)
        commit('SET_TOKEN', response.data.token) // 往vuex中设置token
        setToken(response.data.token) // 往Cookie里设置token
        resolve() // 登陆成功调用resolve方法
      }).catch(error => { // 如果上述报错，捕获异常
        reject(error) // 调用reject方法
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }

        const { name, header } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', header)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登陆
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 刷新token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

