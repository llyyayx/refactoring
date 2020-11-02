<template>
  <Panel :sub-class="'spray-container'" :child-class="'spray-box'" :show="show" @close="closeSpray" @full="full">
    <div slot="main">
      <!-- 喷灌机部分go -->
      <div v-show="spray.length > 0" class="spray__title">喷灌机</div>
      <el-row v-for="(item,index) in screenSpray(spray, sprayDevice)" :key="index" type="flex" :gutter="20" class="spray__row">
        <el-col :lg="4" :sm="2" :xs="2" @dblclick.native="sprayCtrl(item)">
          <div class="spray__imgBox pointer">
            <img :src="item.icon" alt="喷灌机图标">
          </div>
          <div class="spray__name pointer">{{ item.dname }}</div>
        </el-col>
        <el-col :lg="20" :sm="22" :xs="22">
          <el-row :gutter="10">
            <el-col v-for="(attr,index2) in item.attr" :key="index2" :lg="pgSpan" :md="3" :sm="4" :xs="6" class="spray__col__mb">
              <div class="spray__value">{{ attr.val + attr.unit }}</div>
              <div class="spray__attr">{{ attr.name }}</div>
            </el-col>
          </el-row>
          <el-divider class="spray__divider" />
        </el-col>
      </el-row>
      <!-- 喷灌机部分end -->
      <!-- 灌机喷头部分go -->
      <el-row v-show="sprayValve.length > 0" :gutter="6" align="middle" class="spray__pt">
        <el-col :span="4">
          <div>灌机喷头</div>
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="value"
            active-text="阀控划分"
            inactive-text="按跨划分"
            inactive-color="#13ce66"
          />
        </el-col>
      </el-row>
      <!-- 喷头主体 -->
      <div v-for="(pgValve, idx) in screenValve(sprayValve, sprayDevice)" :key="'pg'+idx" class="nozzle">
        <el-row class="nozzle__heder">
          <el-col :span="4" class="spray__title">{{ pgValve[0].pname }}</el-col>
          <el-col :span="20">
            <el-button-group class="nozzle__heder--pwm">
              <el-button type="primary" round size="mini" class="nozzle__heder--btn" @click="pwmSwitch(pgValve, true)">打开脉冲</el-button>
              <el-button type="primary" round size="mini" class="nozzle__heder--btn" @click="pwmSwitch(pgValve, false)">关闭脉冲</el-button>
              <el-button type="primary" round size="mini" class="nozzle__heder--btn" @click="pwmState">刷新状态</el-button>
            </el-button-group>
            <transition name="el-fade-in">
              <el-button v-show="(subValve[idx]) && (subValve[idx].length != 0)" type="primary" size="mini" class="nozzle__heder--btn nozzle__lf" round @click="multi(idx)">控制已选中</el-button>
            </transition>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in groups = valveCtrGroup(pgValve)" :key="'pt'+index" type="flex" :gutter="20" class="spray__row">
          <el-col :lg="4" :sm="2" :xs="2">
            <div class="spray__imgBox" @dblclick="ctrOn(item)">
              <img src="@/icons/device/run/fm.png" alt="喷头图标">
            </div>
            <div class="spray__name">{{ value ? item[0]['descri'] : kNmae(item, index) }}</div>
            <div v-show="value" class="spary_dk">
              <el-dropdown @command="singleRef">
                <el-button type="primary" size="mini">
                  单控
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{action:'on', device: item}">打开脉冲</el-dropdown-item>
                  <el-dropdown-item :command="{action:'off', device: item}">关闭脉冲</el-dropdown-item>
                  <el-dropdown-item :command="{action:'ref', device: item}">刷新状态</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :lg="20" :sm="22" :xs="22">
            <el-row :gutter="10">
              <el-col v-for="attr in item" :key="attr.spraySerialno" :lg="valveSpan" :md="3" :sm="4" :xs="6" class="spray__col__mb menux" @dblclick.native="control([attr])">
                <div class="spray__imgBox spray__imgBox2 pointer">
                  <img :src="attr.icon" alt="喷头图标">
                </div>
                <div class="spray__attr spray__attr2 pointer">{{ '喷头0' + attr.idx }}</div>
                <div class="spray__attr spray__attr2 pointer">
                  <span v-for="vat in attr.attr" v-show="vat.mark==='valveCycle' || vat.mark==='valveRadio'" :key="vat.mark">
                    {{ vat.val+vat.unit }}{{ vat.mark === 'valveCycle' ? ' | ' : '' }}
                  </span>
                </div>
              </el-col>
            </el-row>
            <el-divider class="spray__divider" />
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 灌机喷头部分end -->
    <div slot="dialog">
      <!-- 喷头控制对话框go -->
      <el-dialog :visible.sync="dialog" class="dialog" width="570px">
        <el-tabs type="border-card" class="dialog__tabs" @tab-click="valveMode">
          <el-tab-pane label="常开常关" />
          <el-tab-pane label="脉冲模式">
            <el-row class="demo-input-suffix" type="flex" align="middle">
              <el-col :span="3" :xl="3" :md="5">脉冲周期</el-col>
              <el-col :span="12" :xl="12" :md="15" :offset="1">
                <el-input v-model="cycle" placeholder="请输入脉冲周期" maxlength="4" show-word-limit @input="cyclePut">
                  <template slot="append">秒</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row class="demo-input-suffix" type="flex" align="middle">
              <el-col :span="3" :xl="3" :md="5">占空比</el-col>
              <el-col :span="12" :xl="12" :md="15" :offset="1">
                <el-input v-model="ratio" placeholder="请输入占空比" maxlength="3" show-word-limit @input="ratioPut">
                  <template slot="append">%</template>
                </el-input>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tag v-for="(item, index) in ctrlDev" :key="item.idx" effect="dark" class="tag" closable @close="delValve(index)">
            {{ '喷头0'+item.idx }}
          </el-tag>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <div v-show="mode==='manual'">
            <el-button @click="closeValve">关 阀</el-button>
            <el-button type="primary" @click="openValve">开 阀</el-button>
          </div>
          <div v-show="mode==='auto'">
            <el-button @click="setPwm">设 置</el-button>
          </div>
        </span>
      </el-dialog>
      <!-- 喷头控制对话框end -->
      <!-- 喷灌机控制对话框go -->
      <el-dialog :visible.sync="sprayDialog" width="570px">
        <div class="coler__box">
          <div v-for="(item, index) in sprayCtr" v-show="sprayObj.controlItem ? sprayObj.controlItem.includes(item.mark) : true" :key="index" class="coler">
            <div class="colf">{{ item.name }}</div>
            <div class="corg">
              <el-button-group>
                <el-button v-for="item2 in item.selete" :key="item2.label" size="small" @click="sprayModel(item2.label, index)">{{ item2.title }}</el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <div v-show="sprayObj.controlItem ? sprayObj.controlItem.includes('sprayPwm') : true" class="coler">
          <div class="colf">行走速率</div>
          <div class="corg" style="width: 100%">
            <el-slider v-model="rate" @change="sprayRate" />
          </div>
        </div>
      </el-dialog>
      <!-- 喷灌机控制对话框end -->
    </div>
  </Panel>
