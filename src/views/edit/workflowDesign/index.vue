<template>
  <div>
    <div  class="flow-body">
      <div class="flow-sideBar ">
        <div class="fr p-lv-10">
          <el-button type="primary" plain>
            保存
          </el-button>
          <el-button type="info" plain>
            启用流程
          </el-button>
        </div>
      </div>
      <div class="flow-container">
        <div class="flow-tool-bar">
          <div class="fl">
            <i class="fa fa-caret-left" @click="goBack"></i>
            <i class="fa fa-caret-right" @clik="goNext"></i>
          </div>
          <div class="menu-line"></div>
          <div id="myPaletteDiv" style="height: 45px;width: 200px;bottom: 5px;" class="fl p-lv-10"></div>
          <div class="menu-line"></div>
          <div class="fl">
            <i class="fa fa-trash-o"></i>
          </div>
        </div>
        <div class="flow-view">
          <div id="myDiagramDiv" style="border: solid 1px #eee; height: 100%;width:100%;"></div>
        </div>
      </div>
      <div class="flow-edit">
        <el-tabs v-model="activeName">
          <el-tab-pane label="节点设置" name="node">
            <node-info :selectionNode="selectionNode" @refresh="refresh" :foromData="formData"></node-info>
          </el-tab-pane>
          <el-tab-pane label="节点连接线" name="link">
            <link-info :selectionNode="selectionNode"></link-info>
          </el-tab-pane>
          <el-tab-pane label="流程设置" name="flow">
            <flow-info :modelData="modelData"></flow-info>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--绘图区域-->
  </div>
