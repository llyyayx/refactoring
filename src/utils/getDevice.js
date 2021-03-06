import { getDevice } from '@/api/deviceControl'
import { serialno } from '@/utils/index'
// 获取rtu设备
export async function getDevices() {
  const response = await getDevice(1)
  const { devices } = response[0]
  const equipment = []
  devices.forEach((item, index) => {
    item.rtu && equipment.push(item)
  })
  return serialno(equipment)
}
