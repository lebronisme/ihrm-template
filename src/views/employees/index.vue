<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success" @click="exportData"
            >普通excel导出</el-button
          >
          <el-button size="small" type="info">复杂表头excel导出</el-button>
          <el-button size="small" type="danger" @click="$router.push('/import')"
            >导入excel</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工
          </el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="" align="center">
            <template v-slot="{ row }">
              <el-image
                style="width: 70px; height: 70px; border-radius: 20%"
                :src="row.staffPhoto"
                @click="showQrCode(row.staffPhoto)"
              >
                >
                <div slot="error" class="image-slot">
                  <!-- <i class="el-icon-picture-outline"></i> -->
                  <el-image
                    style="width: 50px; height: 50px"
                    src="http://ihrm.itheima.net/static/img/head.b6c3427d.jpg"
                    @click="showQrCodeError"
                  ></el-image>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <!-- formatter是表格自带的列属性，用来格式化数据的 -->
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 处理时间格式，使用插槽 -->
          <el-table-column label="入职时间" sortable="">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)"
                >角色</el-button
              >

              <el-button type="text" size="small" @click="delEmployeeFn(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center"
          ><el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.size"
            :current-page="page.page"
            @current-change="currentChange"
          >
          </el-pagination
        ></el-row>
      </el-card>
      <AddEmployee :show-dialog.sync="showDialog"></AddEmployee>
      <!-- 分配角色弹层 -->
      <AssignRole
        ref="assignRole"
        :show-role-dialog.sync="showRoleDialog"
        :user-id="userId"
      ></AssignRole>
    </div>
    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="qrcode"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 导入所有的枚举
import AddEmployee from './components/AddEmployee.vue'
import AssignRole from './components/AssignRole.vue'
import QrCode from 'qrcode'
export default {
  components: { AddEmployee, AssignRole },
  data () {
    return {
      fit: ['contain'],
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null,
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }
    }
  },
  created () { this.getEmployeeListFn() },
  methods: {
    // 将excel表格里面的时间格式转换成后台所需要的数据
    async delEmployeeFn (id) {
      try {
        await this.$confirm('确定要删除此员工吗？')
        await delEmployee(id)
        this.getEmployeeListFn()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getEmployeeListFn () {
      this.loading = true
      await getEmployeeList(this.page)
      // console.log(res)
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    currentChange (newPage) {
      this.page.page = newPage
      this.getEmployeeListFn()
    },
    // 表格中格式化数据的函数
    formatEmployment (row, column, cellValue, index) {
      const res = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return res ? res.value : '未知'
    },
    // 导出excel
    // 导出excel数据
    exportData () {
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'

        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson (headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
    showQrCode (url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.qrcode, url)
        })
      } else {
        this.$message.warning('该用户尚未上传头像')
        // console.log('11')
      }
    },
    showQrCodeError () {
      this.$message.warning('该用户尚未上传头像')
    },
    async editRole (userId) {
      // 父组件调用子组件的方法，把id传过去，并且先获取到数据之后，再弹窗，防止闪烁
      await this.$refs.assignRole.getUserDetailById(userId)
      this.showRoleDialog = true
      this.userId = userId
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
