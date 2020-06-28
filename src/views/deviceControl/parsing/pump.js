import store from '@/store'

// 解析水泵
export function pump(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setPump', { dname, latitude, longitude, dclass, serialno,
    icon: require('@/icons/device/close/sb.png')
  })
}
