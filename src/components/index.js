// 在这里注册全局组件
// 这是传统的写法
// import Vue from 'vue'
// import PageTools from './PageTools/index.vue'
// Vue.component(PageTools.name, PageTools)

// 这是新的写法
import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
export default {
  install (Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
    Vue.use(Print)
  }
}
