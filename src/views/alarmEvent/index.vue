<template>
  <div v-loading="loading" class="alarmEvent-container">
    <div class="top">
      <el-select v-model="seleteDev" placeholder="请选择 (必填)" class="topDevice" @change="seleteDevice">
        <el-option v-for="item in canDevice" :key="item.serialno" :value="item.serialno" :label="item.dname" />
      </el-select>
      <el-date-picker
        v-model="seleteTime"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button type="primary" style="margin-left:12px" @click="search">查询</el-button>
    </div>
    <el-table
      :data="currentAlarm"
      height="calc(100% - 102px)"
      style="width: 100%"
      class="table"
    >
      <el-table-column
        prop="created_at"
        label="预警时间"
      />
      <el-table-column
        prop="dname"
        label="设备名称"
      />
      <el-table-column
        prop="content"
        label="预警说明"
      />
      <el-table-column
        prop="status"
        label="处理状态"
      />
      <el-table-column
        prop="message"
        label="提醒方式"
      />
      <el-table-column
        prop="cycle"
        label="提醒周期"
      />
      <el-table-column
        label="操作"
        fixed="right"
        min-width="120"
      >
        <template>
          <el-button
            size="mini"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDevices } from '@/utils/getDevice.js'
import { sprayAttr, ferAttr, pumpAttr } from '@/views/deviceControl/parsing'
import { getAttr } from '@/utils/setDevice'
import { parseTime } from '@/utils'
import { alarmEvent } from '@/api/alarmEvent'
export default {
  name: 'AlarmEvent',
  data() {
    return {
      // 加载遮罩
      loading: false,
      // 可设置警报的设备-dclass
      canDclass: [this.$config.SPRAY_CLASS, this.$config.FERTILIZER_CLASS, this.$config.PUMP_CLASS],
      // 可设置警报的设备
      canDevice: [],
      // 选择设备对应的属性
      devicetAttr: [],
      // 筛选警报设备编号
      seleteDev: '',
      // 筛选警报时间范围
      seleteTime: ['2020-09-01 00:00:00', '2021-09-01 00:00:00'],
      // 已添加警报列表
      alarmList: [],
      // 当前页警报列表
      currentAlarm: []
    }
  },
  mounted() {
    const self = this
    self.loading = true
    getDevices().then((e) => {
      const device = []
      e.forEach((item) => {
        if (self.canDclass.includes(item.dclass)) {
          let attr = []
          switch (item.dclass) {
            case self.$config.SPRAY_CLASS: attr = getAttr(sprayAttr, item.model); break
            case self.$config.FERTILIZER_CLASS: attr = getAttr(ferAttr, item.model); break
            case self.$config.PUMP_CLASS: attr = getAttr(pumpAttr, item.model); break
          }
          attr.forEach((el, index) => {
            if (Object.prototype.toString.call(el.rules) === '[object Function]') {
              attr.splice(index, 1)
            }
          })
          item.attr = attr
          device.push(item)
        }
      })
      self.canDevice = device
      self.initSearch()
      self.loading = false
    }).catch((e) => {
      self.loading = false
    })
  },
  methods: {
    // 根据设备编号查找设备
    seleteDevice(e) {
      const device = this.canDevice
      let attr = []
      for (let i = 0; i < device.length; i++) {
        if (device[i].serialno === e) {
          attr = device[i].attr
          break
        }
      }
      this.devicetAttr = attr
    },
    // 初始化查询
    initSearch() {
      const time = new Date().getTime()
      const aDay = 86400000
      const aYear = 31536000000
      this.seleteTime = [parseTime(time - aYear), parseTime(time + aDay)]
      this.seleteDev = this.canDevice[0].serialno
      this.serach()
    },
    // 查询警报列表
    search() {
      const self = this
      alarmEvent({
        serialno: this.seleteDev,
        startTime: this.seleteTime[0],
        endTime: this.seleteTime[1],
        pageSize: 1,
        limit: 900
      }).then((e) => {
        self.alarmList = e.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.alarmEvent-container {
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  & .top {
    display: flex;
    align-items: center;
    margin: 12px 0;
    & .topDevice {
      margin-right: 12px;
    }
  }
}
</style>

