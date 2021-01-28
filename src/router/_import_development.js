// module.exports = file => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+

function plus(file) {
  const Foo = resolve => require(['@/views/' + file + '.vue'], resolve)
  return Foo
}
module.exports = plus
