## 独家测试
注意： 钩子（如果存在）仍将被执行。

请注意不要将 .only() 的用法提交到版本控制中，除非你真的这么想！ 为此，可以在持续集成测试命令（或 git precommit hook 中）中使用选项 --forbid-only 运行 mocha。

排他性功能允许你通过将 .only() 附加到函数来仅运行指定的套件或测试用例。 这是仅执行特定套件的示例：
```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    // ...
  });
});
```

这是执行单个测试用例的示例：
```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // ...
    });

    it('should return the index when present', function () {
      // ...
    });
  });
});
```

在 v3.0.0 之前，.only() 使用字符串匹配来决定执行哪些测试； 这已不再是这种情况。 在 v3.0.0 或更高版本中，可以多次使用 .only() 来定义要运行的测试子集：
```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // this test will be run
    });

    it.only('should return the index when present', function () {
      // this test will also be run
    });

    it('should return -1 if called with a non-Array context', function () {
      // this test will not be run
    });
  });
});
```

你也可以选择多套件：
```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    it('should return -1 unless present', function () {
      // this test will be run
    });

    it('should return the index when present', function () {
      // this test will also be run
    });
  });

  describe.only('#concat()', function () {
    it('should return a new Array', function () {
      // this test will also be run
    });
  });

  describe('#slice()', function () {
    it('should return a new Array', function () {
      // this test will not be run
    });
  });
});
```

但测试优先：
```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // this test will be run
    });

    it('should return the index when present', function () {
      // this test will not be run
    });
  });
});
```

