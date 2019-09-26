function param2Obj(url) {
    let search = []
    if (url.split('?')[1]) {
      search = url.split('?')[1].split('&')
    }
    var theRequest = new Object()
    for (var i = 0; i < search.length; i++) {
      var kye = search[i].split('=')[0]
      var value = search[i].split('=')[1]
      // 给对象赋值
      theRequest[kye] = value
    }
    return theRequest
  }
//各个平台的登陆 目前支持wx授权，支付宝授权
/**
 * @param {*} appid  授权的appid
 * @param {wx,zfb} third  是什么平台（wx还是zfb）
 */
function auth(appid,third) {
    let authUrl={
        wx:()=>{
            location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}
            &redirect_uri=${encodeURIComponent(location.href)
            }&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
        },
        zfb:()=>{
            location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${
            this.appid
            }&scope=auth_user&redirect_uri=${encodeURIComponent(
                location.href
            )}`;
        }
    }
    let authCode={
        wx:param2Obj(location.href).code,
        zfb:param2Obj(location.href)['auth_code']
    }
    if(!authCode[third]){
        authUrl[third]()
    }else{
        return Promise.resolve()
    }
  }
//初始化jssdk
/**
 * @param {true,false} debug 开关调试
 * @param {*} appId 
 * @param {*} timestamp 
 * @param {*} nonceStr 
 * @param {*} signature 
 * @param {any:Array} jsApiList 要使用的jsapi参数
 */
 function initjssdk(debug,appId,timestamp,nonceStr,signature,jsApiList){
    wx.config({
        debug: debug,
        appId: appId,
        timestamp:timestamp,
        nonceStr:nonceStr,
        signature: signature,
        jsApiList:jsApiList
    })
}
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

