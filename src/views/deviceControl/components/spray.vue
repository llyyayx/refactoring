<template>
  <div class="spray-container">
    <el-row v-for="(item,index) in spray" :key="index" type="flex" :gutter="20" class="spray__row">
      <el-col :span="4">
        <div class="spray__imgBox">
          <img src="@/icons/device/run/pg.png" alt="喷灌机图标">
        </div>
        <div class="spray__name">{{ item.dname }}</div>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col v-for="(attr,index2) in item.attr" :key="index2" :span="4" class="spray__col__mb">
            <div class="spray__value">{{ attr.val + attr.unit }}</div>
            <div class="spray__attr">{{ attr.name }}</div>
          </el-col>
        </el-row>
        <el-divider class="spray__divider" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
  data() {
    return {
      map: {}
    }
  },
  computed: {
    spray() {
      return this.$store.state.device.spray
    }
  },
  mounted() {
    console.log(this.spray)
    new Draggabilly('.spray-container', {
      containment: true
    })
  }
}
</script>

<style lang="scss" scoped>

.spray-container {
    background-color: rgba($color: #FFFFFF, $alpha: 0.9);
    width: 600px;
    height: 200px;
    border-radius: 12px;
    position: absolute;
    top: 60px;
    left: 10px;
    padding: 10px;
    box-sizing: border-box;
    & .spray__name { 
        padding-top: 4px;
        font-size: 12px;
        text-align: center;
     }
    & .spray__row {
        margin: 10px 0;
        & .spray__col__mb{
            margin-bottom: 12px;
        }
        & .spray__value {
            font-size: 16px;
            color: #333333;
            margin-bottom: 2px;
            font-weight: 600;
        }
        & .spray__attr {
            font-size: 14px;
            color: #666666;
        }
        & .spray__divider {
            margin: 10px 0;
        }
    }
    & .spray__imgBox {
      margin: 0 auto;
      width: 36px;
      & img {
        display: block;
        width: 100%;
      }
    }
}

</style>