</template>
<script>
  import go from '../../../../static/js/go'
  import flowInfo from "./attributeSet/flowInfo"
  import nodeInfo from "./attributeSet/nodeInfo"
  import linkInfo from "./attributeSet/linkInfo"
  const GO = go.GraphObject.make // for conciseness in defining templates
  let myDiagram = {}
  let myPalette = {}
  export default {
    name: 'index',
    components: {
      flowInfo,
      nodeInfo,
      linkInfo
    },
    data() {
      return {
        modelData: {},
        selectionNode: {},
        activeName: 'flow',
        formData: {
          layoutModel: []
        }
      }
    },
    methods: {
      load(layoutModel = []) {
        myDiagram.model = go.Model.fromJson({ 'class': 'go.GraphLinksModel',
          'linkFromPortIdProperty': 'fromPort',
          'linkToPortIdProperty': 'toPort',
          'nodeDataArray': [
            { 'category': 'Start', 'text': '流程开始节点', 'key': 1, 'loc': '0 50', 'auditList': [], option: layoutModel },
            { 'category': 'End', 'key': 2, 'loc': '0 400', 'text': '流程结束节点', 'auditList': [], option: layoutModel }
          ]
        })
      },
      // Make all ports on a node visible when the mouse is over the node
      showPorts(node, show) {
        const diagram = node.diagram
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return
        node.ports.each(function(port) {
          port.stroke = (show ? '#FF8E3D' : null)
          port.strokeWidth = 2
        })
      },
      /* 前进*/
      goNext() {
      },
      // 后退
      goBack () {
      },
      // 刷新画布
      refresh () {
        myDiagram.model = go.Model.fromJson(this.modelData)
      },
      // helper definitions for node templates
      nodeStyle() {
        return [
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center,
            // handle mouse enter/leave events to show/hide the ports
            mouseEnter: (e, obj) => {
              this.showPorts(obj.part, true)
            },
            mouseLeave: (e, obj) => { this.showPorts(obj.part, false) }
          },
        ]
      },
      // This listener is called by the 'LinkDrawn' and 'LinkRelinked' DiagramEvents.
      showLinkLabel(e) {
        const label = e.subject.findObject('LABEL')
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === 'Diamond')
      },
      makePort(name, spot, output, input) {
        return GO(go.Shape, 'Circle',
          {
            fill: 'transparent',
            stroke: null, // this is changed to 'white' in the showPorts function
            desiredSize: new go.Size(8, 8),
            alignment: spot,
            alignmentFocus: spot, // align the port on the main Shape
            portId: name, // declare this object to be a 'port'
            fromSpot: spot,
            toSpot: spot, // declare where links may connect at this port
            fromLinkable: output,
            toLinkable: input, // declare whether the user may draw links to/from here
            cursor: 'pointer' // show a different cursor to indicate potential link point
          })
      },
      modelChanged(e) {
        // 获取整个模型对象
        this.modelData = JSON.parse(e.model.toJson())
      },
    },
    mounted() {
      this.formData = JSON.parse(localStorage.getItem('formData'))
      const layoutModel = this.formData.layoutModel || []
      // if (window.goSamples) goSamples() // init for these samples -- you don't need to call this
      myDiagram =
        GO(go.Diagram, 'myDiagramDiv', // must name or refer to the DIV HTML element
          {
            initialContentAlignment: go.Spot.Center, //画布的位置设置（居中，靠左等）
            allowDrop: true, // must be true to accept drops from the Palette
            'LinkDrawn': this.showLinkLabel, // this DiagramEvent listener is defined below
            'LinkRelinked': this.showLinkLabel,
            'animationManager.duration': 1, //画布刷新的加载速度
            'undoManager.isEnabled': true, // 允许缩放
            'ModelChanged': (e) => {
              this.modelChanged(e)
            }
          })
      // when the document is modified, add a '*' to the title and enable the 'Save' button
      myDiagram.addDiagramListener('Modified', (e) => {
        const button = document.getElementById('SaveButton')
        if (button) button.disabled = !myDiagram.isModified
        const idx = document.title.indexOf('*')
        if (myDiagram.isModified) {
          if (idx < 0) document.title += '*'
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx)
        }
      })
      myDiagram.addDiagramListener("LinkDrawn", (e) => {
        e.subject.data.text = '下一步'
        // console.log(e.subject);
      })
      myDiagram.addDiagramListener('ChangedSelection', (e) =>  {
        let selectData = {}
        // console.log(JSON.pars(e.model.toJson()))
        myDiagram.selection.each(function(nodeOrLink) {
          selectData = nodeOrLink.data
          //获取选中节点
          // if(nodeOrLink instanceof go.Node){
          // } else if(nodeOrLink instanceof go.Link){
          //   selectData = nodeOrLink.data
          //   //获取选中的连线
          //   var from=nodeOrLink.data.from;
          //   var to=nodeOrLink.data.to;
          // }
        })
        if (selectData.key || selectData.key === 0) {
          this.selectionNode = this.modelData.nodeDataArray.filter(item => item.key === selectData.key)[0]
        } else  {
          this.selectionNode = this.modelData.linkDataArray.filter(item => item.from === selectData.from && item.to === selectData.to)[0]
        }
        if (selectData.key) {
          this.activeName = 'node'
        } else if (selectData.toPort) {
          this.activeName = 'link'
        } else {
          this.activeName = 'flow'
        }
      })
      // define the Node templates for regular nodes
      myDiagram.nodeTemplateMap.add('', // the default category
        GO(go.Node, 'Spot', this.nodeStyle(),
          GO(go.Panel, 'Auto',
            GO(go.Shape, 'Rectangle',
              { fill: '#F9FAFE', stroke: '#F9FAFE' }
            ),
            GO(go.TextBlock,
              {
                font: '12px  Helvetica, Arial, sans-serif',
                stroke: '#000',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding('text').makeTwoWay())
          ),
          // four named ports, one on each side:
          this.makePort('T', go.Spot.Top, false, true),
          this.makePort('L', go.Spot.Left, true, true),
          this.makePort('R', go.Spot.Right, true, true),
          this.makePort('B', go.Spot.Bottom, true, false)
        ))
      myDiagram.nodeTemplateMap.add('Start',
        GO(go.Node, 'Spot', this.nodeStyle(),
          GO(go.Panel, 'Auto',
            GO(go.Shape, 'Rectangle',
              { fill: '#F9FAFE', stroke: '#eee' },
              new go.Binding('figure', 'figure')),
            GO(go.TextBlock,
              {
                font: '14px  Helvetica, Arial, sans-serif',
                stroke: '#000',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: false
              },
              new go.Binding('text').makeTwoWay())
          ),
          // three named ports, one on each side except the top, all output only:
          this.makePort('L', go.Spot.Left, true, false),
          this.makePort('R', go.Spot.Right, true, false),
          this.makePort('B', go.Spot.Bottom, true, false)
        ))
      myDiagram.nodeTemplateMap.add('End',
        GO(go.Node, 'Spot', this.nodeStyle(),
          GO(go.Panel, 'Auto',
            GO(go.Shape, 'Rectangle',
              { fill: '#F9FAFE', stroke: '#eee' },
              new go.Binding('figure', 'figure')),
            GO(go.TextBlock,
              {
                font: '14px  Helvetica, Arial, sans-serif',
                stroke: '#000',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: false
              },
              new go.Binding('text').makeTwoWay())
          ),
          // three named ports, one on each side except the bottom, all input only:
          this.makePort('T', go.Spot.Top, false, true),
          this.makePort('L', go.Spot.Left, false, true),
          this.makePort('R', go.Spot.Right, false, true)
        ))
      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate = GO(go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          curviness: 20,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          // mouseEnter: function(e, link) { link.findObject('HIGHLIGHT').fill = '#E05353' },
          // mouseLeave: function(e, link) { link.findObject('HIGHLIGHT').fill = '#fff' },
          click: function (e, link) {
            // console.log(e.model.toJs)
            console.log(e, link)
          }
        },
        new go.Binding('points').makeTwoWay(),
        GO(go.Shape, // the link path shape
          { isPanelMain: true, stroke: '#FF8E3D', strokeWidth: 2, fill: '#fff' }),
        GO(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null, fill: "gray"}),
        GO(go.TextBlock, '下一步', // the label
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: '#333333',
            editable: true,
            margin: 20,
          },
          new go.Binding('text').makeTwoWay()),
      )
      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal
      this.load(layoutModel)
      // initialize the Palette that is on the left side of the page
      myPalette = GO(go.Palette, 'myPaletteDiv', // must name or refer to the DIV HTML element
        {
          'animationManager.duration': 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          model: new go.GraphLinksModel([ // specify the contents of the Palette
            { text: '流程节点', 'auditList': [], option: layoutModel },
            { text: '抄送节点', 'auditList': [], option: layoutModel }
          ])
        })
    },
  }
