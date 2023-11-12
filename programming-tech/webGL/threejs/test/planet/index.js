THREE.OrbitControls = function (object, domElement) {
  this.object = object;
  this.domElement = (domElement !== undefined) ? domElement : document;
  // API
  // 设置为false以禁用此控件
  this.enabled = true;
  // "target"设置焦点位置，即控件围绕的位置
  //和它相对于平移的位置。
  this.target = new THREE.Vector3();
  // center是旧的，已弃用;用“target”代替
  this.center = this.target;
  //该选项实际启用了缩放;左为“缩放”
  //向后兼容
  this.noZoom = false;
  this.zoomSpeed = 1.0;
  //限制你可以移动的距离(仅限透视相机)
  this.minDistance = 0;
  this.maxDistance = Infinity;
  //限制你可以放大和缩小的距离(仅适用于OrthographicCamera)
  this.minZoom = 0;
  this.maxZoom = Infinity;
  //设置为true禁用该控件
  this.noRotate = false;
  this.rotateSpeed = 1.0;
  //设置为true禁用该控件
  this.noPan = false;
  this.keyPanSpeed = 7.0;	//每次按方向键移动像素
  //设置为true自动围绕目标旋转
  this.autoRotate = false;
  this.autoRotateSpeed = 2.0; //当FPS为60时，每回合30秒
  //你可以垂直绕轨道运行多远，上下限。
  //从0到Math。π弧度。
  this.minPolarAngle = 0; // 弧度
  this.maxPolarAngle = Math.PI; // 弧度
  //你的水平轨道距离，上限和下限。
  //如果设置了，则必须是interval [- Math. interval]的子interval。π,数学。π)。
  this.minAzimuthAngle = - Infinity; // 弧度
  this.maxAzimuthAngle = Infinity; // 弧度
  //设置为true禁用键的使用
  this.noKeys = false;
  //四个方向键
  this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
  //鼠标按钮
  this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
  //内部
  var scope = this;
  var EPS = 0.000001;

  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();

  var panStart = new THREE.Vector2();
  var panEnd = new THREE.Vector2();
  var panDelta = new THREE.Vector2();
  var panOffset = new THREE.Vector3();

  var offset = new THREE.Vector3();

  var dollyStart = new THREE.Vector2();
  var dollyEnd = new THREE.Vector2();
  var dollyDelta = new THREE.Vector2();

  var theta;
  var phi;
  var phiDelta = 0;
  var thetaDelta = 0;
  var scale = 1;
  var pan = new THREE.Vector3();

  var lastPosition = new THREE.Vector3();
  var lastQuaternion = new THREE.Quaternion();

  var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

  var state = STATE.NONE;

  // 用于重置

  this.target0 = this.target.clone();
  this.position0 = this.object.position.clone();
  this.zoom0 = this.object.zoom;

  // 所以相机。向上是轨道轴

  var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
  var quatInverse = quat.clone().inverse();

  // 事件

  var changeEvent = { type: 'change' };
  var startEvent = { type: 'start' };
  var endEvent = { type: 'end' };

  this.rotateLeft = function (angle) {

    if (angle === undefined) {

      angle = getAutoRotationAngle();

    }

    thetaDelta -= angle;

  };

  this.rotateUp = function (angle) {

    if (angle === undefined) {

      angle = getAutoRotationAngle();

    }

    phiDelta -= angle;

  };

  // 在世界空间中通过距离向左移动
  this.panLeft = function (distance) {

    var te = this.object.matrix.elements;

    // 得到矩阵的X列
    panOffset.set(te[0], te[1], te[2]);
    panOffset.multiplyScalar(- distance);

    pan.add(panOffset);

  };

  //在世界空间中通过距离向上移动
  this.panUp = function (distance) {

    var te = this.object.matrix.elements;

    // 得到矩阵的Y列
    panOffset.set(te[4], te[5], te[6]);
    panOffset.multiplyScalar(distance);

    pan.add(panOffset);

  };
  //在像素空间中传递x,y的变化，
  // right和down为正数
  this.pan = function (deltaX, deltaY) {
    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
    if (scope.object instanceof THREE.PerspectiveCamera) {
      //点
      var position = scope.object.position;
      var offset = position.clone().sub(scope.target);
      var targetDistance = offset.length();

      // 一半的fov是中央到屏幕的顶部
      targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

      // 我们实际上不使用 screenWidth，因为透视相机固定为屏幕高度
      scope.panLeft(2 * deltaX * targetDistance / element.clientHeight);
      scope.panUp(2 * deltaY * targetDistance / element.clientHeight);

    } else if (scope.object instanceof THREE.OrthographicCamera) {

      // 拼字
      scope.panLeft(deltaX * (scope.object.right - scope.object.left) / element.clientWidth);
      scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight);

    } else {

      // 奥利戈日
      console.warn('奥利戈日');

    }

  };

  this.dollyIn = function (dollyScale) {

    if (dollyScale === undefined) {

      dollyScale = getZoomScale();

    }

    if (scope.object instanceof THREE.PerspectiveCamera) {

      scale /= dollyScale;

    } else if (scope.object instanceof THREE.OrthographicCamera) {

      scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
      scope.object.updateProjectionMatrix();
      scope.dispatchEvent(changeEvent);

    } else {

      console.warn('未知类型');

    }

  };

  this.dollyOut = function (dollyScale) {

    if (dollyScale === undefined) {

      dollyScale = getZoomScale();

    }

    if (scope.object instanceof THREE.PerspectiveCamera) {

      scale *= dollyScale;

    } else if (scope.object instanceof THREE.OrthographicCamera) {

      scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
      scope.object.updateProjectionMatrix();
      scope.dispatchEvent(changeEvent);

    } else {

      console.warn('未知类型');

    }

  };

  this.update = function () {

    var position = this.object.position;

    offset.copy(position).sub(this.target);

    // 将偏移量旋转到“y 轴向上”空间
    offset.applyQuaternion(quat);

    // z 轴绕 y 轴的角度

    theta = Math.atan2(offset.x, offset.z);

    // 与 y 轴的角度

    phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

    if (this.autoRotate && state === STATE.NONE) {

      this.rotateLeft(getAutoRotationAngle());

    }

    theta += thetaDelta;
    phi += phiDelta;

    // 将 theta 限制在所需的限制之间
    theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));

    // 将半径限制在所需限制之间
    phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

    // 将半径限制在所需限制之间
    phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

    var radius = offset.length() * scale;

    // 将半径限制在所需限制之间
    radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

    // 将目标移动到平移位置
    this.target.add(pan);

    offset.x = radius * Math.sin(phi) * Math.sin(theta);
    offset.y = radius * Math.cos(phi);
    offset.z = radius * Math.sin(phi) * Math.cos(theta);

    // 将偏移量旋转回“相机向上矢量向上”空间
    offset.applyQuaternion(quatInverse);

    position.copy(this.target).add(offset);

    this.object.lookAt(this.target);

    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;
    pan.set(0, 0, 0);

    // 更新条件是：
    // 最小值（相机位移，相机旋转弧度）^2 > EPS
    // 使用小角度近似 cos(x/2) = 1 -x^2 /8

    if (lastPosition.distanceToSquared(this.object.position) > EPS
      || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) {

      this.dispatchEvent(changeEvent);

      lastPosition.copy(this.object.position);
      lastQuaternion.copy(this.object.quaternion);

    }

  };


  this.reset = function () {

    state = STATE.NONE;

    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    this.object.zoom = this.zoom0;

    this.object.updateProjectionMatrix();
    this.dispatchEvent(changeEvent);

    this.update();

  };

  this.getPolarAngle = function () {

    return phi;

  };

  this.getAzimuthalAngle = function () {

    return theta

  };

  function getAutoRotationAngle() {

    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

  }

  function getZoomScale() {

    return Math.pow(0.95, scope.zoomSpeed);

  }

  function onMouseDown(event) {

    if (scope.enabled === false) return;
    event.preventDefault();

    if (event.button === scope.mouseButtons.ORBIT) {
      if (scope.noRotate === true) return;

      state = STATE.ROTATE;

      rotateStart.set(event.clientX, event.clientY);

    } else if (event.button === scope.mouseButtons.ZOOM) {
      if (scope.noZoom === true) return;

      state = STATE.DOLLY;

      dollyStart.set(event.clientX, event.clientY);

    } else if (event.button === scope.mouseButtons.PAN) {
      if (scope.noPan === true) return;

      state = STATE.PAN;

      panStart.set(event.clientX, event.clientY);

    }

    if (state !== STATE.NONE) {
      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
      scope.dispatchEvent(startEvent);
    }

  }

  function onMouseMove(event) {

    if (scope.enabled === false) return;

    event.preventDefault();

    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

    if (state === STATE.ROTATE) {

      if (scope.noRotate === true) return;

      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart);

      // rotating across whole screen goes 360 degrees around
      scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

      // rotating up and down along whole screen attempts to go 360, but limited to 180
      scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

      rotateStart.copy(rotateEnd);

    } else if (state === STATE.DOLLY) {

      if (scope.noZoom === true) return;

      dollyEnd.set(event.clientX, event.clientY);
      dollyDelta.subVectors(dollyEnd, dollyStart);

      if (dollyDelta.y > 0) {

        scope.dollyIn();

      } else if (dollyDelta.y < 0) {

        scope.dollyOut();

      }

      dollyStart.copy(dollyEnd);

    } else if (state === STATE.PAN) {

      if (scope.noPan === true) return;

      panEnd.set(event.clientX, event.clientY);
      panDelta.subVectors(panEnd, panStart);

      scope.pan(panDelta.x, panDelta.y);

      panStart.copy(panEnd);

    }

    if (state !== STATE.NONE) scope.update();

  }

  function onMouseUp( /* event */) {

    if (scope.enabled === false) return;

    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    scope.dispatchEvent(endEvent);
    state = STATE.NONE;

  }

  function onMouseWheel(event) {

    if (scope.enabled === false || scope.noZoom === true || state !== STATE.NONE) return;

    event.preventDefault();
    event.stopPropagation();

    var delta = 0;
    //兼容处理
    if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9 

      delta = event.wheelDelta;

    } else if (event.detail !== undefined) { // 火狐

      delta = - event.detail;

    }

    if (delta > 0) {

      scope.dollyOut();

    } else if (delta < 0) {

      scope.dollyIn();

    }

    scope.update();
    scope.dispatchEvent(startEvent);
    scope.dispatchEvent(endEvent);

  }

  function onKeyDown(event) {

    if (scope.enabled === false || scope.noKeys === true || scope.noPan === true) return;

    switch (event.keyCode) {

      case scope.keys.UP:
        scope.pan(0, scope.keyPanSpeed);
        scope.update();
        break;

      case scope.keys.BOTTOM:
        scope.pan(0, - scope.keyPanSpeed);
        scope.update();
        break;

      case scope.keys.LEFT:
        scope.pan(scope.keyPanSpeed, 0);
        scope.update();
        break;

      case scope.keys.RIGHT:
        scope.pan(- scope.keyPanSpeed, 0);
        scope.update();
        break;

    }

  }

  function touchstart(event) {

    if (scope.enabled === false) return;

    switch (event.touches.length) {

      case 1:	// 单指触摸：旋转

        if (scope.noRotate === true) return;

        state = STATE.TOUCH_ROTATE;

        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
        break;

      case 2:	//  双指触摸：dolly

        if (scope.noZoom === true) return;

        state = STATE.TOUCH_DOLLY;

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyStart.set(0, distance);
        break;

      case 3: //三指触摸：平移

        if (scope.noPan === true) return;

        state = STATE.TOUCH_PAN;

        panStart.set(event.touches[0].pageX, event.touches[0].pageY);
        break;

      default:

        state = STATE.NONE;

    }

    if (state !== STATE.NONE) scope.dispatchEvent(startEvent);

  }

  function touchmove(event) {

    if (scope.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

    switch (event.touches.length) {

      case 1: // 单指触摸：旋转

        if (scope.noRotate === true) return;
        if (state !== STATE.TOUCH_ROTATE) return;

        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        rotateDelta.subVectors(rotateEnd, rotateStart);

        // 在整个屏幕上旋转 360 度
        scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        // 沿整个屏幕上下旋转尝试去 360，但限于 180
        scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

        rotateStart.copy(rotateEnd);

        scope.update();
        break;

      case 2: // 双指触摸

        if (scope.noZoom === true) return;
        if (state !== STATE.TOUCH_DOLLY) return;

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);

        dollyEnd.set(0, distance);
        dollyDelta.subVectors(dollyEnd, dollyStart);

        if (dollyDelta.y > 0) {

          scope.dollyOut();

        } else if (dollyDelta.y < 0) {

          scope.dollyIn();

        }

        dollyStart.copy(dollyEnd);

        scope.update();
        break;

      case 3: // 三指触摸：平移

        if (scope.noPan === true) return;
        if (state !== STATE.TOUCH_PAN) return;

        panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        panDelta.subVectors(panEnd, panStart);

        scope.pan(panDelta.x, panDelta.y);

        panStart.copy(panEnd);

        scope.update();
        break;

      default:

        state = STATE.NONE;

    }

  }

  function touchend( /* event */) {

    if (scope.enabled === false) return;

    scope.dispatchEvent(endEvent);
    state = STATE.NONE;

  }

  this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
  this.domElement.addEventListener('mousedown', onMouseDown, false);
  this.domElement.addEventListener('mousewheel', onMouseWheel, false);
  this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

  this.domElement.addEventListener('touchstart', touchstart, false);
  this.domElement.addEventListener('touchend', touchend, false);
  this.domElement.addEventListener('touchmove', touchmove, false);

  window.addEventListener('keydown', onKeyDown, false);

  // 在开始时强制更新
  this.update();

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;