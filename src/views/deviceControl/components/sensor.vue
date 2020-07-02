<template>
  <panel :sub-class="'sensor-container'" :child-class="'sensor-box'" :show="show" @close="closeSensor" @full="full">
    <div slot="main">1212</div>
  </panel>
</template>

<script>
import panel from '@/components/Panel'
export default {
  components: {
    panel
  },
  computed: {
    // 滴灌面板的显示隐藏
    show() {
      return this.$store.state.control.sensorShow
    }
  },
  methods: {

    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      return
    },

    // 关闭面板的回调事件
    closeSensor() {
      this.$store.dispatch('control/sensorShow', false)
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
