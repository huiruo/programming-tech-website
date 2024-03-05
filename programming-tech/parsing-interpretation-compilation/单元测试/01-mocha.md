## 参考
[mocha官网](https://mocha.nodejs.cn/)

## hello world
在你的编辑器中：
```js
var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

返回终端：
```bash
$ ./node_modules/mocha/bin/mocha

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (9ms)
```

在 package.json 中设置测试脚本：
```js
"scripts": {
  "test": "mocha"
}
```

```js
$ npm test
```

## 断言
Mocha 允许你使用任何你想要的断言库。 在上面的示例中，我们使用 Node.js 的内置 assert 模块 – 但一般来说，如果它抛出 Error，它就会起作用！ 这意味着你可以使用以下库：
* should.js - 这些文档中显示的 BDD 风格
* expect.js - expect() 风格断言
* chai - expect()、assert() 和 should 式断言
* better-assert - C 风格自记录 assert()
* unexpected - “可扩展的 BDD 断言工具包”

## 异步代码
通过将参数（通常名为 done）添加到 it() 到测试回调中，Mocha 将知道它应该等待调用此函数来完成测试。 此回调接受 Error 实例（或其子类）或虚假值； 其他任何内容都是无效使用并引发错误（通常会导致测试失败）。
```js
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      var user = new User('Luna');
      user.save(function (err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
```

或者，直接使用 done() 回调（它将处理错误参数，如果存在）：
```js
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});
```

## 与 PROMISE一起工作
或者，你可以返回 Promise，而不是使用 done() 回调。 如果你正在测试的 API 返回 promise 而不是采用回调，这非常有用：
```js
beforeEach(function () {
  return db.clear().then(function () {
    return db.save([tobi, loki, jane]);
  });
});

describe('#find()', function () {
  it('respond with matching records', function () {
    return db.find({type: 'User'}).should.eventually.have.length(3);
  });
});
```

## 使用异步/等待
如果你的 JS 环境支持 异步/等待，你还可以像这样编写异步测试：
```js
beforeEach(async function () {
  await db.clear();
  await db.save([tobi, loki, jane]);
});

describe('#find()', function () {
  it('responds with matching records', async function () {
    const users = await db.find({type: 'User'});
    users.should.have.length(3);
  });
});
```

## 同步代码
测试同步代码时，省略回调，Mocha 将自动继续下一个测试。
```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      [1, 2, 3].indexOf(5).should.equal(-1);
      [1, 2, 3].indexOf(0).should.equal(-1);
    });
  });
});
```

## 箭头函数
不鼓励将 箭头函数（又名 “lambdas”）传递给 Mocha。 Lambda 词法绑定 this，无法访问 Mocha 上下文。 例如，以下代码将失败：

如果你不需要使用 Mocha 的上下文，那么 lambda 应该可以工作。 请注意，如果最终需要，使用 lambda 进行重构会更加困难！
```js
describe('my suite', () => {
  it('my test', () => {
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(1000);
    assert.ok(true);
  });
});
```
