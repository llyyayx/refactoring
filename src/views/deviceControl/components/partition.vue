<template>
  <transition name="el-zoom-in-center">
    <div v-show="show || setShow" class="partition-container">
      <div v-show="show" class="partition-box">
        <div class="partition__header">
          <div class="partition__header--text">选择要分区的喷灌机</div>
          <svg-icon icon-class="close" class="icon--close" @click="close" />
        </div>
        <ul>
          <li v-for="(item, index) in spray" :key="index" @click="selectSpray(item)">{{ item.dname }}</li>
        </ul>
      </div>
      <el-dialog title="提示" :visible.sync="dialog" width="500px" :modal="false" class="dialog">
        <span style="font-size: 16px">检测到该喷灌机进行过分区?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="editor">去编辑</el-button>
          <el-button type="primary" size="small" @click="reset">重分区</el-button>
        </span>
      </el-dialog>
      <el-dialog title="分区设置" :visible.sync="setShow" width="950px" :modal="false" class="marea">
        <div class="setArea">
          <el-divider content-position="left" class="title">喷灌机参数</el-divider>
          <div class="spray">
            <div class="sprayItem">
              <div class="sprayItem__title">设备名称：</div>
              <el-input class="sprayItem__put" disabled :value="device.dname" />
            </div>
            <div class="sprayItem">
              <div class="sprayItem__title">喷头数量：</div>
              <el-input class="sprayItem__put" disabled :value="valve">
                <template slot="append">个</template>
              </el-input>
            </div>
            <div class="sprayItem">
              <div class="sprayItem__title">灌机臂长：</div>
              <el-input v-model="arm" placeholder="请输入臂长" class="sprayItem__put">
                <template slot="append">米</template>
              </el-input>
            </div>
            <div class="sprayItem">
              <div class="sprayItem__title">中心支轴经度：</div>
              <el-input class="sprayItem__put" disabled :value="device.longitude" />
            </div>
            <div class="sprayItem">
              <div class="sprayItem__title">中心支轴纬度：</div>
              <el-input class="sprayItem__put" disabled :value="device.latitude" />
            </div>
          </div>
          <el-divider content-position="left" class="title">设置大分区</el-divider>
          <div class="bigArea">
            <div class="bigItem">
              <div class="bigItem__title">角度范围：</div>
              <el-input v-model="argstart" class="bigItem__put">
                <template slot="append">度</template>
              </el-input>
              <div class="separated">至</div>
              <el-input v-model="argend" class="bigItem__put">
                <template slot="append">度</template>
              </el-input>
            </div>
            <div class="bigItem">
              <el-button type="primary" size="small" @click="addBigArea">添加</el-button>
            </div>
          </div>
          <el-divider content-position="left" class="title">设置小分区</el-divider>
          <p v-show="area.length === 0" class="tip">暂无分区</p>
          <div class="smallArea">
            <el-collapse v-if="area.length > 0" v-model="activeNames" :accordion="false">
              <el-collapse-item v-for="(item, index) in area" :key="index" :name="item.id">
                <template slot="title">
                  <div class="smallHeader">
                    <div class="smallHeader__title">{{ `第${item.id}大区 （${item.argstart}度 - ${item.argend}度）` }}</div>
                    <el-button type="info" size="mini" class="smallHeader__btn" @click.stop="addSmall(item.id)">添加小分区</el-button>
                    <el-button type="danger" size="mini" class="smallHeader__btn" @click.stop="delBig(item.id)">删除该大区</el-button>
                  </div>
                </template>
                <div v-for="(item2, index2) in item.smallArea" :key="index2" class="smallBox">
                  <div class="smallItem">
                    <div class="smallItem__title">小区编号：</div>
                    <el-input v-model="item2.name" placeholder="请输入编号" class="smallItem__put" />
                  </div>
                  <div class="smallItem">
                    <div class="smallItem__title">喷头映射：</div>
                    <el-input v-model="item2.spstart" class="smallItem__put">
                      <template slot="append">号</template>
                    </el-input>
                    <div class="separated">至</div>
                    <el-input v-model="item2.spend" class="smallItem__put">
                      <template slot="append">号</template>
                    </el-input>
                  </div>
                  <div class="smallItem">
                    <div class="smallItem__title">选取颜色：</div>
                    <el-color-picker v-model="item2.color" show-alpha />
                  </div>
                  <div class="smallItem">
                    <el-button type="danger" size="mini" @click="delSmall(item.id, item2.idx)">删除</el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="btn__group">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button style="margin-right: 10px" @click="setShow=false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { clone, formatCell } from '@/utils/index'
