<template>
  <Panel :sub-class="'fertilizer-container'" :child-class="'fertilizer-box'" :show="show" @close="closeDrops" @full="full">
    <div slot="main">
      <el-row v-for="(item,index) in fertilizer" :key="index" type="flex" :gutter="20" class="fertilizer__row">
        <el-col :lg="4" :sm="2" :xs="2" @dblclick.native="fertilizerCtrl(item)">
          <div class="fertilizer__imgBox pointer">
            <img :src="item.icon" alt="施肥机图标">
          </div>
          <div class="fertilizer__name pointer">{{ item.dname }}</div>
        </el-col>
        <el-col :lg="20" :sm="22" :xs="22">
          <el-row :gutter="10">
            <el-col v-for="(attr,index2) in item.attr" :key="index2" :lg="ferSpan" :md="3" :sm="4" :xs="6" class="fertilizer__col__mb">
              <div class="fertilizer__value">{{ attr.val + attr.unit }}</div>
              <div class="fertilizer__attr">{{ attr.name }}</div>
            </el-col>
          </el-row>
          <el-divider class="fertilizer__divider" />
          <div class="coler__box">
            <div v-for="(ferItem, idx) in ferCtr" v-show="ferDevice.controlItem ? ferDevice.controlItem.includes(ferItem.mark) : true" :key="idx" class="coler">
              <div class="colf">{{ ferItem.name }}</div>
              <div class="corg">
                <el-radio-group v-model="ferItem.value" size="small" @change="(val) => ferModel(val,index,item)">
                  <el-radio-button v-for="item2 in ferItem.selete" :key="item2.label" :label="item2.label">{{ item2.title }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
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
      ferSpan: 4,
      // 喷灌机模式
      ferCtr: [
        { name: '注肥水泵', value: '0', selete: [{ title: '启动', label: 'openPump' }, { title: '停止', label: 'closePump' }], mark: 'pump' },
        { name: '清洗阀', value: '0', selete: [{ title: '打开', label: 'openFlush' }, { title: '关闭', label: 'closeFlush' }], mark: 'flush' },
        { name: '进水阀1#', value: '0', selete: [{ title: '打开', label: 'openInto1' }, { title: '关闭', label: 'closeInto1' }], mark: 'into' },
        { name: '进水阀2#', value: '0', selete: [{ title: '打开', label: 'openInto2' }, { title: '关闭', label: 'closeInto2' }], mark: 'into' },
        { name: '出口阀1#', value: '0', selete: [{ title: '打开', label: 'openOut1' }, { title: '关闭', label: 'closeOut1' }], mark: 'out' },
        { name: '出口阀2#', value: '0', selete: [{ title: '打开', label: 'openOut2' }, { title: '关闭', label: 'closeOut2' }], mark: 'out' },
        { name: '搅拌机1#', value: '0', selete: [{ title: '打开', label: 'openStir1' }, { title: '关闭', label: 'closeStir1' }], mark: 'stir' },
        { name: '搅拌机2#', value: '0', selete: [{ title: '打开', label: 'openStir2' }, { title: '关闭', label: 'closeStir2' }], mark: 'stir' }
      ],
      // 控制的施肥机
      ferObj: {},
      // 指令发送结构
      tip: {
        success: '指令已发送',
        error: '指令发送失败'
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.control.ferShow
    },
    fertilizer() {
      return this.$store.state.device.fertilizer
    },
    ferDevice() {
      return this.$store.state.control.ferDevice
    }
  },
  methods: {

    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      if (fullScreen) {
        this.ferSpan = 2
      } else {
        this.ferSpan = 4
      }
    },

    // 关闭面板的回调事件
    closeDrops() {
      this.$store.dispatch('control/ferShow', false)
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
     * 施肥机控制项-筛选对应
     * @param { String } 控制项的label
     * @param { Number } 选择的第几项
     * @param { Object } 所控制的施肥机对象
     */
    ferModel(val, index, fer) {
      this.ferObj = fer
      this.ferCtr[index].value = val
      const command = fer.command
      this.ctrlFer(command[val].nameKey, command[val].params(), command[val].actions)
    },

    /**
     * 施肥机发送控制指令（单纯的提取一下）
     * @param { String } namekey 指令
     * @param { String || Number } params 参数
     * @param { Boolean || Function } actions 多指令控制
     */
    ctrlFer(namekey, params, actions) {
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
        serialno: this.ferObj.serialno,
        actions: array
      }).then((e) => {
        this.success()
      }).catch((e) => {
        this.error()
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

.fertilizer__row {
  margin: 10px 0;
  & .fertilizer__col__mb{
      margin-bottom: 12px;
  }
  & .selected > .fertilizer__attr{
    color: #409EFF;
    font-weight: 600;
  }
  & .fertilizer__value {
      font-size: 15px;
      color: #333333;
      margin-bottom: 2px;
      font-weight: 600;
      @include nowrap
  }
  & .fertilizer__attr {
      font-size: 14px;
      color: #666666;
      @include nowrap
  }
  & .fertilizer__attr2 {
      text-align: center;
      cursor: pointer;
  }
  & .fertilizer__divider {
      margin: 10px 0;
  }
  & .fertilizer__name {
    padding-top: 4px;
    font-size: 14px;
    text-align: center;
    color: #333;
  }
  & .fertilizer__imgBox {
    margin: 0 auto;
    width: 36px;
    & img {
      display: block;
      width: 100%;
    }
  }
}

.coler__box{
  display: flex;
  flex-wrap: wrap;
  & .coler{
    display: flex;
    margin-right: 40px;
    align-items: center;
    margin-bottom: 20px;
    & .colf{
      min-width: 58px;
      margin-right: 15px;
      font-size: 14px;
      flex-shrink: 0;
      font-weight: 600;
      color: #333
    }
  }
}
</style>
