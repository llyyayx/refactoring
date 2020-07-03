import { clone } from './index'
/**
 * 根据设备配置对象列表，返回与设备版本对应的属性集合
 * @param { Object } deviceAttr 设备属性配置对象
 *  deviceAttr.attr 设备属性集合
 *  deviceAttr.attrNameKey 属性对应的nameKey，根据版本定位（*代表全部版本可用）
 *  deviceAttr.rules  属性对应的规则，根据版本定位
 * @param { String } 设备版本
 * @return { Array } 属性列表
 */
export function getAttr(deviceAttr, version) {
  const { attr, attrNameKey, rules } = clone(deviceAttr)
  const attribute = []
  const history = []
  attr.forEach((el, index) => {
    if (el.version[0] === '*' || el.version.includes(version)) {
      el.nameKey = getAttrNameKey(attrNameKey, el.mark, version)
      el.rules = getAttrRules(rules, el.mark, version)
    }
    const idx = history.indexOf(el.mark)
    if (idx >= 0) {
      attribute[idx] = el
    } else {
      attribute.push(el)
      history.push(el.mark)
    }
  })
  return attribute
}

/**
 * 根据设备指令列表，返回与设备版本对应的指令集合
 * @param { Object } deviceCommand 设备属性指令
 *  deviceCommand.command 设备指令集合
 *  deviceCommand.commandNameKey 指令对应的nameKey，根据版本定位（*代表全部版本可用）
 *  deviceAttr.params  指令值param处理函数，根据版本定位
 * @param { String } 设备版本
 * @return { Array } 属性列表
 */
export function getCommand(deviceCommand, version) {
  const { command, commandNameKey, params } = clone(deviceCommand)
  const sprayCommand = {}
  command.forEach((el, index) => {
    if (el.version[0] === '*' || el.version.includes(version)) {
      el.nameKey = getCommandNameKey(commandNameKey, el.mark, version)
      el.params = getCommandParams(params, el.mark, version)
      sprayCommand[el.mark] = el
    }
  })
  return sprayCommand
}

/**
 * 根据设备可控列表，返回与设备版本对应的控制项集合
 * @param { Array } controlItem 设备可控项列表
 * @param { String } version 设备版本
 * @return { Array } 属性列表
 */
export function getControlItem(controlItem, version) {
  if (Object.prototype.toString.call(controlItem) !== '[object Array]') return []
  const ctrItem = []
  const history = []
  controlItem.forEach((el, index) => {
    if (el.version[0] === '*' || el.version.includes(version)) {
      const idx = history.indexOf(el.mark)
      if (idx >= 0) {
        ctrItem[idx] = el.mark
      } else {
        ctrItem.push(el.mark)
        history.push(el.mark)
      }
    }
  })
  return ctrItem
}

/**
 * 方法：根据版本得到属性的nameKey
 * @param { Array } attrNameKey 设备属性的nameKey列表
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { String } 与设备版本对应的nameKey
 */
function getAttrNameKey(attrNameKey, mark, version) {
  if (Object.prototype.toString.call(attrNameKey) !== '[object Array]') return ''
  let key
  attrNameKey.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        key = el.key
      }
    }
  })
  return key
}

/**
 * 方法：根据版本得到对应的规则（注意规则生效时，nameKey的值将被该方法返回值覆盖）
 * @param { Array } rules 设备属性的规则列表
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { Function } 与设备版本对应的规则
 */
function getAttrRules(rules, mark, version) {
  if (Object.prototype.toString.call(rules) !== '[object Array]') return false
  let fun = false
  rules.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        fun = el.fun
      }
    }
  })
  return fun
}

/**
 * 方法：根据版本得到指令的nameKey
 * @param { Array } commandNameKey 设备指令的nameKey列表
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { String } 与设备版本对应的nameKey
 */
function getCommandNameKey(commandNameKey, mark, version) {
  if (Object.prototype.toString.call(commandNameKey) !== '[object Array]') return ''
  let key
  commandNameKey.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        key = el.key
      }
    }
  })
  return key
}

/**
 * 方法：根据版本得到param处理函数
 * @param { Array } params 设备指令的值处理函数列表
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { String } 与设备版本对应的值处理函数
 */
function getCommandParams(params, mark, version) {
  if (Object.prototype.toString.call(params) !== '[object Array]') return () => { return true }
  let fun = () => { return true }
  params.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        fun = el.fun
      }
    }
  })
  return fun
}
