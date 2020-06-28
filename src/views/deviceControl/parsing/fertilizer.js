import store from '@/store'

// 解析施肥机
export function fertilizer(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setFertilizer', { dname, latitude, longitude, dclass, serialno,
    icon: require('@/icons/device/close/sf.png')
  })
}
