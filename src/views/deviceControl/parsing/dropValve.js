import store from '@/store'
import config from '@/utils/config'

// 解析分区 => 解析滴灌阀门
export function dropValve(cells) {
  cells.forEach((item, index) => {
    const { name, id, idx, color, kml } = item
    store.dispatch('device/setDropsCell', { name, id, idx, color, kml })

    const valve = item.devices

    valve.forEach((item2, index2) => {
      switch (item2.dclass) {
        case config.DROPS_VALVE_CLASS : {
          const { dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno } = item2
          store.dispatch('device/setDropsValve', {
            dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno,
            areaName: item.name, areaId: id
          })
        } break
      }
    })
  })
}
