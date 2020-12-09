<template>
  <el-dialog :visible.sync="show" :before-close="close" title="喷灌机水量计算" width="750px" class="irrigation-container">
    <el-divider content-position="left" class="title">输入</el-divider>
    <el-form ref="input" :model="inputData" :rules="inputRules" :inline="true" class="marea">
      <el-form-item label-width="120px" label="计算日期：" class="add__item" prop="soilWater">
        <el-date-picker
          v-model="inputData.time"
          align="right"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
    </el-form>
    <el-divider content-position="left" class="title">输出</el-divider>
    <el-form ref="output" :model="outputData" :inline="true" class="marea">
      <el-form-item label-width="120px" label="理论灌水量：" class="add__item" prop="soilWater">
        <el-input v-model="outputData.amount" placeholder="请计算灌水量" disabled class="add__put">
          <template slot="append">m³</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" class="bml" @click="calculate">计算</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      time: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 46860000 > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      inputData: {
        time: ''
      },
      outputData: {
        amount: 0
      },
      inputRules: {
        time: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.control.irrigationShow
    }
  },
  methods: {

    // 关闭窗口
    close() {
      this.$store.dispatch('control/irrigationShow', false)
    },

    // 灌水量计算
    calculate() {},

    // 重置表单
    reset() {
      this.$refs.input.resetFields()
      this.$refs.output.resetFields()
    }

  }
}
</script>
<style lang="scss" scoped>
.irrigation-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, .3);
  & .title .el-divider__text {
    font-size: 14px;
    color: #000;
    font-weight: 700;;
  }
  & .add__put {
    width: 200px;
  }
  & .btn-group {
    display: flex;
    flex-direction: row-reverse;
    & .bml {
      margin-left: 20px;
    }
  }
}
</style>
