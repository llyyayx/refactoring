<template>
  <div v-loading="loading" class="device-container">
    <LMaps @load="load" />
    <Quick />
    <Spray />
    <Drops />
    <Sensor />
    <Fertilizer />
    <Pump />
    <Toolkit />
    <SprayPlan />
    <Partition />
    <DataPanel />
    <Natural />
    <NatHistroy />
    <Irrigation />
    <Fertilization />
    <SetFer />
  </div>
</template>

<script>
import LMaps from '@/components/LMaps'
import Spray from './components/spray'
import Drops from './components/drops'
import Sensor from './components/sensor'
import Fertilizer from './components/fertilizer'
import Pump from './components/pump'
import Toolkit from './components/toolkit'
import SprayPlan from './components/sprayPlan'
import Partition from './components/partition'
import Quick from './components/quick'
import DataPanel from './components/dataPanel'
import Natural from './components/natural'
import NatHistroy from './components/natHistroy'
import Irrigation from './components/irrigation'
import Fertilization from './components/fertilization'
import SetFer from './components/setFer'
import state from './mixins/state'
import mapFun from '@/utils/lmapFun'
import Paho from './mqttws31'
import { getDevice } from '@/api/deviceControl'
import { drops, pump, fertilizer, soil, weather, spray, ndvi, height, canopy } from './parsing'
import { serialno } from '@/utils/index'
export default {
  name: 'DeviceControl',
  components: {
    LMaps,
    Spray,
    Drops,
    Sensor,
    Fertilizer,
    Pump,
    Toolkit,
    SprayPlan,
    Partition,
    Quick,
    DataPanel,
    Natural,
    NatHistroy,
    Irrigation,
    Fertilization,
    SetFer
  },
  mixins: [state],
  data() {
    return {
      loading: true,
      // 地图对象
      map: {},
      // mqtt对象
      client: {},
      // 是否主动断开mqtt服务(false非主动断开，会自动重来)
      initiative: false
    }
  },
  // 导航离开路由守卫：退出系统断开mqtt服务
  beforeRouteLeave(to, form, next) {
    try {
      this.initiative = true
      const config = this.$config
      this.client.unsubscribe(config.MQTT_TOPIC, (e) => {
        this.client.disconnect()
      })
      next()
    } catch (error) {
      next()
    }
  },
  // keep-alive生命周期函数：进入页面时连接mqtt
  activated(e) {
    this.mqttServer()
  },
  methods: {
    /**
     * 获取设备信息及初始化
     */
    async getContent() {
      const response = await getDevice(1)
      const { lat, lng, devices, maplevel } = response[0]
      this.setMap(lat, lng)
      this.setZoom(maplevel)
      const config = this.$config
      devices.forEach((item, index) => {
        switch (item.dclass) {
          case config.DROPS_CLASS: drops(item); break
          case config.PUMP_CLASS: pump(item); break
          case config.FERTILIZER_CLASS: fertilizer(item); break
          case config.SOIL_CLASS: soil(item); break
          case config.WEATHER_CLASS: weather(item); break
          case config.SPRAY_CLASS: spray(item); break
          case config.NDVI_CLASS: ndvi(item); break
          case config.HEIGHT_CLASS: height(item); break
          case config.CANOPY_CLASS: canopy(item); break
        }
      })
      // 主动读取设备状态
      this.stateAll()
      // 机载冠层温度采集绘制
      this.drawCanopy()
      // 设备排序(后台没排序-_-)
      this.sort()
      // F5刷新不触发activated事件，此处启动连接mqtt
      if (Object.keys(this.client).length === 0) {
        this.mqttServer()
      }
      // 关闭加载遮罩
      this.loading = false
    },

    /**
     * 地图组件实例化完成触发事件
     * @param { Object } map 地图实例化对象
     */
    load(map) {
      this.map = map
      this.$store.dispatch('map/setMap', map)
      this.getContent()
      this.mapRgTop()
      // mapFun.lookAddr(map)
    },

    /**
     * 设置地图中心点
     * @param { String } lat 纬度
     * @param { String } lng 经度
     */
    setMap(lat, lng) {
      mapFun.setCenter(this.map, lat, lng)
    },

    /**
     * 设置地图缩放级别
     * @param { String } maplevel 缩放级别
     */
    setZoom(maplevel) {
      mapFun.setZoom(this.map, maplevel)
    },

    // 地图右上栏
    mapRgTop() {
      mapFun.mapRgTop(this.map, '工具箱', require('@/icons/device/tool.png'), () => {
        this.$store.dispatch('control/toolShow', true)
      })
      mapFun.mapRgTop(this.map, '采集面板', require('@/icons/device/cgq1.png'), () => {
        this.$store.dispatch('control/sensorShow', true)
      })
    },

    // 设备排序
    sort() {
      const allDevice = this.$store.state.device
      const keys = Object.keys(allDevice)
      keys.forEach((el) => {
        if (Object.prototype.toString.call(allDevice[el]) === '[object Array]') {
          if (allDevice[el][0] !== undefined && Object.prototype.toString.call(allDevice[el][0]) === '[object Object]') {
            if (allDevice[el][0].hasOwnProperty('serialno')) {
              serialno(allDevice[el])
            }
          } else if (allDevice[el][0] !== undefined && Object.prototype.toString.call(allDevice[el][0]) === '[object Array]') {
            allDevice[el].forEach((item) => {
              serialno(item)
            })
          }
        }
      })
    },

    // 绘制喷灌臂上的冠层采集器
    drawCanopy() {
      const canopy = this.$store.state.device.canopy
      const spray = this.$store.state.device.spray
      const device = []
      canopy.forEach((el) => {
        if (el.mounted) {
          if (el.pserialno) {
            spray.forEach((item) => {
              if (item.serialno === el.pserialno) {
                item.canvas.sensor.push(el)
                device.push(item)
              }
            })
          } else {
            spray[0].canvas.sensor.push(el)
            device.push(spray[0])
          }
        }
      })
      device.forEach((el) => {
        el.canvas.view.onRemove()
        el.canvas.view.onAdd()
        el.canvas.view.draw()
      })
    },

    // MQTT全设备状态监听
    mqttServer() {
      const _this = this
      this.initiative = false
      const config = this.$config
      const client = new Paho.MQTT.Client(config.MQTT_HOST, config.MQTT_PORT, config.MQTT_ADDR, new Date().getTime().toString())
      this.client = client
      // 客户端连接
      client.connect({
        // 建立连接,马上发起订阅
        onSuccess: function() {
          client.subscribe(config.MQTT_TOPIC, { qos: 0 })
        },
        // 用户名
        userName: config.MQTT_USERNAME,
        // 密码
        password: config.MQTT_PASSWORD,
        // 属性配置
        cleanSession: config.MQTT_CLEANSESSION,
        useSSL: config.MQTT_USETLS,
        timeout: config.MQTT_TIMEOUT
      })
      // 消息到达回调函数
      client.onMessageArrived = function(msg) {
        const data = JSON.parse(msg.payloadString)
        // console.log(data)
        new Promise((resolve, reject) => {
          if (data.code) {
            const obj = _this.mqttScreen(data)
            if (obj.result) _this.classify(data, obj.device)
          }
        })
      }
      // 连接超时
      client.onConnectionLost = function() {
        const time = setTimeout(function() {
          if (!_this.initiative) {
            _this.mqttServer()
          }
          clearTimeout(time)
        }, 1500)
      }
    },

    /**
     * 找到mqtt返回的设备对象
     * @param { Object } res mqtt返回值
     * @return { Object } 与之相匹配的设备
     */
    mqttScreen(res) {
      const allDevice = this.$store.state.device
      const keys = Object.keys(allDevice)
      let result = false
      let device = {}
      for (let i = 0; i < keys.length; i++) {
        if (result) break
        const alone = allDevice[keys[i]]
        // 循环全部设备
        for (let j = 0; j < alone.length; j++) {
          if (result) break
          if (Object.prototype.toString.call(alone[j]) === '[object Array]') {
            const fm = alone[j]
            for (let z = 0; z < fm.length; z++) {
              if (res.serialno === fm[z].serialno) {
                device = alone[j][z]
                result = true
                break
              }
            }
          } else {
            if (res.serialno === alone[j].serialno) {
              device = alone[j]
              result = true
              break
            }
          }
        }
      }
      return { device, result }
    },

    /**
     * 根据设备类型去解析
     * @param { Object } data mqtt返回值
     * @param { Object } 与返回相匹配的设备
     */
    classify(data, device) {
      this.mqttJxState(data, device)
    }

  }
}
</script>

<style lang="scss" scoped>
.device {
  &-container{
    position: relative;
    height: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.flex {
  display: flex;
}
</style>
