<template>
  <div >
    <toolBar :layout-model="formData.layoutModel" :selectField="selectField" @group-item-click="groupItemClick"></toolBar>
    <fromEdit :selectField="selectField" :formData="formData" ref="formEdit"></fromEdit>
    <div class="frame-container">
      <div class="frame-container-bar">
        <div class="fr" style="position: relative;bottom: 5px;right: 10px">
          <el-button type="primary" plain @click="save">
            保存
          </el-button>
        </div>
      </div>
      <div class="frame-container-draggable">
        <draggable v-model="formData.layoutModel"
                     element="ul"
                     :options="{group: {name:'draggableModel'},disabled: false,animation: 200,sort: true,draggable:'.widget-group',ghostClass:'ghost-form'}"
                     ref="layoutModel"
                     :move="onMove"
                     @start="onStart"
                     @end="onEnd"
                     @update="onUpdate"
                     @sort="onSort"
                     id="drag-layout"
          >
            <li v-for="(item,index) in formData.layoutModel" :id="index" class="widget-group" @click="groupItemClick(item,index)" :class="{'widget-group-active': item.active}" >
              <div class="item">
                <div v-if="item.shadow"></div>
                <div v-if="item.type==='input'"  >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-input type="text" v-model="item.content" readonly="readonly"/>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='textArea'" >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <textarea   v-model="item.content" readonly="readonly"/>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='number'" >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-input type="number" v-model="item.content" readonly="readonly" />
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='dateTime'" >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-input
                      suffix-icon="el-icon-date"
                      readonly="readonly"
                      v-model="item.content">
                    </el-input>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline" style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='radioGroup'" >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-radio-group v-model="item.content" text-color="#fff" fill="#fff">
                      <el-radio :disabled="true" v-model="item.content" :lable="1" ><span style="color: #000" >备选项1</span> </el-radio>
                      <el-radio :disabled="true" v-model="item.content" :lable="2"><span style="color: #000">备选项2</span> </el-radio>
                      <el-radio :disabled="true" v-model="item.content" :lable="3"><span style="color: #000">备选项3</span></el-radio>
                    </el-radio-group>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='checkBoxGroup'">
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-checkbox-group v-model="item.content">

                      <el-checkbox disabled  ><span style="color: #000">复选框 A</span></el-checkbox>
                      <el-checkbox disabled ><span style="color: #000">复选框 B</span></el-checkbox>
                      <el-checkbox disabled ><span style="color: #000">复选框 C</span></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='combo'">
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-select v-model="item.content" >
                      <el-option v-for="i in item.list" :value="i.label" :key="i.id"></el-option>
                    </el-select>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline" style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='comboCheck'" >
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <el-select v-model="item.content" multiple>
                      <el-option v-for="i in item.list" :value="i.label" :key="i.id"></el-option>
                    </el-select>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
                <div v-if="item.type==='cut-off'">
                  <div class="group-label"> {{item.name}} </div>
                  <div class="group-description "> <span v-html="item.desc"></span></div>
                  <div class="group-element">
                    <div class="cut-off-solid"></div>
                  </div>
                  <div class="group-mask" v-if="item.active">
                    <i class="el-icon-circle-plus-outline" style="color: #0DB3A6" @click="copyItem(item,index)"></i>
                    <i class="el-icon-remove-outline"style="color: #d84636" @click="deleteItem(item,index)"></i>
                  </div>
                </div>
              </div>
            </li>
          </draggable>
      </div>
    </div>
  </div>
</template>

