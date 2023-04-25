export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


export function getTime(data) {
  if (!data) {
      return 0;
  } else if (data < 60) {
      return `${Math.round(data)} 秒`;
  } else if (data < 60 * 60) {
      return `${Math.round(data / 60)} 分`;
  } else if (data < 60 * 60 * 24) {
      return `${Math.round(data / (60 * 60))} 时`;
  } else if (data < 60 * 60 * 24 * 7) {
      return `${Math.round(data / (60 * 60 * 24))} 天`;
  } else {
      return `${Math.round(data / (60 * 60 * 60 * 7))} 周`;
  }
}

export function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let lets = query.split('&');
  for (let i = 0; i < lets.length; i++) {
      let pair = lets[i].split('=');
      if (pair[0] == variable) {
          return pair[1];
      }
  }
  return false;
}

//X轴24小时制(用于echarts图表x轴显示)
// startTime采用指定格式，如2021-12-08 00:00:00
export function xCoordinateFor24Hours(startTime) {
  let mytime24 = new Array();
  let i = 0;

  let time_millisecond = new Date(startTime).getTime();

  for (; i < 25; i++) {
      mytime24.push([time_millisecond, '']);
      time_millisecond = time_millisecond + 60 * 60 * 1000;
  }
  return mytime24;
}

//X轴采用一周形式表示(用于echarts图表x轴显示)
export function xCoordinateForOneWeek(startTime) {
  let mytime24 = new Array();
  let i = 0;

  let time_millisecond = new Date(startTime).getTime();

  for (; i < 8; i++) {
      mytime24.push([time_millisecond, '']);
      time_millisecond = time_millisecond + 24 * 60 * 60 * 1000;
  }
  return mytime24;
}

//X轴采用一个月形式表示(用于echarts图表x轴显示)
export function xCoordinateForOneMonth(startTime) {
  startTime = startTime.substring(0,8) + '01 00:00:00'
  let mytime24 = new Array();
  let i = 0;

  const startDate = new Date(startTime);
  let time_millisecond = startDate.getTime();

  const totalDaysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

  for (; i <= totalDaysInMonth; i++) {
      mytime24.push([time_millisecond, '']);
      time_millisecond = time_millisecond + 24 * 60 * 60 * 1000;
  }
  return mytime24;
}

//X轴24小时制(用于echarts图表x轴显示)
// 采用每一小时间隔，从其实时间到间隔时间
export function xCoordinateFor24Hours2(startTime, endTime) {
  let mytime24 = new Array();

  let time_millisecond = new Date(startTime).getTime();
  let till_time_millisecond = new Date(endTime).getTime();

  while (time_millisecond < till_time_millisecond) {
      mytime24.push([time_millisecond, '']);
      time_millisecond = time_millisecond + 60 * 60 * 1000;
  }
  console.log(mytime24);
  return mytime24;
}


