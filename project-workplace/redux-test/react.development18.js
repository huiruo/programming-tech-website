/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.React = {}));
}(this, (function (exports) {
  'use strict';

  var ReactVersion = '18.2.0';

  // ATTENTION
  // When adding new symbols to this file,
  // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
  // The Symbol used to tag the ReactElement-like types.
  var REACT_ELEMENT_TYPE = Symbol.for('react.element');
  var REACT_PORTAL_TYPE = Symbol.for('react.portal');
  var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
  var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
  var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
  var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
  var REACT_CONTEXT_TYPE = Symbol.for('react.context');
  var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
  var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
  var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
  var REACT_MEMO_TYPE = Symbol.for('react.memo');
  var REACT_LAZY_TYPE = Symbol.for('react.lazy');
  var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }

    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }

    return null;
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   */
  var ReactCurrentBatchConfig = {
    transition: null
  };

  var ReactCurrentActQueue = {
    current: null,
    // Used to reproduce behavior of `batchedUpdates` in legacy mode.
    isBatchingLegacy: false,
    didScheduleLegacyUpdate: false
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var ReactDebugCurrentFrame = {};
  var currentExtraStackFrame = null;
  function setExtraStackFrame(stack) {
    {
      currentExtraStackFrame = stack;
    }
  }

  {
    ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
      {
        currentExtraStackFrame = stack;
      }
    }; // Stack implementation injected by the current renderer.


    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = ''; // Add an extra top frame while an element is being validated

      if (currentExtraStackFrame) {
        stack += currentExtraStackFrame;
      } // Delegate to the injected renderer-specific implementation


      var impl = ReactDebugCurrentFrame.getCurrentStack;

      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  // -----------------------------------------------------------------------------

  var enableScopeAPI = false; // Experimental Create Event Handle API.
  var enableCacheElement = false;
  var enableTransitionTracing = false; // No known bugs, but needs performance testing

  var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
  // stuff. Intended to enable React core members to more easily debug scheduling
  // issues in DEV builds.

  var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentBatchConfig: ReactCurrentBatchConfig,
    ReactCurrentOwner: ReactCurrentOwner
  };

  {
    ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
    ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
  }

  // by calls to these methods by a Babel plugin.
  //
  // In PROD (or in packages without access to React internals),
  // they are left as they are instead.

  function warn(format) {
    {
      {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        printWarning('warn', format, args);
      }
    }
  }
  function error(format) {
    {
      {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        printWarning('error', format, args);
      }
    }
  }

  function printWarning(level, format, args) {
    // When changing this logic, you might want to also
    // update consoleWithStackDev.www.js as well.
    {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      } // eslint-disable-next-line react-internal/safe-string-coercion


      var argsWithFormat = args.map(function (item) {
        return String(item);
      }); // Careful: RN currently depends on this prefix

      argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      // eslint-disable-next-line react-internal/no-production-logging

      Function.prototype.apply.call(console[level], console, argsWithFormat);
    }
  }

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + "." + callerName;

      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }

      error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }
  /**
   * This is the abstract API for an update queue.
   */


  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var assign = Object.assign;

  var emptyObject = {};

  {
    Object.freeze(emptyObject);
  }
  /**
   * Base class helpers for the updating state of a component.
   */


  function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};
  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */

  Component.prototype.setState = function (partialState, callback) {
    if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null) {
      throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */


  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */


  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

          return undefined;
        }
      });
    };

    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() { }

  ComponentDummy.prototype = Component.prototype;
  /**
   * Convenience component with default shallow equality check for sCU.
   */

  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };

    {
      Object.seal(refObject);
    }

    return refObject;
  }

  var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

  function isArray(a) {
    return isArrayImpl(a);
  }

  /*
   * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
   * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
   *
   * The functions in this module will throw an easier-to-understand,
   * easier-to-debug exception with a clear errors message message explaining the
   * problem. (Instead of a confusing exception thrown inside the implementation
   * of the `value` object).
   */
  // $FlowFixMe only called in DEV, so void return is not possible.
  function typeName(value) {
    {
      // toStringTag is needed for namespaced types like Temporal.Instant
      var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
      var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
      return type;
    }
  } // $FlowFixMe only called in DEV, so void return is not possible.


  function willCoercionThrow(value) {
    {
      try {
        testStringCoercion(value);
        return false;
      } catch (e) {
        return true;
      }
    }
  }

  function testStringCoercion(value) {
    // If you ended up here by following an exception call stack, here's what's
    // happened: you supplied an object or symbol value to React (as a prop, key,
    // DOM attribute, CSS property, string ref, etc.) and when React tried to
    // coerce it to a string using `'' + value`, an exception was thrown.
    //
    // The most common types that will cause this exception are `Symbol` instances
    // and Temporal objects like `Temporal.Instant`. But any object that has a
    // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
    // exception. (Library authors do this to prevent users from using built-in
    // numeric operators like `+` or comparison operators like `>=` because custom
    // methods are needed to perform accurate arithmetic or comparison.)
    //
    // To fix the problem, coerce this object or symbol value to a string before
    // passing it to React. The most reliable way is usually `String(value)`.
    //
    // To find which value is throwing, check the browser or debugger console.
    // Before this exception was thrown, there should be `console.error` output
    // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
    // problem and how that type was used: key, atrribute, input value prop, etc.
    // In most cases, this console output also shows the component and its
    // ancestor components where the exception happened.
    //
    // eslint-disable-next-line react-internal/safe-string-coercion
    return '' + value;
  }
  function checkKeyStringCoercion(value) {
    {
      if (willCoercionThrow(value)) {
        error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var displayName = outerType.displayName;

    if (displayName) {
      return displayName;
    }

    var functionName = innerType.displayName || innerType.name || '';
    return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
  } // Keep in sync with react-reconciler/getComponentNameFromFiber


  function getContextName(type) {
    return type.displayName || 'Context';
  } // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


  function getComponentNameFromType(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    {
      if (typeof type.tag === 'number') {
        error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }

    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';

      case REACT_PORTAL_TYPE:
        return 'Portal';

      case REACT_PROFILER_TYPE:
        return 'Profiler';

      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';

      case REACT_SUSPENSE_TYPE:
        return 'Suspense';

      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';

    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          var context = type;
          return getContextName(context) + '.Consumer';

        case REACT_PROVIDER_TYPE:
          var provider = type;
          return getContextName(provider._context) + '.Provider';

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');

        case REACT_MEMO_TYPE:
          var outerName = type.displayName || null;

          if (outerName !== null) {
            return outerName;
          }

          return getComponentNameFromType(type.type) || 'Memo';

        case REACT_LAZY_TYPE:
          {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;

            try {
              return getComponentNameFromType(init(payload));
            } catch (x) {
              return null;
            }
          }

        // eslint-disable-next-line no-fallthrough
      }
    }

    return null;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

  {
    didWarnAboutStringRefs = {};
  }

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;

          error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
        }
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;

          error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
        }
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  function warnIfStringRefCannotBeAutoConverted(config) {
    {
      if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
        var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

        if (!didWarnAboutStringRefs[componentName]) {
          error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

          didWarnAboutStringRefs[componentName] = true;
        }
      }
    }
  }
  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, instanceof check
   * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @internal
   */


  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      }); // self and source are DEV only properties.

      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      }); // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.

      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });

      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };
  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */

  function createElement(type, config, children) {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;

        {
          warnIfStringRefCannotBeAutoConverted(config);
        }
      }

      if (hasValidKey(config)) {
        {
          checkKeyStringCoercion(config.key);
        }

        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }

      props.children = childArray;
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }

        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
    return newElement;
  }
  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */

  function cloneElement(element, config, children) {
    if (element === null || element === undefined) {
      throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
    }

    var propName; // Original props are copied

    var props = assign({}, element.props); // Reserved names are extracted

    var key = element.key;
    var ref = element.ref; // Self is preserved since the owner is preserved.

    var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.

    var source = element._source; // Owner will be preserved, unless ref is overridden

    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }

      if (hasValidKey(config)) {
        {
          checkKeyStringCoercion(config.key);
        }

        key = '' + config.key;
      } // Remaining properties override existing props


      var defaultProps;

      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }
  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */

  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';
  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = key.replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });
    return '$' + escapedString;
  }
  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */


  var didWarnAboutMaps = false;
  var userProvidedKeyEscapeRegex = /\/+/g;

  function escapeUserProvidedKey(text) {
    return text.replace(userProvidedKeyEscapeRegex, '$&/');
  }
  /**
   * Generate a key string that identifies a element within a set.
   *
   * @param {*} element A element that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */


  function getElementKey(element, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof element === 'object' && element !== null && element.key != null) {
      // Explicit key
      {
        checkKeyStringCoercion(element.key);
      }

      return escape('' + element.key);
    } // Implicit key determined by the index in the set


    return index.toString(36);
  }

  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;

        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }

      }
    }

    if (invokeCallback) {
      var _child = children;
      var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows:

      var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

      if (isArray(mappedChild)) {
        var escapedChildKey = '';

        if (childKey != null) {
          escapedChildKey = escapeUserProvidedKey(childKey) + '/';
        }

        mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
          return c;
        });
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          {
            // The `if` statement here prevents auto-disabling of the safe
            // coercion ESLint rule, so we must manually disable it below.
            // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
              checkKeyStringCoercion(mappedChild.key);
            }
          }

          mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
              mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                // eslint-disable-next-line react-internal/safe-string-coercion
                escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
        }

        array.push(mappedChild);
      }

      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree.

    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getElementKey(child, i);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else {
      var iteratorFn = getIteratorFn(children);

      if (typeof iteratorFn === 'function') {
        var iterableChildren = children;

        {
          // Warn about using Maps as children
          if (iteratorFn === iterableChildren.entries) {
            if (!didWarnAboutMaps) {
              warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
            }

            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(iterableChildren);
        var step;
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getElementKey(child, ii++);
          subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        }
      } else if (type === 'object') {
        // eslint-disable-next-line react-internal/safe-string-coercion
        var childrenString = String(children);
        throw new Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). " + 'If you meant to render a collection of children, use an array ' + 'instead.');
      }
    }

    return subtreeCount;
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }

    var result = [];
    var count = 0;
    mapIntoArray(children, result, '', '', function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */


  function countChildren(children) {
    var n = 0;
    mapChildren(children, function () {
      n++; // Don't return anything
    });
    return n;
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    mapChildren(children, function () {
      forEachFunc.apply(this, arguments); // Don't return anything.
    }, forEachContext);
  }
  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */


  function toArray(children) {
    return mapChildren(children, function (child) {
      return child;
    }) || [];
  }
  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */


  function onlyChild(children) {
    if (!isValidElement(children)) {
      throw new Error('React.Children.only expected to receive a single React element child.');
    }

    return children;
  }

  function createContext(defaultValue) {
    // TODO: Second argument used to be an optional `calculateChangedBits`
    // function. Warn to reserve for future use?
    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null,
      // Add these to use same hidden class in VM as ServerContext
      _defaultValue: null,
      _globalName: null
    };
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };
    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;
    var hasWarnedAboutDisplayNameOnConsumer = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context
      }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;

              error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }

            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;

              error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }

            return context.Consumer;
          }
        },
        displayName: {
          get: function () {
            return context.displayName;
          },
          set: function (displayName) {
            if (!hasWarnedAboutDisplayNameOnConsumer) {
              warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

              hasWarnedAboutDisplayNameOnConsumer = true;
            }
          }
        }
      }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  var Uninitialized = -1;
  var Pending = 0;
  var Resolved = 1;
  var Rejected = 2;

  function lazyInitializer(payload) {
    if (payload._status === Uninitialized) {
      var ctor = payload._result;
      var thenable = ctor(); // Transition to the next state.
      // This might throw either because it's missing or throws. If so, we treat it
      // as still uninitialized and try again next time. Which is the same as what
      // happens if the ctor or any wrappers processing the ctor throws. This might
      // end up fixing it if the resolution was a concurrency bug.

      thenable.then(function (moduleObject) {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          var resolved = payload;
          resolved._status = Resolved;
          resolved._result = moduleObject;
        }
      }, function (error) {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          var rejected = payload;
          rejected._status = Rejected;
          rejected._result = error;
        }
      });

      if (payload._status === Uninitialized) {
        // In case, we're still uninitialized, then we're waiting for the thenable
        // to resolve. Set it as pending in the meantime.
        var pending = payload;
        pending._status = Pending;
        pending._result = thenable;
      }
    }

    if (payload._status === Resolved) {
      var moduleObject = payload._result;

      {
        if (moduleObject === undefined) {
          error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
            'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
        }
      }

      {
        if (!('default' in moduleObject)) {
          error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
            'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
        }
      }

      return moduleObject.default;
    } else {
      throw payload._result;
    }
  }

  function lazy(ctor) {
    var payload = {
      // We use these fields to store the result.
      _status: Uninitialized,
      _result: ctor
    };
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _payload: payload,
      _init: lazyInitializer
    };

    {
      // In production, this would just set it on the object.
      var defaultProps;
      var propTypes; // $FlowFixMe

      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            defaultProps = newDefaultProps; // Match production behavior more closely:
            // $FlowFixMe

            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            propTypes = newPropTypes; // Match production behavior more closely:
            // $FlowFixMe

            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        if (render.length !== 0 && render.length !== 2) {
          error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
        }
      }

      if (render != null) {
        if (render.defaultProps != null || render.propTypes != null) {
          error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
        }
      }
    }

    var elementType = {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };

    {
      var ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name; // The inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // But it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // An anonymous function generally suggests a pattern like:
          //   React.forwardRef((props, ref) => {...});
          // This kind of inner function is not used elsewhere so the side effect is okay.

          if (!render.name && !render.displayName) {
            render.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  var REACT_MODULE_REFERENCE;

  {
    REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
  }

  function isValidElementType(type) {
    if (typeof type === 'string' || typeof type === 'function') {
      return true;
    } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


    if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
      return true;
    }

    if (typeof type === 'object' && type !== null) {
      if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
        return true;
      }
    }

    return false;
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }

    var elementType = {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };

    {
      var ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name; // The inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // But it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // An anonymous function generally suggests a pattern like:
          //   React.memo((props) => {...});
          // This kind of inner function is not used elsewhere so the side effect is okay.

          if (!type.name && !type.displayName) {
            type.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;

    {
      if (dispatcher === null) {
        error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
      }
    } // Will result in a null access error if accessed outside render phase. We
    // intentionally don't throw our own error because this is in a hot path.
    // Also helps ensure this is inlined.


    return dispatcher;
  }
  function useContext(Context) {
    var dispatcher = resolveDispatcher();

    {
      // TODO: add a more generic warning for invalid values.
      if (Context._context !== undefined) {
        var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.

        if (realContext.Consumer === Context) {
          error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }

    return dispatcher.useContext(Context);
  }
  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }
  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }
  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }
  function useEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, deps);
  }
  function useInsertionEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useInsertionEffect(create, deps);
  }
  function useLayoutEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, deps);
  }
  function useCallback(callback, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, deps);
  }
  function useMemo(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, deps);
  }
  function useImperativeHandle(ref, create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, deps);
  }
  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }
  function useTransition() {
    var dispatcher = resolveDispatcher();
    return dispatcher.useTransition();
  }
  function useDeferredValue(value) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDeferredValue(value);
  }
  function useId() {
    var dispatcher = resolveDispatcher();
    return dispatcher.useId();
  }
  function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  // Helpers to patch console.logs to avoid logging during side-effect free
  // replaying on render function. This currently only patches the object
  // lazily which won't cover if the log function was extracted eagerly.
  // We could also eagerly patch the method.
  var disabledDepth = 0;
  var prevLog;
  var prevInfo;
  var prevWarn;
  var prevError;
  var prevGroup;
  var prevGroupCollapsed;
  var prevGroupEnd;

  function disabledLog() { }

  disabledLog.__reactDisabledLog = true;
  function disableLogs() {
    {
      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

        var props = {
          configurable: true,
          enumerable: true,
          value: disabledLog,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      disabledDepth++;
    }
  }
  function reenableLogs() {
    {
      disabledDepth--;

      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        var props = {
          configurable: true,
          enumerable: true,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          log: assign({}, props, {
            value: prevLog
          }),
          info: assign({}, props, {
            value: prevInfo
          }),
          warn: assign({}, props, {
            value: prevWarn
          }),
          error: assign({}, props, {
            value: prevError
          }),
          group: assign({}, props, {
            value: prevGroup
          }),
          groupCollapsed: assign({}, props, {
            value: prevGroupCollapsed
          }),
          groupEnd: assign({}, props, {
            value: prevGroupEnd
          })
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      if (disabledDepth < 0) {
        error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
      }
    }
  }

  var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
  var prefix;
  function describeBuiltInComponentFrame(name, source, ownerFn) {
    {
      if (prefix === undefined) {
        // Extract the VM specific prefix used by each line.
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
        }
      } // We use the prefix to ensure our stacks line up with native stack frames.


      return '\n' + prefix + name;
    }
  }
  var reentry = false;
  var componentFrameCache;

  {
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
    componentFrameCache = new PossiblyWeakMap();
  }

  function describeNativeComponentFrame(fn, construct) {
    // If something asked for a stack inside a fake render, it should get ignored.
    if (!fn || reentry) {
      return '';
    }

    {
      var frame = componentFrameCache.get(fn);

      if (frame !== undefined) {
        return frame;
      }
    }

    var control;
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

    Error.prepareStackTrace = undefined;
    var previousDispatcher;

    {
      previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
      // for warnings.

      ReactCurrentDispatcher$1.current = null;
      disableLogs();
    }

    try {
      // This should throw.
      if (construct) {
        // Something should be setting the props in the constructor.
        var Fake = function () {
          throw Error();
        }; // $FlowFixMe


        Object.defineProperty(Fake.prototype, 'props', {
          set: function () {
            // We use a throwing setter instead of frozen or non-writable props
            // because that won't throw in a non-strict mode function.
            throw Error();
          }
        });

        if (typeof Reflect === 'object' && Reflect.construct) {
          // We construct a different control for this case to include any extra
          // frames added by the construct call.
          try {
            Reflect.construct(Fake, []);
          } catch (x) {
            control = x;
          }

          Reflect.construct(fn, [], Fake);
        } else {
          try {
            Fake.call();
          } catch (x) {
            control = x;
          }

          fn.call(Fake.prototype);
        }
      } else {
        try {
          throw Error();
        } catch (x) {
          control = x;
        }

        fn();
      }
    } catch (sample) {
      // This is inlined manually because closure doesn't do it for us.
      if (sample && control && typeof sample.stack === 'string') {
        // This extracts the first frame from the sample that isn't also in the control.
        // Skipping one frame that we assume is the frame that calls the two.
        var sampleLines = sample.stack.split('\n');
        var controlLines = control.stack.split('\n');
        var s = sampleLines.length - 1;
        var c = controlLines.length - 1;

        while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
          // We expect at least one stack frame to be shared.
          // Typically this will be the root most one. However, stack frames may be
          // cut off due to maximum stack limits. In this case, one maybe cut off
          // earlier than the other. We assume that the sample is longer or the same
          // and there for cut off earlier. So we should find the root most frame in
          // the sample somewhere in the control.
          c--;
        }

        for (; s >= 1 && c >= 0; s--, c--) {
          // Next we find the first one that isn't the same which should be the
          // frame that called our sample function and the control.
          if (sampleLines[s] !== controlLines[c]) {
            // In V8, the first line is describing the message but other VMs don't.
            // If we're about to return the first line, and the control is also on the same
            // line, that's a pretty good indicator that our sample threw at same line as
            // the control. I.e. before we entered the sample frame. So we ignore this result.
            // This can happen if you passed a class to function component, or non-function.
            if (s !== 1 || c !== 1) {
              do {
                s--;
                c--; // We may still have similar intermediate frames from the construct call.
                // The next one that isn't the same should be our match though.

                if (c < 0 || sampleLines[s] !== controlLines[c]) {
                  // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                  var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                  // but we have a user-provided "displayName"
                  // splice it in to make the stack more readable.


                  if (fn.displayName && _frame.includes('<anonymous>')) {
                    _frame = _frame.replace('<anonymous>', fn.displayName);
                  }

                  {
                    if (typeof fn === 'function') {
                      componentFrameCache.set(fn, _frame);
                    }
                  } // Return the line we found.


                  return _frame;
                }
              } while (s >= 1 && c >= 0);
            }

            break;
          }
        }
      }
    } finally {
      reentry = false;

      {
        ReactCurrentDispatcher$1.current = previousDispatcher;
        reenableLogs();
      }

      Error.prepareStackTrace = previousPrepareStackTrace;
    } // Fallback to just using the name if we couldn't make it throw.


    var name = fn ? fn.displayName || fn.name : '';
    var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

    {
      if (typeof fn === 'function') {
        componentFrameCache.set(fn, syntheticFrame);
      }
    }

    return syntheticFrame;
  }
  function describeFunctionComponentFrame(fn, source, ownerFn) {
    {
      return describeNativeComponentFrame(fn, false);
    }
  }

  function shouldConstruct(Component) {
    var prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
  }

  function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

    if (type == null) {
      return '';
    }

    if (typeof type === 'function') {
      {
        return describeNativeComponentFrame(type, shouldConstruct(type));
      }
    }

    if (typeof type === 'string') {
      return describeBuiltInComponentFrame(type);
    }

    switch (type) {
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame('Suspense');

      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame('SuspenseList');
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeFunctionComponentFrame(type.render);

        case REACT_MEMO_TYPE:
          // Memo may contain any component type so we recursively resolve it.
          return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

        case REACT_LAZY_TYPE:
          {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;

            try {
              // Lazy may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
            } catch (x) { }
          }
      }
    }

    return '';
  }

  var loggedTypeFailures = {};
  var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

  function setCurrentlyValidatingElement(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
      } else {
        ReactDebugCurrentFrame$1.setExtraStackFrame(null);
      }
    }
  }

  function checkPropTypes(typeSpecs, values, location, componentName, element) {
    {
      // $FlowFixMe This is okay but Flow doesn't know it.
      var has = Function.call.bind(hasOwnProperty);

      for (var typeSpecName in typeSpecs) {
        if (has(typeSpecs, typeSpecName)) {
          var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.

          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              // eslint-disable-next-line react-internal/prod-error-codes
              var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
              err.name = 'Invariant Violation';
              throw err;
            }

            error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
          } catch (ex) {
            error$1 = ex;
          }

          if (error$1 && !(error$1 instanceof Error)) {
            setCurrentlyValidatingElement(element);

            error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

            setCurrentlyValidatingElement(null);
          }

          if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error$1.message] = true;
            setCurrentlyValidatingElement(element);

            error('Failed %s type: %s', location, error$1.message);

            setCurrentlyValidatingElement(null);
          }
        }
      }
    }
  }

  function setCurrentlyValidatingElement$1(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        setExtraStackFrame(stack);
      } else {
        setExtraStackFrame(null);
      }
    }
  }

  var propTypesMisspellWarningShown;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }

  function getSourceInfoErrorAddendum(source) {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }

  function getSourceInfoErrorAddendumForProps(elementProps) {
    if (elementProps !== null && elementProps !== undefined) {
      return getSourceInfoErrorAddendum(elementProps.__source);
    }

    return '';
  }
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */


  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */


  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    {
      setCurrentlyValidatingElement$1(element);

      error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

      setCurrentlyValidatingElement$1(null);
    }
  }
  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */


  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */


  function validatePropTypes(element) {
    {
      var type = element.type;

      if (type === null || type === undefined || typeof type === 'string') {
        return;
      }

      var propTypes;

      if (typeof type === 'function') {
        propTypes = type.propTypes;
      } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        type.$$typeof === REACT_MEMO_TYPE)) {
        propTypes = type.propTypes;
      } else {
        return;
      }

      if (propTypes) {
        // Intentionally inside to avoid triggering lazy initializers:
        var name = getComponentNameFromType(type);
        checkPropTypes(propTypes, element.props, 'prop', name, element);
      } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
        propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

        var _name = getComponentNameFromType(type);

        error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
      }

      if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
        error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
      }
    }
  }
  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */


  function validateFragmentProps(fragment) {
    {
      var keys = Object.keys(fragment.props);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== 'children' && key !== 'key') {
          setCurrentlyValidatingElement$1(fragment);

          error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

          setCurrentlyValidatingElement$1(null);
          break;
        }
      }

      if (fragment.ref !== null) {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid attribute `ref` supplied to `React.Fragment`.');

        setCurrentlyValidatingElement$1(null);
      }
    }
  }
  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendumForProps(props);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      {
        error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      }
    }

    var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
  var didWarnAboutDeprecatedCreateFactory = false;
  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;

    {
      if (!didWarnAboutDeprecatedCreateFactory) {
        didWarnAboutDeprecatedCreateFactory = true;

        warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
      } // Legacy hook: remove it


      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }
  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }

    validatePropTypes(newElement);
    return newElement;
  }

  var enableSchedulerDebugging = false;
  var enableProfiling = false;
  var frameYieldMs = 5;

  function push(heap, node) {
    var index = heap.length;
    heap.push(node);
    siftUp(heap, node, index);
  }
  function peek(heap) {
    return heap.length === 0 ? null : heap[0];
  }
  function pop(heap) {
    if (heap.length === 0) {
      return null;
    }

    var first = heap[0];
    var last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }

    return first;
  }

  function siftUp(heap, node, i) {
    var index = i;

    while (index > 0) {
      var parentIndex = index - 1 >>> 1;
      var parent = heap[parentIndex];

      if (compare(parent, node) > 0) {
        // The parent is larger. Swap positions.
        heap[parentIndex] = node;
        heap[index] = parent;
        index = parentIndex;
      } else {
        // The parent is smaller. Exit.
        return;
      }
    }
  }

  function siftDown(heap, node, i) {
    var index = i;
    var length = heap.length;
    var halfLength = length >>> 1;

    while (index < halfLength) {
      var leftIndex = (index + 1) * 2 - 1;
      var left = heap[leftIndex];
      var rightIndex = leftIndex + 1;
      var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

      if (compare(left, node) < 0) {
        if (rightIndex < length && compare(right, left) < 0) {
          heap[index] = right;
          heap[rightIndex] = node;
          index = rightIndex;
        } else {
          heap[index] = left;
          heap[leftIndex] = node;
          index = leftIndex;
        }
      } else if (rightIndex < length && compare(right, node) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        // Neither child is smaller. Exit.
        return;
      }
    }
  }

  function compare(a, b) {
    // Compare sort index first, then task id.
    var diff = a.sortIndex - b.sortIndex;
    return diff !== 0 ? diff : a.id - b.id;
  }

  // TODO: Use symbols?
  var ImmediatePriority = 1;
  var UserBlockingPriority = 2;
  var NormalPriority = 3;
  var LowPriority = 4;
  var IdlePriority = 5;

  function markTaskErrored(task, ms) {
  }

  /* eslint-disable no-var */
  var getCurrentTime;
  var hasPerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

  if (hasPerformanceNow) {
    var localPerformance = performance;

    getCurrentTime = function () {
      return localPerformance.now();
    };
  } else {
    var localDate = Date;
    var initialTime = localDate.now();

    getCurrentTime = function () {
      return localDate.now() - initialTime;
    };
  } // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
  // Math.pow(2, 30) - 1
  // 0b111111111111111111111111111111


  var maxSigned31BitInt = 1073741823; // Times out immediately

  var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

  var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

  var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap

  var taskQueue = [];
  var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

  var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.
  var currentTask = null;
  var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrance.

  var isPerformingWork = false;
  var isHostCallbackScheduled = false;
  var isHostTimeoutScheduled = false; // Capture local references to native APIs, in case a polyfill overrides them.

  var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
  var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : null;
  var localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null; // IE and Node.js + jsdom

  var isInputPending = typeof navigator !== 'undefined' && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined ? navigator.scheduling.isInputPending.bind(navigator.scheduling) : null;

  function advanceTimers(currentTime) {
    // Check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerQueue);

    while (timer !== null) {
      if (timer.callback === null) {
        // Timer was cancelled.
        pop(timerQueue);
      } else if (timer.startTime <= currentTime) {
        // Timer fired. Transfer to the task queue.
        pop(timerQueue);
        timer.sortIndex = timer.expirationTime;
        push(taskQueue, timer);
      } else {
        // Remaining timers are pending.
        return;
      }

      timer = peek(timerQueue);
    }
  }

  function handleTimeout(currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);

    if (!isHostCallbackScheduled) {
      if (peek(taskQueue) !== null) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      } else {
        var firstTimer = peek(timerQueue);

        if (firstTimer !== null) {
          requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
      }
    }
  }

  function flushWork(hasTimeRemaining, initialTime) {


    isHostCallbackScheduled = false;

    if (isHostTimeoutScheduled) {
      // We scheduled a timeout but it's no longer needed. Cancel it.
      isHostTimeoutScheduled = false;
      cancelHostTimeout();
    }

    isPerformingWork = true;
    var previousPriorityLevel = currentPriorityLevel;

    try {
      if (enableProfiling) {
        try {
          return workLoop(hasTimeRemaining, initialTime);
        } catch (error) {
          if (currentTask !== null) {
            var currentTime = getCurrentTime();
            markTaskErrored(currentTask, currentTime);
            currentTask.isQueued = false;
          }

          throw error;
        }
      } else {
        // No catch in prod code path.
        return workLoop(hasTimeRemaining, initialTime);
      }
    } finally {
      currentTask = null;
      currentPriorityLevel = previousPriorityLevel;
      isPerformingWork = false;
    }
  }

  function workLoop(hasTimeRemaining, initialTime) {
    var currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek(taskQueue);

    while (currentTask !== null && !(enableSchedulerDebugging)) {
      if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
        // This currentTask hasn't expired, and we've reached the deadline.
        break;
      }

      var callback = currentTask.callback;

      if (typeof callback === 'function') {
        currentTask.callback = null;
        currentPriorityLevel = currentTask.priorityLevel;
        var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

        var continuationCallback = callback(didUserCallbackTimeout);
        currentTime = getCurrentTime();

        if (typeof continuationCallback === 'function') {
          currentTask.callback = continuationCallback;
        } else {

          if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
          }
        }

        advanceTimers(currentTime);
      } else {
        pop(taskQueue);
      }

      currentTask = peek(taskQueue);
    } // Return whether there's additional work


    if (currentTask !== null) {
      return true;
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }

      return false;
    }
  }

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;

      default:
        priorityLevel = NormalPriority;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_next(eventHandler) {
    var priorityLevel;

    switch (currentPriorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
        // Shift down to normal priority
        priorityLevel = NormalPriority;
        break;

      default:
        // Anything lower than normal priority should remain at the current level.
        priorityLevel = currentPriorityLevel;
        break;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_wrapCallback(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function () {
      // This is a fork of runWithPriority, inlined for performance.
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = parentPriorityLevel;

      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
  }

  function unstable_scheduleCallback(priorityLevel, callback, options) {
    var currentTime = getCurrentTime();
    var startTime;

    if (typeof options === 'object' && options !== null) {
      var delay = options.delay;

      if (typeof delay === 'number' && delay > 0) {
        startTime = currentTime + delay;
      } else {
        startTime = currentTime;
      }
    } else {
      startTime = currentTime;
    }

    var timeout;

    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = IMMEDIATE_PRIORITY_TIMEOUT;
        break;

      case UserBlockingPriority:
        timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
        break;

      case IdlePriority:
        timeout = IDLE_PRIORITY_TIMEOUT;
        break;

      case LowPriority:
        timeout = LOW_PRIORITY_TIMEOUT;
        break;

      case NormalPriority:
      default:
        timeout = NORMAL_PRIORITY_TIMEOUT;
        break;
    }

    var expirationTime = startTime + timeout;
    var newTask = {
      id: taskIdCounter++,
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
      sortIndex: -1
    };

    if (startTime > currentTime) {
      // This is a delayed task.
      newTask.sortIndex = startTime;
      push(timerQueue, newTask);

      if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
        // All tasks are delayed, and this is the task with the earliest delay.
        if (isHostTimeoutScheduled) {
          // Cancel an existing timeout.
          cancelHostTimeout();
        } else {
          isHostTimeoutScheduled = true;
        } // Schedule a timeout.


        requestHostTimeout(handleTimeout, startTime - currentTime);
      }
    } else {
      newTask.sortIndex = expirationTime;
      push(taskQueue, newTask);
      // wait until the next time we yield.


      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      }
    }

    return newTask;
  }

  function unstable_pauseExecution() {
  }

  function unstable_continueExecution() {

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  function unstable_getFirstCallbackNode() {
    return peek(taskQueue);
  }

  function unstable_cancelCallback(task) {
    // remove from the queue because you can't remove arbitrary nodes from an
    // array based heap, only the first one.)


    task.callback = null;
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  var isMessageLoopRunning = false;
  var scheduledHostCallback = null;
  var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
  // thread, like user events. By default, it yields multiple times per frame.
  // It does not attempt to align with frame boundaries, since most tasks don't
  // need to be frame aligned; for those that do, use requestAnimationFrame.

  var frameInterval = frameYieldMs;
  var startTime = -1;

  function shouldYieldToHost() {
    var timeElapsed = getCurrentTime() - startTime;

    if (timeElapsed < frameInterval) {
      // The main thread has only been blocked for a really short amount of time;
      // smaller than a single frame. Don't yield yet.
      return false;
    } // The main thread has been blocked for a non-negligible amount of time. We


    return true;
  }

  function requestPaint() {

  }

  function forceFrameRate(fps) {
    if (fps < 0 || fps > 125) {
      // Using console['error'] to evade Babel and ESLint
      console['error']('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
      return;
    }

    if (fps > 0) {
      frameInterval = Math.floor(1000 / fps);
    } else {
      // reset the framerate
      frameInterval = frameYieldMs;
    }
  }

  var performWorkUntilDeadline = function () {
    if (scheduledHostCallback !== null) {
      var currentTime = getCurrentTime(); // Keep track of the start time so we can measure how long the main thread
      // has been blocked.

      startTime = currentTime;
      var hasTimeRemaining = true; // If a scheduler task throws, exit the current browser task so the
      // error can be observed.
      //
      // Intentionally not using a try-catch, since that makes some debugging
      // techniques harder. Instead, if `scheduledHostCallback` errors, then
      // `hasMoreWork` will remain true, and we'll continue the work loop.

      var hasMoreWork = true;

      try {
        hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
      } finally {
        if (hasMoreWork) {
          // If there's more work, schedule the next message event at the end
          // of the preceding one.
          schedulePerformWorkUntilDeadline();
        } else {
          isMessageLoopRunning = false;
          scheduledHostCallback = null;
        }
      }
    } else {
      isMessageLoopRunning = false;
    } // Yielding to the browser will give it a chance to paint, so we can
  };

  var schedulePerformWorkUntilDeadline;

  if (typeof localSetImmediate === 'function') {
    // Node.js and old IE.
    // There's a few reasons for why we prefer setImmediate.
    //
    // Unlike MessageChannel, it doesn't prevent a Node.js process from exiting.
    // (Even though this is a DOM fork of the Scheduler, you could get here
    // with a mix of Node.js 15+, which has a MessageChannel, and jsdom.)
    // https://github.com/facebook/react/issues/20756
    //
    // But also, it runs earlier which is the semantic we want.
    // If other browsers ever implement it, it's better to use it.
    // Although both of these would be inferior to native scheduling.
    schedulePerformWorkUntilDeadline = function () {
      localSetImmediate(performWorkUntilDeadline);
    };
  } else if (typeof MessageChannel !== 'undefined') {
    // DOM and Worker environments.
    // We prefer MessageChannel because of the 4ms setTimeout clamping.
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;

    schedulePerformWorkUntilDeadline = function () {
      port.postMessage(null);
    };
  } else {
    // We should only fallback here in non-browser environments.
    schedulePerformWorkUntilDeadline = function () {
      localSetTimeout(performWorkUntilDeadline, 0);
    };
  }

  function requestHostCallback(callback) {
    scheduledHostCallback = callback;

    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      schedulePerformWorkUntilDeadline();
    }
  }

  function requestHostTimeout(callback, ms) {
    taskTimeoutID = localSetTimeout(function () {
      callback(getCurrentTime());
    }, ms);
  }

  function cancelHostTimeout() {
    localClearTimeout(taskTimeoutID);
    taskTimeoutID = -1;
  }

  var unstable_requestPaint = requestPaint;
  var unstable_Profiling = null;



  var Scheduler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unstable_ImmediatePriority: ImmediatePriority,
    unstable_UserBlockingPriority: UserBlockingPriority,
    unstable_NormalPriority: NormalPriority,
    unstable_IdlePriority: IdlePriority,
    unstable_LowPriority: LowPriority,
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_next: unstable_next,
    unstable_scheduleCallback: unstable_scheduleCallback,
    unstable_cancelCallback: unstable_cancelCallback,
    unstable_wrapCallback: unstable_wrapCallback,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
    unstable_shouldYield: shouldYieldToHost,
    unstable_requestPaint: unstable_requestPaint,
    unstable_continueExecution: unstable_continueExecution,
    unstable_pauseExecution: unstable_pauseExecution,
    unstable_getFirstCallbackNode: unstable_getFirstCallbackNode,
    get unstable_now() { return getCurrentTime; },
    unstable_forceFrameRate: forceFrameRate,
    unstable_Profiling: unstable_Profiling
  });

  var ReactSharedInternals$1 = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    ReactCurrentBatchConfig: ReactCurrentBatchConfig,
    // Re-export the schedule API(s) for UMD bundles.
    // This avoids introducing a dependency on a new UMD global in a minor update,
    // Since that would be a breaking change (e.g. for all existing CodeSandboxes).
    // This re-export is only required for UMD bundles;
    // CJS bundles use the shared NPM package.
    Scheduler: Scheduler
  };

  {
    ReactSharedInternals$1.ReactCurrentActQueue = ReactCurrentActQueue;
    ReactSharedInternals$1.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  }

  function startTransition(scope, options) {
    var prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = {};
    var currentTransition = ReactCurrentBatchConfig.transition;

    {
      ReactCurrentBatchConfig.transition._updatedFibers = new Set();
    }

    try {
      scope();
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;

      {
        if (prevTransition === null && currentTransition._updatedFibers) {
          var updatedFibersCount = currentTransition._updatedFibers.size;

          if (updatedFibersCount > 10) {
            warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
          }

          currentTransition._updatedFibers.clear();
        }
      }
    }
  }

  var didWarnAboutMessageChannel = false;
  var enqueueTaskImpl = null;
  function enqueueTask(task) {
    if (enqueueTaskImpl === null) {
      try {
        // read require off the module object to get around the bundlers.
        // we don't want them to detect a require and bundle a Node polyfill.
        var requireString = ('require' + Math.random()).slice(0, 7);
        var nodeRequire = module && module[requireString]; // assuming we're in node, let's try to get node's
        // version of setImmediate, bypassing fake timers if any.

        enqueueTaskImpl = nodeRequire.call(module, 'timers').setImmediate;
      } catch (_err) {
        // we're in a browser
        // we can't use regular timers because they may still be faked
        // so we try MessageChannel+postMessage instead
        enqueueTaskImpl = function (callback) {
          {
            if (didWarnAboutMessageChannel === false) {
              didWarnAboutMessageChannel = true;

              if (typeof MessageChannel === 'undefined') {
                error('This browser does not have a MessageChannel implementation, ' + 'so enqueuing tasks via await act(async () => ...) will fail. ' + 'Please file an issue at https://github.com/facebook/react/issues ' + 'if you encounter this warning.');
              }
            }
          }

          var channel = new MessageChannel();
          channel.port1.onmessage = callback;
          channel.port2.postMessage(undefined);
        };
      }
    }

    return enqueueTaskImpl(task);
  }

  var actScopeDepth = 0;
  var didWarnNoAwaitAct = false;
  function act(callback) {
    {
      // `act` calls can be nested, so we track the depth. This represents the
      // number of `act` scopes on the stack.
      var prevActScopeDepth = actScopeDepth;
      actScopeDepth++;

      if (ReactCurrentActQueue.current === null) {
        // This is the outermost `act` scope. Initialize the queue. The reconciler
        // will detect the queue and use it instead of Scheduler.
        ReactCurrentActQueue.current = [];
      }

      var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
      var result;

      try {
        // Used to reproduce behavior of `batchedUpdates` in legacy mode. Only
        // set to `true` while the given callback is executed, not for updates
        // triggered during an async event, because this is how the legacy
        // implementation of `act` behaved.
        ReactCurrentActQueue.isBatchingLegacy = true;
        result = callback(); // Replicate behavior of original `act` implementation in legacy mode,
        // which flushed updates immediately after the scope function exits, even
        // if it's an async function.

        if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
          var queue = ReactCurrentActQueue.current;

          if (queue !== null) {
            ReactCurrentActQueue.didScheduleLegacyUpdate = false;
            flushActQueue(queue);
          }
        }
      } catch (error) {
        popActScope(prevActScopeDepth);
        throw error;
      } finally {
        ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
      }

      if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
        var thenableResult = result; // The callback is an async function (i.e. returned a promise). Wait
        // for it to resolve before exiting the current scope.

        var wasAwaited = false;
        var thenable = {
          then: function (resolve, reject) {
            wasAwaited = true;
            thenableResult.then(function (returnValue) {
              popActScope(prevActScopeDepth);

              if (actScopeDepth === 0) {
                // We've exited the outermost act scope. Recursively flush the
                // queue until there's no remaining work.
                recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              } else {
                resolve(returnValue);
              }
            }, function (error) {
              // The callback threw an error.
              popActScope(prevActScopeDepth);
              reject(error);
            });
          }
        };

        {
          if (!didWarnNoAwaitAct && typeof Promise !== 'undefined') {
            // eslint-disable-next-line no-undef
            Promise.resolve().then(function () { }).then(function () {
              if (!wasAwaited) {
                didWarnNoAwaitAct = true;

                error('You called act(async () => ...) without await. ' + 'This could lead to unexpected testing behaviour, ' + 'interleaving multiple act calls and mixing their ' + 'scopes. ' + 'You should - await act(async () => ...);');
              }
            });
          }
        }

        return thenable;
      } else {
        var returnValue = result; // The callback is not an async function. Exit the current scope
        // immediately, without awaiting.

        popActScope(prevActScopeDepth);

        if (actScopeDepth === 0) {
          // Exiting the outermost act scope. Flush the queue.
          var _queue = ReactCurrentActQueue.current;

          if (_queue !== null) {
            flushActQueue(_queue);
            ReactCurrentActQueue.current = null;
          } // Return a thenable. If the user awaits it, we'll flush again in
          // case additional work was scheduled by a microtask.


          var _thenable = {
            then: function (resolve, reject) {
              // Confirm we haven't re-entered another `act` scope, in case
              // the user does something weird like await the thenable
              // multiple times.
              if (ReactCurrentActQueue.current === null) {
                // Recursively flush the queue until there's no remaining work.
                ReactCurrentActQueue.current = [];
                recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              } else {
                resolve(returnValue);
              }
            }
          };
          return _thenable;
        } else {
          // Since we're inside a nested `act` scope, the returned thenable
          // immediately resolves. The outer scope will flush the queue.
          var _thenable2 = {
            then: function (resolve, reject) {
              resolve(returnValue);
            }
          };
          return _thenable2;
        }
      }
    }
  }

  function popActScope(prevActScopeDepth) {
    {
      if (prevActScopeDepth !== actScopeDepth - 1) {
        error('You seem to have overlapping act() calls, this is not supported. ' + 'Be sure to await previous act() calls before making a new one. ');
      }

      actScopeDepth = prevActScopeDepth;
    }
  }

  function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
    {
      var queue = ReactCurrentActQueue.current;

      if (queue !== null) {
        try {
          flushActQueue(queue);
          enqueueTask(function () {
            if (queue.length === 0) {
              // No additional work was scheduled. Finish.
              ReactCurrentActQueue.current = null;
              resolve(returnValue);
            } else {
              // Keep flushing work until there's none left.
              recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            }
          });
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(returnValue);
      }
    }
  }

  var isFlushing = false;

  function flushActQueue(queue) {
    {
      if (!isFlushing) {
        // Prevent re-entrance.
        isFlushing = true;
        var i = 0;

        try {
          for (; i < queue.length; i++) {
            var callback = queue[i];

            do {
              callback = callback(true);
            } while (callback !== null);
          }

          queue.length = 0;
        } catch (error) {
          // If something throws, leave the remaining callbacks on the queue.
          queue = queue.slice(i + 1);
          throw error;
        } finally {
          isFlushing = false;
        }
      }
    }
  }

  var createElement$1 = createElementWithValidation;
  var cloneElement$1 = cloneElementWithValidation;
  var createFactory = createFactoryWithValidation;
  var Children = {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  };



  var process = {
    env: {
      NODE_ENV: 'production'
    }
  }


  // react-redux start 
  // react-redux start 
  /*
  function addScript(url) {
    console.log('addScript==>')
    document.write(`<script language=javascript src='${url}'></script>`);
  }
  addScript('./hoist-non-react-statics.js')
  */

  // 方法1
  const _excluded = ["reactReduxForwardedRef"];
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  // 方法2
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }

  function strictEqual(a, b) {
    return a === b;
  }
  function is(x, y) {
    if (x === y) {
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
      return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }

  React.createContext = createContext

  const ReactReduxContext = /*#__PURE__*/React.createContext(null);
  // const ReactReduxContext = /*#__PURE__*/createContext(null);
  function mapDispatchToPropsFactory(mapDispatchToProps) {
    return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(dispatch => // @ts-ignore
      bindActionCreators(mapDispatchToProps, dispatch)) : !mapDispatchToProps ? wrapMapToPropsConstant(dispatch => ({
        dispatch
      })) : typeof mapDispatchToProps === 'function' ? // @ts-ignore
      wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : createInvalidArgFactory(mapDispatchToProps, 'mapDispatchToProps');
  }

  function mapDispatchToPropsFactory(mapDispatchToProps) {
    return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(dispatch => // @ts-ignore
      bindActionCreators(mapDispatchToProps, dispatch)) : !mapDispatchToProps ? wrapMapToPropsConstant(dispatch => ({
        dispatch
      })) : typeof mapDispatchToProps === 'function' ? // @ts-ignore
      wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : createInvalidArgFactory(mapDispatchToProps, 'mapDispatchToProps');
  }

  function mapStateToPropsFactory(mapStateToProps) {
    return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : typeof mapStateToProps === 'function' ? // @ts-ignore
      wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : createInvalidArgFactory(mapStateToProps, 'mapStateToProps');
  }

  function wrapMapToPropsConstant( // * Note:
    //  It seems that the dispatch argument
    //  could be a dispatch function in some cases (ex: whenMapDispatchToPropsIsMissing)
    //  and a state object in some others (ex: whenMapStateToPropsIsMissing)
    // eslint-disable-next-line no-unused-vars
    getConstant) {
    return function initConstantSelector(dispatch) {
      const constant = getConstant(dispatch);

      function constantSelector() {
        return constant;
      }

      constantSelector.dependsOnOwnProps = false;
      return constantSelector;
    };
  } // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
  // to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
  // whether mapToProps needs to be invoked when props have changed.
  //
  // A length of one signals that mapToProps does not depend on props from the parent component.
  // A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
  // therefore not reporting its length accurately..
  // TODO Can this get pulled out so that we can subscribe directly to the store if we don't need ownProps?

  function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
  } // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
  // this function wraps mapToProps in a proxy function which does several things:
  //
  //  * Detects whether the mapToProps function being called depends on props, which
  //    is used by selectorFactory to decide if it should reinvoke on props changes.
  //
  //  * On first call, handles mapToProps if returns another function, and treats that
  //    new function as the true mapToProps for subsequent calls.
  //
  //  * On first call, verifies the first result is a plain object, in order to warn
  //    the developer that their mapToProps function is not returning a valid result.
  //

  function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, {
      displayName
    }) {
      const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
        return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch, undefined);
      }; // allow detectFactoryAndVerify to get ownProps


      proxy.dependsOnOwnProps = true;

      proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
        proxy.mapToProps = mapToProps;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
        let props = proxy(stateOrDispatch, ownProps);

        if (typeof props === 'function') {
          proxy.mapToProps = props;
          proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
          props = proxy(stateOrDispatch, ownProps);
        }

        if (process.env.NODE_ENV !== 'production') verifyPlainObject(props, displayName, methodName);
        return props;
      };

      return proxy;
    };
  }

  function verifyPlainObject(value, displayName, methodName) {
    if (!isPlainObject(value)) {
      warning(`${methodName}() in ${displayName} must return a plain object. Instead received ${value}.`);
    }
  }
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    let proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    let baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
      baseProto = Object.getPrototypeOf(baseProto);
    }

    return proto === baseProto;
  }
  function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    /* eslint-enable no-console */


    try {
      // This error was thrown as a convenience so that if you enable
      // "break on all exceptions" in your console,
      // it would pause the execution at this line.
      throw new Error(message);
      /* eslint-disable no-empty */
    } catch (e) { }
    /* eslint-enable no-empty */

  }
  function createInvalidArgFactory(arg, name) {
    return (dispatch, options) => {
      throw new Error(`Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`);
    };
  }
  function bindActionCreators(actionCreators, dispatch) {
    const boundActionCreators = {};

    for (const key in actionCreators) {
      const actionCreator = actionCreators[key];

      if (typeof actionCreator === 'function') {
        boundActionCreators[key] = (...args) => dispatch(actionCreator(...args));
      }
    }

    return boundActionCreators;
  }

  function defaultMergeProps(stateProps, dispatchProps, ownProps) {
    // @ts-ignore
    return _extends({}, ownProps, stateProps, dispatchProps);
  }
  function wrapMergePropsFunc(mergeProps) {
    return function initMergePropsProxy(dispatch, {
      displayName,
      areMergedPropsEqual
    }) {
      let hasRunOnce = false;
      let mergedProps;
      return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
        const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

        if (hasRunOnce) {
          if (!areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
        } else {
          hasRunOnce = true;
          mergedProps = nextMergedProps;
          if (process.env.NODE_ENV !== 'production') verifyPlainObject(mergedProps, displayName, 'mergeProps');
        }

        return mergedProps;
      };
    };
  }
  function mergePropsFactory(mergeProps) {
    return !mergeProps ? () => defaultMergeProps : typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : createInvalidArgFactory(mergeProps, 'mergeProps');
  }


  // selectorFactory.js
  // selectorFactory.js
  // selectorFactory.js
  function verify(selector, methodName) {
    if (!selector) {
      throw new Error(`Unexpected value for ${methodName} in connect.`);
    } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
      if (!Object.prototype.hasOwnProperty.call(selector, 'dependsOnOwnProps')) {
        warning(`The selector for ${methodName} of connect did not specify a value for dependsOnOwnProps.`);
      }
    }
  }

  function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps) {
    verify(mapStateToProps, 'mapStateToProps');
    verify(mapDispatchToProps, 'mapDispatchToProps');
    verify(mergeProps, 'mergeProps');
  }
  const _excluded_selectorFactory = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];
  function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, {
    areStatesEqual,
    areOwnPropsEqual,
    areStatePropsEqual
  }) {
    let hasRunAtLeastOnce = false;
    let state;
    let ownProps;
    let stateProps;
    let dispatchProps;
    let mergedProps;

    console.log('%c=pureFinalPropsSelectorFactory=mapStateToProps、mapDispatchToProps、mergeProps是会返回各自最终值的函数', 'color:yellow')

    function handleFirstCall(firstState, firstOwnProps) {
      state = firstState;
      ownProps = firstOwnProps;
      stateProps = mapStateToProps(state, ownProps);
      dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      hasRunAtLeastOnce = true;
      console.log('=react-redux=pureFinalPropsSelectorFactory=handleFirstCall')
      return mergedProps;
    }

    function handleNewPropsAndNewState() {
      console.log('=react-redux=pureFinalPropsSelectorFactory=handleNewPropsAndNewState')
      stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }

    function handleNewProps() {
      console.log('=react-redux=pureFinalPropsSelectorFactory=handleNewProps')
      if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }

    function handleNewState() {
      console.log('=react-redux=pureFinalPropsSelectorFactory=handleNewState')
      const nextStateProps = mapStateToProps(state, ownProps);
      const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
      stateProps = nextStateProps;
      if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }

    function handleSubsequentCalls(nextState, nextOwnProps) {
      console.log('=react-redux=pureFinalPropsSelectorFactory=handleSubsequentCalls')
      const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
      const stateChanged = !areStatesEqual(nextState, state, nextOwnProps, ownProps);
      state = nextState;
      ownProps = nextOwnProps;
      if (propsChanged && stateChanged) return handleNewPropsAndNewState();
      if (propsChanged) return handleNewProps();
      if (stateChanged) return handleNewState();
      return mergedProps;
    }

    return function pureFinalPropsSelector(nextState, nextOwnProps) {
      return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    };
  }
  // TODO: Add more comments
  // The selector returned by selectorFactory will memoize its results,
  // allowing connect's shouldComponentUpdate to return false if final
  // props have not changed.
  // function finalPropsSelectorFactory(dispatch, _ref) {
  function defaultSelectorFactory(dispatch, _ref) {
    let {
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps
    } = _ref,
      options = _objectWithoutPropertiesLoose(_ref, _excluded_selectorFactory);

    const mapStateToProps = initMapStateToProps(dispatch, options);
    const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
    const mergeProps = initMergeProps(dispatch, options);

    if (process.env.NODE_ENV !== 'production') {
      verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps);
    }

    return pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
  }

  // react-redux end
  // react-redux end
  // react-redux end
  // react-redux end











  // hoist-non-react-statics
  // hoist-non-react-statics
  // hoist-non-react-statics
  // {
  var process = {
    env: {
      NODE_ENV: 'production'
    }
  }

  function unwrapExports(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var reactIs_production_min = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") :
      60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.fundamental") : 60117, w = b ? Symbol.for("react.responder") : 60118, x = b ? Symbol.for("react.scope") : 60119; function y(a) { if ("object" === typeof a && null !== a) { var u = a.$$typeof; switch (u) { case c: switch (a = a.type, a) { case l: case m: case e: case g: case f: case p: return a; default: switch (a = a && a.$$typeof, a) { case k: case n: case t: case r: case h: return a; default: return u } }case d: return u } } } function z(a) { return y(a) === m }
    exports.typeOf = y; exports.AsyncMode = l; exports.ConcurrentMode = m; exports.ContextConsumer = k; exports.ContextProvider = h; exports.Element = c; exports.ForwardRef = n; exports.Fragment = e; exports.Lazy = t; exports.Memo = r; exports.Portal = d; exports.Profiler = g; exports.StrictMode = f; exports.Suspense = p;
    exports.isValidElementType = function (a) { return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === v || a.$$typeof === w || a.$$typeof === x) }; exports.isAsyncMode = function (a) { return z(a) || y(a) === l }; exports.isConcurrentMode = z; exports.isContextConsumer = function (a) { return y(a) === k }; exports.isContextProvider = function (a) { return y(a) === h };
    exports.isElement = function (a) { return "object" === typeof a && null !== a && a.$$typeof === c }; exports.isForwardRef = function (a) { return y(a) === n }; exports.isFragment = function (a) { return y(a) === e }; exports.isLazy = function (a) { return y(a) === t }; exports.isMemo = function (a) { return y(a) === r }; exports.isPortal = function (a) { return y(a) === d }; exports.isProfiler = function (a) { return y(a) === g }; exports.isStrictMode = function (a) { return y(a) === f }; exports.isSuspense = function (a) { return y(a) === p };
  });

  unwrapExports(reactIs_production_min);
  var reactIs_production_min_1 = reactIs_production_min.typeOf;
  var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
  var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
  var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
  var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
  var reactIs_production_min_6 = reactIs_production_min.Element;
  var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
  var reactIs_production_min_8 = reactIs_production_min.Fragment;
  var reactIs_production_min_9 = reactIs_production_min.Lazy;
  var reactIs_production_min_10 = reactIs_production_min.Memo;
  var reactIs_production_min_11 = reactIs_production_min.Portal;
  var reactIs_production_min_12 = reactIs_production_min.Profiler;
  var reactIs_production_min_13 = reactIs_production_min.StrictMode;
  var reactIs_production_min_14 = reactIs_production_min.Suspense;
  var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
  var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
  var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
  var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
  var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
  var reactIs_production_min_20 = reactIs_production_min.isElement;
  var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
  var reactIs_production_min_22 = reactIs_production_min.isFragment;
  var reactIs_production_min_23 = reactIs_production_min.isLazy;
  var reactIs_production_min_24 = reactIs_production_min.isMemo;
  var reactIs_production_min_25 = reactIs_production_min.isPortal;
  var reactIs_production_min_26 = reactIs_production_min.isProfiler;
  var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
  var reactIs_production_min_28 = reactIs_production_min.isSuspense;

  var reactIs_development = createCommonjsModule(function (module, exports) {

    if (process.env.NODE_ENV !== "production") {
      (function () {

        Object.defineProperty(exports, '__esModule', { value: true });

        // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
        // nor polyfill, then a plain number is used for performance.
        var hasSymbol = typeof Symbol === 'function' && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
        // (unstable) APIs that have been removed. Can we remove the symbols?

        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

        function isValidElementType(type) {
          return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
            type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
        }

        /**
         * Forked from fbjs/warning:
         * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
         *
         * Only change is we use console.warn instead of console.error,
         * and do nothing when 'console' is not supported.
         * This really simplifies the code.
         * ---
         * Similar to invariant but only logs a warning if the condition is not met.
         * This can be used to log issues in development environments in critical
         * paths. Removing the logging code for production environments will keep the
         * same logic and follow the same code paths.
         */
        var lowPriorityWarningWithoutStack = function () { };

        {
          var printWarning = function (format) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function () {
              return args[argIndex++];
            });

            if (typeof console !== 'undefined') {
              console.warn(message);
            }

            try {
              // --- Welcome to debugging React ---
              // This error was thrown as a convenience so that you can use this stack
              // to find the callsite that caused this warning to fire.
              throw new Error(message);
            } catch (x) { }
          };

          lowPriorityWarningWithoutStack = function (condition, format) {
            if (format === undefined) {
              throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
            }

            if (!condition) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              printWarning.apply(void 0, [format].concat(args));
            }
          };
        }

        var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

        function typeOf(object) {
          if (typeof object === 'object' && object !== null) {
            var $$typeof = object.$$typeof;

            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;

                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;

                  default:
                    var $$typeofType = type && type.$$typeof;

                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;

                      default:
                        return $$typeof;
                    }

                }

              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }

          return undefined;
        } // AsyncMode is deprecated along with isAsyncMode

        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              lowPriorityWarningWithoutStack$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
            }
          }

          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        function isContextConsumer(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }

        exports.typeOf = typeOf;
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isValidElementType = isValidElementType;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
      })();
    }
  });

  unwrapExports(reactIs_development);
  var reactIs_development_1 = reactIs_development.typeOf;
  var reactIs_development_2 = reactIs_development.AsyncMode;
  var reactIs_development_3 = reactIs_development.ConcurrentMode;
  var reactIs_development_4 = reactIs_development.ContextConsumer;
  var reactIs_development_5 = reactIs_development.ContextProvider;
  var reactIs_development_6 = reactIs_development.Element;
  var reactIs_development_7 = reactIs_development.ForwardRef;
  var reactIs_development_8 = reactIs_development.Fragment;
  var reactIs_development_9 = reactIs_development.Lazy;
  var reactIs_development_10 = reactIs_development.Memo;
  var reactIs_development_11 = reactIs_development.Portal;
  var reactIs_development_12 = reactIs_development.Profiler;
  var reactIs_development_13 = reactIs_development.StrictMode;
  var reactIs_development_14 = reactIs_development.Suspense;
  var reactIs_development_15 = reactIs_development.isValidElementType;
  var reactIs_development_16 = reactIs_development.isAsyncMode;
  var reactIs_development_17 = reactIs_development.isConcurrentMode;
  var reactIs_development_18 = reactIs_development.isContextConsumer;
  var reactIs_development_19 = reactIs_development.isContextProvider;
  var reactIs_development_20 = reactIs_development.isElement;
  var reactIs_development_21 = reactIs_development.isForwardRef;
  var reactIs_development_22 = reactIs_development.isFragment;
  var reactIs_development_23 = reactIs_development.isLazy;
  var reactIs_development_24 = reactIs_development.isMemo;
  var reactIs_development_25 = reactIs_development.isPortal;
  var reactIs_development_26 = reactIs_development.isProfiler;
  var reactIs_development_27 = reactIs_development.isStrictMode;
  var reactIs_development_28 = reactIs_development.isSuspense;

  var reactIs = createCommonjsModule(function (module) {

    if (process.env.NODE_ENV === 'production') {
      module.exports = reactIs_production_min;
    } else {
      module.exports = reactIs_development;
    }
  });
  var reactIs_1 = reactIs.typeOf;
  var reactIs_2 = reactIs.AsyncMode;
  var reactIs_3 = reactIs.ConcurrentMode;
  var reactIs_4 = reactIs.ContextConsumer;
  var reactIs_5 = reactIs.ContextProvider;
  var reactIs_6 = reactIs.Element;
  var reactIs_7 = reactIs.ForwardRef;
  var reactIs_8 = reactIs.Fragment;
  var reactIs_9 = reactIs.Lazy;
  var reactIs_10 = reactIs.Memo;
  var reactIs_11 = reactIs.Portal;
  var reactIs_12 = reactIs.Profiler;
  var reactIs_13 = reactIs.StrictMode;
  var reactIs_14 = reactIs.Suspense;
  var reactIs_15 = reactIs.isValidElementType;
  var reactIs_16 = reactIs.isAsyncMode;
  var reactIs_17 = reactIs.isConcurrentMode;
  var reactIs_18 = reactIs.isContextConsumer;
  var reactIs_19 = reactIs.isContextProvider;
  var reactIs_20 = reactIs.isElement;
  var reactIs_21 = reactIs.isForwardRef;
  var reactIs_22 = reactIs.isFragment;
  var reactIs_23 = reactIs.isLazy;
  var reactIs_24 = reactIs.isMemo;
  var reactIs_25 = reactIs.isPortal;
  var reactIs_26 = reactIs.isProfiler;
  var reactIs_27 = reactIs.isStrictMode;
  var reactIs_28 = reactIs.isSuspense;

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */
  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };
  var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    '$$typeof': true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs_7] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs_10] = MEMO_STATICS;

  function getStatics(component) {
    // React v16.11 and below
    if (reactIs_24(component)) {
      return MEMO_STATICS;
    } // React v16.12 and above


    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
  }

  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;
  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);

        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }

      var keys = getOwnPropertyNames(sourceComponent);

      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }

      var targetStatics = getStatics(targetComponent);
      var sourceStatics = getStatics(sourceComponent);

      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];

        if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
          var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

          try {
            // Avoid failures from read-only properties
            defineProperty(targetComponent, key, descriptor);
          } catch (e) { }
        }
      }
    }

    return targetComponent;
  }

  // }
  // hoist-non-react-statics end
  // hoist-non-react-statics end
  // hoist-non-react-statics end






  // connect start
  // connect start
  // connect start
  // connect start
  const notInitialized = () => {
    throw new Error('uSES not initialized!');
  };
  // let useSyncExternalStore = notInitialized;
  let useSyncExternalStore_connect = notInitialized;
  const initializeConnect = fn => {
    // useSyncExternalStore = fn;
    useSyncExternalStore_connect = fn;
  }; // Define some constant arrays just to avoid re-creating these

  const EMPTY_ARRAY = [null, 0];
  const NO_SUBSCRIPTION_ARRAY = [null, null]; // Attempts to stringify whatever not-really-a-component value we were given
  // for logging in an error message

  const stringifyComponent = Comp => {
    try {
      return JSON.stringify(Comp);
    } catch (err) {
      return String(Comp);
    }
  };

  // This is "just" a `useLayoutEffect`, but with two modifications:
  // - we need to fall back to `useEffect` in SSR to avoid annoying warnings
  // - we extract this to a separate function to avoid closing over values
  //   and causing memory leaks
  function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
    useIsomorphicLayoutEffect(() => effectFunc(...effectArgs), dependencies);
  } // Effect callback, extracted: assign the latest props values to refs for later usage
  function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, // actualChildProps: unknown,
    childPropsFromStoreUpdate, notifyNestedSubs) {
    // We want to capture the wrapper props and child props we used for later comparisons
    lastWrapperProps.current = wrapperProps;
    renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

    if (childPropsFromStoreUpdate.current) {
      childPropsFromStoreUpdate.current = null;
      notifyNestedSubs();
    }
  } // Effect callback, extracted: subscribe to the Redux store or nearest connected ancestor,
  function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, // forceComponentUpdateDispatch: React.Dispatch<any>,
    additionalSubscribeListener) {
    // If we're not subscribed to the store, nothing to do here
    if (!shouldHandleStateChanges) return () => { }; // Capture values for checking if and when this component unmounts

    let didUnsubscribe = false;
    let lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component


    const checkForUpdates = () => {
      console.log('%c=react-redux=checkForUpdates=开始执行', 'color:red')
      if (didUnsubscribe || !isMounted.current) {
        console.log('%c=react-redux=checkForUpdates=1:return', 'color:red')
        // Don't run stale listeners.
        // Redux doesn't guarantee unsubscriptions happen until next dispatch.
        return;
      } // TODO We're currently calling getState ourselves here, rather than letting `uSES` do it


      const latestStoreState = store.getState();
      let newChildProps, error;

      try {
        // Actually run the selector with the most recent store state and wrapper props
        // to determine what the child props should be
        newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
      } catch (e) {
        error = e;
        lastThrownError = e;
      }

      if (!error) {
        lastThrownError = null;
      } // If the child props haven't changed, nothing to do here - cascade the subscription update

      console.log('%c=react-redux=checkForUpdates=2:对比：', 'color:red', { newChildProps, old: lastChildProps.current })
      if (newChildProps === lastChildProps.current) {
        if (!renderIsScheduled.current) {
          console.log('%c=react-redux=checkForUpdates=2:不执行更新，notifyNestedSubs()', 'color:red')
          notifyNestedSubs();
        }
      } else {
        // Save references to the new child props.  Note that we track the "child props from store update"
        // as a ref instead of a useState/useReducer because we need a way to determine if that value has
        // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
        // forcing another re-render, which we don't want.
        lastChildProps.current = newChildProps;
        childPropsFromStoreUpdate.current = newChildProps;
        renderIsScheduled.current = true; // TODO This is hacky and not how `uSES` is meant to be used
        // Trigger the React `useSyncExternalStore` subscriber

        console.log('%c=react-redux=checkForUpdates=3:additionalSubscribeListener()执行更新', 'color:red')
        additionalSubscribeListener();
      }
    }; // Actually subscribe to the nearest connected ancestor (or store)


    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe(); // Pull data from the store after first render in case the store has
    // changed since we began.

    console.log('%c=react-redux=ConnectFunction订阅了更新subscribeUpdates', 'color:chartreuse')
    console.log('%c=react-redux=ConnectFunction=subscribeUpdates调用checkForUpdates', 'color:chartreuse')
    checkForUpdates();

    const unsubscribeWrapper = () => {
      didUnsubscribe = true;
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;

      if (lastThrownError) {
        // It's possible that we caught an error due to a bad mapState function, but the
        // parent re-rendered without this component and we're about to unmount.
        // This shouldn't happen as long as we do top-down subscriptions correctly, but
        // if we ever do those wrong, this throw will surface the error in our tests.
        // In that case, throw the error from here so it doesn't get lost.
        throw lastThrownError;
      }
    };

    return unsubscribeWrapper;
  } // Reducer initial state creation for our update reducer


  function connect(mapStateToProps, mapDispatchToProps, mergeProps, {
    // The `pure` option has been removed, so TS doesn't like us destructuring this to check its existence.
    // @ts-ignore
    pure,
    areStatesEqual = strictEqual,
    areOwnPropsEqual = shallowEqual,
    areStatePropsEqual = shallowEqual,
    areMergedPropsEqual = shallowEqual,
    // use React's forwardRef to expose a ref of the wrapped component
    forwardRef = false,
    // the context consumer to use
    context = ReactReduxContext
  } = {}) {
    // if (process.env.NODE_ENV !== 'production') {
    if (pure !== undefined && !hasWarnedAboutDeprecatedPureOption) {
      hasWarnedAboutDeprecatedPureOption = true;
      warning('The `pure` option has been removed. `connect` is now always a "pure/memoized" component');
    }
    // }
    const Context = context;
    const initMapStateToProps = mapStateToPropsFactory(mapStateToProps);
    const initMapDispatchToProps = mapDispatchToPropsFactory(mapDispatchToProps);
    const initMergeProps = mergePropsFactory(mergeProps);
    const shouldHandleStateChanges = Boolean(mapStateToProps);

    console.log('%c=react-redux=connect执行wrapWithConnect', 'color:chartreuse')

    const wrapWithConnect = WrappedComponent => {
      // if (process.env.NODE_ENV !== 'production' && !isValidElementType(WrappedComponent)) {
      //   throw new Error(`You must pass a component to the function returned by connect. Instead received ${stringifyComponent(WrappedComponent)}`);
      // }

      const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
      const displayName = `Connect(${wrappedComponentName})`;
      const selectorFactoryOptions = {
        shouldHandleStateChanges,
        displayName,
        wrappedComponentName,
        WrappedComponent,
        // @ts-ignore
        initMapStateToProps,
        // @ts-ignore
        initMapDispatchToProps,
        initMergeProps,
        areStatesEqual,
        areStatePropsEqual,
        areOwnPropsEqual,
        areMergedPropsEqual
      };

      console.log('%c=react-redux=connect返回selectorFactoryOptions', 'color:chartreuse', selectorFactoryOptions)

      function ConnectFunction(props) {
        console.log('%c=react-redux=ConnectFunction正式执行', 'color:chartreuse')
        const [propsContext, reactReduxForwardedRef, wrapperProps] = useMemo(() => {
          // Distinguish between actual "data" props that were passed to the wrapper component,
          // and values needed to control behavior (forwarded refs, alternate context instances).
          // To maintain the wrapperProps object reference, memoize this destructuring.
          const {
            reactReduxForwardedRef
          } = props,
            wrapperProps = _objectWithoutPropertiesLoose(props, _excluded);

          return [props.context, reactReduxForwardedRef, wrapperProps];
        }, [props]);
        const ContextToUse = useMemo(() => {
          // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
          // Memoize the check that determines which context instance we should use.
          return propsContext && propsContext.Consumer && // @ts-ignore
            isContextConsumer( /*#__PURE__*/React.createElement(propsContext.Consumer, null)) ? propsContext : Context;
        }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

        const contextValue = useContext(ContextToUse); // The store _must_ exist as either a prop or in context.
        // We'll check to see if it _looks_ like a Redux store first.
        // This allows us to pass through a `store` prop that is just a plain value.

        const didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
        const didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);

        if (process.env.NODE_ENV !== 'production' && !didStoreComeFromProps && !didStoreComeFromContext) {
          throw new Error(`Could not find "store" in the context of ` + `"${displayName}". Either wrap the root component in a <Provider>, ` + `or pass a custom React context provider to <Provider> and the corresponding ` + `React context consumer to ${displayName} in connect options.`);
        } // Based on the previous check, one of these must be true


        const store = didStoreComeFromProps ? props.store : contextValue.store;
        const getServerState = didStoreComeFromContext ? contextValue.getServerState : store.getState;
        const childPropsSelector = useMemo(() => {
          // The child props selector needs the store reference as an input.
          // Re-create this selector whenever the store changes.
          return defaultSelectorFactory(store.dispatch, selectorFactoryOptions);
        }, [store]);
        const [subscription, notifyNestedSubs] = useMemo(() => {
          console.log('=react-redux=ConnectFunction=阅的重点')
          if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
          // connected to the store via props shouldn't use subscription from context, or vice versa.

          const subscription = createSubscription(store, didStoreComeFromProps ? undefined : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
          // the middle of the notification loop, where `subscription` will then be null. This can
          // probably be avoided if Subscription's listeners logic is changed to not call listeners
          // that have been unsubscribed in the  middle of the notification loop.

          const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
          return [subscription, notifyNestedSubs];
        }, [store, didStoreComeFromProps, contextValue]); // Determine what {store, subscription} value should be put into nested context, if necessary,
        // and memoize that value to avoid unnecessary context updates.

        const overriddenContextValue = useMemo(() => {
          if (didStoreComeFromProps) {
            // This component is directly subscribed to a store from props.
            // We don't want descendants reading from this store - pass down whatever
            // the existing context value is from the nearest connected ancestor.
            return contextValue;
          } // Otherwise, put this component's subscription instance into context, so that
          // connected descendants won't update until after this component is done


          return _extends({}, contextValue, {
            subscription
          });
        }, [didStoreComeFromProps, contextValue, subscription]); // Set up refs to coordinate values between the subscription effect and the render logic

        const lastChildProps = useRef();
        const lastWrapperProps = useRef(wrapperProps);
        const childPropsFromStoreUpdate = useRef();
        const renderIsScheduled = useRef(false);
        const isProcessingDispatch = useRef(false);
        const isMounted = useRef(false);
        const latestSubscriptionCallbackError = useRef();
        useIsomorphicLayoutEffect(() => {
          isMounted.current = true;
          return () => {
            isMounted.current = false;
          };
        }, []);
        const actualChildPropsSelector = useMemo(() => {
          const selector = () => {
            // Tricky logic here:
            // - This render may have been triggered by a Redux store update that produced new child props
            // - However, we may have gotten new wrapper props after that
            // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
            // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
            // So, we'll use the child props from store update only if the wrapper props are the same as last time.
            if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
              return childPropsFromStoreUpdate.current;
            } // TODO We're reading the store directly in render() here. Bad idea?
            // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
            // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
            // to determine what the child props should be.


            return childPropsSelector(store.getState(), wrapperProps);
          };

          return selector;
        }, [store, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
        // about useLayoutEffect in SSR, so we try to detect environment and fall back to
        // just useEffect instead to avoid the warning, since neither will run anyway.

        const subscribeForReact = useMemo(() => {
          console.log('=react-redux=这里订阅了更新，并且返回一个注销订阅的函数')
          const subscribe = reactListener => {
            if (!subscription) {
              return () => { };
            }

            return subscribeUpdates(shouldHandleStateChanges, store, subscription, // @ts-ignore
              childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, reactListener);
          };

          return subscribe;
        }, [subscription]);
        useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, childPropsFromStoreUpdate, notifyNestedSubs]);
        let actualChildProps;

        try {
          // console.log("actualChildProps = useSyncExternalStore_connect1:", useSyncExternalStore)
          actualChildProps = useSyncExternalStore( // TODO We're passing through a big wrapper that does a bunch of extra side effects besides subscribing
            // actualChildProps = useSyncExternalStore_connect( // TODO We're passing through a big wrapper that does a bunch of extra side effects besides subscribing
            subscribeForReact, // TODO This is incredibly hacky. We've already processed the store update and calculated new child props,
            // TODO and we're just passing that through so it triggers a re-render for us rather than relying on `uSES`.
            actualChildPropsSelector, getServerState ? () => childPropsSelector(getServerState(), wrapperProps) : actualChildPropsSelector);
        } catch (err) {
          if (latestSubscriptionCallbackError.current) {
            ;
            err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`;
          }

          throw err;
        }

        useIsomorphicLayoutEffect(() => {
          latestSubscriptionCallbackError.current = undefined;
          childPropsFromStoreUpdate.current = undefined;
          lastChildProps.current = actualChildProps;
        }); // Now that all that's done, we can finally try to actually render the child component.
        // We memoize the elements for the rendered child component as an optimization.

        const renderedWrappedComponent = useMemo(() => {
          return (
            /*#__PURE__*/
            // @ts-ignore
            React.createElement(WrappedComponent, _extends({}, actualChildProps, {
              ref: reactReduxForwardedRef
            }))
          );
        }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
        // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

        const renderedChild = useMemo(() => {
          if (shouldHandleStateChanges) {
            // If this component is subscribed to store updates, we need to pass its own
            // subscription instance down to our descendants. That means rendering the same
            // Context instance, and putting a different value into the context.
            return /*#__PURE__*/React.createElement(ContextToUse.Provider, {
              value: overriddenContextValue
            }, renderedWrappedComponent);
          }

          return renderedWrappedComponent;
        }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
        return renderedChild;
      }

      const _Connect = React.memo(ConnectFunction);

      // Add a hacky cast to get the right output type
      const Connect = _Connect;
      Connect.WrappedComponent = WrappedComponent;
      Connect.displayName = ConnectFunction.displayName = displayName;

      if (forwardRef) {
        const _forwarded = React.forwardRef(function forwardConnectRef(props, ref) {

          console.log('%c=react-redux=ConnectFunction注入ConnectFunction1=createElement(Connect)', 'color:chartreuse')
          // @ts-ignore
          return /*#__PURE__*/React.createElement(Connect, _extends({}, props, {
            reactReduxForwardedRef: ref
          }));
        });

        const forwarded = _forwarded;
        forwarded.displayName = displayName;
        forwarded.WrappedComponent = WrappedComponent;
        // return hoistStatics(forwarded, WrappedComponent);
        return hoistNonReactStatics(forwarded, WrappedComponent);
      }

      // return hoistStatics(Connect, WrappedComponent);
      console.log('%c=react-redux=ConnectFunction注入ConnectFunction2=hoistNonReactStatics(Connect', 'color:chartreuse')
      return hoistNonReactStatics(Connect, WrappedComponent);
    };
    console.log('%c=react-redux=Connect函数返回', 'color:chartreuse', { wrapWithConnect })
    return wrapWithConnect;
  }
  // connect end
  // connect end

  // hook
  // hook
  // hook
  function useReduxContext() {
    const contextValue = useContext(ReactReduxContext);

    if (process.env.NODE_ENV !== 'production' && !contextValue) {
      throw new Error('could not find react-redux context value; please ensure the component is wrapped in a <Provider>');
    }

    return contextValue;
  }
  let useDefaultReduxContext = useReduxContext
  // let useSyncExternalStoreWithSelector = notInitialized;
  const initializeUseSelector = fn => {
    useSyncExternalStoreWithSelector = fn;
  };

  const refEquality = (a, b) => a === b;
  /**
   * Hook factory, which creates a `useSelector` hook bound to a given context.
   *
   * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
   * @returns {Function} A `useSelector` hook bound to the specified context.
   */


  function createSelectorHook(context = ReactReduxContext) {
    const useReduxContext = context === ReactReduxContext ? useDefaultReduxContext : () => useContext(context);
    return function useSelector(selector, equalityFn = refEquality) {
      if (process.env.NODE_ENV !== 'production') {
        if (!selector) {
          throw new Error(`You must pass a selector to useSelector`);
        }

        if (typeof selector !== 'function') {
          throw new Error(`You must pass a function as a selector to useSelector`);
        }

        if (typeof equalityFn !== 'function') {
          throw new Error(`You must pass a function as an equality function to useSelector`);
        }
      }

      const {
        store,
        subscription,
        getServerState
      } = useReduxContext();
      const selectedState = useSyncExternalStoreWithSelector(subscription.addNestedSub, store.getState, getServerState || store.getState, selector, equalityFn);
      useDebugValue(selectedState);
      return selectedState;
    };
  }

  var objectIs = typeof Object.is === 'function' ? Object.is : is;

  function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
    // Use this to track the rendered snapshot.
    var instRef = useRef(null);
    var inst;

    if (instRef.current === null) {
      inst = {
        hasValue: false,
        value: null
      };
      instRef.current = inst;
    } else {
      inst = instRef.current;
    }

    var _useMemo = useMemo(function () {
      // Track the memoized state using closure variables that are local to this
      // memoized instance of a getSnapshot function. Intentionally not using a
      // useRef hook, because that state would be shared across all concurrent
      // copies of the hook/component.
      var hasMemo = false;
      var memoizedSnapshot;
      var memoizedSelection;

      var memoizedSelector = function (nextSnapshot) {
        if (!hasMemo) {
          // The first time the hook is called, there is no memoized result.
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;

          var _nextSelection = selector(nextSnapshot);

          if (isEqual !== undefined) {
            // Even if the selector has changed, the currently rendered selection
            // may be equal to the new selection. We should attempt to reuse the
            // current value if possible, to preserve downstream memoizations.
            if (inst.hasValue) {
              var currentSelection = inst.value;

              if (isEqual(currentSelection, _nextSelection)) {
                memoizedSelection = currentSelection;
                return currentSelection;
              }
            }
          }

          memoizedSelection = _nextSelection;
          return _nextSelection;
        } // We may be able to reuse the previous invocation's result.


        // We may be able to reuse the previous invocation's result.
        var prevSnapshot = memoizedSnapshot;
        var prevSelection = memoizedSelection;

        if (objectIs(prevSnapshot, nextSnapshot)) {
          // The snapshot is the same as last time. Reuse the previous selection.
          return prevSelection;
        } // The snapshot has changed, so we need to compute a new selection.


        // The snapshot has changed, so we need to compute a new selection.
        var nextSelection = selector(nextSnapshot); // If a custom isEqual function is provided, use that to check if the data
        // has changed. If it hasn't, return the previous selection. That signals
        // to React that the selections are conceptually equal, and we can bail
        // out of rendering.

        // If a custom isEqual function is provided, use that to check if the data
        // has changed. If it hasn't, return the previous selection. That signals
        // to React that the selections are conceptually equal, and we can bail
        // out of rendering.
        if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
          return prevSelection;
        }

        memoizedSnapshot = nextSnapshot;
        memoizedSelection = nextSelection;
        return nextSelection;
      }; // Assigning this to a constant so that Flow knows it can't change.


      // Assigning this to a constant so that Flow knows it can't change.
      var maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot;

      var getSnapshotWithSelector = function () {
        return memoizedSelector(getSnapshot());
      };

      var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? undefined : function () {
        return memoizedSelector(maybeGetServerSnapshot());
      };
      return [getSnapshotWithSelector, getServerSnapshotWithSelector];
    }, [getSnapshot, getServerSnapshot, selector, isEqual]),
      getSelection = _useMemo[0],
      getServerSelection = _useMemo[1];

    var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
    useEffect(function () {
      inst.hasValue = true;
      inst.value = value;
    }, [value]);
    useDebugValue(value);
    return value;
  }

  /*
  function createDispatchHook(context = ReactReduxContext) {
    const useStore = // @ts-ignore
    context === ReactReduxContext ? useDefaultStore : createStoreHook(context);
    return function useDispatch() {
      const store = useStore(); // @ts-ignore
  
      return store.dispatch;
    };
  }
  */

  const useSelector = /*#__PURE__*/createSelectorHook();
  // hook end
  // hook end
  // hook end











  // Provider
  // Provider
  // Provider
  // const ReactReduxContext = /*#__PURE__*/createContext(null);
  function createListenerCollection() {
    // 对listener的收集，listener是一个双向链表
    const batch = getBatch();
    let first = null;
    let last = null;

    console.log('%c=react-redux=createListener创建listeners对象', 'color:cyan')

    return {
      clear() {
        first = null;
        last = null;
      },
      // 触发链表所有节点的回调
      notify() {
        batch(() => {
          let listener = first;
          console.log('%c=react-redux=notify触发链表所有节点的回调', 'color:blueviolet')

          while (listener) {
            listener.callback();
            listener = listener.next;
          }
        });
      },
      // 以数组的形式返回所有节点
      get() {
        let listeners = [];
        let listener = first;

        while (listener) {
          listeners.push(listener);
          listener = listener.next;
        }
        console.log('=react-redux=以数组的形式返回所有节点', 'color:blueviolet')

        return listeners;
      },

      // 用于向 listeners 链表添加一个订阅以及返回一个注销订阅的函数，涉及链表的增删操作
      subscribe(callback) {
        console.log('=react-redux=subscribe向 listeners 链表添加一个订阅以及返回一个注销订阅的函数，涉及链表的增删操作', 'color:blueviolet')
        let isSubscribed = true;
        // 创建一个链表节点
        let listener = last = {
          callback,
          next: null,
          prev: last
        };
        // 如果链表已经有了节点
        if (listener.prev) {
          listener.prev.next = listener;
        } else {
          // 如果链表还没有节点，它则是首节点
          first = listener;
        }
        // unsubscribe就是个双向链表的删除指定节点操作
        return function unsubscribe() {
          // 阻止无意义执行
          if (!isSubscribed || first === null) return;
          isSubscribed = false;
          // 如果添加的这个节点已经有了后续节点
          if (listener.next) {
            listener.next.prev = listener.prev;
          } else {
            // 没有则说明该节点是最后一个，将prev节点作为last节点
            last = listener.prev;
          }

          // 如果有前节点prev
          if (listener.prev) {
            // prev的next应该为该节点的next
            listener.prev.next = listener.next;
          } else {
            // 否则说明该节点是第一个，把它的next给first
            first = listener.next;
          }
        };
      }

    };
  }
  function defaultNoopBatch(callback) {
    callback();
  }

  let batch = defaultNoopBatch; // Allow injecting another batching function later

  const setBatch = newBatch => batch = newBatch; // Supply a getter just to skip dealing with ESM bindings

  const getBatch = () => batch;

  const nullListeners = {
    notify() { },

    get: () => []
  };
  function createSubscription(store, parentSub) {
    let unsubscribe;
    let listeners = nullListeners;
    // 收集订阅
    function addNestedSub(listener) {
      trySubscribe();
      const listenersRes = listeners.subscribe(listener)
      console.log('=react-redux=addNestedSub收集订阅', listenersRes)
      return listenersRes;
    }
    // 通知订阅
    function notifyNestedSubs() {
      console.log('=react-redux=notifyNestedSubs调用listeners.notify()通知订阅')
      listeners.notify();
    }
    // 自己的订阅回调
    function handleChangeWrapper() {
      if (subscription.onStateChange) {
        console.log('=react-redux=handleChangeWrapper,自己的订阅回调')
        subscription.onStateChange();
      }
    }
    // 判断自己是否被订阅
    function isSubscribed() {
      console.log('=react-redux=判断自己是否被订阅')
      return Boolean(unsubscribe);
    }
    // 让自己被父级订阅
    function trySubscribe() {
      if (!unsubscribe) {
        unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
        console.log('%c=react-redux=createSubscription调用createListenerCollectionlisteners对象', 'color:cyan')
        listeners = createListenerCollection();
      }
    }
    // 从父级注销自己的订阅
    function tryUnsubscribe() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
        listeners.clear();
        listeners = nullListeners;
      }
    }

    console.log('%c=react-redux=调用createSubscription参数store, parentSub', 'color:red')

    const subscription = {
      addNestedSub,
      notifyNestedSubs,
      handleChangeWrapper,
      isSubscribed,
      trySubscribe,
      tryUnsubscribe,
      getListeners: () => listeners
    };
    return subscription;
  }

  const canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  function Provider({
    store,
    context,
    children,
    serverState
  }) {
    const contextValue = useMemo(() => {
      console.log('%c=react-redux=Provider=调用createSubscription', 'color:yellow')
      const subscription = createSubscription(store);

      console.log('%c=react-redux=Provider=contextValue生成了一个用于context透传的对象，包含redux store、subscription,那具体这个组件想往下面透传什么呢?', 'color:yellow', {
        store, subscription, getServerState: serverState ? () => serverState : undefined
      })

      return {
        store,
        subscription,
        getServerState: serverState ? () => serverState : undefined
      };
    }, [store, serverState]);

    // 获取一次当前的redux state，因为后续子节点的渲染可能会修改state，所以它叫previousState
    const previousState = useMemo(() => store.getState(), [store]);

    useIsomorphicLayoutEffect(() => {
      const {
        subscription
      } = contextValue;
      // 设置subscription的onStateChange方法
      subscription.onStateChange = subscription.notifyNestedSubs;
      // 将subscription的更新回调订阅给父级，这里会订阅给redux
      subscription.trySubscribe();

      console.log('%c=react-redux=Provider=useIsomorphicLayoutEffect会在最后组件commit被调用', 'color:yellow')

      // 判断state经过渲染后是否变化，如果变化则触发所有子订阅更新
      if (previousState !== store.getState()) {
        subscription.notifyNestedSubs();
      }

      // 组件卸载时的注销操作
      return () => {
        subscription.tryUnsubscribe();
        subscription.onStateChange = undefined;
      };
    }, [contextValue, previousState]);

    const Context = context || ReactReduxContext; // @ts-ignore 'AnyAction' is assignable to the constraint of type 'A', but 'A' could be instantiated with a different subtype

    console.log('%c=react-redux=Provider=调用React.createElement参数Context.Provider:', 'color:yellow', Context.Provider, {
      value: contextValue
    }, 'children:', children)

    // 最终Provider组件只是为了将contextValue透传下去，组件UI完全使用children
    const providerRes = /*#__PURE__*/React.createElement(Context.Provider, {
      value: contextValue
    }, children);

    console.log('%c=Provider=调用React.createElement 返回一个组件:', 'color:yellow', providerRes)

    return providerRes
  }
  // Provider end
  // Provider end
  // Provider end



  exports.connect = connect;
  exports.Provider = Provider;
  exports.useSelector = useSelector
  exports.createSelectorHook = createSelectorHook


  exports.Children = Children;
  exports.Component = Component;
  exports.Fragment = REACT_FRAGMENT_TYPE;
  exports.Profiler = REACT_PROFILER_TYPE;
  exports.PureComponent = PureComponent;
  exports.StrictMode = REACT_STRICT_MODE_TYPE;
  exports.Suspense = REACT_SUSPENSE_TYPE;
  exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals$1;
  exports.cloneElement = cloneElement$1;
  exports.createContext = createContext;
  exports.createElement = createElement$1;
  exports.createFactory = createFactory;
  exports.createRef = createRef;
  exports.forwardRef = forwardRef;
  exports.isValidElement = isValidElement;
  exports.lazy = lazy;
  exports.memo = memo;
  exports.startTransition = startTransition;
  exports.unstable_act = act;
  exports.useCallback = useCallback;
  exports.useContext = useContext;
  exports.useDebugValue = useDebugValue;
  exports.useDeferredValue = useDeferredValue;
  exports.useEffect = useEffect;
  exports.useId = useId;
  exports.useImperativeHandle = useImperativeHandle;
  exports.useInsertionEffect = useInsertionEffect;
  exports.useLayoutEffect = useLayoutEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useRef = useRef;
  exports.useState = useState;
  exports.useSyncExternalStore = useSyncExternalStore;
  exports.useTransition = useTransition;
  exports.version = ReactVersion;

})));