<template>
  <div>
    <el-button size="mini" type="primary" class="add-button" @click="openAddDialog">添加</el-button>

    <!-- 表格(:data="page.list" 表格绑定的数据为page.list) -->
    <el-table :data="page.list" border style="width: 100%">
      <el-table-column prop="blogTitle" width="200" show-overflow-tooltip label="标题" />
      <el-table-column prop="typeName" label="分类" width="100" />
      <el-table-column prop="blogImage" label="图片" width="160" />
      <el-table-column prop="blogGoods" label="点赞数" width="70" />
      <el-table-column prop="blogRead" label="阅读数" width="70" />
      <el-table-column prop="blogCollection" label="收藏数" width="70" />
      <el-table-column prop="blogComment" label="评论数" width="70" />
      <el-table-column prop="blogSource" label="文章来源" width="160" />
      <el-table-column prop="createdTime" label="创建时间" width="160" />
      <el-table-column prop="updateTime" label="更新时间" width="160" />
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
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.typeId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.typeId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加的弹框 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <blog-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
  </div>
</template>

<script>
// 引入api
import blogApi from '@/api/blog'
// 导入组件
import BlogAdd from './blog-add'

export default {
  components: {
    BlogAdd
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
      addDialog: false // 控制添加弹窗显示
    }
  },
  // 创建时调用
  created() {
    this.getByPage()
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
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-bottom: 15px;
}
</style>
