/* global bar, info:false */
function bindWindows () {
  document.querySelector('#min').addEventListener('click', bar.min)
  document.querySelector('#close').addEventListener('click', bar.close)
}

function bindGroupStyle () {
  let index = 0
  const groups = document.querySelectorAll('.sidebar > div')
  groups.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (index !== i) {
        item.className = 'selected-group'
        groups[index].className = 'group'
        index = i
      }
    })
  })
}

function showInfo () {
  const infobox = document.querySelector('.info')
  info.get((event, data) => {
    console.log(data)
    infobox.innerHTML = data
  })
}

bindWindows()
bindGroupStyle()
showInfo()
