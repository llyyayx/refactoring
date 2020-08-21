<template>
  <div class="quick-container">
    <!-- 顶部列表go -->
    <el-row type="flex" class="quick__box">
      <el-col v-for="(item, index) in quickList" v-show="deviceLen(item.obj)" :key="index" class="quick__box--item" @click.native="setDevice(item.obj)">
        <div class="img__box">
          <img :src="item.icon">
        </div>
        <div class="quick__box--title">{{ item.title }}</div>
      </el-col>
    </el-row>
    <el-divider v-if="closeState" class="divider2" />
    <!-- 顶部列表end -->
    <!-- 设备展示栏go -->
    <el-row :class="['quick__content', state]">
      <el-col v-for="(item, index) in deviceList" :key="index" class="quick__content--item" @click.native="touch(item)">
        <div class="img_box2">
          <img :src="item.icon">
        </div>
        <div class="quick__device--name">{{ item.dname }}</div>
      </el-col>
    </el-row>
    <div v-show="closeState" class="quick__close" @click="onOff">
      <div class="img_box3">
        <img src="@/icons/device/sq.png">
      </div>
    </div>
    <!-- 设备展示栏end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 设备列表显示隐藏
      state: 'off',
      // 下拉箭头显示隐藏
      closeState: false,
      quickList: [
        { title: '滴灌', icon: require('@/icons/device/run/dg.png'), obj: 'drops' },
        { title: '喷灌', icon: require('@/icons/device/run/pg.png'), obj: 'spray' },
        { title: '气象站', icon: require('@/icons/device/run/qxz.png'), obj: 'weather' },
        { title: '墒情站', icon: require('@/icons/device/run/sqz.png'), obj: 'soil' },
        { title: '施肥机', icon: require('@/icons/device/run/sf.png'), obj: 'fertilizer' },
        { title: '冠层站', icon: require('@/icons/device/run/canopy.png'), obj: 'canopy' },
        { title: 'NDVI', icon: require('@/icons/device/run/ndvi.png'), obj: 'ndvi' },
        { title: '水泵', icon: require('@/icons/device/run/sb.png'), obj: 'pump' },
        { title: '高度', icon: require('@/icons/device/run/height.png'), obj: 'height' }
      ],
      // 下拉设备列表
      deviceList: []
    }
  },
  computed: {
    drops() {
      return this.$store.state.device.drops
    },
    spray() {
      return this.$store.state.device.spray
    },
    weather() {
      return this.$store.state.device.weather
    },
    soil() {
      return this.$store.state.device.soil
    },
    fertilizer() {
      return this.$store.state.device.fertilizer
    },
    canopy() {
      return this.$store.state.device.canopy
    },
    ndvi() {
      return this.$store.state.device.ndvi
    },
    pump() {
      return this.$store.state.device.pump
    },
    height() {
      return this.$store.state.device.height
    }
  },
  methods: {

    // 打开快捷栏
    open() {
      this.state = 'on'
    },

    // 关闭快捷栏
    close() {
      this.state = 'off'
    },

    // 转换
    onOff() {
      if (this.state === 'off') {
        this.open()
      } else {
        this.close()
      }
    },

    // 返回对象长度>0的布尔值
    deviceLen(name) {
      // 有设备显示下拉箭头
      if (!this.closeState) {
        if (this[name].length > 0) {
          this.closeState = true
        }
      }
      return this[name].length > 0
    },

    /**
     * 填充设备列表
     * @param { String } device 设备对象名称
     */
    setDevice(device) {
      this.deviceList = this[device]
      this.open()
    },

    /* 快捷菜单控制设备 */
    touch(item) {
      const config = this.$config
      switch (item.dclass) {
        case config.DROPS_CLASS:
          this.$store.dispatch('control/dropDevice', item)
          this.$store.dispatch('control/dropShow', true)
          break
        case config.SPRAY_CLASS:
          this.$store.dispatch('control/sprayDevice', item)
          this.$store.dispatch('control/sprayShow', true)
          break
        case config.FERTILIZER_CLASS:
          this.$store.dispatch('control/ferDevice', item)
          this.$store.dispatch('control/ferShow', true)
          break
        case config.PUMP_CLASS:
          this.$store.dispatch('control/pumpDevice', item)
          this.$store.dispatch('control/pumpShow', true)
          break
        case config.SOIL_CLASS:
          this.$store.dispatch('control/dataPanelObj', item)
          this.$store.dispatch('control/dataPanelShow', true)
          break
        case config.CANOPY_CLASS:
          this.$store.dispatch('control/dataPanelObj', item)
          this.$store.dispatch('control/dataPanelShow', true)
          break
        case config.NDVI_CLASS:
          this.$store.dispatch('control/dataPanelObj', item)
          this.$store.dispatch('control/dataPanelShow', true)
          break
        case config.HEIGHT_CLASS:
          this.$store.dispatch('control/dataPanelObj', item)
          this.$store.dispatch('control/dataPanelShow', true)
          break
        default:
          break
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@mixin keyframes($animationName) {
    @-webkit-keyframes #{$animationName} {
        @content;
    }
    @-moz-keyframes #{$animationName} {
        @content;
    }
    @-o-keyframes #{$animationName} {
        @content;
    }
    @keyframes #{$animationName} {
        @content;
    }
}
.quick-container{
    width: 620px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #FFFFFF;
    overflow: hidden;
    & .quick__box--item{
        width: 12%;
        flex-grow: 1;
        flex-shrink: 1;
        background-color: #FFFFFF;
        padding: 10px;
        box-sizing: border-box;
        border-right: 1px solid #DCDFE6;
        cursor: pointer;
        & .img__box{
            width: 45px;
            margin: 0 auto;
            & img{
                width: 100%;
                display: block;
            }
        }
        & .quick__box--title{
            font-size: 14px;
            text-align: center;
            margin-top: 4px;
            color: #333333;
            font-weight: 600;
        }
    }
    & .quick__box--item:nth-last-child(1){
        border: none;
    }
    & .divider{
        width: 1px;
        height: auto;
        margin: 0;
        flex-shrink: 0;
        flex-grow: 0;
    }
    & .divider2{
        margin: 0;
    }
}
.quick__content{
    width: 100%;
    height: 260px;
    overflow: auto;
    & .quick__content--item:hover{
        background-color: #ededed;
    }
    & .quick__content--item{
        padding: 10px 25px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #DCDFE6;
        cursor: pointer;
        & .img_box2{
            width: 28px;
            & img{
                display: block;
                width: 100%;
            }
        }
        & .quick__device--name{
            font-size: 14px;
            padding-left: 12px;
            box-sizing: border-box;
            color: #333333;
        }
    }
}
.off {
    @include keyframes('offBox') {
        0%{
            height: 260px;
        }
        100%{
            height:0px;
        }
    }
    animation: offBox .5s forwards
}
.off + .quick__close > .img_box3{
    transform: rotate(180deg);
}
.on {
    @include keyframes('onBox') {
        0%{
            height: 0;
        }
        100%{
            height: 260px;
        }
    }
    animation: onBox .5s forwards
}
.on + .quick__close > .img_box3{
    transform: rotate(0deg);
}
.quick__close{
    background-color: #f4f4f4;
    padding: 2px 25px;
    box-sizing: border-box;
    cursor: pointer;
    & .img_box3{
        width: 20px;
        margin: 0 auto;
        transition: transform .3s;
        & img{
            width: 100%;
            display: block;
        }
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
