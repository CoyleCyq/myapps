import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  levelOptions: [{ label: '普通', value: '1' }, { label: '稀有', value: '2' }, { label: '非凡', value: '3' }, { label: '闪耀', value: '4' }],
  attrOptions: [{ label: '典雅', value: '1' }, { label: '清新', value: '2' }, { label: '甜美', value: '3' }, { label: '性感', value: '4' }, { label: '帅气', value: '5' }],
  typeOptions: ['发型', '连衣裙', '外套', '上衣', '下装', '袜子', '鞋子', '发饰', '帽子', '耳饰', '项链', '项圈', '手饰', '手套', '手持物', '特殊', '底妆', '睫毛', '眉妆', '美瞳', '唇妆']
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
