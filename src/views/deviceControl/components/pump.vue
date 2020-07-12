<template>
  <Panel :sub-class="'pump-container'" :child-class="'pump-box'" :show="show" @close="closeDrops" @full="full">
    <div slot="mian">
      121212
    </div>
  </Panel>
</template>

<script>
import Panel from '@/components/Panel'
export default {
  components: {
    Panel
  },
  computed: {
    show() {
      return this.$store.state.control.pumpShow
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
    closeDrops() {
      this.$store.dispatch('control/pumpShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
