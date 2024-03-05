## 该特性与`.only()`相反,通过附加`.skip()`
你可以告诉 Mocha 忽略测试用例。 任何跳过的内容都将标记为 pending，并按此报告。 以下是跳过单个测试的示例：
```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.skip('should return -1 unless present', function () {
      // this test will not be run
    });

    it('should return the index when present', function () {
      // this test will be run
    });
  });
});
```

你还可以将 .skip() 放在整个套件上。 这相当于将 .skip() 附加到套件中的所有测试中。 套件中的钩子也被跳过。
```js
describe('Array', function () {
  describe.skip('#indexOf()', function () {
    it('should return -1 unless present', function () {
      // this test will not be run
    });
  });
});
```

注意： 跳过的套件中放置在钩子或测试之外的代码仍然会执行，因为 mocha 仍然会调用套件函数来构建套件结构以进行可视化。
> 最佳实践： 使用 .skip() 而不是注释掉测试。


## 你也可以使用 this.skip() 在运行时跳过。 
如果测试需要事先无法检测到的环境或配置，则可以适当跳过运行时。 例如：
```js
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    this.skip();
  }
});
```
