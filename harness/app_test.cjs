var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports2.Activity = REACT_ACTIVITY_TYPE;
    exports2.Children = Children;
    exports2.Component = Component;
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.Profiler = REACT_PROFILER_TYPE;
    exports2.PureComponent = PureComponent;
    exports2.StrictMode = REACT_STRICT_MODE_TYPE;
    exports2.Suspense = REACT_SUSPENSE_TYPE;
    exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports2.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports2.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports2.cacheSignal = function() {
      return null;
    };
    exports2.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports2.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports2.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports2.isValidElement = isValidElement;
    exports2.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports2.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports2.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports2.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports2.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports2.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports2.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports2.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports2.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports2.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports2.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports2.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports2.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports2.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports2.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports2.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports2.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports2.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports2.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports2.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports2.version = "19.2.8";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports2, module2) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module2 && module2[requireString]).call(
              module2,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports2.Activity = REACT_ACTIVITY_TYPE;
      exports2.Children = fnName;
      exports2.Component = Component;
      exports2.Fragment = REACT_FRAGMENT_TYPE;
      exports2.Profiler = REACT_PROFILER_TYPE;
      exports2.PureComponent = PureComponent;
      exports2.StrictMode = REACT_STRICT_MODE_TYPE;
      exports2.Suspense = REACT_SUSPENSE_TYPE;
      exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports2.__COMPILER_RUNTIME = deprecatedAPIs;
      exports2.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports2.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports2.cacheSignal = function() {
        return null;
      };
      exports2.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports2.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports2.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports2.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports2.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports2.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports2.isValidElement = isValidElement;
      exports2.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports2.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports2.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports2.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports2.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports2.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports2.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports2.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports2.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports2.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports2.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports2.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports2.useId = function() {
        return resolveDispatcher().useId();
      };
      exports2.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports2.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports2.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports2.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports2.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports2.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports2.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports2.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports2.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports2.version = "19.2.8";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_production();
    } else {
      module2.exports = require_react_development();
    }
  }
});

