<template>
  <transition name="el-fade-in">
    <div v-show="show" class="partition-container">
      <div class="partition-box">
        <div class="partition__header">
          <div class="partition__header--text">选择要分区的喷灌机</div>
          <svg-icon icon-class="close" class="icon--close" @click="close" />
        </div>
        <ul>
          <li v-for="(item, index) in spray" :key="index">{{ item.dname }}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {
    show() {
      return this.$store.state.control.partitionShow
    },
    spray() {
      return this.$store.state.device.spray
    }
  },
  methods: {
    close() {
      this.$store.dispatch('control/partitionShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.partition-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, .3);
    & .partition-box {
        width: 300px;
        background-color: #FFFFFF;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        overflow: hidden;
        & .partition__header{
            background-color: #DCDFE6;
            padding: 10px 20px;
            position: relative;
            & .partition__header--text{
                font-size: 16px;
                color: #333;
            }
            & .icon--close{
                color: #666;
                font-size:23px;
                margin-left: 10px;
                cursor: pointer;
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        & > ul {
            list-style: none;
            margin: 0;
            padding: 20px 20px;
            & > li {
                list-style:none;
                border: 0;
                border-bottom: 1px solid #e3e3e3;
            }
        }
    }
}
</style>
