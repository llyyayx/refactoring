<template>
  <el-dialog :visible.sync="show" :before-close="close" title="自然间断点计算参数设置" width="950px" class="natural-container">
    <div class="natural-box">
      <el-divider content-position="left" class="title">地里位置</el-divider>
      <div class="location">
        <div class="locaItem">
          <div class="locaItem__title">西南角经度：</div>
          <el-input v-model="wsLng" class="locaItem__put" />
        </div>
        <div class="locaItem">
          <div class="locaItem__title">西南角纬度：</div>
          <el-input v-model="wsLat" class="locaItem__put" />
        </div>
        <div class="locaItem">
          <div class="locaItem__title">东北角经度：</div>
          <el-input v-model="enLng" class="locaItem__put" />
        </div>
        <div class="locaItem">
          <div class="locaItem__title">东北角纬度：</div>
          <el-input v-model="enLat" class="locaItem__put" />
        </div>
      </div>
      <el-divider content-position="left" class="title">算法设置</el-divider>
      <div class="alg">
        <div class="algItem">
          <div class="algItem__title">分组数量：</div>
          <el-select v-model="grouping" class="algItem__put">
            <el-option
              v-for="item in groupOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="algItem">
          <div class="algItem__title">每组点数量：</div>
          <el-select v-model="point" class="algItem__put">
            <el-option
              v-for="item in pointOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="algItem">
          <div class="algItem__title">迭代次数</div>
          <el-select v-model="cycle" class="algItem__put">
            <el-option
              v-for="item in cycleOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <el-divider content-position="left" class="title">颜色设置</el-divider>
      <div class="color">
        <div v-for="(item, index) in color" :key="index" class="colorItem">
          <div class="algItem__title">组{{ index + 1 }}：</div>
          <el-color-picker v-model="color[index]" :show-alpha="false" color-format="hex" class="colorHex" />
        </div>
      </div>
      <el-divider content-position="left" class="title">数据上传</el-divider>
      <div class="filed">
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      wsLng: '115.850866',
      wsLat: '39.460402',
      enLng: '115.852961',
      enLat: '39.461939',
      // 分组数量
      grouping: 7,
      // 每组点数量
      point: 12,
      // 迭代次数
      cycle: 100,
      // 组颜色
      color: ['#79AEAA', '#AFCA91', '#E4EC72', '#FCD151', '#FBC24B', '#F8742A', '#EC3819'],
      // 上传的文件
      fileList: [],

      // 分组option选项
      groupOption: [6, 7, 8, 9, 10],
      // 点数量option选项
      pointOption: [8, 9, 10, 11, 12, 13, 15],
      // 迭代次数
      cycleOption: [100, 1000, 5000, 10000, 15000, 20000, 25000, 30000, 50000]
    }
  },
  computed: {
    show() {
      return this.$store.state.control.naturalShow
    }
  },
  watch: {
    grouping: {
      handler: function(e) {
        const color = []
        for (let i = 0; i < e; i++) {
          color.push('')
        }
        this.color = color
      }
    }
  },
  methods: {
    close() {
      this.$store.dispatch('control/naturalShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.natural-box {
    max-height: 500px;
    overflow-y: auto;
    & .title >>> .el-divider__text {
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }
    & .location {
        display: flex;
        flex-wrap: wrap;
        padding-left: 40px;
        & .locaItem {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            margin-right: 20px;
            & .locaItem__put {
                width: 150px;
            & >>> .el-input__inner {
                color: #333;
            }
            }
            & .locaItem__title {
                font-size: 14px;
                padding-right: 12px;
                color: #333;
            }
        }
    }
    & .alg {
        display: flex;
        flex-wrap: wrap;
        padding-left: 40px;
        & .algItem {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            margin-right: 20px;
            & .algItem__put {
                width: 150px;
                & >>> .el-input__inner {
                    color: #333;
                }
            }
            & .algItem__title {
                font-size: 14px;
                padding-right: 12px;
                color: #333;
            }
        }
    }
    & .color {
        display: flex;
        flex-wrap: wrap;
        padding-left: 40px;
        & .colorItem {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            margin-right: 20px;
            & .colorHex {
                margin-left: 10px;
            }
            & .colorItem__title {
                font-size: 14px;
                padding-right: 12px;
                color: #333;
            }
        }
    }
    & .filed {
        display: flex;
        flex-wrap: wrap;
        padding-left: 40px;
    }
}
</style>
