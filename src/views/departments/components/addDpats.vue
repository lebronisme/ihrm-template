<template>
  <!-- 放置弹层的组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 弹层里面的表单 -->
    <el-form ref="depts" label-width="120px" :model="formData" :rules="rules">
      <!-- 部门名称 -->
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <!-- 下拉菜单 -->
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getSmployeesSimpleFn"
          ><el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹层里面的按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 这里引入获取部门信息的api，是因为创建部门时，有可能别人也创建了部门，从而导致因为获取数据时差的问题，出现创建了已经存在了的部门
import { getDepartments, addDepartments, getOneDepartDetail, updateDepartments } from '@/api/departments'
import { getSmployeesSimple } from '@/api/employees'
export default {
  filters: {
  },
  components: {},
  props: {
    treeNode: {
      type: Object,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 设置一个部门名称的校验函数
    const checkNameRepeat = async (rule, value, callback) => {
      let isRepeat = false
      // 对返回回来的部门信息进行结构，只需要数组
      const { depts } = await getDepartments()
      if (this.formData.id) {
        // 存在就说明是编辑模式
        // 数组中，筛选出除了自己之外的同级别部门，然后查找有没有名称一样的部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 检测当前输入的名称，与当前操作节点的子级是否有重名,some返回的是布尔值
      isRepeat ? callback(new Error(`当前输入的${value}已在子级目录中存在`)) : callback()
    }
    // 设置一个部门编码的校验函数
    const checkCodeRepeat = async (rule, value, callback) => {
      let isRepeat = false
      const { depts } = await getDepartments()
      if (this.formData.id) {
        // 存在就说明是编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 检测当前输入的部门编码，与当前操作节点的子级是否有重名
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`当前输入的${value}已在子级目录中存在`)) : callback()
    }
    return {
      peoples: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, { validator: checkNameRepeat, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '增加子部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    // 获取简单的员工信息
    async getSmployeesSimpleFn () {
      this.peoples = await getSmployeesSimple()
    },
    // 点击确定的时候触发，并且手动校验表单
    btnOk () {
      this.$refs.depts.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 如果校验成功，且场景为新增部门，就把数据返回给后台服务器,且将当前操作节点的id值传给后台，作为子节点的pid值
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 然后渲染页面，并且让弹窗关闭
          this.$emit('addDpats')
          // 点击确定的时候，会触发dialog组件自带的close事件，所以这一行不需要
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 点击取消的时候触发，并且手动清除表单内容
    btnCancel () {
      // resetFields方法只能清空表单中的数据，并不能清空其他的数据，所以为了实现添加与编辑部门的功能之间的切换，需要手动吧formData的数据改变
      this.formData = {
        name: '', code: '', manager: '', introduce: ''
      }
      this.$refs.depts.resetFields()
      this.$emit('update:showDialog', false)
    },
    // 点击编辑之后，获取到的当前节点的信息
    async getOneDepartDetailFn (id) {
      // 这里不用props里面的treeNode，是因为props传值还是异步的
      this.formData = await getOneDepartDetail(id)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
