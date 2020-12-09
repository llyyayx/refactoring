<template>
  <transition name="el-zoom-in-center">
    <div v-show="show || setShow" class="fertilization-container">
      <div v-show="show" class="spray-box">
        <div class="spray__header">
          <div class="spray__header--text">选择要分区的喷灌机</div>
          <svg-icon icon-class="close" class="icon--close" @click="close" />
        </div>
        <ul>
          <li v-for="(item, index) in spray" :key="index" @click="selectSpray(item)">{{ item.dname }}</li>
        </ul>
      </div>
      <PanelCount :sub-class="'count-container'" :child-class="'fertilization-box'" :show="setShow" @close="closeCount">
        <div slot="main">
          <el-divider content-position="left" class="title">基础数据</el-divider>
          <el-form ref="input" :model="parameter" :rules="basisRules" :inline="true" class="marea">
            <el-form-item label-width="100px" label="施肥类型：" class="add__item">
              <el-select v-model="parameter['azote']" placeholder="请选择肥料" class="add__put2">
                <el-option
                  v-for="(item2, index2) in fat"
                  :key="index2"
                  :label="item2.name"
                  :value="item2.azote"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="100px" label="肥料溶解度：" class="add__item">
              <el-input v-model="parameter['solubility']" placeholder="请输入溶解度" class="add__put2" />
            </el-form-item>
          </el-form>
          <el-divider content-position="left" class="title">分区计算</el-divider>
          <div class="smallArea">
            <div v-for="(cell, idx) in area" :key="idx" class="smallBlock">
              <div class="smallTitle">{{ cell.id + '大区' }}</div>
              <el-collapse :accordion="false">
                <el-collapse-item v-for="(item, index) in cell.smallArea" :key="index" :name="item.name">
                  <template slot="title">
                    <div class="smallHeader">
                      <div class="smallHeader__title">{{ `${item.name}小区` }}</div>
                    </div>
                  </template>
                  <div class="calculate">
                    <el-form ref="data1" :model="calculate[idx][index]" :inline="true" class="marea">
                      <el-form-item label-width="100px" label="施氮量等级：" class="add__item">
                        <el-select v-model="calculate[idx][index]['total']" placeholder="请选择施氮量等级" class="add__put2">
                          <el-option label="高施氮量" :value="basisData.high" />
                          <el-option label="中施氮量" :value="basisData.inThe" />
                          <el-option label="低施氮量" :value="basisData.low" />
                        </el-select>
                      </el-form-item>
                      <el-form-item v-if="index==0" label-width="100px" label="灌水深度：" class="add__item">
                        <el-input v-model="calculate[idx][index]['depth']" placeholder="请输入灌水深度" class="add__put2" />
                      </el-form-item>
                      <el-form-item v-if="index==0" label-width="100px" label="入机流量：" class="add__item">
                        <el-input v-model="calculate[idx][index]['flow']" placeholder="请输入流量" class="add__put2" />
                      </el-form-item>
                      <el-form-item label-width="100px" label="计算模式：" class="add__item">
                        <el-select v-model="calculate[idx][index]['mode']" placeholder="请选择计算模式" class="add__put2">
                          <el-option label="设定脉冲" :value="1" />
                          <el-option label="计算脉冲" :value="2" />
                        </el-select>
                        <el-input v-show="calculate[idx][index]['mode'] == 1" v-model.number="calculate[idx][index]['pwm']" placeholder="请输入脉冲值" class="add__put">
                          <template slot="append">%</template>
                        </el-input>
                        <el-cascader v-show="calculate[idx][index]['mode'] == 2" v-model="calculate[idx][index]['pwmArea']" :options="option" placeholder="选择参照区" class="add__put2" />
                      </el-form-item>
                      <el-form-item label-width="100px" label="分区半径：" class="add__item">
                        <el-input v-model="calculate[idx][index]['radius']" placeholder="请输入半径" class="add__put2" />
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div class="btn-group">
            <el-button type="primary" class="bml" @click="start">计算</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </PanelCount>
      <!-- 计算结果展示 -->
      <el-dialog
        title="计算结果"
        :visible.sync="resultShow"
        width="900px"
        height="100px"
      >
        <el-table
          border
          :data="resultData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="分区名称"
            align="center"
          />
          <el-table-column
            prop="area"
            label="分区面积(m²)"
            align="center"
          />
          <el-table-column
            prop="pwm"
            label="占空比(%)"
            align="center"
          />
          <el-table-column
            prop="speed"
            label="行走速率(%)"
            align="center"
          />
          <el-table-column
            prop="frequency"
            label="变频频率(HZ)"
            align="center"
          />
        </el-table>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import PanelCount from '@/components/PanelCount'
