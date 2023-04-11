

```js
获取指定日期的时间戳：
moment('2020-07').startOf('day').format('x')
当前月：
moment().format('MM')
 
当前季度：
moment().quarter()
 
当前年：
moment().format("YYYY") 
moment().year(); // Number
 
上一年/下一年：
 1. 上一年 ： moment().add(-1,'Q').format("YYYY")
 2. 下一年 ： moment().add(1,'Q').format("YYYY")
 3.  上几年和下几年同理，做moment日期加减，月季度亦同理
 
上一季度/下一季度：
 1. 上一季度：moment().add(-1, 'Q').quarter()
 2. 下一季度：moment().add(1, 'Q').quarter()
 
上个月/下个月
 1. 上个月：momnet().add(-1,'M').format("MM")
 2. 下个月：moment().add(1,'M').format("MM")
 
年开始结束时间：
 1. moment().startOf('year')
 2. moment().endOf('year')
 
季度开始结束时间：
 
 1. 当前季度的开始结束时间：
  moment().startOf('quarter').format("YYYY-MM-DD")
  moment().endOf('quarter').format("YYYY-MM-DD")
 
 2. 指定年指定季度的开始结束时间：（某年某季度的开始结束时间）
 
  moment(moment().format("YYYY-02-        01")).startOf('quarter').format("YYYY-MM-DD")
  moment(moment().format("YYYY-02-01")).endOf('quarter').format("YYYY-MM-DD")
 
#当天0点的时间格式 ：
  moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') 
 
#当天0点的时间缀，以10位Unix时间戳输出(秒）：
  moment().startOf('day').format('X') 
 
#当天23点59分59秒的时间格式：
  moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')  
 
#当天23点59分59秒以13位Unix时间戳输出（毫秒）：
  moment().endOf('day').format('x')  
 
#2020-06-30当天0点的以13位Unix时间戳输出（毫秒）：
  moment('2020-06-30').startOf('day').format('x')  
 
#2020-06-30当天24点的以13位Unix时间戳输出（毫秒）：
  moment('2020-06-30').endOf('day').format('x') 
# 获取今天0时0分0秒
moment().startOf('day')
 
# 获取本周第一天(周日)0时0分0秒
moment().startOf('week')
 
# 获取本周周一0时0分0秒
moment().startOf('isoWeek')
 
# 获取当前月第一天0时0分0秒
moment().startOf('month')
 
# 获取指定日期的0时0分0秒
moment('2019-10-20').startOf('day')
 
# 获取今天23时59分59秒
moment().endOf('day')
 
# 获取本周最后一天(周六)23时59分59秒
moment().endOf('week')
 
# 获取本周周日23时59分59秒
moment().endOf('isoWeek')
 
# 获取当前月最后一天23时59分59秒
moment().endOf('month')
 
# 获取当月第一天是星期几（用于设置星期几，其中星期日为 0、星期六为 6）
moment().startOf('month').day()
 
获取前n天 / 后n天
moment().add(7, 'days');
moment().subtract(7, 'days')
 
比较两个时间的大小
 
# 第二个参数用于确定精度，且不仅仅是要检查的单个值，因此使用 day 将会检查年份、月份、日期。
 
moment('2010-10-31').isBefore('2010-12-31', 'day');
# true
 
moment('2010-10-20').isBefore('2010-12-31', 'year');
# false
 
moment('2010-10-20').isAfter('2009-12-31', 'year'); 
# true
 
moment('2010-10-20').isSame('2009-12-31', 'year'); 
# 判断两个时间是否相等
 
# 需要注意的是， isBefore与isAfter 都是开区间，如果想使用闭区间，应使用
isSameOrBefore
 
两个时间的相差几天
moment([2008, 2, 27]).diff([2007, 0, 28], 'day');
# 424
 
是否是闰年
 
moment().isLeapYear();
# true
 
moment([2001]).isLeapYear() 
# false
 
获取 月份和星期 枚举列表
 
moment.months()
 
# ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
 
moment.monthsShort()
# ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
 
moment.weekdays()
# ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
 
moment.weekdaysMin()
# ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
 
格式化
moment().format();
# 2020-03-14T19:14:05+08:00
 
moment().format('YYYY-MM-DD HH:mm:ss');
# 2020-03-14 19:23:29
 
//获取当前时间
var now = moment().toDate();//Mon Jul 06 2020 13:50:51 GMT+0800 (中国标准时间)
console.log(now)
 
//格式化当前时间
now = moment().format('YYYY-MM-DD');//2020-07-06
console.log(now);
 
//获取这个月初时间
let startMonth = moment().startOf('month').toDate();
console.log(startMonth);
 
//获取今天开始的时间，
let dayOfStart = moment().startOf('day').toDate();
console.log(dayOfStart);
 
//获取今天结束的时间
let dayOfEnd = moment().endOf('day').toDate();
console.log(dayOfEnd);
 
 
//获取＋n小时
let lateHour = moment().add(2,'hour').toDate();
console.log(lateHour);
 
//获取＋n小时
console.log('//获取-n小时')
let beforeHour = moment().subtract(2,'hour').toDate();
console.log(beforeHour);
 
 
//获取＋n天
let lateDay = moment().add(+5,'day').toDate();
console.log(lateDay);
 
//获取-n天
let beforeDay = moment().add(-5,'day').toDate();
console.log(beforeDay);
//也可以表示为
beforeDay = moment().subtract(5,'day').toDate();
console.log(beforeDay);
 
console.log('//获取＋n月')
let lateMonth = moment().add(2,'month').toDate();
console.log(lateHour);
 
//获取＋n月
let beforeMonth = moment().subtract(2,'month').toDate();
console.log(lateHour);
 
 
 
//获取星期
let week = moment().format('dddd');
console.log(week);
 
//获取到现在的年限 如果不满一年显示出具体几个月
let years = moment('2020-12-31').fromNow();
前三个月（自然月）：
 
moment().month(moment().month() - 3).startOf('month')
 
moment().month(moment().month() - 1).endOf('month')
 
上月：
 
moment().month(moment().month() - 1).startOf('month')
 
moment().month(moment().month() - 1).endOf('month')
 
本月：
 
[moment().startOf('month'), moment().endOf('month')]
 
7天：
 
[moment().subtract(7,'day'), moment()]
 
获取月份天数：
 
moment().daysInMonth()
 
判断日期大小
 
moment('2010-10-20').isAfter('2010-10-19'); // true
```