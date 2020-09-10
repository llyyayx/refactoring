<template>
  <div v-loading="loading" class="equipment-container">
    <el-table
      :data="device"
      height="calc(100% - 60px)"
      style="width: 100%"
      class="table"
    >
      <el-table-column
        prop="dname"
        label="设备名称"
      />
      <el-table-column
        prop="longitude"
        label="设备经度"
      >
        <template slot-scope="scope">
          {{ scope.row.longitude === undefined ? '--' : scope.row.longitude }}
        </template>
      </el-table-column>
      <el-table-column
        prop="latitude"
        label="设备纬度"
      >
        <template slot-scope="scope">
          {{ scope.row.latitude === undefined ? '--' : scope.row.latitude }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rtu.interping"
        label="状态读取间隔(s)"
      />
      <el-table-column
        prop="rtu.status"
        :formatter="status"
        label="设备状态"
      />
      <el-table-column
        label="操作"
        fixed="right"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :all-data="allDevice" @currentChange="data => device = data" />
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="editShow"
      width="600px"
    >
      <el-form ref="edit" :model="editData" :rules="editRules" :inline="true">
        <el-form-item label="设备名称" class="edit__item" prop="dname">
          <el-input v-model="editData.dname" placeholder="设备名称 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="状态读取间隔" class="edit__item" prop="interping">
          <el-input v-model="editData.interping" placeholder="状态读取间隔 (必填)" class="edit__put2">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备经度" class="edit__item" prop="longitude">
          <el-input v-model="editData.longitude" :disabled="true" placeholder="经度位置 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="设备纬度" class="edit__item" prop="latitude">
          <el-input v-model="editData.latitude" :disabled="true" placeholder="纬度位置 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="设备状态" class="edit__item" prop="status">
          <div class="edit__put">
            <el-radio v-model="editData.status" el-radio label="0">有效</el-radio>
            <el-radio v-model="editData.status" label="1">无效</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="获取位置" class="edit__item" prop="latitude">
          <el-button type="primary" size="small" icon="el-icon-s-promotion" @click="dialogVisible = true">选取位置</el-button>
        </el-form-item>
      </el-form>
      <div class="btn__group">
        <el-button type="primary" class="bml" @click="subEdit">保存</el-button>
        <el-button @click="closeEdit">取消</el-button>
      </div>
    </el-dialog>
    <!-- 位置对话框go -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="65%"
    >
      <Location ref="mark" :map-data="mapData" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getGps">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 位置对话框end -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import Location from '@/components/Location'
import { getDevices } from '@/utils/getDevice.js'
import { clone } from '@/utils'
import { deviceMsg } from '@/api/system'
export default {
  name: 'Equipment',
  components: {
    Pagination,
    Location
  },
  data() {
    return {
      // 加载
      loading: false,
      // 全部设备列表
      allDevice: [],
      // 当前设备展示列表
      device: [],
      // 编辑弹出框
      editShow: false,
      // 选择的设备信息
      editData: {},
      // 地图初始化经纬度
      mapData: {
        center: [38.123456, 118.123456],
        zoom: 20
      },
      editRules: {
        dname: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        interping: [
          { required: true, message: '请输入状态读取间隔', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态读取间隔', trigger: 'blur' }
        ]
      },
      // 位置选择弹框
      dialogVisible: false
    }
  },
  mounted() {
    this.loading = true
    getDevices().then((device) => {
      this.allDevice = device
      this.loading = false
    })
  },
  methods: {
    // 设备状态解析
    status(row, column, value) {
      return value === 0 ? '有效' : '无效'
    },
    // 打开编辑弹框
    handleEdit(index, row) {
      if (row.latitude && row.longitude) {
        this.mapData = {
          center: [row.latitude, row.longitude],
          zoom: 20
        }
      }
      row.interping = row.rtu.interping
      this.editData = clone(row)
      this.editShow = true
    },
    // 关闭编辑弹框
    closeEdit() {
      this.editShow = false
    },
    // 设置设备新位置
    getGps() {
      const gps = this.$refs.mark.getLocation()
      this.editData.longitude = gps.lng
      this.editData.latitude = gps.lat
      this.dialogVisible = false
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
    // 保存信息
    subEdit() {
      this.$refs.edit.validate((valid) => {
        if (valid) {
          const loading = this.$loading({ text: '数据上传中', lock: true })
          const self = this
          deviceMsg(this.editData.serialno, {
            dname: this.editData.dname,
            latitude: this.editData.latitude,
            longitude: this.editData.longitude,
            status: this.editData.status,
            interping: this.editData.interping
          }).then((e) => {
            if (e.code === 0) {
              self.success('修改信息成功')
              getDevices().then((device) => {
                this.allDevice = device
              })
            } else {
              self.error(e.message)
            }
            loading.close()
            self.closeEdit()
          }).catch((e) => {
            self.error(e.message)
            loading.close()
            self.closeEdit()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.equipment-container {
    padding: 30px;
    box-sizing: border-box;
    height: 100%;
    & .btn__group{
        display: flex;
        flex-direction: row-reverse;
        margin-top: 22px;
        & .bml{
            margin-left: 10px;
        }
    }
    & .edit__item {
        margin-right: 15px;
        & >>> .el-form-item__label {
            min-width: 78px;
        }
        & .edit__put {
            width: 180px;
        }
        & .edit__put2 {
            width: 152px;
        }
    }
}
</style>
