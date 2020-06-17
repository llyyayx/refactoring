/**
 * 为vue实例化外的组件提供国际化转化
 * @param {String} font 语言包对应对象名称
 * @return {String} 翻译后的文字
 */
import i18n from '@/lang'
export default function translation(font) {
  return i18n.t(font)
}
