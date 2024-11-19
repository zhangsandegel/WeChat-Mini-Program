import * as echarts from '../ec-canvas/echarts';
const getTime_js = require('../../utils/getTime.js');
const app = getApp();
let upgradeTimeTimer;

Page({
  data: {
    ecLine: [],
    dynamicData: [],
    xAxisData: [],
  },

  onShareAppMessage: function (res) {
    return {
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    };
  },

  upgradeTime: function () {
    let newTimeData = getTime_js.getTime();
    const dataArray = app.globalData.dataArray;
    this.data.xAxisData.push(newTimeData);
    if (this.data.xAxisData.length > 600) {
      this.data.xAxisData.shift();
    }
    let dynamicData = [];
    for (let i = 0; i < dataArray.length; i++) {
      let value = parseFloat(dataArray[i].value);
      dynamicData.push(value);
    }
    this.data.dynamicData.push(dynamicData);
    if (this.data.dynamicData.length > 600) {
      this.data.dynamicData.shift();
    }
    this.setData({
      xAxisData: this.data.xAxisData,
      dynamicData: this.data.dynamicData
    });
    this.updateCharts();
  },

  onReady: function () {
    this.initCharts();
    upgradeTimeTimer = setInterval(() => {
      this.upgradeTime();
    }, 1000);
    const previousData = wx.getStorageSync('chartData');
    if (previousData) {
      this.setData({
        xAxisData: previousData.xAxisData,
        dynamicData: previousData.dynamicData
      });
      this.updateCharts();
    }
  },

  onUnload: function () {
    clearInterval(upgradeTimeTimer);
  },

  initCharts: function () {
    let that = this;
    const dataArray = app.globalData.dataArray;
    let ecLine = dataArray.map((item, index) => {
      let chartId = `mychart-multi-line-${index}`;
      return {
        id: chartId,
        name: item.name,
        unit: item.unit,
        ecConfig: {
          lazyLoad: true
        }
      };
    });
    this.setData({
      ecLine
    });
    this.data.ecLine.forEach((line, index) => {
      let chartComponent = this.selectComponent(`#${line.id}`);
      if (chartComponent) {
        chartComponent.init((canvas, width, height, dpr) => {
          const lineChart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          canvas.setChart(lineChart);
          console.log(that.data.dynamicData["0"])
          console.log(that.transpose(that.data.dynamicData)[0])
          lineChart.setOption(that.getLineOption(this.data.xAxisData, this.transpose(that.data.dynamicData)[index], line.name, line.unit));
          return lineChart;
        });
      }
    });
  },

  updateCharts: function () {
    let that = this;
    this.data.ecLine.forEach((line, index) => {
      let chartComponent = this.selectComponent(`#${line.id}`);
      chartComponent.setData(this.transpose(this.data.dynamicData)[index]);
    });
  },

  transpose: function (matrix) {
    if (!matrix || matrix.length === 0) {
      return matrix;
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    for (let i = 0; i < cols; i++) {
      result.push([]);
      for (let j = 0; j < rows; j++) {
        result[i].push(matrix[j][i]);
      }
    }
    return result;
  },

  getLineOption: function (xAxisData, dynamicData, name, unit) {
    let seriesData = dynamicData;
    return {
      title: {
        text: `${name} (${unit})`,
        left: 'center'
      },
      legend: {
        data: [name],
        top: 50,
        left: 'center',
        backgroundColor: 'red',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          formatter: function (value) {
            return value;
          }
        }
      },
      yAxis: {
        type: 'value',
        position: 'left',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      series: [{
        name: name,
        type: 'line',
        smooth: true,
        data: seriesData
      }]
    };
  },
});