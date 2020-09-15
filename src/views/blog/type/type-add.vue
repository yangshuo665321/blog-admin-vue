<template>
  <div>
    <el-form ref="form" :model="type" label-width="80px">
      <el-form-item label="分类名">
        <el-input v-model="type.typeName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入api
import typeApi from '@/api/type'

export default {
  data() {
    return {
      type: {} // 是对象即可
    }
  },
  methods: {
    onSubmit() {
      typeApi.save(this.type).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDrawer')
        this.$emit('getTypeList')
      })
    }
  }
}
</script>
