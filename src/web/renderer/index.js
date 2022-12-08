/* global bar:false */
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

bindWindows()
bindGroupStyle()
