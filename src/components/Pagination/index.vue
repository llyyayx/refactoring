<template>
  <!-- 分页 -->
  <div style="margin-top: 30px;">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="pageSize"
      :page-size="size"
      :current-page="page"
      :total="allData.length"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    // 所有数据
    allData: {
      type: Array,
      required: true
    },
    // 每页条数可选项
    pageSize: {
      type: Array,
      required: false,
      default: () => {
        return [20, 50, 100, 200]
      }
    },
    // 当前每页条数
    pSize: {
      type: Number,
      required: false,
      default: () => {
        return 20
      }
    }
  },
  data() {
    return {
      // 当前页面
      page: 1,
      size: this.pSize
    }
  },
  watch: {
    allData: function() {
      this.screen()
    }
  },
  methods: {
    // 选取对应页码数据
    screen() {
      const start = (parseInt(this.page) - 1) * parseInt(this.size)
      const end = parseInt(start) + parseInt(this.size)
      const currentData = this.allData.slice(start, end)
      this.$emit('currentChange', currentData)
    },
    // 每页条数改变时会触发
    sizeChange(pageSize) {
      this.size = pageSize
      this.screen()
    },
    // 每页页码改变时会触发
    currentChange(page) {
      this.page = page
      this.screen()
    }
  }
}
</script>
