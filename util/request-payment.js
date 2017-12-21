const sha256 = require('./sha256').sha256
const leftPad = require('./left-pad')
let sessionKeyUrl, paymentUrl
const pro = {
  host: 'showmoney.cn',
  getSessionKeyUrl () {
    return `https://${this.host}/scanpay/fixed/mpauth`
  },
  getPaymentUrl () {
    return `https://${this.host}/scanpay/unified`
  }
}
const test = {
  host: 'qrcode.ipay.so',
  getSessionKeyUrl() {
    return `https://${this.host}/scanpay/fixed/mpauth`
  },
  getPaymentUrl() {
    return `https://${this.host}/scanpay/unified`
  }
}
function produceSign(params, key, debug) {
  const result = Object.keys(params).sort().map((key) => {
    return `${key}=${params[key]}`
  }).join('&') + `${key}`
  if (debug) {
    console.log(result)
  }
  const sign = sha256(result)
  return sign
}
function produceOrderNum(merchantId) {
  const today = new Date()
  const YEAR = today.getFullYear().toString().slice(2)
  const MONTH = today.getMonth() + 1
  const DATE = today.getDate()
  let orderNum = `${merchantId}${YEAR}${MONTH}${DATE}`
  const length = 32 - orderNum.length
  const randomNum = Math.random().toString().substr(2, length)
  return orderNum + randomNum
}

function isNumber(value) {
  if (typeof value === 'number') {
    return true
  }
  if (!isNaN(value)) {
    return true
  }
  return false
}

function requestPayment({ subappid, mchntid, inscd, key, backUrl, ...rest }, txamt, callback, debug) {
  // 判断当前环境
  if (rest.env == 'test') {
    sessionKeyUrl = test.getSessionKeyUrl()
    paymentUrl = test.getPaymentUrl()
  } else {
    sessionKeyUrl = pro.getSessionKeyUrl()
    paymentUrl = pro.getPaymentUrl()
  }
  delete rest.env
  // 回调
  const noop = function () {}
  const success = (callback && callback.succuss) || noop
  const fail = (callback && callback.fail) || noop
  const complete = (callback && callback.complete) || noop
  if (!subappid) throw new Error('subappid不存在!')
  if (!mchntid) throw new Error('mchntid不存在!')
  if (!inscd) throw new Error('inscd不存在!')
  if (!key) throw new Error('key不存在!')
  if (!txamt) throw new Error('请输入支付金额')
  subappid = subappid.trim()
  mchntid = mchntid.trim()
  inscd = inscd.trim()
  key = key.trim()
  backUrl = backUrl.trim()
  // 对rest过滤空字符
  for (let key in rest) {
    if (!rest[key]) {
      delete rest[key]
    } else {
      rest[key] = rest[key].trim()
    }
  }
  // txamt: 支付金额，请保留2位小数，单位-元，货币-人民币;
  txamt = Number(txamt)
  if (isNumber(txamt)) {
    txamt = leftPad(txamt.toFixed(2).replace('.', ''), 12, '0')
  } else {
    throw new Error('请保证输入的金额格式正确!')
  }
  const params1 = {
    txndir: 'Q',
    busicd: 'WXAU',
    chcd: 'WXP',
    version: '2.3',
    signType: 'SHA256'
  }
  const params2 = {
    txndir: 'Q',
    busicd: 'WXMP',
    chcd: 'WXP',
    version: '2.3',
    signType: 'SHA256',
    charset: 'utf-8',
  }
  
  wx.login({
    success: function (data) {
      const jsCode = data.code
      Object.assign(params1, { subappid, mchntid, inscd, jsCode })
      const sign1 = produceSign(params1, key, debug)
      let reqData = Object.assign(params1, { sign: sign1 })
      wx.request({
        url: sessionKeyUrl,
        method: 'POST',
        data: reqData,
        success: function (res) {
          const data = res.data
          const sessionKey = data.sessionKey
          if (sessionKey) {
            Object.assign(params2, { subappid, mchntid, inscd, sessionKey, backUrl, txamt, orderNum: produceOrderNum(mchntid) }, rest || {})
            const sign2 = produceSign(params2, key, debug)
            reqData = Object.assign(params2, { sign: sign2 })
            wx.request({
              url: paymentUrl,
              method: 'POST',
              data: reqData,
              success: function (res) {
                const data = res.data
                if (data.respcd == '09') {
                  wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.mpSignType,
                    paySign: data.mpSign,
                    success,
                    fail,
                    complete
                  })
                } else {
                  fail({ errMsg: data.errorDetail})
                  complete()
                  throw new Error(data.errorDetail)
                }
              }
            })
          } else {
            fail({ errMsg: '获取sessionKey失败: ' + data.errorDetail})
            complete()
            throw new Error('获取sessionKey失败: ' + data.errorDetail)
          }
        },
        fail: function (err) {
          fail(err)
          complete()
          console.log('wx.login 接口调用失败，将无法正常使用支付服务', err)
        }
      })
    }
  })
}

module.exports = requestPayment