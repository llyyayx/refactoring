<template>
  <div v-loading="loading" class="alarm-container">
    <el-button size="mini" type="primary" class="addAlarm" @click="addShow = true">添加规则</el-button>
    <div class="top">
      <el-select v-model="seleteDev" placeholder="请选择 (必填)" class="topDevice" @change="seleteDevice">
        <el-option v-for="item in canDevice" :key="item.serialno" :value="item.serialno" :label="item.dname" />
      </el-select>
      <el-date-picker
        v-model="seleteTime"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button type="primary" style="margin-left:12px" @click="serach">查询</el-button>
    </div>
    <el-table
      :data="currentAlarm"
      height="calc(100% - 160px)"
      style="width: 100%"
      class="table"
    >
      <el-table-column
        prop="dname"
        label="设备名称"
        :formatter="dname"
      />
      <el-table-column
        prop="namekey"
        label="属性"
        :formatter="namekey"
      />
      <el-table-column
        prop="compare"
        label="触发条件"
        :formatter="compare"
      />
      <el-table-column
        prop="alarmVal"
        label="触发值"
        :formatter="alarmVal"
      />
      <el-table-column
        prop="messageType"
        label="提醒方式"
        :formatter="messageType"
      />
      <el-table-column
        prop="alarmUniqueId"
        label="警报级别"
        :formatter="alarmUniqueId"
      />
      <el-table-column
        prop="fluctuationsVal"
        label="浮动值"
      />
      <el-table-column
        prop="messageCycle"
        label="预警周期(分钟)"
        :formatter="messageCycle"
      />
      <el-table-column
        prop="createdAt"
        label="添加日期"
      />
      <el-table-column
        label="操作"
        fixed="right"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editAlarm(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteAlarm(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :all-data="alarmList" @currentChange="data => currentAlarm = data" />
    <!-- 添加规则弹框 -->
    <el-dialog
      title="添加规则"
      :visible.sync="addShow"
      width="600px"
    >
      <el-form ref="add" :model="addData" :rules="addRules" :inline="true">
        <el-form-item label="设备名称" class="add__item" prop="serialno">
          <el-select v-model="addData.serialno" placeholder="请选择 (必填)" class="add__put" @change="seleteDevice">
            <el-option v-for="item in canDevice" :key="item.serialno" :value="item.serialno" :label="item.dname" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警属性" class="add__item" prop="namekey">
          <el-select v-model="addData.namekey" placeholder="请选择 (必填)" class="add__put" @change="changeAttr">
            <el-option v-for="item in devicetAttr" :key="item.nameKey" :value="item.nameKey" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="警报级别" class="add__item" prop="alarmUniqueId">
          <el-select v-model="addData.alarmUniqueId" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in level" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警方式" class="add__item" prop="messageType">
          <el-select v-model="addData.messageType" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in message" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警周期" class="add__item" prop="messageCycle">
          <el-select v-model="addData.messageCycle" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in cycle" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <!-- 数值型 -->
        <div v-show="currentAttr.type==='number'" class="group__type">
          <el-form-item label="设置限度" class="add__item" prop="compare">
            <el-select v-model="addData.compare" placeholder="请选择 (必填)" class="add__put">
              <el-option v-for="item in astrict" :key="item.value" :value="item.value" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="预警数值" class="add__item" prop="alarmVal">
            <el-input v-model="addData.alarmVal" placeholder="请输入 (必填)" class="add__put">
              <template slot="append">{{ currentAttr.unit }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="浮动范围" class="add__item" prop="fluctuationsVal">
            <el-input v-model="addData.fluctuationsVal" placeholder="请输入 (必填)" class="add__put" />
          </el-form-item>
        </div>
        <!-- 开关型 -->
        <div v-show="currentAttr.type==='boolean'" class="group__type">
          <el-form-item label="预警动作" class="add__item" prop="alarmVal">
            <el-select v-model="addData.alarmVal" placeholder="请选择 (必填)" class="add__put">
              <el-option value="1" label="启动" />
              <el-option value="0" label="停止" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn__group">
        <el-button type="primary" class="bml" @click="addAlarm">添加</el-button>
        <el-button @click="addShow = false;">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改规则信息弹框 -->
    <el-dialog
      title="编辑规则"
      :visible.sync="editShow"
      width="600px"
    >
      <el-form ref="add" :model="editData" :rules="exitRules" :inline="true">
        <el-form-item label="设备名称" class="add__item" prop="serialno">
          <el-select v-model="editData.serialno" placeholder="请选择 (必填)" class="add__put" @change="seleteDevice">
            <el-option v-for="item in canDevice" :key="item.serialno" :value="item.serialno" :label="item.dname" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警属性" class="add__item" prop="namekey">
          <el-select v-model="editData.namekey" placeholder="请选择 (必填)" class="add__put" @change="changeAttr">
            <el-option v-for="item in devicetAttr" :key="item.nameKey" :value="item.nameKey" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="警报级别" class="add__item" prop="alarmUniqueId">
          <el-select v-model="editData.alarmUniqueId" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in level" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警方式" class="add__item" prop="messageType">
          <el-select v-model="editData.messageType" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in message" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警周期" class="add__item" prop="messageCycle">
          <el-select v-model="editData.messageCycle" placeholder="请选择 (必填)" class="add__put">
            <el-option v-for="item in cycle" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <!-- 数值型 -->
        <div v-show="currentAttr.type==='number'" class="group__type">
          <el-form-item label="设置限度" class="add__item" prop="compare">
            <el-select v-model="editData.compare" placeholder="请选择 (必填)" class="add__put">
              <el-option v-for="item in astrict" :key="item.value" :value="item.value" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="预警数值" class="add__item" prop="alarmVal">
            <el-input v-model="editData.alarmVal" placeholder="请输入 (必填)" class="add__put">
              <template slot="append">{{ currentAttr.unit }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="浮动范围" class="add__item" prop="fluctuationsVal">
            <el-input v-model="editData.fluctuationsVal" placeholder="请输入 (必填)" class="add__put" />
          </el-form-item>
        </div>
        <!-- 开关型 -->
        <div v-show="currentAttr.type==='boolean'" class="group__type">
          <el-form-item label="预警动作" class="add__item" prop="alarmVal">
            <el-select v-model="editData.alarmVal" placeholder="请选择 (必填)" class="add__put">
              <el-option value="1" label="启动" />
              <el-option value="0" label="停止" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn__group">
        <el-button type="primary" class="bml" @click="sunEdit">提交</el-button>
        <el-button @click="editShow = false;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDevices } from '@/utils/getDevice.js'
import { sprayAttr, ferAttr, pumpAttr } from '@/views/deviceControl/parsing'
import { getAttr } from '@/utils/setDevice'
import { parseTime } from '@/utils'
import { addAlarm, listAlarm, delAlarm, updateAlarm } from '@/api/system'
import Pagination from '@/components/Pagination'
export default {
  name: 'Alarm',
  components: {
    Pagination
  },
  data() {
    return {
      // 进入加载
      loading: false,
      // 筛选警报设备编号
      seleteDev: '',
      // 筛选警报时间范围
      seleteTime: ['2020-09-01 00:00:00', '2021-09-01 00:00:00'],
      // 已添加警报列表
      alarmList: [],
      // 当前页警报列表
      currentAlarm: [],
      // 添加规则弹框显隐
      addShow: false,
      // 可设置警报的设备-dclass
      canDclass: [this.$config.SPRAY_CLASS, this.$config.FERTILIZER_CLASS, this.$config.PUMP_CLASS],
      // 可设置警报的设备
      canDevice: [],
      // 选择设备对应的属性
      devicetAttr: [],
      // 选择的属性
      currentAttr: {},
      // 警报级别
      level: [{ value: '3', name: '提醒事件' }, { value: '2', name: '一般事件' }, { value: '1', name: '紧急事件' }],
      // 预警方式
      message: [{ value: '1', name: '短信提醒' }, { value: '2', name: '微信推送' }, { value: '4', name: '邮件提醒' }],
      // 警报限度
      astrict: [{ value: '1', name: '大于' }, { value: '2', name: '小于' }, { value: '3', name: '等于' }],
      // 警报报警周期
      cycle: [{ value: '0', name: '仅提醒一次' }, { value: '5', name: '5分钟/1次' }, { value: '10', name: '10分钟/1次' }, { value: '20', name: '20分钟/1次' },
        { value: '30', name: '30分钟/1次' }, { value: '60', name: '60分钟/1次' }],
      // 新增警报数据
      addData: this.initData(),
      // 添加警报规则验证
      addRules: {
        serialno: [
          { required: true, message: '请选择设备', trigger: 'blur' }
        ],
        namekey: [
          { required: true, message: '请选择属性', trigger: 'blur' }
        ],
        alarmUniqueId: [
          { required: true, message: '请选择警报级别', trigger: 'blur' }
        ],
        messageType: [
          { required: true, message: '请选择预警方式', trigger: 'blur' }
        ],
        messageCycle: [
          { required: true, message: '请选择预警周期', trigger: 'blur' }
        ],
        compare: [
          { required: true, message: '请选择限度', trigger: 'blur' }
        ],
        alarmVal: [
          { required: true, message: '请设置预警值', trigger: 'blur' }
        ],
        fluctuationsVal: [
          { required: true, message: '请设置浮动范围', trigger: 'blur' }
        ]
      },
      exitRules: {
        serialno: [
          { required: true, message: '请选择设备', trigger: 'blur' }
        ],
        namekey: [
          { required: true, message: '请选择属性', trigger: 'blur' }
        ],
        alarmUniqueId: [
          { required: true, message: '请选择警报级别', trigger: 'blur' }
        ],
        messageType: [
          { required: true, message: '请选择预警方式', trigger: 'blur' }
        ],
        messageCycle: [
          { required: true, message: '请选择预警周期', trigger: 'blur' }
        ],
        compare: [
          { required: true, message: '请选择限度', trigger: 'blur' }
        ],
        alarmVal: [
          { required: true, message: '请设置预警值', trigger: 'blur' }
        ],
        fluctuationsVal: [
          { required: true, message: '请设置浮动范围', trigger: 'blur' }
        ]
      },
      // 列表解析使用-当前循环行的设备对象
      rowDev: {},
      // 编辑规则弹框显隐
      editShow: false,
      // 编辑规则的信息
      editData: {}
    }
  },
  mounted() {
    const self = this
    self.loading = true
    getDevices().then((e) => {
      const device = []
      e.forEach((item) => {
        if (self.canDclass.includes(item.dclass)) {
          let attr = []
          switch (item.dclass) {
            case self.$config.SPRAY_CLASS: attr = getAttr(sprayAttr, item.model); break
            case self.$config.FERTILIZER_CLASS: attr = getAttr(ferAttr, item.model); break
            case self.$config.PUMP_CLASS: attr = getAttr(pumpAttr, item.model); break
          }
          attr.forEach((el, index) => {
            if (Object.prototype.toString.call(el.rules) === '[object Function]') {
              attr.splice(index, 1)
            }
          })
          item.attr = attr
          device.push(item)
        }
      })
      self.canDevice = device
      self.initSearch()
      self.loading = false
    }).catch((e) => {
      self.loading = false
    })
  },
  methods: {
    // 初始化数据
    initData() {
      return {
        serialno: '',
        namekey: '',
        alarmUniqueId: '',
        messageType: '',
        messageCycle: '',
        compare: '1',
        alarmVal: '',
        fluctuationsVal: '0.5'
      }
    },
    // 初始化查询
    initSearch() {
      const time = new Date().getTime()
      const aDay = 86400000
      const aYear = 31536000000
      this.seleteTime = [parseTime(time - aYear), parseTime(time + aDay)]
      this.seleteDev = this.canDevice[0].serialno
      this.serach()
    },
    /**
     * 成功弹框
     * @param { String } content 提示内容
     */
    success(content) {
      this.$alert(content, '提示', {
        showClose: false,
        type: 'success'
      })
    },
    /**
     * 失败弹框
     * @param { String } content 提示内容
     */
    error(content) {
      this.$alert(content, '提示', {
        showClose: false,
        type: 'error'
      })
    },
    // 根据设备编号查找设备
    seleteDevice(e) {
      const device = this.canDevice
      let attr = []
      for (let i = 0; i < device.length; i++) {
        if (device[i].serialno === e) {
          attr = device[i].attr
          break
        }
      }
      this.devicetAttr = attr
      this.addData.namekey = ''
    },
    // 根据namekey查找属性
    changeAttr(e) {
      const devicetAttr = this.devicetAttr
      let attr = {}
      for (let i = 0; i < devicetAttr.length; i++) {
        if (devicetAttr[i].nameKey === e) {
          attr = devicetAttr[i]
          break
        }
      }
      if (attr.type === 'boolean') {
        this.addData.compare = '3'
      } else {
        this.addData.compare = '1'
      }
      this.currentAttr = attr
    },
    // 添加警报
    addAlarm() {
      this.$refs.add.validate((valid) => {
        const self = this
        if (valid) {
          const loading = this.$loading({ text: '数据上传中', lock: true })
          addAlarm(this.addData).then((e) => {
            if (e.code === 0) {
              self.success('规则添加成功')
            } else {
              self.error(e.message)
            }
            loading.close()
            self.addShow = false
            self.addData = self.initData()
            self.serach()
          }).catch(() => {
            self.error('规则添加失败')
            loading.close()
            self.addShow = false
          })
        }
      })
    },
    // 查询
    serach() {
      const self = this
      listAlarm({
        serialno: this.seleteDev,
        startTime: this.seleteTime[0],
        endTime: this.seleteTime[1],
        pageSize: 1,
        limit: 900
      }).then((e) => {
        self.alarmList = e.data
      })
    },
    /**
     *  根据serialno查找设备
     * @param { String } serialno 设备编号
     */
    serTodev(serialno) {
      const device = this.canDevice
      for (let i = 0; i < device.length; i++) {
        if (device[i].serialno === serialno) {
          return device[i]
        }
      }
    },
    /**
     * 根据namekey在属性列表中查询对应的属性对象
     * @param { Array } 属性列表
     * @param { String } 属性namekey
     */
    keyToatty(attr, namekey) {
      for (let j = 0; j < attr.length; j++) {
        if (attr[j].nameKey === namekey) {
          return attr[j]
        }
      }
    },
    /**
     * 根据数组对象中的值得到数组的对象
     * @param { Array } array 目标数组
     * @param { String } value 对象值
     */
    keyToarray(array, value) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value === value) {
          return array[i]
        }
      }
    },
    // 解析设备名称(根据接口的serilno找设备名称)
    dname(row, column, value) {
      const getDevice = this.serTodev(row.serialno)
      this.rowDev = getDevice
      return getDevice.dname
    },
    // 解析设备属性
    namekey(row, column, value) {
      return this.keyToatty(this.rowDev.attr, row.namekey).name
    },
    // 解析规则触发条件
    compare(row, column, valu) {
      const astrict = this.astrict
      const rules = this.keyToarray(astrict, row.compare.toString())
      return rules ? rules.name : '--'
    },
    // 解析触发值
    alarmVal(row, column, valu) {
      const attr = this.keyToatty(this.rowDev.attr, row.namekey)
      if (attr.type === 'boolean') {
        return row.alarmVal === 1 ? '启动' : '停止'
      } else {
        return row.alarmVal + attr.unit
      }
    },
    // 解析提醒方式
    messageType(row, column, valu) {
      const message = this.message
      const type = this.keyToarray(message, row.messageType.toString())
      return type ? type.name : '--'
    },
    // 解析警报级别
    alarmUniqueId(row, column, valu) {
      const level = this.level
      const unqid = this.keyToarray(level, row.alarmUniqueId.toString())
      return unqid ? unqid.name : '--'
    },
    // 解析周期
    messageCycle(row, column, valu) {
      const cycle = this.cycle
      const date = this.keyToarray(cycle, row.messageCycle.toString())
      return date ? date.name : '--'
    },
    // 删除警报
    deleteAlarm(index, row) {
      this.$confirm('您确定删除该条规则么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const self = this
        const loading = this.$loading({ text: '删除中', lock: true })
        delAlarm(row.id).then((e) => {
          if (e.code === 0) {
            self.success('删除警报规则成功')
          }
          loading.close()
          self.serach()
        }).catch((e) => {
          self.error('删除警报规则失败')
          loading.close()
        })
      }).catch(() => { return })
    },
    // 编辑按钮点击事件
    editAlarm(index, row) {
      row.messageType = row.messageType.toString()
      row.messageCycle = row.messageCycle.toString()
      row.alarmVal = row.alarmVal.toString()
      row.compare = row.compare.toString()
      this.editData = row
      const device = this.canDevice
      const item = device.filter((item) => {
        return item.serialno === row.serialno
      })
      this.devicetAttr = item[0].attr
      this.changeAttr(row.namekey)
      this.editShow = true
    },
    // 提交更改
    sunEdit() {
      this.$refs.add.validate((valid) => {
        const self = this
        if (valid) {
          const loading = this.$loading({ text: '数据上传中', lock: true })
          updateAlarm(this.editData.id, this.editData).then((e) => {
            if (e.code === 0) {
              self.success('更新成功')
            } else {
              self.error(e.message)
            }
            loading.close()
            self.editShow = false
            self.serach()
          }).catch(() => {
            self.error('更新失败')
            loading.close()
            self.editShow = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.alarm-container {
  padding: 30px;
  box-sizing: border-box;
  height: 100%;
  & .top {
    display: flex;
    align-items: center;
    margin: 12px 0;
    & .topDevice {
      margin-right: 12px;
    }
  }
  & .addAlarm {
    margin-bottom: 12px;
  }
  & .add__item {
    margin-right: 15px;
    & >>> .el-form-item__label {
      width: 78px;
    }
    & .add__put {
      width: 180px;
    }
  }
  & .btn__group{
    display: flex;
    flex-direction: row-reverse;
    margin-top: 22px;
    & .bml{
      margin-left: 10px;
    }
  }
  & .group__type{
    display: contents;
  }
}
</style>
