// components/popup-window/popup-window.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        extClass: {
            type: String,
            value: ''
        },
        isShowPopup: {
            type: Boolean,
            value: false
        },
        popupTitle: {
            type: String,
            value: ''
        },
        inputItem: {
            type: Array,
            value: []
        },
        showItem: {
            type: Array,
            value: []
        },
        confirmText: {
            type: String,
            value: "Confirm"
        },
        cancelText: {
            type: String,
            value: "Cancel"
        },
        btnMode: {
            type: Array,
            value: [false, false]
        },
        isClearCache: {
            type: Boolean,
            value: false
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        inputValueArray: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onInput: function (event) {
            let that = this;
            const index = event.currentTarget.dataset.index;
            // console.log(index);
            const inputValue = event.detail.value;
            // console.log(inputValue);
            that.data.inputValueArray[index] = inputValue;
            that.triggerEvent('input', that.data.inputValueArray);
        },
        popupConfirm: function () {
            let that = this;
            let isClearCache = that.properties.isClearCache;
            that.triggerEvent('confirm', that.data.inputValueArray);
            if (isClearCache) {
                that.setData({
                    inputValueArray: [],
                });
            }
        },
        popupCancel: function () {
            let that = this;
            that.triggerEvent('cancel');
        },
    }
})