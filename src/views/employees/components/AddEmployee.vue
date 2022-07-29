<template>
  <div>
    <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form
        ref="addEmployee"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="formData.username"
            style="width: 50%"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 50%"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 50%"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="formData.formOfEmployment"
            style="width: 50%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 50%"
            placeholder="请输入工号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input
            v-model="formData.departmentName"
            style="width: 50%"
            placeholder="请选择部门"
            @focus="getTreeData"
          />
          <!-- 插入树形结构 -->
          <el-tree
            v-if="isTreeShow"
            v-loading="loading"
            :data="treeDate"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="selectNode"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            style="width: 50%"
            placeholder="请选择日期"
          />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils/index'// 引入数组转树形结构的函数
import { getDepartments } from '@/api/departments'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  filters: {},
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EmployeeEnum,
      treeDate: [],
      isTreeShow: false,
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async getTreeData () {
      this.loading = true
      this.isTreeShow = true
      const { depts } = await getDepartments()
      // 将获取回来的部门数据转换成树形数据
      this.treeDate = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode (node) {
      // console.log(arguments)
      this.formData.departmentName = node.name
      this.isTreeShow = false
    },
    async btnOK () {
      try {
        await this.$refs.addEmployee.validate()// 校验完成之后，再往下执行
        await addEmployee(this.formData)// 校验完成之后，提交数据给后台，然后刷新数据，并关闭弹层
        this.$parent.getEmployeeListFn && this.$parent.getEmployeeListFn()
        this.$parent.showDialog = false// $parent可以获取到父组件ed所有实例，不常用的原因在于，只能获取当前组件的父组件的实例，而当前组件的位置我们无法控制，
        this.$message.success('添加成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel () {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style scoped lang='scss'>
</style>