// app_test.jsx
var app_test_exports = {};
__export(app_test_exports, {
  FULL_DATES: () => FULL_DATES,
  activeDates: () => activeDates,
  activeSlots: () => activeSlots,
  buildMemberResponse: () => buildMemberResponse,
  calculateBestTime: () => calculateBestTime,
  checkDeadlineStatus: () => checkDeadlineStatus,
  default: () => App,
  deriveRematchGate: () => deriveRematchGate,
  trackExtensionUpdate: () => trackExtensionUpdate,
  trackRematchUpdate: () => trackRematchUpdate
});
module.exports = __toCommonJS(app_test_exports);
var import_react = __toESM(require_react(), 1);
if (typeof window !== "undefined") {
  if (!document.getElementById("meetsync-geist-font")) {
    const link = document.createElement("link");
    link.id = "meetsync-geist-font";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-sans/style.css";
    document.head.appendChild(link);
  }
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    theme: { extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#302E33",
        primary: { DEFAULT: "#3C3A40", foreground: "#F7F7F8" },
        card: "#FFFFFF",
        secondary: "#EFEEF0",
        "muted-foreground": "#76717F",
        border: "#DBD9DE",
        ring: "#97929E",
        destructive: { DEFAULT: "#E03434", foreground: "#FFFAF5" },
        success: { DEFAULT: "#02B541", foreground: "#F0FCF8" },
        warning: { DEFAULT: "#E39219", foreground: "#FFFDF5" },
        unavail: "#76717F",
        block: "#DBD9DE",
        unset: "#FFFFFF",
        devpanel: { DEFAULT: "#3C3A40", foreground: "#C9C6CE" }
      },
      borderRadius: { md: "8px", xl: "14px" },
      fontFamily: { sans: ["Geist", "sans-serif"] }
    } }
  };
}
var T = {
  background: "bg-background",
  foreground: "text-foreground",
  primary: "bg-primary",
  primaryForeground: "text-primary-foreground",
  card: "bg-card",
  success: "bg-success",
  successLight: "bg-success/10",
  textSuccess: "text-success",
  warning: "bg-warning",
  warningLight: "bg-warning/10",
  textWarning: "text-warning",
  unavail: "bg-unavail",
  block: "bg-block",
  unset: "bg-unset",
  destructiveLight: "bg-destructive/10",
  borderDestructive: "border-destructive/20",
  textDestructive: "text-destructive",
  mutedForeground: "text-muted-foreground",
  border: "border-border",
  devpanel: "bg-devpanel",
  devpanelForeground: "text-devpanel-foreground",
  disabled: "opacity-40 pointer-events-none",
  pScreen: "p-6",
  pCard: "p-4",
  roundedContainer: "rounded-xl",
  roundedElement: "rounded-md",
  pressed: "transition-all active:scale-[0.98]"
};
var HEAT_RAMP_BY_COUNT = { 0: "bg-[#EFEEF0]", 1: "bg-success/15", 2: "bg-success/30", 3: "bg-success/45", 4: "bg-success/60", 5: "bg-success/80", 6: "bg-success" };
var RING_CONFIRMED = "ring-2 ring-success";
var RING_SELECTED = "ring-2 ring-ring";
var CONFIRMED_BG = `${T.primary} ${T.primaryForeground}`;
var STORAGE_KEY = "meeting-demo-state";
var FULL_DATES = ["2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20", "2026-07-21", "2026-07-22"];
var DAY_LABEL = { "2026-07-13": "\uC6D4", "2026-07-14": "\uD654", "2026-07-15": "\uC218", "2026-07-16": "\uBAA9", "2026-07-17": "\uAE08", "2026-07-18": "\uD1A0", "2026-07-19": "\uC77C", "2026-07-20": "\uC6D4", "2026-07-21": "\uD654", "2026-07-22": "\uC218" };
var HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
var slotKeyOf = (date, h) => `${date}T${String(h).padStart(2, "0")}:00`;
var FULL_ALL_SLOTS = FULL_DATES.flatMap((d) => HOURS.map((h) => slotKeyOf(d, h)));
var activeDates = (period) => FULL_DATES.filter((d) => d >= period.start && d <= period.end);
var activeSlots = (period) => activeDates(period).flatMap((d) => HOURS.map((h) => slotKeyOf(d, h)));
var fmtSlot = (sk) => {
  const [d, t] = sk.split("T");
  return `${d.slice(5, 7)}/${d.slice(8, 10)} (${DAY_LABEL[d]}) ${t}`;
};
var fmtDeadline = (cp) => {
  const d = cp.end;
  return `${d.slice(5, 7)}.${d.slice(8, 10)} (${DAY_LABEL[d] || ""}) ${cp.endTime}`;
};
var fmtPeriod = (p) => `${p.start.slice(5, 7)}.${p.start.slice(8, 10)} (${DAY_LABEL[p.start]}) ~ ${p.end.slice(5, 7)}.${p.end.slice(8, 10)} (${DAY_LABEL[p.end]})`;
function applyContextBuffer(externalEvents) {
  const keywords = ["\uC678\uADFC", "\uCD9C\uC7A5", "\uBBF8\uD305", "\uC624\uD504\uB77C\uC778"];
  const out = {};
  externalEvents.forEach((ev) => {
    if (!keywords.some((k) => ev.title.includes(k))) return;
    const toH = (t) => parseInt(t.slice(0, 2), 10) + parseInt(t.slice(3, 5), 10) / 60;
    const bufStart = toH(ev.start) - 0.5, bufEnd = toH(ev.end) + 0.5;
    HOURS.forEach((h) => {
      if (h < bufEnd && h + 1 > bufStart) {
        out[ev.memberId] = out[ev.memberId] || {};
        out[ev.memberId][slotKeyOf(ev.date, h)] = "BLOCK_STRICT";
      }
    });
  });
  return out;
}
function buildSeedData() {
  return {
    meetingId: "mock-meeting-777",
    title: "\uD300 \uC8FC\uAC04 \uC2F1\uD06C \uBC0F \uD558\uBC18\uAE30 \uAE30\uD68D \uB9AC\uBDF0",
    duration: "1h",
    durationLabel: "1h",
    // v2.4 (발견 67) — H01 드롭다운 실제 선택값
    // v2.0 (발견 77, [PRD-PERIOD-SPLIT]) — 조율 기간(응답 마감 포함)과 회의 후보 날짜를 완전히 분리한 필드
    coordinationPeriod: { start: "2026-07-13", end: "2026-07-15", endTime: "18:00" },
    // 종료 시각이 곧 응답 마감
    candidatePeriod: { start: "2026-07-16", end: "2026-07-18" },
    // coordinationPeriod.end 다음 날부터
    status: "PROGRESS",
    confirmedSlot: null,
    droppedMemberId: null,
    dropReason: null,
    // "SELF_CANCEL" | "WEBHOOK" — v1.6 경로 구분 (PRD 5.5)
    forceClosed: false,
    launched: false,
    // 발의 사건 — 유입 트리거·가드·권한 잠금 기준 (v1.5)
    nudgedIds: [],
    // 독촉 발송 기록 ⑧
    reRequestedIds: [],
    // 재요청 발송 기록 ⑧
    declinedOptionalIds: [],
    // 참조자 불참 기록 ⑨ — CONFLICT 전이 시 초기화
    demotedIds: [],
    // 강등 이력 — 당사자 배너 판별 (PRD 2.5-⑤)
    demotedReasons: {},
    // v2.2 (발견 64): { memberId: slotKey } — 강등 사유가 된 슬롯, 당사자 배너 근거 표기용
    demoteNotes: {},
    // v2.3: { memberId: string } — 강등 시 남긴 의견(선택)
    promotionRequests: [],
    // v2.3: [{ id: memberId, status: "PENDING"|"REJECTED" }] — 역강등 요청 [PRD-PROMOTE-REQUEST]. v2.5(발견 80): 거절은 삭제 대신 REJECTED로 유지
    reinstateRequests: [],
    // v2.5 신설: [{ id: memberId, status: "PENDING"|"REJECTED", reason }] — 필수 복귀 요청 [PRD-REINSTATE-REQUEST], 발견 81
    periodExtendedFrom: null,
    // v2.5 신설: 마지막 기간 확장 직전 candidatePeriod.end — 신규 날짜 판별 기준, 발견 79
    reMatchUpdatedIds: [],
    // v2.5 신설: CONFLICT 진입 이후 가용성 갱신한 멤버 id — 재조율 반영 현황, 발견 83
    extensionUpdatedIds: [],
    // v2.7 신설: 기간 확장(periodExtendedFrom) 이후 실제로 재제출한 멤버 id — 제출 현황 재대기, 발견 86
    cancelReason: null,
    // v2.3: 회의 폐기 사유 (선택) [PRD-CANCEL-MEETING]
    blockReasons: { m2: "\uC678\uADFC (\uACE0\uAC1D\uC0AC \uBC29\uBB38) \xB7 \uC774\uB3D9 \uBC84\uD37C 30\uBD84", m4: "\uD655\uC815 \uC9C1\uC804 \uB4F1\uB85D\uB41C \uC678\uBD80 \uC77C\uC815" },
    members: [
      { id: "m1", name: "\uAE40\uC8FC\uCD5C", email: "host@company.com", role: "HOST", attendance: "REQUIRED", status: "PENDING" },
      { id: "m2", name: "\uC774\uB514\uC790", email: "design@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m3", name: "\uCD5C\uAC1C\uBC1C", email: "dev@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m4", name: "\uBC15\uAE30\uD68D", email: "pm@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m5", name: "\uC815\uB9C8\uCF00", email: "mkt@company.com", role: "MEMBER", attendance: "OPTIONAL", status: "PENDING" },
      { id: "m6", name: "\uBC15\uAC1C\uBC1C", email: "dev2@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" }
      // [PRD-EX-03 타겟]
    ],
    availability: {}
  };
}
var ARRIVAL_ORDER = ["m1", "m2", "m3", "m4", "m5"];
var MEMBER_AVOIDS = {
  // v2.5 (발견 77) — 후보 날짜 이동에 맞춰 같은 상대 일자로 재배치 (day0=07/16, day1=07/17, day2=07/18)
  m1: ["2026-07-17T13:00", "2026-07-18T09:00"],
  // 점심 직후 회피 [PRD-BRIEF]
  m2: ["2026-07-17T13:00"],
  m3: ["2026-07-16T09:00", "2026-07-16T10:00"],
  m4: ["2026-07-18T16:00", "2026-07-18T17:00"],
  m5: ["2026-07-17T14:00", "2026-07-16T15:00"]
};
function buildMemberResponse(memberId, candidatePeriod) {
  const grid = {};
  activeSlots(candidatePeriod).forEach((sk) => {
    grid[sk] = "AVAILABLE";
  });
  (MEMBER_AVOIDS[memberId] || []).forEach((sk) => {
    grid[sk] = "AVOID";
  });
  if (memberId === "m2") {
    const blocks = applyContextBuffer([
      { memberId: "m2", title: "\uC678\uADFC (\uACE0\uAC1D\uC0AC \uBC29\uBB38)", date: "2026-07-17", start: "11:00", end: "12:00" }
      // v2.5 (발견 77) 날짜 이동
    ]);
    Object.assign(grid, blocks.m2 || {});
  }
  return grid;
}
function commitMeeting(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : buildSeedData();
  } catch (e) {
    return buildSeedData();
  }
}
function intersect(av, group, allowAvoid, slots) {
  if (!group.length) return [];
  return slots.filter(
    (sk) => group.every((m) => {
      const v = (av[m.id] || {})[sk];
      return v === "AVAILABLE" || allowAvoid && v === "AVOID";
    })
  );
}
function partialFit(av, required, slots) {
  const scored = slots.map((sk) => {
    const absentees = [];
    let fit = 0;
    required.forEach((m) => {
      const v = (av[m.id] || {})[sk];
      if (v === "AVAILABLE" || v === "AVOID") fit += 1;
      else absentees.push({ id: m.id, name: m.name, reason: v === "UNAVAILABLE" ? "UNAVAILABLE" : v === "BLOCK_STRICT" ? "BLOCK" : "UNSET" });
    });
    return { slotKey: sk, fit, absentees };
  });
  const max = Math.max(...scored.map((s) => s.fit));
  return scored.filter((s) => s.fit === max);
}
function calculateBestTime(av, members, options = {}) {
  const excluded = new Set(options.excludeIds || []);
  const responders = members.filter((m) => m.status === "SUBMITTED" && !excluded.has(m.id));
  const required = responders.filter((m) => m.attendance === "REQUIRED");
  const optionals = responders.filter((m) => m.attendance === "OPTIONAL");
  const excludedCount = members.length - responders.length;
  const slots = options.slots || FULL_ALL_SLOTS;
  let pool, level;
  pool = intersect(av, responders, false, slots);
  level = 0;
  if (!pool.length) {
    pool = intersect(av, required, false, slots);
    level = 1;
  }
  if (!pool.length) {
    pool = intersect(av, required, true, slots);
    level = 2;
  }
  let items;
  if (!pool.length) {
    items = partialFit(av, required, slots);
    level = 3;
  } else items = pool.map((sk) => ({ slotKey: sk, fit: 0, absentees: [] }));
  const meta = (sk) => ({
    avoidRequired: required.filter((m) => (av[m.id] || {})[sk] === "AVOID").length,
    optAvail: optionals.filter((m) => (av[m.id] || {})[sk] === "AVAILABLE").length,
    t: FULL_ALL_SLOTS.indexOf(sk)
    // 정렬 기준은 항상 전체 범위 인덱스(시간순 일관성 유지)
  });
  items.sort((a, b) => {
    const A = meta(a.slotKey), B = meta(b.slotKey);
    if (level === 3 && b.fit !== a.fit) return b.fit - a.fit;
    if (A.avoidRequired !== B.avoidRequired) return A.avoidRequired - B.avoidRequired;
    if (B.optAvail !== A.optAvail) return B.optAvail - A.optAvail;
    return A.t - B.t;
  });
  return items.slice(0, 3).map((it) => {
    let label, tone, subline = "", subNames = [], reRequestTargets = [], blockNames = [];
    if (level === 0) {
      label = excludedCount > 0 ? "\uC81C\uCD9C\uD55C \uC0AC\uB78C\uC740 \uBAA8\uB450 \uAC00\uB2A5\uD574\uC694" : "\uBAA8\uB450 \uAC00\uB2A5\uD55C \uC2DC\uAC04\uC774\uC5D0\uC694";
      tone = "ok";
    } else if (level === 1) {
      subNames = optionals.map((m) => m.name);
      label = `\uC120\uD0DD \uCC38\uC11D\uC790 ${subNames.length}\uBA85 \uBE7C\uACE0 \uAC00\uB2A5\uD574\uC694`;
      tone = "warn";
      subline = `\uBE60\uC9C4 \uC120\uD0DD \uCC38\uC11D\uC790: ${subNames.join(", ")}`;
    } else if (level === 2) {
      subNames = required.filter((m) => (av[m.id] || {})[it.slotKey] === "AVOID").map((m) => m.name);
      label = "\uC77C\uBD80\uB294 \uD53C\uD558\uACE0 \uC2F6\uC740 \uC2DC\uAC04\uC774\uC5D0\uC694";
      tone = "warn";
      subline = `\uD53C\uD558\uACE0 \uC2F6\uC740 \uC2DC\uAC04\uB300: ${subNames.join(", ")}`;
    } else {
      const unav = it.absentees.filter((a) => a.reason === "UNAVAILABLE").map((a) => a.name);
      blockNames = it.absentees.filter((a) => a.reason === "BLOCK").map((a) => a.name);
      const unset = it.absentees.filter((a) => a.reason === "UNSET").map((a) => a.name);
      subNames = it.absentees.map((a) => a.name);
      reRequestTargets = it.absentees.filter((a) => a.reason !== "BLOCK");
      label = `${it.absentees.length}\uBA85\uC740 \uCC38\uC11D \uBABB \uD574\uC694`;
      tone = "danger";
      const hard = [...unav, ...blockNames.map((n) => `${n}(\uB2E4\uB978 \uC77C\uC815 \uC788\uC74C)`)];
      const parts = [];
      if (hard.length) parts.push(`\uCC38\uC11D \uBABB \uD568: ${hard.join(", ")}`);
      if (unset.length) parts.push(`\uC544\uC9C1 \uB2F5 \uC548 \uD568: ${unset.join(", ")}`);
      subline = parts.join(" \xB7 ");
    }
    return { slotKey: it.slotKey, level, label, tone, subline, subNames, reRequestTargets, blockNames, absentees: it.absentees };
  });
}
function checkDeadlineStatus(meeting, scenario) {
  const pendingRequired = meeting.members.filter((m) => m.attendance === "REQUIRED" && m.status === "PENDING");
  const reached = scenario.virtualClock === "DEADLINE_REACHED";
  return {
    alertBannerActive: reached && pendingRequired.length > 0 && !meeting.forceClosed,
    shouldBlockResult: pendingRequired.length > 0 && !meeting.forceClosed,
    pendingList: pendingRequired.map((m) => m.name),
    pendingIds: pendingRequired.map((m) => m.id)
  };
}
function buildHeatmap(meeting) {
  const responders = meeting.members.filter((m) => m.status === "SUBMITTED");
  const map = {};
  activeSlots(meeting.candidatePeriod).forEach((sk) => {
    const detail = responders.map((m) => {
      const v = (meeting.availability[m.id] || {})[sk];
      const state = v === "AVAILABLE" ? "AVAILABLE" : v === "AVOID" ? "AVOID" : v === "UNAVAILABLE" ? "UNAVAILABLE" : v === "BLOCK_STRICT" ? "BLOCK" : "UNSET";
      return { name: m.name, isOptional: m.attendance === "OPTIONAL", state };
    });
    map[sk] = { count: detail.filter((d) => d.state === "AVAILABLE").length, detail };
  });
  return map;
}
var heatToken = (count) => HEAT_RAMP_BY_COUNT[Math.max(0, Math.min(count, 6))];
var HEAT_STATE_LABEL = { AVAILABLE: "\uAC00\uB2A5", AVOID: "\uD53C\uD558\uACE0 \uC2F6\uC74C", UNAVAILABLE: "\uC548 \uB418\uB294 \uC2DC\uAC04", BLOCK: "\uB2E4\uB978 \uC77C\uC815 \uC788\uC74C", UNSET: "\uC544\uC9C1 \uB2F5 \uC548 \uD568" };
function absenceReason(member, meeting) {
  if (meeting.declinedOptionalIds?.includes(member.id)) return "SELF_DECLINED";
  if (member.status !== "SUBMITTED") return "UNCONFIRMED";
  const v = (meeting.availability[member.id] || {})[meeting.confirmedSlot];
  if (v !== "AVAILABLE" && v !== "AVOID") return "UNAVAILABLE_SLOT";
  return null;
}
var ABSENCE_LABEL = {
  UNCONFIRMED: (name) => `\uBBF8\uD655\uC778 (\uB9C8\uAC10\uAE4C\uC9C0 \uB2F5 \uC5C6\uC5C8\uC74C): ${name}`,
  UNAVAILABLE_SLOT: (name) => `\uCC38\uC11D \uBABB \uD568: ${name}`,
  SELF_DECLINED: (name) => `\uBD88\uCC38 \uC54C\uB9BC: ${name}`
};
function deriveAbsentees(meeting) {
  const required = meeting.members.filter((m) => m.attendance === "REQUIRED");
  return required.filter((m) => {
    if (meeting.status === "CONFLICT" && m.id === meeting.droppedMemberId) return true;
    return absenceReason(m, meeting) !== null;
  });
}
function upsertRequest(list, id, reason) {
  return [...list.filter((r) => r.id !== id), { id, status: "PENDING", reason: reason || null }];
}
function removeRequest(list, id) {
  return list.filter((r) => r.id !== id);
}
function rejectRequest(list, id) {
  return list.map((r) => r.id === id ? { ...r, status: "REJECTED" } : r);
}
function acknowledgeRejection(list, id) {
  return list.filter((r) => !(r.id === id && r.status === "REJECTED"));
}
function findPending(list) {
  return list.find((r) => r.status === "PENDING") || null;
}
function isPending(list, id) {
  return list.some((r) => r.id === id && r.status === "PENDING");
}
function isRejected(list, id) {
  return list.some((r) => r.id === id && r.status === "REJECTED");
}
function isNewlyAddedDate(date, periodExtendedFrom) {
  return periodExtendedFrom != null && date > periodExtendedFrom;
}
function deriveRematchGate(meeting) {
  const requiredToReflect = meeting.members.filter((m) => m.attendance === "REQUIRED");
  const pending = requiredToReflect.filter((m) => !meeting.reMatchUpdatedIds.includes(m.id));
  return { blocked: pending.length > 0, pendingNames: pending.map((m) => m.name) };
}
function trackExtensionUpdate(extensionUpdatedIds, meetingStatus, periodExtendedFrom, memberId) {
  if (meetingStatus !== "PROGRESS" || periodExtendedFrom == null) return extensionUpdatedIds;
  return [.../* @__PURE__ */ new Set([...extensionUpdatedIds, memberId])];
}
function trackRematchUpdate(reMatchUpdatedIds, meetingStatus, memberId) {
  if (meetingStatus !== "CONFLICT") return reMatchUpdatedIds;
  return [.../* @__PURE__ */ new Set([...reMatchUpdatedIds, memberId])];
}
function deriveStep(meeting, currentPath) {
  if (meeting.status === "CANCELLED") return 4;
  if (meeting.status === "COMPLETED") return 4;
  if (meeting.status === "CONFLICT") return 3;
  const required = meeting.members.filter((m) => m.attendance === "REQUIRED");
  const allIn = required.every((m) => m.status === "SUBMITTED") || meeting.forceClosed;
  if (allIn) return 3;
  if (currentPath === "/host/create") return 1;
  return 2;
}
function resolveRoute(path, meeting) {
  if (path === "/" || path === "/guide") return path;
  if (meeting.status === "CANCELLED") {
    if (path === "/host/create" || path === "/host/re-match") return "/host/dashboard";
    return path;
  }
  if (!meeting.launched && !["/", "/guide", "/host/create"].includes(path)) return "/host/create";
  if (meeting.status === "COMPLETED") {
    if (path === "/host/create") return "/host/dashboard";
    return path;
  }
  if (meeting.status === "CONFLICT") {
    if (path === "/host/create" || path === "/host/dashboard") return "/host/re-match";
    return path;
  }
  return path;
}
function App() {
  const [meeting, setMeeting] = (0, import_react.useState)(loadInitialState);
  const [scenario, setScenario] = (0, import_react.useState)({ virtualClock: "BEFORE_DEADLINE", ex04Conflict: false });
  const [panelVisible, setPanelVisible] = (0, import_react.useState)(false);
  const [currentPath, setCurrentPath] = (0, import_react.useState)("/");
  const [attendeeStage, setAttendeeStage] = (0, import_react.useState)("INVITE");
  const [currentMemberId, setCurrentMemberId] = (0, import_react.useState)(null);
  const [tempGrid, setTempGrid] = (0, import_react.useState)({});
  const [alertBanner, setAlertBanner] = (0, import_react.useState)(null);
  const [toast, setToast] = (0, import_react.useState)(null);
  const [syncChecking, setSyncChecking] = (0, import_react.useState)(false);
  const [heatOpen, setHeatOpen] = (0, import_react.useState)(false);
  const [heatSelected, setHeatSelected] = (0, import_react.useState)(null);
  const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(null);
  const [cancelStage, setCancelStage] = (0, import_react.useState)(null);
  const [lateJoinId, setLateJoinId] = (0, import_react.useState)(null);
  const [proactiveOffer, setProactiveOffer] = (0, import_react.useState)(null);
  const [cancelReasonDraft, setCancelReasonDraft] = (0, import_react.useState)("");
  const [demoteNoteDraft, setDemoteNoteDraft] = (0, import_react.useState)("");
  const [promoteReasonDraft, setPromoteReasonDraft] = (0, import_react.useState)("");
  const [reinstateReasonDraft, setReinstateReasonDraft] = (0, import_react.useState)("");
  const [conflictEdit, setConflictEdit] = (0, import_react.useState)(null);
  const [newCardKeys, setNewCardKeys] = (0, import_react.useState)([]);
  const [ex04FailedSlots, setEx04FailedSlots] = (0, import_react.useState)([]);
  const toastTimer = (0, import_react.useRef)(null);
  const arrivalTimer = (0, import_react.useRef)(null);
  const preCancelSnapshot = (0, import_react.useRef)(null);
  const logoTaps = (0, import_react.useRef)([]);
  const dragRef = (0, import_react.useRef)({ active: false, apply: null });
  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };
  const showAlertBanner = (message, cause) => setAlertBanner({ message, cause });
  const clearBannerByCause = (cause) => setAlertBanner((b) => b && b.cause === cause ? null : b);
  const navigate = (path) => {
    const r = resolveRoute(path, meeting);
    if (r === "/attendee" && currentPath !== "/attendee") setAttendeeStage("INVITE");
    setCurrentPath(r);
    setConfirmOpen(null);
    setCancelStage(null);
    setConflictEdit(null);
    setNewCardKeys([]);
  };
  (0, import_react.useEffect)(() => {
    const r = resolveRoute(currentPath, meeting);
    if (r !== currentPath) setCurrentPath(r);
  }, [meeting.status, meeting.launched]);
  (0, import_react.useEffect)(() => {
    setHeatOpen(false);
    setHeatSelected(null);
    setConfirmOpen(null);
    setCancelStage(null);
    setConflictEdit(null);
  }, [meeting.status]);
  (0, import_react.useEffect)(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === null) {
        setMeeting(buildSeedData());
        return;
      }
      try {
        setMeeting(JSON.parse(e.newValue));
      } catch (err) {
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  (0, import_react.useEffect)(() => {
    const nextId = ARRIVAL_ORDER.find((id) => meeting.members.find((m) => m.id === id).status === "PENDING");
    if (!(meeting.launched && meeting.status === "PROGRESS" && nextId)) return;
    arrivalTimer.current = setTimeout(() => {
      setMeeting((prev) => {
        if (prev.status !== "PROGRESS" || !prev.launched) return prev;
        const id = ARRIVAL_ORDER.find((i) => prev.members.find((m) => m.id === i).status === "PENDING");
        if (!id) return prev;
        return commitMeeting({
          // 커밋 ①
          ...prev,
          availability: { ...prev.availability, [id]: buildMemberResponse(id, prev.candidatePeriod) },
          // v2.4(발견 88) — 그 회의의 실제 후보 기간 기준
          members: prev.members.map((m) => m.id === id ? { ...m, status: "SUBMITTED" } : m)
        });
      });
    }, 1e3);
    return () => clearTimeout(arrivalTimer.current);
  }, [meeting]);
  (0, import_react.useEffect)(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setPanelVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const onLogoTap = () => {
    const now = performance.now();
    logoTaps.current = [...logoTaps.current.filter((t) => now - t < 2e3), now];
    if (logoTaps.current.length >= 5) {
      setPanelVisible((v) => !v);
      logoTaps.current = [];
    }
  };
  const nudge = (ids) => {
    setMeeting((prev) => commitMeeting({ ...prev, nudgedIds: [.../* @__PURE__ */ new Set([...prev.nudgedIds, ...ids])] }));
    showToast("\uB2E4\uC2DC \uC54C\uB9BC\uC744 \uBCF4\uB0C8\uC5B4\uC694");
  };
  const sendReRequest = (targets) => {
    setMeeting((prev) => commitMeeting({ ...prev, reRequestedIds: [.../* @__PURE__ */ new Set([...prev.reRequestedIds, ...targets.map((t) => t.id)])] }));
    showToast(`${targets.map((t) => t.name).join(", ")}\uB2D8\uC5D0\uAC8C \uB2E4\uC2DC \uC694\uCCAD\uD588\uC5B4\uC694`);
  };
  const demoteMember = (id, slotKey, note) => {
    setMeeting((prev) => {
      const name = prev.members.find((m) => m.id === id).name;
      showToast(`${name}\uB2D8\uC5D0\uAC8C \uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uB00C\uC5C8\uB2E4\uACE0 \uC54C\uB838\uC5B4\uC694`);
      return commitMeeting({
        ...prev,
        members: prev.members.map((m) => m.id === id ? { ...m, attendance: "OPTIONAL" } : m),
        demotedIds: [.../* @__PURE__ */ new Set([...prev.demotedIds, id])],
        demotedReasons: slotKey ? { ...prev.demotedReasons, [id]: slotKey } : prev.demotedReasons,
        // v2.2 (발견 64)
        demoteNotes: note ? { ...prev.demoteNotes, [id]: note } : prev.demoteNotes,
        // v2.3
        promotionRequests: prev.promotionRequests.filter((r) => r.id !== id)
        // 요청 기반 승인이었다면 정리
      });
    });
    setConfirmOpen(null);
  };
  const cancelMeeting = (reason) => {
    setMeeting(commitMeeting({ ...meeting, status: "CANCELLED", cancelReason: reason || null }));
    setConfirmOpen(null);
  };
  const requestPromotion = (id, reason) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: upsertRequest(meeting.promotionRequests, id, reason) }));
    showToast("\uCC38\uC870\uC790 \uC804\uD658\uC744 \uC694\uCCAD\uD588\uC5B4\uC694");
    setConfirmOpen(null);
  };
  const cancelPromotionRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: removeRequest(meeting.promotionRequests, id) }));
    showToast("\uC694\uCCAD\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694");
  };
  const approvePromotionRequest = (id) => {
    const target = meeting.members.find((m) => m.id === id);
    demoteMember(id, null, null);
    showToast(`${target.name}\uB2D8\uC758 \uC694\uCCAD\uC744 \uC2B9\uC778\uD588\uC5B4\uC694`);
  };
  const rejectPromotionRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: rejectRequest(meeting.promotionRequests, id) }));
    showToast("\uC694\uCCAD\uC744 \uAC70\uC808\uD588\uC5B4\uC694");
  };
  const acknowledgePromotionRejection = (id) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: acknowledgeRejection(meeting.promotionRequests, id) }));
  };
  const requestReinstate = (id, reason) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: upsertRequest(meeting.reinstateRequests, id, reason) }));
    showToast("\uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uB418\uACE0 \uC2F6\uB2E4\uACE0 \uC694\uCCAD\uD588\uC5B4\uC694");
    setConfirmOpen(null);
  };
  const cancelReinstateRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: removeRequest(meeting.reinstateRequests, id) }));
    showToast("\uC694\uCCAD\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694");
  };
  const approveReinstateRequest = (id) => {
    const target = meeting.members.find((m) => m.id === id);
    setMeeting((prev) => commitMeeting({
      ...prev,
      members: prev.members.map((m) => m.id === id ? { ...m, attendance: "REQUIRED" } : m),
      reinstateRequests: removeRequest(prev.reinstateRequests, id)
    }));
    showToast(`${target.name}\uB2D8\uC744 \uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uB85C \uC804\uD658\uD588\uC5B4\uC694`);
  };
  const rejectReinstateRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: rejectRequest(meeting.reinstateRequests, id) }));
    showToast("\uC694\uCCAD\uC744 \uAC70\uC808\uD588\uC5B4\uC694");
  };
  const acknowledgeReinstateRejection = (id) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: acknowledgeRejection(meeting.reinstateRequests, id) }));
  };
  const extendPeriod = () => {
    const idx = FULL_DATES.indexOf(meeting.candidatePeriod.end);
    const newEnd = FULL_DATES[Math.min(idx + 2, FULL_DATES.length - 1)];
    setMeeting(commitMeeting({
      ...meeting,
      candidatePeriod: { ...meeting.candidatePeriod, end: newEnd },
      periodExtendedFrom: meeting.candidatePeriod.end,
      // v2.5(발견 79) — A01이 신규 날짜 강조에 사용
      extensionUpdatedIds: []
      // v2.7(발견 86) — 새 확장 세션 시작, 이전 확장의 재제출 기록 리셋
    }));
    showToast("\uC870\uC728 \uAE30\uAC04\uC744 \uB113\uD614\uC5B4\uC694 \u2014 \uB2E4\uC2DC \uACC4\uC0B0\uD560\uAC8C\uC694");
  };
  const cancelAttendance = (id) => {
    const m = meeting.members.find((x) => x.id === id);
    if (m.attendance === "REQUIRED") {
      const slot = meeting.confirmedSlot;
      preCancelSnapshot.current = meeting;
      const next = commitMeeting({
        ...meeting,
        status: "CONFLICT",
        droppedMemberId: id,
        dropReason: "SELF_CANCEL",
        // 슬롯 단위 거절 — 재조율에 계속 참여 [PRD-CANCEL-SCOPE]
        availability: { ...meeting.availability, [id]: { ...meeting.availability[id], [slot]: "UNAVAILABLE" } },
        declinedOptionalIds: [],
        reMatchUpdatedIds: [id]
        // v2.7 정정(발견 84) — 이탈 선언 자체가 본인의 갱신, [] 대신 [본인id]로 시작
      });
      setMeeting(next);
      showAlertBanner(`${m.name}\uB2D8\uC774 \uCC38\uC11D\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.`, "EX05");
      const nextTop3 = calculateBestTime(next.availability, next.members, { excludeIds: [], slots: activeSlots(next.candidatePeriod) });
      const topSlot = nextTop3.length && nextTop3[0].level !== 3 ? nextTop3[0] : null;
      const eligible = topSlot && ["AVAILABLE", "AVOID"].includes((next.availability[id] || {})[topSlot.slotKey]);
      selectMember(id);
      setConflictEdit(eligible ? "QUICK" : "GRID");
    } else {
      setMeeting(commitMeeting({ ...meeting, declinedOptionalIds: [.../* @__PURE__ */ new Set([...meeting.declinedOptionalIds, id])] }));
      showToast("\uC8FC\uCD5C\uC790\uC5D0\uAC8C \uBD88\uCC38 \uC54C\uB9BC\uC744 \uC804\uC1A1\uD588\uC2B5\uB2C8\uB2E4");
    }
    setCancelStage(null);
  };
  const handleConflictBack = () => {
    if (preCancelSnapshot.current) {
      setMeeting(commitMeeting(preCancelSnapshot.current));
      preCancelSnapshot.current = null;
      setConflictEdit(null);
      showToast("\uCC38\uC11D \uCDE8\uC18C\uB97C \uCDE8\uC18C\uD588\uC5B4\uC694");
    } else {
      setConflictEdit("AUTH");
    }
  };
  const fireDropout = () => {
    if (meeting.status !== "COMPLETED") return;
    const slot = meeting.confirmedSlot;
    setMeeting(commitMeeting({
      ...meeting,
      status: "CONFLICT",
      droppedMemberId: "m3",
      dropReason: "WEBHOOK",
      declinedOptionalIds: [],
      reMatchUpdatedIds: [],
      // v2.3(발견 87) — 본인의 선언 행위가 아니므로 [본인id]로 시작하지 않는다. 그리드 재진입해야 갱신 인정
      availability: { ...meeting.availability, m3: { ...meeting.availability.m3, [slot]: "BLOCK_STRICT" } },
      // v2.3(발견 87) — 경로 A의 UNAVAILABLE 마킹과 대칭. 없으면 같은 슬롯이 재추천되는 모순 발생
      blockReasons: { ...meeting.blockReasons, m3: "\uC678\uBD80 \uC77C\uC815 \uBCC0\uB3D9 \uAC10\uC9C0" }
    }));
    showAlertBanner("\uCD5C\uAC1C\uBC1C\uB2D8\uC758 \uC77C\uC815 \uC774\uD0C8\uC774 \uAC10\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", "EX05");
    setCurrentPath("/host/re-match");
  };
  const forceCloseExec = () => {
    setMeeting(commitMeeting({ ...meeting, forceClosed: true }));
    setConfirmOpen(null);
    showToast("\uC544\uC9C1 \uB2F5 \uC5C6\uB294 \uC0AC\uB78C\uC744 \uBE7C\uACE0 \uACB0\uACFC\uB97C \uACC4\uC0B0\uD574\uC694");
  };
  const resetDemoData = (toPath) => {
    localStorage.removeItem(STORAGE_KEY);
    setMeeting(buildSeedData());
    setScenario({ virtualClock: "BEFORE_DEADLINE", ex04Conflict: false });
    setTempGrid({});
    setAlertBanner(null);
    setCurrentMemberId(null);
    setAttendeeStage("INVITE");
    setHeatSelected(null);
    setHeatOpen(false);
    setConfirmOpen(null);
    setCancelStage(null);
    setConflictEdit(null);
    setNewCardKeys([]);
    setEx04FailedSlots([]);
    setCurrentPath(toPath);
    showToast("\uB370\uBAA8 \uB370\uC774\uD130\uAC00 \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
  };
  const handleConfirmMeeting = (slotKey) => {
    setConfirmOpen(null);
    setSyncChecking(true);
    setTimeout(() => {
      setSyncChecking(false);
      if (scenario.ex04Conflict) {
        const eligible = meeting.members.filter((m) => m.attendance === "REQUIRED" && m.status === "SUBMITTED" && ["AVAILABLE", "AVOID"].includes((meeting.availability[m.id] || {})[slotKey]));
        const target = eligible.find((m) => m.id === "m4") || eligible[0] || meeting.members.find((m) => m.id === "m4");
        const prevKeys = currentTop3Ref.current.map((s) => s.slotKey);
        const next2 = {
          ...meeting,
          availability: { ...meeting.availability, [target.id]: { ...meeting.availability[target.id] || {}, [slotKey]: "BLOCK_STRICT" } },
          blockReasons: { ...meeting.blockReasons, [target.id]: "\uD655\uC815 \uC9C1\uC804 \uB4F1\uB85D\uB41C \uC678\uBD80 \uC77C\uC815" }
        };
        commitMeeting(next2);
        setMeeting(next2);
        setEx04FailedSlots((prev) => [.../* @__PURE__ */ new Set([...prev, slotKey])]);
        const after = calculateBestTime(next2.availability, next2.members, {
          excludeIds: next2.forceClosed ? next2.members.filter((m) => m.attendance === "REQUIRED" && m.status === "PENDING").map((m) => m.id) : [],
          slots: activeSlots(next2.candidatePeriod)
          // 버그 수정 — next.period는 PERIOD-SPLIT 이후 존재하지 않는 필드였음(발견 79 작업 중 grep으로 발견)
        }).filter((s) => s.slotKey !== slotKey);
        setNewCardKeys(after.map((s) => s.slotKey).filter((k) => !prevKeys.includes(k)));
        showAlertBanner(`\uADF8\uC0AC\uC774 ${target.name}\uB2D8\uC758 \uC77C\uC815\uC5D0 \uBCC0\uB3D9\uC774 \uC0DD\uACA8 ${fmtSlot(slotKey)} \uCD94\uCC9C\uC774 \uC81C\uC678\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uC2DC\uAC04\uC73C\uB85C \uB2E4\uC2DC \uD655\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`, "EX04");
        return;
      }
      const next = { ...meeting, status: "COMPLETED", confirmedSlot: slotKey, droppedMemberId: null, dropReason: null, promotionRequests: [], reinstateRequests: [] };
      setMeeting(commitMeeting(next));
      clearBannerByCause("EX04");
      clearBannerByCause("EX05");
      const absent = deriveAbsentees(next).length + next.declinedOptionalIds.length;
      showToast(absent === 0 ? "\uC804\uC6D0 \uCE98\uB9B0\uB354\uC5D0 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4" : `\uCC38\uC11D \uAC00\uB2A5 \uC778\uC6D0(${next.members.length - absent}\uBA85)\uC758 \uCE98\uB9B0\uB354\uC5D0 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4`);
    }, 800);
  };
  const launchMeeting = () => {
    setMeeting(commitMeeting({ ...meeting, launched: true }));
    showToast("\uCD08\uB300 \uB9C1\uD06C\uAC00 \uC0DD\uC131\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
    setCurrentPath("/host/dashboard");
  };
  const checkProactiveNudge = (buffer) => {
    const projected = { ...meeting.availability, [currentMemberId]: buffer };
    const result = calculateBestTime(projected, meeting.members, { slots: activeSlots(meeting.candidatePeriod) });
    const top = result[0];
    const me = meeting.members.find((m) => m.id === currentMemberId);
    if (top && top.level === 2 && top.subNames.length === 1 && top.subNames[0] === me?.name) return top;
    return null;
  };
  const submitAvailability = (skipProactive) => {
    const buffer = tempGrid[currentMemberId] || {};
    if (!skipProactive && !lateJoinId && meeting.status === "PROGRESS" && attendeeStage === "GRID") {
      const offer = checkProactiveNudge(buffer);
      if (offer) {
        setProactiveOffer(offer);
        return;
      }
    }
    const next = {
      ...meeting,
      availability: { ...meeting.availability, [currentMemberId]: { ...buffer } },
      members: meeting.members.map((m) => m.id === currentMemberId ? { ...m, status: "SUBMITTED" } : m),
      // v2.5(발견 83) — CONFLICT 중 재제출이면 반영 현황에 기록. 최초 제출(status SUBMITTED)과는 별개 판정
      reMatchUpdatedIds: trackRematchUpdate(meeting.reMatchUpdatedIds, meeting.status, currentMemberId),
      // v2.7(발견 86) — PROGRESS 중 기간 확장 이후 재제출이면 제출 현황 재대기 판정에 기록
      extensionUpdatedIds: trackExtensionUpdate(meeting.extensionUpdatedIds, meeting.status, meeting.periodExtendedFrom, currentMemberId)
    };
    if (lateJoinId) {
      const v = buffer[meeting.confirmedSlot];
      if (v === "AVAILABLE" || v === "AVOID") {
        setMeeting(commitMeeting(next));
        setLateJoinId(null);
        showToast("\uC774 \uC2DC\uAC04\uC5D0 \uCC38\uC11D \uAC00\uB2A5\uD558\uC2E0 \uAC78\uB85C \uAE30\uB85D\uD588\uC5B4\uC694");
      } else {
        const withConflict = { ...next, status: "CONFLICT", droppedMemberId: lateJoinId, dropReason: "LATE_MISMATCH", declinedOptionalIds: [], reMatchUpdatedIds: [lateJoinId] };
        setMeeting(commitMeeting(withConflict));
        showAlertBanner(`${meeting.members.find((m) => m.id === lateJoinId).name}\uB2D8\uC774 \uC751\uB2F5\uC744 \uC81C\uCD9C\uD588\uB294\uB370 \uD655\uC815\uB41C \uC2DC\uAC04\uC5D0 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6CC \uC7AC\uC870\uC728\uC774 \uD544\uC694\uD574\uC694.`, "EX05");
        setLateJoinId(null);
      }
      return;
    }
    setMeeting(commitMeeting(next));
    if (meeting.status === "CONFLICT") {
      preCancelSnapshot.current = null;
      setConflictEdit(null);
      showToast("\uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \u2014 \uB300\uCCB4\uC548\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4");
    } else {
      setAttendeeStage("DONE");
      showToast("\uC2DC\uAC04\uC744 \uC81C\uCD9C\uD588\uC5B4\uC694");
    }
  };
  const selectMember = (id) => {
    setCurrentMemberId(id);
    setTempGrid((prev) => {
      if (!prev[id] && meeting.availability[id]) return { ...prev, [id]: { ...meeting.availability[id] } };
      if (!prev[id]) return { ...prev, [id]: {} };
      return prev;
    });
  };
  const cycleState = (v) => v === "AVAILABLE" ? "AVOID" : v === "AVOID" ? "UNAVAILABLE" : v === "UNAVAILABLE" ? void 0 : "AVAILABLE";
  const paintSlot = (sk, state) => {
    setTempGrid((prev) => {
      const g = { ...prev[currentMemberId] || {} };
      if (g[sk] === "BLOCK_STRICT") return prev;
      if (state === void 0) delete g[sk];
      else g[sk] = state;
      return { ...prev, [currentMemberId]: g };
    });
  };
  const onSlotDown = (sk) => {
    const g = tempGrid[currentMemberId] || {};
    if (g[sk] === "BLOCK_STRICT") {
      showToast(`\uC774 \uC2DC\uAC04\uC5D4 \uC548 \uB3FC\uC694: ${meeting.blockReasons[currentMemberId] || "\uAE30\uC874 \uC77C\uC815"}`);
      return;
    }
    const next = cycleState(g[sk]);
    dragRef.current = { active: true, apply: next === void 0 ? "AVAILABLE" : next };
    paintSlot(sk, next);
  };
  const onSlotEnter = (sk) => {
    if (dragRef.current.active) paintSlot(sk, dragRef.current.apply);
  };
  (0, import_react.useEffect)(() => {
    const end = () => {
      dragRef.current.active = false;
    };
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
    };
  }, []);
  const onGridTouchMove = (e) => {
    if (!dragRef.current.active) return;
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const sk = el && el.getAttribute && el.getAttribute("data-slot");
    if (sk) paintSlot(sk, dragRef.current.apply);
  };
  const fillRemaining = () => {
    setTempGrid((prev) => {
      const g = { ...prev[currentMemberId] || {} };
      activeSlots(meeting.candidatePeriod).forEach((sk) => {
        if (!g[sk]) g[sk] = "AVAILABLE";
      });
      return { ...prev, [currentMemberId]: g };
    });
    showToast("\uC544\uC9C1 \uC548 \uC815\uD55C \uC2DC\uAC04\uC744 \uBAA8\uB450 '\uAC00\uB2A5'\uC73C\uB85C \uCC44\uC6E0\uC5B4\uC694");
  };
  const fillDayUnavailable = (date) => {
    setTempGrid((prev) => {
      const g = { ...prev[currentMemberId] || {} };
      HOURS.forEach((h) => {
        const sk = slotKeyOf(date, h);
        if (!g[sk]) g[sk] = "UNAVAILABLE";
      });
      return { ...prev, [currentMemberId]: g };
    });
    showToast("\uC774 \uB0A0\uC740 \uC885\uC77C \uC548 \uB418\uB294 \uAC78\uB85C \uD45C\uC2DC\uD588\uC5B4\uC694");
  };
  const dl = checkDeadlineStatus(meeting, scenario);
  const submittedCount = meeting.members.filter((m) => m.status === "SUBMITTED").length;
  const top3 = (0, import_react.useMemo)(() => {
    if (meeting.status !== "PROGRESS" || dl.shouldBlockResult) return [];
    const excludeIds = meeting.forceClosed ? dl.pendingIds : [];
    return calculateBestTime(meeting.availability, meeting.members, { excludeIds, slots: activeSlots(meeting.candidatePeriod) }).filter((s) => !ex04FailedSlots.includes(s.slotKey));
  }, [meeting, dl.shouldBlockResult, ex04FailedSlots]);
  const currentTop3Ref = (0, import_react.useRef)([]);
  currentTop3Ref.current = top3;
  const rematchTop3 = (0, import_react.useMemo)(() => {
    if (meeting.status !== "CONFLICT") return [];
    return calculateBestTime(meeting.availability, meeting.members, { excludeIds: [], slots: activeSlots(meeting.candidatePeriod) });
  }, [meeting]);
  const quickReconfirmSlot = rematchTop3.length && rematchTop3[0].level !== 3 ? rematchTop3[0] : null;
  const canQuickReconfirm = (memberId) => {
    if (!quickReconfirmSlot) return false;
    const v = (meeting.availability[memberId] || {})[quickReconfirmSlot.slotKey];
    return v === "AVAILABLE" || v === "AVOID";
  };
  const heatmap = (0, import_react.useMemo)(() => buildHeatmap(meeting), [meeting]);
  const hostName = meeting.members.find((m) => m.role === "HOST").name;
  const step = deriveStep(meeting, currentPath);
  const isProductScreen = ["/host/create", "/attendee", "/host/dashboard", "/host/re-match"].includes(currentPath);
  const isHostScreen = ["/host/dashboard", "/host/re-match"].includes(currentPath);
  const nameOf = (id) => (meeting.members.find((m) => m.id === id) || {}).name;
  const registrationCopy = () => {
    const reqAbs = deriveAbsentees(meeting);
    const decl = meeting.declinedOptionalIds.map((id) => meeting.members.find((m) => m.id === id)).filter(Boolean);
    const all = [...reqAbs, ...decl];
    if (all.length === 0) return { main: "\uC804\uC6D0 \uCE98\uB9B0\uB354\uC5D0 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4", absentLines: [] };
    const byReason = { UNCONFIRMED: [], UNAVAILABLE_SLOT: [], SELF_DECLINED: [] };
    all.forEach((m) => {
      const r = m.attendance === "REQUIRED" && meeting.status === "CONFLICT" && m.id === meeting.droppedMemberId && absenceReason(m, meeting) === null ? "UNAVAILABLE_SLOT" : absenceReason(m, meeting) || "UNAVAILABLE_SLOT";
      byReason[r].push(m.name);
    });
    const absentLines = Object.entries(byReason).filter(([, names]) => names.length > 0).map(([reason, names]) => ABSENCE_LABEL[reason](names.join(", ")));
    return {
      main: `\uCC38\uC11D \uAC00\uB2A5 \uC778\uC6D0(${meeting.members.length - all.length}\uBA85)\uC758 \uCE98\uB9B0\uB354\uC5D0 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4`,
      absentLines
    };
  };
  const BrandBar = () => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} px-6 py-3 border-b flex justify-between items-center select-none` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-bold text-sm cursor-default`, onClick: onLogoTap }, "MeetSync"), isProductScreen && /* @__PURE__ */ import_react.default.createElement("span", { className: `${currentPath === "/attendee" ? T.success : T.primary} ${T.primaryForeground} ${T.roundedElement} px-2 py-1 text-xs font-medium max-w-[160px] truncate` }, currentPath === "/attendee" ? `\uCC38\uC11D\uC790 \uD654\uBA74${currentMemberId && (attendeeStage === "GRID" || attendeeStage === "DONE" || conflictEdit === "GRID") ? " \xB7 " + nameOf(currentMemberId) : ""}` : "\uC8FC\uCD5C\uC790 \uD654\uBA74"));
  const StepIndicator = () => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} border-b px-6 py-2 flex gap-2 flex-wrap text-xs` }, ["\uBC1C\uC758", "\uC751\uB2F5 \uC218\uC9D1", "\uC870\uC728\xB7\uD655\uC815", "\uC644\uB8CC"].map((label, i) => {
    const n = i + 1;
    const active = n === step;
    const conflict = meeting.status === "CONFLICT" && n === 3;
    return /* @__PURE__ */ import_react.default.createElement("span", { key: label, className: `${active ? conflict ? `${T.textWarning} font-semibold` : `${T.foreground} font-semibold` : T.mutedForeground}` }, n, ". ", label, conflict && active ? " (\uC7AC\uC870\uC728)" : "", n < 4 ? "  \u203A" : "");
  }));
  const AlertBannerView = () => alertBanner ? /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.destructiveLight} ${T.borderDestructive} ${T.textDestructive} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-start gap-2 mx-6 mt-4` }, /* @__PURE__ */ import_react.default.createElement("span", null, alertBanner.message), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.textDestructive} ${T.pressed} font-bold`, onClick: () => setAlertBanner(null) }, "\u2715")) : null;
  const ToastView = () => toast ? /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.primary} ${T.primaryForeground} ${T.roundedElement} ${T.pCard} text-sm fixed top-4 inset-x-4 z-40 text-center shadow-lg` }, toast) : null;
  const ConfirmArea = ({ history, sentence, extra, cancelLabel = "\uCDE8\uC18C", execLabel, onExec, onCancel }) => /* @__PURE__ */ import_react.default.createElement("div", { className: `border-t ${T.border} pt-3 mt-2 flex flex-col gap-2` }, history, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm` }, sentence), extra, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: `${T.card} border ${T.border} ${T.foreground} flex-1 py-2 ${T.roundedElement} text-xs font-medium ${T.pressed}`,
      onClick: onCancel || (() => setConfirmOpen(null))
    },
    cancelLabel
  ), /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: `${T.primary} ${T.primaryForeground} flex-1 py-2 ${T.roundedElement} text-xs font-bold ${T.pressed}`,
      onClick: onExec
    },
    execLabel
  )));
  const RecommendList = ({ items, gate }) => /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, items.map((slot, rank) => {
    const isNew = newCardKeys.includes(slot.slotKey);
    const forcedOutNote = meeting.forceClosed && slot.label === "\uC81C\uCD9C\uD55C \uC0AC\uB78C\uC740 \uBAA8\uB450 \uAC00\uB2A5\uD574\uC694" ? ` ${dl.pendingList.join(", ")}\uB2D8\uC740 \uB2F5\uC774 \uC5C6\uC5B4 \uD3EC\uD568\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.` : "";
    const confirmSentence = slot.level === 2 ? `${slot.subNames.join(", ")}\uB2D8\uC774 \uD53C\uD558\uACE0 \uC2F6\uC740 \uC2DC\uAC04\uC785\uB2C8\uB2E4. \uD655\uC815 \uC804 \uC591\uD574\uB97C \uAD6C\uD558\uB294 \uAC83\uC774 \uC88B\uC2B5\uB2C8\uB2E4.` : slot.level === 1 ? `\uC120\uD0DD \uCC38\uC11D\uC790(${slot.subNames.join(", ")})\uB97C \uBE7C\uBA74 \uBAA8\uB450 \uAC00\uB2A5\uD55C \uC2DC\uAC04\uC785\uB2C8\uB2E4.` : `\uC804\uC6D0\uC774 \uCC38\uC11D \uAC00\uB2A5\uD55C \uC2DC\uAC04\uC785\uB2C8\uB2E4.${forcedOutNote}`;
    const cfConfirm = confirmOpen && confirmOpen.type === "CONFIRM" && confirmOpen.slotKey === slot.slotKey;
    const cfDemote = confirmOpen && confirmOpen.type === "DEMOTE" && confirmOpen.slotKey === slot.slotKey;
    const oneAbsentee = slot.absentees.length === 1 ? slot.absentees[0] : null;
    const hostBottleneck = oneAbsentee && oneAbsentee.id === "m1";
    const reReqSent = slot.reRequestTargets.length > 0 && slot.reRequestTargets.every((t) => meeting.reRequestedIds.includes(t.id));
    return /* @__PURE__ */ import_react.default.createElement("div", { key: slot.slotKey, className: `${rank === 0 ? T.successLight : T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2 text-left` }, " ", /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center gap-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, fmtSlot(slot.slotKey), isNew && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs font-bold ml-2` }, "\uC0C8 \uCD94\uCC9C")), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-xs font-medium ${slot.tone === "ok" ? T.textSuccess : slot.tone === "warn" ? T.textWarning : T.textDestructive}` }, slot.label), slot.subline && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, slot.subline)), slot.level < 3 && (gate?.blocked ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs text-right shrink-0` }, "\uBAA8\uB4E0 \uD544\uC218 \uCC38\uC11D\uC790\uAC00", /* @__PURE__ */ import_react.default.createElement("br", null), "\uAC31\uC2E0\uD558\uBA74 \uD655\uC815\uD560 \uC218 \uC788\uC5B4\uC694") : /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} px-4 py-2 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0`,
        onClick: () => setConfirmOpen({ type: "CONFIRM", slotKey: slot.slotKey })
      },
      "\uCD5C\uC885 \uD655\uC815"
    ))), cfConfirm && ConfirmArea({ sentence: confirmSentence, execLabel: "\uC774 \uC2DC\uAC04\uC73C\uB85C \uD655\uC815", onExec: () => handleConfirmMeeting(slot.slotKey) }), slot.level === 3 && /* @__PURE__ */ import_react.default.createElement("div", { className: `border-t ${T.border} pt-2 flex flex-col gap-2` }, hostBottleneck ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uC8FC\uCD5C\uC790\uB2D8\uC774 \uC9C1\uC811 \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uACE8\uB77C\uC57C \uD574\uC694 \u2014 \uCC38\uC11D\uC790 \uD654\uBA74\uC5D0\uC11C \uAE40\uC8FC\uCD5C\uB85C \uB4E4\uC5B4\uAC00 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uC138\uC694.") : slot.absentees.length >= 2 ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, slot.reRequestTargets.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD544\uC218 \uCC38\uC11D\uC790 2\uBA85 \uC774\uC0C1\uC774 \uC548 \uB418\uB294 \uC2DC\uAC04\uC774\uC5D0\uC694. \uB2E4\uC2DC \uC694\uCCAD\uD558\uAC70\uB098 \uB2E4\uB978 \uC2DC\uAC04\uC744 \uCC3E\uC544\uBCF4\uC138\uC694."), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${reReqSent ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0 ${reReqSent ? T.disabled : ""}`,
        onClick: () => sendReRequest(slot.reRequestTargets),
        disabled: reReqSent
      },
      reReqSent ? "\uB2E4\uC2DC \uC694\uCCAD\uD588\uC5B4\uC694" : "\uB2E4\uC2DC \uC694\uCCAD\uD558\uAE30"
    )), slot.reRequestTargets.length === 0 && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD544\uC218 \uCC38\uC11D\uC790 2\uBA85 \uC774\uC0C1\uC5D0\uAC8C \uB2E4\uB978 \uC77C\uC815\uC774 \uC788\uB294 \uC2DC\uAC04\uC774\uC5D0\uC694 \u2014 \uB2E4\uB978 \uC2DC\uAC04\uC744 \uCC3E\uC544\uBCF4\uC138\uC694.")) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, slot.reRequestTargets.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, slot.reRequestTargets.map((t) => t.name).join(", "), "\uB2D8\uC774 \uC774 \uC2DC\uAC04\uC744 \uBE44\uC6CC\uC8FC\uBA74 ", slot.blockNames.length ? "\uB354 \uB9CE\uC774 \uCC38\uC11D\uD560 \uC218 \uC788\uC5B4\uC694" : "\uBAA8\uB450 \uCC38\uC11D\uD560 \uC218 \uC788\uC5B4\uC694"), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${reReqSent ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0 ${reReqSent ? T.disabled : ""}`,
        onClick: () => sendReRequest(slot.reRequestTargets),
        disabled: reReqSent
      },
      reReqSent ? "\uB2E4\uC2DC \uC694\uCCAD\uD588\uC5B4\uC694" : "\uB2E4\uC2DC \uC694\uCCAD\uD558\uAE30"
    )), slot.blockNames.length > 0 && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, slot.blockNames.join(", "), "\uB2D8\uC740 \uC774 \uC2DC\uAC04\uC5D0 \uB2E4\uB978 \uC77C\uC815\uC774 \uC788\uC5B4\uC694"), oneAbsentee && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.mutedForeground} text-xs underline text-left ${T.pressed}`,
        onClick: () => setConfirmOpen({ type: "DEMOTE", slotKey: slot.slotKey, memberId: oneAbsentee.id })
      },
      oneAbsentee.name,
      "\uB2D8\uC744 \uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uAFB8\uACE0 \uC9C4\uD589\uD558\uAE30"
    ), cfDemote && oneAbsentee && ConfirmArea({
      history: meeting.reRequestedIds.includes(oneAbsentee.id) ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uC7AC\uC694\uCCAD \uBC1C\uC1A1\uD568 \u2713") : /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs` }, "\uC544\uC9C1 ", oneAbsentee.name, "\uB2D8\uC5D0\uAC8C \uB2E4\uC2DC \uC694\uCCAD\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694"), oneAbsentee.reason !== "BLOCK" && /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.card} border ${T.border} ${T.foreground} px-2 py-1 ${T.roundedElement} text-xs ${T.pressed} shrink-0`,
          onClick: () => sendReRequest([oneAbsentee])
        },
        "\uBA3C\uC800 \uB2E4\uC2DC \uC694\uCCAD\uD558\uAE30"
      )),
      sentence: `${oneAbsentee.name}\uB2D8\uC744 \uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uAFC0\uAC8C\uC694. \uC774 \uD68C\uC758\uB294 ${oneAbsentee.name}\uB2D8 \uC5C6\uC774 \uC9C4\uD589\uB418\uBA70, \uD68C\uC758 \uB0B4\uC6A9\uC744 \uB530\uB85C \uC804\uB2EC\uD574\uC57C \uD574\uC694. \uBC14\uAFB8\uBA74 ${oneAbsentee.name}\uB2D8\uC5D0\uAC8C \uC54C\uB9BC\uC774 \uAC00\uC694.`,
      extra: /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          className: `${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`,
          placeholder: "\uD68C\uC758 \uC804 \uB0A8\uAE30\uACE0 \uC2F6\uC740 \uC758\uACAC\uC774 \uC788\uC73C\uC2E0\uAC00\uC694? (\uC120\uD0DD)",
          defaultValue: demoteNoteDraft,
          onChange: (e) => setDemoteNoteDraft(e.target.value)
        }
      ),
      execLabel: "\uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uAFB8\uAE30",
      onExec: () => demoteMember(oneAbsentee.id, slot.slotKey, demoteNoteDraft || null)
    })), !hostBottleneck && /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs underline text-left ${T.pressed}`, onClick: extendPeriod }, "\uAE30\uAC04 \uB113\uD600\uC11C \uB2E4\uC2DC \uCC3E\uAE30")));
  }));
  const HeatView = ({ collapsedLabel }) => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} border` }, /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.pCard} ${T.pressed} flex justify-between w-full items-center`, onClick: () => setHeatOpen((v) => !v) }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, collapsedLabel), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, heatOpen ? "\uC811\uAE30 \u25B2" : "\uD3BC\uCE58\uAE30 \u25BC")), heatOpen && /* @__PURE__ */ import_react.default.createElement("div", { className: T.pCard }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid gap-1", style: { gridTemplateColumns: `auto repeat(${activeDates(meeting.candidatePeriod).length}, 1fr)` } }, /* @__PURE__ */ import_react.default.createElement("div", null), activeDates(meeting.candidatePeriod).map((d) => /* @__PURE__ */ import_react.default.createElement("div", { key: d, className: `${T.mutedForeground} text-xs text-center pb-1` }, d.slice(5, 7), "/", d.slice(8, 10), " (", DAY_LABEL[d], ")")), HOURS.map((h) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: h }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.mutedForeground} text-xs pr-2 flex items-center` }, String(h).padStart(2, "0"), ":00"), activeDates(meeting.candidatePeriod).map((d) => {
    const sk = slotKeyOf(d, h);
    const confirmed = meeting.confirmedSlot === sk && meeting.status === "COMPLETED";
    const ring = confirmed ? RING_CONFIRMED : heatSelected === sk ? RING_SELECTED : "";
    const bg = confirmed ? CONFIRMED_BG : heatToken(heatmap[sk].count);
    return /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        key: sk,
        className: `${bg} ${T.roundedElement} h-9 ${T.pressed} ${ring}`,
        onClick: () => setHeatSelected(sk)
      }
    );
  })))), heatSelected && /* @__PURE__ */ import_react.default.createElement("div", { className: `border-t ${T.border} mt-3 pt-3 flex flex-col gap-1` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm font-medium` }, fmtSlot(heatSelected), " ", /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uAC00\uB2A5 ", heatmap[heatSelected].count, "\uBA85"), meeting.status === "COMPLETED" && meeting.confirmedSlot === heatSelected && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textSuccess} text-xs font-bold ml-2` }, "\uD655\uC815\uB41C \uC2DC\uAC04")), heatmap[heatSelected].detail.map((d) => /* @__PURE__ */ import_react.default.createElement("span", { key: d.name, className: `text-xs ${d.state === "AVAILABLE" ? T.textSuccess : d.state === "AVOID" ? T.textWarning : d.state === "UNAVAILABLE" ? T.textDestructive : T.mutedForeground}` }, d.name, d.isOptional ? " (\uC120\uD0DD)" : "", " \u2014 ", HEAT_STATE_LABEL[d.state])))));
  const GridEditor = ({ onBack, submitLabel }) => {
    const buffer = tempGrid[currentMemberId] || {};
    const availCount = Object.values(buffer).filter((v) => v === "AVAILABLE").length;
    const me = meeting.members.find((m) => m.id === currentMemberId) || {};
    const slotToken = (v) => v === "AVAILABLE" ? T.success : v === "AVOID" ? T.warning : v === "UNAVAILABLE" ? T.unavail : v === "BLOCK_STRICT" ? T.block : `${T.unset} border ${T.border}`;
    return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-sm text-left ${T.pressed}`, onClick: onBack }, "\u2190 \uCC38\uC11D\uC790 \uB2E4\uC2DC \uC120\uD0DD"), meeting.status === "PROGRESS" && meeting.forceClosed && me.status === "PENDING" && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs` }, "\uC751\uB2F5 \uB9C8\uAC10\uC73C\uB85C \uC9C0\uAE08\uC740 \uCD94\uCC9C\uC5D0\uC11C \uBE60\uC838 \uC788\uC5B4\uC694. \uC9C0\uAE08 \uC81C\uCD9C\uD558\uBA74 \uBC14\uB85C \uBC18\uC601\uB3FC\uC694."), meeting.status === "PROGRESS" && meeting.demotedIds.includes(currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs` }, "\uC8FC\uCD5C\uC790\uB2D8\uC774 \uD68C\uC6D0\uB2D8\uC744 \uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uAFE8\uC5B4\uC694", meeting.demotedReasons?.[currentMemberId] ? ` (${fmtSlot(meeting.demotedReasons[currentMemberId])}\uC5D0 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6B0\uC154\uC11C)` : "", ". \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uBA74 \uCD94\uCC9C\uC5D0 \uBC18\uC601\uB3FC\uC694.", meeting.demoteNotes?.[currentMemberId] && /* @__PURE__ */ import_react.default.createElement("span", { className: `block mt-1 ${T.foreground}` }, "\uC8FC\uCD5C\uC790\uB2D8\uC758 \uBA54\uBAA8: ", meeting.demoteNotes[currentMemberId])), meeting.status === "PROGRESS" && me.status === "PENDING" && meeting.nudgedIds.includes(currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs` }, "\uC8FC\uCD5C\uC790\uB2D8\uC774 \uBE68\uB9AC \uB2F5\uD574\uB2EC\uB77C\uACE0 \uC54C\uB824\uC654\uC5B4\uC694."), meeting.status === "PROGRESS" && isPending(meeting.promotionRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\uCC38\uC870\uC790 \uC804\uD658\uC744 \uC694\uCCAD\uD588\uC5B4\uC694. \uC8FC\uCD5C\uC790\uB2D8\uC758 \uD655\uC778\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911\uC774\uC5D0\uC694."), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.textWarning} underline shrink-0 ${T.pressed}`, onClick: () => cancelPromotionRequest(currentMemberId) }, "\uC694\uCCAD \uCDE8\uC18C")), meeting.status === "PROGRESS" && isRejected(meeting.promotionRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\uC694\uCCAD\uC774 \uAC70\uC808\uB410\uC5B4\uC694."), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.textWarning} underline shrink-0 ${T.pressed}`, onClick: () => acknowledgePromotionRejection(currentMemberId) }, "\uD655\uC778")), meeting.status === "PROGRESS" && isPending(meeting.reinstateRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uB418\uACE0 \uC2F6\uB2E4\uACE0 \uC694\uCCAD\uD588\uC5B4\uC694. \uC8FC\uCD5C\uC790\uB2D8\uC758 \uD655\uC778\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911\uC774\uC5D0\uC694."), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.textWarning} underline shrink-0 ${T.pressed}`, onClick: () => cancelReinstateRequest(currentMemberId) }, "\uC694\uCCAD \uCDE8\uC18C")), meeting.status === "PROGRESS" && isRejected(meeting.reinstateRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\uC694\uCCAD\uC774 \uAC70\uC808\uB410\uC5B4\uC694."), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.textWarning} underline shrink-0 ${T.pressed}`, onClick: () => acknowledgeReinstateRejection(currentMemberId) }, "\uD655\uC778")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-end gap-2" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.foreground} text-2xl font-bold` }, "\uB0B4 \uC2DC\uAC04 \uC120\uD0DD\uD558\uAE30"), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm` }, "\uB9C8\uAC10: ", fmtDeadline(meeting.coordinationPeriod))), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.card} ${T.border} ${T.foreground} ${T.roundedElement} border px-3 py-1.5 text-xs font-medium ${T.pressed} shrink-0`,
        onClick: fillRemaining
      },
      "\uB098\uBA38\uC9C0 \uB2E4 \uAC00\uB2A5\uC73C\uB85C"
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border select-none touch-none`, onTouchMove: onGridTouchMove }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid gap-1", style: { gridTemplateColumns: `auto repeat(${activeDates(meeting.candidatePeriod).length}, 1fr)` } }, /* @__PURE__ */ import_react.default.createElement("div", null), activeDates(meeting.candidatePeriod).map((d) => (
      // [DS-FLOW-A01-DAYBULK] 날짜 헤더 탭 → 일 단위 일괄 불가 (v2.3, PRD 3.3)
      // v2.5(발견 79): periodExtendedFrom보다 뒤 날짜는 "새로 추가됨" 강조 — 기간 확장 시 전원 통지의 시각적 실체
      /* @__PURE__ */ import_react.default.createElement("button", { key: d, className: `${T.mutedForeground} text-xs text-center pb-1 ${T.pressed}`, onClick: () => fillDayUnavailable(d) }, d.slice(5, 7), "/", d.slice(8, 10), " (", DAY_LABEL[d], ")", isNewlyAddedDate(d, meeting.periodExtendedFrom) && /* @__PURE__ */ import_react.default.createElement("span", { className: `block ${T.textWarning} text-[10px] font-bold` }, "\uC0C8\uB85C \uCD94\uAC00\uB428"))
    )), HOURS.map((h) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: h }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.mutedForeground} text-xs pr-2 flex items-center` }, String(h).padStart(2, "0"), ":00"), activeDates(meeting.candidatePeriod).map((d) => {
      const sk = slotKeyOf(d, h);
      const v = buffer[sk];
      return /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          key: sk,
          "data-slot": sk,
          className: `${slotToken(v)} ${T.roundedElement} h-11 ${v === "BLOCK_STRICT" ? "cursor-not-allowed" : `cursor-pointer ${T.pressed}`}`,
          onMouseDown: (e) => {
            e.preventDefault();
            onSlotDown(sk);
          },
          onMouseEnter: () => onSlotEnter(sk),
          onTouchStart: () => onSlotDown(sk)
        }
      );
    }))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-3 justify-center flex-wrap" }, [[`${T.unset} border ${T.border}`, "\uC544\uC9C1 \uC548 \uC815\uD568"], [T.success, "\uAC00\uB2A5"], [T.warning, "\uD53C\uD558\uACE0 \uC2F6\uC74C"], [T.unavail, "\uC548 \uB418\uB294 \uC2DC\uAC04"], [T.block, "\uB2E4\uB978 \uC77C\uC815 \uC788\uC74C"]].map(([tok, label]) => /* @__PURE__ */ import_react.default.createElement("span", { key: label, className: `${T.mutedForeground} text-xs flex items-center gap-1` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${tok} ${T.roundedElement} inline-block w-3 h-3` }), label))), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-[11px] text-center` }, "\uD0ED\uD558\uBA74 \uAC00\uB2A5 \u2192 \uD53C\uD558\uACE0 \uC2F6\uC74C \u2192 \uC548 \uB418\uB294 \uC2DC\uAC04 \u2192 \uD574\uC81C \uC21C\uC73C\uB85C \uBC14\uB00C\uC5B4\uC694 \xB7 \uB4DC\uB798\uADF8\uB85C \uD55C \uBC88\uC5D0 \uC9C0\uC815"), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-xs text-center` }, "\uD68C\uC0C9\uC73C\uB85C \uC7A0\uAE34 \uC2DC\uAC04\uC740 \uC5F0\uACB0\uB41C \uCE98\uB9B0\uB354\uC5D0 \uC774\uBBF8 \uC788\uB294 \uC77C\uC815\uC774\uC5D0\uC694 (\uC774\uB3D9 \uC2DC\uAC04 \uD3EC\uD568, \uC790\uB3D9\uC73C\uB85C \uBC18\uC601\uB3FC\uC694)"), meeting.status === "PROGRESS" && me.attendance === "REQUIRED" && me.role !== "HOST" && !isPending(meeting.promotionRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.mutedForeground} text-[11px] underline text-center ${T.pressed}`,
        onClick: () => setConfirmOpen({ type: "PROMOTE", memberId: currentMemberId })
      },
      "\uC800\uB294 \uAF2D \uD544\uC694\uD55C \uC0AC\uB78C\uC774 \uC544\uB2CC \uAC83 \uAC19\uC544\uC694"
    ), confirmOpen && confirmOpen.type === "PROMOTE" && confirmOpen.memberId === currentMemberId && ConfirmArea({
      sentence: "\uC8FC\uCD5C\uC790\uB2D8\uAED8 \uCC38\uC870\uC790 \uC804\uD658\uC744 \uC694\uCCAD\uD569\uB2C8\uB2E4. \uC2B9\uC778\uB418\uBA74 \uC774 \uD68C\uC758\uB294 \uD68C\uC6D0\uB2D8 \uC5C6\uC774\uB3C4 \uC131\uB9BD\uD560 \uC218 \uC788\uC5B4\uC694.",
      extra: /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          className: `${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`,
          placeholder: "\uC694\uCCAD \uC0AC\uC720 (\uC120\uD0DD) \u2014 \uC8FC\uCD5C\uC790\uB2D8\uC774 \uC2B9\uC778 \uC5EC\uBD80\uB97C \uD310\uB2E8\uD558\uB294 \uB370 \uB3C4\uC6C0\uC774 \uB3FC\uC694",
          defaultValue: promoteReasonDraft,
          onChange: (e) => setPromoteReasonDraft(e.target.value)
        }
      ),
      execLabel: "\uC694\uCCAD \uBCF4\uB0B4\uAE30",
      onExec: () => requestPromotion(currentMemberId, promoteReasonDraft || null)
    }), meeting.status === "PROGRESS" && me.attendance === "OPTIONAL" && !isPending(meeting.reinstateRequests, currentMemberId) && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.mutedForeground} text-[11px] underline text-center ${T.pressed}`,
        onClick: () => setConfirmOpen({ type: "REINSTATE", memberId: currentMemberId })
      },
      "\uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uB418\uACE0 \uC2F6\uC5B4\uC694"
    ), confirmOpen && confirmOpen.type === "REINSTATE" && confirmOpen.memberId === currentMemberId && ConfirmArea({
      sentence: "\uC8FC\uCD5C\uC790\uB2D8\uAED8 \uD544\uC218 \uBCF5\uADC0\uB97C \uC694\uCCAD\uD569\uB2C8\uB2E4. \uC2B9\uC778\uB418\uBA74 \uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uB85C \uC804\uD658\uB3FC\uC694.",
      extra: /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          className: `${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`,
          placeholder: "\uC694\uCCAD \uC0AC\uC720 (\uC120\uD0DD) \u2014 \uC8FC\uCD5C\uC790\uB2D8\uC774 \uC2B9\uC778 \uC5EC\uBD80\uB97C \uD310\uB2E8\uD558\uB294 \uB370 \uB3C4\uC6C0\uC774 \uB3FC\uC694",
          defaultValue: reinstateReasonDraft,
          onChange: (e) => setReinstateReasonDraft(e.target.value)
        }
      ),
      execLabel: "\uC694\uCCAD \uBCF4\uB0B4\uAE30",
      onExec: () => requestReinstate(currentMemberId, reinstateReasonDraft || null)
    }), proactiveOffer ? ConfirmArea({
      sentence: `\uC774 \uC751\uB2F5\uB300\uB85C\uBA74 ${fmtSlot(proactiveOffer.slotKey)}\uB9CC \uBE7C\uBA74 \uC804\uC6D0 \uD569\uC758\uAC00 \uAC00\uB2A5\uD574\uC694. \uD639\uC2DC \uADF8 \uC2DC\uAC04\uB3C4 \uC5F4\uC5B4\uC8FC\uC2E4 \uC218 \uC788\uB098\uC694?`,
      cancelLabel: "\uC544\uB2C8\uC694, \uADF8\uB300\uB85C \uC81C\uCD9C",
      execLabel: "\uB124, \uB2E4\uC2DC \uBCFC\uAC8C\uC694",
      onCancel: () => {
        setProactiveOffer(null);
        submitAvailability(true);
      },
      onExec: () => {
        setProactiveOffer(null);
        setHeatSelected(proactiveOffer.slotKey);
      }
    }) : /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold mt-auto ${T.pressed} ${availCount === 0 ? T.disabled : ""}`,
        onClick: () => submitAvailability(false),
        disabled: availCount === 0
      },
      submitLabel
    ), availCount === 0 && /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-xs text-center` }, "\uB418\uB294 \uC2DC\uAC04\uC744 1\uAC1C \uC774\uC0C1 \uACE8\uB77C\uC57C \uC81C\uCD9C\uD560 \uC218 \uC788\uC5B4\uC694"));
  };
  const MemberPicker = ({ title, sub, onPick, onBack }) => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-3 min-h-screen max-w-xl mx-auto w-full` }, onBack && /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-sm text-left ${T.pressed}`, onClick: onBack }, "\u2190 \uB3CC\uC544\uAC00\uAE30"), /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.foreground} text-2xl font-bold` }, title), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm` }, sub), meeting.members.map((member) => /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      key: member.id,
      className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border ${T.pressed} flex justify-between items-center text-left`,
      onClick: () => onPick(member.id)
    },
    /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-medium text-sm` }, member.name, member.attendance === "OPTIONAL" ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, " (\uC120\uD0DD)") : null),
    member.status === "SUBMITTED" && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textSuccess} text-xs` }, "\uC81C\uCD9C \uC644\uB8CC \xB7 \uC218\uC815 \uAC00\uB2A5"),
    member.status !== "SUBMITTED" && meeting.status === "COMPLETED" && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs` }, "\uC544\uC9C1 \uB2F5 \uC548 \uD568 \xB7 \uC9C0\uAE08 \uC81C\uCD9C")
  )));
  const LandingScreen = () => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-8 min-h-screen justify-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-3 text-center" }, /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.foreground} text-3xl font-bold tracking-tight` }, "\uD68C\uC758 \uC2DC\uAC04 \uC7A1\uAE30,", /* @__PURE__ */ import_react.default.createElement("br", null), "\uC774\uC81C \uB208\uCE58 \uC5C6\uC774."), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm` }, "\uC7AC\uCD09\uD558\uAE30 \uBBF8\uC548\uD558\uACE0, \uBE44\uC120\uD638 \uC2DC\uAC04\uC744 \uB9D0\uD558\uAE30 \uC560\uB9E4\uD558\uACE0, \uD655\uC815 \uD6C4 \uBC88\uBCF5\uC774 \uB450\uB824\uC6B4 \u2014 \uC77C\uC815 \uC870\uC728\uC758 \uAD00\uACC4 \uBE44\uC6A9\uC744 \uC2DC\uC2A4\uD15C\uC774 \uB300\uC2E0 \uC9D1\uB2C8\uB2E4.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, [
    "1. \uB9C1\uD06C \uD558\uB098\uB85C \uC804\uC6D0\uC758 \uAC00\uB2A5\xB7\uBE44\uC120\uD638\xB7\uBD88\uAC00 \uC2DC\uAC04\uC744 \uC218\uC9D1",
    "2. \uC804\uC6D0 \uC870\uAC74 \uAD50\uCC28 + 3\uB2E8\uACC4 \uC644\uD654\uB85C \uCD5C\uC801 \uC2DC\uAC04\uC744 \uADFC\uAC70\uC640 \uD568\uAED8 \uCD94\uCC9C",
    "3. \uD655\uC815 \uC9C1\uC804 \uC7AC\uAC80\uC99D, \uD655\uC815 \uD6C4 \uC774\uD0C8\uAE4C\uC9C0 \uC7AC\uC870\uC728\uB85C \uBC29\uC5B4"
  ].map((s) => /* @__PURE__ */ import_react.default.createElement("div", { key: s, className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border text-sm ${T.foreground}` }, s))), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold ${T.pressed}`, onClick: () => navigate("/host/create") }, "\uD68C\uC758 \uB9CC\uB4E4\uAE30"), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs text-center underline ${T.pressed}`, onClick: () => navigate("/guide") }, "\uB370\uBAA8 \uAC00\uC774\uB4DC \xB7 \uC2EC\uC0AC\uC790\uC6A9"));
  const GuideScreen = () => {
    const Kbd = ({ children }) => /* @__PURE__ */ import_react.default.createElement("span", { className: `border ${T.border} ${T.roundedElement} px-1.5 py-0.5 ${T.primaryForeground} text-[11px] mx-0.5` }, children);
    const StepCard = ({ n, children }) => /* @__PURE__ */ import_react.default.createElement("div", { className: `border ${T.border} ${T.roundedElement} px-3 py-2 flex gap-3 items-start` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.primaryForeground} font-bold shrink-0` }, n), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.devpanelForeground} text-xs leading-relaxed` }, children));
    const ExBlock = ({ title, cond, act, expect }) => /* @__PURE__ */ import_react.default.createElement("div", { className: `border ${T.border} ${T.roundedElement} px-3 py-2 flex flex-col gap-1` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.primaryForeground} text-xs font-bold` }, title), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.devpanelForeground} text-xs` }, /* @__PURE__ */ import_react.default.createElement("span", { className: T.primaryForeground }, "\uBC1C\uB3D9 \uC870\uAC74"), " \u2014 ", cond), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.devpanelForeground} text-xs` }, /* @__PURE__ */ import_react.default.createElement("span", { className: T.primaryForeground }, "\uC870\uC791"), " \u2014 ", act), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.devpanelForeground} text-xs` }, /* @__PURE__ */ import_react.default.createElement("span", { className: T.primaryForeground }, "\uAE30\uB300 \uBCC0\uD654"), " \u2014 ", expect));
    const H = ({ children }) => /* @__PURE__ */ import_react.default.createElement("h2", { className: `${T.primaryForeground} text-sm font-bold mt-2` }, children);
    return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanel} ${T.pScreen} flex flex-col gap-3 min-h-screen font-mono max-w-2xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.devpanelForeground} text-xs text-left ${T.pressed}`, onClick: () => navigate("/") }, "\u2190 \uB79C\uB529\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30"), /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.primaryForeground} text-xl font-bold` }, "DEMO GUIDE"), /* @__PURE__ */ import_react.default.createElement(H, null, "1. \uAD8C\uC7A5 \uC2DC\uC5F0 \uC21C\uC11C"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "1" }, "\uB79C\uB529\uC5D0\uC11C [\uD68C\uC758 \uB9CC\uB4E4\uAE30] \u2192 \uBC1C\uC758 \uD654\uBA74\uC5D0\uC11C [\uD68C\uC758 \uAC1C\uC124 \uBC0F \uCD08\uB300 \uB9C1\uD06C \uC0DD\uC131\uD558\uAE30]"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "2" }, "\uB300\uC2DC\uBCF4\uB4DC \uB3C4\uCC29 \u2014 \uD300\uC6D0 \uC751\uB2F5\uC774 1\uCD08 \uAC04\uACA9\uC73C\uB85C \uC720\uC785 (5/6\uAE4C\uC9C0, \uB2E4\uB978 \uD654\uBA74\uC5D0 \uC788\uC5B4\uB3C4 \uBC31\uADF8\uB77C\uC6B4\uB4DC \uC9C4\uD589)"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "3" }, "\uCD08\uB300 \uB9C1\uD06C \uCE74\uB4DC\uC758 [\uB9C1\uD06C \uC5F4\uC5B4\uBCF4\uAE30] \u2192 \uCC38\uC11D\uC790: \uBC15\uAC1C\uBC1C \uC120\uD0DD, \uADF8\uB9AC\uB4DC \uD3B8\uC9D1(\uAC00\uB2A5\u2192\uD53C\uD558\uACE0 \uC2F6\uC74C\u2192\uBD88\uAC00 \uC21C\uD658) \uD6C4 \uC81C\uCD9C"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "4" }, "[\uC8FC\uCD5C\uC790 \uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uACB0\uACFC \uBCF4\uAE30] \u2192 \uCD94\uCC9C Top 3 \u2192 [\uCD5C\uC885 \uD655\uC815] \u2192 \uD655\uC778 \uC601\uC5ED\uC5D0\uC11C [\uC774 \uC2DC\uAC04\uC73C\uB85C \uD655\uC815]"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "5" }, "\uD655\uC815 \uC644\uB8CC \u2014 \uCC38\uC11D\uC790 \uD654\uBA74(\uD328\uB110 A01)\uC73C\uB85C \uD655\uC815 \uC548\uB0B4 \uD655\uC778, [\uAC11\uC790\uAE30 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6CC\uC84C\uB098\uC694?]\uB85C \uCDE8\uC18C \uD50C\uB85C\uC6B0 \uCCB4\uD5D8"), /* @__PURE__ */ import_react.default.createElement(StepCard, { n: "6" }, "\uC644\uB8CC \uD654\uBA74\uC758 [\uC0C8 \uD68C\uC758 \uB9CC\uB4E4\uAE30]\uB85C \uCC98\uC74C\uBD80\uD130 \uC21C\uD658"), /* @__PURE__ */ import_react.default.createElement(H, null, "2. \uC2DC\uB098\uB9AC\uC624 \uD328\uB110 \uC5F4\uAE30"), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanelForeground} text-xs leading-relaxed` }, "\uB370\uC2A4\uD06C\uD1B1: ", /* @__PURE__ */ import_react.default.createElement(Kbd, null, "Ctrl"), "+", /* @__PURE__ */ import_react.default.createElement(Kbd, null, "Shift"), "+", /* @__PURE__ */ import_react.default.createElement(Kbd, null, "D"), " / \uBAA8\uBC14\uC77C: ", /* @__PURE__ */ import_react.default.createElement(Kbd, null, "MeetSync"), " \uB85C\uACE0 2\uCD08 \uB0B4 5\uD68C \uD0ED. \uAC01 \uC81C\uC5B4 \uC544\uB798 \uD604\uC7AC \uD6A8\uACFC \uD78C\uD2B8 \uC0C1\uC2DC \uD45C\uC2DC."), /* @__PURE__ */ import_react.default.createElement(H, null, "3. \uC608\uC678 \uC2DC\uB098\uB9AC\uC624"), /* @__PURE__ */ import_react.default.createElement(ExBlock, { title: "EX-01 \xB7 \uC644\uD654 \uCD94\uCC9C + \uAD50\uCC29 \uD574\uC18C \uB8E8\uD504", cond: "\uAD50\uC9D1\uD569 0\uAC1C\uC778 \uC81C\uCD9C \uB370\uC774\uD130", act: "\uBC15\uAC1C\uBC1C\uB85C \uD2B9\uC815 \uC2DC\uAC04\uB9CC '\uAC00\uB2A5' \uB610\uB294 '\uBD88\uAC00' \uC704\uC8FC \uC81C\uCD9C", expect: "\uC644\uD654 \uBC43\uC9C0 \u2192 \uBD80\uBD84 \uC131\uB9BD \uCE74\uB4DC\uC758 [\uAC00\uC6A9\uC131 \uC7AC\uC694\uCCAD](\uBC1C\uC1A1 \uD6C4 \u2713 \uC0C1\uD0DC) \uB610\uB294 [\uCC38\uC870\uC790\uB85C \uBCC0\uACBD\uD558\uACE0 \uC9C4\uD589](\uAC15\uB4F1). \uC7AC\uC694\uCCAD \uB300\uC0C1\uC73C\uB85C \uC7AC\uC9C4\uC785\uD574 \uC2AC\uB86F\uC744 \uC5F4\uBA74 \uCD94\uCC9C\uC774 \uC0C1\uC704 \uB2E8\uACC4\uB85C \uC989\uC2DC \uBCF5\uADC0" }), /* @__PURE__ */ import_react.default.createElement(ExBlock, { title: "EX-02 \xB7 \uC774\uB3D9 \uBC84\uD37C", cond: "\uC0C1\uC2DC", act: "\uCC38\uC11D\uC790\uC5D0\uC11C \uC774\uB514\uC790 \uC120\uD0DD", expect: "7/17 \uC624\uC804 3\uC2AC\uB86F \uC7A0\uAE08 \u2014 \uD0ED \uC2DC \uC2E4\uC81C \uC77C\uC815\uBA85 \uD1A0\uC2A4\uD2B8, \uD558\uB2E8\uC5D0 \uCD9C\uCC98 \uCEA1\uC158" }), /* @__PURE__ */ import_react.default.createElement(ExBlock, { title: "EX-03 \xB7 \uB9C8\uAC10 \uC720\uC608", cond: "\uBC15\uAC1C\uBC1C \uBBF8\uC81C\uCD9C", act: "\uD328\uB110 \uAC00\uC0C1 \uC2DC\uACC4 \u2192 '\uB9C8\uAC10 \uB3C4\uB2EC'", expect: "\uACBD\uACE0 \uBC30\uB108(\uBA85\uB2E8+\uB3C5\uCD09/\uAC15\uC81C \uB9C8\uAC10). \uAC15\uC81C \uB9C8\uAC10\uC740 \uD655\uC778 \uC601\uC5ED\uC5D0\uC11C \uB3C5\uCD09 \uC774\uB825 \uD655\uC778 \uD6C4 \uC2E4\uD589" }), /* @__PURE__ */ import_react.default.createElement(ExBlock, { title: "EX-04 \xB7 \uD655\uC815 \uCDA9\uB3CC", cond: "\uD328\uB110 EX-04 ON", act: "[\uCD5C\uC885 \uD655\uC815] \u2192 \uD655\uC778", expect: "\uD655\uC815 \uCDE8\uC18C + \uC2E4\uB370\uC774\uD130 \uBCC0\uB3D9(\uC81C\uC678 \uC2AC\uB86F \uBA85\uC2DC \uBC30\uB108) + '\uC0C8 \uCD94\uCC9C' \uD45C\uC2DC" }), /* @__PURE__ */ import_react.default.createElement(ExBlock, { title: "EX-05 \xB7 \uD655\uC815 \uD6C4 \uC774\uD0C8 (2\uACBD\uB85C)", cond: "\uD655\uC815 \uC644\uB8CC \uC0C1\uD0DC", act: "A: \uCC38\uC11D\uC790 \uD655\uC815 \uC548\uB0B4\uC758 [\uAC11\uC790\uAE30 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6CC\uC84C\uB098\uC694?] (\uC2E4\uAD6C\uD604) / B: \uD328\uB110 [\uC774\uD0C8 \uBC1C\uC0DD\uC2DC\uD0A4\uAE30] (\uC678\uBD80 \uCE98\uB9B0\uB354 \uAC10\uC9C0 \uBAA8\uD0B9)", expect: "\uD544\uC218 \uCC38\uC11D\uC790 \uCDE8\uC18C \uC2DC \uC7AC\uC870\uC728 \uAD6D\uBA74 \u2014 \uC774\uD0C8\uC790\uB294 \uC804\uC6A9 \uC548\uB0B4, \uB2E4\uB978 \uCC38\uC11D\uC790\uB294 \uAC00\uC6A9 \uC2DC\uAC04 \uC5C5\uB370\uC774\uD2B8 \uAC00\uB2A5" }), /* @__PURE__ */ import_react.default.createElement(H, null, "4. \uB450 \uCC3D\uC73C\uB85C \uB098\uB780\uD788 \uBCF4\uAE30"), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanelForeground} text-xs leading-relaxed` }, '\uAC19\uC740 \uC8FC\uC18C \uB450 \uCC3D \u2014 \uC81C\uCD9C\xB7\uD655\uC815\xB7\uC720\uC785\uC774 \uC2E4\uC2DC\uAC04 \uB3D9\uAE30\uD654(storage \uC774\uBCA4\uD2B8 \uC2E4\uAD6C\uD604). \uD328\uB110 \uD1A0\uAE00\uC740 \uCC3D\uBCC4 \uB3C5\uB9BD. \uC54C\uB9BC "\uC218\uC2E0"\uC740 \uC7AC\uD604\uD558\uC9C0 \uC54A\uC74C \u2014 \uB2F9\uC0AC\uC790\uB294 \uB9C1\uD06C \uC7AC\uC9C4\uC785 \uC2DC \uD654\uBA74\uC73C\uB85C \uC778\uC9C0 (\uB370\uBAA8 \uACBD\uACC4).'), /* @__PURE__ */ import_react.default.createElement(H, null, "5. \uB370\uC774\uD130 \uCD08\uAE30\uD654"), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanelForeground} text-xs leading-relaxed` }, "\uD328\uB110 [\uB370\uC774\uD130 \uCD08\uAE30\uD654] \uB610\uB294 \uC644\uB8CC \uD654\uBA74 [\uC0C8 \uD68C\uC758 \uB9CC\uB4E4\uAE30]."));
  };
  const HostCreateScreen = () => /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-6 min-h-screen max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.foreground} text-2xl font-bold tracking-tight` }, "\uC0C8 \uD68C\uC758 \uC77C\uC815 \uC7A1\uAE30"), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm` }, "\uB3C4\uBA54\uC778 \uBA64\uBC84\uB4E4\uC758 \uC678\uBD80 \uCE98\uB9B0\uB354 \uC77C\uC815\uC744 \uC790\uB3D9\uC73C\uB85C \uC870\uC728\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-4" }, meeting.launched ? /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground}` }, meeting.title) : /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground}`,
      value: meeting.title,
      onChange: (e) => setMeeting((m) => ({ ...m, title: e.target.value })),
      placeholder: "\uD68C\uC758 \uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694"
    }
  ), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground} appearance-none pr-9`,
      value: meeting.durationLabel || "1h",
      disabled: meeting.launched,
      onChange: (e) => setMeeting((m) => ({ ...m, durationLabel: e.target.value }))
    },
    /* @__PURE__ */ import_react.default.createElement("option", { value: "30m" }, "30\uBD84 \uB2E8\uC704"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "1h" }, "1\uC2DC\uAC04 \uB2E8\uC704"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "1h30m" }, "1\uC2DC\uAC04 30\uBD84 \uB2E8\uC704"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "2h" }, "2\uC2DC\uAC04 \uB2E8\uC704")
  ), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs` }, "\u25BC")), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border flex flex-col items-center text-center gap-1` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uC870\uC728 \uAE30\uAC04 (\uC885\uB8CC \uC2DC\uAC01\uC774 \uC751\uB2F5 \uB9C8\uAC10\uC774\uC5D0\uC694)"), meeting.launched ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm font-medium` }, fmtPeriod(meeting.coordinationPeriod), " ", meeting.coordinationPeriod.endTime) : /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-center gap-1 flex-wrap" }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "date",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      value: meeting.coordinationPeriod.start,
      onChange: (e) => setMeeting((m) => ({ ...m, coordinationPeriod: { ...m.coordinationPeriod, start: e.target.value } }))
    }
  ), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "~"), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "date",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      min: meeting.coordinationPeriod.start,
      value: meeting.coordinationPeriod.end,
      onChange: (e) => {
        const newEnd = e.target.value;
        setMeeting((m) => {
          const invalidated = m.candidatePeriod.start <= newEnd;
          return {
            ...m,
            coordinationPeriod: { ...m.coordinationPeriod, end: newEnd },
            candidatePeriod: invalidated ? { start: "", end: "" } : m.candidatePeriod
          };
        });
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "time",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      value: meeting.coordinationPeriod.endTime,
      onChange: (e) => setMeeting((m) => ({ ...m, coordinationPeriod: { ...m.coordinationPeriod, endTime: e.target.value } }))
    }
  ))), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border flex flex-col items-center text-center gap-1` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD68C\uC758 \uD6C4\uBCF4 \uB0A0\uC9DC"), meeting.launched ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm font-medium` }, fmtPeriod(meeting.candidatePeriod)) : meeting.candidatePeriod.start === "" ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs` }, "\uC870\uC728 \uAE30\uAC04\uC774 \uBC14\uB00C\uC5B4 \uD68C\uC758 \uD6C4\uBCF4 \uB0A0\uC9DC\uB97C \uB2E4\uC2DC \uC120\uD0DD\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-center gap-1" }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "date",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      min: FULL_DATES.find((d) => d > meeting.coordinationPeriod.end) || meeting.coordinationPeriod.end,
      onChange: (e) => setMeeting((m) => ({ ...m, candidatePeriod: { start: e.target.value, end: e.target.value } }))
    }
  ))) : /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-center gap-1" }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "date",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      min: FULL_DATES.find((d) => d > meeting.coordinationPeriod.end) || meeting.coordinationPeriod.end,
      value: meeting.candidatePeriod.start,
      onChange: (e) => setMeeting((m) => ({ ...m, candidatePeriod: { ...m.candidatePeriod, start: e.target.value } }))
    }
  ), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "~"), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "date",
      className: `${T.foreground} text-sm font-medium bg-transparent border-0 p-0`,
      min: meeting.candidatePeriod.start,
      max: FULL_DATES[Math.min(FULL_DATES.indexOf(meeting.candidatePeriod.start) + 6, FULL_DATES.length - 1)],
      value: meeting.candidatePeriod.end,
      onChange: (e) => setMeeting((m) => ({ ...m, candidatePeriod: { ...m.candidatePeriod, end: e.target.value } }))
    }
  )))), /* @__PURE__ */ import_react.default.createElement("div", { className: `flex flex-col gap-3 border-t ${T.border} pt-4` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, "\uCC38\uC11D\uC790 \uC5ED\uD560 \uC815\uD558\uAE30 (\uCD1D ", meeting.members.length, "\uBA85)"), meeting.launched && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD68C\uC758\uB97C \uC5F0 \uB4A4\uC5D0\uB294 \uC5ED\uD560\uC744 \uBC14\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC5B4\uC694 \u2014 \uCD94\uCC9C \uCE74\uB4DC\uC5D0\uC11C \uC120\uD0DD \uCC38\uC11D\uC790\uB85C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."), meeting.members.map((member) => /* @__PURE__ */ import_react.default.createElement("div", { key: member.id, className: `flex justify-between items-center ${T.pCard} ${T.card} ${T.border} ${T.roundedElement} border` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-medium text-sm` }, member.name), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, member.email)), member.role === "HOST" ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold` }, "\uD544\uC218 \uCC38\uC11D\uC790 \xB7 \uC8FC\uCD5C\uC790") : meeting.launched ? (
    /* [DS-FLOW-H01-LOCK] 발의 후 표시형 뱃지 — 통지 없는 배제 뒷문 차단 */
    /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.background} ${T.mutedForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-medium` }, member.attendance === "REQUIRED" ? "\uD544\uC218 \uCC38\uC11D\uC790" : "\uC120\uD0DD \uCC38\uC11D\uC790", " \xB7 \uC7A0\uAE40")
  ) : /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-1" }, [["REQUIRED", "\uD544\uC218 \uCC38\uC11D\uC790"], ["OPTIONAL", "\uC120\uD0DD \uCC38\uC11D\uC790"]].map(([val, label]) => /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      key: val,
      className: `${member.attendance === val ? `${T.success} ${T.primaryForeground} font-bold` : `${T.background} ${T.mutedForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`,
      onClick: () => setMeeting((m) => ({ ...m, members: m.members.map((x) => x.id === member.id ? { ...x, attendance: val } : x) }))
    },
    label
  )))))), /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: `${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold mt-auto ${T.pressed} ${meeting.launched || !meeting.candidatePeriod.start ? T.disabled : ""}`,
      onClick: launchMeeting,
      disabled: meeting.launched || !meeting.candidatePeriod.start
    },
    meeting.launched ? "\uC774\uBBF8 \uBC1C\uC758\uB41C \uD68C\uC758\uC785\uB2C8\uB2E4" : "\uD68C\uC758 \uAC1C\uC124 \uBC0F \uCD08\uB300 \uB9C1\uD06C \uC0DD\uC131\uD558\uAE30"
  ), !meeting.launched && !meeting.candidatePeriod.start && /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.textWarning} text-xs text-center` }, "\uD68C\uC758 \uD6C4\uBCF4 \uB0A0\uC9DC\uB97C \uBA3C\uC800 \uC120\uD0DD\uD574\uC8FC\uC138\uC694."), meeting.launched && /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: `${T.card} border ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} text-sm font-medium ${T.pressed}`,
      onClick: () => navigate("/host/dashboard")
    },
    "\uB300\uC2DC\uBCF4\uB4DC\uB85C \uC774\uB3D9"
  ));
  const AttendeeScreen = () => {
    if (meeting.status === "CANCELLED") {
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, "\uC774 \uD68C\uC758\uB294 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), meeting.cancelReason && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, meeting.cancelReason)));
    }
    if (meeting.status === "COMPLETED") {
      if (lateJoinId) {
        return GridEditor({ onBack: () => {
          setLateJoinId(null);
          setCancelStage(null);
        }, submitLabel: "\uC2DC\uAC04 \uC81C\uCD9C\uD558\uAE30" });
      }
      if (cancelStage && cancelStage.step === "AUTH") {
        return MemberPicker({
          title: "\uB0B4 \uC0C1\uD669 \uD655\uC778\uD558\uAE30",
          sub: "\uBCF8\uC778\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.",
          onBack: () => setCancelStage(null),
          onPick: (id) => {
            const mem = meeting.members.find((x) => x.id === id);
            if (mem.status !== "SUBMITTED") {
              setCancelStage(null);
              selectMember(id);
              setLateJoinId(id);
            } else setCancelStage({ step: "CONFIRM", id });
          }
        });
      }
      if (cancelStage && cancelStage.step === "CONFIRM") {
        const m = meeting.members.find((x) => x.id === cancelStage.id);
        const isReq = m.attendance === "REQUIRED";
        const already = meeting.declinedOptionalIds.includes(m.id);
        return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-3` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-bold` }, m.name, "\uB2D8\uC758 \uCC38\uC11D \uCDE8\uC18C"), already ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, "\uC774\uBBF8 \uBD88\uCC38\uC744 \uC54C\uB838\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            className: `${T.card} border ${T.border} ${T.foreground} w-full py-2 ${T.roundedElement} text-xs font-medium ${T.pressed}`,
            onClick: () => setCancelStage(null)
          },
          "\uB3CC\uC544\uAC00\uAE30"
        )) : ConfirmArea({
          sentence: isReq ? "\uD68C\uC6D0\uB2D8\uC740 \uD544\uC218 \uCC38\uC11D\uC790\uC608\uC694. \uCC38\uC11D\uC744 \uCDE8\uC18C\uD558\uBA74 \uC774 \uC2DC\uAC04\uC758 \uD655\uC815\uC774 \uCDE8\uC18C\uB418\uACE0, \uC8FC\uCD5C\uC790\uC5D0\uAC8C \uC54C\uB824\uC9C0\uBA70 \uB2E4\uB978 \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uCC3E\uAE30 \uC2DC\uC791\uD574\uC694." : "\uD68C\uC6D0\uB2D8\uC740 \uC120\uD0DD \uCC38\uC11D\uC790\uB77C \uD68C\uC758 \uC9C4\uD589\uC5D0\uB294 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694. \uC8FC\uCD5C\uC790\uC5D0\uAC8C \uBD88\uCC38 \uC18C\uC2DD\uB9CC \uC804\uB2EC\uB3FC\uC694.",
          cancelLabel: "\uB3CC\uC544\uAC00\uAE30",
          execLabel: isReq ? "\uCC38\uC11D \uCDE8\uC18C\uD558\uAE30" : "\uBD88\uCC38 \uC54C\uB9AC\uAE30",
          onCancel: () => setCancelStage(null),
          onExec: () => cancelAttendance(m.id)
        })));
      }
      const copy = registrationCopy();
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.successLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD68C\uC758\uAC00 \uD655\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-xl font-bold` }, fmtSlot(meeting.confirmedSlot)), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textSuccess} text-sm` }, copy.main), copy.absentLines.map((line) => /* @__PURE__ */ import_react.default.createElement("span", { key: line, className: `${T.textWarning} text-xs` }, line))), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs underline ${T.pressed}`, onClick: () => setCancelStage({ step: "AUTH" }) }, "\uB0B4 \uCC38\uC11D \uC0C1\uD669\uC744 \uD655\uC778\uD558\uAC70\uB098 \uBC14\uAFB8\uACE0 \uC2F6\uC5B4\uC694"));
    }
    if (meeting.status === "CONFLICT") {
      if (conflictEdit === "AUTH") {
        return MemberPicker({
          title: "\uB0B4 \uC2DC\uAC04 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uAE30",
          sub: "\uBCF8\uC778\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.",
          onBack: () => setConflictEdit(null),
          onPick: (id) => {
            preCancelSnapshot.current = null;
            selectMember(id);
            setConflictEdit(canQuickReconfirm(id) ? "QUICK" : "GRID");
          }
        });
      }
      if (conflictEdit === "QUICK") {
        const me = meeting.members.find((m) => m.id === currentMemberId);
        const alreadyUpdated = meeting.reMatchUpdatedIds.includes(currentMemberId);
        return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uB300\uCCB4 \uC2DC\uAC04 \uD6C4\uBCF4"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-lg font-bold` }, fmtSlot(quickReconfirmSlot.slotKey)), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, me?.name, "\uB2D8\uC740 \uC774\uBBF8 \uC774 \uC2DC\uAC04\uC5D0 \uC751\uB2F5\uD55C \uC801\uC774 \uC788\uC5B4\uC694. \uC5EC\uC804\uD788 \uAC00\uB2A5\uD558\uC2E0\uAC00\uC694?")), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            className: `${alreadyUpdated ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed} ${alreadyUpdated ? T.disabled : ""}`,
            disabled: alreadyUpdated,
            onClick: () => {
              if (alreadyUpdated) return;
              setMeeting((prev) => commitMeeting({ ...prev, reMatchUpdatedIds: trackRematchUpdate(prev.reMatchUpdatedIds, prev.status, currentMemberId) }));
              preCancelSnapshot.current = null;
              showToast("\uBC18\uC601\uD588\uC5B4\uC694");
            }
          },
          alreadyUpdated ? "\u2713 \uBC18\uC601 \uC644\uB8CC" : "\uB124, \uC5EC\uC804\uD788 \uAC00\uB2A5\uD574\uC694"
        ), alreadyUpdated ? /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs underline ${T.pressed}`, onClick: () => setConflictEdit(null) }, "\uB3CC\uC544\uAC00\uAE30") : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs underline ${T.pressed}`, onClick: () => setConflictEdit("GRID") }, "\uB2E4\uB978 \uC2DC\uAC04\uC744 \uC9C1\uC811 \uACE0\uB97C\uAC8C\uC694"), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.mutedForeground} text-xs underline ${T.pressed}`, onClick: handleConflictBack }, "\uB4A4\uB85C\uAC00\uAE30")));
      }
      if (conflictEdit === "GRID") {
        return GridEditor({ onBack: handleConflictBack, submitLabel: "\uB0B4 \uC2DC\uAC04 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uAE30" });
      }
      const droppedName = nameOf(meeting.droppedMemberId);
      const causeText = {
        SELF_CANCEL: "\uC774 \uC2DC\uAC04\uC5D0 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6CC\uC838",
        LATE_MISMATCH: "\uB4A4\uB2A6\uAC8C \uC751\uB2F5\uD588\uB294\uB370 \uC774 \uC2DC\uAC04\uC774 \uB9DE\uC9C0 \uC54A\uC544",
        WEBHOOK: "\uC77C\uC815\uC774 \uACB9\uCCD0"
      }[meeting.dropReason] || "\uC77C\uC815\uC774 \uACB9\uCCD0";
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-lg font-bold` }, "\uB2E4\uB978 \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uCC3E\uACE0 \uC788\uC5B4\uC694"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, droppedName, "\uB2D8\uC774 ", causeText, " \uC8FC\uCD5C\uC790\uAC00 \uB300\uCCB4 \uC2DC\uAC04\uC744 \uCC3E\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD655\uC815\uB418\uBA74 \uC774 \uB9C1\uD06C\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`,
          onClick: () => setConflictEdit("AUTH")
        },
        "\uB0B4 \uC2DC\uAC04 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uAE30"
      ));
    }
    if (attendeeStage === "INVITE") {
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-6 justify-center min-h-[70vh] max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2 text-center" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, hostName, "\uB2D8\uC774 \uD68C\uC758 \uC77C\uC815 \uC870\uC728\uC5D0 \uCD08\uB300\uD588\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-2xl font-bold` }, meeting.title), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-3 justify-center" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.card} ${T.border} ${T.mutedForeground} ${T.roundedElement} border px-2 py-1 text-xs` }, "\uC18C\uC694 1\uC2DC\uAC04"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.card} ${T.border} ${T.mutedForeground} ${T.roundedElement} border px-2 py-1 text-xs` }, "\uC751\uB2F5 \uB9C8\uAC10 ", fmtDeadline(meeting.coordinationPeriod)))), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold ${T.pressed}`, onClick: () => setAttendeeStage("AUTH") }, "\uAC00\uC785 \uC5C6\uC774 \uBC14\uB85C \uC751\uB2F5\uD558\uAE30"));
    }
    if (attendeeStage === "AUTH") {
      return MemberPicker({
        title: "\uCC38\uC11D\uC790 \uD655\uC778",
        sub: "\uBCF8\uC778\uC758 \uC774\uB984\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.",
        onPick: (id) => {
          selectMember(id);
          setAttendeeStage("GRID");
        }
      });
    }
    if (attendeeStage === "DONE") {
      const me = meeting.members.find((m) => m.id === currentMemberId) || {};
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-6 justify-center min-h-[70vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textSuccess} text-2xl font-bold` }, "\uC81C\uCD9C \uC644\uB8CC"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, me.name, "\uB2D8\uC758 \uC2DC\uAC04\uC774 \uC81C\uCD9C\uB410\uC5B4\uC694."), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm font-medium` }, "\uC9C0\uAE08\uAE4C\uC9C0 ", submittedCount, "/", meeting.members.length, "\uBA85 \uC81C\uCD9C\uD588\uC5B4\uC694")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.card} ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} border text-sm font-medium ${T.pressed}`,
          onClick: () => setAttendeeStage("GRID")
        },
        "\uB0B4 \uC2DC\uAC04 \uB2E4\uC2DC \uACE0\uCE58\uAE30"
      ), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.card} ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} border text-sm font-medium ${T.pressed}`,
          onClick: () => {
            setCurrentMemberId(null);
            setAttendeeStage("AUTH");
          }
        },
        "\uB2E4\uB978 \uC0AC\uB78C\uC73C\uB85C \uC751\uB2F5\uD558\uAE30"
      ), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`,
          onClick: () => navigate("/host/dashboard")
        },
        "\uC8FC\uCD5C\uC790 \uD654\uBA74\uC5D0\uC11C \uACB0\uACFC \uBCF4\uAE30"
      )));
    }
    return GridEditor({ onBack: () => setAttendeeStage("AUTH"), submitLabel: "\uC2DC\uAC04 \uC81C\uCD9C\uD558\uAE30" });
  };
  const HostDashboardScreen = () => {
    if (meeting.status === "CANCELLED") {
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, "\uC774 \uD68C\uC758\uB294 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), meeting.cancelReason && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, meeting.cancelReason)), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`,
          onClick: () => resetDemoData("/")
        },
        "\uC0C8 \uD68C\uC758 \uB9CC\uB4E4\uAE30"
      ));
    }
    if (meeting.status === "COMPLETED") {
      const copy = registrationCopy();
      const cfReset = confirmOpen && confirmOpen.type === "RESET";
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.successLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-3 text-center` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uD68C\uC758 \uD655\uC815 \uC644\uB8CC"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-3xl font-bold` }, fmtSlot(meeting.confirmedSlot)), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textSuccess} text-sm` }, copy.main), copy.absentLines.map((line) => /* @__PURE__ */ import_react.default.createElement("span", { key: line, className: `${T.textWarning} text-xs` }, line)), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`,
          onClick: () => setConfirmOpen(cfReset ? null : { type: "RESET" })
        },
        "\uC0C8 \uD68C\uC758 \uB9CC\uB4E4\uAE30"
      ), cfReset && ConfirmArea({
        sentence: "\uC800\uC7A5\uB41C \uB370\uBAA8 \uB370\uC774\uD130\uAC00 \uC0AD\uC81C\uB418\uACE0 \uCC98\uC74C \uC0C1\uD0DC\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4.",
        execLabel: "\uC0AD\uC81C\uD558\uACE0 \uC0C8\uB85C \uC2DC\uC791",
        onExec: () => resetDemoData("/")
      })), HeatView({ collapsedLabel: "\uB2E4\uB978 \uC2DC\uAC04\uB300 \uBE44\uAD50\uD574\uBCF4\uAE30" }), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-sm` }, submittedCount, "\uBA85 \uC81C\uCD9C \uC644\uB8CC")), syncChecking && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50` }, "\uBAA8\uB450\uC758 \uCE98\uB9B0\uB354 \uD655\uC778\uD558\uB294 \uC911..."));
    }
    const cfForce = confirmOpen && confirmOpen.type === "FORCE_CLOSE";
    const allNudged = dl.pendingIds.every((id) => meeting.nudgedIds.includes(id));
    const pendingPromotion = findPending(meeting.promotionRequests);
    const pendingReinstate = findPending(meeting.reinstateRequests);
    const cfCancelMeeting = confirmOpen && confirmOpen.type === "CANCEL_MEETING";
    return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full` }, pendingPromotion && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.successLight} ${T.border} ${T.foreground} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, nameOf(pendingPromotion.id), "\uB2D8\uC774 \uCC38\uC870\uC790 \uC804\uD658\uC744 \uC694\uCCAD\uD588\uC5B4\uC694", pendingPromotion.reason && /* @__PURE__ */ import_react.default.createElement("span", { className: `block ${T.mutedForeground} font-normal mt-0.5` }, "\uC0AC\uC720: ", pendingPromotion.reason)), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2 shrink-0" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.card} border ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`,
        onClick: () => rejectPromotionRequest(pendingPromotion.id)
      },
      "\uAC70\uC808"
    ), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`,
        onClick: () => approvePromotionRequest(pendingPromotion.id)
      },
      "\uC2B9\uC778"
    ))), pendingReinstate && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.successLight} ${T.border} ${T.foreground} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-center gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, nameOf(pendingReinstate.id), "\uB2D8\uC774 \uB2E4\uC2DC \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uB418\uACE0 \uC2F6\uB2E4\uACE0 \uC694\uCCAD\uD588\uC5B4\uC694", pendingReinstate.reason && /* @__PURE__ */ import_react.default.createElement("span", { className: `block ${T.mutedForeground} font-normal mt-0.5` }, "\uC0AC\uC720: ", pendingReinstate.reason)), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2 shrink-0" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.card} border ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`,
        onClick: () => rejectReinstateRequest(pendingReinstate.id)
      },
      "\uAC70\uC808"
    ), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`,
        onClick: () => approveReinstateRequest(pendingReinstate.id)
      },
      "\uC2B9\uC778"
    ))), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uCD08\uB300 \uB9C1\uD06C"), /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} text-sm font-mono break-all` }, "meetsync.app/m/", meeting.meetingId), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.card} ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} border text-xs ${T.pressed}`,
        onClick: () => showToast("\uB9C1\uD06C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4")
      },
      "\uB9C1\uD06C \uBCF5\uC0AC"
    ), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`,
        onClick: () => navigate("/attendee")
      },
      "\uB9C1\uD06C \uC5F4\uC5B4\uBCF4\uAE30"
    ))), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.mutedForeground} text-xs underline text-left ${T.pressed}`,
        onClick: () => setConfirmOpen(cfCancelMeeting ? null : { type: "CANCEL_MEETING" })
      },
      "\uC774 \uD68C\uC758 \uCDE8\uC18C\uD558\uAE30"
    ), cfCancelMeeting && ConfirmArea({
      sentence: "\uC774 \uD68C\uC758\uB97C \uCDE8\uC18C\uD569\uB2C8\uB2E4. \uBAA8\uB4E0 \uCC38\uC11D\uC790\uAC00 \uB354 \uC774\uC0C1 \uC774 \uB9C1\uD06C\uB85C \uC77C\uC815\uC744 \uC870\uC728\uD558\uAC70\uB098 \uD655\uC778\uD560 \uC218 \uC5C6\uAC8C \uB429\uB2C8\uB2E4.",
      execLabel: "\uD68C\uC758 \uCDE8\uC18C\uD558\uAE30",
      onExec: () => cancelMeeting(cancelReasonDraft),
      extra: /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          className: `${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`,
          placeholder: "\uCDE8\uC18C \uC0AC\uC720 (\uCC38\uC11D\uC790\uC5D0\uAC8C \uD45C\uC2DC\uB429\uB2C8\uB2E4, \uC120\uD0DD)",
          defaultValue: cancelReasonDraft,
          onChange: (e) => setCancelReasonDraft(e.target.value)
        }
      )
    }), dl.alertBannerActive && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.destructiveLight} ${T.borderDestructive} ${T.textDestructive} ${T.pCard} ${T.roundedElement} border text-sm flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\uC544\uC9C1 \uB2F5 \uC548 \uD55C \uD544\uC218 \uCC38\uC11D\uC790: ", dl.pendingList.join(", "), ". \uB9C8\uAC10\uC744 \uBBF8\uB8E8\uACE0 \uC788\uC5B4\uC694."), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`,
        onClick: () => nudge(dl.pendingIds)
      },
      "\uB2E4\uC2DC \uC54C\uB9BC \uBCF4\uB0B4\uAE30"
    ), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `${T.card} ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} border text-xs ${T.pressed}`,
        onClick: () => setConfirmOpen(cfForce ? null : { type: "FORCE_CLOSE" })
      },
      "\uBE7C\uACE0 \uB9C8\uAC10\uD558\uAE30"
    )), cfForce && ConfirmArea({
      history: allNudged ? /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.mutedForeground} text-xs` }, "\uC774\uBBF8 \uC54C\uB9BC \uBCF4\uB0C8\uC5B4\uC694 \u2713 \xB7 \uC544\uC9C1 \uB2F5 \uC5C6\uC74C") : /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs` }, dl.pendingList.join(", "), "\uB2D8\uC5D0\uAC8C \uC544\uC9C1 \uC54C\uB9BC\uC744 \uC548 \uBCF4\uB0C8\uC5B4\uC694"), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.card} border ${T.border} ${T.foreground} px-2 py-1 ${T.roundedElement} text-xs ${T.pressed} shrink-0`,
          onClick: () => nudge(dl.pendingIds)
        },
        "\uBA3C\uC800 \uC54C\uB9BC \uBCF4\uB0B4\uAE30"
      )),
      sentence: `${dl.pendingList.join(", ")}\uB2D8\uC744 \uBE7C\uACE0 \uACB0\uACFC\uB97C \uACC4\uC0B0\uD574\uC694. \uB098\uC911\uC5D0 \uC81C\uCD9C\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uD3EC\uD568\uB3FC\uC694.`,
      execLabel: "\uBE7C\uACE0 \uB9C8\uAC10\uD558\uAE30",
      onExec: forceCloseExec
    })), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, meeting.periodExtendedFrom != null ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, "\uC81C\uCD9C \uD604\uD669 ", meeting.extensionUpdatedIds.length, "/", meeting.members.length, "\uBA85 (\uAE30\uAC04 \uD655\uC7A5 \u2014 \uC0C8 \uB0A0\uC9DC \uC751\uB2F5 \uD544\uC694)"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-3 flex-wrap" }, meeting.members.map((m) => {
      const reflected = meeting.extensionUpdatedIds.includes(m.id);
      return /* @__PURE__ */ import_react.default.createElement("span", { key: m.id, className: `text-xs ${reflected ? T.textSuccess : T.mutedForeground}` }, m.name, " ", reflected ? "\u2713" : "\uB300\uAE30", m.attendance === "OPTIONAL" ? " (\uC120\uD0DD)" : "");
    }))) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, "\uC81C\uCD9C \uD604\uD669 ", submittedCount, "/", meeting.members.length, "\uBA85"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-3 flex-wrap" }, meeting.members.map((m) => /* @__PURE__ */ import_react.default.createElement("span", { key: m.id, className: `text-xs ${m.status === "SUBMITTED" ? T.textSuccess : T.mutedForeground}` }, m.name, " ", m.status === "SUBMITTED" ? "\u2713" : meeting.forceClosed && m.attendance === "REQUIRED" ? "\uC81C\uC678" : "\u2026", m.attendance === "OPTIONAL" ? " (\uC120\uD0DD)" : ""))))), HeatView({ collapsedLabel: "\uB2E4 \uAC19\uC774 \uB418\uB294 \uC2DC\uAC04 \uBCF4\uAE30" }), !dl.shouldBlockResult && top3.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: `${T.foreground} text-xl font-bold` }, "\uCD94\uCC9C \uC2DC\uAC04 Top 3"), RecommendList({ items: top3 })), dl.shouldBlockResult && !dl.alertBannerActive && /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm text-center` }, "\uBAA8\uB4E0 \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uC751\uB2F5\uD558\uBA74 \uCD94\uCC9C \uC2DC\uAC04\uC774 \uC0B0\uCD9C\uB429\uB2C8\uB2E4."), syncChecking && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50` }, "\uBAA8\uB450\uC758 \uCE98\uB9B0\uB354 \uD655\uC778\uD558\uB294 \uC911..."));
  };
  const ReMatchScreen = () => {
    if (meeting.status !== "CONFLICT") {
      return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} ${T.pScreen} flex flex-col gap-3 items-center justify-center min-h-[60vh]` }, /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.mutedForeground} text-sm` }, "\uD604\uC7AC \uC7AC\uC870\uC728\uC774 \uD544\uC694\uD55C \uD68C\uC758\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          className: `${T.primary} ${T.primaryForeground} ${T.roundedElement} px-4 py-2 text-xs font-bold ${T.pressed}`,
          onClick: () => navigate("/host/dashboard")
        },
        "\uB300\uC2DC\uBCF4\uB4DC\uB85C \uB3CC\uC544\uAC00\uAE30"
      ));
    }
    const dropped = meeting.members.find((m) => m.id === meeting.droppedMemberId) || {};
    const rematchGate = deriveRematchGate(meeting);
    return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.warningLight} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react.default.createElement("h1", { className: `${T.textWarning} text-xl font-bold` }, "\uC77C\uC815 \uC7AC\uC870\uC728\uC774 \uD544\uC694\uD569\uB2C8\uB2E4"), /* @__PURE__ */ import_react.default.createElement("p", { className: `${T.textWarning} text-sm` }, dropped.name, "\uB2D8\uC774 ", { SELF_CANCEL: "\uC774 \uC2DC\uAC04\uC5D0 \uCC38\uC11D\uC774 \uC5B4\uB824\uC6CC\uC838", LATE_MISMATCH: "\uB4A4\uB2A6\uAC8C \uC751\uB2F5\uD588\uB294\uB370 \uC774 \uC2DC\uAC04\uC774 \uB9DE\uC9C0 \uC54A\uC544", WEBHOOK: "\uC77C\uC815\uC774 \uACB9\uCCD0" }[meeting.dropReason] || "\uC77C\uC815\uC774 \uACB9\uCCD0", " \uB300\uCCB4 \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uCC3E\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uCC38\uC11D\uC790\uB4E4\uC774 \uC2DC\uAC04\uC744 \uB2E4\uC2DC \uC54C\uB824\uC8FC\uBA74 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2` }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.foreground} font-semibold text-sm` }, "\uC7AC\uC870\uC728 \uBC18\uC601 \uD604\uD669 ", meeting.reMatchUpdatedIds.length, "/", meeting.members.length, "\uBA85"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-3 flex-wrap" }, meeting.members.map((m) => {
      const updated = meeting.reMatchUpdatedIds.includes(m.id);
      return /* @__PURE__ */ import_react.default.createElement("span", { key: m.id, className: `text-xs ${updated ? T.textSuccess : T.mutedForeground}` }, m.name, " ", updated ? "\u2713 \uAC31\uC2E0\uD568" : "\u2026 \uB300\uAE30", m.attendance === "OPTIONAL" ? " (\uC120\uD0DD)" : "");
    })), rematchGate.blocked && /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.textWarning} text-xs` }, "\uBAA8\uB4E0 \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uAC31\uC2E0\uD558\uBA74 \uCD5C\uC885 \uD655\uC815\uD560 \uC218 \uC788\uC5B4\uC694.")), RecommendList({ items: rematchTop3, gate: rematchGate }), syncChecking && /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50` }, "\uBAA8\uB450\uC758 \uCE98\uB9B0\uB354 \uD655\uC778\uD558\uB294 \uC911..."));
  };
  const ScenarioPanel = () => {
    const SegBtn = ({ on, children, onClick }) => /* @__PURE__ */ import_react.default.createElement("button", { className: `px-2 py-1 ${T.roundedElement} ${T.pressed} ${on ? `${T.success} ${T.primaryForeground} font-bold` : `${T.devpanelForeground} border ${T.border}`}`, onClick }, children);
    const Hint = ({ children }) => /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.devpanelForeground} text-[10px] opacity-80` }, children);
    const dropoutReady = meeting.status === "COMPLETED";
    return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.devpanel} ${T.devpanelForeground} fixed bottom-0 inset-x-0 ${T.pCard} font-mono text-xs z-50 flex flex-col gap-2 max-h-[40vh] overflow-y-auto` }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${T.primaryForeground} font-bold` }, "DEMO CONTROL"), /* @__PURE__ */ import_react.default.createElement("button", { className: `${T.devpanelForeground} ${T.pressed} font-bold px-2`, onClick: () => setPanelVisible(false) }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-6 flex-wrap items-start" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "flex items-center gap-1" }, "\uAC00\uC0C1 \uC2DC\uACC4", /* @__PURE__ */ import_react.default.createElement(SegBtn, { on: scenario.virtualClock === "BEFORE_DEADLINE", onClick: () => setScenario((s) => ({ ...s, virtualClock: "BEFORE_DEADLINE" })) }, "\uB9C8\uAC10 \uC804"), /* @__PURE__ */ import_react.default.createElement(SegBtn, { on: scenario.virtualClock === "DEADLINE_REACHED", onClick: () => setScenario((s) => ({ ...s, virtualClock: "DEADLINE_REACHED" })) }, "\uB9C8\uAC10 \uB3C4\uB2EC")), /* @__PURE__ */ import_react.default.createElement(Hint, null, scenario.virtualClock === "DEADLINE_REACHED" ? "\uC544\uC9C1 \uB2F5 \uC548 \uD55C \uD544\uC218 \uCC38\uC11D\uC790\uAC00 \uC788\uC73C\uBA74 \uB300\uC2DC\uBCF4\uB4DC\uC5D0 \uACBD\uACE0 \uBC30\uB108\uAC00 \uB5A0\uC694" : "\uB9C8\uAC10 \uD310\uC815\uC774 \uC77C\uC5B4\uB098\uC9C0 \uC54A\uC544\uC694")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "flex items-center gap-1" }, "EX-04 \uD655\uC815 \uCDA9\uB3CC", /* @__PURE__ */ import_react.default.createElement(SegBtn, { on: !scenario.ex04Conflict, onClick: () => setScenario((s) => ({ ...s, ex04Conflict: false })) }, "OFF"), /* @__PURE__ */ import_react.default.createElement(SegBtn, { on: scenario.ex04Conflict, onClick: () => setScenario((s) => ({ ...s, ex04Conflict: true })) }, "ON")), /* @__PURE__ */ import_react.default.createElement(Hint, null, scenario.ex04Conflict ? "\uB2E4\uC74C \uD655\uC815 \uC2DC\uB3C4\uB294 \uC2E4\uD328\uD574\uC694" : "\uD655\uC815\uC774 \uC815\uC0C1\uC801\uC73C\uB85C \uC131\uACF5\uD574\uC694")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: `border ${T.border} ${T.roundedElement} px-3 py-1.5 ${T.pressed} ${dropoutReady ? T.primaryForeground : T.disabled}`,
        onClick: fireDropout,
        disabled: !dropoutReady
      },
      "EX-05 \uC774\uD0C8 \uBC1C\uC0DD\uC2DC\uD0A4\uAE30"
    ), /* @__PURE__ */ import_react.default.createElement(Hint, null, dropoutReady ? "\uC678\uBD80 \uCE98\uB9B0\uB354 \uC0AD\uC81C \uAC10\uC9C0 \uC2DC\uBBAC\uB808\uC774\uC158 \u2014 \uC989\uC2DC \uC7AC\uC870\uC728\uB85C \uBC14\uB00C\uC5B4\uC694" : "\uD655\uC815 \uC644\uB8CC \uC0C1\uD0DC\uC5D0\uC11C\uB9CC \uB20C\uB7EC\uBCFC \uC218 \uC788\uC5B4\uC694")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ import_react.default.createElement("button", { className: `border ${T.border} ${T.roundedElement} px-3 py-1.5 ${T.pressed}`, onClick: () => resetDemoData("/") }, "\uB370\uC774\uD130 \uCD08\uAE30\uD654"), /* @__PURE__ */ import_react.default.createElement(Hint, null, "\uC800\uC7A5\uB41C \uB370\uC774\uD130\uB97C \uC9C0\uC6B0\uACE0 \uCC98\uC74C \uC0C1\uD0DC\uB85C \uB418\uB3CC\uB824\uC694"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2 flex-wrap" }, [["/", "L01 \uB79C\uB529"], ["/host/create", "H01 \uBC1C\uC758"], ["/attendee", "A01 \uCC38\uC11D\uC790"], ["/host/dashboard", "D01 \uB300\uC2DC\uBCF4\uB4DC"], ["/host/re-match", "R01 \uC7AC\uC870\uC728"]].map(([p, label]) => /* @__PURE__ */ import_react.default.createElement("button", { key: p, className: `border ${T.border} ${T.roundedElement} px-2 py-1 ${T.pressed}`, onClick: () => navigate(p) }, label))));
  };
  return /* @__PURE__ */ import_react.default.createElement("div", { className: `${T.background} min-h-screen` }, BrandBar(), isProductScreen && StepIndicator(), isHostScreen && AlertBannerView(), currentPath === "/" && LandingScreen(), currentPath === "/guide" && GuideScreen(), currentPath === "/host/create" && HostCreateScreen(), currentPath === "/attendee" && AttendeeScreen(), currentPath === "/host/dashboard" && HostDashboardScreen(), currentPath === "/host/re-match" && ReMatchScreen(), panelVisible && ScenarioPanel(), ToastView());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FULL_DATES,
  activeDates,
  activeSlots,
  buildMemberResponse,
  calculateBestTime,
  checkDeadlineStatus,
  deriveRematchGate,
  trackExtensionUpdate,
  trackRematchUpdate
});
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