</template>

<script>
import Panel from '@/components/Panel'
import { drag } from '@/utils/drag'
import { action } from '@/api/deviceControl'
import { debounce } from '@/utils'
import state from '../mixins/state'
export default {
  components: {
    Panel
  },
  mixins: [state],
  data() {
    return {
      // 用于判断分类模式：跨 || 阀控
      value: false,
      // 全屏模式下：灌机属性lg列数
      pgSpan: 4,
      // 全屏模式下：喷头lg列数
      valveSpan: 4,
      // 框选的喷灌机序号(唯一)
      subPray: -1,
      // 每个喷灌机框选的喷头(二维)
      subValve: [],
      // 喷头控制对话框显示隐藏
      dialog: false,
      // 喷灌机对话框显示隐藏
      sprayDialog: false,
      // 喷头模式
      mode: 'manual',
      // 脉冲模式下的周期
      cycle: 60,
      // 脉冲模式下的占空比
      ratio: 50,
      // 选择要进行操控的喷头
      ctrlDev: [],
      // 选择准备控制的喷灌机
      sprayObj: {},
      // 喷灌机模式
      sprayCtr: [
        { name: '行进方向', value: '0', selete: [{ title: '正向', label: 'positive' }, { title: '反向', label: 'reverse' }], mark: 'direction' },
        { name: '灌机控制', value: '0', selete: [{ title: '启动', label: 'openSpray' }, { title: '停止', label: 'closeSpray' }], mark: 'sprayRun' },
        { name: '行进方式', value: '0', selete: [{ title: '有水', label: 'haveWater' }, { title: '无水', label: 'noWater' }], mark: 'mode' },
        { name: '尾枪设置', value: '0', selete: [{ title: '打开', label: 'openGun' }, { title: '关闭', label: 'closeGun' }], mark: 'gunSetting' },
        { name: '控制模式', value: '1', selete: [{ title: '手动', label: 1 }, { title: '自动', label: 2 }], mark: 'plan' }
      ],
      // 喷灌机行走速率
      rate: 100,
      // 指令发送结构
      tip: {
        success: '指令已发送',
        error: '指令发送失败'
      }
    }
  },
  computed: {
    // 喷灌面板的显示隐藏
    show() {
      return this.$store.state.control.sprayShow
    },
    spray() {
      return this.$store.state.device.spray
    },
    sprayValve() {
      return this.$store.state.device.sprayValve
    },
    sprayDevice() {
      return this.$store.state.control.sprayDevice
    }
  },
  watch: {
    sprayDevice: function() {
      this.$nextTick(() => {
        drag('nozzle', 'menux', (list, dom) => {
          const group = this.valveCtrGroup(this.sprayValve[dom])
          let len = []
          for (let j = 0; j < group.length; j++) {
            len = len.concat(group[j])
          }
          const ctrlDev = []
          for (let i = 0; i < list.length; i++) {
            ctrlDev.push(len[list[i]])
          }
          this.subPray = dom
          this.$set(this.subValve, dom, ctrlDev)
        })
      })
    }
  },
  methods: {

    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      console.log(this.$store.state.device.spray)
      console.log(this.$store.state.device.sprayValve)
      if (fullScreen) {
        this.pgSpan = 2
        this.valveSpan = 2
      } else {
        this.pgSpan = 4
        this.valveSpan = 4
      }
    },

    // 关闭面板的回调事件
    closeSpray() {
      this.$store.dispatch('control/sprayShow', false)
    },

    /**
     * 筛选出选择的喷灌机
     * @param { Array } device 喷灌机集合
     * @param { Object } condition 选择的喷灌机对象
     * @return { Array } 筛选结果
     */
    screenSpray(device, condition) {
      const array = []
      device.forEach((el) => {
        if (el.serialno === condition.serialno) {
          array.push(el)
        }
      })
      return array
    },

    /**
     * 筛选出选择的喷灌机的喷头
     * @param { Array } device 喷头集合
     * @param { Object } condition 选择的喷灌机对象
     * @return { Array } 筛选结果
     */
    screenValve(device, condition) {
      const array = []
      device.forEach((el) => {
        if (el[0].pSerialno === condition.serialno) {
          array.push(el)
        }
      })
      return array
    },

    /**
     * 方法：数组对象按属性分组
     * @param { Array } array 数组里边是对象
     * @param { String } attr 属性名称
     * @return { Array } 分好组的数组，格式: [[{}],[{}]]
     */
    group(array, attr) {
      // 存放现有循环的阀控
      const existing = []
      // 按喷头分组的存放
      const group = []
      array.forEach((el) => {
        const index = existing.indexOf(el[attr])
        if (index < 0) {
          existing.push(el[attr])
          group.push([el])
        } else {
          group[index].push(el)
        }
      })
      return group
    },

    /**
     * 根据跨或者阀控器进行分组
     * @param { Array } valve 要进行分组的灌机喷头
     * @return { Array } 分好组的数组，格式: [[{}],[{}]]
     */
    valveCtrGroup(valve) {
      const attr = this.value ? 'rtuSerialno' : 'ctlGroup'
      return this.group(valve, attr)
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
     * 验证输入周期
     * @param { String } e 需验证的输入
     */
    cyclePut(e) {
      const reg = /^[0-9]*$/
      if (!reg.test(e)) {
        this.cycle = ''
        this.$message({
          message: '只能输入纯数字',
          type: 'warning'
        })
      }
    },

    /**
     * 验证输入占空比
     * @param { String } e 需验证的输入
     */
    ratioPut(e) {
      const reg = /^[0-9]*$/
      if (!reg.test(e)) {
        this.ratio = ''
        this.$message({
          message: '只能输入纯数字',
          type: 'warning'
        })
      }
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
     * @param { String } namekey 指令
     * @param { String } params 指令参数
     * @param { Funcion } actions 自定义指令数据
     * @param { Boolean } port namekey后是否接喷头序号，true接false不接
     */
    ctrlValve(valve, namekey, params, actions, port = true) {
      let array
      if (Object.prototype.toString.call(actions) === '[object Function]') {
        array = actions(namekey, params)
      } else {
        array = [{
          namekey: namekey + (port ? valve.port : ''),
          params: params
        }]
      }
      action({
        serialno: valve.rtuSerialno,
        actions: array
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
        this.ctrlValve(el, el.command.closeValve.nameKey, el.command.closeValve.params(), el.command.closeValve.actions)
      })
      this.dialog = false
    },

    /**
     * 喷头开启动作
     */
    openValve() {
      const ctrlDev = this.ctrlDev
      ctrlDev.forEach((el) => {
        this.ctrlValve(el, el.command.openValve.nameKey, el.command.openValve.params(), el.command.openValve.actions)
      })
      this.dialog = false
    },

    /**
     * 设置this.mode喷头模式
     * @param { Object } e tab点击事件，index代表模式
     */
    valveMode(e) {
      var index = parseInt(e.index)
      if (index === 1) {
        this.mode = 'auto'
      } else if (index === 0) {
        this.mode = 'manual'
      }
    },

    /**
     * 设置脉冲占空比
     */
    setPwm() {
      const ctrlDev = this.ctrlDev
      ctrlDev.forEach((el) => {
        this.ctrlValve(el, el.command.setPwm.nameKey, el.command.setPwm.params(this.cycle, this.ratio), el.command.closeValve.actions)
      })
      this.dialog = false
    },

    /**
     * 打开喷灌机对话框
     * @param { Object } item 喷灌机对象
     */
    sprayCtrl(item) {
      this.sprayDialog = true
      this.sprayObj = item
    },

    /**
     * 喷灌机发送控制指令（单纯的提取一下）
     * @param { String } namekey 指令
     * @param { String || Number } params 参数
     * @param { Boolean || Function } actions 多指令控制
     */
    ctrlSpray(namekey, params, actions) {
      let array
      if (Object.prototype.toString.call(actions) === '[object Function]') {
        array = actions(namekey, params)
      } else {
        array = [{
          namekey: namekey,
          params: params
        }]
      }
      action({
        serialno: this.sprayObj.serialno,
        actions: array
      }).then((e) => {
        this.success()
      }).catch((e) => {
        this.error()
      })
    },

    /**
     * 喷灌机控制项-筛选对应
     * @param { String } 控制项的label
     * @param { Number } 选择的第几项
     */
    sprayModel(val, index) {
      this.sprayCtr[index].value = val
      const command = this.sprayObj.command
      this.ctrlSpray(command[val].nameKey, command[val].params(), command[val].actions)
    },

    /**
     * 喷灌机行走速率设置
     * @param { Number } 速率值
     */
    sprayRate(val) {
      const command = this.sprayObj.command
      this.$confirm('您确定把行走速率设置为' + val + '% ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.ctrlSpray(command.sprayPwm.nameKey, command.sprayPwm.params(val), command.sprayPwm.actions)
      }).catch(() => {
        this.rate = val
      })
    },

    /**
     * 查找主设备下的阀控器
     * @param { Array } 主设备喷头
     * @param { String } 喷头的阀控标识
     */
    controller(valve, mark) {
      // 存放现有循环的阀控
      const existing = []
      valve.forEach((el) => {
        const state = existing.includes(el[mark])
        if (!state) {
          existing.push(el[mark])
        }
      })
      return existing
    },

    /**
     * 喷头阀控打开关闭脉冲
     * @param { Array } 要切换的喷头列表，函数内会寻找喷头对应的阀控器
     * @param { Boolean } state 状态：打开true 关闭false
     */
    pwmSwitch(pgValve, state) {
      const control = this.controller(pgValve, 'rtuSerialno')
      const command = pgValve[0].command
      let nameKey, params
      if (state) {
        nameKey = command.openPwm.nameKey
        params = command.openPwm.params()
      } else {
        nameKey = command.closePwm.nameKey
        params = command.closePwm.params()
      }
      control.forEach((el) => {
        action({
          serialno: el,
          actions: [{
            namekey: nameKey,
            params: params
          }]
        }).then((e) => {
          this.success()
        }).catch((e) => {
          this.error()
        })
      })
    },

    // 刷新脉冲
    pwmState() {
      this.sprayValvePwm(this.sprayDevice)
      this.success('刷新状态成功')
    },

    /**
     * 单控刷新
     * @param { Object } obj 参数对象
     * obj.action { String } 用户选择的模式，ref刷新状态/on打开脉冲/关闭脉冲
     * obj.device { Array } 阀控器下的喷头
     */
    singleRef(obj) {
      const device = obj.device[0]
      switch (obj.action) {
        case 'ref':
          this.ctrlValve(device, device.command.refPwm.nameKey, device.command.refPwm.params(), device.command.refPwm.actions)
          break
        case 'on':
          this.ctrlValve(device, device.command.openPwm.nameKey, device.command.openPwm.params(), device.command.openPwm.actions, false)
          break
        case 'off':
          this.ctrlValve(device, device.command.closePwm.nameKey, device.command.closePwm.params(), device.command.closePwm.actions, false)
          break
      }
    },

    /**
     * 阀控器 || 跨，双击事件
     * @param { Array } device 阀控器(跨)下的喷头
     */
    ctrOn(device) {
      this.ctrlDev = device
      this.dialog = true
    },

    /**
     * 设置跨名称
     * @param { Object } item 当前跨设备
     * @param { Number } index 当前跨序号(v-for从0开始的)
     */
    kNmae(item, index) {
      let name = ''
      switch (item[0].ctlGroup) {
        case 99: name = '悬臂'; break
        case 100: name = '尾枪'; break
        default: name = '第' + (index - 1 + 2) + '跨'
      }
      return name
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

.spray__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px 0px 10px 10px;
  box-sizing: border-box;
}
.spray__name {
  padding-top: 4px;
  font-size: 14px;
  text-align: center;
  color: #333;
}
.spary_dk {
  text-align: center;
  font-size: 14px;
  position: relative;
  & ul {
    position: absolute;
    top: 0;
    right: -50px;
    display: none;
    z-index: 9;
    & li {
      width: 50px;
      height: 30px;
      line-height: 30px;
      color: #FFF;
      background-color: #409EFF;
    }
  }
  & ul , li {
    padding:0;
    margin:0;
    list-style:none;
  }
}
.spary_dk:hover ul{
  display: block;
}
.spray__row {
    margin: 10px 0;
    & .spray__col__mb{
        margin-bottom: 12px;
    }
    & .selected > .spray__attr{
      color: #409EFF;
      font-weight: 600;
    }
    & .spray__value {
        font-size: 15px;
        color: #333333;
        margin-bottom: 2px;
        font-weight: 600;
        @include nowrap
    }
    & .spray__attr {
        font-size: 14px;
        color: #666666;
        @include nowrap
    }
    & .spray__attr2 {
        text-align: center;
        cursor: pointer;
    }
    & .spray__divider {
        margin: 10px 0;
    }
}
.spray__imgBox {
  margin: 0 auto;
  width: 36px;
  & img {
    display: block;
    width: 100%;
  }
}
.pointer{
  cursor: pointer;
}
.spray__imgBox2 {
  width: 30px;
}
.spray__pt{
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px 0px 10px 10px;
  box-sizing: border-box;
}
.nozzle__heder{
  display: flex;
  align-items: center;
  & .nozzle__heder--pwm{
    margin-left: 10px;
  }
  & .nozzle__heder--btn{
    padding: 7px 7px;
  }
  & .nozzle__lf{
    margin-left: 20px;
  }
}

.demo-input-suffix{
  margin-bottom: 10px;
}

.dialog {
  & .el-dialog__body {
    & .dialog__tabs {
     box-shadow: inherit;
     & .tag{
       margin: 0 5px 5px 5px;
     }
    }
  }
}

.coler__box{
  display: flex;
  flex-wrap: wrap;
}
.coler{
  display: flex;
  margin-right: 40px;
  align-items: center;
  margin-bottom: 20px;
  & .colf{
    margin-right: 15px;
    font-size: 14px;
    flex-shrink: 0;
    font-weight: 600;
    color: #333
  }
}
</style>
