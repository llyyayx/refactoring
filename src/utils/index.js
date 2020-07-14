/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 *
 * @param { Function } func 需要防抖的函数
 * @param { Number } wait 延迟时间
 * @param { Boolean } immediate 是否立即执行
 */
export function debounce(func, wait, immediate) {
  let timeout
  return function(...args) {
    const context = this
    if (timeout) clearTimeout(timeout)

    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 深度拷贝对象
 * @param { Object } obj 需要深度拷贝的对象
 * @return { Object } 拷贝完成的对象
 */
export function clone(obj) {
  var o
  if (typeof obj === 'object') {
    if (obj === null) {
      o = null
    } else {
      if (obj instanceof Array) {
        o = []
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[ i ]))
        }
      } else {
        o = {}
        for (var j in obj) {
          o[ j ] = clone(obj[ j ])
        }
      }
    }
  } else {
    o = obj
  }
  return o
}

/**
 * 生成指定范围的随机数
 * @param { Number } m 随机数指定开始位置
 * @param { Number } n 随机数指定结束位置
 */
export function random(m, n) {
  return Math.floor(Math.random() * (n - m)) + m
}

/**
 * 数组按照属性从小到大排序
 * @param { Array } array 数组
 * @param { String } attr 属性名称
 */
export function sortAttr(array, attr) {
  array.sort(function(a, b) {
    const v1 = parseInt(a[attr])
    const v2 = parseInt(b[attr])
    return v1 - v2
  })
}
