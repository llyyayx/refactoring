<template>
  <Panel :sub-class="'pump-container'" :child-class="'pump-box'" :show="show" @close="closeDrops" @full="full">
    <div slot="main">
      <el-row v-for="(item,index) in screenPump(pump, pumpDevice)" :key="index" type="flex" :gutter="20" class="pump__row">
        <el-col :lg="4" :sm="2" :xs="2" @dblclick.native="pumpCtrl(item)">
          <div class="pump__imgBox pointer">
            <img :src="item.icon" alt="水泵图标">
          </div>
          <div class="pump__name pointer">{{ item.dname }}</div>
        </el-col>
        <el-col :lg="20" :sm="22" :xs="22">
          <el-row :gutter="10">
            <el-col v-for="(attr,index2) in item.attr" :key="index2" :lg="pumpSpan" :md="3" :sm="4" :xs="6" class="pump__col__mb">
              <div class="pump__value">{{ attr.val + attr.unit }}</div>
              <div class="pump__attr">{{ attr.name }}</div>
            </el-col>
          </el-row>
          <el-divider class="pump__divider" />
          <div class="pump__box">
            <el-tabs type="border-card" class="tabs" @tab-click="pumpMode">
              <el-tab-pane v-if="item.controlItem ? item.controlItem.includes('gp') : true" label="工频模式" />
              <el-tab-pane v-if="item.controlItem ? item.controlItem.includes('bp') : true" label="变频模式">
                <div class="pump__box--col">
                  <div class="pump__box--name">运行方式：</div>
                  <el-radio-group v-model="stateMode" size="mini">
                    <el-radio label="1" border>手动</el-radio>
                    <el-radio label="2" border>自动</el-radio>
                  </el-radio-group>
                </div>
                <div v-show="stateMode==='1'" class="pump__box--col">
                  <div class="pump__box--name">频率设定：</div>
                  <el-input v-model="frequency" class="pump__box--input" placeholder="请输入运行频率" maxlength="4" show-word-limit @input="verify">
                    <template slot="append">Hz</template>
                  </el-input>
                </div>
                <div v-show="stateMode==='2'" class="pump__box--col">
                  <div class="pump__box--name">压力设定：</div>
                  <el-input v-model="pressure" class="pump__box--input" placeholder="请输入运行压力" maxlength="4" show-word-limit @input="verify">
                    <template slot="append">MPa</template>
                  </el-input>
                </div>
              </el-tab-pane>
              <el-row>
                <el-button type="primary" size="small" @click="openPump(item)">打开水泵</el-button>
                <el-button type="primary" size="small" @click="closePump(item)">关闭水泵</el-button>
              </el-row>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </Panel>
</template>

