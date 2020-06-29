<template>
  <div class="drops-container">
    <transition name="el-fade-in">
      <div v-show="show" ref="drops" class="drops-box">
        <!-- 顶部按钮 -->
        <el-row class="drops__top">
          <el-col :span="2" :offset="22" class="drops__icon">
            <el-tooltip content="全屏">
              <svg-icon icon-class="fullscreen" @click="full" />
            </el-tooltip>
            <el-tooltip content="关闭">
              <svg-icon icon-class="close" class="drops__icon--close" @click="closeDrops" />
            </el-tooltip>
          </el-col>
        </el-row>
        <!-- 滴灌阀门部分go -->
        <el-row v-show="dropValve.length > 0" :gutter="6" align="middle" class="drops__pt">
          <el-col :span="4">
            <div>灌区喷头</div>
          </el-col>
        </el-row>
        <div v-for="(dgValve, idx) in dropValve" :key="'dg'+idx" class="dgzzle">
          <div class="dgzzle__heder">
            <div class="drops__title">{{ dgValve[0].pname }}</div>
            <transition name="el-fade-in">
              <el-button v-show="(subValve[idx]) && (subValve[idx].length != 0)" type="primary" size="mini" class="dgzzle__btn" round @click="multi(idx)">控制已选中</el-button>
            </transition>
          </div>
          <el-row v-for="(item,index) in groups = valveCtrGroup(dgValve)" :key="'pt'+index" type="flex" :gutter="20" class="drops__row">
            <el-col :lg="4" :sm="2" :xs="2">
              <div class="drops__imgBox">
                <img src="@/icons/device/run/fm.png" alt="阀门图标">
              </div>
              <div class="drops__name">{{ item[0].areaName }}</div>
            </el-col>
            <el-col :lg="20" :sm="22" :xs="22">
              <el-row :gutter="10">
                <el-col v-for="attr in item" :key="attr.spraySerialno" :lg="valveSpan" :md="3" :sm="4" :xs="6" class="drops__col__mb menux" @dblclick.native="control([attr])">
                  <div class="drops__imgBox drops__imgBox2 pointer">
                    <img :src="attr.icon" alt="阀门图标">
                  </div>
                  <div class="drops__attr drops__attr2 pointer">{{ attr.dname }}</div>
                </el-col>
              </el-row>
              <el-divider class="drops__divider" />
            </el-col>
          </el-row>
        </div>
        <!-- 滴灌阀门部分end -->
      </div>
    </transition>
    <!-- 阀门控制对话框go -->
    <el-dialog :visible.sync="dialog" class="dialog" width="570px">
      <el-tag v-for="(item, index) in ctrlDev" :key="item.idx" effect="dark" class="tag" closable @close="delValve(index)">
        {{ '阀门0'+item.idx }}
      </el-tag>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeValve">关 阀</el-button>
        <el-button type="primary" @click="openValve">开 阀</el-button>
      </span>
    </el-dialog>
    <!-- 阀门控制对话框end -->
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
import { drag } from '@/utils/drag'
import { action } from '@/api/deviceControl'
import command from '@/utils/command'
import { debounce } from '@/utils'
export default {
  data() {
    return {
      // 全屏模式下：喷头lg列数
      valveSpan: 4,
      // 是否全屏显示面板
      fullScreen: false,
      // 每个滴灌分区框选的喷头(二维)
      subValve: [],
      // 选择要进行操控的喷头
      ctrlDev: [],
      // 控制对话框显示隐藏
      dialog: false,
      // 指令发送结构
      tip: {
        success: '指令已发送',
        error: '指令发送失败'
      }
      /* dropValve: [
        [{ pname: '滴灌--test', serialno: '0104.0007.2019001000', rtuPort: 1, pserialno: '0104.0007.201900199', areaId: 1, areaName: '片区1',
          icon: require('@/icons/device/close/fm.png') },
        { pname: '滴灌--test', serialno: '0104.0007.2019001001', rtuPort: 2, pserialno: '0104.0007.201900199', areaId: 1, areaName: '片区1',
          icon: require('@/icons/device/close/fm.png') }]
      ] */
    }
  },
  computed: {
    // 滴灌面板的显示隐藏
    show() {
      return this.$store.state.control.dropShow
    },
    // 滴灌阀门
    dropValve() {
      return this.$store.state.device.dropsValve
    }
  },
  watch: {
    dropValve: function() {
      this.$nextTick(() => {
        drag('dgzzle', 'menux', (list, dom) => {
          const group = this.valveCtrGroup(this.dropValve[dom])
          let len = []
          for (let j = 0; j < group.length; j++) {
            len = len.concat(group[j])
          }
          const ctrlDev = []
          for (let i = 0; i < list.length; i++) {
            ctrlDev.push(len[list[i]])
          }
          this.$set(this.subValve, dom, ctrlDev)
        })
      })
    }
  },
  mounted() {
    // 拖动
    new Draggabilly('.drops-box', {
      containment: '.device-container'
    })
  },
  methods: {

    /**
     * 全屏展示该组件
     */
    full() {
      const deom = this.$refs.drops
      if (!this.fullScreen) {
        deom.classList.add('animation')
        deom.setAttribute('style', 'top:0; left:0; width:100%; max-height:100%; height:100%; border-radius:0; z-index: 10;')
        this.valveSpan = 2
        this.fullScreen = true
      } else {
        deom.removeAttribute('style')
        const time = setTimeout(() => {
          deom.classList.remove('animation')
          clearTimeout(time)
        }, 300)
        this.valveSpan = 4
        this.fullScreen = false
      }
    },

    /**
     * 寻找数组前n项长度
     * @param { Array } array 数组
     * @param { Number } n 前几项
     * @return { Number } 前n项长度
     */
    length(array, n) {
      let len = 0
      for (var i = 0; i <= n; i++) {
        len += array[i].length
      }
      return len
    },

    closeDrops() {
      this.$store.dispatch('control/dropShow', false)
    },

    /**
     * 按区域给阀门分组
     * @param { Array } valve 阀门组
     */
    valveCtrGroup(valve) {
      const areaId = []
      const valveGrop = []
      valve.forEach((el, index) => {
        const indexOf = areaId.indexOf(el.areaId)
        if (indexOf >= 0) {
          valveGrop[indexOf].push(el)
        } else {
          areaId.push(el.areaId)
          valveGrop.push([el])
        }
      })
      return valveGrop
    },

    /**
     * 喷头控制
     * @param { Array } device 需控制的设备列表
     */
    control(device) {
      const [...control] = device
      this.ctrlDev = control
      this.dialog = true
    },

    /**
     * 框选多开事件
     * @param { Number } index 喷灌机序号
    */
    multi(index) {
      if (this.subValve[index].length === 0) {
        this.$message({
          message: '至少选取一个阀门',
          type: 'warning'
        })
        return
      }
      this.control(this.subValve[index])
    },

    /**
     * 去除已选喷头
     * @param { Number } index 喷头序号
     */
    delValve(index) {
      this.ctrlDev.splice(index, 1)
    },

    /**
     * 成功提示框
     * @param { String } text 可选,提示性文字
     */
    success: debounce(function(text) {
      this.$notify.success({
        title: '成功',
        message: text || this.tip.success
      })
    }, 500, false),

    /**
     * 错误提示框
     * @param { String } text 可选,提示性文字
     */
    error: debounce(function(text) {
      this.$notify.error({
        title: '错误',
        message: text || this.tip.error
      })
    }, 500, false),

    /**
     * 喷头发送控制指令（单纯的提取一下）
     * @param { Object } valve 喷头对象
     * @param { String } mode 指令(打开或者关闭)
     */
    ctrlValve(valve, mode) {
      action({
        serialno: valve.rtuSerialno,
        actions: [{
          namekey: mode + valve.rtuPort,
          params: true
        }]
      }).then((e) => {
        this.success()
      }).catch((e) => {
        this.error()
      })
    },

    /**
     * 喷头关闭动作
     */
    closeValve() {
      const ctrlDev = this.ctrlDev
      ctrlDev.forEach((el) => {
        this.ctrlValve(el, command.closeValve)
      })
      this.dialog = false
    },

    /**
     * 喷头开启动作
     */
    openValve() {
      const ctrlDev = this.ctrlDev
      ctrlDev.forEach((el) => {
        this.ctrlValve(el, command.openValve)
      })
      this.dialog = false
    }

  }
}
</script>

