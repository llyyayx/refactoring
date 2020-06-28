<template>
  <div class="drops-container">
    <transition name="el-fade-in">
      <div v-show="show" ref="spray" class="drops-box">
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
          <div class="nozzle__heder">
            <div class="spray__title">{{ dgValve[0].pname }}</div>
            <!-- <transition name="el-fade-in">
              <el-button v-show="(subValve[idx]) && (subValve[idx].length != 0)" type="primary" size="mini" class="nozzle__btn" round @click="multi(idx)">控制已选中</el-button>
            </transition> -->
          </div>
          <el-row v-for="(item,index) in groups = valveCtrGroup(dgValve)" :key="'pt'+index" type="flex" :gutter="20" class="spray__row">
            <el-col :lg="4" :sm="2" :xs="2">
              <div class="spray__imgBox">
                <img src="@/icons/device/run/fm.png" alt="阀门图标">
              </div>
              <div class="spray__name">{{ item[0].areaName }}</div>
            </el-col>
            <el-col :lg="20" :sm="22" :xs="22">
              <el-row :gutter="10">
                <el-col v-for="attr in item" :key="attr.spraySerialno" :lg="valveSpan" :md="3" :sm="4" :xs="6" class="spray__col__mb menux" @dblclick.native="control([attr])">
                  <div class="spray__imgBox spray__imgBox2 pointer">
                    <img :src="attr.icon" alt="阀门图标">
                  </div>
                  <div class="spray__attr spray__attr2 pointer">{{ '阀门0' + attr.rtuPort }}</div>
                </el-col>
              </el-row>
              <el-divider class="spray__divider" />
            </el-col>
          </el-row>
        </div>
        <!-- 滴灌阀门部分end -->
      </div>
    </transition>
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
  data() {
    return {
      valveGrop: []
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
      console.log(this.dropValve)
      // this.group(this.dropValve)
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

    closeDrops() {
      // this.$store.dispatch('control/dropShow', false)
    },

    /**
     * 按区域给阀门分组
     * @param { Array } valve 阀门组
     */
    valveCtrGroup(valve) {
      const areaId = []
      const areaName = []
      const valveGrop = []
      valve.forEach((el, index) => {
        const indexOf = areaId.indexOf(el.areaId)
        if (indexOf >= 0) {
          valveGrop[indexOf].push(el)
        } else {
          areaId.push(el.areaId)
          areaName.push(el.areaName)
          valveGrop.push([el])
        }
      })
      console.log(valveGrop)
      return valveGrop
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
}
</style>
