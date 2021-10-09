const myData = { strings: [] }
myData.searchStr = 'https://www.youtube.com/results?search_query='

const textArea = document.getElementById('text-area')
const output = document.getElementById('output')
const btnAdd = document.getElementById('btn-add')
const btnLoad = document.getElementById('btn-load')
const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')

function saveArray(key, array) {
  localStorage.setItem(key, JSON.stringify(array))
}

function loadArray(key) {
  return JSON.parse(localStorage.getItem(key))
}

function btnSClick(str, index) {
  const url = myData.searchStr + str
  window.open(url, '_blank')
}

function btnXClick(str, index) {
  myData.strings.splice(index, 1)
  console.log(str, index)
  output.innerHTML = ''
  renderList()
}

function renderList() {
  myData.strings.forEach((str, index) => {
    const div = document.createElement('div')
    div.classList.add('div-items')
    //btn s (search)
    const btnS = document.createElement('button')
    btnS.textContent = 'search'
    btnS.classList.add('btn-s')
    div.appendChild(btnS)
    btnS.addEventListener('click', () => btnSClick(str, index))
    //btn x (delete)
    const btnX = document.createElement('button')
    btnX.textContent = 'x'
    btnX.classList.add('btn-x')
    div.appendChild(btnX)
    btnX.addEventListener('click', () => btnXClick(str, index))
    //text
    const span = document.createElement('span')
    span.textContent = str
    div.appendChild(span)
    output.appendChild(div)
  })
}

btnAdd.addEventListener('click', () => {
  output.innerHTML = ''
  myData.strings = textArea.value.split('\n')
  renderList()
})

btnLoad.addEventListener('click', () => {
  output.innerHTML = ''
  myData.strings = loadArray('mydatastrings')
  renderList()
})

btnSave.addEventListener('click', () => {
  saveArray('mydatastrings', myData.strings)
  alert('Data saved to local storage')
})

btnDelete.addEventListener('click', () => {
  localStorage.removeItem('mydatastrings')
  alert('Local storage data deleted')
})
