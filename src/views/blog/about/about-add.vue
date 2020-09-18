<template>
  <div>
    <el-form ref="form" :model="about" label-width="80px" size="mini">
      <el-form-item label="标题">
        <el-input v-model="about.aboutTitle" />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce v-model="about.aboutContent" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入api
import aboutApi from '@/api/about'
// 引入Tinymce
import Tinymce from '@/components/Tinymce/index'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      about: {
        aboutId: '',
        aboutTitle: '',
        aboutImage: null,
        aboutContent: null,
        aboutRemark: null
      }
    }
  },
  methods: {
    onSubmit() {
      aboutApi.save(this.about).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.$emit('getByPage')
      })
    }
  }
}
</script>
