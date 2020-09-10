<template>
  <transition name="fade" mode="out-in">
    <div v-show="show" class="dataPanel-container">
      <!-- 顶部按钮go -->
      <el-row class="dataPanel__top">
        <el-col :span="2" :offset="22" class="dataPanel__icon">
          <el-tooltip content="关闭">
            <svg-icon icon-class="close" class="dataPanel__icon--close" @click="closePanel" />
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 顶部按钮end -->
      <el-row :gutter="10" class="screening" type="flex">
        <el-col :span="4" class="screening__item">
          <div class="screening__item--title">设备名称:</div>
          <div class="screening__item--dname">{{ device.dname }}</div>
        </el-col>
        <el-col :span="4" class="screening__item">
          <div class="screening__item--title">数据来源:</div>
          <el-select v-model="sourceValue" class="screening__item--options" placeholder="请选择">
            <el-option
              v-for="item in source"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="screening__item">
          <div class="screening__item--title">数据周期</div>
          <el-select v-model="cycleValue" class="screening__item--options" placeholder="请选择" @change="reload">
            <el-option
              v-for="item in cycle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="screening__item">
          <div class="screening__item--title">展示模式:</div>
          <el-select v-model="modeValue" class="screening__item--options" placeholder="请选择">
            <el-option
              v-for="item in mode"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

      </el-row>
      <!-- 数据展示主体go -->
      <div class="dataMain">
        <div v-show="modeValue==='an'" class="an">
          <div v-for="(item,index) in device.attr" v-show="item.ecShow" :id="item.nameKey" :key="index" class="dataMain--list" />
        </div>
        <div v-show="modeValue==='merge'" class="merge">
          <div id="mergeEc" />
        </div>
      </div>
      <!-- 数据展示主体end -->
    </div>
  </transition>
</template>

