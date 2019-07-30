// 设置一个全局对象
const globalData: object = {}

export const setGlobalData = (key: string, value: any): void => {
  globalData[key] = value
}

export const getGlobalData = (key: string): any => {
  return globalData[key]
}

export const getSingers = (songInfo: any): string => {
  let singers: string = ''
  if (songInfo) {
    songInfo.ar.map((singer, index) => {
      if (index === songInfo.ar.length - 1) {
        singers += singer.name
      } else {
        singers += `${singer.name}/`
      }
    })
  }
  return singers ? singers : '未知'
}

export const formatDate = (value: string | number, fmt: string = 'yyyy-MM-dd HH:mm:ss'): string => {
  const time = new Date(value);
    const obj: object = {
      'M+': time.getMonth() + 1,  // 月
      'd+': time.getDate(), // 日
      'h+': time.getHours() % 12 == 0 ? 12 : time.getHours() % 12,  // 12小时制
      'H+': time.getHours(),  // 24小时制
      'm+': time.getMinutes(),  // 分
      's+': time.getSeconds(),  // 秒
      'S': time.getMilliseconds(),  // 毫秒
      'q+': Math.floor((time.getMonth() + 3) / 3)  // 季度
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(var k in obj){
      if(new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (obj[k]) : (('00' + obj[k]).substr(('' + obj[k]).length)));
      }
    }
    return fmt
}

export const logError = (name: string, action: string, info?: any): void => {
  if (!info) {
    info = 'empty'
  }
  let device = ''
  try {
    let deviceInfo = wx.getSystemInfoSync()
    device = JSON.stringify(deviceInfo)
  } catch (err) {
    console.error('not support getSystemInfoSync api', err.message)
  }
  let time = formatDate(new Date().getTime())
  console.error(time, name, action, info, device)
  // if (typeof action !== 'object') {
  // fundebug.notify(name, action, info)
  // }
  // fundebug.notifyError(info, { name, action, device, time })
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
}
