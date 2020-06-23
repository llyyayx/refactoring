<template>
  <div v-cloak ref="spray" class="spray-container">
    <!-- 顶部按钮 -->
    <el-row class="spray__top">
      <el-col :span="2" :offset="22" class="spray__icon" title="全屏">
        <svg-icon icon-class="fullscreen" @click="full" />
        <svg-icon icon-class="close" style="font-size:23px; margin-left: 10px" @click="full" />
      </el-col>
    </el-row>
    <!-- 喷灌机部分go -->
    <div v-show="spray.length > 0" class="spray__title">喷灌机</div>
    <el-row v-for="(item,index) in spray" :key="index" type="flex" :gutter="20" class="spray__row">
      <el-col :lg="4" :sm="2" :xs="2">
        <div class="spray__imgBox">
          <img :src="item.icon" alt="喷灌机图标">
        </div>
        <div class="spray__name">{{ item.dname }}</div>
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
      <div class="spray__title">{{ pgValve[0].pname }}</div>
      <el-row v-for="(item,index) in groups = valveCtrGroup(pgValve)" :key="'pt'+index" type="flex" :gutter="20" class="spray__row">
        <el-col :lg="4" :sm="2" :xs="2">
          <div class="spray__imgBox">
            <img src="@/icons/device/run/fm.png" alt="喷头图标">
          </div>
          <div class="spray__name">{{ value ? item[0]['descri'] : '第' + ( index -1 + 2 ) + '跨' }}</div>
        </el-col>
        <el-col :lg="20" :sm="22" :xs="22">
          <el-row :gutter="10">
            <el-col v-for="(attr,index2) in item" :key="attr.spraySerialno" :lg="valveSpan" :md="3" :sm="4" :xs="6" class="spray__col__mb">
              <div class="spray__imgBox spray__imgBox2">
                <img :src="attr.icon" alt="喷头图标">
              </div>
              <div class="spray__attr spray__attr2">{{ '喷头0' + (index == 0 ? index2 - 1 + 2 : length(groups,index) + index2 + 1) }}</div>
            </el-col>
          </el-row>
          <el-divider class="spray__divider" />
        </el-col>
      </el-row>
    </div>
    <!-- 灌机喷头部分go -->
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
  data() {
    return {
      map: {},
      value: false,
      pgSpan: 4,
      valveSpan: 4,
      fullScreen: false
    }
  },
  computed: {
    spray() {
      return this.$store.state.device.spray
    },
    sprayValve() {
      return this.$store.state.device.sprayValve
    }
  },
  mounted() {
    new Draggabilly('.spray-container', {
      containment: true
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
     * 方法: 查询二维数组前n项长度之和
     * @param { Array } array 数组
     * @return { Number } 返回和
     */
    length(array, index) {
      let len = 0
      for (var i = 0; i < array.length; i++) {
        if (i < index) {
          len += array[i].length
        } else {
          break
        }
      }
      return len
    },

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
.spray-container {
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
    & .spray__imgBox2 {
      width: 30px;
      cursor: pointer;
    }
    & .spray__pt{
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding: 10px 0px 10px 10px;
      box-sizing: border-box;
    }
}

[v-cloak] {
  display: none;
}

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
