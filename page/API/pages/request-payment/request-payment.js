const requestPayment = require('../../../../util/request-payment')
const Zan = require('../../../common/index');

var app = getApp()
// params: APPID, mchntid(商户ID), inscd(代理机构号), key(商户在云收银的key)
Page(Object.assign({}, Zan.TopTips, {
  data: {
    txamt: '-'
  },
  onShow() {
    let txamt = app.globalData.txamt ? Number(app.globalData.txamt).toFixed(2) : '0.01'
    this.setData({
      txamt
    })
  },
  requestPayment: function () {
    if (this.data.loading) {
      return
    }
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    let globalCfg = app.globalData.paymentCfg
    Object.keys(globalCfg).forEach(key => {
      if (!globalCfg[key]) {
        delete globalCfg[key]
      }
    })
    let txamt = app.globalData.txamt || '0.01'
    let cfg = {
      subappid: 'wx128cafdde043a802',
      mchntid: '013102153990001',
      inscd: '10130001',
      key: 'ed4da89d03304b372012d1bc9410bc28',
      backUrl: 'https://www.baidu.com',
      // goodsList: JSON.stringify([{ goodsId: 'iphone6s16G', goodsName: '黄金iPhone', price: '528800', goodsNum: '1' }]),
      subject: '黄金AK47',
      env: 'test'
    }
    Object.assign(cfg, globalCfg, { subappid: 'wx128cafdde043a802' })
    console.log(cfg, globalCfg)
    try {
      requestPayment(cfg, txamt, {
        complete: () => {
          self.setData({
            loading: false
          })
        },
        fail(err) {
          console.log(err)
          if (err.errMsg) {
            const info = err.errMsg
            self.showZanTopTips(info);
          }
        }
      }, true)
    } catch (e) {
      console.log(e)
      self.showZanTopTips(e);
    }
  }
}))
