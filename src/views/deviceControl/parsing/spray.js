import store from '@/store'
import { sprayValve } from './sprayValve'

// 解析喷灌
export function spray(item) {
  const { dname, latitude, longitude, dclass, serialno, extension, portarrays } = item
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension })
  if (portarrays) sprayValve(portarrays)
}
