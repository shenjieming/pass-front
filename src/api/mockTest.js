import request from '@/utils/request'
/* mock.js 模拟数据*/
export function getMockData(data) {
  return request({
    url: '/data',
    method: 'get',
    params: data
  })
}
