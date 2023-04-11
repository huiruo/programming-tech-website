

## 获取当前月份
```
[
      moment(new Date())
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
];

-------获取当天结束
        time: [
          moment(new Date())
            .startOf("month")
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date().setHours(23, 59, 59, 0)).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        ],
```

## 获取七天之内
```
        selectedTime: [
          moment(new Date().setHours(0, 0, 0, 0))
            .subtract(7, "d")
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date().setHours(23, 59, 59, 0))
            .subtract(1, "d")
            .format("YYYY-MM-DD HH:mm:ss")
        ],
```
