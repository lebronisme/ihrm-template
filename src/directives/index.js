// import Vue from 'vue'
// // 自定义指令  layout里面的navbar组件，里面的管理员头像，如果没有，就会使用这个备用头像   对应的时间为v-imgerror
// Vue.directive('imgerror', {
//   // 数据更新的时候就执行
//   update (el, binding) {
//     // el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })

// 进行组件封装，方便后续的自定义指令设置
export const imgerror = {
  // 数据更新的时候就执行
  update (el, binding) {
    // el.src = binding.value
    el.onerror = () => {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}