<style lang="scss" scoped>
@mixin nowrap {
  display: -webkit-box;
  display: -o-box;
  display: -moz-box;
  display: -ms-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -o-line-clamp: 1;
  -moz-line-clamp: 1;
  -ms-line-clamp: 1;
  -webkit-box-orient: vertical;
  -o-box-orient: vertical;
  -moz-box-orient: vertical;
  -ms-box-orient: vertical;
}
.animation {
  transition: all .3s linear;
}
.drops-box {
    background-color: rgba($color: #FFFFFF, $alpha: 0.9);
    width: 600px;
    max-height: 85%;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 12px;
    position: absolute;
    top: 60px;
    right: 10px;
    padding: 10px;
    box-sizing: border-box;
    & .drops__top {
      width: 100%;
      top: 0;
      & .drops__icon {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
        color: #666;
        cursor: pointer;
        & .drops__icon--close{
            font-size:23px;
            margin-left: 10px;
        }
      }
    }
    & .drops__pt{
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding: 10px 0px 10px 10px;
      box-sizing: border-box;
    }
    & .drops__title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding: 10px 0px 10px 10px;
      box-sizing: border-box;
    }
    & .drops__row {
        margin: 10px 0;
        & .drops__col__mb{
            margin-bottom: 12px;
        }
        & .selected > .drops__attr{
          color: #409EFF;
          font-weight: 600;
        }
        & .drops__value {
            font-size: 15px;
            color: #333333;
            margin-bottom: 2px;
            font-weight: 600;
            @include nowrap
        }
        & .drops__attr {
            font-size: 14px;
            color: #666666;
            @include nowrap
        }
        & .drops__attr2 {
            text-align: center;
            cursor: pointer;
        }
        & .drops__divider {
            margin: 10px 0;
        }
    }
    & .drops__imgBox {
      margin: 0 auto;
      width: 36px;
      & img {
        display: block;
        width: 100%;
      }
    }
    & .drops__imgBox2 {
      width: 30px;
    }
    & .drops__name {
      padding-top: 4px;
      font-size: 14px;
      text-align: center;
    }
    & .pointer{
      cursor: pointer;
    }
    & .dgzzle__heder{
      display: flex;
      align-items: center;
      & .dgzzle__btn{
        margin-left: 20px;
      }
    }
}
.dialog {
  & .tag{
    margin: 0 5px 5px 5px;
  }
}
</style>
