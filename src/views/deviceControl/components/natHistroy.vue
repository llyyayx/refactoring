<template>
  <el-dialog :visible.sync="show" :before-close="close" title="计算历史" width="950px" class="natHistroy-container">
    <div class="natHistroy-box">
      <el-card v-for="(item, index) in result" :key="index" :body-style="{ padding: '0px' }">
        <img :src="item.url" class="image">
        <div style="padding: 14px;">
          <span>{{ item.name }}</span>
        </div>
      </el-card>
    </div>
  </el-dialog>
</template>
<script>
import { resultList, resultCtn } from '@/api/deviceControl'
export default {
  data() {
    return {
      result: []
    }
  },
  computed: {
    show() {
      return this.$store.state.control.natHistroyShow
    }
  },
  mounted() {
    this.eachImg()
  },
  methods: {
    // 关闭窗口
    close() {
      this.$store.dispatch('control/natHistroyShow', false)
    },

    str2ab(str) {
      var buf = new ArrayBuffer(str.length * 2) // 每个字符占用2个字节
      var bufView = new Uint16Array(buf)
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    },

    /**
     * 获取指定文件的base64编码
     * @param  { object } File Blob或File对象
     * @return { string }  返回base64编码
     */
    getBase64(File) {
      File = File.replace(/\s*/g, '')
      File = File.replace(/[\r\n]/g, '')
      const blob = new Blob([File], { type: 'image/png' })
      let binary = ''
      blob.arrayBuffer().then((buffer) => {
        var bytes = buffer
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        console.log(window.btoa(binary))
      })
      /* const a = new FileReader()
      a.onload = function(e) { console.log(e.target.result) }
      a.readAsDataURL(blob) */
    },

    // 读取计算的历史记录
    readList() {
      return new Promise((resolve, reject) => {
        resultList().then((e) => {
          if (e.code === 0) {
            resolve(e.data)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },

    // 读取每次结果的详情
    async eachImg() {
      const data = await this.readList()
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const result = await resultCtn(data[i])
          this.result.push({ name: data[i], url: 'data:image/png;base64,' + result })
        }
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.natHistroy-box{
    display: flex;
    flex-wrap: wrap;
}
</style>
