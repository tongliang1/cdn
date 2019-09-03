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
(function(window){
    window.initJSSDK=initjssdk
})(window)

