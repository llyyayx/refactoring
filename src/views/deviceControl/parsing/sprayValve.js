import store from '@/store'

// 解析喷灌机喷头
export function sprayValve(portarrays) {
  portarrays.forEach((item, index) => {
    const { spraySerialno, rtuSerialno, port, ctlGroup, descri, idx } = item
    store.dispatch('device/setSprayValve', { spraySerialno, rtuSerialno, port, ctlGroup, descri, idx })
  })
}
