const textArea = document.getElementById('text-area')
const outputLists = document.getElementById('output-lists')
const btnRecall = document.getElementById('btn-recall')
const sEngine = document.getElementById('s-engine')
const quickSearch = document.getElementById('quick-search')
const openWindowsList = document.getElementById('open-windows-list')
const outputListNames = document.getElementById('output-list-names')

var openWindowsArr = []
let myLists = loadArray('myLists') || []
// let myLists = []
let curentID = 0

if (myLists.length === 0) {
  myLists.push(newListObj('first list'))
} else {
  renderList()
  renderListsNames()
}

function newListObj(name) {
  let listObj = {
    id: Date.now.toString,
    name: name,
    searchStr: 'https://www.google.com/search?q=',
    strings: [],
  }
  return listObj
}

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

function setSearchEngine(str) {
  let searchStr = 'https://www.google.com/search?q=' //default search engine
  switch (str) {
    case 'Google':
      searchStr = 'https://www.google.com/search?q='
      break
    case 'YouTube':
      searchStr = 'https://www.youtube.com/results?search_query='
      break
    case 'Bing':
      searchStr = 'https://www.bing.com/search?q='
      break
    case 'DuckDuckGo':
      searchStr = 'https://www.duckduckgo.com/?q='
      break
  }
  myLists[curentID].searchStr = searchStr
}

function btnSClick(str, index) {
  let url = ''
  if (isURL(str)) {
    if (!/^((http|https|ftp):\/\/)/i.test(str)) {
      url = 'http://' + str
    } else url = str
  } else {
    setSearchEngine(sEngine.value)
    url = myLists[curentID].searchStr + str
  }
  let openW = window.open(url)
  if (openW) {
    openWindowsArr.push(openW)
    renderOpenWindows()
  }
}

function btnXClick(str, index) {
  myLists[curentID].strings.splice(index, 1)
  saveArray('myLists', myLists)
  renderList()
}

function renderOpenWindows() {
  // openWindows.filter((window)=>window.closed)
  // console.log(openWindowsArr)
  openWindowsList.innerHTML = ''
  const ul = document.createElement('ul')
  openWindowsArr.forEach((w, index) => {
    const li = document.createElement('li')
    li.innerHTML = '<i class="fa fa-window-maximize"></i> ' + (index + 1)
    li.addEventListener('click', () => {
      console.log(openWindowsArr[index].closed)
      // console.log(openWindowsArr[index].window)
      openWindowsArr[index].focus()
    })
    // console.log(w.closed)
    // console.log(window.location.href)
    // w.close()
    ul.appendChild(li)
  })
  openWindowsList.appendChild(ul)
}
function renderListsNames() {
  outputListNames.innerHTML = ''
  const ul = document.createElement('ul')
  myLists.forEach((item, index) => {
    const li = document.createElement('li')
    li.innerText = item.name
    if (index === curentID) {
      li.style.fontWeight = 'bold'
      li.style.background = 'var(--clr-lists)'
      li.style.borderRadius = '1rem'
    }
    li.addEventListener('click', () => {
      curentID = index
      renderList()
      renderListsNames()
    })
    ul.appendChild(li)
  })
  outputListNames.appendChild(ul)
}

function renderList() {
  outputLists.innerHTML = ''
  myLists[curentID].strings.forEach((str, index) => {
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
    span.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        myLists[curentID].strings[index] = span.textContent
        event.preventDefault()
        saveArray('myLists', myLists)
        textArea.focus()
      }
    })
    div.appendChild(span)
    outputLists.appendChild(div)
  })
  const div = document.createElement('div')
  div.classList.add('buttons')

  //btn Save as...,
  const btnSave = document.createElement('button')
  btnSave.innerHTML = '<i class="fa fa-floppy-o"></i> Save As...'
  btnSave.classList.add('btn')
  btnSave.setAttribute('title', 'Save a copy of this list as...')
  btnSave.addEventListener('click', () => btnSaveClick())
  div.appendChild(btnSave)

  //btn rename
  const btnRename = document.createElement('button')
  btnRename.innerHTML = '<i class="fa fa-pencil"></i> Rename'
  btnRename.classList.add('btn')
  btnRename.setAttribute('title', 'Rename the list:  ' + myLists[curentID].name)
  btnRename.addEventListener('click', () => {
    let listName = window.prompt('Enter new list name:', myLists[curentID].name)
    if (listName) {
      myLists[curentID].name = listName
      saveArray('myLists', myLists)
      renderListsNames()
    }
  })
  div.appendChild(btnRename)

  //btn delete
  const btnDeleteList = document.createElement('button')
  btnDeleteList.innerHTML = '<i class="fa fa-trash-o"></i> Delete List'
  btnDeleteList.classList.add('btn')
  btnDeleteList.setAttribute(
    'title',
    'Delete the list:  ' + myLists[curentID].name
  )
  btnDeleteList.addEventListener('click', () => {
    let answer = window.prompt(
      'Are you sure you wan to delete: ' + myLists[curentID].name,
      'Yes'
    )
    if (answer === 'Yes') {
      if (myLists.length > 1) {
        myLists.splice(curentID, 1)
        saveArray('myLists', myLists)
        curentID = 0
        renderListsNames()
        renderList()
      }
    }
  })
  div.appendChild(btnDeleteList)
  outputLists.appendChild(div)
  renderOpenWindows()
}

async function paste() {
  const text = await navigator.clipboard.readText()
  textArea.value = text
}
function btnQuickSearchClick() {
  btnSClick(quickSearch.value)
}

function btnAddClick() {
  if (textArea.value == '') return
  const arr = textArea.value.split('\n')
  myLists[curentID].strings.push(...arr)
  saveArray('myLists', myLists)
  renderList()
  textArea.value = ''
}
function btnClearClick() {
  textArea.value = ''
}
function btnSaveClick() {
  let listName = window.prompt(
    'Enter list name:',
    new Date().toJSON().slice(0, 10)
  )
  if (listName) {
    myLists.push(newListObj(listName))
  } else return
  const tmpID = curentID
  curentID = myLists.length - 1
  myLists[curentID].strings = [...myLists[tmpID].strings]
  renderListsNames()
}
function btnExpandClick() {
  textArea.classList.toggle('expanded')
  textArea.focus()
}

//---- Event Listeners
btnRecall.addEventListener('click', () => {
  textArea.value = myLists[curentID].strings.join('\n')
  // myLists[curentID].strings = []
  // saveArray('myLists', myLists)
  // renderList()
})

quickSearch.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') btnSClick(quickSearch.value)
})
