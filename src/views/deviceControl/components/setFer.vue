<template>
  <div class="setfer-block">
    <PanelCount :sub-class="'setfer-container'" :child-class="'setfer-box'" :show="show" @close="close">
      <div slot="main">
        <el-divider content-position="left" class="title">选择喷灌机</el-divider>
        <el-select v-model="serialno" placeholder="请选择喷灌机" class="add__put device">
          <el-option
            v-for="(item, index) in spray"
            :key="index"
            :label="item.dname"
            :value="item.serialno"
          />
        </el-select>
        <el-divider content-position="left" class="title">基础数据</el-divider>
        <el-form ref="input" :model="basisData" :rules="basisRules" :inline="true" class="marea">
          <el-form-item label-width="120px" label="高施氮量：" class="add__item" prop="high">
            <el-input v-model="basisData.high" placeholder="请输入高施氮量" class="add__put">
              <template slot="append">kg/hm2</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="中施氮量：" class="add__item" prop="inThe">
            <el-input v-model="basisData.inThe" placeholder="请输入中施氮量" class="add__put">
              <template slot="append">kg/hm2</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="低施氮量：" class="add__item" prop="low">
            <el-input v-model="basisData.low" placeholder="请输入低施氮量" class="add__put">
              <template slot="append">kg/hm2</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="WUE：" class="add__item" prop="wue">
            <el-input v-model="basisData.wue" placeholder="请输入WUE" class="add__put" />
          </el-form-item>
          <el-form-item label-width="120px" label="H0：" class="add__item" prop="H0">
            <el-input v-model="basisData.H0" placeholder="请输入H0" class="add__put">
              <template slot="append">mm</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="入机压力：" class="add__item" prop="wue">
            <el-input v-model="basisData.pressure" placeholder="请输入入机压力" class="add__put">
              <template slot="append">Mpa</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="有效半径：" class="add__item" prop="radius">
            <el-input v-model="basisData.radius" placeholder="请输入有效半径" class="add__put">
              <template slot="append">m</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="120px" label="肥料类型：" class="add__item" prop="soilWater">
            <el-select v-model="basisFatIndex" placeholder="请选择肥料" class="add__put">
              <el-option
                v-for="(item, index) in fat"
                :key="index"
                :label="item.name"
                :value="index"
              />
            </el-select>
            <el-input v-model.number="fat[basisFatIndex]['azote']" placeholder="请输入含氮量" class="add__put">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-button type="primary" class="bml">提交</el-button>
        </el-form>
        <el-divider content-position="left" class="title">喷头配置</el-divider>
        <el-button type="primary" class="bml" @click="addShow = true">添加喷头</el-button>
        <el-table
          border
          :data="listData"
          style="width: 100%"
        >
          <el-table-column
            prop="idx"
            label="喷头序号"
            align="center"
          />
          <el-table-column
            prop="center"
            label="距离(中心支轴m)"
            align="center"
          />
          <el-table-column
            prop="spacing"
            label="间距(m)"
            align="center"
          />
          <el-table-column
            prop="theoryFlow"
            label="理论流量(m³/h)"
            align="center"
          />
          <el-table-column
            prop="actualFlow"
            label="实际流量(m³/h)"
            align="center"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="edit(scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="del(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top: 30px;">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="page.size"
            :page-size="page.per_page"
            :current-page="page.current_page"
            :total="page.total"
            @size-change="sizeChange"
            @current-change="sizeChange"
          />
        </div>
      </div>
    </PanelCount>
    <!-- 添加信息弹框 -->
    <el-dialog
      title="新增喷头"
      :visible.sync="addShow"
      width="900px"
      height="100px"
    >
      <el-form ref="add" :model="addData" label-width="100px" :inline="true" :rules="addRules" class="marea">
        <el-form-item label="喷头序号：" class="add__item" prop="idx">
          <el-input v-model.number="addData.idx" placeholder="请输入喷头序号" class="add__put" />
        </el-form-item>
        <el-form-item label="距离：" class="add__item" prop="center">
          <el-input v-model.number="addData.center" placeholder="请输入距离" class="add__put">
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="间距：" class="add__item" prop="spacing">
          <el-input v-model.number="addData.spacing" placeholder="请输入间距" class="add__put">
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="理论流量：" class="add__item" prop="theoryFlow">
          <el-input v-model.number="addData.theoryFlow" placeholder="请输入理论流量" class="add__put">
            <template slot="append">m³/h</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实际流量：" class="add__item" prop="actualFlow">
          <el-input v-model.number="addData.actualFlow" placeholder="请输入实际流量" class="add__put">
            <template slot="append">m³/h</template>
          </el-input>
        </el-form-item>
        <div class="btn__group">
          <el-button type="primary" class="bml">确定</el-button>
          <el-button class="bml" @click="addShow = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 编辑信息弹框 -->
    <el-dialog
      title="编辑喷头"
      :visible.sync="editShow"
      width="900px"
      height="100px"
    >
      <el-form ref="add" :model="editData" label-width="100px" :inline="true" :rules="addRules" class="marea">
        <el-form-item label="喷头序号：" class="add__item" prop="idx">
          <el-input v-model.number="editData.idx" placeholder="请输入喷头序号" class="add__put" />
        </el-form-item>
        <el-form-item label="距离：" class="add__item" prop="center">
          <el-input v-model.number="editData.center" placeholder="请输入距离" class="add__put">
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="间距：" class="add__item" prop="spacing">
          <el-input v-model.number="editData.spacing" placeholder="请输入间距" class="add__put">
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="理论流量：" class="add__item" prop="theoryFlow">
          <el-input v-model.number="editData.theoryFlow" placeholder="请输入理论流量" class="add__put">
            <template slot="append">m³/h</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实际流量：" class="add__item" prop="actualFlow">
          <el-input v-model.number="editData.actualFlow" placeholder="请输入实际流量" class="add__put">
            <template slot="append">m³/h</template>
          </el-input>
        </el-form-item>
        <div class="btn__group">
          <el-button type="primary" class="bml">确定</el-button>
          <el-button class="bml" @click="editShow = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import PanelCount from '@/components/PanelCount'
export default {
  components: {
    PanelCount
  },
  data() {
    return {
      // 选择的喷灌机
      serialno: '',
      // 基础数据
      basisData: {
        high: 120,
        inThe: 100,
        low: 80,
        wue: 0.6,
        radius: 94.2,
        pressure: 0.25,
        H0: 2.46
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
          { required: true, message: '请输入wue', trigger: 'change' }
        ],
        H0: [
          { required: true, message: '请输入H0', trigger: 'change' }
        ],
        radius: [
          { required: true, message: '请输入半径', trigger: 'change' }
        ]
      },
      // 喷头配置列表
      listData: [
        { idx: 1, center: 6.35, spacing: 6.35, theoryFlow: 0.1062, actualFlow: 0.1204 },
        { idx: 2, center: 9.23, spacing: 2.88, theoryFlow: 0.1182, actualFlow: 0.1204 },
        { idx: 3, center: 12.11, spacing: 2.88, theoryFlow: 0.1619, actualFlow: 0.1499 },
        { idx: 4, center: 14.99, spacing: 2.88, theoryFlow: 0.2056, actualFlow: 0.218 },
        { idx: 5, center: 17.87, spacing: 2.88, theoryFlow: 0.2493, actualFlow: 0.2566 },
        { idx: 6, center: 20.75, spacing: 2.88, theoryFlow: 0.293, actualFlow: 0.293 }
      ],
      // 分页信息
      page: {
        // 总条数
        total: 20,
        // 每页多少条
        per_page: 20,
        // 当前页码
        current_page: 1,
        // 页码选项
        size: [20]
      },
      // 添加喷头弹框
      addShow: false,
      // 编辑喷头弹框
      editShow: false,
      // 添加数据
      addData: {
        idx: '',
        center: '',
        spacing: '',
        theoryFlow: '',
        actualFlow: '',
        H0: ''
      },
      // 编辑数据
      editData: {},
      // 添加规则
      addRules: {
        idx: [
          { required: true, message: '请输入喷头序号', trigger: 'change' },
          { type: 'number', message: '必须为数字值', trigger: 'change' }
        ],
        center: [
          { required: true, message: '请输入距离', trigger: 'change' }
        ],
        spacing: [
          { required: true, message: '请输入间距', trigger: 'change' }
        ],
        theoryFlow: [
          { required: true, message: '请输入理论流量', trigger: 'change' }
        ],
        actualFlow: [
          { required: true, message: '请输入实际流量', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.control.setFerShow
    },
    spray() {
      return this.$store.state.device.spray
    }
  },
  methods: {
    close() {
      this.$store.dispatch('control/setFerShow', false)
    },

    // 删除喷头配置
    del() {
      this.$confirm('您确定删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((el) => {}).catch(() => {})
    },

    // 编辑
    edit(row) {
      this.editShow = true
      this.editData = row
    },

    // 页码筛选
    sizeChange() {}
  }
}
</script>

<style lang="scss" scoped>
.setfer-block {
    & .title .el-divider__text {
        font-size: 16px;
        color: #000;
        font-weight: 700;
    }
    & .add__put {
        width: 200px;
    }
    & .device {
        margin-bottom: 20px;
        margin-left: 20px;
    }
    & .bml {
        margin-bottom: 20px;
    }
    & .btn__group {
        display: flex;
        flex-direction: row-reverse;
        & .bml{
            margin-left: 10px;
        }
    }
}
</style>
