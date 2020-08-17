<template>
  <el-dialog :visible.sync="show" :before-close="close" title="参数设置" width="950px" class="natural-container">
    <div class="natural-box">
      <el-divider content-position="left" class="title">地理位置</el-divider>
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
        <el-radio v-model="radio" label="1" class="radio">上传新数据</el-radio>
        <el-upload
          :action="action"
          class="upload-demo"
          :file-list="fileList"
          :limit="1"
          :on-error="subError"
          :on-success="subSuccess"
          accept=".json"
          :disabled="radio==='2'"
        >
          <el-button size="small" type="primary" :disabled="radio==='2'">点击上传</el-button>
        </el-upload>
        <el-radio v-model="radio" label="2" class="radio">选用已有数据</el-radio>
        <el-dropdown @command="histroy">
          <el-button type="primary" size="small" :disabled="radio==='1'">
            已上传数据<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in dataList" :key="index" :command="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-show="radio==='2'&&info.file.length>0" class="tips">已选择{{ info.file }}</div>
      </div>
    </div>
    <div class="btn__group">
      <el-button type="primary" @click="calculate">计算</el-button>
      <el-button style="margin-right: 10px" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { subFile, readFile, fileList } from '@/api/deviceControl'
import { operation } from '../naturalJs/index'
import { latLng, latLngBounds, imageOverlay } from 'leaflet'
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
      cycle: 2,
      // 组颜色
      color: ['#79AEAA', '#AFCA91', '#E4EC72', '#FCD151', '#FBC24B', '#F8742A', '#EC3819'],
      // 上传的文件
      fileList: [],
      // 上传返回的文件信息
      info: { file: '' },

      // 分组option选项
      groupOption: [6, 7, 8, 9, 10],
      // 点数量option选项
      pointOption: [8, 9, 10, 11, 12, 13, 15],
      // 迭代次数
      cycleOption: [2, 100, 1000, 5000, 10000, 15000, 20000, 25000, 30000, 50000],
      // 单选按钮
      radio: '1',
      // 历史上传数据
      dataList: [],
      // 上传地址
      action: subFile(),
      // 上传文件成功标识
      subResult: false,
      // 颜色集合
      collection: ['#79AEAA', '#AFCA91', '#E4EC72', '#FCD151', '#FBC24B', '#F8742A', '#EC3819', '#9F0E0E', '#8B1919', '#0B0000']
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
          color.push(this.collection[i])
        }
        this.color = color
      }
    }
  },
  mounted() {
    const self = this
    fileList().then((e) => {
      self.dataList = e.data
    }).catch((e) => {
      self.radio = '2'
      this.$alert('读取数据列表失败', '警告', {
        showClose: false,
        type: 'error'
      })
    })
  },
  methods: {
    // 关闭窗口
    close() {
      this.$store.dispatch('control/naturalShow', false)
    },

    // 上传失败
    subError() {
      this.$alert('文件上传失败，请联系管理员', '警告', {
        showClose: false,
        type: 'error'
      })
    },

    // 上传成功
    subSuccess(e) {
      if (e.code === 0) {
        this.info = e.info
        this.subResult = true
        this.$alert('文件上传成功', '提示', {
          showClose: false,
          type: 'success'
        })
      } else {
        this.$alert('上传文件过大', '警告', {
          showClose: false,
          type: 'error'
        })
      }
    },

    // 选择历史数据
    histroy(fileName) {
      this.info.file = fileName
      this.$alert('已选择' + fileName, '提示', {
        showClose: false,
        type: 'success'
      })
    },

    // 计算数据
    calculate() {
      const self = this
      if (self.info.file.length > 0 && self.wsLng && self.wsLat && self.enLng && self.enLat) {
        const loading = this.$loading({ text: '数据处理中', lock: true })
        readFile(this.info.file).then((e) => {
          const promise = operation({
            color: this.color,
            latrt: this.enLat,
            lngrt: this.enLng,
            latlb: this.wsLat,
            lnglb: this.wsLng,
            grouping: this.grouping,
            points: this.point,
            cycle: this.cycle,
            data: e.data
          })
          loading.close()
          self.imageOverlay(promise)
        }).catch(() => {
          this.$alert('文件读取失败，请检查网络', '警告', {
            showClose: false,
            type: 'error'
          })
        })
      } else {
        this.$alert('请补全信息', '警告', {
          showClose: false,
          type: 'waring'
        })
      }
    },

    // imageOverlay
    imageOverlay(promise) {
      const self = this
      var domList = document.getElementsByClassName('naturalImage')
      if (domList.length > 0) {
        for (let i = 0; i < domList.length; i++) {
          domList[i].parentNode.removeChild(domList[i])
        }
      }
      promise.then((url) => {
        const swBound = latLng({ lat: '39.46135787105697', lng: '115.8568060398102' })
        const neBound = latLng({ lat: '39.46287782796392', lng: '115.85894644260408' })
        const bounds = latLngBounds(swBound, neBound)
        const layer = imageOverlay(url, bounds, { className: 'naturalImage' })
        layer.addTo(self.$store.state.map.map)
        self.close()
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.natural-box {
    max-height: 520px;
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
    & .filed >>> .upload-demo {
        display: flex;
        flex-wrap: wrap;
    }
    & .filed >>> .el-upload {
      margin-right: 10px;
    }
    & .filed{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      & .radio {
        margin-right: 10px;
        padding-left: 40px;
      }
      & .tips {
        padding-left: 10px;
      }
    }
}
.btn__group {
  flex-direction: row-reverse;
  padding: 20px 0 0 0;
  display: flex;
}
</style>
