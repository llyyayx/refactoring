<template>
  <div class="plan-container" @contextmenu.prevent="menu = false" @click="menu = false">
    <!-- 计划列表go -->
    <el-drawer
      :visible="show"
      direction="rtl"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="title">喷灌计划</div>
      <svg-icon icon-class="close" class="icon--close" @click="close" />
      <div class="plan__box">
        <el-row :gutter="10" type="flex" align="middle" class="plan__mt">
          <el-col :xl="6" :lg="8" class="plan__title">选择喷灌机</el-col>
          <el-col :xl="17" :lg="15" :offset="1">
            <el-select v-model="serialno" placeholder="请选择" @change="select">
              <el-option
                v-for="item in spray"
                :key="item.serialno"
                :value="item.serialno"
                :label="item.dname"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" align="middle" class="plan__mt">
          <el-col :xl="6" :lg="8" class="plan__title">显示已完成计划</el-col>
          <el-col :xl="17" :lg="15" :offset="1">
            <el-switch
              v-model="complete"
              active-color="#409EFF"
            />
          </el-col>
        </el-row>
        <div v-loading="loading" class="plan__box--list">
          <div v-for="item in list" :key="item.id" class="block" @contextmenu.prevent.stop="rigthMenu($event,item)">
            <el-row type="flex" align="middle">
              <el-col :xl="3" :lg="4">
                <div class="plan__img">
                  <img v-if="item.status===1 || item.status===4 || item.status===0" src="@/icons/device/wait.png" alt="待执行">
                  <img v-else-if="item.status===2" src="@/icons/device/now.png" alt="正在执行">
                  <img v-else-if="item.status===3" src="@/icons/device/complete.png" alt="已完成">
                </div>
              </el-col>
              <el-col :xl="20" :lg="19" :offset="1">
                <div class="plan__name">{{ item.name }} （{{ item.status===2 ? '正在执行' : item.status===1 ? '待执行' : item.status === 3 ? '已完成' : item.status===0 ? '待执行' : '已取消' }}）</div>
                <div class="plan__time">{{ item.val }}</div>
              </el-col>
            </el-row>
            <el-divider class="spray__divider" />
          </div>
        </div>
        <el-button-group class="plan__btn">
          <el-button type="primary" class="plan__btn--child" @click="refresh">刷新计划</el-button>
          <el-button type="primary" class="plan__btn--child" @click="addPlan">新增计划</el-button>
        </el-button-group>
      </div>
    </el-drawer>
    <!-- 计划列表end -->
    <!-- 添加计划go -->
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" class="dialog" width="650px">
      <el-steps :active="active" :align-center="true" style="margin-bottom: 20px">
        <el-step title="喷灌机设置" />
        <el-step title="分区设置" />
      </el-steps>
      <el-carousel ref="carousel" indicator-position="none" :loop="false" :autoplay="false" arrow="never" height="350px">
        <el-carousel-item>
          <el-form ref="form" :model="form" :rules="rules" :inline="true" style="height:272px">
            <el-form-item label="计划名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入计划名称" class="form__item" />
            </el-form-item>
            <el-form-item label="开始时间" prop="val">
              <el-date-picker
                v-model="form.val"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="form__item"
              />
            </el-form-item>
            <el-form-item label="停止角度" prop="angale">
              <el-input v-model="form.angale" placeholder="请输入停止角度" class="form__item" />
            </el-form-item>
            <el-form-item label="喷灌延时" prop="delaySec">
              <el-input v-model="form.delaySec" placeholder="请输入喷灌延时" class="form__item">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item v-show="sprayDevice.controlItem ? sprayDevice.controlItem.includes('direction') : true" label="行进方向" prop="direction">
              <el-select v-model="form.direction" placeholder="请选择">
                <el-option value="1" label="正向" />
                <el-option value="2" label="反向" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="sprayDevice.controlItem ? sprayDevice.controlItem.includes('mode') : true" label="行进方式" prop="mode">
              <el-select v-model="form.mode" placeholder="请选择">
                <el-option value="1" label="有水" />
                <el-option value="2" label="无水" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="sprayDevice.controlItem ? sprayDevice.controlItem.includes('gunSetting') : true" label="尾枪设置" prop="gun">
              <el-select v-model="form.gun" placeholder="请选择">
                <el-option value="1" label="打开" />
                <el-option value="2" label="关闭" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择水泵" prop="pump">
              <el-select v-model="form.pump" placeholder="请选择">
                <el-option
                  v-for="item in pump"
                  :key="item.serialno"
                  :value="item.serialno"
                  :label="item.dname"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="泵启动时长" prop="pumpTime">
              <el-input v-model="form.pumpTime" placeholder="请输入启动时长" class="form__item">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="泵延时启动" prop="pumpDelaySec">
              <el-input v-model="form.pumpDelaySec" placeholder="请输入延时时间" class="form__item">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="btn__group">
            <el-button type="primary" @click="submitForm('form')">下一步</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <el-button type="primary" size="small" @click="zone=true">选择</el-button>
          <el-table :data="tableData" style="width: 100%;" height="240" max-height="240">
            <el-table-column
              prop="bigArea"
              label="大分区"
              width="70"
            />
            <el-table-column
              prop="smallName"
              label="小分区"
            />
            <el-table-column prop="cycle" label="脉冲周期(S)">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.cycle" placeholder="必填" />
              </template>
            </el-table-column>
            <el-table-column prop="radio" label="占空比(%)">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.radio" placeholder="必填" />
              </template>
            </el-table-column>
            <el-table-column prop="speed" label="行走速率(%)">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.speed" placeholder="必填" @input="putSpeed(scope)" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn__group">
            <el-button type="primary" @click="goBack">上一步</el-button>
            <el-button type="primary" @click="submitPlan">提交</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 添加计划end -->
    <!-- 添加分区弹框go -->
    <el-dialog :visible.sync="zone" class="dialog" width="650px">
      <el-form ref="form2" :model="seting" :rules="rules2" :inline="true" class="seting">
        <el-form-item label="大分区" prop="bigArea">
          <el-select v-model="seting.bigArea" placeholder="请选择" @change="selectBig($event)">
            <el-option
              v-for="item in bigArea"
              :key="item.index"
              :value="item.value"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小分区" prop="smallArea">
          <el-select v-model="seting.smallArea" :disabled="smallIdx < 0" placeholder="请选择" @change="selectSmall($event)">
            <el-option
              v-for="(item, key) in smallArea[smallIdx]"
              :key="key"
              :value="item.value"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="脉冲周期" prop="cycle">
          <el-input v-model="seting.cycle" placeholder="请输入脉冲周期" class="form__item">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="占空比" prop="radio">
          <el-input v-model="seting.radio" placeholder="请输入占空比" class="form__item">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="行走速率" prop="speed">
          <el-input v-model="seting.speed" placeholder="请输入行走速率" class="form__item">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <div class="btn__group">
          <el-button type="primary" size="small" @click="addArea('form2')">添加</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加分区弹框end -->
    <!-- 右击自定义菜单go -->
    <transition name="el-zoom-in-center">
      <div v-show="menu" class="menu" :style="{left: menuLf, top:menuTp}">
        <ul>
          <li @click="details">
            <img src="@/icons/device/menu/details.png">
            <span>查看详情</span>
          </li>
          <li>
            <img src="@/icons/device/menu/copy.png">
            <span>复制计划</span>
          </li>
          <li>
            <img src="@/icons/device/menu/cancel.png">
            <span>取消计划</span>
          </li>
          <li>
            <img src="@/icons/device/menu/del.png">
            <span>删除计划</span>
          </li>
        </ul>
      </div>
    </transition>
    <!-- 右击自定义菜单end -->
    <!-- 计划详情go -->
    <el-dialog :visible.sync="content" class="dialog" width="650px">
      <el-row type="flex" align="center">
        <el-col>
          <span>计划名称</span>
          <span>{{ parsingPlan.name }}</span>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 计划详情end -->
  </div>
