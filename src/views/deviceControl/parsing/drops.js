import store from '@/store'
import { dropValve } from './dropValve'

// 解析滴灌
export function drops(item, self) {
  const { dname, latitude, longitude, dclass, serialno, cells } = item
  store.dispatch('device/setDrops', { dname, latitude, longitude, dclass, serialno })
  if (cells) dropValve(cells, dname)
}
