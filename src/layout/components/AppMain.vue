<template>
  <section class="app-main" :style="{'padding-top': paddingTop+'px'}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      pdtop: 50,
      paddingTop: 50
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    ...mapState({
      tagsView: state => state.settings.tagsView
    })
  },
  watch: {
    tagsView: {
      handler(e) {
        if (e) {
          this.paddingTop = this.pdtop + 30
        } else {
          this.paddingTop = this.pdtop
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
.fixed-header+.app-main {
  box-sizing: border-box;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
