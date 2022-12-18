/* global bar, info, echarts:false */
const loading = document.querySelector('.loading')
const text = document.querySelector('.loading p')
const datum = {}; const counts = {}; const groupName = {}
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
    groupName[data.group_id] = data.group_name
    datum[data.group_id] = []
    counts[data.group_id] = 0
  })
  info.restart((event, ifEnd) => {
    if (ifEnd) {
      loading.style.display = 'none'
    } else {
      loading.style.display = 'block'
      text.innerHTML = 'restarting...'
    }
  })
  info.message((event, data) => {
    counts[data.group_id]++
  })
}

bindWindows()
bindGetMember()
handleInfo()

// charts

function buildChartRank () {
  const chartRank = echarts.init(document.querySelector('.chart-rank'))
  const option = {
    title: {
      text: 'Message nums per 10s'
    },
    tooltip: {
      backgroundColor: '#f0f6f0',
      trigger: 'axis',
      formatter: function (params) {
        let result = ''
        params.sort((a, b) => {
          return b.value[1] - a.value[1]
        })
        for (let i = 0; i < params.length; i++) {
          if (params[i].value[1] === 0) break
          else result += `${params[i].value[2]}: ${params[i].value[1]}<br>`
        }
        return result
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
      splitLine: {
        show: false
      }
    }
  }
  chartRank.setOption(option)
  setInterval(() => {
    const now = new Date()
    for (const id in counts) {
      datum[id].push({
        name: now.toString(),
        value: [
          now.getTime(),
          counts[id],
          groupName[id]
        ]
      })
    }
    chartRank.setOption({
      series: buildSeries()
    })
    for (const id in counts) {
      counts[id] = 0
    }
  }, 10000) // 10s

  function buildSeries () {
    const seriesList = []
    for (const id in counts) {
      seriesList.push({
        name: groupName[id],
        type: 'line',
        showSymbol: false,
        emphasis: {
          focus: 'series'
        },
        data: datum[id]
      })
    }
    return seriesList
  }

  window.onresize = () => {
    chartRank.resize()
  }
}

buildChartRank()
