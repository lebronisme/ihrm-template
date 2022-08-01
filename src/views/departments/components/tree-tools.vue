<template>
  <!-- 因为组织架构中，树形的操作内容较多重复，所以单独抽提成组件 -->
  <!-- 封装成组件之后，就不是插槽了，所以用不到 slot-scope="{ data }" -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="width: 100%; height: 40px"
  >
    <el-col
      ><span>{{ treeNode.name }}</span></el-col
    >
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 设置下拉菜单 -->
          <el-dropdown @command="operateDepts"
            ><span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-adpt')"
                >添加子部门</el-dropdown-item
              >
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              ></el-dropdown-menu
            >
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    // 操作节点调用的方法
    operateDepts (type) {
      if (type === 'add') {
        // 添加子部门的操作
        this.$emit('addDpats', this.treeNode)
      } else if (type === 'edit') {
        //  编辑部门的操作
        this.$emit('editDpats', this.treeNode)
      } else {
        //  删除操作
        // 防止函数嵌套，所以在第一个then里面返回一个promise
        this.$confirm('确定要删除部门吗').then(() => { return delDepartments(this.treeNode.id) }).then(() => {
          // 触发了删除数据事件之后，后台的数据已经发生了变化，这时候需要重新刷新页面
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
