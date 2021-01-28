<template>
    <input type="text" ref="input" :value="value" :maxlength="isMaxLength" :placeholder="isPlaceholder" @blur="$emit('blur', $event)" @keydown="onKeydown($event)" @input="onInput($event)" :class="[{'el-input__inner': isDefaultCss}, isCss]" style="ime-mode:disabled" onpaste="return false" ondrop="return false" ondragenter="return false" ondragstart="return false">
</template>

<script>
export default {
  name: 'cleave',
  props: {
    value: '',
    isPlaceholder: {
      type: String,
      default: ''
    },
    // 设置class
    isCss: {
      type: String,
      default: ''
    },
    // 启用默认class
    isDefaultCss: {
      type: Boolean,
      default: true
    },
    // 小数位，默认二位
    isDecimal: {
      type: Number,
      default: 2
    },
    isMaxLength: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      initValue: this.value
    }
  },
  methods: {
    onKeydown(e) {
      const isFullStop = (key) => {
        return (key === 190 || key === 110) && this.isDecimal !== 0
      }
      const isNumber = (key) => {
        return (key >= 48 && key <= 57) || (key >= 96 && key <= 105)
      }
      const key = window.event ? e.keyCode : e.which
      const obj = e.target || e.srcElement
      const value = obj.value.toString()
      // 过滤非数字字符
      if (!isNumber(key) && !e.shiftKey && !isFullStop(key) && key !== 8 && key !== 46 && key !== 37 && key !== 39) e.preventDefault()
      // 防止第一位输入小数点
      if (!value) {
        if (isFullStop(key)) e.preventDefault()
      }
      // 防止输入多个0
      if (value.length !== 0 && Number(value) === 0 && value.indexOf('.') === -1 && (key === 48 || key === 96)) e.preventDefault()
    },
    onInput(e) {
      const obj = e.target || e.srcElement
      const value = obj.value.toString()
      // obj.value = value.replace(/[^\d.]/g, '').replace(/\./g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3')
      obj.value = value.replace(/[^\d.]/g, '').replace(/\./g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(new RegExp('^(\\-)*(\\d+)\\.(\\d{' + this.isDecimal + '}).*$', ''), '$1$2.$3')
      this.$emit('input', obj.value)
    }
  }
}
</script>