<script>
  import fromEdit from './edit'
  import toolBar from './toolBar'
  import draggable from 'vuedraggable'
  export default {
    name: 'index',
    components: {
      fromEdit,
      toolBar,
      draggable
    },
    data() {
      return {
        selectField: {}, // 展示字段详情
        // 表单设置详情
        formData: {
          layoutModel: []
        }
      }
    },
    computed: {
    },
    methods: {
      /* relatedContext 拖拽后容器  draggedContext 拖拽原先容器*/
      onMove({ relatedContext, draggedContext }) {
        console.log({ relatedContext, draggedContext })
      },
      onStart(event) {
        if (event && document.getElementsByClassName('widget-group')[event.oldIndex]) {
          document.getElementsByClassName('ghost-form')[0].style.height = document.getElementsByClassName('widget-group')[event.oldIndex].style.height
        }
      },
      onEnd(e) {
        // console.log (e)
      },
      onUpdate(e) {
        // console.log (e)
      },
      onSort(e) {
        console.log(e)
        this.cloneWidgetLabel(e.newIndex)
      },
      /* 点击激活状态*/
      groupItemClick(item) {
        this.$nextTick(() => {
          this.formData.layoutModel.forEach((value) => {
            value.active = false
          })
          item.active = true
          this.selectField = item
          this.$refs.formEdit.checkTabs('first')
        })
      },
      /* 添加一项内容*/
      copyItem(item, index) {
        this.formData.layoutModel.forEach((value, key) => {
          if (index === key) {
            const random = Math.random()
            const dgItem = JSON.parse(JSON.stringify(item))
            this.$set(dgItem, 'id', random)
            this.formData.layoutModel.push(dgItem)
          }
        })
      },
      /* 删除一项内容*/
      deleteItem(item, index) {
        this.formData.layoutModel.splice(index, 1)
        this.selectField = this.formData.layoutModel[this.formData.layoutModel.length - 1]
        this.formData.layoutModel[this.formData.layoutModel.length - 1].active = true
      },
      // 每次拖拽 动态生成一条新的id，防止vue数据追踪同源
      cloneWidgetLabel(index) {
        const item = this.formData.layoutModel[index]
        const random = Math.random()
        const dgItem = JSON.parse(JSON.stringify(item))
        this.$set(dgItem, 'id', random)
        this.$set(this.formData.layoutModel, index, dgItem)
      },
      save() {
        localStorage.setItem('formData', JSON.stringify(this.formData))
        this.$message.success('保存成功！')
      }
    },
    mounted() {
      if (localStorage.getItem('formData')) {
        this.formData = JSON.parse(localStorage.getItem('formData'))
      }
    }
  }
</script>
<style scoped lang="scss">
  /*.sortable-chosen {*/
    /*height: 70px;*/
    /*width: 100%;*/
  /*}*/
  #drag-layout {
    width: 100%;padding-bottom: 150px;overflow: auto;min-height: 40px;height: 100%
  }
  .widget-group {
    width: 100%;
    padding: 0 32px 0 32px;
    background: transparent;
    border: none;
    .item {
      position: relative;
      margin-bottom: 14px;
      box-sizing:border-box;
      width: 100%;
      display: inline-block;
      min-height: 32px;
    }
    .group-label {
      margin: 4px 0;
    }
    .group-description {
      font-size: 12px;
      line-height: 1.4;
      color: #777;
      margin-bottom: 5px
    }
    .group-element {
      /*position: absolute;*/
      /*width: 100%;*/
      left: 0;
    }
    .group-mask {
      line-height: normal;
      position: absolute;
      right: 50px;
      font-size: 24px;
      background: rgba(0,0,0,0);
      padding: 2px 6px;
      z-index: 2;
      cursor: pointer;
    }
  }
  .widget-group-active {
    background-color: #EBF8FB;
    border-color: #0DB3A6;
    border-left: 5px solid #0db3A6;
  }
  .widget-group:hover {
    background-color: #EBF8FB;
    border-color: #0DB3A6
  }
  .widget-group:before {
    content: " ";
    display: table;
    line-height: 0
  }
  .widget-select {
    background-color: #EBF8FB;
    border-color: #0DB3A6;
    border-left: 5px solid #0DB3A6
  }
  .cut-off-solid {
   width: 100%;border-bottom: 1px solid #000;height: 2px
 }
  .cut-off-dotted {
    width: 100%;border-bottom: 1px dotted #000;height: 2px
  }
  .cut-off-double {
    width: 100%;border-bottom: 1px double #000;height: 2px
  }
  .el-input {
    width: 240px;
    height: 30px;
    cursor: initial;
  }
  .el-textarea{
    width: 400px;
    height: 60px;
    cursor: initial;
  }
  textarea {
    resize:none;
    width: 400px;
    height: 60px;
    border: 1px solid #dcdfe6;
  }
  .el-radio+.el-radio {
    margin: 4px 0;
  }
  .el-radio {
    width: 100%;
  }
  .el-radio-group {
    margin: 10px 0;
  }
</style>
