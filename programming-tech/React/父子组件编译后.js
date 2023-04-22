function Test() {
  console.log('test-render');

  var _React$useState = React.useState('改变我'),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    data = _React$useState2[0],
    setData = _React$useState2[1];

  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    showDiv = _React$useState4[0],
    setShowDiv = _React$useState4[1];

  var _React$useState5 = React.useState({ test: 1, test2: 2 }),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    obj = _React$useState6[0],
    setObj = _React$useState6[1];

  React.useEffect(function () {
    console.log('=副作用-useEffect-->运行');
    return function () {
      console.log('useEffect销毁时触发的回调');
    };
  }, []);

  React.useLayoutEffect(function () {
    console.log('=副作用-useLayoutEffect-->运行');
  }, []);

  var onClickText = function onClickText() {
    console.log('=useState=onClick=例5-没有导致state的值发生变化的setState是否会导致重渲染?');
    setData('努力');
  };

  var changeSubData = function changeSubData() {
    console.log('changeSubData');
    obj.test1 = 5;
    // setObj({ ...obj, test1: 3 })
  };

  var onClickText2 = function onClickText2() {
    console.log('=useState=onClick:', data);
  };

  return React.createElement(
    'div',
    { id: 'div1', className: 'c1' },
    React.createElement(
      'button',
      { onClick: onClickText, className: 'btn' },
      'Hello world,Click me'
    ),
    React.createElement(
      'button',
      { onClick: changeSubData, className: 'btn' },
      'changeSubData'
    ),
    React.createElement(
      'span',
      null,
      data
    ),
    showDiv && React.createElement(
      'div',
      null,
      '\u88AB\u4F60\u53D1\u73B0\u4E86'
    ),
    React.createElement(
      'div',
      { id: 'div2', className: 'c2' },
      React.createElement(
        'p',
        null,
        '\u6D4B\u8BD5\u5B50\u8282\u70B9'
      )
    ),
    React.createElement(Sub, { obj: obj })
  );
}