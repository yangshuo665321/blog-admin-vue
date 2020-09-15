<template>
  <div>
    <el-button type="primary" class="add-button" @click="openAddDrawer">添加</el-button>

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
          <el-button
            size="mini"
            @click="handleEdit(scope.row.typeId)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.typeId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加抽屉 -->
    <el-drawer
      title="添加"
      :visible.sync="drawer"
    >
      <type-add @getTypeList="getTypeList" @closeAddDrawer="closeAddDrawer" />
    </el-drawer>

    <!-- 编辑的弹框 -->
    <el-dialog
      title="修改"
      :visible.sync="updateDialog"
    >
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
      typeApi.listBack().then(res => { // 调用listBack()接口
        console.log(res.data)
        this.typeList = res.data
      })
    },
    // 修改
    handleEdit(id) {
      typeApi.get(id).then(res => {
        this.type = res.data
        this.updateDialog = true
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        typeApi.deleteById(id).then(res => {
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
  margin-bottom: 15px
}
</style>
