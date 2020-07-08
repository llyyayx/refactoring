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
          <div class="screening__item--title">采集密度:</div>
          <el-select v-model="deviceValue" class="screening__item--options" placeholder="请选择">
            <el-option
              v-for="item in density"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="screening__item">
          <div class="screening__item--title">数据周期</div>
          <el-select v-model="cycleValue" class="screening__item--options" placeholder="请选择">
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
        <div v-for="(item,index) in device.attr" :id="item.nameKey" :key="index" class="dataMain--list" />
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
      density: [
        { value: 1, label: '稀疏' },
        { value: 2, label: '密集' }
      ],
      // 密度选择值
      deviceValue: 2,
      // 周期
      cycle: [
        { value: 1, label: '一周内' },
        { value: 2, label: '两周内' },
        { value: 3, label: '三周内' },
        { value: 4, label: '一个月内' }
      ],
      // 周期选择值
      cycleValue: 1,
      // 展示模式
      mode: [
        { value: 'an', label: '展开' },
        { value: 'merge', label: '合并' }
      ],
      // 模式选择值
      modeValue: 'an',
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
    deviceValue(e) {
      if (e === 1) {
        this.cycle = [
          { value: 4, label: '一个月内' },
          { value: 12, label: '三个月内' },
          { value: 24, label: '六个月内' },
          { value: 48, label: '一年内' }
        ]
        this.cycleValue = 4
      } else if (e === 2) {
        this.cycle = [
          { value: 1, label: '一周内' },
          { value: 2, label: '两周内' },
          { value: 3, label: '三周内' },
          { value: 4, label: '一个月内' }
        ]
        this.cycleValue = 1
      }
    },
    show(e) {
      this.device = this.$store.state.control.dataPanelObj
      this.$nextTick(() => {
        if (e) {
          // 初始化所以模式
          this.an()
          this.getData()
        }
      })
    }
  },
  methods: {

    /**
     * 关闭面板
     */
    closePanel() {
      this.anClearEc()
      this.$store.dispatch('control/dataPanelShow', false)
    },

    /**
     * 展开模式：实例化下属性的echarts对象
     */
    an() {
      const self = this
      const attr = this.device.attr
      attr.forEach((el) => {
        const newObj = echartFun.brokenLine(this.$echarts, {
          dom: document.getElementById(el.nameKey),
          name: el.name,
          data: [],
          unit: el.unit,
          max: el.max,
          min: el.min
        })
        newObj.showLoading()
        self.AnEcObj[el.nameKey] = newObj
      })
    },

    /**
     * 展开模式：给实例化对象赋值（值是ajax异步获取）
     */
    anSetData(attrName) {
      const dataObj = this.fromatting(this.histData[attrName])
      this.AnEcObj[attrName].setOption({
        xAxis: {
          data: dataObj.date
        },
        series: [{
          data: dataObj.value
        }]
      })
      this.AnEcObj[attrName].hideLoading()
    },

    /**
     * 展开模式：清楚echarts图表
     */
    anClearEc() {
      const AnEcObj = this.AnEcObj
      Object.keys(AnEcObj).forEach((key) => {
        AnEcObj[key].hideLoading()
        AnEcObj[key].clear()
      })
    },

    /**
     * 获取设备历史数据，并且异步赋值echarts对象数据
     */
    getData() {
      const self = this
      const attr = this.device.attr
      attr.forEach((el) => {
        new Promise((resolve, reject) => {
          hist(self.device.serialno, el.nameKey, self.cycleValue).then((res) => {
            self.histData[res.ch.namekey] = res.items
            self.selectMode(res.ch.namekey)
          })
        })
      })
    },

    /**
     * 方法：历史数据按照格式返回
     * @param { Array } 接口返回的历史数据 [{createdAt:2020-01-01, val:20}]
     * @return { Object } 格式化好的对象
     */
    fromatting(data) {
      const date = []
      const value = []
      if (data.length > 0) {
        data.forEach((el) => {
          date.push(el.createdAt)
          value.push(el.val)
        })
      }
      return { date, value }
    },

    /**
     * 选择数据展示模式
     */
    selectMode(attrName) {
      var mode = this.modeValue
      if (mode === 'an') {
        this.anSetData(attrName)
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
    background-color: rgba(255, 255, 255, .9);
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
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20px;
        & .dataMain--list {
          width: 50%;
          height: 400px;
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
