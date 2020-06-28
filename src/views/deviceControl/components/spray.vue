<template>
  <div class="spray-container">
    <transition name="el-fade-in">
      <div v-show="show" ref="spray" class="spray-box">
        <!-- 顶部按钮 -->
        <el-row class="spray__top">
          <el-col :span="2" :offset="22" class="spray__icon">
            <el-tooltip content="全屏">
              <svg-icon icon-class="fullscreen" @click="full" />
            </el-tooltip>
            <el-tooltip content="关闭">
              <svg-icon icon-class="close" class="spray__icon--close" @click="closeSpray" />
            </el-tooltip>
          </el-col>
        </el-row>
        <!-- 喷灌机部分go -->
        <div v-show="spray.length > 0" class="spray__title">喷灌机</div>
        <el-row v-for="(item,index) in spray" :key="index" type="flex" :gutter="20" class="spray__row">
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
              active-text="阵列划分"
              inactive-text="按跨划分"
              inactive-color="#13ce66"
            />
          </el-col>
        </el-row>
        <!-- 喷头主体 -->
        <div v-for="(pgValve, idx) in sprayValve" :key="'pg'+idx" class="nozzle">
          <div class="nozzle__heder">
            <div class="spray__title">{{ pgValve[0].pname }}</div>
            <transition name="el-fade-in">
              <el-button v-show="(subValve[idx]) && (subValve[idx].length != 0)" type="primary" size="mini" class="nozzle__btn" round @click="multi(idx)">控制已选中</el-button>
            </transition>
          </div>
          <el-row v-for="(item,index) in groups = valveCtrGroup(pgValve)" :key="'pt'+index" type="flex" :gutter="20" class="spray__row">
            <el-col :lg="4" :sm="2" :xs="2">
              <div class="spray__imgBox">
                <img src="@/icons/device/run/fm.png" alt="喷头图标">
              </div>
              <div class="spray__name">{{ value ? item[0]['descri'] : '第' + ( index -1 + 2 ) + '跨' }}</div>
            </el-col>
            <el-col :lg="20" :sm="22" :xs="22">
              <el-row :gutter="10">
                <el-col v-for="attr in item" :key="attr.spraySerialno" :lg="valveSpan" :md="3" :sm="4" :xs="6" class="spray__col__mb menux" @dblclick.native="control([attr])">
                  <div class="spray__imgBox spray__imgBox2 pointer">
                    <img :src="attr.icon" alt="喷头图标">
                  </div>
                  <div class="spray__attr spray__attr2 pointer">{{ '喷头0' + attr.idx }}</div>
                </el-col>
              </el-row>
              <el-divider class="spray__divider" />
            </el-col>
          </el-row>
        </div>
        <!-- 灌机喷头部分go -->
      </div>
    </transition>
    <!-- 喷头控制对话框go -->
    <el-dialog :visible.sync="dialog" class="dialog" width="570px">
      <el-tabs type="border-card" class="dialog__tabs">
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
        <el-button @click="closeValve">关 阀</el-button>
        <el-button type="primary" @click="openValve">开 阀</el-button>
      </span>
    </el-dialog>
    <!-- 喷头控制对话框end -->
    <!-- 喷灌机控制对话框go -->
    <el-dialog :visible.sync="sprayDialog" width="570px">
      <div class="coler__box">
        <div v-for="(item, index) in sprayCtr" :key="index" class="coler">
          <div class="colf">{{ item.name }}</div>
          <div class="corg">
            <el-radio-group v-model="item.value" size="small" @change="(val) => sprayModel(val,index)">
              <el-radio-button v-for="item2 in item.selete" :key="item2.label" :label="item2.label">{{ item2.title }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="coler">
          <div class="colf">行走速率</div>
          <div class="corg" style="width: 110px">
            <el-slider v-model="rate" @change="sprayRate" />
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 喷灌机控制对话框end -->
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
import command from '@/utils/command'
import { drag } from '@/utils/drag'
import { action } from '@/api/deviceControl'
export default {
  data() {
    return {
      // 用于判断分类模式：跨 || 阀控
      value: false,
      // 全屏模式下：灌机属性lg列数
      pgSpan: 4,
      // 全屏模式下：喷头lg列数
      valveSpan: 4,
      // 是否全屏显示面板
      fullScreen: false,
      // 框选的喷灌机序号(唯一)
      subPray: -1,
      // 每个喷灌机框选的喷头(二维)
      subValve: [],
      // 控制对话框显示隐藏
      dialog: false,
      // 喷灌机对话框显示隐藏
      sprayDialog: false,
      // 脉冲模式下的周期
      cycle: '',
      // 脉冲模式下的占空比
      ratio: '',
      // 选择要进行操控的喷头
      ctrlDev: [],
      // 选择准备控制的喷灌机
      sprayObj: {},
      // 喷灌机模式
      sprayCtr: [
        { name: '灌机控制', value: '0', selete: [{ title: '启动', label: 1 }, { title: '停止', label: 2 }], model: 'state' },
        { name: '运行模式', value: '0', selete: [{ title: '手动', label: 1 }, { title: '自动', label: 2 }], model: 'model' },
        { name: '行进方向', value: '0', selete: [{ title: '正向', label: 1 }, { title: '反向', label: 2 }], model: 'direction' },
        { name: '行进方式', value: '0', selete: [{ title: '有水', label: 1 }, { title: '无水', label: 2 }], model: 'water' },
        { name: '尾枪设置', value: '0', selete: [{ title: '打开', label: 1 }, { title: '关闭', label: 2 }], model: 'gun' }
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
    }
  },
  watch: {
    sprayValve: function() {
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
  mounted() {
    // 拖动
    new Draggabilly('.spray-box', {
      containment: '.device-container'
    })
  },
  methods: {

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
     * 全屏展示该组件
     */
    full() {
      const deom = this.$refs.spray
      if (!this.fullScreen) {
        deom.classList.add('animation')
        deom.setAttribute('style', 'top:0; left:0; width:100%; max-height:100%; height:100%; border-radius:0')
        this.pgSpan = 2
        this.valveSpan = 2
        this.fullScreen = true
      } else {
        deom.removeAttribute('style')
        const time = setTimeout(() => {
          deom.classList.remove('animation')
          clearTimeout(time)
        }, 300)
        this.pgSpan = 4
        this.valveSpan = 4
        this.fullScreen = false
      }
    },

    closeSpray() {
      this.$store.dispatch('control/sprayShow', false)
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
    success(text) {
      this.$notify.success({
        title: '成功',
        message: text || this.tip.success
      })
    },

    /**
     * 错误提示框
     * @param { String } text 可选,提示性文字
     */
    error(text) {
      this.$notify.error({
        title: '错误',
        message: text || this.tip.error
      })
    },

    /**
     * 喷头发送控制指令（单纯的提取一下）
     * @param { Object } valve 喷头对象
     * @param { String } mode 指令(打开或者关闭)
     */
    ctrlValve(valve, mode) {
      action({
        serialno: valve.rtuSerialno,
        actions: [{
          namekey: mode + valve.port,
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
     * 喷灌机控制项-筛选对应
     * @param { String } 用户选择的值
     * @param { Number } 选择的第几项
     */
    sprayModel(val, index) {
      this.sprayCtr[index].value = val
      switch (this.sprayCtr[index].model) {
        case 'state' : this.sprayState(val); break
        case 'direction': this.sprayDirection(val); break
        case 'water': this.sprayWater(val); break
        case 'gun': this.sprayGun(val); break
      }
    },

    /**
     * 喷灌机发送控制指令（单纯的提取一下）
     * @param { namekey } mode 指令
     */
    ctrlSpray(namekey) {
      action({
        serialno: this.sprayObj.serialno,
        actions: [{
          namekey: namekey,
          params: true
        }]
      }).then((e) => {
        this.success()
      }).catch((e) => {
        this.error()
      })
    },

    /**
     * 喷灌机启停控制
     * @param { Number } 状态码,1启动2停止
     */
    sprayState(state) {
      let namekey = command.openSpray
      if (state === 2) namekey = command.closeSpray
      this.ctrlSpray(namekey)
    },

    /**
     * 喷灌机行进方向设置
     * @param { Number } 状态码,1正向2反向
     */
    sprayDirection(state) {
      let namekey = command.positive
      if (state === 2) namekey = command.reverse
      this.ctrlSpray(namekey)
    },

    /**
     * 喷灌机行进方式设置
     * @param { Number } 状态码,1有水行进2无水行进
     */
    sprayWater(state) {
      let namekey = command.beWater
      if (state === 2) namekey = command.noWater
      this.ctrlSpray(namekey)
    },

    /**
     * 喷灌机尾枪设置
     * @param { Number } 状态码,1尾枪打开2尾枪关闭
     */
    sprayGun(state) {
      let namekey = command.openGun
      if (state === 2) namekey = command.closeGun
      this.ctrlSpray(namekey)
    },

    /**
     * 喷灌机行走速率设置
     * @param { Number } 速率值
     */
    sprayRate(val) {
      this.$confirm('您确定把行走速率设置为' + val + '% ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const actions = []
        const speed = command.speed
        speed.forEach((el) => {
          actions.push({
            namekey: el,
            params: val
          })
        })
        action({
          serialno: this.sprayObj.serialno,
          actions: actions
        }).then((e) => {
          this.success()
        }).catch((e) => {
          this.error()
        })
      }).catch(() => {
        this.rate = val
      })
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
.spray-box {
    background-color: rgba($color: #FFFFFF, $alpha: 0.9);
    width: 600px;
    max-height: 85%;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 12px;
    position: absolute;
    top: 60px;
    left: 10px;
    padding: 10px;
    box-sizing: border-box;
    cursor: grab;
    & .spray__top {
      width: 100%;
      top: 0;
    }
    & .spray__icon {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
      color: #666;
      cursor: pointer;
      & .spray__icon--close{
        font-size:23px;
        margin-left: 10px;
      }
    }
    & .spray__title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding: 10px 0px 10px 10px;
      box-sizing: border-box;
    }
    & .spray__name {
        padding-top: 4px;
        font-size: 14px;
        text-align: center;
     }
    & .spray__row {
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
    & .spray__imgBox {
      margin: 0 auto;
      width: 36px;
      & img {
        display: block;
        width: 100%;
      }
    }
    & .pointer{
      cursor: pointer;
    }
    & .spray__imgBox2 {
      width: 30px;
    }
    & .spray__pt{
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding: 10px 0px 10px 10px;
      box-sizing: border-box;
    }
    & .nozzle__heder{
      display: flex;
      align-items: center;
      & .nozzle__btn{
        margin-left: 20px;
      }
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
    font-weight: 600;
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
