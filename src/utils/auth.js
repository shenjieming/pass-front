const vueCookie = require('vue-cookie')

export function getToken(TokenKey) {
  return vueCookie.get(TokenKey)
}
export function getUserInfo(getUserInfo) {
  return vueCookie.get(getUserInfo)
}
export function removeToken(TokenKey) {
  return vueCookie.delete(TokenKey)
}
