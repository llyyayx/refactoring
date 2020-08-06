<template>
  <div />
</template>
<script>
export default {
  mounted() {
    this.$confirm('您确定退出么?', '提示', {
      type: 'warning',
      showClose: false
    }).then(() => {
      this.logout()
    }).catch(() => {
      return
    })
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>
