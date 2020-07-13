<template>
  <div class="plan-container">
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
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :xl="6" :lg="8" class="plan__title">显示已完成计划</el-col>
          <el-col :xl="17" :lg="15" :offset="1">
            <el-switch
              v-model="complete"
              active-color="#409EFF"
            />
          </el-col>
        </el-row>
        <div v-loading="loading" class="plan__box--list">
          <div v-for="item in list" :key="item.id" class="block">
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
      <el-carousel ref="carousel" indicator-position="none" :loop="false" :autoplay="false" arrow="never" height="360px">
        <el-carousel-item>
          <el-form ref="form" :model="form" :rules="rules" :inline="true">
            <el-form-item label="计划名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入计划名称" class="form__item" />
            </el-form-item>
            <el-form-item label="开始时间" prop="val">
              <el-date-picker
                v-model="form.val"
                type="datetime"
                placeholder="选择日期时间"
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
            <el-form-item label="行进方向" prop="direction">
              <el-select v-model="form.direction" placeholder="请选择">
                <el-option value="1" label="正向" />
                <el-option value="2" label="反向" />
              </el-select>
            </el-form-item>
            <el-form-item label="行进方式" prop="mode">
              <el-select v-model="form.mode" placeholder="请选择">
                <el-option value="1" label="有水" />
                <el-option value="2" label="无水" />
              </el-select>
            </el-form-item>
            <el-form-item label="尾枪设置" prop="gun">
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
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">下一步</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-carousel-item>
        <el-carousel-item>121212</el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 添加计划end -->
  </div>
</template>

<script>
import { plans, partition } from '@/api/deviceControl'
export default {
  data() {
    return {
      // 选择的喷灌机
      serialno: '',
      // 展示已经执行的计划
      complete: false,
      // 加载
      loading: false,
      // 计划列表
      list: [],
      // 添加计划对话框
      dialog: false,
      // 计划项
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
      // 计划项验证
      rules: {
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        val: [
          { required: true, message: '请输入时间', trigger: 'blur' }
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
          { required: true, message: '请选择行进方向', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '请选择行进方式', trigger: 'blur' }
        ],
        gun: [
          { required: true, message: '请设置尾枪', trigger: 'blur' }
        ],
        pumpTime: [
          { pattern: /^-?\d+\.?\d*$/, message: '必须为数值类型', trigger: 'change' }
        ],
        pumpDelaySec: [
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
          this.area = el.data
          callback()
        }).catch((el) => {
          loading.close()
          this.$notify.error({
            title: '失败',
            message: '分区未加载，请重试'
          })
        })
      }
    },

    // 新增计划
    addPlan() {
      this.getArea(() => {
        this.close()
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

    // 计划输入重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
        padding: 0 20px;
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
        & .plan__btn{
            width: 100%;
            & .plan__btn--child{
                width: 50%;
            }
        }
    }
    & .plan__mt{
        margin-bottom: 12px;
    }
    & .dialog{
      & >>> .el-form-item__label{
        min-width: 82px;
        text-align: left;
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
