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
  (function(window){
    window.AUTH=auth
  })(window)