<script>
import echartFun from '@/utils/echartFun'
import { hist } from '@/api/deviceControl'
export default {
  data() {
    return {
      device: {},
      // 数据密度
      source: [
        { value: 1, label: '远程' },
        { value: 2, label: '本地' }
      ],
      // 数据来源选择值
      sourceValue: 1,
      // 周期
      cycle: [
        { value: 1, label: '一天内' },
        { value: 30, label: '一个月内' },
        { value: 90, label: '三个月内' },
        { value: 180, label: '六个月内' },
        { value: 365, label: '一年内' }
      ],
      // 周期选择值
      cycleValue: 1,
      // 展示模式
      mode: [
        { value: 'an', label: '展开' },
        { value: 'merge', label: '合并' }
      ],
      // 模式选择值
      modeValue: 'merge',
      // 是否已经加载历史数据，不同设备改为false
      load: false,
      // 历史数据
      histData: {},
      // 展开模式：echarts实例化对象
      AnEcObj: {}
    }
  },
  computed: {
    // 数据面板显隐
    show() {
      return this.$store.state.control.dataPanelShow
    }
  },
  watch: {
    sourceValue(e) {
      if (e === 1) {
        this.cycle = [
          { value: 1, label: '一天内' },
          { value: 30, label: '一个月内' },
          { value: 90, label: '三个月内' },
          { value: 180, label: '六个月内' },
          { value: 365, label: '一年内' }
        ]
        this.cycleValue = 30
      } else if (e === 2) {
        this.cycle = [
          { value: 1, label: '一天内' },
          { value: 2, label: '两天内' },
          { value: 3, label: '三天内' },
          { value: 4, label: '四天内' },
          { value: 5, label: '五天内' },
          { value: 6, label: '六天内' },
          { value: 7, label: '七天内' }
        ]
        this.cycleValue = 1
      }
      this.reload()
    },
    show(e) {
      this.device = this.$store.state.control.dataPanelObj
      this.$nextTick(() => {
        if (e) {
          // 初始化默认模式
          this.selectInit()
        }
      })
    },
    modeValue() {
      this.$nextTick(() => {
        this.selectInit()
      })
    }
  },
  methods: {

    /**
     * 重载数据
    */
    reload() {
      const keys = Object.keys(this.AnEcObj)
      keys.forEach((el) => {
        this.AnEcObj[el].showLoading()
      })
      // 切换数据周期
      this.getData()
    },

    /**
     * 关闭面板
     */
    closePanel() {
      // 清除echarts实例化对象
      this.anClearEc()
      this.mergeClearEc()
      // 清空echarts缓存
      this.AnEcObj = {}
      // 清除缓存历史数据
      this.histData = {}
      this.load = false
      this.$store.dispatch('control/dataPanelShow', false)
    },

    /**
     * 展开模式：实例化下属性的echarts对象
     */
    an() {
      const self = this
      const attr = this.device.attr
      attr.forEach((el) => {
        if (el.ecShow) {
          const newObj = echartFun.brokenLine(this.$echarts, {
            dom: document.getElementById(el.nameKey),
            name: el.name,
            date: [],
            value: [],
            unit: el.unit,
            max: el.max || 100,
            min: el.min || 0,
            type: el.ecType || 'line'
          })
          self.AnEcObj[el.nameKey] = newObj
          newObj.showLoading()
        }
      })
    },

    /**
     * 展开模式：给实例化对象赋值（值是ajax异步获取）
     *
     */
    anSetData() {
      const attr = this.device.attr
      attr.forEach((el) => {
        if (el.ecShow) {
          const dataObj = this.fromatting(this.histData[el.nameKey])
          this.AnEcObj[el.nameKey].setOption({
            xAxis: {
              data: dataObj.date
            },
            series: [{
              data: dataObj.value
            }]
          })
          this.AnEcObj[el.nameKey].hideLoading()
        }
      })
    },

    /**
     * 展开模式：清楚echarts图表
     */
    anClearEc() {
      const AnEcObj = this.AnEcObj
      Object.keys(AnEcObj).forEach((key) => {
        if (AnEcObj[key]) {
          AnEcObj[key].hideLoading()
          AnEcObj[key].clear()
        }
      })
    },

    /**
     * 合并模式：实例化对象
     */
    merge() {
      const newObj = echartFun.mergeLine(this.$echarts, {
        dom: document.getElementById('mergeEc'),
        name: '',
        date: [],
        dataList: [],
        legend: []
      })
      this.AnEcObj.merge = newObj
      newObj.showLoading()
    },

    /**
     * 合并模式：给实例化对象赋值
     */
    mergeSetData() {
      const attr = this.device.attr
      const array = []
      const legend = []
      attr.forEach((el) => {
        if (el.ecShow) {
          const dataObj = this.fromatting(this.histData[el.nameKey])
          array.push({
            name: el.name,
            type: el.ecType || 'line',
            data: dataObj.value
          })
          legend.push(el.name)
        }
      })
      this.AnEcObj.merge.setOption({
        legend: {
          data: legend
        },
        xAxis: {
          data: this.fromatting(this.histData[attr[0].nameKey]).date
        },
        series: array
      })
      this.AnEcObj.merge.hideLoading()
    },

    mergeClearEc() {
      if (this.AnEcObj.merge) {
        this.AnEcObj.merge.hideLoading()
        this.AnEcObj.merge.clear()
      }
    },

    /**
     * 获取设备历史数据，并且异步赋值echarts对象数据
     */
    getData() {
      const self = this
      const attr = this.device.attr
      // 读取展示有效属性长度
      let ecLen = 0
      attr.forEach((el) => {
        if (el.ecShow) {
          ecLen += 1
        }
      })
      attr.forEach((el, index) => {
        if (el.ecShow) {
          new Promise((resolve, reject) => {
            hist(self.device.serialno, el.nameKey, self.cycleValue, self.sourceValue).then((res) => {
              if (res.items) {
                self.histData[el.nameKey] = res.items
                resolve(index)
              } else if (res.data) {
                self.histData[el.nameKey] = res.data
                resolve(index)
              } else {
                self.histData[el.nameKey] = []
                resolve(index)
              }
            })
          }).then((e) => {
            // 必须等所有数据加载完在执行
            const len = Object.keys(self.histData).length
            if (len === ecLen) {
              this.load = true
              self.selectMode()
            }
          })
        }
      })
    },

    /**
     * 方法：历史数据按照格式返回
     * @param { Array } 接口返回的历史数据 [{createdAt:2020-01-01, val:20}]
     * @return { Object } 格式化好的对象
     */
    fromatting(data) {
      let date = []
      let value = []
      if (this.sourceValue === 2) {
        if (data !== undefined && data.length > 0) {
          data.forEach((el) => {
            date.push(el.createdAt)
            value.push(el.val)
          })
        }
      } else if (this.sourceValue === 1) {
        date = data.categories
        value = data.series[0].data
      }
      return { date, value }
    },

    // 根据展示模式,实例化echarts
    selectInit() {
      const mode = this.modeValue
      const keys = Object.keys(this.AnEcObj)
      if (mode === 'an') {
        const attr = this.device.attr
        let nameKey
        for (let i = 0; i < attr.length; i++) {
          if (attr[i].ecShow) {
            nameKey = attr[i].nameKey
            break
          }
        }
        if (!keys.includes(nameKey)) {
          this.an()
        }
      } else if (mode === 'merge') {
        if (!keys.includes('merge')) {
          this.merge()
        }
      }
      if (!this.load) {
        this.getData()
      } else {
        this.selectMode()
      }
    },

    /**
     * 对实例化的echarts进行赋值操作
     * @param { String } attrName 属性名称
     */
    selectMode() {
      const mode = this.modeValue
      if (mode === 'an') {
        this.anSetData()
      } else if (mode === 'merge') {
        this.mergeSetData()
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.dataPanel-container{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 1);
    overflow-x: hidden;
    overflow-y: auto;
    & .dataPanel__top {
        width: 100%;
        top: 5px;
        right: 5px;
        & .dataPanel__icon {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          color: #666;
          cursor: pointer;
          & .dataPanel__icon--close{
            font-size:23px;
            margin-left: 10px;
          }
        }
    }
    & .screening {
        padding: 10px 20px;
        box-sizing: border-box;
        & .screening__item {
            display: flex;
            align-items: center;
            margin-right: 40px;
        }
        & .screening__item--title {
            font-size: 16px;
            font-weight: 600;
            padding-right: 10px;
            flex-shrink: 0;
        }
        & .screening__item--dname {
            font-size: 16px;
        }
        & .screening__item--options {
            flex-grow: 1;
            & >>> .el-input__inner {
                background-color: transparent;
            }
        }
    }
    & .dataMain{
      margin-top: 20px;
      & .an{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        & .dataMain--list {
          width: 50%;
          height: 400px;
        }
      }
      & .merge{
        width: 100%;
        display: block;
        & #mergeEc{
          height: calc(100vh - 150px);
        }
      }
    }
    & #data1{
        width: 600px;
        height: 400px;
    }
}

/* 重置滚动条 */
::scrollbar{width:8px; height:8px; border-radius:5px;}
::scrollbar-button{display:none;}
::scrollbar-track  {display:none;}
::scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::scrollbar-corner{display:none;}

::-webkit-scrollbar{width:8px; height: 8px; border-radius:5px;}
::-webkit-scrollbar-button{display:none;}
::-webkit-scrollbar-track  {display:none;}
::-webkit-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-webkit-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-webkit-scrollbar-corner{display:none;}

::-moz-scrollbar{width:8px; height:8px; border-radius:5px;}
::-moz-scrollbar-button{display:none;}
::-moz-scrollbar-track  {display:none;}
::-moz-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-moz-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-moz-scrollbar-corner{display:none;}

::-o-scrollbar{width:8px; height:8px; border-radius:5px;}
::-o-scrollbar-button{display:none;}
::-o-scrollbar-track  {display:none;}
::-o-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-o-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-o-scrollbar-corner{display:none;}

::-ms-scrollbar{width:8px; height:8px; border-radius:5px;}
::-ms-scrollbar-button{display:none;}
::-ms-scrollbar-track  {display:none;}
::-ms-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-ms-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-ms-scrollbar-corner{display:none;}
</style>
