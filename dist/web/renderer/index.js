/* global bar, info, echarts, word:false */
const loading = document.querySelector('.loading')
const text = document.querySelector('.loading p')
const counts = {}; const totalCounts = {}; const groupName = {}; const datum = {}; const legendName = []
const chartsDom = [document.querySelector('.chart-rank'), document.querySelector('.chart-line')]
const chartRank = echarts.init(chartsDom[0])
const chartLine = echarts.init(chartsDom[1])
const marqueeTop = 10
let init = false; let chartIndex = 0; let marqueeNum = 0; let messageText = ''; let pined = false

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

function bindNextChart () {
  document.querySelector('#chart').addEventListener('click', () => {
    if (init) {
      chartIndex = (chartIndex + 1) % chartsDom.length
      // elegant!!!!!!
      chartsDom[chartIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  })
}

function bindPin () {
  const pin = document.querySelector('#pin')
  pin.addEventListener('click', () => {
    if (pined) {
      bar.unpin()
      pined = false
      pin.style.color = '#222323'
      pin.style.backgroundColor = '#f0f6f0'
    } else {
      bar.pin()
      pined = true
      pin.style.color = '#f0f6f0'
      pin.style.backgroundColor = '#222323'
    }
  })
}

function handleInfo () {
  info.groups((event, ifEnd, data) => {
    if (ifEnd) {
      loading.style.display = 'none'
      init = true
      buildChartRank()
      buildChartLine()
      window.onresize = () => {
        chartRank.resize()
        chartLine.resize()
      }
    }
    datum[data.group_id] = []
    groupName[data.group_id] = data.group_name
    counts[data.group_id] = 0
    totalCounts[data.group_name] = 0
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
    totalCounts[groupName[data.group_id]]++
    messageText += data.message.replace(/\[CQ.*?]/g, '')
    // marquee
    if (marqueeNum >= marqueeTop) return
    marqueeNum++
    const marqueeBox = document.querySelector('.marqueeBox')
    const marquee = document.createElement('div')
    marquee.className = 'marquee'
    marquee.innerText = data.message.replace(/\[CQ.*?]/g, '[CQ code]')
    marqueeBox.appendChild(marquee)
    const maxTop = marqueeBox.clientHeight - marquee.offsetHeight
    marquee.style.top = Math.round(Math.random() * maxTop) + 'px'
    const timer = setInterval(() => {
      let left = marquee.offsetLeft
      left -= 1
      marquee.style.left = left + 'px'
      if (left < -marquee.offsetWidth) {
        clearInterval(timer)
        marquee.remove()
        marqueeNum--
      }
    }, 10)
  })
  const cloud = document.querySelector('.cloudBox')
  word.get((event, result) => {
    cloud.innerHTML = ''
    for (let i = 0; i < result.length && i < 5; i++) {
      cloud.innerHTML += result[i].keyword + '<br>'
    }
  })
}

bindWindows()
bindGetMember()
bindNextChart()
bindPin()
handleInfo()

// charts

function buildChartRank () {
  const option = {
    color: '#222323',
    title: {
      left: 'center',
      text: 'Total message nums ranking'
    },
    xAxis: {
      max: 'dataMax'
    },
    grid: {
      containLabel: true
    },
    yAxis: {
      type: 'category',
      data: Object.keys(totalCounts),
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 4,
      splitLine: {
        show: false
      }
    },
    series: [
      {
        realtimeSort: true,
        type: 'bar',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        },
        emphasis: {
          focus: 'series'
        }
      }
    ],
    animationDuration: 0,
    animationDurationUpdate: 300,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  }
  chartRank.setOption(option)
  setInterval(() => {
    chartRank.setOption({
      series: [
        {
          type: 'bar',
          data: Object.values(totalCounts)
        }
      ]
    })
  }, 1000) // 1s
}

function buildChartLine () {
  const option = {
    title: {
      left: 'center',
      text: 'Message nums per 10s'
    },
    grid: {
      containLabel: true
    },
    legend: {
      show: true,
      type: 'scroll',
      top: '36px'
    },
    tooltip: {
      backgroundColor: '#f0f6f0',
      trigger: 'axis',
      formatter: function (params) {
        const time = new Date(params[0].value[0])
        let result = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}<br>`
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
  chartLine.setOption(option)
  setInterval(() => {
    const now = new Date()
    let text = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}<br>`
    for (const id in counts) {
      if (datum[id].length > 1000) datum[id].shift()
      datum[id].push({
        name: now.toString(),
        value: [
          now.getTime(),
          counts[id],
          groupName[id]
        ]
      })
      if (counts[id] > 0) {
        text += `${groupName[id]}: ${counts[id]}<br>`
        legendName.push(groupName[id])
      }
    }
    // show for card
    document.querySelector('.card').innerHTML = text
    // show for word
    word.cut(messageText)
    messageText = ''
    // reset option
    chartLine.setOption({
      series: buildSeries(),
      legend: {
        data: legendName
      }
    })
    // clear counts
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
}
