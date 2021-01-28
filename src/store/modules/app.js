const Cookies = require('vue-cookie')

const app = {
  state: {
    isEditPage: false, // 判断是否为编辑页面，如果是编辑页面hearder 组件为
    theme: Cookies.get('theme') || 'blue-theme',
    nav: '' // 判断导航状态
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme
      Cookies.set('theme', theme)
    },
    EDIT_PAGE: (state, isEdit) => {
      state.isEditPage = isEdit
    },
    SET_NAV: (state, nav) => {
      state.nav = nav
    }
  },
  actions: {
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    },
    editPage({ commit }, isEdit) {
      console.log(isEdit)
      commit('EDIT_PAGE', isEdit)
    },
    setNav({ commit }, nav) {
      commit('SET_NAV', nav)
    }
  }
}

export default app
