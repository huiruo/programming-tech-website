## 参考
[](https://remix-ide.readthedocs.io/zh-cn/latest/testing_using_Chai_&_Mocha.html)

* beforeEach() - 在每次测试之前运行
* beforeAll() - 在所有测试之前运行
* afterEach() - 在每次测试之后运行
* afterAll() - 在所有测试之后运行

### Remix支持使用断言库 Chai 和测试框架Mocha在JavaScript中对您的文件进行测试。
* Chai是一个用于Node.js和浏览器的BDD / TDD断言库，可以与任何JavaScript测试框架愉快地配对使用。
* Mocha是一个功能丰富的JavaScript测试框架，在Node.js和浏览器上运行，使异步测试变得简单而有趣。

### 编写测试
在您的项目工作区创建一个 js 文件。最好将其创建在 scripts 文件夹中。我们给它命名为`sample.test.js`。
```js
const { expect } = require("chai");

describe("Sample", function () {
  it("Sample tests with mocha and chai", async function () {
    var foo = 'bar'
    var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
    expect(foo).to.be.a('string');
    expect(foo).to.equal('bar');
    expect(foo).to.have.lengthOf(3);
    expect(beverages).to.have.property('tea').with.lengthOf(3);
  });
});
```

### 测试一个合约
同样，可以编写单元测试来测试智能合约的功能。一个测试默认的`1_Storage.sol`合约的示例可能如下：
```js
const { expect } = require("chai");

describe("Storage", function () {
  it("test initial value", async function () {
    // Make sure contract is compiled and artifacts are generated
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    let storage = await Storage.deploy();
    console.log('storage contract Address: ' + storage.address);
    await storage.deployed()
    expect((await storage.retrieve()).toNumber()).to.equal(0);
  });

  it("test updating and retrieving updated value", async function () {
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    let storage = await Storage.deploy();
    await storage.deployed()
    const setValue = await storage.store(56);
    await setValue.wait();
    expect((await storage.retrieve()).toNumber()).to.equal(56);
  });

  it("fail test updating and retrieving updated value", async function () {
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'contracts/artifacts/Storage.json'))
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    let Storage = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    let storage = await Storage.deploy();
    await storage.deployed()
    const setValue = await storage.store(56);
    await setValue.wait();
    expect((await storage.retrieve()).toNumber()).to.equal(55);
  });
});
```
