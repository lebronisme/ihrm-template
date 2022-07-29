<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template slot="after">
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </PageTools>
      <el-table>
        <el-table-column label="标识"></el-table-column>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="描述"></el-table-column>
        <el-table-column label="操作">
          <el-button type="text" size="mini">添加</el-button>
          <el-button type="text" size="mini">添加编辑</el-button>
          <el-button type="text" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='scss'>
</style>
