<template>
  <div>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="博客标题">
        <el-input v-model="page.params.blogTitle" placeholder="博客标题" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="page.params.typeId" placeholder="分类" clearable filterable>
          <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-button size="mini" type="primary" class="add-button" @click="openAddDialog">添加</el-button>

    <!-- 表格(:data="page.list" 表格绑定的数据为page.list) -->
    <el-table :data="page.list" border style="width: 100%" @sort-change="changeSort">
      <el-table-column prop="blogTitle" width="200" show-overflow-tooltip label="标题" />
      <el-table-column prop="typeName" label="分类" width="100" sortable="custom" />
      <el-table-column prop="blogImage" label="图片" width="160">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.blogImage"
            :preview-src-list="[scope.row.blogImage]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="blogGoods" label="点赞数" width="70" sortable="custom" />
      <el-table-column prop="blogRead" label="阅读数" width="70" sortable="custom" />
      <el-table-column prop="blogCollection" label="收藏数" width="70" sortable="custom" />
      <el-table-column prop="blogComment" label="评论数" width="70" sortable="custom" />
      <el-table-column prop="blogSource" label="文章来源" width="160" />
      <el-table-column prop="createdTime" label="创建时间" width="160" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" width="160" sortable="custom" />
      <el-table-column prop="blogRemark" label="备注" width="200" show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.blogId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.blogId)">删除</el-button>
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
      <blog-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>

    <!-- 修改的弹框 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <blog-update :blog="blog" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>
  </div>
</template>

<script>
// 引入api
import blogApi from '@/api/blog'
// 导入组件
import BlogAdd from './blog-add'
import BlogUpdate from './blog-update'

export default {
  components: {
    BlogAdd,
    BlogUpdate
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
      blog: {
        blogId: '',
        blogTitle: '',
        blogImage: null,
        blogContent: null,
        blogGoods: 0,
        blogRead: 0,
        blogCollection: 0,
        typeName: '',
        blogSource: null,
        blogRemark: null,
        blogComment: 0,
        createdTime: '',
        updateTime: ''
      },
      typeList: this.$store.getters.typeList, // 分类列表
      updateDialog: false, // 控制修改弹窗显示
      addDialog: false // 控制添加弹窗显示
    }
  },
  // 创建时调用
  created() {
    this.getByPage()
    // 延迟加载，解决typeList获取不到的问题
    setTimeout(() => {
      this.typeList = this.$store.getters.typeList
    }, 500)
  },
  methods: {
    getByPage() {
      blogApi.getByPage(this.page).then(res => {
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
    // 修改
    handleEdit(id) {
      blogApi.get(id).then((res) => {
        this.blog = res.data
        this.updateDialog = true
      })
    },
    closeUpdateDialog() {
      // 关闭添加弹窗
      this.updateDialog = false
    },
    // 删除
    handleDelete(id) {
      this.$confirm('是否删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        blogApi.deleteById(id).then((res) => {
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
