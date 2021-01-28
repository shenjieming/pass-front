<template>
  <div class="frame-right">
    <el-tabs v-model="activeName" style="width: 100%">
      <el-tab-pane label="字段属性" name="first" >
        <div  class="form_title" v-if="">
          <span>标题</span>
          <el-select v-model="selectField.type" placeholder="请选择"  class="frame-right" style="width: 100px;height: 30px;position: relative;float: right" v-if="selectField.TransformList">
            <el-option
              v-for="item in selectField.TransformList"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </div>
        <el-input  v-model="selectField.name"> </el-input>
        <div class="from-split"></div>
        <div  class="form_title">字段key值</div>
        <el-input v-model="selectField.filed"></el-input>
        <div class="from-split"></div>
        <div  class="form_title">描述信息</div>
        <quill-editor ref="myTextEditor"
                      v-model="selectField.desc"
                      :options="editorOption">
        </quill-editor>
        <template v-if="inputVisible">
          <div class="from-split"></div>
          <div  class="form_title">默认值</div>
          <textarea  v-model="selectField.content"></textarea>
        </template>
        <template v-if="selectVisible">
          <div class="from-split"></div>
          <div  class="form_title">选项</div>
          <el-select v-model="selectField.optionType" class="wd-100 mg-btm-8">
            <el-option label="自定义" :value="0"></el-option>
            <el-option label="数据字典" :value="1"></el-option>
          </el-select>
          <el-input v-if="selectField.optionType === 1" v-model="selectField.dictionary"></el-input>
          <div v-for="item in selectField.list"  v-else>
            <el-input v-model="item.label" class="mg-top-4"></el-input>
          </div>
        </template>
        <template v-if="multipleSelectVisible">

        </template>
        <template v-if="noField">
          <div class="from-split"></div>
          <div  class="form_title">校验</div>
          <el-checkbox v-model="selectField.isRequire" > 必填 </el-checkbox>
<!--          <el-checkbox v-model="formData.verify.isRepeat" > 不允许重复值 </el-checkbox>-->
          <div class="from-split"></div>
          <div  class="form_title">字段权限</div>
          <el-checkbox v-model="selectField.isShow" > 可见 </el-checkbox>
          <el-checkbox v-model="selectField.isEdit" > 可编辑 </el-checkbox>
          <div class="from-split"></div>
          <div  class="form_title">布局</div>
        </template>

      </el-tab-pane>
      <el-tab-pane label="表单属性" name="second">
          <div  class="form_title">表单提交校验</div>
          <el-button class="wd-100">添加校验条件</el-button>
          <div class="from-split"></div>
          <div  class="form_title">表单布局</div>
          <el-button-group>
            <el-button autofocus>单列</el-button>
            <el-button >双列</el-button>
            <el-button >四列</el-button>
          </el-button-group>
          <div class="from-split"></div>
<!--          <div  class="form_title">不可见字段值</div>-->
<!--          <el-select v-model="formData.weightDefault">-->
<!--            <el-option value="保持原值"></el-option>-->
<!--             <el-option value="空值"></el-option>-->
<!--            <el-option value="始终重新计算"></el-option>-->
<!--          </el-select>-->
          <div class="from-split"></div>
          <div  class="form_title">表单前台缓存</div>
          <el-button-group>
            <el-button >启用</el-button>
            <el-button autofocus>禁用</el-button>
          </el-button-group>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'edit',
    computed: {
      inputVisible() {
        return this.selectField.type === 'input' || this.selectField.type === 'textArea' || this.selectField.type === 'number'
      },
      selectVisible() {
        return this.selectField.type === 'combo' || this.selectField.type === 'radioGroup'
      },
      multipleSelectVisible() {
        return this.selectField.type === 'comboCheck' || this.selectField.type === 'comboCheck'
      },
      noField() {
        return this.selectField.type !== 'cut-off'
      }
    },
    props: {
      // 字段详情设置
      selectField: {
        type: Object,
        default: {
          TransformList: []
        }
      },
      // 表单详情设置
      formData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        /* 默认打开tabs 页面*/
        activeName: 'second',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link', 'image']
            ]
          }
        }
      }
    },
    methods: {
      // onEditorBlur(editor) {
      //   console.log('editor blur!', editor)
      // },
      // onEditorFocus(editor) {
      //   console.log('editor focus!', editor)
      // },
      // onEditorReady(editor) {
      //   console.log('editor ready!', editor)
      // },
      checkTabs(tab) {
        this.activeName = tab
      }
    }
  }
</script>

<style  lang="scss">
  .frame-right {
    .el-tabs__nav-wrap {
      height: 45px ;
      .el-tabs__item {
        width: 130px;
        text-align: center;
      }
    }
    .el-tabs__content {
      padding: 0 10px;
      textarea {
        resize:none;
        width: 100%;
        height: 140px;
      }
    }
    .form_title {
      font-weight: 700;
      width: 100%;
      margin-bottom: 10px;
      line-height: 30px;
    }
    .from-split {
      border-top: solid 1px #e1e1e1;
      height: 0;
      margin: 15px 0
    }
    .ql-editor {
      height: 100px;
    }
  }
</style>
