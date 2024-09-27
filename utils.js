export function px(value) {
  return `${value}px`
}


export function appendChildren(element, children) {
  children.forEach(child => element.appendChild(child))
}


export function swapElements(first, second) {
  const temp = document.createElement('span')

  first.parentNode.insertBefore(temp, first)
  second.parentNode.insertBefore(first, second)
  temp.parentNode.insertBefore(second, temp)

  temp.remove()
}


export function setElementPosition(element, x, y) {
  element.style.left = px(x)
  element.style.top = px(y)
}


export function setElementSize(element, width, height) {
  element.style.width = px(width)
  element.style.height = px(height)
}


export function cloneElements(elements) {
  const clones = []

  for (const element of elements.values()) {
    clones.push(element.cloneNode())
  }

  return clones
}


export function removeElements(elements) {
  elements.forEach(element => element.remove())
}