<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <ImageUpload></ImageUpload>
  </div>
</template>

<script>
// const obj = {
//   created () {
//     alert(1)
//   }
// }
import { mapGetters } from 'vuex'
// import PageTools from '@/components/PageTools'
export default {
  // mixins: [obj],
  data () {
    return {

    }
  },
  // name: 'Dashboard',
  // components: { PageTools },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