</script>

<style scoped lang="scss">
  .flow-body {
    position: absolute;left: 0;right: 0;top: 0;bottom: 50px;
    .flow-sideBar{
      height: 50px;
      line-height: 50px;
      border-bottom: solid 1px #e0e0e0;
      width: 100%;
    }
    .flow-container{
      position: absolute;
      top: 50px;
      left: 0;
      right: 300px;
      bottom: 0;
      .flow-tool-bar{
        position: absolute;
        top: 5px;
        left: 20px;
        right: 20px;
        height: 45px;
        padding: 5px 10px;
        line-height: 30px;
        background: #F4F6FC;
        border-radius: 2px;
        font-size: 12px;
        i {
          color: #8a8585;
          font-size: 16px;
          padding: 0 10px;
        }
        .menu-line {
          position: relative;
          float: left;
          left: 0;
          width: 1px;
          height: 20px;
          background: #A0A0A0;
          margin: 5px 10px
        }
      }
      .flow-view{
        position: absolute;
        top:50px;
        right: 0;
        bottom: 0;
        left: 20px;
        padding: 5px;
      }
    }
    .flow-edit{
      position: absolute;
      bottom: 0;
      right: 0;
      top: 50px;
      width: 300px;
      height: 100%;
      border-left: solid 1px #e0e0e0;
    }
  }
</style>
