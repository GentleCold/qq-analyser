/* global bar, info, echarts:false */
const loading = document.querySelector('.loading')
const text = document.querySelector('.loading p')
let init = false
function bindWindows () {
  document.querySelector('#min').addEventListener('click', bar.min)
  document.querySelector('#close').addEventListener('click', bar.close)
}

function bindGetMember () {
  let action = false
  const infoBox = document.querySelector('.infoBox')
  document.querySelector('#member').addEventListener('click', () => {
    if (init && !action) {
      infoBox.style.display = 'flex'
      action = true
    }
  })
  document.querySelector('#no').addEventListener('click', () => {
    infoBox.style.display = 'none'
    action = false
  })
  document.querySelector('#yep').addEventListener('click', () => {
    infoBox.style.display = 'none'
    loading.style.display = 'block'
    text.innerHTML = 'waiting...'
    bar.getMember()
  })
  info.memberFinish(() => {
    loading.style.display = 'none'
    action = false
  })
}

function handleInfo () {
  info.groups((event, ifEnd, data) => {
    if (ifEnd) {
      loading.style.display = 'none'
      init = true
    }
  })
  info.restart((event, ifEnd) => {
    if (ifEnd) {
      loading.style.display = 'none'
    } else {
      loading.style.display = 'block'
      text.innerHTML = 'restarting...'
    }
  })
}

bindWindows()
bindGetMember()
handleInfo()

// charts

const chartDom = echarts.init(document.querySelector('.chart'))
const datum = []
let count = 0
const option = {
  title: {
    text: 'Dynamic Data & Time Axis'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0]
      const date = new Date(params.name)
      return (
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds() +
        ' - ' +
        params.value[1]
      )
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      data: datum
    }
  ]
}

info.message((event, data) => {
  count++
})

setInterval(() => {
  if (datum.length > 1000) datum.shift()
  const now = new Date()
  datum.push({
    name: now.toString(),
    value: [
      now.getTime(),
      count
    ]
  })
  chartDom.setOption({
    series: [
      {
        data: datum
      }
    ]
  })
  count = 0
}, 10000) // 10s

chartDom.setOption(option)

window.onresize = () => {
  chartDom.resize()
}
