// page/API/pages/request-payment/payment-config/payment-config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    optionControls: [],
    params: {

    },
    items: [
      { name: 'currency', value: 'currency' },
      { name: 'attach', value: 'attach'},
      { name: 'timeStart', value: 'timeStart' },
      { name: 'timeExpire', value: 'timeExpire' },
      { name: 'subject', value: 'subject' },
      { name: 'outOrderNum', value: 'outOrderNum' },
      { name: 'paylimit', value: 'paylimit' },
      { name: 'terminalid', value: 'terminalid' }
    ]
  },
  bindToParamsRequired(e) {
    if (e.target.id == 'appId') {
      this.setData({
        'params.appId': e.detail.value
      })
    }
    if (e.target.id == 'mchntid') {
      this.setData({
        'params.mchntid': e.detail.value
      })
    }
    if (e.target.id == 'inscd') {
      this.setData({
        'params.inscd': e.detail.value
      })
    }
    if (e.target.id == 'key') {
      this.setData({
        'params.key': e.detail.value
      })
    }
    if (e.target.id == 'backUrl') {
      this.setData({
        'params.backUrl': e.detail.value
      })
    }
    if (e.target.id == 'txamt') {
      this.setData({
        'params.txamt': e.detail.value
      })
    }
    // 非必传参数...
    if (e.target.id == 'currency') {
      this.setData({
        'params.currency': e.detail.value
      })
    }
    if (e.target.id == 'attach') {
      this.setData({
        'params.attach': e.detail.value
      })
    }
    if (e.target.id == 'timeStart') {
      this.setData({
        'params.timeStart': e.detail.value
      })
    }
    if (e.target.id == 'timeExpire') {
      this.setData({
        'params.timeExpire': e.detail.value
      })
    }
    if (e.target.id == 'subject') {
      this.setData({
        'params.subject': e.detail.value
      })
    }
    if (e.target.id == 'outOrderNum') {
      this.setData({
        'params.outOrderNum': e.detail.value
      })
    }
    if (e.target.id == 'paylimit') {
      this.setData({
        'params.paylimit': e.detail.value
      })
    }
    if (e.target.id == 'terminalid') {
      this.setData({
        'params.terminalid': e.detail.value
      })
    }
  },
  checkboxChange(e) {
    this.setData({
      optionControls: e.detail.value
    })
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  console.log('hide page...')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  console.log('unload page...')
    const app = getApp()
    app.globalData.paymentCfg = JSON.parse(JSON.stringify(this.data.params))
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})