export default {
  components: {
    PanelCount
  },
  data() {
    return {
      // 喷灌机设备
      device: {},
      // 计算窗口显示
      setShow: false,
      // 基础数据(应该接口拉取的)
      basisData: {
        high: 120,
        inThe: 100,
        low: 80,
        wue: 0.6,
        radius: 94.2,
        H0: 2.46,
        pressure: 0.25
      },
      // 选择的肥料及溶解度
      parameter: {
        azote: 46,
        solubility: 20
      },
      // 肥料属性
      fat: [
        { name: '尿素', azote: 46 },
        { name: '复合肥', azote: 15 },
        { name: '磷酸二铵', azote: 18 },
        { name: '硝酸钾', azote: 13 },
        { name: '碳酸氢氨', azote: 17 }
      ],
      // 修改基础数据-肥料index
      basisFatIndex: 0,
      // 分区数据
      area: [
        { id: 1, argstart: 0, argend: 30, smallArea: [
          { name: '1', spstart: 1, spend: 40 }
        ] },
        { id: 2, argstart: 30, argend: 90, smallArea: [
          { name: '2', spstart: 1, spend: 15 },
          { name: '3', spstart: 16, spend: 40 }
        ] },
        { id: 3, argstart: 90, argend: 135, smallArea: [
          { name: '4', spstart: 1, spend: 20 },
          { name: '5', spstart: 21, spend: 40 }
        ] },
        { id: 4, argstart: 135, argend: 170, smallArea: [
          { name: '6', spstart: 1, spend: 40 }
        ] },
        { id: 5, argstart: 170, argend: 180, smallArea: [
          { name: '7', spstart: 1, spend: 40 }
        ] }
      ],
      // 分区输入
      calculate: [],
      // 区域选项
      option: [],
      // 最终计算结果
      resultShow: false,
      resultData: [],
      // 规则
      basisRules: {
        high: [
          { required: true, message: '请输入高施氮量', trigger: 'change' }
        ],
        inThe: [
          { required: true, message: '请输入中施氮量', trigger: 'change' }
        ],
        low: [
          { required: true, message: '请输入低施氮量', trigger: 'change' }
        ],
        wue: [
          { required: true, message: '请输入中施氮量', trigger: 'change' }
        ],
        radius: [
          { required: true, message: '请输入中施氮量', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.control.fertilizationShow
    },
    spray() {
      return this.$store.state.device.spray
    }
  },
  watch: {
    area: {
      handler(newValue, oldValue) {
        const len = newValue.length
        const calculate = []
        const option = []
        for (let i = 0; i < len; i++) {
          const smallArea = newValue[i]['smallArea']
          const areOption = {
            label: newValue[i]['id'] + '大区',
            value: i,
            children: []
          }
          const smallBlock = []
          for (let j = 0; j < smallArea.length; j++) {
            smallBlock.push({
              // 角度
              angle: newValue[i].argend - newValue[i].argstart,
              // 半径-输入
              radius: '',
              // 施氮量等级值-输入
              total: 80,
              // 灌水深度-输入
              depth: '',
              // 流量-输入
              flow: '',
              // 模式：1：设定脉冲，2计算脉冲
              mode: 1,
              // 设置脉冲/参照脉冲，取决于模式
              pwm: '',
              pwmArea: [],
              // 面积-计算
              area: 0,
              // 行走速度-计算
              result: {
                speed: 0,
                pwm: 0,
                frequency: 0
              }
            })
            areOption.children.push({
              label: smallArea[j]['name'] + '小区',
              value: j
            })
          }
          calculate.push(smallBlock)
          option.push(areOption)
        }
        this.calculate = calculate
        this.option = option
      },
      immediate: true
    }
  },
  methods: {

    /**
     * 喷灌机是否定义分区查询
     * @param { Object } 喷灌机对象
     */
    selectSpray(item) {
      this.device = item
      if (item.cells === undefined || item.cells.length === 0) {
        this.$store.dispatch('control/fertilizationShow', false)
        this.$message.error('请先定义分区')
      } else {
        this.$store.dispatch('control/fertilizationShow', false)
        this.setShow = true
      }
    },

    // 关闭窗口
    close() {
      this.$store.dispatch('control/fertilizationShow', false)
    },

    // 关闭计算窗口
    closeCount() {
      this.setShow = false
    },

    // 计算
    start() {
      const calculate = this.calculate
      const radius = this.basisData.radius
      /* ------------------------------1、计算各个小区的面积------------------------- */
      calculate.forEach((area, idx) => {
        // 扇形总面积
        const s_all = (area[0]['angle'] / 360) * Math.pow(radius, 2) * Math.PI
        // 多小区计算面积
        let long = 0
        const s_array = []
        // 各个扇形面积计算
        if (area.length > 1) {
          area.forEach((item, index) => {
            long += parseFloat(item.radius)
            if (index === 0) {
              s_array.push((item.angle / 360) * Math.pow(long, 2) * Math.PI)
            } else {
              const he = (item.angle / 360) * Math.pow(long, 2) * Math.PI
              s_array.push(he - this.sum(s_array))
            }
          })
        }
        area.forEach((item, index) => {
          if (area.length === 1) {
            item.area = Math.floor(s_all)
            console.log(Math.floor(s_all))
          } else {
            item.area = Math.floor(s_array[index])
            console.log(Math.floor(s_array[index]))
          }
        })
      })
      console.log(calculate)
      /* ------------------------------2、计算施氮总量------------------------- */
      let N_total = 0
      calculate.forEach((area) => {
        area.forEach((item) => {
          N_total += (item.area / 10000 * item.total)
        })
      })
      console.log(N_total)
      /* ------------------------------3、计算施肥总量------------------------- */
      const F_total = N_total / (this.basisData.wue * (this.parameter.azote / 100))
      console.log(F_total)
      /* ------------------------------4、计算施肥母液体积------------------------- */
      const V = (F_total / this.parameter.solubility) * 0.1
      console.log(V)
      /* ------------------------------5、计算肥料质量浓度------------------------- */
      const C0 = F_total / (F_total + V * 1000)
      console.log(C0)
      /* ------------------------------6、计算占空比/行走速率/电源频率------------------------- */
      calculate.forEach((area) => {
        if (area.length === 1) {
          // 仅一个小区
          area.forEach((item) => {
            let pwm = 0
            let speed = 0
            let frequency = 0
            if (item.mode === 1) {
              pwm = item.pwm
            } else {
              const refer = calculate[item.pwmArea[0]][item.pwmArea[1]]
              pwm = item.total / refer.total * refer.pwm
            }

            speed = this.basisData.H0 / item.depth * pwm

            const S = item.area / 10000
            const azote = this.parameter.azote / 100
            const C = (item.total * S / azote) / (item.total * S / azote + item.depth * S * 10000)
            const Q = C / (C0 - C) * item.flow * 1000
            frequency = -5.045 + 12.36 * this.basisData.pressure + 0.156 * Q

            item.result.pwm = pwm
            item.result.speed = speed
            item.result.frequency = frequency
          })
        } else {
          // 多个小区
          area.forEach((item, index) => {
            let pwm = 0
            let speed = 0
            let frequency = 0
            let refer = {}
            if (index > 0) {
              refer = calculate[item.pwmArea[0]][item.pwmArea[1]]
            }
            if (item.mode === 1) {
              pwm = item.pwm
            } else {
              pwm = item.total / refer.total * refer.pwm
              item.pwm = pwm
            }
            // 应对小区灌水深度
            if (index > 0) {
              item.depth = refer.depth / (refer.pwm / 100) * (item.pwm / 100)
              speed = this.basisData.H0 / refer.depth * refer.pwm
            } else {
              speed = this.basisData.H0 / item.depth * item.pwm
            }

            let C = 0
            if (index > 0) {
              const S = refer.area / 10000
              const azote = this.parameter.azote / 100
              C = (refer.total * S / azote) / (refer.total * S / azote + refer.depth * S * 10000)
            } else {
              const S = item.area / 10000
              const azote = this.parameter.azote / 100
              C = (item.total * S / azote) / (item.total * S / azote + item.depth * S * 10000)
            }

            let Q = 0
            if (index > 0) {
              Q = C / (C0 - C) * refer.flow * 1000
            } else {
              Q = C / (C0 - C) * item.flow * 1000
            }
            frequency = -5.045 + 12.36 * this.basisData.pressure + 0.156 * Q
            item.result.pwm = pwm
            item.result.speed = speed
            item.result.frequency = frequency
          })
        }
      })
      console.log(calculate)
      this.calculate = calculate
      this.resultFormat(calculate)
    },

    // 结果格式及展示
    resultFormat(calculate) {
      const resultData = []
      let count = 1
      calculate.forEach((area, idx) => {
        area.forEach((item, index) => {
          resultData.push({
            name: count + '小区',
            area: item.area,
            frequency: Math.floor(item.result.frequency * 100) / 100,
            pwm: Math.floor(item.result.pwm * 100) / 100,
            speed: Math.floor(item.result.speed * 100) / 100
          })
          count++
        })
      })
      this.resultData = resultData
      this.resultShow = true
    },

    // 数组求和
    sum(arr) {
      var s = 0
      for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i]
      }
      return s
    },

    // 重置表单
    reset() {
      this.$refs.input.resetFields()
      this.$refs.output.resetFields()
    }

  }
}
</script>
<style lang="scss" scoped>
.fertilization-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, .3);
  & .spray-box {
    width: 300px;
    background-color: #FFFFFF;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    overflow: hidden;
    & .spray__header{
        background-color: #DCDFE6;
        padding: 10px 20px;
        position: relative;
        & .spray__header--text{
          font-size: 16px;
          color: #333;
        }
        & .icon--close{
          color: #666;
          font-size:23px;
          margin-left: 10px;
          cursor: pointer;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
    }
    & > ul {
      list-style: none;
      margin: 0;
      padding: 15px 15px;
      & > li:nth-of-type(1) {
        padding-top: 0;
      }
      & > li {
        list-style:none;
        border: 0;
        padding-top: 10px;
        padding-bottom: 6px;
        padding-left: 2px;
        border-bottom: 1px solid #e3e3e3;
        cursor: pointer;
      }
    }
  }
  & .title .el-divider__text {
    font-size: 16px;
    color: #000;
    font-weight: 700;
  }
  & .add__put {
    width: 200px;
  }
  & .add__put2 {
    width: 120px;
  }
  & .smallArea {
    margin-bottom: 20px;
    & .smallTitle {
      padding-left: 10px;
      margin: 20px 0;
      font-weight: 700;
    }
    &::-webkit-scrollbar {
        width:8px;
        height: 8px;
        border-radius:5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color:#e3e3e3;
        border-radius:15px;
    }
    &::-webkit-scrollbar-track {
        display:none;
    }
    &::-webkit-scrollbar-track-piece {
        background-color: transparent;
        margin: 12px 0;
    }
    &::-webkit-scrollbar-corner {
        display:none;
    }
    &setArea::-webkit-scrollbar-button {
        display:none;
    }
    & .smallHeader {
        display: flex;
        align-items: center;
        padding-left: 40px;
        padding-left: 10px;
        & .smallHeader__title {
            font-size: 16px;
        }
    }
  }
  & .btn-group {
    display: flex;
    flex-direction: row-reverse;
    & .bml {
      margin-left: 20px;
    }
  }
}
</style>
