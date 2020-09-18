<template>
  <div>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="标题">
        <el-input v-model="page.params.aboutTitle" placeholder="标题" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-button size="mini" type="primary" class="add-button" @click="openAddDialog">添加</el-button>

    <!-- 表格(:data="page.list" 表格绑定的数据为page.list) -->
    <el-table :data="page.list" border style="width: 100%" @sort-change="changeSort">
      <el-table-column prop="aboutId" show-overflow-tooltip label="编号" />
      <el-table-column prop="aboutTitle" show-overflow-tooltip label="标题" />
      <el-table-column prop="aboutRead" label="阅读数" sortable="custom" />
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" sortable="custom" />
      <el-table-column prop="enable" label="启用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1">启用</el-tag>
          <el-tag v-else type="info">未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.aboutId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 0" size="mini" type="success" @click="toEnable(scope.row.aboutId)">启用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 1" size="mini" type="warning" @click="toDisable(scope.row.aboutId)">弃用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.aboutId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加的弹框 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <about-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>

    <!-- 修改的弹框 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <about-update :about="about" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>
  </div>
</template>

<script>
// 引入api
import aboutApi from '@/api/about'
// 导入组件
import AboutAdd from './about-add'
import AboutUpdate from './about-update'

export default {
  components: {
    AboutAdd,
    AboutUpdate
  },
  data() {
    return {
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: '', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      about: {
        aboutId: '',
        aboutTitle: '',
        aboutContent: null,
        aboutRead: 0,
        createdTime: '',
        updateTime: '',
        enable: 0
      },
      updateDialog: false, // 控制修改弹窗显示
      addDialog: false // 控制添加弹窗显示
    }
  },
  // 创建时调用
  created() {
    this.getByPage()
  },
  methods: {
    getByPage() {
      aboutApi.getByPage(this.page).then(res => {
        this.page = res.data
      })
    },
    openAddDialog() {
      // 打开添加弹窗
      this.addDialog = true
    },
    // 排序方法
    changeSort(e) {
      if (e.order) { // 如果order存在
        this.page.sortColumn = e.prop
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      this.getByPage()
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      // 重新查询
      this.getByPage()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      // 重新查询
      this.getByPage()
    },
    // 启用
    toEnable(id) {
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        aboutApi.enableById(id).then((res) => {
        // 提示
          this.$message.success(res.msg)
          // 更新列表
          this.getByPage()
        })
      })
    },
    // 弃用
    toDisable(id) {
      this.$confirm('是否弃用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        aboutApi.disableById(id).then((res) => {
          // 提示
          this.$message.success(res.msg)
          // 更新列表
          this.getByPage()
        })
      })
    },
    // 修改
    handleEdit(id) {
      aboutApi.get(id).then((res) => {
        this.about = res.data
        this.updateDialog = true
      })
    },
    closeUpdateDialog() {
      // 关闭添加弹窗
      this.updateDialog = false
    },
    // 删除
    handleDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        aboutApi.deleteById(id).then((res) => {
          // 提示
          this.$message.success(res.msg)
          // 刷新列表
          this.getByPage()
        })
      })
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-bottom: 15px;
}
</style>
