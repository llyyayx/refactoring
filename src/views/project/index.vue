<template>
  <div class="project-container">
    <!-- 项目表单go -->
    <el-form ref="form" :model="form" :rules="rules" label-width="auto" class="project-form">
      <el-form-item label="项目名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="项目位置：" prop="location">
        <el-input v-model="form.location" :disabled="true" />
      </el-form-item>
      <el-form-item label="修改位置：">
        <el-button type="primary" size="small" icon="el-icon-s-promotion" @click="dialogVisible = true">选取位置</el-button>
      </el-form-item>
      <el-form-item label="项目介绍：" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">更新项目信息</el-button>
      </el-form-item>
    </el-form>
    <!-- 项目表单end -->
    <!-- 对话框go -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="65%"
    >
      <Location ref="mark" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getGps">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框end -->
  </div>
</template>

<script>
import Location from '@/components/Location'
export default {
  components: {
    Location
  },
  data() {
    return {
      form: {
        name: '',
        location: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请设置经纬度', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入项目介绍', trigger: 'blur' },
          { min: 10, message: '最少10字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  methods: {
    getGps() {
      const gps = this.$refs.mark.getLocation()
      this.form.location = '经度：' + gps.lng + '，' + '纬度：' + gps.lat
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-container {
    padding: 20px;
    width: 100%;
    & .project-form {
      width: 800px;
    }
  }
</style>
