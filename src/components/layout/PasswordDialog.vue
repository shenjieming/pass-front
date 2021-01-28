<template>
  <el-dialog title="修改密码" width="500px" :visible.sync="isActive" class="settingDialog" :before-close="dialogClose">
  	<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="110px" style='width: 400px; margin: 15px auto;'>
      <el-form-item label="原密码" prop="oldPassword" class="is-required row">
        <el-input v-model.trim="temp.oldPassword" type="password" placeholder="请输入原始密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" class="is-required row">
        <el-input v-model.trim="temp.newPassword" type="password" placeholder="请输入新的密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="affirmPassword" class="is-required row">
        <el-input v-model.trim="temp.affirmPassword" type="password" placeholder="请再次输入新的密码"></el-input>
      </el-form-item>
  	</el-form>
  	<div slot="footer" class="dialog-footer">
  		<el-button @click.native="dialogClose">取消</el-button>
  		<el-button type="primary" :loading="loading" @click.native="updateData">确认</el-button>
  	</div>
  </el-dialog>
</template>

<script>
import { changePassword } from '@/api/user'
// import { validatPassword } from '@/utils/validate'

export default {
  name: 'PasswordDialog',
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
  data() {
    const passwordCheckValidate = (rule, value, callback) => {
      if (value !== this.temp.newPassword) {
        callback(new Error('两次密码不匹配'))
      } else {
        callback()
      }
    }
    const newPasswordCheckValidate = (rule, value, callback) => {
      if (value !== this.temp.affirmPassword && this.temp.affirmPassword) {
        this.$refs['dataForm'].validateField('affirmPassword')
      } else if (value === this.temp.affirmPassword && this.temp.affirmPassword) {
        this.$refs['dataForm'].validateField('affirmPassword')
        callback()
      }
    }
    // const passwordCheck = (rule, value, callback) => {
    //   if (!validatPassword(value)) {
    //     callback(new Error('密码只能输入字母、数字、下划线 '))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loading: false,
      temp: {
        oldPassword: '',
        newPassword: '',
        affirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: newPasswordCheckValidate, trigger: 'blur' }
        ],
        affirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: passwordCheckValidate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dialogClose(done) {
      this.$refs['dataForm'].clearValidate()
      this.resetTemp()
      this.toggleClick()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          delete tempData['affirmPassword']
          this.loading = true
          changePassword(tempData).then(response => {
            this.loading = false
            this.dialogClose()
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
        oldPassword: '',
        newPassword: '',
        affirmPassword: ''
      }
    }
  }
}
</script>