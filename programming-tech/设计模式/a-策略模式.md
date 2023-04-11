---
title: 策略模式
sidebar_position: 10
---

## 策略模式
策略模式的目的就是将算法的使用与算法的实现分离开，一个策略模式的程序至少由两部分组成。

第一个部分是策略类，策略类封装了具体的算法，并负责具体的计算过程。

第二个部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。


### 场景：表单检验
```js
/*Validator类的实现*/
var Validator = function(){
    this.cache = [];
}
Validator.prototype.add =function(dom,rule,errorMsg){
    var ary = rule.split(':');
    this.cache.push(function(){
        var strategy =ary.shift();
        ary.unshift(dom.value);
        ary.push(errorMsg);
        return strategies[strategy].apply(dom,ary);
    });
};

Validator.prototype.start = function(){
    for(var i=0,validatorFunc;validatorFunc = this.cache[i++]){
        var msg=validatorFunc(); 
        if(msg){
            return msg;
        }
    }
}

/*定义strategy*/
var strategies = {
    isNonEmpty:function(value,errorMsg){
        if(value=''){
            return errorMsg;
        }
    },
    minLength:function(value,length,errorMsg){
        if(value.length<length){
            return errorMsg
        }
    },
    isMobile:function(value,errorMsg){
        if(!/^1[3|5|8][0-9]$/.test(value)){
            return errorMsg;
        }
    }
}

/*定义Context*/
var validataFunc = function(){
    var validator = new Validator();
    validator.add(registerForm.userName,'isNonEmpty','用户名不能为空’);
    validator.add(registerForm.password,'inLength:6',密码长度不能少于6位'')
    validator.add(registerForm.phoneNumber,'isMobile','手机号码格式不正确’);

    var errorMsg = validator.start();
    return errorMsg;
}

var registerForm = document.getElementById("registerForm");
registerForm.onsubmit = function(){
    varerrorMsg = validataFunc(); 
    if(errorMsg){
        alert(errorMsg);
        return false;
    }
}
```
