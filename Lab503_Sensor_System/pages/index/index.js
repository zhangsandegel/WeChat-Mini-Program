// index.js
const calibrate_js = require('../../utils/calibrate.js'); // 引入 utils.js 文件
const getTime_js = require('../../utils/getTime.js');
const convert_js = require('../../utils/convert.js');
const app = getApp();

Page({
    data: {
        btnItemFor: [{
                text: "Add/Delete",
                imgSrc: "../../images/index/Add_Delete.png",
                value: "3",
            },
            {
                text: "Bluetooth",
                imgSrc: "../../images/index/Bluetooth.png",
                value: "4",
            },
            {
                text: "Server",
                imgSrc: "../../images/index/Server.png",
                value: "1",
            },
            {
                text: "Timer",
                imgSrc: "../../images/index/Timer.png",
                value: "2",
            },
            {
                text: "Diagram",
                imgSrc: "../../images/index/Diagram.png",
                value: "5",
            },
        ],
        deviceName: "None Device Connected",
        isShowPopup: [false, false],
        inputItem: [
            [{
                name: 'Name',
                inputEvent: 'onInputName',
                value: '',
            }, {
                name: 'Unit',
                inputEvent: 'onInputUnit',
                value: '',
            }, {
                name: 'Order',
                inputEvent: 'onInputOrder',
                value: '',
            }, {
                name: 'Eqn',
                inputEvent: 'onInputEqn',
                value: 'round(x, 4)',
            }, ],
            [{
                name: 'IP',
                inputEvent: 'onInputIP',
                value: '',
            }, {
                name: 'Port',
                inputEvent: 'onInputPort',
                value: '',
            }, {
                name: 'Route',
                inputEvent: 'onInputRoute',
                value: '',
            }, ],
            [{
                name: 'Interval',
                inputEvent: '',
                value: '500',
            }, ],
            [{
                name: 'Name',
                inputEvent: 'onAddDelName',
                value: '',
            }, {
                name: 'Unit',
                inputEvent: '',
                value: '',
            }, {
                name: 'Order',
                inputEvent: '',
                value: '',
            }, {
                name: 'Eqn',
                inputEvent: '',
                value: 'round(x, 4)',
            }, ],
        ],
        showItem: [
            [],
            [{
                content: "*Please make sure that the IP or Domain is available in the terminal of the WebAPP."
            }, ],
            [],
            [{
                    content: "*Data fo rmat from hardware (ordered):"
                },
                {
                    content: "devName#data1#data2#data3#...#...\\r\\n"
                },
            ],
        ],
        btnMode: [false, true],
        dataArray: [{
            name: "ADC1",
            unit: "V",
            value: "00.0000",
            order: 1,
            eqn: "round(x*3.3/4096, 4)",
        }, {
            name: "ADC2",
            unit: "V",
            value: "00.0000",
            order: 2,
            eqn: "round(x*3.3/4096, 4)",
        }, {
            name: "ADC3",
            unit: "V",
            value: "00.0000",
            order: 3,
            eqn: "round(x*3.3/4096, 4)",
        }, ],
        timeData: "00:00:00.0000",
        idxModify: -1,
        deviceId: '',
        serviceId: '',
        characteristicId: '',
        options: {},
        protocol: "http",
        ip_domain: "42.194.183.56",
        port: "50006",
        route: "/api/dataset",
        isTimer: false,
        receiverText: "lmh#0.0#1.2#2.6#3.33#444\r\n",
        tempReceiver: "",
    },

    getCopyright: function () {
        wx.showModal({
            title: 'Copyright', // 弹窗标题
            content: 'Copyright © 2023 Lab503A, SZU.\r\nAll Rights Reserved.', // 弹窗内容
            showCancel: false, // 是否显示取消按钮（默认为true，设置为false表示不显示取消按钮）
            confirmText: 'Confirm', // 确定按钮的文字
        });
    },

    onLoad: function () {
        let that = this;
        that.sortOrder();
    },

    onShow: function () {
        let that = this;
        let pages = getCurrentPages();
        // 数组中索引最大的页面--当前页面
        let currentPage = pages[pages.length - 1];
        // 打印出当前页面中的 options
        // console.log(currentPage.options) //正常打印出 options 值
        let options = currentPage.options;

        that.setData({
            options: options,
        });

        if (options.deviceId) {
            let deviceName = app.globalData.deviceName;
            if (!deviceName) deviceName = "N/A";
            that.setData({
                deviceId: options.deviceId,
                deviceName: deviceName,
                serviceId: options.serviceId,
                characteristicId: options.characteristicId
            });
            /**
             * 获取蓝牙设备服务列表
             */
            wx.getBLEDeviceServices({
                deviceId: that.data.deviceId,
                success: function (res) {
                    const services = res.services.filter((item, i) => {
                        return !/^000018/.test(item.uuid)
                    });
                    that.setData({
                        services: services
                    });
                },
                fail: function (res) {
                    wx.showToast({
                        title: 'Failed',
                        icon: 'none'
                    });
                }
            })
        }

        /**
         * 如果支持notify
         */
        if (options.notify) {
            wx.notifyBLECharacteristicValueChange({
                deviceId: options.deviceId,
                serviceId: options.serviceId,
                characteristicId: options.characteristicId,
                state: true,
                success: function (res) {}
            })
        }
    },

    showPopup: function (event) {
        let that = this;
        let i_ = event.currentTarget.dataset.value;
        let i = (i_[0] == "B") ? Number(i_[1]) : Number(i_);
        if (!(i + 1)) return;
        switch (i) {
            case 0: {
                var idxModify = Number(i_[2]);
                let inputItem = that.data.inputItem.slice();
                inputItem[0][0].value = that.data.dataArray[idxModify].name;
                inputItem[0][1].value = that.data.dataArray[idxModify].unit;
                inputItem[0][2].value = that.data.dataArray[idxModify].order;
                inputItem[0][3].value = that.data.dataArray[idxModify].eqn;

                that.setData({
                    idxModify: idxModify,
                    inputItem: inputItem,
                });
                break;
            }
            case 2: {
                if (that.data.isTimer) that.onStopPress();
                break;
            }
            case 3: {
                let inputItem = that.data.inputItem.slice();
                for (var k = 0; k < inputItem[3].length; k++) {
                    inputItem[3][k].value = '';
                }
                that.setData({
                    inputItem: inputItem,
                    btnMode: [false, true],
                });
                that.addMode(["", "", "", ""]);
                break;
            }
            case 4: {
                wx.navigateTo({
                    url: '/pages/search/search',
                })
                return;
            }
            case 5: {
                // 跳转到图标界面
                wx.navigateTo({
                    url: '/pages/diagram/diagram',
                    // url: '/pages/graphic/graphic',
                })
                return;
            }
        }
        let isShowPopup = that.data.isShowPopup.slice(); // 先复制数组，保持数据的不可变性
        isShowPopup[i] = true; // 修改特定索引的元素值
        that.setData({
            isShowPopup: isShowPopup
        });
    },

    hidePopup: function (event) {
        let that = this;
        let i_ = event.currentTarget.dataset.value;
        let i = (i_[0] == "B") ? Number(i_[1]) : Number(i_);
        let isShowPopup = that.data.isShowPopup.slice(); // 先复制数组，保持数据的不可变性
        isShowPopup[i] = false; // 修改特定索引的元素值
        that.setData({
            isShowPopup: isShowPopup
        });
    },

    onConfirm: function (event) {
        let that = this;
        let i_ = event.currentTarget.dataset.value;
        let i = (i_[0] == "B") ? Number(i_[1]) : Number(i_);
        let inputData = event.detail; // 获取输入框的数据
        if (!i) {
            let i2 = that.data.idxModify;
            if (!inputData[0]) inputData[0] = that.data.dataArray[i2].name;
            if (!inputData[1]) inputData[1] = that.data.dataArray[i2].unit;
            if (!inputData[2]) inputData[2] = that.data.dataArray[i2].order;
            if (!inputData[3]) inputData[3] = that.data.dataArray[i2].eqn;
        }
        let inputItem = that.data.inputItem.slice();
        // console.log("输入框的数据：", inputData);
        for (var k = 0; k < inputData.length; k++) {
            inputItem[i][k].value = inputData[k]
        }
        that.setData({
            inputItem: inputItem,
        });
        switch (i) {
            case 0: {
                let dataArray = that.data.dataArray.slice();
                let i2 = that.data.idxModify;
                if (!(Number(i2) + 1)) break;
                for (var k = 0; k < dataArray.length; k++) {
                    if (dataArray[k].name == inputData[0] && k != i2) {
                        that.hidePopup(event); // 关闭弹窗
                        return;
                    }
                }
                dataArray[i2].name = inputData[0];
                dataArray[i2].unit = inputData[1];
                dataArray[i2].eqn = inputData[3];
                var testOrder_ = that.testOrder(inputData[2]);
                switch (testOrder_) {
                    case 0: {
                        if (dataArray[i2].order != Number(inputData[2])) {
                            var tempOrder = dataArray[i2].order;
                            dataArray[i2].order = Number(inputData[2]);
                            for (var k = 0; k < dataArray.length; k++) {
                                if (inputData[2] < tempOrder && dataArray[k].order >= inputData[2] && dataArray[k].order < tempOrder && k != i2) {
                                    dataArray[k].order++;
                                } else if (inputData[2] > tempOrder && dataArray[k].order <= inputData[2] && dataArray[k].order > tempOrder && k != i2) {
                                    dataArray[k].order--;
                                }
                            }
                        }
                        break;
                    }
                    case 1:
                    case -1: {
                        that.hidePopup(event); // 关闭弹窗
                        return;
                    }
                }
                that.setData({
                    dataArray: dataArray,
                });
                that.sortOrder();
                break;
            }
            case 2: {
                let inputItem = that.data.inputItem.slice();
                if (inputData[0]) inputItem[2][0].value = inputData[0];
                that.setData({
                    inputItem: inputItem,
                });
                // console.log(calibrate_js.evaluateExpression(inputData[0], inputData[1]));
                break;
            }
        }
        that.hidePopup(event); // 关闭弹窗
    },

    onCancel: function (event) {
        // 用户点击取消按钮时触发的事件
        let that = this;
        that.hidePopup(event); // 关闭弹窗
    },

    addMode: function (valArr) {
        let that = this;
        var btnMode = [false, true]; // Add
        let inputItem = that.data.inputItem.slice();
        inputItem[3] = [{
            name: 'Name',
            inputEvent: 'onAddDelName',
            value: valArr[0],
        }, {
            name: 'Unit',
            inputEvent: '',
            value: valArr[1],
        }, {
            name: 'Order',
            inputEvent: '',
            value: valArr[2],
        }, {
            name: 'Eqn',
            inputEvent: '',
            value: valArr[3],
        }, ];
        that.setData({
            btnMode: btnMode,
            inputItem: inputItem,
        });
    },

    deleteMode: function (valName) {
        let that = this;
        var btnMode = [true, false]; // Delete
        let inputItem = that.data.inputItem.slice();
        inputItem[3] = [{
            name: 'Name',
            inputEvent: 'onAddDelName',
            value: valName,
        }, ];
        that.setData({
            btnMode: btnMode,
            inputItem: inputItem,
        });
    },

    onAddDelName: function (event) {
        let that = this;
        var inputValue = event.detail[0];
        let dataArray = that.data.dataArray.slice();
        if (dataArray.length == 0) {
            that.addMode(event.detail);
        }
        for (var k = 0; k < dataArray.length; k++) {
            if (dataArray[k].name == inputValue) {
                that.deleteMode(event.detail[0]);
                break;
            } else {
                that.addMode(event.detail);
            }
        }
    },

    // Sorting as per order of the dataArray
    sortOrder: function () {
        let that = this;
        let dataArray = that.data.dataArray.slice();
        let dataArrayNew = dataArray.sort((a, b) => a.order - b.order);
        that.setData({
            dataArray: dataArrayNew,
        });
    },

    onAdd: function (event) {
        let that = this;
        let inputItem = that.data.inputItem;
        let dataArray = that.data.dataArray.slice();
        var testOrder_ = that.testOrder(inputItem[3][2].value);
        switch (testOrder_) {
            case 0: {
                for (var k = 0; k < dataArray.length; k++) {
                    if (dataArray[k].order >= inputItem[3][2].value) dataArray[k].order++;
                }
            }
            case 1: {
                dataArray.push({
                    "name": inputItem[3][0].value,
                    "unit": inputItem[3][1].value,
                    "order": inputItem[3][2].value,
                    "eqn": inputItem[3][3].value,
                    "value": "00.0000",
                });
                break;
            }
            case -1: {
                that.hidePopup(event); // 关闭弹窗
                return;
            }
        }
        that.setData({
            dataArray: dataArray,
        });
        that.sortOrder();
        that.hidePopup(event); // 关闭弹窗
    },

    onDelete: function (event) {
        let that = this;
        let inputItem = that.data.inputItem;
        let dataArray = that.data.dataArray.slice();
        var delIdx = -1;
        for (var k = 0; k < dataArray.length; k++) {
            if (dataArray[k].name == inputItem[3][0].value) {
                delIdx = k;
                break;
            }
        }
        if (k + 1) {
            dataArray.splice(k, 1);
        } else {
            return;
        }
        for (var k = 0; k < dataArray.length; k++) {
            if (dataArray[k].order > delIdx) {
                dataArray[k].order--;
            }
        }
        that.setData({
            dataArray: dataArray,
        });
        that.sortOrder();
        that.hidePopup(event); // 关闭弹窗
    },

    testOrder: function (order_) {
        let that = this;
        let dataArray = that.data.dataArray.slice();
        var order = [];
        for (var k = 0; k < dataArray.length; k++) {
            order[k] = dataArray[k].order;
        }
        if (order_ <= Math.max(...order) && order_ > 0) return 0;
        else if ((order.length == 0 && order_ == 1) || order_ == Math.max(...order) + 1) return 1;
        else return -1;
    },

    upgradeTime: function () {
        let that = this;
        that.setData({
            timeData: getTime_js.getTime(),
        });
    },

    onStartPress: function () {
        let that = this;
        wx.showToast({
            title: "Start Upgrade",
            icon: "success",
            duration: 1500
        });
        that.setData({
            isTimer: true,
        });

        /**
         * 监听蓝牙设备的特征值变化
         */
        wx.onBLECharacteristicValueChange(function (res) {
            const receiverText = convert_js.buf2string(res.value);
            let tempReceiver = that.data.tempReceiver;
            if (!receiverText.endsWith("\r\n")) {
                that.setData({
                    tempReceiver: tempReceiver + receiverText,
                });
            } else {
                that.setData({
                    receiverText: that.data.tempReceiver + receiverText,
                    tempReceiver: "",
                })
            }
        })

        var timer = setInterval(function () {
            if (!that.data.isTimer) {
                clearInterval(timer);
            } else {
                const receiverText = that.data.receiverText; // devName#data1#data2#...\r\n
                // console.log(receiverText)
                let dataArray = that.data.dataArray.slice();
                let tempArray = receiverText.split("\r\n")[0];
                let resArray = tempArray.split("#");
                // console.log(resArray);
                if (dataArray.length <= resArray.length - 1) {
                    for (var k = 0; k < dataArray.length; k++) {
                        dataArray[k].value = resArray[k + 1];
                        dataArray[k].value = calibrate_js.evaluateExpression(dataArray[k].value, dataArray[k].eqn);
                    }
                }
                that.setData({
                    timeData: getTime_js.getTime(),
                    dataArray: dataArray,
                });
                app.globalData.dataArray = that.data.dataArray;

                let url = that.data.protocol + "://" + that.data.ip_domain + ":" + that.data.port + that.data.route;
                wx.request({
                    url: url,
                    method: "POST",
                    data: {
                        data: that.data.receiverText,
                        time: that.data.timeData,
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function (res) {
                        // console.log("Result from server: " + res.data);
                    }
                })
            }
        }, that.data.inputItem[2][0].value);
    },

    onStopPress: function () {
        let that = this;
        wx.showToast({
            title: "Stop Upgrade",
            icon: "success",
            duration: 1500
        });
        that.setData({
            isTimer: false,
        });
    },
})