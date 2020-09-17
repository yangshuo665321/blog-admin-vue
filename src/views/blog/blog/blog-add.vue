<template>
  <div>
    <el-form ref="form" :model="blog" label-width="80px" size="mini">
      <el-form-item label="标题">
        <el-input v-model="blog.blogTitle" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="blog.blogType" clearable filterable placeholder="请选择">
          <el-option
            v-for="type in typeList"
            :key="type.typeId"
            :label="type.typeName"
            :value="type.typeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="blog.blogImage" />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce v-model="blog.blogContent" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="blog.blogRemark" type="textarea" />
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
import blogApi from '@/api/blog'
// 引入Tinymce
import Tinymce from '@/components/Tinymce/index'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      blog: {
        blogId: '',
        blogTitle: '',
        blogImage: null,
        blogContent: null,
        blogRemark: null
      },
      typeList: this.$store.getters.typeList
    }
  },
  methods: {
    onSubmit() {
      blogApi.save(this.blog).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.$emit('getByPage')
      })
    }
  }
}
</script>
