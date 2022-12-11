/* global bar, info:false */
function bindWindows () {
  document.querySelector('#min').addEventListener('click', bar.min)
  document.querySelector('#close').addEventListener('click', bar.close)
}

function bindGroupStyle () {
  let index = 0
  const groups = document.querySelectorAll('.sidebar > div')
  groups[0].className = 'selected-group'
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
  const sidebar = document.querySelector('.sidebar')
  const loading = document.querySelector('.loading')
  const text = document.querySelector('.loading p')
  info.groups((event, ifEnd, data) => {
    console.log(data)
    const group = document.createElement('div')
    group.className = 'group'
    group.innerHTML = `<i class="fa-solid fa-user-group"></i><p>${data}</p>`
    sidebar.appendChild(group)
    if (ifEnd) {
      loading.style.display = 'none'
      bindGroupStyle()
    } else {
      text.innerHTML = 'loading groups...'
    }
  })
}

bindWindows()
showInfo()
