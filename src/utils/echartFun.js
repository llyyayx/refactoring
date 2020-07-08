export default {

  /**
   * echarts折线图封装--样式1
   * @param { Object } echarts 插件对象
   * @param { Object } config 设置项
   * config.dom 图标实例化的dom对象
   * config.name 图标名称
   * config.date 数据源--x轴日期
   * config.value 数据源--数据
   * config.unit 单位
   * config.max y轴允许最大值
   * config.min y轴允许最小值
   * @return echarts实例化对象
   */
  brokenLine(echarts, config) {
    const myChart = echarts.init(config.dom)
    const option = {
      tooltip: {
        trigger: 'axis',
        type: 'cross',
        position: function(pt) {
          return [pt[0], '10%']
        }
      },
      grid: {
        left: '50px',
        right: '50px'
      },
      title: {
        left: 'center',
        text: config.name + config.unit
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: config.date
      },
      yAxis: {
        type: 'value',
        min: config.min,
        max: config.max,
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [
        {
          name: config.name,
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbol: 'none',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(255, 158, 68)'
            }, {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }])
          },
          data: config.value
        }
      ]
    }
    myChart.setOption(option)
    return myChart
  }
}
