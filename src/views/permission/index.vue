<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template slot="after">
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </PageTools>
      <el-table :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column
          align="center"
          label="标识"
          prop="code"
        ></el-table-column>
        <el-table-column
          align="center"
          label="描述"
          prop="description"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              size="mini"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" size="mini" @click="updatePermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增编辑的弹窗 -->
      <el-dialog
        :title="showText"
        :visible.sync="showAddEditDialog"
        @close="btnCancel"
      >
        <el-form
          ref="editForm"
          label-width="120px"
          :model="formData"
          :rules="rules"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input
              v-model="formData.description"
              style="width: 90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="0"
              inactive-value="1"
            ></el-switch>
          </el-form-item>
        </el-form>
        <template slot="footer">
          <el-row type="flex" justify="center">
            <el-row :span="8"
              ><el-button size="small" type="primary" @click="btnOk"
                >确定</el-button
              >
              <el-button size="small" @click="btnCancel"
                >取消</el-button
              ></el-row
            >
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  data () {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showAddEditDialog: false
    }
  },
  computed: {
    showText () {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created () { this.getPermissionList() },
  methods: {
    async getPermissionList () {
      this.list = tranListToTreeData(await getPermissionList(), '0')
      // console.log(this.list)
    },
    addPermission (type, pid) {
      this.showAddEditDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    btnCancel () {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      }
      this.$refs.editForm.resetFields()
      this.showAddEditDialog = false
    },
    btnOk () {
      this.$refs.editForm.validate().then(() => {
        if (this.formData.id) {
          // 如果formData中存在id，说明此时是处于编辑状态
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.getPermissionList()
        this.$message.success('操作成功')
        this.showAddEditDialog = false
      })
    },
    async delPermission (id) {
      await this.$confirm('确定删除吗？')
      await delPermission(id)
      this.getPermissionList()
      this.$message.success('删除成功')
    },
    async updatePermission (id) {
      this.formData = await getPermissionDetail(id)
      this.showAddEditDialog = true
    }
  }
}
</script>
<style scoped lang='scss'>
</style>
