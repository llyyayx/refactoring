import { random } from '@/utils'
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
    const color = this.randColor()
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '80px',
        right: '80px'
      },
      title: {
        left: 'center',
        text: config.unit ? config.name + '(' + config.unit + ')' : config.name
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
        axisLine: {
          lineStyle: {
            width: 3
          }
        },
        axisLabel: {
          fontWeight: 'bold'
        },
        data: config.date
      },
      yAxis: {
        type: 'value',
        min: config.min,
        max: config.max,
        axisLine: {
          lineStyle: {
            width: 3
          }
        },
        axisLabel: {
          fontWeight: 'bold'
        },
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: 'ctrl'
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
          type: config.type,
          smooth: true,
          showSymbol: true,
          symbol: 'none',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: color[0]
            }, {
              offset: 1,
              color: color[1]
            }])
          },
          data: config.value
        }
      ]
    }
    myChart.setOption(option)
    return myChart
  },

  /**
   * echarts折线图封装--多个属性合并到一个上来
   * @param { Object } echarts 插件对象
   * @param { Object } config 设置项
   * config.dom 图标实例化的dom对象
   * config.date 数据源--x轴日期
   * config.attr 设备属性数组
   * config.attr.name 属性名称
   * config.attr.type 图形展示类别 line折线 bar柱状等等
   * config.attr.data 属性的历史数据
   * @return echarts实例化对象
   */
  mergeLine(echarts, config) {
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
        left: '80px',
        right: '80px'
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
      legend: {
        data: config.legend
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: config.date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: 'ctrl'
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
      series: config.dataList
    }
    myChart.setOption(option)
    return myChart
  },

  randColor() {
    const color = [
      ['#fe9a8bb3', ' #fe9a8b03'],
      ['#9E87FFb3', '#9E87FF03']
    ]
    const v = random(0, color.length)
    return color[v]
  }

}
