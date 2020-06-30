<template>
  <panel :sub-class="'kill'" :child-class="'kill-box'" :show="true">
    <div slot="main" @click="close">121212</div>
  </panel>
</template>

<script>
import panel from '@/components/Panel'
export default {
  components: {
    panel
  },
  methods: {
    close() {
      alert(1212)
    }
  }
}
</script>

<style lang="scss" scoped>
.sensor-box {
    background-color: rgba($color: #FFFFFF, $alpha: 0.9);
    width: 600px;
    max-height: 85%;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 12px;
    position: absolute;
    top: 60px;
    right: 10px;
    padding: 10px;
    box-sizing: border-box;
    & .sensor__top {
      width: 100%;
      top: 0;
      & .sensor__icon {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
        color: #666;
        cursor: pointer;
        & .sensor__icon--close{
            font-size:23px;
            margin-left: 10px;
        }
      }
    }
}
</style>
