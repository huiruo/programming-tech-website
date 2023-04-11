



```

var ishttps = 'https:' == document.location.protocol ? true: false;
   var url = window.location.host;
     if(ishttps){
       url = 'https://' + url;
}else{
      url = 'http://' + url;
}
  alert(url);//输出结果
```
