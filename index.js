function createTemplateIsntance(query) {
  return document.querySelector(query).content.cloneNode(true)
}


function createSymbol(symbol) {
  const node = document.createElement('span')
  node.className = 'symbol'
  node.textContent = symbol

  node.addEventListener('select', event => {
    event.target.classList.add('selected')
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
  document.querySelectorAll('.symbol').forEach(symbol => symbol.classList.replace('highlighted', 'selected'))
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


let isSelecting = false
let selectionBox = null
let startX
let startY 

document.addEventListener('mousedown', (event) => {
  if (!event.ctrlKey && !event.metaKey) {
    deselectSymbols()
  }

  isSelection = true

  startX = event.clientX
  startY = event.clientY

  selectionBox = createSelectionBox(startX, startY)
  document.body.appendChild(selectionBox)
})

document.addEventListener('mousemove', (event) => {
  const currentX = event.clientX
  const currentY = event.clientY

  const width = Math.abs(startX - currentX)
  const height = Math.abs(startY - currentY)

  if (selectionBox) {
    selectionBox.style.width = px(width)
    selectionBox.style.height = px(height)

    selectionBox.style.left = px(Math.min(currentX, startX))
    selectionBox.style.top = px(Math.min(currentY, startY))

    const boxRectangle = selectionBox.getBoundingClientRect()
    const elements = document.querySelectorAll('.symbol')
  
    for (const element of elements) {
      const elementRectangle = element.getBoundingClientRect()
  
      const isIntersecting = (
        elementRectangle.bottom >= boxRectangle.top && 
        elementRectangle.top <= boxRectangle.bottom &&
        elementRectangle.right >= boxRectangle.left && 
        elementRectangle.left <= boxRectangle.right
      )
  
      if (isIntersecting) {
        element.classList.add('highlighted')
      } else {
        element.classList.remove('highlighted')
      }
    }
  }
})

document.addEventListener('mouseup', (event) => {
  isSelecting = false
  if (selectionBox) {
    selectHighlightedSymbols()
    removeSelectionBox()
    selectionBox = null
  }
})