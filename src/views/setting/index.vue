<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <el-row>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                style="margin-bottom: 30px"
                @click="
                  isDialogShow = true;
                  title = '新增角色';
                "
                >新增角色</el-button
              >
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                type="index"
                label="序号"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="角色"
                width="240"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
                align="center"
              ></el-table-column>

              <el-table-column align="center" label="操作">
                <!-- //这里使用作用域插槽，然后 slot-scope可以获取到表格里面的数据 -->
                <template v-slot="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRoleFn(row.id)"
                    >删除</el-button
                  ></template
                >
              </el-table-column>
            </el-table>
            <!-- 页码信息 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="pageChange"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 点击编辑之后的弹层 -->
        <el-dialog :title="title" :visible="isDialogShow" @close="btnCancel">
          <el-form
            ref="roleForm"
            label-width="120px"
            :model="roleForm"
            :rules="rules"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.description"></el-input>
            </el-form-item>
          </el-form>
          <el-row slot="footer" type="flex" justify="center">
            <el-button>取 消</el-button>
            <el-button type="primary">确 定</el-button>
          </el-row>
        </el-dialog>
        <!-- 点击分配权限之后的弹层 -->
        <el-dialog title="分配权限" :visible="isQuanxianShow" @close="permBtnCancel">
          <el-tree
            ref="permTree"
            :data="permData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="selectCheck"
            :check-strictly="true"
          ></el-tree>
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" type="primary" @click="permBtnOk"
                >确定</el-button
              >
              <el-button size="small" @click="permBtnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetial, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  data () {
    return {
      title: '',
      roleId: null,
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      isDialogShow: false,
      isQuanxianShow: false,
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      list: [],
      page: {
        pagesize: 10,
        page: 1, // 当前的页码
        total: 0
      },
      formData: {
        // 用来存储公司的信息
      },
      roleForm: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created () {
    this.getRoleListFn()
    this.getCompanyInfoFn()
  },
  methods: {
    async permBtnOk () {
      // this.selectCheck = this.$refs.permTree.getCheckedNodes()
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.isQuanxianShow = false
    },
    permBtnCancel () {
      this.selectCheck = []
      this.isQuanxianShow = false
    },
    // 分配权限的函数
    async assignPerm (id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetial(id)
      // 记录下当前角色的id
      this.roleId = id
      this.selectCheck = permIds
      this.isQuanxianShow = true
    },
    async editRole (id) {
      this.title = '编辑角色'
      this.roleForm = await getRoleDetial(id)// 实现点击的时候，数据回写
      this.isDialogShow = true
    },
    async btnOk () {
      await this.$refs.roleForm.validate()// 先进行表单校验，校验通过后再向下执行
      if (this.roleForm.id) {
        // 如果roleForm中有id，说明是编辑功能
        await updateRole(this.roleForm)// 点击确定之后，将编辑好的数据发送给后台
        this.$message.success('编辑成功')
      } else {
        // 此时是新增功能
        await addRole(this.roleForm)
        this.$message.success('添加成功')
      }
      this.getRoleListFn()// 再获取最新的数据
      this.isDialogShow = false
      // 点击确定之后，会触发dialog的close事件，所以这里不需要做清除校验结果的事件
    },
    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.isDialogShow = false
    },
    async getRoleListFn () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    pageChange (currentPage) {
      // 当店家的页码改变时，把当前的页码拿回来，然后发起ajax请求，更新页面数据
      this.page.page = currentPage
      this.getRoleListFn()
    },
    async getCompanyInfoFn () {
      this.formData = await getCompanyInfo(this.companyId)
      // console.log(this.formData, '111')
    },
    async deleteRoleFn (id) {
      try {
        // console.log('111')
        await this.$confirm('确定删除此员工吗 ')
        await deleteRole(id)
        this.$message('删除成功')
        this.getRoleListFn()
      } catch (error) { console.log('error') }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
