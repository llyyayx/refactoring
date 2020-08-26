<template>
  <div v-loading="loading" class="user-container">
    <el-button size="mini" type="primary" class="addUser" @click="addShow = true">添加用户</el-button>
    <el-table
      :data="user"
      height="calc(100% - 102px)"
      style="width: 100%"
    >
      <el-table-column
        prop="uname"
        label="用户名"
      />
      <el-table-column
        prop="roles"
        label="用户角色"
        :formatter="roles"
      />
      <el-table-column
        prop="noticeto"
        label="推送方式"
        :formatter="noticeto"
      />
      <el-table-column
        prop="phone"
        label="手机号"
      />
      <el-table-column
        prop="weixin"
        label="微信"
      />
      <el-table-column
        prop="qq"
        label="QQ"
      />
      <el-table-column
        prop="email"
        label="邮箱"
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
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
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
        :page-sizes="[20, 50, 100, 200]"
        :page-size="50"
        :total="user.length"
      />
    </div>
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="editShow"
      width="600px"
    >
      <el-form ref="edit" :model="editData" :rules="editRules" :inline="true">
        <el-form-item label="用户名" class="edit__item" prop="uname">
          <el-input v-model="editData.uname" placeholder="用户名 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="手机号" class="edit__item" prop="phone">
          <el-input v-model="editData.phone" placeholder="手机号 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="用户角色" class="edit__item" prop="roles">
          <el-select v-model="editData.roles" placeholder="请选择 (必填)" class="edit__put">
            <el-option value="1" label="普通用户" />
            <el-option value="2" label="管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送方式" class="edit__item" prop="noticeto">
          <el-select v-model="editData.noticeto" placeholder="请选择 (必填)" class="edit__put">
            <el-option value="1" label="短信" />
            <el-option value="2" label="微信" />
            <el-option value="4" label="邮件" />
          </el-select>
        </el-form-item>
        <el-form-item label="微信" class="edit__item" prop="weixin">
          <el-input v-model="editData.weixin" placeholder="微信 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="QQ" class="edit__item" prop="qq">
          <el-input v-model="editData.qq" placeholder="QQ (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="邮箱" class="edit__item" prop="email">
          <el-input v-model="editData.email" placeholder="邮箱 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="密码" class="edit__item">
          <el-input v-model="editPassword" placeholder="新密码 (选填)" class="edit__put" />
        </el-form-item>
      </el-form>
      <div class="btn__group">
        <el-button type="primary" class="bml" @click="subEdit">保存</el-button>
        <el-button @click="closeEdit">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加用户"
      :visible.sync="addShow"
      width="600px"
    >
      <el-form ref="add" :model="addData" :rules="addRules" :inline="true">
        <el-form-item label="用户名" class="edit__item" prop="uname">
          <el-input v-model="addData.uname" placeholder="用户名 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="手机号" class="edit__item" prop="phone">
          <el-input v-model="addData.phone" placeholder="手机号 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="用户角色" class="edit__item" prop="roles">
          <el-select v-model="addData.roles" placeholder="请选择 (必填)" class="edit__put">
            <el-option value="1" label="普通用户" />
            <el-option value="2" label="管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送方式" class="edit__item" prop="noticeto">
          <el-select v-model="addData.noticeto" placeholder="请选择 (必填)" class="edit__put">
            <el-option value="1" label="短信" />
            <el-option value="2" label="微信" />
            <el-option value="4" label="邮件" />
          </el-select>
        </el-form-item>
        <el-form-item label="微信" class="edit__item" prop="weixin">
          <el-input v-model="addData.weixin" placeholder="微信 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="QQ" class="edit__item" prop="qq">
          <el-input v-model="addData.qq" placeholder="QQ (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="邮箱" class="edit__item" prop="email">
          <el-input v-model="addData.email" placeholder="邮箱 (必填)" class="edit__put" />
        </el-form-item>
        <el-form-item label="密码" class="edit__item">
          <el-input v-model="addData.password" placeholder="密码 (必填)" class="edit__put" />
        </el-form-item>
      </el-form>
      <div class="btn__group">
        <el-button type="primary" class="bml" @click="subUser">添加</el-button>
        <el-button @click="addShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { clone } from '@/utils'
