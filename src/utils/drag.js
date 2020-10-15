/**
 * 框选阀门
 * @param { String } sub 父类class(允许多个class)
 * @param { String } child 选择的子类class
 * @param { Function } callback 回调函数,返回的参数：1、选择的index列表，2、父类index (index=序号)
 */
export function drag(sub, child, callback) {
  const subDomList = document.getElementsByClassName(sub)
  // 点击启点y
  let startTop = 0
  // 点击启点x
  let startLeft = 0
  // 结束点y
  let endTop = 0
  // 结束点x
  let endLeft = 0

  // 是否在右击
  let contextmenu = false
  // ctrl键是否按住
  let ctrl = false

  // 右击事件
  for (let dom = 0; dom < subDomList.length; dom++) {
    const subDom = subDomList[dom]
    subDom.oncontextmenu = (e) => { e.preventDefault() }
    subDom.addEventListener('mousedown', (e) => {
      if (e.button !== 2) return
      contextmenu = true
      const childDom = subDom.getElementsByClassName(child)
      for (let i = 0; i < childDom.length; i++) {
        if (!ctrl) {
          childDom[i].classList.remove('selected')
        }
        childDom[i].classList.remove('t01')
      }
      startTop = e.pageY
      startLeft = e.pageX
      const div = document.createElement('div')
      div.setAttribute('id', 'select-box')
      document.body.appendChild(div)
      const selectBox = document.getElementById('select-box')
      selectBox.style.position = 'fixed'
      selectBox.style.top = startTop + 'px'
      selectBox.style.left = startLeft + 'px'
      selectBox.style.background = 'rgba(255,106,23,0.3)'
      selectBox.style.transition = 'all 0s'
      selectBox.style.width = 0
      selectBox.style.height = 0
      selectBox.style.zIndex = 10

      // 滑动事件
      const mousemove = (e) => {
        if (!contextmenu) return
        const selectBox = document.getElementById('select-box')
        endTop = e.pageY
        endLeft = e.pageX
        // 选框位置
        if (e.pageY - startTop > 0 && e.pageX - startLeft > 0) {
          const height = e.pageY - startTop
          const width = e.pageX - startLeft
          selectBox.style.width = width + 'px'
          selectBox.style.height = height + 'px'
        } else if (e.pageY - startTop < 0 && e.pageX - startLeft < 0) {
          const height = -(e.pageY - startTop)
          const width = -(e.pageX - startLeft)
          selectBox.style.width = width + 'px'
          selectBox.style.height = height + 'px'
          selectBox.style.top = e.pageY + 'px'
          selectBox.style.left = e.pageX + 'px'
        } else if (e.pageY - startTop > 0 && e.pageX - startLeft < 0) {
          const height = (e.pageY - startTop)
          const width = -(e.pageX - startLeft)
          selectBox.style.width = width + 'px'
          selectBox.style.height = height + 'px'
          selectBox.style.top = startTop + 'px'
          selectBox.style.left = e.pageX + 'px'
        } else if (e.pageY - startTop < 0 && e.pageX - startLeft > 0) {
          const height = -(e.pageY - startTop)
          const width = (e.pageX - startLeft)
          selectBox.style.width = width + 'px'
          selectBox.style.height = height + 'px'
          selectBox.style.top = e.pageY + 'px'
          selectBox.style.left = startLeft + 'px'
        }
        // 子元素范围
        var childDom = subDom.getElementsByClassName(child)
        for (let j = 0; j < childDom.length; j++) {
          const offset = getOffset(childDom[j])
          const left = offset[0]
          const top = offset[1]
          const childWidth = childDom[j].clientWidth
          const childHeight = childDom[j].clientHeight
          if ((startLeft < left + childWidth && left < endLeft && top < endTop && top + childHeight > startTop && (e.pageY - startTop > 0 && e.pageX - startLeft > 0)) ||
          (endLeft < left + childWidth && left < startLeft && top < startTop && top + childHeight > endTop && (e.pageY - startTop < 0 && e.pageX - startLeft < 0)) ||
          (endLeft < left + childWidth && left < startLeft && top < endTop && top + childHeight > startTop && (e.pageY - startTop > 0 && e.pageX - startLeft < 0)) ||
          (startLeft < left + childWidth && left < endLeft && top < startTop && top + childHeight > endTop && (e.pageY - startTop < 0 && e.pageX - startLeft > 0))) {
            childDom[j].classList.add('selected', 't01')
          } else {
            if (childDom[j].classList.contains('t01')) {
              childDom[j].classList.remove('selected')
            }
          }
        }
      }
      document.addEventListener('mousemove', mousemove)

      // 鼠标抬起事件
      const mouseup = (e) => {
        contextmenu = false
        // 清空框选框
        const selectBox = document.getElementById('select-box')
        if (selectBox) selectBox.remove()
        // 清除事件
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
        // 获取框选的index
        const childDom = subDom.getElementsByClassName(child)
        const list = []
        for (let t = 0; t < childDom.length; t++) {
          if (childDom[t].classList.contains('selected')) {
            list.push(t)
          }
        }
        callback(list, dom)
      }
      document.addEventListener('mouseup', mouseup)
    })
  }

  // 键盘按下事件
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      ctrl = true
    } else {
      ctrl = false
    }
  })

  // 键盘抬起事件
  document.addEventListener('keyup', (e) => {
    ctrl = false
  })
}

// 获取任意元素的offsetLeft/offsetTop值
function getOffset(obj) {
  const arr = []
  let offsetL = 0
  let offsetT = 0
  while (obj !== window.document.body && obj !== null) {
    offsetL += obj.scrollLeft > 0 ? obj.offsetLeft - obj.scrollLeft : obj.offsetLeft
    offsetT += obj.scrollTop > 0 ? obj.offsetTop - obj.scrollTop : obj.offsetTop
    obj = obj.offsetParent
  }
  arr.push(offsetL, offsetT)
  return arr
}
