<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleList">
      <el-checkbox v-for="item in allRoleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 底部的按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {

  filters: {},
  components: {},
  props: {
    userId: {
      type: String,
      default: null
    },
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allRoleList: [], // 存储所有的角色列表
      roleList: []// 存储当前员工的角色
    }
  },
  computed: {},
  watch: {},
  created () { this.getRoleList() },
  methods: {
    // 获取所有角色列表的函数
    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.allRoleList = rows
    },
    // 获取当前员工的角色函数
    async getUserDetailById (id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleList = roleIds
    },
    async btnOk () {
      await assignRoles({ id: this.userId, roleIds: this.roleList })
      this.$emit('update:showRoleDialog', false)
      this.$message.success('修改用户角色成功')
    },
    btnCancel () {
      this.roleList = []// 重置用户角色的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
