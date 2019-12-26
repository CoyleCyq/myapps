// import contentTpl from './contentTpl/index.vue' //页面布局组件
import search from './search/index' // 搜索组件
import operations from './operations/index.vue' // 操作按钮组件
// import pagination from './pagination/index.vue' //分页组件

const install = function(Vue) {
  // Vue.component(contentTpl.name, contentTpl)
  Vue.component(search.name, search)
  Vue.component(operations.name, operations)
  // Vue.component(pagination.name, pagination)
}

export default install
