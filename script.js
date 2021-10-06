const myData = { strings: [] }
const textArea = document.getElementById('text-area')
const btnAdd = document.getElementById('btn-add')
const output = document.getElementById('output')
myData.searchStr = 'https://www.youtube.com/results?search_query='

function btnSClick(str, index) {
  const url = myData.searchStr + str
  window.open(url, '_blank')
}

function btnXClick(str, index) {
  myData.strings.splice(index, 1)
  console.log(str, index)
  output.innerHTML = ''
  print()
}

function print() {
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
  print()
  console.log(myData)
})
