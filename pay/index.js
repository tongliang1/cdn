//支付
/**
 * @param {*} payReturnStr (appId,timeStamp,nonceStr,package,paySign)
 * @param {wx,zfb} third 平台
 */
function wxPay(payReturnStr){
    function onBridgeReady() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: payReturnStr.appId, //公众号名称，由商户传入
            timeStamp: payReturnStr.timeStamp, //时间戳，自1970年以来的秒数
            nonceStr: payReturnStr.nonceStr, //随机串
            package: payReturnStr.package,
            signType: 'MD5', //微信签名方式：
            paySign: payReturnStr.paySign //微信签名
          },
          function(res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              resolve()
            }
          }
        )
      }
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            onBridgeReady,
            false
          )
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
}
function zfbPay(payReturnStr){
    const div = document.createElement('div') // 创建div
    div.innerHTML = payReturnStr // 将返回的form 放入div
    document.body.appendChild(div)
    document.forms[0].submit()
}
function Pay(payReturnStr,third){
    if(third=='wx'){
      wxPay(payReturnStr)
    }else{
      zfbPay(payReturnStr)
    }
}
export default Pay
// (function(window){
//   window.h5Pay=Pay
// })(window)
