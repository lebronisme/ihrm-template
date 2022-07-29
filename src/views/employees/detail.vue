<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 登录账户设置 -->
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 个人详情 -->
          <el-tab-pane label="个人详情">
            <!-- 这里的compontent可以是任何组件，is动态绑定的是变量，而且可以实现切换 -->
            <!-- <el-button @click="UserComponent = 'el-button'">点击切换按钮</el-button> -->
            <!-- <el-button @click="UserComponent = 'UserInfo'">点击切换组件</el-button> -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <compontent :is="UserComponent"></compontent>

            <!-- <UserInfo></UserInfo> -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <compontent :is="JobComponent"></compontent>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  data () {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id,
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () { this.getUserDetailByIdFn() },
  methods: {
    async getUserDetailByIdFn () {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser () {
      // 点击修改的时候，进行手动校验
      this.$refs.userForm.validate().then(async () => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改成功')
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
