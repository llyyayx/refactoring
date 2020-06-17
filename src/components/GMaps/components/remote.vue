<template>
  <remote-js :src="jsUrl" @load-js-finish="jsLoadCallBack" />
</template>

<script>
export default {
  components: {
    'remote-js': {
      render(createElement) {
        var self = this
        return createElement('script', {
          attrs: { type: 'text/javascript', src: this.src },
          on: {
            load: function() {
              self.$emit('load-js-finish')
            }
          }
        })
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },
  props: {
    jsUrl: { type: String, required: true }, // 需要加载的外部url
    jsLoadCallBack: { type: Function, required: true }// 外部js加载完成回调
  }
}
</script>
