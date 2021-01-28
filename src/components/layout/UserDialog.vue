<template>
  <el-dialog title="基本资料" width="500px" :visible.sync="isActive" class="settingDialog" :before-close="dialogClose">
  	<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="110px" style='width: 400px; margin: 0 auto 10px;'>
      <el-form-item label="手机号" class="row phoneDialogFirst">
        <span>{{username}}</span>
        <!--<label class="el-form-item__label" style="padding: 0 0 0 12px;">手机号</label>-->
      </el-form-item>
      <el-form-item label="负责人" class="row">
        <el-input v-model="temp.principal" :maxlength="15" placeholder="请输入负责人姓名"></el-input>
      </el-form-item>
      <el-form-item label="公司名" prop="compName" class="row">
        <el-input v-model="temp.compName" :maxlength="20" :disabled="true" placeholder="请输入公司名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" class="row">
        <el-input v-model="temp.phone" :maxlength="15"  placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="总部地址" class="row">
        <el-input v-model="temp.detailAddress" :maxlength="20"  placeholder="请输入总部地址"></el-input>
      </el-form-item>
  	</el-form>
  	<div slot="footer" class="dialog-footer">
  		<el-button @click.native="dialogClose">取消</el-button>
  		<el-button type="primary" :loading="loading" @click.native="submitForm">确认</el-button>
  	</div>
  </el-dialog>
</template>

<script>
import { merchantInfo, organizationUpdate } from '@/api/organization'
import { mapGetters } from 'vuex'

const defaultForm = {
  principal: '', // 负责人
  compName: '', // 公司名
  phone: '', // 联系电话
  detailAddress: '' // 总部地址
}

export default {
  name: 'UserDialog',
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
    ])
  },
  data() {
    return {
      loading: false,
      temp: JSON.parse(JSON.stringify(defaultForm)),
      rules: {
        compName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    dialogClose(done) {
      this.$refs['dataForm'].clearValidate()
      this.temp = JSON.parse(JSON.stringify(defaultForm))
      this.toggleClick()
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          tempData['companyType'] = 1
          tempData['type'] = 2
          tempData['id'] = tempData['orgaId']
          tempData['name'] = tempData['compName']
          delete tempData['orgaId']
          delete tempData['mobile']
          delete tempData['compName']
          organizationUpdate(tempData).then(response => {
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
      merchantInfo().then(response => {
        if (response.data) {
          const temp = JSON.parse(JSON.stringify(defaultForm))
          this.temp = Object.assign(temp, response.data)
        }
      })
    }
  }
}
</script>