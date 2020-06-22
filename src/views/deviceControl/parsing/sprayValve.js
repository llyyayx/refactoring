import store from '@/store'

// 解析喷灌机喷头
export function sprayValve(portarrays, parent) {
  const spray = []
  portarrays.forEach((item, index) => {
    const { spraySerialno, rtuSerialno, port, ctlGroup, descri, idx } = item
    spray.push({ spraySerialno, rtuSerialno, port, ctlGroup, descri, idx,
      icon: require('@/icons/device/close/fm.png'),
      status: 'close',
      pname: parent.dname
    })
  })
  store.dispatch('device/setSprayValve', spray)
}

