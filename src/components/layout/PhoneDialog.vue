<template>
  <el-dialog title="换绑手机" width="500px" :visible.sync="isActive" class="settingDialog" :before-close="dialogClose">
  	<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="110px" style='width: 400px; margin: 0 auto;'>
      <el-form-item label="原手机号" class="row phoneDialogFirst">
        {{username}}
      </el-form-item>
      <el-form-item label="密码" prop="password" class="row">
        <el-input v-model="temp.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="新手机号码" prop="phone" class="row">
        <el-input v-model="temp.phone" :maxlength="11" placeholder="请输入新的手机号码"></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="code" class="row phoneDialogCode">
        <el-input v-model="temp.code" :maxlength="6" placeholder="请输入验证码"></el-input>
        <div :class="{code:true,disabled:!show}" @click="sendCode">
        	{{text}}
        </div> 
      </el-form-item>
  	</el-form>
  	<div slot="footer" class="dialog-footer">
  		<el-button @click.native="dialogClose">取消</el-button>
  		<el-button type="primary" :loading="loading" @click.native="updateData">确认</el-button>
  	</div>
  </el-dialog>
</template>

<script>
import { sendMessageByNode, changeBindingPhone } from '@/api/user'
import { mapGetters } from 'vuex'
import { validatPhone } from '@/utils/validate'

export default {
  name: 'PhoneDialog',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ]),
    text() {
      return this.count > 0 ? this.count + 's 后重获取' : '获取验证码'
    }
  },
  data() {
    const phoneCheckValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码 '))
      } else if (!validatPhone(value)) {
        callback(new Error('请输入正确的手机号码 '))
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('验证码不能为空 '))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位验证码 '))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      temp: {
        password: '',
        phone: '',
        code: ''
      },
      show: true,
      count: '',
      timer: null,
      rules: {
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '新手机号码不能为空', trigger: 'blur' },
          { validator: phoneCheckValidate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 发送验证码
    sendCode() {
      this.$refs['dataForm'].validateField('phone', (valid) => {
        if (!valid) {
          if (this.show) {
            const tempData = {}
            tempData.phone = this.temp.phone
            tempData.node = 'change_binding_phone'
            sendMessageByNode(tempData).then(response => {
              const TIME_COUNT = 60
              if (!this.timer && response.data) {
                this.count = TIME_COUNT
                this.show = false
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--
                  } else {
                    this.show = true
                    clearInterval(this.timer)
                    this.timer = null
                  }
                }, 1000)
              }
            }).catch(() => {
              this.show = true
              this.count = ''
              clearInterval(this.timer)
              this.timer = null
            })
          }
        }
      })
    },
    dialogClose(done) {
      this.$refs['dataForm'].clearValidate()
      this.resetTemp()
      this.toggleClick()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          changeBindingPhone(tempData).then(response => {
            this.loading = false
            this.$store.dispatch('ChangeRoles', this.$store.getters.token).then(() => {
              this.dialogClose()
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetFields() {
      this.resetTemp()
    },
    resetTemp() {
      this.temp = {
        password: '',
        code: '',
        phone: ''
      }
      this.show = true
      this.count = ''
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>