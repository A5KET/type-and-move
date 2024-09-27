const SYMBOL_CLASS = 'symbol'
const SYMBOL_SELECTOR = '.' + SYMBOL_CLASS
const SELECTED_CLASS = 'selected'
const HIGHLIGHTED_CLASS = 'highlighted'


function createTemplateIsntance(query) {
  return document.querySelector(query).content.cloneNode(true)
}

function isSymbol(element) {
  return element?.classList?.contains(SYMBOL_CLASS)
}


function createSymbol(symbol) {
  const node = document.createElement('span')
  node.className = 'symbol'
  node.textContent = symbol

  node.addEventListener('select', event => {
    event.target.classList.add(SELECTED_CLASS)
  })

  return node
}

function createSelectionBox(startX, startY) {
  const selectionBox = document.createElement('div')
  selectionBox.classList.add('selection-box')
  selectionBox.style.left = px(startX)
  selectionBox.style.top = px(startY)

  return selectionBox
}

function removeSelectionBox() {
  document.querySelectorAll('.selection-box').forEach(element => element.remove())
}

function deselectSymbols() {
  document.querySelectorAll('.symbol.selected').forEach(symbol => symbol.classList.remove('selected'))
}

function selectHighlightedSymbols() {
  document.querySelectorAll(SYMBOL_SELECTOR).forEach(symbol => symbol.classList.replace(HIGHLIGHTED_CLASS, SELECTED_CLASS))
}


function createSymbolsFromString(text) {
  return text.split('').map(symbol => createSymbol(symbol))
}


function createOutput(symbols) {
  const node = createTemplateIsntance('.output-template')
  const symbolsArea = node.querySelector('.symbols')

  symbols.forEach((symbol) => symbolsArea.appendChild(symbol))

  return node

}


function px(value) {
  return `${value}px`
}


const root = document.querySelector('#root')
const outputs = document.querySelector('.outputs')
const text = 'some random text some random text some random text some random text some random text some random text'
const symbols = createSymbolsFromString(text)
const output = createOutput(symbols)

outputs.appendChild(output)




document.addEventListener('mousedown', (downEvent) => {
  const dragThreshold = 5
  const startX = downEvent.clientX
  const startY = downEvent.clientY
  let isDragging = false
  let selectionBox = null

  if (!downEvent.ctrlKey && !downEvent.metaKey) {
    deselectSymbols()
  }

  const onMouseMove = (moveEvent) => {
    const moveX = Math.abs(moveEvent.clientX - startX)
    const moveY = Math.abs(moveEvent.clientY - startY)

    if (!isDragging && (moveX > dragThreshold || moveY > dragThreshold)) {
      isDragging = true
      selectionBox = createSelectionBox(startX, startY)
      document.body.appendChild(selectionBox)
    }

    if (isDragging && selectionBox) {
      const currentX = moveEvent.clientX
      const currentY = moveEvent.clientY
      const width = Math.abs(startX - currentX)
      const height = Math.abs(startY - currentY)

      selectionBox.style.width = px(width)
      selectionBox.style.height = px(height)
      selectionBox.style.left = px(Math.min(currentX, startX))
      selectionBox.style.top = px(Math.min(currentY, startY))

      const boxRectangle = selectionBox.getBoundingClientRect()
      const elements = document.querySelectorAll(SYMBOL_SELECTOR)
    
      for (const element of elements) {
        const elementRectangle = element.getBoundingClientRect()
    
        const isIntersecting = (
          elementRectangle.bottom >= boxRectangle.top && 
          elementRectangle.top <= boxRectangle.bottom &&
          elementRectangle.right >= boxRectangle.left && 
          elementRectangle.left <= boxRectangle.right
        )
    
        if (isIntersecting) {
          element.classList.add(HIGHLIGHTED_CLASS)
        } else {
          element.classList.remove(HIGHLIGHTED_CLASS)
        }
      }
    }
  }

  const onMouseUp = (upEvent) => {
    if (isDragging && selectionBox) {
      removeSelectionBox()
      selectHighlightedSymbols()
      selectionBox = null
    }

    if (!isDragging && isSymbol(upEvent.target)) {
      upEvent.target.classList.add(SELECTED_CLASS)
    }
    
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})