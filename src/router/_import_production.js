// module.exports = file => () => import('@/views/' + file + '.vue')

function plus(file) {
  const Foo = () => import('@/views/' + file + '.vue')
  return Foo
}
module.exports = plus
