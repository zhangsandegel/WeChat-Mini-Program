// app.js
App({
    globalData: {
        sysinfo: {},
        BluetoothState: false, // 蓝牙适配器状态
        connectState: false, // 蓝牙连接状态
        deviceId: "",
        deviceName: "",
        deviceService: "",
        characteristicId: "",
        serviceId: "",
        dataArray:[],
    },
    onLaunch: function () { // 小程序启动
        let that = this;
        that.globalData.sysinfo = wx.getSystemInfoSync();
    },
    getModel: function () { //获取手机型号
        let that = this;
        return that.globalData.sysinfo["model"]
    },
    getVersion: function () { //获取微信版本号
        let that = this;
        return that.globalData.sysinfo["version"]
    },
    getSystem: function () { //获取操作系统版本
        let that = this;
        return that.globalData.sysinfo["system"]
    },
    getPlatform: function () { //获取客户端平台
        let that = this;
        return that.globalData.sysinfo["platform"]
    },
    getSDKVersion: function () { //获取客户端基础库版本
        let that = this;
        return that.globalData.sysinfo["SDKVersion"]
    },
    /**
     * 停止搜索附近蓝牙
     */
    stopSearchDevs: function () {
        wx.stopBluetoothDevicesDiscovery({
            success: function (res) {},
        })
    },
    /**
     * 开始连接
     */
    startConnect: function (deviceId, deviceName) {
        var that = this;
        if (this.globalData.BluetoothState) {
            wx.createBLEConnection({
                deviceId: deviceId,
                timeout: 10000, // 10s连接超时
                success: function (res) {
                    that.globalData.deviceId = deviceId;
                    that.globalData.deviceName = deviceName;
                    wx.navigateTo({
                        url: `/pages/service/service?deviceId=${deviceId}&deviceName=${deviceName}`,
                    })
                },
            })
        }
    },
    /**
     * 断开连接
     */
    endConnect: function (deviceId) {
        if (this.globalData.BluetoothState) {
            wx.closeBLEConnection({
                deviceId: deviceId,
                success: function (res) {
                    console.log("Disconnected");
                },
            })
        }
    },
})