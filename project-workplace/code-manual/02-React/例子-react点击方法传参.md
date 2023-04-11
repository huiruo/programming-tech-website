## 方案一：之前的bind绑定this,基本废弃
```js
import React, { Component } from "react";
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { click: false, value: "" };
  }
 
  handleClick(e, q) {
    console.log(e, q);
    this.setState({ click: !this.state.click, value: e });
  }
 
  render() {
    return (
      <div>
        <button type="button" onClick={this.handleClick.bind(this, 11, 22)}>
          {this.state.click ? "点击" : "已点击"}
        </button>
        <h4>{this.state.value}</h4>
      </div>
    );
  }
}
export default App;
```

## 方案二：ES6箭头函数绑定this
```js
import React, { Component } from "react";
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { click: false, value: "" };
  }
 
  handleClick(e, q) {
    console.log(e, q);
    this.setState({ click: !this.state.click, value: e });
  }
 
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.handleClick(11, 22)}>
          {this.state.click ? "点击" : "已点击"}
        </button>
        <h4>{this.state.value}</h4>
      </div>
    );
  }
}
 
export default App;
```