import { subArea } from '@/api/deviceControl'
import device from '@/store/modules/device'
export default {
  data() {
    return {
      // 确认对话框
      dialog: false,
      // 设置分区界面显隐
      setShow: false,
      // 选择要分区的喷灌机
      device: {},
      // 喷头数量
      valve: 0,
      // 喷灌机臂长
      arm: 150,
      // 大区开始角度
      argstart: '',
      // 大区终止角度
      argend: '',
      /**
       * 分区数据
       * 如下是数据结构
       * area: [
       *   {
       *     serialno: 喷灌机标识
       *     id: 大区号(不需要用户自己设置)
       *     argstart: 大区开始角度
       *     argend: 大区终止角度
       *     smallArea: [
       *       {
       *          idx: 小区号(不需要用户自己设置)
       *          name: 小区名称
       *          color: 小区颜色
       *          spstart: 小区开始喷头
       *          spend: 小区开始终止喷头
       *          disstart: 小区开始距离(距中心支轴)
       *          disend: 小区终止距离(距中心支轴)
       *       }
       *     ]
       *   }
       * ]
       */
      area: [],
      activeNames: ['1']
    }
  },
  computed: {
    show() {
      return this.$store.state.control.partitionShow
    },
    spray() {
      return this.$store.state.device.spray
    },
    sprayValve() {
      return this.$store.state.device.sprayValve
    }
  },
  watch: {
    device: {
      handler() {
        const sprayValve = this.sprayValve
        const serialno = this.device.serialno
        for (let i = 0; i < sprayValve.length; i++) {
          if (sprayValve[i][0].pSerialno === serialno) {
            this.valve = sprayValve[i].length
            break
          }
        }
      }
    }
  },
  methods: {

    // 关闭弹框
    close() {
      this.$store.dispatch('control/partitionShow', false)
    },

    /**
     * 喷灌机是否定义分区查询
     * @param { Object } 喷灌机对象
     */
    selectSpray(item) {
      this.device = item
      if (item.cells === undefined || item.cells.length === 0) {
        this.$store.dispatch('control/partitionShow', false)
        this.setShow = true
      } else {
        this.dialog = true
      }
    },

    // 重置分区
    reset() {
      this.$store.dispatch('control/partitionShow', false)
      this.dialog = false
      this.setShow = true
    },

    // 编辑分区
    editor() {
      // 1、解析数据
      const cells = this.device.cells
      const saveId = []
      const saveData = []
      cells.forEach((el) => {
        const index = saveId.indexOf(el.id)
        if (index >= 0) {
          saveData[index].push(el)
        } else {
          saveId.push(el.id)
          saveData.push([el])
        }
      })
      // 2、还原分区
      const area = []
      saveData.forEach((el) => {
        const obj = {}
        obj.serialno = this.device.serialno
        obj.id = el[0].id
        obj.argstart = el[0].argstart
        obj.argend = el[0].argend
        obj.smallArea = []
        el.forEach((item) => {
          obj.smallArea.push({
            idx: item.idx,
            name: item.name,
            color: item.color,
            spstart: item.spstart,
            spend: item.spend,
            disstart: item.disstart,
            disend: item.disend
          })
        })
        area.push(obj)
      })
      this.area = area
      this.$store.dispatch('control/partitionShow', false)
      this.dialog = false
      this.setShow = true
    },

    // 添加大区
    addBigArea() {
      const item = {}
      const area = this.area
      if (area.length === 0) {
        item.serialno = this.device.serialno
        item.id = 1
        item.argstart = this.argstart
        item.argend = this.argend
        item.smallArea = [
          {
            idx: 1,
            name: '',
            color: '',
            spstart: 1,
            spend: this.valve,
            disstart: 0,
            disend: this.arm
          }
        ]
        this.area.push(item)
      } else {
        const argstart = this.argstart
        const argend = this.argend
        let result = true
        area.forEach((el) => {
          if (el.argstart === argstart && el.argend === argend) {
            result = false
          }
          if (el.argstart === argend && el.argend === argstart) {
            result = false
          }
        })
        if (result) {
          item.serialno = this.device.serialno
          item.id = this.area.length + 1
          item.argstart = this.argstart
          item.argend = this.argend
          item.smallArea = [
            {
              idx: 1,
              name: '',
              color: '',
              spstart: 1,
              spend: this.valve,
              disstart: 0,
              disend: this.arm
            }
          ]
          this.area.push(item)
        } else {
          this.$alert('该大区角度已被添加', '警告', {
            showClose: false,
            type: 'warning'
          })
        }
      }
    },

    /**
     * 添加小区
     * @param { Number } id 大区id
     */
    addSmall(id) {
      const area = this.area
      area.forEach((el) => {
        if (el.id === id) {
          el.smallArea.push(
            {
              idx: el.smallArea.length + 1,
              name: '',
              color: '',
              spstart: 1,
              spend: this.valve,
              disstart: 0,
              disend: this.arm
            }
          )
        }
      })
    },

    /**
     * 删除大分区
     * @param { Number } id 大区id(序号)
     */
    delBig(id) {
      const area = this.area
      for (let i = 0; i < area.length; i++) {
        if (area[i].id === id) {
          area.splice(i, 1)
          break
        }
      }
      // 重置大分区id
      area.forEach((el, index) => {
        el.id = index + 1
      })
    },

    /**
     * 删除小分区
     * @param { Number } id 大区id(序号)
     * @param { Number } idx 小区idx(序号)
     */
    delSmall(id, idx) {
      const area = this.area
      let smallArea = []
      for (let i = 0; i < area.length; i++) {
        if (area[i].id === id) {
          smallArea = area[i].smallArea
          if (smallArea.length === 1) {
            this.$alert('大分区下必须包含一个小分区', '警告', {
              showClose: false,
              type: 'warning'
            })
          } else if (smallArea.length > 1) {
            for (let j = 0; j < smallArea.length; j++) {
              smallArea.splice(j, 1)
              break
            }
          }
          break
        }
      }
      // 重置大分区下小分区的idx
      smallArea.forEach((el, index) => {
        el.idx = index + 1
      })
    },

    // 提交计划
    submitForm() {
      const area = this.area
      // 喷头间距
      const interval = Math.floor((this.arm / this.valve) * 100) / 100
      let result = true
      // 整理为提交数据格式
      const cell = []
      area.forEach((el) => {
        const smallArea = el.smallArea
        smallArea.forEach((item) => {
          if (item.name && item.color && item.spstart && item.spend) {
            // 设置距离
            item.disstart = interval * item.spstart
            item.disend = interval * item.spend
            const copy = clone(item)
            copy.serialno = el.serialno
            copy.id = el.id
            copy.argstart = el.argstart
            copy.argend = el.argend
            cell.push(copy)
          } else {
            result = false
          }
        })
      })
      if (result) {
        // 提交到接口api
        subArea({
          serialno: this.device.serialno,
          cells: cell
        }).then((e) => {
          this.$alert('分区提交成功', '提示', {
            showClose: false,
            type: 'success'
          })
          this.device.cells = cell
          // 重绘地图层分区
          this.device.canvas.allArea = formatCell(cell)
          this.device.canvas.view.onRemove()
          this.device.canvas.view.onAdd()
          this.device.canvas.view.draw()
        }).catch((e) => {
          this.$alert('分区提交失败，请联系管理员', '警告', {
            showClose: false,
            type: 'error'
          })
        })
      } else {
        // 信息不完善，禁止提交
        this.$alert('分区信息不完善', '警告', {
          showClose: false,
          type: 'warning'
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.partition-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, .3);
  & .partition-box {
    width: 300px;
    background-color: #FFFFFF;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    overflow: hidden;
    & .partition__header{
        background-color: #DCDFE6;
        padding: 10px 20px;
        position: relative;
        & .partition__header--text{
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
  & .dialog >>> .el-dialog {
    margin-top: 0 !important;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  & .dialog >>> .el-dialog__body {
    padding: 10px 20px;
  }
  & .marea >>> .el-dialog{
    margin-top: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  & .setArea {
    max-height: 500px;
    overflow-y: auto;
    & .title >>> .el-divider__text {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    & .spray {
      display: flex;
      flex-wrap: wrap;
      padding-left: 40px;
      & .sprayItem {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 20px;
        & .sprayItem__put {
          width: 180px;
          & >>> .el-input__inner {
            color: #333;
          }
        }
        & .sprayItem__title {
          font-size: 14px;
          padding-right: 12px;
          color: #333;
        }
      }
    }
    & .bigArea {
      display: flex;
      flex-wrap: wrap;
      padding-left: 40px;
      & .bigItem {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 20px;
        & .bigItem__put {
          width: 180px;
          & >>> .el-input__inner {
            color: #333;
          }
        }
        & .bigItem__title {
          font-size: 14px;
          padding-right: 12px;
          color: #333;
        }
        & .separated {
          padding: 0 6px;
        }
      }
    }
    & .tip {
      text-align: center;
      font-size: 14px;
      padding: 10px 0;
    }
    & .smallArea {
      & .smallHeader {
        display: flex;
        align-items: center;
        padding-left: 40px;
        & .smallHeader__title {
          min-width: 170px;
          font-size: 14px;
          font-weight: 600;
          margin-right: 26px;
        }
        & .smallHeader__btn {
          margin-right: 8px;
        }
      }
      & .smallBox {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 0 10px 20px;
        box-sizing: border-box;
        & .smallItem {
          display: flex;
          align-items: center;
          padding-left: 20px;
          & .smallItem__title {
            font-size: 14px;
            padding-right: 12px;
          }
          & .smallItem__put {
            width: 130px;
            & >>> .el-input__inner {
              color: #333;
            }
          }
          & .separated {
            padding: 0 6px;
          }
        }
      }
    }
  }
  & .btn__group {
    flex-direction: row-reverse;
    padding: 20px 0 0 0;
    display: flex;
  }
}
/* 重置滚动条 */
.setArea::scrollbar{width:8px; height:8px; border-radius:5px;}
.setArea::scrollbar-button{display:none;}
.setArea::scrollbar-track  {display:none;}
.setArea::scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
.setArea::scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
.setArea::scrollbar-corner{display:none;}

.setArea::-webkit-scrollbar{width:8px; height: 8px; border-radius:5px;}
.setArea::-webkit-scrollbar-button{display:none;}
.setArea::-webkit-scrollbar-track  {display:none;}
.setArea::-webkit-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
.setArea::-webkit-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
.setArea::-webkit-scrollbar-corner{display:none;}

.setArea::-moz-scrollbar{width:8px; height:8px; border-radius:5px;}
.setArea::-moz-scrollbar-button{display:none;}
.setArea::-moz-scrollbar-track  {display:none;}
.setArea::-moz-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
.setArea::-moz-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
.setArea::-moz-scrollbar-corner{display:none;}

.setArea::-o-scrollbar{width:8px; height:8px; border-radius:5px;}
.setArea::-o-scrollbar-button{display:none;}
.setArea::-o-scrollbar-track  {display:none;}
.setArea::-o-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
.setArea::-o-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
.setArea::-o-scrollbar-corner{display:none;}

.setArea::-ms-scrollbar{width:8px; height:8px; border-radius:5px;}
.setArea::-ms-scrollbar-button{display:none;}
.setArea::-ms-scrollbar-track  {display:none;}
.setArea::-ms-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
.setArea::-ms-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
.setArea::-ms-scrollbar-corner{display:none;}
</style>
