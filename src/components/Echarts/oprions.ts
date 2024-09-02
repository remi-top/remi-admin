export function BarOptionFn({title, xAxis,yAxis, series,grid, tooltip,legend}) {
  let seriesList = []
  let basicData = {
    type: 'bar',
    name:'',
    barWidth: 20,
    label: {
      show: true,
      position: 'top',//在上方显示
    },
    markLine:{},
    data: [],
    itemStyle:{}
  }
  if (series && series.length) {
    series.map(i => {
      let item = {
        ...basicData,
        data: i.data,
        name: i.name,
      }
      if(i?.markLine){
        item.markLine = i.markLine
      }
      if (i?.itemStyle) {
        item.itemStyle = i.itemStyle
      }
      // console.log('itemitem',item);
      
      seriesList.push(item)
    })
  }
  return {
    title: {
    },
    legend: {
      show: legend.show,
      formatter: legend?.formatter,
      data: legend?.data,
      top: 'bottom',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        if (tooltip.formatter(params)) {
          return tooltip.formatter(params)
        } else {
          var tar = params[0];
          return title + '<br/>' + tar.name + ' : ' + tar.value;
        }
      }
    },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          // type: "dashed",
          color: '#C8D0D7',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        color: '#7D8292',
        formatter: (value,index) => {
          if (xAxis?.axisLabel?.formatter) {
            return xAxis.axisLabel.formatter(value,index,xAxis?.data)
          } else {
            return value
          }
        }
      },
      data:xAxis?.data
    },
    yAxis: {
      type: 'value',
      alignTicks: true,
      max:yAxis?.max,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#C8D0D7',
          type: 'dashed',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#7D8292',
        },
      },
    },
    grid: {
      top:'20',
      left: '3%',
      right: '4%',
      bottom: '20',
      containLabel: true
    },
    series: seriesList
  };
}
export function PieOptionFn({ title, xAxis, series, tooltip, legend }) { 
  let seriesList = []
  let basicData = {
    name: '',
    type: 'pie',
    radius: ['40%', '70%'],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    data:[]
  }
  if (series && series.length) {
    series.map(i => {
      let item = {
        ...basicData,
        data: i.data,
        name: i.name,
        label: {
          ...i.label
        }
      }
      seriesList.push(item)
    })

  }
  return {
    tooltip: {
      trigger: 'item',
      formatter:tooltip?.formatter
    },
    legend: {
      top:'3%',
      left: '1%',
      orient: 'vertical',
      formatter:legend?.formatter
    },
    series: seriesList
  }
}
