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
        { value: 1, label: '展开' },
        { value: 2, label: '合并' }
      ],
      // 模式选择值
      modeValue: 1,
      // 历史数据
      histData: {}
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
      if (e) this.getData()
    }
  },
  mounted() {
    // echartFun.brokenLine(this.$echarts, this.$refs.data1, data, 'test')
  },
  methods: {

    /**
     * 关闭面板
     */
    closePanel() {
      this.$store.dispatch('control/dataPanelShow', false)
    },

    getData() {
      const attr = this.device.attr
      attr.forEach((el) => {
        new Promise((resolve, reject) => {
          hist(this.device.serialno, el.nameKey, this.cycleValue).then((res) => {
            this.histData[res.ch.namekey] = res.items
            this.draw(el, res.items)
          })
        })
      })
    },

    draw(attrItem, data) {
      debugger
      echartFun.brokenLine(this.$echarts, document.getElementById(attrItem.nameKey), data, attrItem.name)
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
        & .dataMain--list {
          width: 32%;
          height: 400px;
        }
    }
    & #data1{
        width: 600px;
        height: 400px;
    }
}
</style>
