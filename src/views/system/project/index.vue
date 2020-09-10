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
      <Location ref="mark" :map-data="mapData" />
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
      // 加载弹框
      loading: false,
      // 表单数据
      form: {
        name: '',
        location: '', // iput框展示的经纬度
        lat: '', // 纬度
        lng: '', // 经度
        id: '', // id,上传时需要
        js: '' // 项目介绍
      },
      // 验证柜子
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请设置经纬度', trigger: 'blur' }
        ]
      },
      // 地图初始化经纬度
      mapData: {
        center: [38.123456, 118.123456],
        zoom: 20
      },
      // 地图显隐
      dialogVisible: false
    }
  },
  mounted() {
    const self = this
    this.loading = true
    getDevice(1).then(function(e) {
      const data = e[0]
      self.form.name = data.name
      self.form.location = '经度：' + data.lng + '，' + '纬度：' + data.lat
      self.form.lat = data.lat
      self.form.lng = data.lng
      self.form.id = data.id
      // eslint-disable-next-line no-eval
      self.form.js = data.descri
      self.mapData = {
        center: [data.lat, data.lng],
        zoom: 20
      }
      self.loading = false
    }).catch((e) => {
      self.loading = false
      self.$alert('获取信息失败', '提示', {
        showClose: false,
        type: 'error'
      })
    })
  },
  methods: {
    getGps() {
      const gps = this.$refs.mark.getLocation()
      this.form.location = '经度：' + gps.lng + '，' + '纬度：' + gps.lat
      this.form.lat = gps.lat
      this.form.lng = gps.lng
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
    padding: 30px;
    width: 100%;
    box-sizing: border-box;
    & .project-form {
      width: 800px;
    }
  }
</style>
