const textArea = document.getElementById('text-area')
const output = document.getElementById('output')
const btnPaste = document.getElementById('btn-paste')
const btnClear = document.getElementById('btn-clear')
const btnUpdate = document.getElementById('btn-update')
const btnRecall = document.getElementById('btn-recall')
const sEngine = document.getElementById('s-engine')

const myData = { strings: [] }
let openW

myData.strings = loadArray('mydatastrings')
if (myData.strings) renderList()

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

function setSearchEngine() {
  switch (sEngine.value) {
    case 'Google':
      myData.searchStr = 'https://www.google.com/search?q='
      break
    case 'YouTube':
      myData.searchStr = 'https://www.youtube.com/results?search_query='
      break
    case 'Bing':
      myData.searchStr = 'https://www.bing.com/search?q='
      break
    case 'DuckDuckGo':
      myData.searchStr = 'https://www.duckduckgo.com/?q='
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
    url = myData.searchStr + str
  }

  openW = window.open(url)
}

function btnXClick(str, index) {
  myData.strings.splice(index, 1)
  saveArray('mydatastrings', myData.strings)
  renderList()
}

function renderList() {
  output.innerHTML = ''
  myData.strings.forEach((str, index) => {
    const div = document.createElement('div')
    div.classList.add('div-items')
    //btn s (search)
    const btnS = document.createElement('button')

    btnS.textContent = 'search'
    if (isURL(str)) btnS.textContent = ' open :'

    btnS.classList.add('btn', 'btn-s')
    div.appendChild(btnS)
    btnS.addEventListener('click', () => btnSClick(str, index))
    //btn x (delete)
    const btnX = document.createElement('button')
    btnX.textContent = 'X'
    btnX.classList.add('btn', 'btn-x')
    div.appendChild(btnX)
    btnX.addEventListener('click', () => btnXClick(str, index))
    //text
    const span = document.createElement('span')
    span.textContent = str
    div.appendChild(span)
    output.appendChild(div)
  })
}

async function paste() {
  const text = await navigator.clipboard.readText()
  textArea.value = text
}

//---- Event Listeners
btnUpdate.addEventListener('click', () => {
  if (textArea.value == '') return
  myData.strings = textArea.value.split('\n')
  saveArray('mydatastrings', myData.strings)
  renderList()
  textArea.value = ''
})

btnRecall.addEventListener('click', () => {
  textArea.value = myData.strings.join('\n')
  myData.strings = []
  saveArray('mydatastrings', myData.strings)
  renderList()
})

btnPaste.addEventListener('click', () => {
  paste()
  console.log('paste')
})

btnClear.addEventListener('click', () => {
  textArea.value = ''
  //todo focus and close functions for open windows
  // console.log(openW)
  // openW.focus()
  //todo edit for lists
  // let edit = window.prompt('edit:', 'default zae')
})
