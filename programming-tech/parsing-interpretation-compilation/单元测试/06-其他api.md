## 重试测试
你可以选择重试失败的测试，最多可达一定次数。 此功能旨在处理资源无法轻松模拟/存根的端到端测试（功能测试/Selenium…）。 不建议使用此功能进行单元测试。

此功能会重新运行失败的测试及其相应的 beforeEach/afterEach 钩子，但不会重新运行 before/after 钩子。 this.retries() 对失败的钩子没有影响。

NOTE： 下面的示例是使用 Selenium webdriver（其中 覆盖全局 Mocha 钩子 代表 Promise 链）编写的。
```js
describe('retries', function () {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});
```

## 动态生成测试
鉴于 Mocha 使用函数表达式来定义套件和测试用例，动态生成测试非常简单。 不需要特殊的语法—— 普通的 JavaScript 可用于实现类似于 “parameterized” 测试的功能，你可能已经在其他框架中看到过这些功能。

举个例子:
```js
const assert = require('assert');

function add(args) {
  return args.reduce((prev, curr) => prev + curr, 0);
}

describe('add()', function () {
  const tests = [
    {args: [1, 2], expected: 3},
    {args: [1, 2, 3], expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(({args, expected}) => {
    it(`correctly adds ${args.length} args`, function () {
      const res = add(args);
      assert.strictEqual(res, expected);
    });
  });
});
```

上面的代码将生成一个具有三个规范的套件：
```bash
$ mocha

  add()
    ✓ correctly adds 2 args
    ✓ correctly adds 3 args
    ✓ correctly adds 4 args
```

在 .forEach 处理程序中添加的测试通常不能与编辑器插件很好地配合，尤其是对于 “右键运行” 功能。 参数化测试的另一种方法是使用闭包生成它们。 以下示例与上面的示例等效：
```js
describe('add()', function () {
  const testAdd = ({args, expected}) =>
    function () {
      const res = add(args);
      assert.strictEqual(res, expected);
    };

  it('correctly adds 2 args', testAdd({args: [1, 2], expected: 3}));
  it('correctly adds 3 args', testAdd({args: [1, 2, 3], expected: 6}));
  it('correctly adds 4 args', testAdd({args: [1, 2, 3, 4], expected: 10}));
});
```