<script>
import Panel from '@/components/Panel'
import { action } from '@/api/deviceControl'
import { debounce } from '@/utils'
export default {
  components: {
    Panel
  },
  data() {
    return {
      pumpSpan: 4,
      // 水泵模式 0工频 1变频
      mode: 0,
      // 水泵变频模式下的运行方式 1手动2自动
      stateMode: '1',
      // 水泵变频模式下-频率
      frequency: '',
      // 水泵变频模式下-压力
      pressure: '',
      // 指令发送结构
      tip: {
        success: '指令已发送',
        error: '指令发送失败'
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.control.pumpShow
    },
    // 所有水泵
    pump() {
      return this.$store.state.device.pump
    },
    // 当前控制的水泵
    pumpDevice() {
      return this.$store.state.control.pumpDevice
    }
  },
  methods: {
    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      if (fullScreen) {
        this.pumpSpan = 2
      } else {
        this.pumpSpan = 4
      }
    },

    // 关闭面板的回调事件
    closeDrops() {
      this.$store.dispatch('control/pumpShow', false)
    },

    /**
     * 筛选出选择的喷灌机
     * @param { Array } device 喷灌机集合
     * @param { Object } condition 选择的喷灌机对象
     * @return { Array } 筛选结果
     */
    screenPump(device, condition) {
      const array = []
      device.forEach((el) => {
        if (el.serialno === condition.serialno) {
          array.push(el)
        }
      })
      return array
    },

    /**
     * 设置this.mode水泵模式
     * @param { Object } e tab点击事件，index代表模式
     */
    pumpMode(e) {
      var index = parseInt(e.index)
      this.mode = index
    },

    // 验证数字
    verify(e) {
      const reg = /^[0-9]*$/
      if (!reg.test(e)) {
        this.frequency = ''
        this.pressure = ''
        this.$message({
          message: '只能输入纯数字',
          type: 'warning'
        })
      }
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
     * 水泵发送控制指令（单纯的提取一下）
     * @param { Object } pump 水泵对象
     * @param { String } namekey 指令
     * @param { String || Number } params 参数
     * @param { Boolean || Function } actions 多指令控制
     */
    ctrlPump(pump, namekey, params, actions) {
      let array
      if (Object.prototype.toString.call(actions) === '[object Function]') {
        const val = this.stateMode === '1' ? this.frequency : this.pressure
        array = actions(pump, this.stateMode, val)
      } else {
        array = [{
          namekey: namekey,
          params: params
        }]
      }
      action({
        serialno: pump.serialno,
        actions: array
      }).then((e) => {
        this.success()
      }).catch((e) => {
        this.error()
      })
    },

    /**
     * 开水泵
     * @param { Object } pump 水泵对象
     */
    openPump(pump) {
      // 先判断模式，this.mode等于0工频，等于1变频
      if (this.mode === 0) {
        this.ctrlPump(pump, pump.command.Gp_openPump.nameKey, pump.command.Gp_openPump.params(), pump.command.Gp_openPump.actions)
      } else {
        this.ctrlPump(pump, pump.command.Bp_openPump.nameKey, pump.command.Bp_openPump.params(), pump.command.Bp_openPump.actions)
      }
    },

    /**
     * 关水泵
     * @param { Object } pump 水泵对象
     */
    closePump(pump) {
      if (this.mode === 0) {
        this.ctrlPump(pump, pump.command.Gp_closePump.nameKey, pump.command.Gp_closePump.params(), pump.command.Gp_closePump.actions)
      } else {
        this.ctrlPump(pump, pump.command.Bp_closePump.nameKey, pump.command.Bp_closePump.params(), pump.command.Bp_closePump.actions)
      }
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

.pump__row {
  margin: 10px 0;
  & .pump__col__mb{
      margin-bottom: 12px;
  }
  & .selected > .pump__attr{
    color: #409EFF;
    font-weight: 600;
  }
  & .pump__value {
      font-size: 15px;
      color: #333333;
      margin-bottom: 2px;
      font-weight: 600;
      @include nowrap
  }
  & .pump__attr {
      font-size: 14px;
      color: #666666;
      @include nowrap
  }
  & .pump__attr2 {
      text-align: center;
      cursor: pointer;
  }
  & .pump__divider {
      margin: 10px 0;
  }
  & .pump__name {
    padding-top: 4px;
    font-size: 14px;
    text-align: center;
    color: #333;
  }
  & .pump__imgBox {
    margin: 0 auto;
    width: 36px;
    & img {
      display: block;
      width: 100%;
    }
  }
  & .pump__box {
    & .tabs {
    box-shadow: inherit;
    background: transparent;
      & .tag{
        margin: 0 5px 5px 5px;
      }
    }
    & .pump__box--col {
      display: flex;
      align-items: center;
      margin: 0 0 15px 0;
      & .el-radio {
        margin-right: 10px;
      }
      & .pump__box--input {
        width: 60%;
        & >>> .el-input-group__append {
          width: 70px;
          text-align: center;
        }
      }
      & .pump__box--name {
        font-size: 14px;
        width: 80px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
