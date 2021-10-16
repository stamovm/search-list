const textArea = document.getElementById('text-area')
const output = document.getElementById('output-lists')
const btnPaste = document.getElementById('btn-paste')
const btnClear = document.getElementById('btn-clear')
const btnUpdate = document.getElementById('btn-update')
const btnRecall = document.getElementById('btn-recall')
const sEngine = document.getElementById('s-engine')
const quickSearch = document.getElementById('quick-search')
const openWindows = document.getElementById('open-windows')

const listObj = { id: 1, name: '', strings: [] }
const myLists = []
const openWindowsArr = []
let openW

listObj.strings = loadArray('mydatastrings')
if (listObj.strings) renderList()

function saveArray(key, array) {
  localStorage.setItem(key, JSON.stringify(array))
}

function loadArray(key) {
  return JSON.parse(localStorage.getItem(key))
}

function isURL(url) {
  const regex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return regex.test(url)
}

function btnQuickSearch() {
  const str = quickSearch.value
  btnSClick(str)
}

function setSearchEngine() {
  switch (sEngine.value) {
    case 'Google':
      listObj.searchStr = 'https://www.google.com/search?q='
      break
    case 'YouTube':
      listObj.searchStr = 'https://www.youtube.com/results?search_query='
      break
    case 'Bing':
      listObj.searchStr = 'https://www.bing.com/search?q='
      break
    case 'DuckDuckGo':
      listObj.searchStr = 'https://www.duckduckgo.com/?q='
      break
  }
}

function btnSClick(str, index) {
  let url = ''
  if (isURL(str)) {
    if (!/^((http|https|ftp):\/\/)/i.test(str)) {
      url = 'http://' + str
    } else url = str
  } else {
    setSearchEngine()
    url = listObj.searchStr + str
  }
  openW = window.open(url)
  window.focus()
  if (openW) openWindowsArr.push(openW)
  // openW = null
}

function btnXClick(str, index) {
  listObj.strings.splice(index, 1)
  saveArray('mydatastrings', listObj.strings)
  renderList()
}
function btnSaveClick() {
  //todo focus and close functions for open windows
  // console.log(openW)
  // openW.focus()
  //todo edit for lists
  let listName = window.prompt(
    'Enter list name:',
    new Date().toJSON().slice(0, 10)
  )
  if (listName) {
    listObj.name = listName
    myLists.push(listObj)
  }
  renderListsNames()
  // renderOpenWindows()
}

function renderOpenWindows() {
  // openWindows.filter((window)=>window.closed)
  console.log(openWindowsArr)

  openWindowsArr.forEach((w) => {
    console.log(w.closed)
    // console.log(window.location.href)
    console.log(openW.location.href)
    // w.close()
  })
}
function renderListsNames() {
  console.log(myLists)
}
function renderList() {
  output.innerHTML = ''
  listObj.strings.forEach((str, index) => {
    const div = document.createElement('div')
    div.classList.add('div-items')

    //btn s (search)
    const btnS = document.createElement('button')
    btnS.innerHTML = '<i class="fa fa-search"></i>'
    btnS.setAttribute('title', 'Search for ' + str)
    if (isURL(str)) {
      btnS.innerHTML = '<i class="fa fa-external-link"></i>'
      btnS.setAttribute('title', 'Open  Link: ' + str)
    }
    btnS.classList.add('btn', 'btn-s')
    div.appendChild(btnS)
    btnS.addEventListener('click', () => btnSClick(str, index))

    //btn x (delete)
    const btnX = document.createElement('button')
    btnX.textContent = 'X'
    btnX.classList.add('btn', 'btn-x')
    btnX.setAttribute('title', 'Delete ' + str)
    div.appendChild(btnX)
    btnX.addEventListener('click', () => btnXClick(str, index))

    //span (item text)
    const span = document.createElement('span')
    span.textContent = str
    span.setAttribute('contenteditable', 'true')
    div.appendChild(span)
    output.appendChild(div)
  })
  //btn Save list
  const div = document.createElement('div')
  div.classList.add('buttons')
  const btnSave = document.createElement('button')
  btnSave.innerHTML = '<i class="fa fa-floppy-o"></i> Save list'
  btnSave.classList.add('btn')
  btnSave.setAttribute('title', 'Add to Lists and save')
  btnSave.addEventListener('click', () => btnSaveClick())
  div.appendChild(btnSave)
  output.appendChild(div)
}

async function paste() {
  const text = await navigator.clipboard.readText()
  textArea.value = text
}

//---- Event Listeners
btnUpdate.addEventListener('click', () => {
  if (textArea.value == '') return
  listObj.strings = textArea.value.split('\n')
  saveArray('mydatastrings', listObj.strings)
  renderList()
  textArea.value = ''
})

btnRecall.addEventListener('click', () => {
  textArea.value = listObj.strings.join('\n')
  listObj.strings = []
  saveArray('mydatastrings', listObj.strings)
  renderList()
})

btnPaste.addEventListener('click', () => {
  paste()
  console.log('paste')
})

btnClear.addEventListener('click', () => {
  textArea.value = ''
})