import { userList, userMsg, addUser, delUser } from '@/api/system'
export default {
  name: 'User',
  data() {
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    return {
      // 加载
      loading: false,
      // 用户信息列表
      user: [],
      // 编辑行号
      editIndex: 0,
      // 编辑数据
      editData: {},
      // 编辑信息弹框
      editShow: false,
      // 编辑前手机号（接口需要编辑前手机识别用户）
      editPhone: '',
      // 编辑新密码
      editPassword: '',
      editRules: {
        uname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        noticeto: [
          { required: true, message: '请选择推送方式', trigger: 'blur' }
        ],
        weixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        qq: [
          { required: true, message: '请输入QQ号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮件', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      // 添加用户弹框
      addShow: false,
      // 添加用户数据
      addData: {
        uname: '',
        phone: '',
        roles: '',
        noticeto: '',
        weixin: '',
        qq: '',
        email: '',
        password: '',
        groupid: 1
      },
      addRules: {
        uname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        noticeto: [
          { required: true, message: '请选择推送方式', trigger: 'blur' }
        ],
        weixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        qq: [
          { required: true, message: '请输入QQ号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮件', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 拉取用户信息
    const self = this
    self.loading = true
    this.getUser().then((data) => {
      self.user = data
      self.loading = false
    }).catch((e) => {
      self.loading = false
      return
    })
  },
  methods: {
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
    // 获取用户列表
    getUser() {
      return new Promise((resolve, reject) => {
        userList().then((e) => {
          if (e.code === 0) {
            // 清除无效的用户
            const data = e.data
            for (let i = data.length - 1; i >= 0; i--) {
              if (data[i].valid === 0) {
                data.splice(i, 1)
              }
            }
            resolve(data)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },
    // 刷新用户列表
    refresh() {
      const self = this
      this.getUser().then((data) => {
        self.user = data
        self.loading = false
      }).catch((e) => { return })
    },
    // 格式化用户角色
    roles(row, column, value) {
      return parseInt(value) === 1 ? '普通用户' : '管理员'
    },
    // 格式化推送方式
    noticeto(row, column, value) {
      value = parseInt(value)
      if (value === 1) {
        return '短信'
      } else if (value === 2) {
        return '微信'
      } else if (value === 4) {
        return '邮件'
      } else {
        return '--'
      }
    },
    // 编辑用户信息
    handleEdit(index, row) {
      const data = clone(row)
      data.roles = data.roles.toString()
      data.noticeto = data.noticeto.toString()
      this.editIndex = index
      this.editData = data
      this.editShow = true
      this.editPhone = data.phone
    },
    // 取消编辑
    closeEdit() {
      this.editShow = false
    },
    // 提交更改
    subEdit() {
      this.$refs.edit.validate((valid) => {
        if (valid) {
          const loading = this.$loading({ text: '数据上传中', lock: true })
          this.editData.password = this.$md5(this.editPassword)
          const self = this
          userMsg({ data: this.editData, phone: this.editPhone }).then((e) => {
            if (e.code === 0) {
              self.success('修改信息成功')
            } else {
              self.error(e.message)
            }
            self.closeEdit()
            loading.close()
            self.refresh()
          }).catch(() => {
            self.error('信息修改失败')
            self.closeEdit()
            loading.close()
          })
        } else {
          return false
        }
      })
    },
    // 添加用户
    subUser() {
      this.$refs.add.validate((valid) => {
        const self = this
        if (valid) {
          const loading = this.$loading({ text: '数据上传中', lock: true })
          this.addData.password = this.$md5(this.addData.password)
          addUser(this.addData).then((e) => {
            if (e.code === 0) {
              self.success('添加用户成功')
            } else {
              self.error(e.message)
            }
            self.addShow = false
            loading.close()
            self.refresh()
          }).catch((e) => {
            self.error('添加用户失败')
            self.addShow = false
            loading.close()
          })
        }
      })
    },
    // 删除用户
    handleDelete(inedx, row) {
      this.$confirm('您确定删除该用户么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const self = this
        const loading = this.$loading({ text: '删除中', lock: true })
        delUser(row.phone).then((e) => {
          if (e.code === 0) {
            self.success('删除用户成功')
          }
          loading.close()
          self.refresh()
        }).catch((e) => {
          self.error('删除用户失败')
          loading.close()
        })
      }).catch(() => { return })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  padding: 30px;
  box-sizing: border-box;
  height: 100%;
  & .addUser {
    margin-bottom: 12px;
  }
  & .edit__item {
    margin-right: 15px;
    & >>> .el-form-item__label {
      width: 78px;
    }
    & .edit__put {
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
}
</style>
