const Mock = require('mockjs')
// 使用mockjs模拟数据
Mock.mock('/9000:/api/data', (req, res) => {
  const data = []
  for (let i = 0; i < 1000; i++) {
    data.push({ name: '笑笑' + i, id: '工号' + i, department: '测试' + i, remark: '测试备注' + i, inputValue: i })
  }
  return {
    data
  }
})
