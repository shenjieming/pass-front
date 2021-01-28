import { cloneObj } from '@/utils'

export function addRoutes() {
  return {
    twoWay: true,
    bind(el, binding, vnode) {
      const onClick = function() {
        // 路由
        const router = vnode.context.$router
        // 状态管理
        const store = vnode.context.$store
        // 参数
        const opts = Object.assign({}, binding.value)
        opts['query'] = el._v_query
        // 路由缓存信息
        const views = store.getters.visitedViews
        var visitedViewsItem = { 'fullPath': 'no' }
        for (const i in views) {
          if (views[i].name === opts.name) {
            visitedViewsItem = views[i]
          }
        }
        const guid = JSON.stringify(opts.query).match(/[a-zA-Z0-9]/g).join('')
        // 检查是否已打开
        if (((visitedViewsItem.fullPath).match(/[a-zA-Z0-9]/g).join('')).indexOf(guid) === -1) {
          // 获取路由信息并更新组件
          router.options.routes.forEach((list, index) => {
            if (list.children && list.children.length >= 0) {
              list.children.forEach((item, index) => {
                if (item.name === opts.name) {
                  if (list.children.some(v => v.name === opts.name + guid)) return false
                  const routerList = cloneObj(item)
                  routerList.name = opts.name + guid
                  routerList.component.name = opts.name + guid
                  delete routerList.component._Ctor
                  list.children.push(routerList)
                  return false
                }
              })
            }
          })
          router.addRoutes(router.options.routes)
          router.push({ name: opts.name + guid, query: opts.query })
        } else {
          router.push({ name: opts.name, query: opts.query })
        }
      }
      if (el._v_onClick) el.removeEventListener('click', el._v_onClick)
      el._v_onClick = onClick
      el.addEventListener('click', el._v_onClick)
    },
    update(el, binding) {
      if (binding.arg === 'query') {
        el._v_query = binding.value
      }
    },
    unbind(el) {
      el.removeEventListener('click', el._v_onClick)
      delete el._v_onClick
    }
  }
}
