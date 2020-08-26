<template>
  <div v-loading="loading" class="project-container">
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
      <el-form-item label="项目介绍：" prop="js">
        <el-input v-model="form.js" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update">更新项目信息</el-button>
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
import { getDevice } from '@/api/deviceControl'
import { updateMsg } from '@/api/project'
export default {
  name: 'Project',
  components: {
    Location
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        location: '', // iput框展示的经纬度
        lat: '', // 纬度
        lng: '', // 经度
        id: '', // id,上传时需要
        js: '' // 项目介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请设置经纬度', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  mounted() {
    const _this = this
    this.loading = true
    getDevice(1).then(function(e) {
      const data = e[0]
      _this.form.name = data.name
      _this.form.location = '经度：' + data.lng + '，' + '纬度：' + data.lat
      _this.form.lat = data.lat
      _this.form.lng = data.lng
      _this.form.id = data.id
      // eslint-disable-next-line no-eval
      _this.form.js = eval(data.descri)
      _this.loading = false
    }).catch((e) => {
      _this.loading = false
      _this.$alert('获取信息失败', '提示', {
        showClose: false,
        type: 'error'
      })
    })
  },
  methods: {
    getGps() {
      const gps = this.$refs.mark.getLocation()
      this.form.location = '经度：' + gps.lng + '，' + '纬度：' + gps.lat
      this.dialogVisible = false
    },
    // 提交
    update() {
      const { lat, lng, name, id, js } = this.form
      updateMsg({ lat, lng, name, id, js }).then((e) => {
        if (e.code === 0) {
          this.$alert('信息修改成功', '提示', {
            showClose: false,
            type: 'success'
          })
        }
      })
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
