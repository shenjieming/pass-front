<template>
  <div class="frame-left">
    <div  class="frame-left-top" >
      <div v-if="activeTab==='first'">
        <span class="frame-left-top-label" @click="addItem" :class="{'font-active': activeTab==='first'}"><i class="el-icon-date" ></i> 新建分组</span>
        <span class="frame-left-top-label" @click="activeTab='second'" :class="{'font-active': activeTab==='second'}"  ><i class="el-icon-refresh" ></i> 调整顺序</span>
      </div>
      <span v-if="activeTab==='second'" :class="{'font-active': activeTab==='second'}" class="wd-100_ct" @click="activeTab='first'"><i class="el-icon-success"  ></i> 完成顺序</span>
    </div>
    <div v-for="(item,index) in groupList" class="group-item"  :class="{'group-item-active':item.popoerEditVisible}"  :key="item.id"  v-if="activeTab==='first'"  @click.self="getEditItem(item)">
      <i class="el-icon-tickets"  ></i>&nbsp; &nbsp;{{item.text}}
      <el-popover
        placement="right"
        width="160"
        v-model="item.popoerEditVisible"
        class="group-item-icon"
      >
        <p style="border-bottom: 1px solid orangered" class="popover-item-active" @click="item.popoerRenamrVisible=true;item.popoerEditVisible=false;itemRename= item.text">修改名称</p>
        <p class="popover-item-active" @click="popoverItemDelete(index)">删除</p>
        <span  slot="reference" @click="item.popoerEditVisible=true">
                 <i class="el-icon-setting " ></i>
               </span>
      </el-popover>
      <el-popover
        placement="right"
        width="140"
        v-model="item.popoerRenamrVisible"
        class="group-item-icon"
      >
        <div style="padding: 5px">
          <el-input v-model="itemRename"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="item.popoerRenamrVisible=false">取消</el-button>
            <el-button type="primary" size="mini" @click="renameSubmit(item)">确定</el-button>
          </div>
        </div>
      </el-popover>
    </div>
    <div v-if="activeTab=='second'">
      <draggable v-model="groupList" :option="{disabled:false,chosenClass: 'group-item' ,animation:150}">
        <transition-group>
          <div v-for="item in groupList" class="group-item"  :key="item.id" >
            <i class="el-icon-tickets"></i>&nbsp; &nbsp;{{item.text}} <i class="el-icon-setting group-item-icon"></i>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import store from '@/store'
  const list = [
    { name: '新建表单1', id: '1', text: '新建表单1', type: 'from' },
    { name: '新建表单2', id: '2', text: '新建表单2', type: 'from' },
    { name: '新建表单3', id: '3', text: '新建表单3', type: 'from' },
    { name: '新建表单4', id: '4', text: '新建表单4', type: 'from' },
    { name: '新建表单5', id: '5', text: '新建表单5', type: 'from' }
  ]
  export default {
    name: 'sideBar',
    components: {
      draggable
    },
    data() {
      return {
        groupList: JSON.parse(JSON.stringify(list)), // 数据列表
        isDraggable: false, // 标志位判断是否需要拖拽
        activeTab: 'first', // 默认激活tab页
        itemRename: '' // 修改项目名称
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab)
        // 进入拖拽排序组件
        if (tab.name === 'second') {
          this.isDraggable = true
          this.activeTab = 'third'
        }
        if (tab.name === 'third') {
          this.isDraggable = false
          this.activeTab = 'first'
        }
      },
      // 删除项目
      popoverItemDelete(index) {
        this.groupList.splice(index, 1)
        this.$message.success('删除成功！')
      },
      // 修改项目名称
      renameSubmit(item) {
        item.text = this.itemRename
        item.popoerRenamrVisible = false
        this.$message.success('项目名称修改成功！')
      },
      // 编辑项目页面
      getEditItem(item) {
        /*
        1: 设置为编辑页面
        2：存储编辑页面内容信息
        */
        const isEditPage = true
        store.dispatch('editPage', { isEditPage }).then(() => {
          store.dispatch('setNav', item.text).then(() => {
            this.$router.push({ path: '/edit/formDesign', params: { id: item.id }})
          })
        })
      },
      // 新建分组
      addItem() {
        this.activeTab = 'first'
        this.groupList.push(
          { name: `新建表单${this.groupList.length + 1}`, id: this.groupList.length + 1, text: `新建表单${this.groupList.length + 1}`, type: 'from' }
        )
      }
    }
  }
</script>
<style rel="stylesheet/scss"  lang="scss" scoped>

  .group-item {
    height: 40px;
    line-height: 40px;
    padding: 0 20px ;
    cursor: pointer;
  }
  .group-item-active{
    background: #0b8bef;
    color: #fff;
  }
  .group-item:hover{
    background: #0b8bef;
    color: #fff;
  }
  .group-item-icon {
    float: right;
    margin-right: 20px;
    line-height: 40px;
  }

  .popover-item-active {
    padding:10px 8px;
    cursor: pointer;
  }
  .popover-item-active:hover {
    background: #0b8bef;
    color: #fff;
  }

</style>
