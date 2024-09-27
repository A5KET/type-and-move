import { px, appendChildren, swapElements, setElementPosition, setElementSize, removeElements } from './utils.js'


const SYMBOL_CLASS = 'symbol'
const SYMBOL_SELECTOR = '.' + SYMBOL_CLASS
const SELECTED_SYMBOL_SELECTOR = '.symbol.selected'
const SELECTED_CLASS = 'selected'
const DRAGGED_CLASS = 'dragged'
const HIGHLIGHTED_CLASS = 'highlighted'
const DRAG_THRESHOLD = 5
const HOLD_TIME = 500


function createSymbolContainer(symbols) {
  const container = document.createElement('div')
  container.classList.add('container')
  
  appendChildren(container, symbols)

  return container
}


function createDraggedSymbolContainer(symbols) {
  const draggedSymbols = createDraggedSymbols(symbols)
  const container = createSymbolContainer(draggedSymbols)
  container.classList.add('dragged')

  return container
}


function isRectsIntersecting(first, second) {
  const firstRectangle = first.getBoundingClientRect()
  const secondRectangle = second.getBoundingClientRect()

  return (
    secondRectangle.bottom >= firstRectangle.top && 
    secondRectangle.right >= firstRectangle.left && 
    secondRectangle.top <= firstRectangle.bottom &&
    secondRectangle.left <= firstRectangle.right
  )
}

function isSymbol(element) {
  return element?.classList?.contains(SYMBOL_CLASS)
}


function isSelectedSymbol(element) {
  return isSymbol(element) && element.classList.contains(SELECTED_CLASS)
}


function createSymbol(string) {
  const node = document.createElement('span')
  node.className = SYMBOL_CLASS
  node.textContent = string

  return node
}


function createDraggedSymbols(symbols) {
  const draggedSymbols = []

  for (const selectedSymbol of symbols) {
    const draggedSymbol = selectedSymbol.cloneNode(true)

    draggedSymbol.classList.add(DRAGGED_CLASS)
    draggedSymbols.push(draggedSymbol)
  }

  return draggedSymbols
}


function createSelectionBox(startX, startY) {
  const selectionBox = document.createElement('div')
  selectionBox.classList.add('selection-box')
  setElementPosition(selectionBox, startX, startY)

  return selectionBox
}


function removeSelectionBox() {
  document.querySelectorAll('.selection-box').forEach(element => element.remove())
}


function deselectSymbols() {
  selectSelectedSymbols().forEach(symbol => symbol.classList.remove(SELECTED_CLASS))
}


function selectHighlightedSymbols() {
  document.querySelectorAll(SYMBOL_SELECTOR).forEach(symbol => symbol.classList.replace(HIGHLIGHTED_CLASS, SELECTED_CLASS))
}


function createSymbolsFromString(text) {
  return text.split('').map(symbol => createSymbol(symbol))
}


function selectSelectedSymbols() {
  return document.querySelectorAll(SELECTED_SYMBOL_SELECTOR)
}

document.addEventListener('mousedown', (downEvent) => {
  if (downEvent.button == 2) {
    return
  }

  const startX = downEvent.clientX
  const startY = downEvent.clientY
  let isDragging = false
  let draggedContainer
  let draggedSymbols
  let isSelecting = false
  let selectionBox = null
  let holdTimeout

  if (isSelectedSymbol(downEvent.target)) {
    holdTimeout = setTimeout(() => {
      isDragging = true
      draggedSymbols = selectSelectedSymbols()
      draggedContainer = createDraggedSymbolContainer(draggedSymbols)
      
      setElementPosition(draggedContainer, startX, startY)

      document.body.appendChild(draggedContainer)
    }, HOLD_TIME)
  }

  const onMouseMove = (moveEvent) => {
    const newX = moveEvent.clientX
    const newY = moveEvent.clientY
    const isMoved = Math.abs(newX - startX) > DRAG_THRESHOLD || Math.abs(newY - startY) > DRAG_THRESHOLD

    if (isDragging) {
      setElementPosition(draggedContainer, newX, newY)

      return 
    }

    if (!isSelecting && isMoved) {
      isSelecting = true
      selectionBox = createSelectionBox(startX, startY)
      document.body.appendChild(selectionBox)
    }

    if (isSelecting && selectionBox) {
      setElementSize(selectionBox, Math.abs(startX - newX), Math.abs(startY - newY))
      setElementPosition(selectionBox, Math.min(newX, startX), Math.min(newY, startY))

      const symbols = document.querySelectorAll(SYMBOL_SELECTOR)
    
      for (const symbol of symbols) {
        if (isRectsIntersecting(selectionBox, symbol)) {
          symbol.classList.add(HIGHLIGHTED_CLASS)
        } else {
          symbol.classList.remove(HIGHLIGHTED_CLASS)
        }
      }
    }
  }

  const onMouseUp = (upEvent) => {
    clearTimeout(holdTimeout)

    if (!upEvent.ctrlKey && !upEvent.metaKey) {
      deselectSymbols()
    }

    if (isDragging) {
      if (draggedSymbols.length == 1 && isSymbol(upEvent.target)) {
        const targetSymbol = upEvent.target
        const draggedSymbol = draggedSymbols[0]
        swapElements(targetSymbol, draggedSymbol)
        draggedContainer.remove()
      } else {
        removeElements(draggedSymbols)
      }
      
      for (const child of draggedContainer.children) {
        child.classList.remove('dragged')
      }
    } else {
      if (isSelecting && selectionBox) {
        removeSelectionBox()
        selectHighlightedSymbols()
        selectionBox = null
      }
  
      if (!isSelecting && isSymbol(upEvent.target)) {
        upEvent.target.classList.toggle(SELECTED_CLASS)
      }
    }
    
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})


const input = document.querySelector('input')
const button = document.querySelector('button')


button.addEventListener('click', event => {
  const text = input.value

  if (text.length < 1) {
    return
  }

  const symbols = createSymbolsFromString(text)
  const container = createSymbolContainer(symbols)

  document.body.appendChild(container)

  input.value = ''
})