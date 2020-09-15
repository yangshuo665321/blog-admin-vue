<template>
  <div>
    <el-button size="mini" type="primary" class="add-button" @click="openAddDrawer">添加</el-button>

    <!-- 表格 -->
    <el-table :data="typeList" border style="width: 100%">
      <el-table-column prop="typeId" label="编号" />
      <el-table-column prop="typeName" label="分类" />
      <el-table-column prop="typeBlogCount" label="博客数" />
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
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.typeId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 0" size="mini" type="success" @click="toEnable(scope.row.typeId)">启用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 1" size="mini" type="warning" @click="toDisable(scope.row.typeId)">弃用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.typeId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加抽屉 -->
    <el-drawer title="添加" :visible.sync="drawer">
      <type-add @getTypeList="getTypeList" @closeAddDrawer="closeAddDrawer" />
    </el-drawer>

    <!-- 编辑的弹框 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <type-update :type="type" @getTypeList="getTypeList" @closeUpdateDialog="closeUpdateDialog" />
    </el-dialog>
  </div>
</template>

<script>
// 引入api
import typeApi from '@/api/type'
// 引入添加组件
import TypeAdd from './type-add'
// 引入编辑组件
import TypeUpdate from './type-update'

export default {
  // 注册组件
  components: {
    TypeAdd,
    TypeUpdate
  },
  data() {
    return {
      type: {}, // 分类对象
      updateDialog: false, // 控制 添加抽屉 展示
      drawer: false, // 控制 编辑的弹框 展示
      typeList: [] // 类型数组
    }
  },
  // 页面进入的时候进行查询
  created() {
    this.getTypeList()
  },
  methods: {
    // 查询类型列表
    getTypeList() {
      typeApi.listBack().then((res) => {
        // 调用listBack()接口
        console.log(res.data)
        this.typeList = res.data
      })
    },
    // 修改
    handleEdit(id) {
      typeApi.get(id).then((res) => {
        this.type = res.data
        this.updateDialog = true
      })
    },
    // 启用
    toEnable(id) {
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        typeApi.enableById(id).then((res) => {
        // 提示
          this.$message.success(res.msg)
          // 更新列表
          this.getTypeList()
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
        typeApi.disableById(id).then((res) => {
        // 提示
          this.$message.success(res.msg)
          // 更新列表
          this.getTypeList()
        })
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        typeApi.deleteById(id).then((res) => {
          // 提示
          this.$message.success(res.msg)
          // 刷新列表
          this.getTypeList()
        })
      })
    },
    // 打开添加抽屉
    openAddDrawer() {
      this.drawer = true
    },
    // 关闭添加抽屉
    closeAddDrawer() {
      this.drawer = false
    },
    // 关闭添加弹窗
    closeUpdateDialog() {
      this.updateDialog = false
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-bottom: 15px;
}
</style>