</template>

<script>
import { plans, partition, addPlan } from '@/api/deviceControl'
import { sortAttr, clone } from '@/utils'
export default {
  data() {
    return {
      // 选择的喷灌机--编号
      serialno: '',
      // 选择的喷灌机--设备
      sprayDevice: {},
      // 展示已经执行的计划
      complete: false,
      // 加载
      loading: false,
      // 计划列表
      list: [],
      // 添加计划对话框
      dialog: false,
      // 分区设置弹框
      zone: false,
      // 历史计划详情
      content: false,
      // 右击弹框菜单
      menu: false,
      // 右击菜单left
      menuLf: 0,
      // 右击菜单top
      menuTp: 0,
      // 选择的计划
      selectPlan: {},
      // 解析后的计划，用于展示计划详情
      parsingPlan: {},
      // 喷灌机计划项
      form: {
        name: '',
        val: '',
        angale: '',
        delaySec: '',
        direction: '',
        mode: '',
        gun: '',
        pump: '',
        pumpTime: '',
        pumpDelaySec: ''
      },
      // 当前灌机分区
      area: [],
      // 灌机分区-大区
      bigArea: [],
      // 灌机分区-小区
      smallArea: [],
      // 大区对应的小区序号
      smallIdx: -1,
      // 分区设置表格
      tableData: [],
      // 设置分区参数表格
      seting: {
        bigArea: '',
        smallArea: '',
        smallName: '',
        cycle: '',
        radio: '',
        speed: ''
      },
      // 计划项验证
      rules: {
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        val: [
          { required: true, message: '请设置启动时间', trigger: 'blur' }
        ],
        angale: [
          { required: true, message: '请输入停止角度', trigger: 'blur' },
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        delaySec: [
          { required: true, message: '请输入喷灌延时', trigger: 'blur' },
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        direction: [
          { required: true, message: '请设置行进方向', trigger: 'blur' }
        ],
        pumpTime: [
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        pumpDelaySec: [
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ]
      },
      rules2: {
        bigArea: [
          { required: true, message: '请选择大区', trigger: 'blur' }
        ],
        smallName: [
          { required: true, message: '请选择小区', trigger: 'blur' }
        ],
        cycle: [
          { required: true, message: '请输入周期', trigger: 'blur' },
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        radio: [
          { required: true, message: '请输入占空比', trigger: 'blur' },
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        speed: [
          { required: true, message: '请输入行走速率', trigger: 'blur' },
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ]
      },
      // 当前步骤
      active: 1
    }
  },
  computed: {
    show() {
      return this.$store.state.control.pgPlanShow
    },
    spray() {
      return this.$store.state.device.spray
    },
    pump() {
      return this.$store.state.device.pump
    }
  },
  methods: {
    // 关闭喷灌计划面板
    close() {
      this.$store.dispatch('control/pgPlanShow', false)
    },

    /**
     * 喷灌机选择回调
     * @param { String } e 选择值
     */
    select(e) {
      this.getPlan(e)
      this.sprayDevice = this.getSpray(this.spray, e)
    },

    /**
     * 根据设备获取制定的计划
     * @param { String } serialno 设备编号
     */
    getPlan(serialno) {
      this.loading = true
      plans(serialno).then((e) => {
        this.list = e
        this.loading = false
        this.$notify.success({
          title: '成功',
          message: '计划拉取成功'
        })
      }).catch((e) => {
        this.loading = false
        this.$notify.error({
          title: '失败',
          message: '计划拉取失败'
        })
      })
    },

    // 刷新计划
    refresh() {
      if (!this.serialno) {
        this.$confirm('请先选择喷灌机', '提示', {
          type: 'warning'
        }).catch(() => { return })
        return
      }
      this.getPlan(this.serialno)
    },

    /**
     * 查询喷灌机分区
     * @param { Function } callback 查询成功的回调函数
     */
    getArea(callback) {
      if (!this.serialno) {
        this.$confirm('请先选择喷灌机', '提示', {
          type: 'warning'
        }).catch(() => { return })
        return
      } else {
        // eslint-disable-next-line no-unused-vars
        const loading = this.$loading({
          lock: true,
          text: '分区查询中'
        })
        partition(this.serialno).then((el) => {
          loading.close()
          this.$notify.success({
            title: '成功',
            message: '分区查询成功'
          })
          callback(el)
        }).catch((el) => {
          loading.close()
          this.$notify.error({
            title: '失败',
            message: '分区未加载，请重试'
          })
        })
      }
    },

    // 右击菜单
    rigthMenu(event, item) {
      this.menu = true
      this.menuLf = event.clientX + 'px'
      this.menuTp = event.clientY + 'px'
      this.selectPlan = item
    },

    // 查看计划详情
    details() {
      const selectPlan = this.selectPlan
      const plan = {
        // 计划名称
        name: '',
        // 计划开始时间
        val: '',
        // 计划停止角度
        angale: '',
        // 计划中喷灌机动作
        device: [],
        // 分区设置
        cell: []
      }
      plan.name = selectPlan.name
      plan.val = selectPlan.val
      /** 灌机设置项 **/
      const spray = this.sprayDevice
      const sprayItem = selectPlan.devices[0]
      plan.angale = sprayItem.val
      const actionStart = JSON.parse(sprayItem.actionStart)
      debugger
      actionStart.forEach((el) => {
        if (spray.command.openGun && el.namekey === spray.command.openGun.nameKey) {
          plan.device.push({ mark: 'gunSetting', name: '打开' })
        } else if (spray.command.closeGun && el.namekey === spray.command.closeGun.nameKey) {
          plan.device.push({ mark: 'gunSetting', name: '关闭' })
        }
        if (spray.command.positive && el.namekey === spray.command.positive.nameKey) {
          plan.device.push({ mark: 'direction', name: '正向' })
        } else if (spray.command.reverse && el.namekey === spray.command.reverse.nameKey) {
          plan.device.push({ mark: 'direction', name: '反向' })
        }
        if (spray.command.haveWater && el.namekey === spray.command.haveWater.nameKey) {
          plan.device.push({ mark: 'mode', name: '有水' })
        } else if (spray.command.noWater && el.namekey === spray.command.noWater.nameKey) {
          plan.device.push({ mark: 'mode', name: '无水' })
        }
      })
      plan.cell = JSON.parse(sprayItem.options).cells
      this.parsingPlan = plan
      this.content = true
    },

    /**
     * 判断数组对象中某个属性是否包含某值
     */
    isValue(array, attr, value) {
      let result = false
      array.forEach((el) => {
        if (el[attr] === value) {
          result = true
        }
      })
      return result
    },

    // 设置分区选项
    option() {
      const area = this.area
      const bigArea = []
      const smallArea = []
      area.forEach((el) => {
        if (!this.isValue(bigArea, 'value', el.id)) {
          bigArea.push({
            value: el.id,
            name: el.id + '大区',
            index: bigArea.length
          })
          smallArea.push([{
            value: el.idx,
            name: el.name + '小区',
            index: 0
          }])
        } else {
          const index = smallArea.length - 1
          smallArea[index].push({
            value: el.idx,
            name: el.name + '小区',
            index: index
          })
        }
      })
      this.bigArea = bigArea
      this.smallArea = smallArea
    },

    // 初始化分区表格信息
    initTable() {
      const bigArea = this.bigArea
      const smallArea = this.smallArea
      const tableData = []
      bigArea.forEach((el, index) => {
        smallArea[index].forEach((item) => {
          tableData.push({
            bigArea: el.value,
            smallArea: item.value,
            smallName: item.name,
            cycle: 60,
            radio: 50,
            speed: 100
          })
        })
      })
      this.tableData = tableData
    },

    // 新增计划
    addPlan() {
      this.getArea((el) => {
        sortAttr(el.data, 'idx')
        this.area = el.data
        this.option()
        this.initTable()
        this.dialog = true
      })
    },

    // 第一步跳转到第二步
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.carousel.next()
          this.active = 2
        } else {
          return false
        }
      })
    },

    // 放回第一步
    goBack() {
      this.$refs.carousel.prev()
      this.active = 1
    },

    // 计划输入重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 选择大区时间
    selectBig(enevt) {
      const bigArea = this.bigArea
      let index = 0
      bigArea.forEach((el) => {
        if (el.value === enevt) {
          index = el.index
        }
      })
      this.seting.smallArea = ''
      this.smallIdx = index
    },

    // 选择小区
    selectSmall(event) {
      const small = this.smallArea[this.smallIdx]
      small.forEach((el) => {
        if (el.value === event) {
          this.seting.smallName = el.name
        }
      })
    },

    // 防止添加重复分区，大区统一行走速率
    prevent() {
      const table = this.tableData
      const seting = this.seting
      let result = true
      table.forEach((el) => {
        if (el.bigArea === seting.bigArea) {
          el.speed = seting.speed
        }
        if (el.bigArea === seting.bigArea && el.smallArea === seting.smallArea) {
          result = false
        }
      })
      return result
    },

    // 添加设置的分区
    addArea(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.prevent()) {
            this.tableData.push(clone(this.seting))
            this.$message.success('设置成功')
          } else {
            this.$message.error('失败，分区设置重复')
          }
        } else {
          return false
        }
      })
    },

    // 手动输入分区速率_统一大区速率
    putSpeed(event) {
      const row = event.row
      this.tableData.forEach((el) => {
        if (el.bigArea === row.bigArea) {
          el.speed = row.speed
        }
      })
    },

    // 删除已添加分区
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    },

    /**
     * 方法：根据编号查找设备列表
     * @param { String } 设备编号
     * @return 对应的设备
     */
    getSpray(deviceList, serialno) {
      let device
      deviceList.forEach((el) => {
        if (el.serialno === serialno) {
          device = el
        }
      })
      return device
    },

    // 提交计划
    submitPlan() {
      // 基本格式
      const plans = {
        name: '',
        serialno: '',
        val: '',
        status: '1',
        expression: '>',
        namekey: 'sys_cron',
        devices: []
      }
      // step1：喷灌机设定
      const spray = this.sprayDevice
      plans.name = this.form.name
      plans.val = this.form.val
      plans.serialno = this.serialno
      // step2: 喷灌机设备
      const sprayStart = []
      const sprayStop = []
      /** * 正反向设置 ***/
      if (this.form.direction) {
        if (this.form.direction === '1') {
          sprayStart.push({
            namekey: spray.command.positive.nameKey,
            params: spray.command.positive.params()
          })
        } else if (this.form.direction === '2') {
          sprayStart.push({
            namekey: spray.command.reverse.nameKey,
            params: spray.command.reverse.params()
          })
        }
      }
      /** * 行进方式设置 ***/
      if (this.form.mode) {
        if (this.form.mode === '1') {
          sprayStart.push({
            namekey: spray.command.haveWater.nameKey,
            params: spray.command.haveWater.params()
          })
        } else if (this.form.mode === '2') {
          sprayStart.push({
            namekey: spray.command.noWater.nameKey,
            params: spray.command.noWater.params()
          })
        }
      }
      /** * 尾枪设置 ***/
      if (this.form.gun) {
        if (this.form.gun === '1') {
          sprayStart.push({
            namekey: spray.command.openGun.nameKey,
            params: spray.command.openGun.params()
          })
        } else if (this.form.gun === '2') {
          sprayStart.push({
            namekey: spray.command.closeGun.nameKey,
            params: spray.command.closeGun.params()
          })
        }
        sprayStop.push({
          namekey: spray.command.closeGun.nameKey,
          params: spray.command.closeGun.params()
        })
      }
      /** * 喷灌机设置 ***/
      sprayStart.push({
        namekey: spray.command.openSpray.nameKey,
        params: spray.command.openSpray.params()
      })
      sprayStop.push({
        namekey: spray.command.closeSpray.nameKey,
        params: spray.command.closeSpray.params()
      })
      /** * 分区设置 ***/
      const sprayOptions = {}
      sprayOptions.cells = []
      this.tableData.forEach((el) => {
        sprayOptions.cells.push({
          v: el.speed,
          p: el.cycle,
          d: el.radio,
          lc: el.bigArea,
          sc: el.smallArea
        })
      })
      /** * 集成指令 ***/
      plans.devices.push({
        dclass: this.$config.SPRAY_CLASS,
        serialno: this.serialno,
        ctlGroup: 0,
        idx: 0,
        namekey: 'Current_Angle',
        expression: '>',
        val: this.form.angale,
        delaySec: this.form.delaySec,
        actionStart: JSON.stringify(sprayStart),
        actionStop: JSON.stringify(sprayStop),
        options: JSON.stringify(sprayOptions)
      })
      addPlan(JSON.stringify(plans)).then((e) => {
        this.dialog = false
        this.$notify.success({
          title: '成功',
          message: '计划添加成功'
        })
      }).catch((e) => {
        this.$notify.error({
          title: '失败',
          message: '计划添加失败'
        })
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
.plan-container{
    & .title{
        font-size: 16px;
        font-weight: 600;
        color: #333333;
    }
    & .icon--close{
        position: absolute;
        top: 20px;
        right: 20px;
        color: #666;
        font-size:23px;
        cursor: pointer;
    }
    & .plan__box{
        box-sizing: border-box;
        height: 100vh;
        & .plan__title{
            font-size: 16px;
        }
        & .plan__box--list{
            margin: 20px 0;
            overflow-x: hidden;
            overflow-y: auto;
            height: calc(100% - 230px);
            & .block{
              padding: 0 20px;
              box-sizing: border-box;
              cursor: pointer;
              & .plan__img{
                  width: 60px;
                  & img{
                    width: 100%;
                    display: block;
                  }
              }
              & .plan__name{
                font-size: 14px;
                @include nowrap
              }
              & .plan__time{
                font-size: 14px;
                margin-top: 5px;
              }
            }
        }
        & .plan__btn{
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            & .plan__btn--child{
                width: 50%;
            }
        }
    }
    & .plan__mt{
      padding: 0 20px;
      margin-bottom: 12px;
    }
    & .dialog{
      & >>> .el-form-item__label{
        min-width: 82px;
        text-align: left;
      }
      & .seting{
        & >>> .el-form-item__label{
          min-width: 76px;
          text-align: left;
        }
      }
      & .btn__group{
        margin-top: 22px;
      }
    }
}

.menu{
  background:#fff;
  box-shadow:0px 0px 10px #ddd;
  width:200px;
  position:fixed;
  z-index: 9999;
  border-radius: 6px;
  overflow: hidden;
  & ul{
    list-style-type:none;
    margin: unset;
    padding: unset;
    & li{
      display: flex;
      align-items: center;
      padding: 10px 20px;
      height:35px;
      line-height:35px;
      font-size:14px;
      color:#666;
      list-style-type:none;
      border-bottom:1px solid #ddd;
      text-indent:20px;
      cursor: pointer;
      & img{
        display: block;
      }
      & span{
        text-indent: 12px;
        text-align: left;
      }
    }
    & li:nth-last-child(1) {
      border-bottom: none
    }
    & li:hover{
      background:#647E7C;
      color:#fff;
    }
  }
}

.form__item{
    width: 200px;
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
