<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的头部 -->
      <el-card class="tree-card">
        <!-- 顶部的标题 -->
        <treeTools
          :tree-node="company"
          :is-root="true"
          @addDpats="addDpats"
        ></treeTools>
        <!-- 下面的组织架构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="false"
        >
          <!-- 传入内容，插槽内容，会循环多次，有多少节点，就循环多少次 -->
          <!-- 作用域插槽，slot-scope="{ data }，{}为结构，接受传递给插槽的数据，data为每个节点的数据对象 -->
          <treeTools
            slot-scope="{ data }"
            :tree-node="data"
            :is-root="false"
            @delDepts="getDepartmentsFn"
            @addDpats="addDpats"
            @editDpats="editDpats"
          ></treeTools>
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门的弹窗 -->
    <addDpats
      ref="addDapt"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDpats="getDepartmentsFn"
    ></addDpats>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import treeTools from './components/tree-tools.vue'
import addDpats from './components/addDpats.vue'
export default {
  components: { treeTools, addDpats },
  data () {
    return {
      showDialog: false,
      // 当前操作的节点
      node: null,
      company: {},
      defaultProps: {
        label: 'name'
      },
      departs: []
    }
  },
  created () { this.getDepartmentsFn() },
  methods: {
    async getDepartmentsFn () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      console.log(res)
    },
    // 点击添加子部门之后，触发的函数。这里的node，是tree-tools组件里面传出来的treeNode
    addDpats (node) {
      this.showDialog = true
      this.node = node
    },
    editDpats (node) {
      this.showDialog = true
      this.node = node
      // ref不仅可以将当前的组件转化为dom的根标签，也可以调用组件里面的实例方法
      this.$refs.addDapt.getOneDepartDetailFn(node.id)
    }
  }
}
</script>

<style scoped lang='scss'>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
