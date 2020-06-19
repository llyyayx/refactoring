<template>
  <remote-js :src="jsUrl" @load-js-finish="jsLoadCallBack" />
</template>

<script>
export default {
  components: {
    'remote-js': {
      render(createElement) {
        var self = this
        // 防止重复加载资源
        if (Object.prototype.toString.call(window.google) === '[object Object]') {
          return
        } else {
          return createElement('script', {
            attrs: { type: 'text/javascript', src: this.src + '?v=' + new Date().getTime() },
            on: {
              load: function() {
                self.$emit('load-js-finish')
              }
            }
          })
        }
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },
  props: {
    jsUrl: { type: String, required: true }, // 需要加载的外部url
    jsLoadCallBack: { type: Function, required: true }// 外部js加载完成回调
  },
  mounted() {
    // 已加载资源直接实例化
    if (Object.prototype.toString.call(window.google) === '[object Object]') {
      this.jsLoadCallBack()
    }
  }
}
</script>
