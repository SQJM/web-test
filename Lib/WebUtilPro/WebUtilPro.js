/**
 * @name WebUtilPro
 * @description 网页工具
 * @version 2.5.0
 * @author Wang Jia Ming
 * @createDate 2023-5-7
 * @license AGPL-3.0
 * 
 * https://opensource.org/licenses/AGPL-3.0
 */
const _WebUtilPro_VERSION = "2.5.0";
var Html = document.getElementsByTagName("html")[0];
var Head = document.head;
var Body = document.body;
const MainWindow = document.getElementById("MainWindow");

var _INIT_PAGE_WebUtilPro_FN = () => { };
var _CLOSE_PAGE_WebUtilPro_FN = () => { };

// 点击的元素
var WClickElement = null;
var WClickElementCount = 1;
// 经过的元素
var WMouseElement = null;
// 是否鼠标离开文档
var WLeaveDocument = false;

// 页面可见性
var WPageVisibility = true;

// 鼠标坐标
var WMouseClientX = 0;
var WMouseClientY = 0;

// 样式 元素
const _WebUtilPro__STYLE_ELEMENT = document.createElement("style");
// Zero 元素
const _WebUtilPro__ZERO_ELEMENT = document.createElement("div");

const WebUtilPro = (function () {
  'use strict';

  // 代码错误
  const Code_Error = {
    // 参数不匹配
    ParameterMismatch: (...arg) => {
      return new Error(`CODE Error : <${arg}> Parameter mismatch`);
    },
    // 不存在的项
    NotExistItem: (...arg) => {
      return new Error(`CODE Error : <${arg}> Not exist item`);
    },
  }

  /**
   * 定义常见的DOM事件类型
   */
  const WEvent = {
    // 鼠标点击事件
    click: "click",
    // 右键菜单事件
    contextmenu: "contextmenu",
    // 双击事件
    dblclick: "dblclick",
    // 拖拽放下事件
    drop: "drop",
    // 拖拽开始事件
    dragstart: "dragstart",
    // 拖拽中事件
    drag: "drag",
    // 拖拽中在目标上方移动事件
    dragover: "dragover",
    // 拖拽结束事件
    dragend: "dragend",
    // 拖拽进入目标事件
    dragenter: "dragenter",
    // 拖拽离开目标事件
    dragleave: "dragleave",
    // 鼠标按下事件
    mousedown: "mousedown",
    // 触摸开始
    touchstart: "touchstart",
    // 触摸移动
    touchmove: "touchmove",
    // 触摸结束
    touchend: "touchend",
    // 输入事件
    input: "input",
    // 表单变化事件
    change: "change",
    // 提交事件
    submit: "submit",
    // 鼠标移入事件
    mouseover: "mouseover",
    // 鼠标移动事件
    mousemove: "mousemove",
    // 鼠标移出事件
    mouseout: "mouseout",
    // 键盘按下事件
    keydown: "keydown",
    // 键盘释放事件
    keyup: "keyup",
    // 元素获得焦点事件
    focus: "focus",
    // 元素失去焦点事件
    blur: "blur"
  };

  /**
   * 定义窗口模式
   */
  const WWindowModel = {
    /** 默认模式 */
    default: "default",
    /** 全屏模式 */
    fullscreen: "fullscreen"
  };

  /**
   * 定义窗口大小操作
   */
  const WWindowOperation = {
    /** 无操作 */
    default: "none",
    /** 同时调整宽度和高度 */
    both: "both",
    /** 仅调整宽度 */
    horizontal: "horizontal",
    /** 仅调整高度 */
    vertical: "vertical"
  };

  /**
   * 事件级别定义
   */
  const WEventLevel = {
    /** 正常 */
    normal: 'normal',
    /** 警告 */
    warning: 'warning',
    /** 严重 */
    severe: 'severe',
    /** 错误 */
    error: 'error',
    /** 安全 */
    safety: 'safety',
    /** 通过 */
    ok: 'ok'
  };

  /**
   * 定义输入类型
   */
  const WInputType = {
    /** 文本 */
    text: "text",
    /** 密码 */
    password: "password",
    /** 搜索 */
    search: "search",
    /** 邮箱 */
    email: "email",
    /** 电话号码 */
    tel: "tel",
    /** URL */
    url: "url",
    /** 数字 */
    number: "number",
    /** 日期 */
    date: "date",
    /** 本地日期时间 */
    datetimeLocal: "datetime-local",
    /** 月份 */
    month: "month",
    /** 时间 */
    time: "time",
    /** 周数 */
    week: "week",
    /** 颜色 */
    color: "color"
  };

  /**
   * 定义方向
   */
  const WDirection = {
    /** 顶部 */
    Top: "top",
    /** 底部 */
    Bottom: "bottom",
    /** 左侧 */
    Left: "left",
    /** 右侧 */
    Right: "right"
  };

  /**
   * 定义布局方向
   */
  const WLayoutDirection = {
    /** 垂直 */
    vertical: "vertical",
    /** 水平 */
    horizontal: "horizontal"
  };

  /**
   * 排序方式
   */
  const WSortord = {
    Column: "column",
    Row: "row"
  };

  /**
   * 定义位置
   */
  const WPlace = {
    Left: {
      Top: 0,
      Center: 1,
      Bottom: 2
    },
    Center: {
      Top: 3,
      Center: 4,
      Bottom: 5
    },
    Right: {
      Top: 6,
      Center: 7,
      Bottom: 8
    }
  };

  const WVarType = {
    string: "string",
    number: "number",
    float: "float",
    boolean: "boolean",
    null: "null",
    undefined: "undefined",
    symbol: "symbol",
    bigInt: "bigInt",
    object: "object",
    array: "array",
    set: "set",
    map: "map",
    class: "class",
    function: "function"
  };

  /**
   * 用于获取指定的 DOM 元素及相关方法的对象
   *
   * @param {String|HTMLElement} selector - CSS 选择器`ID`类名或属性名或者直接传入一个 HTMLElement 对象
   * @param {HTMLElement} [obj=document] - 指定在哪个元素下查找默认为 document
   * @return {Object} 包含获取到的 DOM 元素及相关方法的对象
   */
  function $(selector, obj = document, operation) {
    const selectorTypes = {
      "#": "id",
      ".": "class",
      "[": "attr",
      ">": "son",
      "&": "soleID",
    };

    // 查找元素
    function findElement(selector, context) {
      const type = selectorTypes[selector.charAt(0)];

      if (type === "id") {
        return context.getElementById(selector.substring(1));
      } else if (type === "class" || type === "attr") {
        return Array.from(context.querySelectorAll(selector));
      } else if (type === "son") {
        if (selectorTypes[selector.charAt(1)]) {
          const condition = selector.substring(1);
          return Array.from(context.querySelectorAll(condition)).filter((element) => element.parentNode === context);
        } else {
          const elements = context.querySelectorAll(selector.substring(1));
          return Array.from(elements).filter((element) => element.parentNode === context);
        }
      } else if (type === "soleID") {
        const allElements = Array.from(context.querySelectorAll("*"));
        const element = allElements.find(e => e.soleID === selector.substring(1));
        return element || null;
      } else {
        return context.getElementsByTagName(selector);
      }
    }

    let elementObject = null;
    if (Judge.isHTMLElement(selector)) {
      elementObject = selector;
    } else if (Judge.isString(selector)) {
      elementObject = findElement(selector, obj);
    } else {
      throw Code_Error.ParameterMismatch(selector);
    }

    if (elementObject === null) return null;

    // 提供链式调用支持
    elementObject.$ = function (subSelector, operation = null) {
      return $(subSelector, this, operation);
    }

    return elementObject;
  }

  /**
   * 用于判断各种数据类型的工具类
   */
  class Judge {

    /**
     * 判断给定的参数是否为字符串类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是字符串类型,则返回 true;否则返回 false
     */
    static isString(...args) {
      return Judge.IS(it => (typeof it === 'string' || it instanceof String), ...args);
    }

    /**
     * 判断给定的参数是否为 null
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 null,则返回 true;否则返回 false
     */
    static isNull(...args) {
      return Judge.IS(it => (it === null), ...args);
    }

    /**
     * 判断给定的参数是否为 undefined
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 undefined,则返回 true;否则返回 false
     */
    static isUndefined(...args) {
      return Judge.IS(it => (typeof it === 'undefined'), ...args);
    }

    /**
     * 判断给定的参数是否为 NaN
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 NaN,则返回 true;否则返回 false
     */
    static isNaN(...args) {
      return Judge.IS(it => (Number.isNaN(it)), ...args);
    }

    /**
     * 判断给定的参数是否为函数类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是函数类型,则返回 true;否则返回 false
     */
    static isFunction(...args) {
      return Judge.IS(it => (typeof it === 'function' || it instanceof Function), ...args);
    }

    /**
     * 判断给定的参数是否为类class类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是类类型,则返回 true;否则返回 false
     */
    static isClass(...args) {
      return Judge.IS(it => (typeof it === 'function' && /^\s*class\s+/.test(it.toString())), ...args);
    }

    /**
     * 判断给定的参数是否为普通对象即非数组`非函数`非 null 的对象
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是普通对象,则返回 true;否则返回 false
     */
    static isPlainObject(...args) {
      return Judge.IS(it => (Object.prototype.toString.call(it) === '[object Object]'), ...args);
    }

    /**
     * 判断给定的参数是否为数组类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是数组类型,则返回 true;否则返回 false
     */
    static isArray(...args) {
      return Judge.IS(it => (Array.isArray(it)), ...args);
    }

    /**
     * 判断给定的参数是否为 Set 类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 Set 类型,则返回 true;否则返回 false
     */
    static isSet(...args) {
      return Judge.IS(it => (it instanceof Set), ...args);
    }

    /**
     * 判断给定的参数是否为 Map 类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 Map 类型,则返回 true;否则返回 false
     */
    static isMap(...args) {
      return Judge.IS(it => (it instanceof Map), ...args);
    }

    /**
     * 判断给定的参数是否为数字类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是数字类型,则返回 true;否则返回 false
     */
    static isNumber(...args) {
      return Judge.IS(it => (typeof it === 'number' || it instanceof Number), ...args);
    }

    /**
     * 判断给定的参数是否为布尔类型
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是布尔类型,则返回 true;否则返回 false
     */
    static isBoolean(...args) {
      return Judge.IS(it => (typeof it === 'boolean' || it instanceof Boolean), ...args);
    }

    /**
     * 判断给定的参数是否为负数
     * @param {number} ...args - 要检查的参数
     * @returns {boolean} 如果参数是负数,则返回 true;否则返回 false
     */
    static isNegative(...args) {
      return Judge.IS(it => (it < 0), ...args);
    }

    /**
     * 判断给定的参数是否为正数
     * @param {number} ...args - 要检查的参数
     * @returns {boolean} 如果参数是正数,则返回 true;否则返回 false
     */
    static isPositive(...args) {
      return Judge.IS(it => (it > 0), ...args);
    }

    /**
     * 判断给定的参数是否为对象类型包括普通对象,数组,null等，并检测对象是否包含指定属性
     * @param {any} obj - 要检查的参数
     * @param {...string} props - 要检测的属性列表
     * @returns {boolean} 如果参数是对象类型且包含指定属性，则返回 true;否则返回 false
     */
    static isObject(obj, ...props) {
      if (typeof obj !== 'object' || obj === null) {
        return false;
      }

      if (props.length === 0) return true;

      return props.every(prop => obj.hasOwnProperty(prop));
    }

    /**
     * 判断给定的参数是否为空对象
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是空对象,则返回 true;否则返回 false
     */
    static isEmptyObject(...args) {
      return Judge.IS(it => (typeof it === 'object' && it !== null && Object.keys(it).length === 0), ...args);
    }

    /**
     * 判断给定的参数是否为 HTMLElement 类型即 DOM 元素
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是 HTMLElement 类型,则返回 true;否则返回 false
     */
    static isHTMLElement(...args) {
      return Judge.IS(it => (typeof it === 'object' && it.nodeType === 1 && typeof it.style === 'object' && typeof it.ownerDocument === 'object'), ...args);
    }

    /**
     * 判断当前页面是否处于全屏状态
     * @returns {boolean} 如果页面处于全屏状态,则返回 true;否则返回 false
     */
    static isFullScreen() {
      return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }

    /**
     * 判断变量是否有内容或数据
     * @param {any} ...args - 要判断的变量
     * @returns {Boolean} 布尔值
     */
    static isTrue(...args) {
      return Judge.IS(it => (it !== null && it !== void 0 && it !== false), ...args);
    }

    /**
     * 判断变量是否为 false
     * @param {any} ...args - 要判断的变量
     * @returns {Boolean} 布尔值
     */
    static isFalse(...args) {
      return Judge.IS(it => (it === null || it === void 0 || it === false), ...args);
    }

    /**
     * 判断变量是否为空字符串
     * @param {any} ...args - 要判断的变量
     * @returns {Boolean} 布尔值
     */
    static isEmptyString(...args) {
      return Judge.IS(it => (Judge.isString(it) && it.trim() === ''), ...args);
    }

    /**
     * 判断给定的值是否为对象中的一个值
     * @param {any} value - 需要检查的值
     * @param {Object} obj - 对象,其属性值将被检查
     * @returns {Boolean} 如果`value`是`obj`中的一个值,则返回`true`;否则返回`false`
     */
    static isValueInObject(value, obj) {
      return Object.values(obj).includes(value);
    }

    /**
     * 判断一个数组是否包含不属于另一个数组中的元素
     * @param {Array} arr1 - 第一个数组
     * @param {Array} arr2 - 第二个数组
     * @returns {boolean} 如果 arr1 包含不属于 arr2 的元素,则返回 true:否则返回 false
     */
    static isContainsExtraItems(arr1, arr2) {
      const set = new Set(arr2);

      for (let item of arr1) {
        if (!set.has(item)) {
          return true; // arr1 包含不属于 arr2 的元素
        }
      }

      return false;
    }

    /**
     * 判断给定参数是否满足指定条件
     * @param {Function} fn - 条件函数
     * @param {...any} args - 要检查的参数
     * @returns {boolean} 如果所有参数均满足条件函数,则返回 true;否则返回 false
     */
    static IS(fn = () => { }, ...args) {
      for (const it of args) {
        const result = fn(it);
        if (!result) return false;
      }
      return true;
    }
  }


  /**
   * 用于类型转换或获取的工具类
   */
  class TypeCast {
    /**
     * 将字符串转换为布尔值,
     * @param {string} str - 要转换的字符串,只能是 "true"`"false"`"1" 或 "0"
     * @returns {boolean|undefined} 如果字符串为 "true" 或 "1",则返回 true;如果字符串为 "false" 或 "0",则返回 false;否则返回 null
     */
    static strToBoolean(str) {
      if (str === "true" || str === "1") {
        return true;
      } else if (str === "false" || str === "0") {
        return false;
      }
      return null;
    }

    /**
     * 将类型转换为合适的位置
     * @param {string|number} value - 要转换的值,可以是数字或字符串
     * @returns {string|undefined} 转换后的位置字符串,如果无法转换则返回 null
     */
    static analysisPlace(value, toString = null) {
      let toType;
      if (Judge.isNumber(value)) {
        toType = WVarType.number;
      } else if (Judge.isString(value)) {
        toType = WVarType.string;
      }

      if (toString !== null)
        if (toString) {
          toType = WVarType.number;
        } else {
          toType = WVarType.string;
        }

      if (toType === WVarType.number) {
        switch (value) {
          case 0: { return "LT" }
          case 1: { return "LC" }
          case 2: { return "LB" }
          case 3: { return "CT" }
          case 4: { return "CC" }
          case 5: { return "CB" }
          case 6: { return "RT" }
          case 7: { return "RC" }
          case 8: { return "RB" }
        }
      } else if (toType === WVarType.string) {
        const value_ = value.toUpperCase();
        switch (value_) {
          case "LT": { return WPlace.Left.Top }
          case "LC": { return WPlace.Left.Center }
          case "LB": { return WPlace.Left.Bottom }
          case "CT": { return WPlace.Center.Top }
          case "CC": { return WPlace.Center.Center }
          case "CB": { return WPlace.Center.Bottom }
          case "RT": { return WPlace.Right.Top }
          case "RC": { return WPlace.Right.Center }
          case "RB": { return WPlace.Right.Bottom }
        }
      }
      return null;
    }

    /**
     * 将对象的键转换为数组
     * @param {Object} obj - 要提取键的对象
     * @returns {Array} 包含对象所有键的数组
     */
    static objectKeyToArray(obj) {
      const arr = [];
      forIn(obj, (value, key) => {
        arr.push(key);
      });
      return arr;
    }

    /**
     * 将对象的值转换为数组
     * @param {Object} obj - 要提取值的对象
     * @returns {Array} 包含对象所有值的数组
     */
    static objectValueToArray(obj) {
      const arr = [];
      forIn(obj, (value) => {
        arr.push(value);
      });
      return arr;
    }

    /**
     * 获取第一个数组中包含但第二个数组中不包含的额外项
     * @param {Array} arr1 - 第一个数组
     * @param {Array} arr2 - 第二个数组
     * @returns {Array|null} 包含额外项的数组,如果不存在额外项则返回 null
     */
    static findExtraItemsInFirstArray(arr1, arr2) {
      const set = new Set(arr2);

      const arr = [];
      for (let item of arr1) {
        if (!set.has(item)) arr.push(item);
      }

      if (arr.length === 0) return null;
      return arr;
    }
  }

  /**
   * 获取指定的父级返回 true 或者直到 MainWindow 结束
   * @param {HTMLELEMENT} element - 要获取指定父级的元素
   * @param {function} fn - 验证功能 如果当前的父级是与预期一样的则需要返回 true
   */
  function getAppointParent(element, fn = () => { }) {
    if (element === MainWindow) {
      return false;
    }
    if (!fn(element) && element.parentNode)
      return getAppointParent(element.parentNode, fn) || false;
    else
      return element;
  }

  /**
   * 检查给定类及其原型链上是否存在指定方法名
   * @param {function} klass 给定的类
   * @param {string} functionName 指定的方法名
   * @returns {boolean} 是否存在指定方法名
   */
  function checkClassHasFunction(klass, functionName) {
    // 获取类原型对象
    const proto = klass.prototype;
    // 检查类原型对象和类本身是否具有该方法
    if (
      proto.hasOwnProperty(functionName) ||
      klass.hasOwnProperty(functionName)
    ) {
      return true;
    }
    // 遍历原型链,查找是否具有该方法
    let currentProto = proto;
    while (currentProto !== null) {
      if (currentProto.hasOwnProperty(functionName)) {
        return true;
      }
      currentProto = Object.getPrototypeOf(currentProto);
    }
    return false;
  }

  /**
   * 函数用于获取当前时间的格式化字符串
   *
   * @param {String} separator 时分秒之间的分隔符
   * @return {String} 当前时间的格式化字符串,格式为 "YYYY-MM-DD HH:mm:ss"
   */
  function getNowFormatDate(template = "YYYY-MM-DD HH:mm:ss") {
    if (!getNowFormatDate.template) {
      // 检查是否已缓存格式化字符串
      getNowFormatDate.template = template;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    return getNowFormatDate.template
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hour)
      .replace("mm", minute)
      .replace("ss", second);
  }

  /**
   * 生成唯一ID
   * @returns {string} 生成的唯一ID
   */
  function generateUniqueId(length = 18) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let t1 = '';
    let t2 = '';
    for (let i = 0; i < 9; i++) {
      t1 += letters.charAt(Math.floor(Math.random() * letters.length));
      t2 += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return `ID_${t1}_${t2}`.substring(0, length);
  }

  /**
   * AddDraggable 用于实现拖拽功能
   *
   * @param {Element} element 需要添加拖拽功能的元素
   * @param {Element} effectElement 对该元素进行移动效果的元素,默认为 element 本身
   * @param {function} fn 回调函数,在拖拽过程中会不断地触发该函数,并将一个字符串参数传入以表示当前拖拽的状态包括 "onMove"`"endMove"`"onClick" 等
   * @param {Object} limit 用于限制元素移动的范围的对象,包括 top`bottom`left`right 四个属性
   */
  class AddDraggable {
    constructor({
      element,
      effectElement = element,
      fn = () => { },
      limit = {},
      effectElementLimitWindow = true,
      isKeyOperation = true,
    }) {
      this.element = element;
      this.effectElement = effectElement;
      this.fn = fn;
      this.limit = limit;
      this.effectElementLimitWindow = effectElementLimitWindow;
      this.isKeyOperation = isKeyOperation || true;

      this.startX = 0;
      this.startY = 0;
      this.startTransformX = 0;
      this.startTransformY = 0;
      this.values = [];
      this.timer = null;

      this.onKeyPress = this.onKeyPress.bind(this);
      this.onPointerDown = this.onPointerDown.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);

      this.element.addEventListener("mousedown", this.onPointerDown, { passive: false });
      this.element.addEventListener("touchstart", this.onPointerDown, { passive: false });
    }

    updateLimit(limit) {
      this.limit = limit;
      this.setTransformXY(
        this.getTranslate3d(this.effectElement).x,
        this.getTranslate3d(this.effectElement).y
      );
    }

    getTranslate3d(element) {
      const transform = element.style.transform;
      const match = transform.match(/translate3d\((.+?)\)/);

      if (match) {
        const values = match[1].split(", ");
        const x = parseInt(values[0]);
        const y = parseInt(values[1]);
        const z = parseInt(values[2]);

        return { x, y, z };
      }

      return { x: 0, y: 0, z: 0 };
    }

    onKeyPress(event) {
      const { key } = event;
      // 根据按键调整偏移量
      switch (key) {
        case "ArrowUp":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x,
            this.getTranslate3d(this.effectElement).y - 1
          );
          break;
        case "ArrowDown":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x,
            this.getTranslate3d(this.effectElement).y + 1
          );
          break;
        case "ArrowLeft":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x - 1,
            this.getTranslate3d(this.effectElement).y
          );
          break;
        case "ArrowRight":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x + 1,
            this.getTranslate3d(this.effectElement).y
          );
          break;
        default:
          return;
      }
    }

    onPointerDown(event) {
      if (this.isKeyOperation) {
        document.addEventListener("keydown", this.onKeyPress);
      }
      event.preventDefault();

      this.startX =
        event.pageX ||
        (event.touches && event.touches.length > 0 && event.touches[0].pageX) ||
        0;
      this.startY =
        event.pageY ||
        (event.touches && event.touches.length > 0 && event.touches[0].pageY) ||
        0;

      const transform = this.getTransformXY();
      this.startTransformX = transform.x;
      this.startTransformY = transform.y;

      document.addEventListener("mousemove", this.onPointerMove);
      document.addEventListener("touchmove", this.onPointerMove);
      document.addEventListener("mouseup", this.onPointerUp);
      document.addEventListener("touchend", this.onPointerUp);

      this.timer = setTimeout(() => {
        this.timer = null;
      }, 300);
    }

    onPointerMove(event) {
      const offsetX =
        ((event.pageX || (event.touches && event.touches[0].pageX)) || 0) -
        this.startX;
      const offsetY =
        ((event.pageY || (event.touches && event.touches[0].pageY)) || 0) -
        this.startY;

      if (this.timer !== null) {
        // 判断是否移动超过阈值
        if (Math.abs(offsetX) > 10 || Math.abs(offsetY) > 10) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      } else {
        this.setTransformXY(
          this.startTransformX + offsetX,
          this.startTransformY + offsetY
        );
      }
    }

    onPointerUp(event) {
      document.removeEventListener("keydown", this.onKeyPress);

      document.removeEventListener("mousemove", this.onPointerMove);
      document.removeEventListener("touchmove", this.onPointerMove);
      document.removeEventListener("mouseup", this.onPointerUp);
      document.removeEventListener("touchend", this.onPointerUp);

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
        this.fn("onClick", event);
      }
    }

    getTransformXY() {
      let transform;
      if (this.effectElement != this.element) {
        transform = window
          .getComputedStyle(this.effectElement)
          .getPropertyValue("transform");
      } else {
        transform = window
          .getComputedStyle(this.element)
          .getPropertyValue("transform");
      }
      const matrix = transform.match(/^matrix\((.+)\)$/);

      if (!matrix) {
        return {
          x: 0,
          y: 0,
        };
      }

      if (
        this.values.length == 0 ||
        this.values.join("") != matrix[1]
      ) {
        this.values = matrix[1].split(", ");
      }

      return {
        x: parseInt(this.values[4] || "0"),
        y: parseInt(this.values[5] || "0"),
      };
    }

    setTransformXY(x, y) {
      const { top = -Infinity, bottom = Infinity, left = -Infinity, right = Infinity } = this.limit;

      if (y <= top) {
        y = top;
      }
      if (y >= bottom) {
        y = bottom;
      }
      if (x <= left) {
        x = left;
      }
      if (x >= right) {
        x = right;
      }

      if (!this.fn("onMove", x, y)) return;
      if (this.effectElementLimitWindow) {
        const h = MainWindow.rect().height;
        const w = MainWindow.rect().width;
        if (y >= h) y = h - 50;
        if (x >= w) x = w - 50;
        if (y <= 0) y = 0;
        if (x <= 0) x = 0;
      }

      this.effectElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    setTransformX(x) {
      this.setTransformXY(x, this.getTranslate3d(this.effectElement).y);
    }

    setTransformY(y) {
      this.setTransformXY(this.getTranslate3d(this.effectElement).x, y);
    }
  }

  /**
   * 键观察 该类用于监听键盘事件并触发相应的回调函数
   *
   * @param {Boolean} isBlocking 是否堵塞事件传递
   */
  class KeyObserve {
    #keydown_Event_Arr = [];
    #keypress_Event_Arr = [];
    #keyup_Event_Arr = [];

    add({
      eventName = generateUniqueId(),
      type = "keyup",
      toggleKey = "",
      callback = () => { }
    }) {
      const obj = {
        eventName: eventName,
        type: type,
        toggleKey: toggleKey,
        callback: callback
      };
      if (type === "keyup") {
        if (!this.isExist(type, eventName)) this.#keyup_Event_Arr.push(obj);
      } else if (type === "keydown") {
        if (!this.isExist(type, eventName)) this.#keydown_Event_Arr.push(obj);
      } else if (type === "keypress") {
        if (!this.isExist(type, eventName)) this.#keypress_Event_Arr.push(obj);
      }
    }

    #IsExist(type, eventName) {
      let is = false;
      if (type === "keyup") {
        forEnd(this.#keyup_Event_Arr, (e, i) => {
          if (e.eventName === eventName) {
            is = [e, i];
            return true;
          }
        });
      } else if (type === "keydown") {
        forEnd(this.#keydown_Event_Arr, (e, i) => {
          if (e.eventName === eventName) {
            is = [e, i];
            return true;
          }
        });
      } else if (type === "keypress") {
        forEnd(this.#keypress_Event_Arr, (e, i) => {
          if (e.eventName === eventName) {
            is = [e, i];
            return true;
          }
        });
      }
      return is;
    }

    isExist(type, eventName) {
      return this.#IsExist(type, eventName) !== false;
    }

    remove(type, eventName) {
      const arr = this.#IsExist(type, eventName);
      if (arr)
        if (type === "keyup") {
          this.#keyup_Event_Arr.splice(arr[1], 1);
        } else if (type === "keydown") {
          this.#keydown_Event_Arr.splice(arr[1], 1);
        } else if (type === "keypress") {
          this.#keypress_Event_Arr.splice(arr[1], 1);
        }
    }

    getAllEvents(type) {
      let arr = [];
      if (type === "keyup") {
        arr = [...this.#keyup_Event_Arr];
      } else if (type === "keydown") {
        arr = [...this.#keydown_Event_Arr];
      } else if (type === "keypress") {
        arr = [...this.#keypress_Event_Arr];
      }
      return arr;
    }

    constructor(isBlocking = false) {
      this.isBlocking = isBlocking;

      // 按下
      window.addEventListener("keydown", (event) => {
        if (this.isBlocking) {
          event.preventDefault();
          event.stopPropagation();
        }

        forEnd(this.#keydown_Event_Arr, (e, i) => {
          if (e.toggleKey === "") {
            e.callback(event.key, event);
          } else if (e.toggleKey === event.key) {
            e.callback(event.key, event);
          }
        });
      });

      // 在按下并释放能够产生字符的键时触发
      window.addEventListener("keypress", (event) => {
        if (this.isBlocking) {
          event.preventDefault();
          event.stopPropagation();
        }

        forEnd(this.#keypress_Event_Arr, (e, i) => {
          if (e.toggleKey === "") {
            e.callback(event.key, event);
          } else if (e.toggleKey === event.key) {
            e.callback(event.key, event);
          }
        });
      });

      // 释放
      window.addEventListener("keyup", (event) => {
        if (this.isBlocking) {
          event.preventDefault();
          event.stopPropagation();
        }

        forEnd(this.#keyup_Event_Arr, (e, i) => {
          if (e.toggleKey === "") {
            e.callback(event.key, event);
          } else if (e.toggleKey === event.key) {
            e.callback(event.key, event);
          }
        });
      });
    }
  }

  /**
   * 获取设备方向函数
   * @returns {number} 设备方向指示 0:竖屏 1:横屏 -1:无法确定
   */
  function getDeviceOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
      return 0;
    } else if (window.matchMedia("(orientation: landscape)").matches) {
      return 1;
    } else {
      return -1;
    }
  }

  /**
   * 创建HTML元素
   * @param {object} options - 元素选项
   * @param {string} options.tagName - 元素标签名
   * @param {array} options.classList - 元素类名列表
   * @param {array} options.attribute - 元素属性列表,每个属性为[key, value]形式的数组
   * @param {string} options.text - 文本元素内容
   * @param {string} options.contentText - 文本内容
   * @param {string} options.html - HTML内容
   * @param {HTMLElement | HTMLElement[]} options.child - 子元素或子元素数组
   * @param {function} options.callback - 回调函数
   * @returns {HTMLElement} - 新创建的HTML元素
   */
  function createElement({
    tagName = "div",
    classList = [],
    attribute = [],
    text = null,
    contentText = "",
    html = null,
    child = null,
    callback = () => { }
  } = {}) {
    const element = document.createElement(tagName);
    forEnd(classList, (e) => {
      element.classList.add(e);
    });
    forEnd(attribute, (e) => {
      element.attr(e[0], e[1]);
    });

    if (contentText) {
      element.textContent = contentText;
    } else if (text) {
      element.innerText = text;
    } else if (html) {
      element.innerHTML = html;
    }

    if (child)
      if (Judge.isArray(child) && child.length > 1) {
        forEnd(child, (e) => {
          element.appendChild(e);
        });
      } else if (Judge.isHTMLElement(child)) {
        element.appendChild(child);
      }
    if (callback) callback(element);
    return element;
  }

  /**
   * 从给定的数组中删除重复的元素
   * 
   * @param {Array} oldElement - 需要处理的数组
   */
  function uniquenessElement(oldElement) {
    if (oldElement.length > 0) {
      forEnd(oldElement, (e) => {
        if (Judge.isHTMLElement(e)) e.remove()
      });
    }
  }

  /**
   * 表单验证函数
   * @param {string} data 待验证数据
   * @param {string} mode 验证模式,可选值为 "password"`"idCard"`"phone" 和 "email"
   * @returns {boolean} 验证结果,true 表示验证通过,false 表示验证失败
   */
  function formValidation(data, mode) {
    let is;
    if (mode !== "") {
      if (mode === "password") {
        is = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      } else if (mode === "idCard") {
        is =
          /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
      } else if (mode === "phone") {
        is = /^[1][3-9]\d{9}$/;
      } else if (mode === "email") {
        is = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
      }
      return is.test(data);
    } else {
      return false;
    }
  }

  /**
   * 验证文件夹名字或文件名是否合法
   * @param {string} data 待验证数据
   * @param {Set} invalidChars 存储违法字符的数组
   * @returns {boolean} 验证结果
   */
  function isValidFilename(data, invalidChars) {
    // 定义合法字符的正则表达式
    const regex = /^[a-zA-Z0-9-_()\u4e00-\u9fa5]+$/;

    if (regex.test(data)) {
      return true;
    } else {
      if (Judge.isSet(invalidChars)) {
        forEnd(data, (e) => {
          if (!regex.test(e)) {
            invalidChars.add(e);
          }
        });
      }
      return false;
    }
  }

  /**
   * 更新网站 Favicon 的链接
   * @param {string} newIconUrl 新的 Favicon 的 URL
   */
  function updateFavicon(newIconUrl) {
    // 获取 link 元素
    let linkElement =
      document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');

    // 创建一个新 link 元素
    let newLinkElement = document.createElement("link");
    newLinkElement.rel = "shortcut icon";
    newLinkElement.type = "image/x-icon";
    newLinkElement.href = newIconUrl;

    // 替换或添加 link 元素
    if (linkElement) {
      linkElement.parentNode.replaceChild(newLinkElement, linkElement);
    } else {
      document.head.appendChild(newLinkElement);
    }
  }

  /**
   * 获取浏览器信息
   * @returns {Object} 返回一个包含浏览器信息的对象
   */
  function getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      isOnline: navigator.onLine,
      isCookieEnabled: navigator.cookieEnabled,
      colorScheme: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light"
    };
  }

  /**
   * 返回柔和亮的随机颜色
   * @returns {string} 返回一个颜色字符串
   */
  function getRandomColor(type = 'rgba') {
    let hue = Math.floor(Math.random() * 360);  // 随机生成色相值 (0 - 359)
    hue = hue - Math.floor(Math.random() * 99) + Math.floor(Math.random() * 66);
    let saturation = Math.floor(Math.random() * 30 + 70);  // 随机生成饱和度值 (70 - 100)
    let lightness = Math.floor(Math.random() * 10 + 60);  // 随机生成亮度值 (60 - 70)

    let color;

    if (type === 'rgb') {
      color = `rgb(${hue}, ${saturation}, ${lightness})`;
    } else if (type === 'rgba') {
      let alpha = (Math.random() * (1 - 0.2) + 0.2).toFixed(2);  // 随机生成透明度值 (0.2 - 1)
      color = `rgba(${hue}, ${saturation}, ${lightness}, ${alpha})`;
    } else if (type === 'hsl') {
      color = `hsl(${hue}$, ${saturation}%, ${lightness}%)`;
    } else {
      throw new Error('Invalid color type');
    }

    return color;
  }

  /**
   * easyStorageTool - Web Storage 工具函数
   * 
   * 这个工具函数用于简化对 Web StoragelocalStorage 或 sessionStorage的操作
   * @returns {Object} - 一个包含 setItem`getItem`removeItem 和 clear 方法的对象
   */
  function easyStorageTool() {
    // 设置键值对
    function setItem(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('存储错误：', error);
        return false;
      }
    }

    // 获取指定键的值
    function getItem(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('读取错误：', error);
        return null;
      }
    }

    // 删除指定键值对
    function removeItem(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('删除错误：', error);
        return false;
      }
    }

    // 清空存储
    function clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('清空错误：', error);
        return false;
      }
    }

    // 返回公共方法
    return {
      setItem,
      getItem,
      removeItem,
      clear
    };
  }

  /**
   * Cookie 工具函数,用于设置`获取和删除 Cookie
   * @param {string} cookieName - Cookie 名称前缀
   * @returns {object} - 包含 set`get 和 Delete 方法的对象
   */
  function cookieUtil(cookieName) {
    return {
      set: function (name, value, days, path = "/") {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = "; expires=" + date.toUTCString();
        }
        const cookieData =
          cookieName + "_" + name + "=" + value + expires + "; path=" + path;
        document.cookie = cookieData;
      },

      get: function (name) {
        var fullNameEQ = cookieName + "_" + name + "=";
        var ca = document.cookie.split(";");

        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === " ") c = c.substring(1, c.length);
          if (c.indexOf(fullNameEQ) === 0)
            return c.substring(fullNameEQ.length, c.length);
        }
        return null;
      },

      Delete: function (name, path = "/") {
        this.set(name, "", -1, path);
      },
    };
  }

  /**
   * AudioPlayer 音频播放器对象
   */
  class AudioPlayer {
    constructor() {
      this.audio = new Audio();
      this.audioFileList = new Map();
      this.progressCallback = null;
      this.currentAudioName = null;
      this.handleProgressUpdate = this.handleProgressUpdate.bind(this);
      this.audio.addEventListener("timeupdate", this.handleProgressUpdate);
    }

    addAudioFile(src) {
      this.audioFileList.set(
        src.split("/").pop().split(".").slice(0, -1).join("."),
        src
      );
    }

    removeAudioFile(audioName) {
      this.audioFileList.delete(audioName);
    }

    loadAudio(audioName) {
      this.currentAudioName = audioName;
      const audioInfo = this.audioFileList.get(audioName);
      if (audioInfo) {
        this.audio.src = audioInfo;
        this.audio.load();
      } else {
        console.log("not audio");
      }
    }

    play() {
      this.audio.play();
    }

    player(audioName) {
      this.loadAudio(audioName);
      this.audio.play();
    }

    pause() {
      this.audio.pause();
    }

    setProgressCallback(callback) {
      this.progressCallback = callback;
    }

    handleProgressUpdate() {
      if (this.progressCallback) {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        this.progressCallback(currentTime, duration);
      }
    }
  }


  /**
   * 格式化日期字符串为"YYYY-MM-DD"格式
   * @param {string} dateString - 需要格式化的日期字符串,格式为"YYYY-M-D"
   * @returns {string} 格式化后的日期字符串,格式为"YYYY-MM-DD"
   */
  function formatDateString(dateString) {
    let parts = dateString.split("-");
    let year = parts[0];
    let month = ("0" + parts[1]).slice(-2); // 补零
    let day = ("0" + parts[2]).slice(-2); // 补零

    return year + "-" + month + "-" + day;
  }

  /**
   * 计算给定起始日期与指定日期之间的天数差
   * @param {string} strStartDate - 起始日期
   * @param {string} [strEndtDate=new Date] - 结束日期 默认为当前日期
   * @returns {number} - 天数差
   */
  function calculateDaysDiff(strStartDate, strEndtDate = new Date) {
    let startDate = new Date(strStartDate);
    let todayDate = new Date(strEndtDate);
    let timeDiff = Math.abs(todayDate.getTime() - startDate.getTime());
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  /**
   * 字符串转 innerHTML
   * @param {String} str - 要转换的字符串
   * @returns {innerHTML} - 解析后的 innerHTML
   */
  function strToinnerHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.innerHTML;
  }

  /**
   * 元素动画
   * @param {HTMLElement} element - 目标元素
   * @param {String} an - 动画
   * @param {Function} fn - 回调
   */
  function elementAnimation(element, an, fn = () => { }) {
    element.style.animation = "";
    element.style.animation = an;
    element.addEvent("animationend", () => {
      element.style.animation = "";
      fn(element);
    });
  }

  /**
   * 元素出现动画函数
   * @param {HTMLElement} element - 目标元素
   * @param {any} an - 动画
   */
  function elementAppearAnimation(element, an) {
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0.5,
    });

    element.style.animation = "";

    function onIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          const e = entry.target;
          e.style.animation = an;
        }
      });
    }
  }

  /**
   * 完整循环数组,并根据条件返回匹配的元素
   * @param {Array} Arrs 需要循环的数组
   * @param {Function} condition 循环终止条件函数,接受当前元素和索引作为参数,返回布尔值
   * @param {Number} start 开始索引
   * @param {Array<number>} skip 跳过指定索引的元素
   * @param {Boolean} isReversal 是否逆向遍历数组,默认为false
   * @returns {any} 匹配到的元素
   */
  function forEnd(Arrs, condition, start = 0, skip = null, isReversal = false) {
    if (!Arrs) return null;
    let count = 0;
    if (skip === null) {
      skip = []; // 如果skip未提供,则设为空数组
    }
    if (isReversal) {
      if (Judge.isNumber(Arrs)) {
        for (let index = Arrs - 1; index >= start; index--) {
          if (skip.includes(index)) {
            continue;
          }
          count++;
          const value = condition(index, count);
          if (value === true) {
            return index;
          } else if (value === "continue") {
            continue;
          } else if (value === "break") {
            break;
          }
        }
      } else {
        for (let index = Arrs.length - 1; index >= start; index--) {
          if (skip.includes(index)) {
            continue;
          }
          count++;
          const element = Arrs[index];
          const value = condition(element, index, count);
          if (value === true) {
            return element;
          } else if (value === "continue") {
            continue;
          } else if (value === "break") {
            break;
          }
        }
      }
    } else {
      if (Judge.isNumber(Arrs)) {
        for (let index = start; index < Arrs; index++) {
          if (skip.includes(index)) {
            continue;
          }
          count++;
          const value = condition(index, count);
          if (value === true) {
            return index;
          } else if (value === "continue") {
            continue;
          } else if (value === "break") {
            break;
          }
        }
      } else {
        for (let index = start; index < Arrs.length; index++) {
          if (skip.includes(index)) {
            continue;
          }
          count++;
          const element = Arrs[index];
          const value = condition(element, index, count);
          if (value === true) {
            return element;
          } else if (value === "continue") {
            continue;
          } else if (value === "break") {
            break;
          }
        }
      }
    }
    return null; // 如果没有匹配到任何元素,则返回null
  }

  /**
   * 遍历对象的属性,并根据条件进行处理
   * @param {Object} inputObj - 要遍历的对象
   * @param {Function} condition - 对每个属性值执行的条件函数，接受参数(value, key, index, count)
   * @param {number} [start=0] - 开始遍历的索引,默认为 0
   * @param {Array<number>} [skip=[]] - 跳过的索引数组
   * @returns {*} 如果条件函数返回 true,则返回符合条件的属性值:否则返回 null
   */
  function forIn(inputObj, condition, start = 0, skip = []) {
    if (!inputObj) return null;
    let count = 0;
    let index = 0;

    for (const key in inputObj) {
      index++;
      if (skip.includes(index) || index < start) continue;

      const value = condition(inputObj[key], key, index, count);

      if (value === true) {
        return inputObj[key];
      } else if (value === "continue") {
        continue;
      } else if (value === "break") {
        break;
      }

      count++;
    }
    return null; // 如果没有匹配到任何元素，则返回 null
  }

  /**
   * 遍历对象的属性,并根据条件进行处理
   * @param {Object} inputObj - 要遍历的对象
   * @param {Function} condition - 对每个属性值执行的条件函数，接受参数(value, key, index, count)
   * @param {number} [start=0] - 开始遍历的索引,默认为 0
   * @param {Array<number>} [skip=[]] - 跳过的索引数组
   * @returns {*} 如果条件函数返回 true,则返回符合条件的属性值:否则返回 null
   */
  function forOf(inputObj, condition, start = 0, skip = []) {
    if (!inputObj) return null;
    let count = 0;
    let index = 0;

    for (const it of inputObj) {
      index++;
      if (skip.includes(index) || index < start) continue;

      const result = condition(it[1], it[0], index, count);

      if (result === true) {
        return value;
      } else if (result === "continue") {
        continue;
      } else if (result === "break") {
        break;
      }

      count++;
    }
    return null; // 如果没有匹配到任何元素,则返回 null
  }

  /**
   * 函数防抖
   * @param {Function} fn - 要执行的函数
   * @param {number} delay - 延迟时间
   * @returns {Function} - 包装后的防抖函数
   */
  function debounce(fn, delay) {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  /**
   * 递归设置元素及其子元素的原型链
   * @param {HTMLElement} element - 要设置原型链的根元素
   * @param {Object} prototype - 要设置的原型对象
   */
  function setElementInAllPrototypeRecursive(element, prototype) {
    // 设置当前元素的原型
    Object.setPrototypeOf(element, prototype);

    // 遍历当前元素的子元素
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];

      // 递归调用,将子元素的原型也设置为相同的原型
      if (child.nodeType === Node.ELEMENT_NODE) {
        setElementInAllPrototypeRecursive(child, prototype);
      }
    }
  }

  /**
   * elementStyle 模块用于动态设置和移除 CSS 样式
   */
  const elementStyle = (() => {
    function _get(obj) {
      let property = "";
      for (const key in obj) {
        let value = obj[key];
        if (Judge.isObject(value)) {
          property += `${key} { ${_get(value)} }`;
        } else {
          property += `${key}: ${value};`;
        }
      }

      return property;
    }

    function _getProperty(obj) {
      let arr = [];
      for (const key in obj) {
        let value = obj[key];
        if (Judge.isObject(value)) {
          arr = [...arr, ..._getProperty(value)];
        } else {
          arr.push(key);
        }
      }

      return arr;
    }

    /**
     * 返回样式对象的所有规则
     * @param {object} style - 包含样式属性的对象
     * @returns {array} 规则
     */
    function getProperty(style) {
      let arr = [];
      forEnd(Object.keys(style), selector => {
        arr = [...arr, ..._getProperty(style[selector])]
      });
      return [...new Set(arr)];
    }

    /**
     * 设置指定类名的样式
     * @param {string} className - 要设置样式的类名
     * @param {object} style - 包含样式属性的对象
     */
    function set(className, style) {
      let element = _WebUtilPro__STYLE_ELEMENT.$(`.${className}`)[0];
      if (!element) element = createElement({ tagName: "style", classList: [className] });

      let text = "";
      forEnd(Object.keys(style), selector => {
        text += `${selector} {${_get(style[selector])}}`;
      });

      element.innerText = text;
      if (!_WebUtilPro__STYLE_ELEMENT.contains(element)) _WebUtilPro__STYLE_ELEMENT.appendChild(element);
    }

    /**
     * 在指定类名的样式上追加新的样式属性
     * @param {string} className - 要追加样式的类名
     * @param {object} style - 包含要追加的样式属性的对象
     */
    function add(className, style) {
      let element = _WebUtilPro__STYLE_ELEMENT.$(`.${className}`)[0];
      if (!element) return false;

      let text = "";
      forEnd(Object.keys(style), selector => {
        text += `${selector} {${_get(style[selector])}}`;
      });

      element.innerText += text;
    }

    /**
     * 移除指定类名的样式
     * @param {string} className - 要移除样式的类名
     */
    function remove(className) {
      _WebUtilPro__STYLE_ELEMENT.$(`.${className}`)[0].remove();
    }

    return {
      set,
      add,
      remove,
      getProperty
    };
  })();

  /**
   * 触发指定元素上的事件
   * @param {Element} element 要触发事件的元素
   * @param {string} eventName 要触发的事件名称
   * @param {number} [btn=0] 鼠标按钮值,默认为 0
   */
  function eventTrigger(element, eventName, btn = 0) {
    element.dispatchEvent(new MouseEvent(eventName, {
      bubbles: true,     // 事件是否冒泡
      cancelable: true,  // 是否可以被取消
      view: window,      // 与事件相关的抽象视图
      button: btn        // 按下哪个鼠标键
    }));
  }

  /**
   * 动态引入 JavaScript 文件
   * @param {string} path - JavaScript 文件路径
   * @param {function} fn - 在加载完成后执行的回调函数
   * @param {boolean} endDelete - 是否在加载结束后删除 script 标签
   */
  function includeJsFile(path = "", fn = () => { }, endDelete = false) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = path;

    script.onload = function () {
      fn(true, script);
      if (endDelete) {
        setTimeout(() => {
          script.remove();
        }, 5);
      }
    };

    script.onerror = function () {
      fn(false, script);
      if (endDelete) {
        setTimeout(() => {
          script.remove();
        }, 5);
      }
    };

    document.body.appendChild(script);
  }

  /**
   * 动态引入多 JavaScript 文件
   *   每个数组项应包含以下结构：
   *     - {string} path - JavaScript 文件路径
   *     - {function} fn - 在加载完成后执行的回调函数
   *     - {boolean} endDelete - 是否在加载结束后删除 script 标签
   * @param {Array} arr - 包含多个 JavaScript 文件信息的数组
   * @param {boolean} isAsync - 是否异步加载 JavaScript 文件,默认为 false
   * @param {function} endFn - 所有文件加载完成后的回调函数
   */
  function includeJsFiles(arr = [], isAsync = true, endFn = () => { }) {
    if (isAsync) {
      forEnd(arr, (e) => {
        includeJsFile(e[0], e[1], e[2]);
      });
      endFn();
    } else {
      let count = 0;
      forEnd(arr, (e) => {
        includeJsFile(e[0], () => {
          count++;
          if (count === arr.length) endFn();
        }, e[2]);
      });

    }
  }

  /**
   * 动态引入 CSS 文件
   * @param {string} path - CSS 文件路径
   * @param {function} fn - 在加载完成后执行的回调函数
   */
  function includeCssFile(path = "", fn = () => { }, parentNode = document.head) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    if (fn) fn(link);
    parentNode.appendChild(link);
  }

  /**
   * 动态引入多个 CSS 文件
   * @param {Array} arr - 包含 CSS 文件路径的数组
   *   每个数组项应包含以下结构：
   *     - {string} path - CSS 文件路径
   *     - {function} fn - 在加载完成后执行的回调函数 (可选)
   *     - {HTMLElement} parentNode - CSS 文件插入的父节点 (默认为 document.head) (可选)
   */
  function includeCssFiles(arr = []) {
    forEnd(arr, (e) => {
      includeCssFile(e[0], e[1], e[2]);
    });
  }

  /*
   * 标准关闭页功能
   */
  function _CLOSE_PAGE_WebUtilPro_(callback = () => { }, time = 200, isOriginal = true) {
    try {
      setTimeout(() => {
        _CLOSE_PAGE_WebUtilPro_FN();
        MainWindow.style.opacity = "0";
        callback();
        if (isOriginal) window.close();
      }, time);
    } catch (error) {
      throw error;
    }
  }

  /*
   * 标准初始化页功能
   */
  function _INIT_PAGE_WebUtilPro_(callback = () => { }, time = 100) {
    try {
      MainWindow.style.display = "block";
      setTimeout(() => {
        _INIT_PAGE_WebUtilPro_FN();
        MainWindow.style.opacity = "1";
        callback();
      }, time);
    } catch (error) {
      throw error;
    }
  }

  return {
    $,
    _CLOSE_PAGE_WebUtilPro_,
    _INIT_PAGE_WebUtilPro_,

    calculateDaysDiff,
    checkClassHasFunction,
    cookieUtil,
    createElement,
    debounce,
    easyStorageTool,
    elementAppearAnimation,
    elementAnimation,
    elementStyle,
    eventTrigger,
    forEnd,
    forIn,
    forOf,
    formValidation,
    uniquenessElement,
    formatDateString,
    generateUniqueId,
    getAppointParent,
    getBrowserInfo,
    getDeviceOrientation,
    getRandomColor,
    getNowFormatDate,
    includeCssFile,
    includeCssFiles,
    includeJsFile,
    includeJsFiles,
    isValidFilename,
    setElementInAllPrototypeRecursive,
    strToinnerHTML,
    updateFavicon,

    AddDraggable,
    AudioPlayer,
    Judge,
    KeyObserve,
    TypeCast,

    Code_Error,

    WDirection,
    WLayoutDirection,
    WSortord,
    WEvent,
    WEventLevel,
    WInputType,
    WVarType,
    WPlace,
    WWindowModel,
    WWindowOperation,
  };

})();

(function () {
  const {
    $,
    Code_Error,
    Judge
  } = WebUtilPro;

  {
    { // 样式元素初始化
      _WebUtilPro__STYLE_ELEMENT.id = "_WebUtilPro__STYLE_ELEMENT";
      _WebUtilPro__STYLE_ELEMENT.innerText =
        `#_WebUtilPro__ZERO_ELEMENT {opacity: 0;width: 1px;height: 1px;position: fixed;top: 0;left: 0;pointer-events: none;}`;
      Head.appendChild(_WebUtilPro__STYLE_ELEMENT);
    }
    { // Zero 元素初始化
      _WebUtilPro__ZERO_ELEMENT.id = "_WebUtilPro__ZERO_ELEMENT";
      MainWindow.appendChild(_WebUtilPro__ZERO_ELEMENT);
    }

    // 元素扩展
    {
      /**
       * 获取指定元素的上级节点
       * @param {Number} levels - 要获取的上级级数
       * @returns {Object|null} - 返回获取到的上级节点,若超出根节点则返回 null
       */
      HTMLElement.prototype.getParentLevelsUp = function (levels) {
        let parent = this;
        for (let i = 0; i < levels; i++) {
          if (parent.parentNode) {
            parent = parent.parentNode;
          } else {
            return null; // 若超出根节点,则返回 null
          }
        }
        return parent;
      }
      /**
       * 扩展 HTMLElement 原型的 $ 方法,用于选择子元素
       * @param {string} element_Name - 子元素的选择器
       * @returns {HTMLElement} - 选中的子元素
       */
      HTMLElement.prototype.$ = function (element_Name, operation = null) {
        return $(this).$(element_Name, operation);
      }
      /**
       * 扩展 HTMLElement 原型的 css 方法,设置当前元素的样式
       * @param {Object<string, string>|string} style - 表示 CSS 样式属性和值的键值对对象或要设置的 CSS 样式属性
       * @param {string} [value] - 当第一个参数为字符串时表示对应 CSS 样式属性的值
       * @return {HTMLElement} 返回当前 HTML 元素本身以便实现链式调用
       */
      HTMLElement.prototype.css = function (style, value) {
        if (Judge.isObject(style)) {
          for (let property in style) {
            this.style[property] = style[property];
          }
        } else if (Judge.isString(style)) {
          this.style[style] = value;
        } else {
          throw Code_Error.ParameterMismatch(styleObj, value);
        }

        return this;
      }
      /**
       * 扩展 HTMLElement 原型的 attr 方法,获取或设置当前元素的属性
       * @param {string} attribute - 要操作的属性名
       * @param {string} [value] - 属性值可选用于设置属性
       * @return {string | HTMLElement} 如果提供了属性值则返回当前 HTML 元素本身以便实现链式调用否则返回属性值
       */
      HTMLElement.prototype.attr = function (attribute, value = null) {
        if (value !== null) {
          this.setAttribute(attribute, value);
          return this;
        } else if (this.hasAttr(attribute)) {
          return this.getAttribute(attribute);
        } else {
          return false;
        }
      }
      /**
       * 扩展 HTMLElement 原型的 removeAttr 方法,移除当前元素的属性
       * @param {string} attribute - 要操作的属性名
       * @return {HTMLElement} 返回当前 HTML 元素本身以便实现链式调用
       */
      HTMLElement.prototype.removeAttr = function (attribute) {
        if (attribute !== void 0) {
          this.removeAttribute(attribute);
        }
        return this;
      }
      /**
       * 检查元素是否具有指定的属性 
       * @param {string} attribute - 要检查的属性名称 
       * @returns {boolean} - 如果元素具有指定属性,则返回 true;否则返回 false 
       */
      HTMLElement.prototype.hasAttr = function (attribute) {
        return this.hasAttribute(attribute);
      }
      /**
       * 清空元素的 innerHTML
       * @this {HTMLElement}
       * @return {HTMLElement} 返回当前元素本身,以便支持链式调用
       */
      HTMLElement.prototype.innerClear = function () {
        this.innerHTML = null;
        return this;
      }
      /**
       * 移除元素的所有子元素
       * @this {HTMLElement}
       * @return {HTMLElement} 返回当前元素本身,以便支持链式调用
       */
      HTMLElement.prototype.innerRemove = function () {
        while (this.firstChild) {
          this.firstChild.remove();
        }
        return this;
      }
      /**
       * 从元素中移除指定的类名 
       * @param {string|string[]} classNames - 要移除的类名,可以是单个类名或类名数组 
       * @returns {HTMLElement} - 返回当前元素以便支持链式调用 
       */
      HTMLElement.prototype.removeClass = function (classNames) {
        if (Array.isArray(classNames)) {
          classNames.forEach(className => {
            this.classList.remove(className);
          });
        } else {
          this.classList.remove(classNames);
        }
        return this;
      }
      /**
       * 向元素添加指定的类名 
       * @param {string|string[]} classNames - 要添加的类名,可以是单个类名或类名数组 
       * @returns {HTMLElement} - 返回当前元素以便支持链式调用 
       */
      HTMLElement.prototype.addClass = function (classNames) {
        if (Array.isArray(classNames)) {
          classNames.forEach(className => {
            this.classList.add(className);
          });
        } else {
          this.classList.add(classNames);
        }
        return this;
      }
      /**
       * 检查元素是否包含指定的类名
       * @param {string} className - 要检查的类名
       * @returns {boolean} - 如果元素包含指定的类名则返回 true,否则返回 false
       */
      HTMLElement.prototype.hasClass = function (className) {
        return this.classList.contains(className);
      }
      /**
       * 将一个或多个元素添加到当前元素的文档片段中,然后将文档片段添加到当前元素中
       * @param {HTMLElement | HTMLElement[]} element - 要添加到文档片段中的元素,可以是单个元素或元素数组
       * @returns {void}
       */
      HTMLElement.prototype.appendFragment = function (element) {
        const fragment = document.createDocumentFragment();
        if (Array.isArray(element)) {
          element.forEach(e => {
            fragment.appendChild(e);
          });
        } else {
          fragment.appendChild(element);
        }
        this.appendChild(fragment);
      }
      /**
       * 获取元素的位置和尺寸信息
       * @returns {DOMRect} - 元素的位置和尺寸信息
       */
      HTMLElement.prototype.rect = function () {
        return this.getBoundingClientRect();
      }
    }

    // 保存原始的remove方法
    HTMLElement.prototype.originalRemove = HTMLElement.prototype.remove;
    // 重载remove方法
    HTMLElement.prototype.remove = function () {
      this.blur();
      this.originalRemove();
    };

    HTMLElement.prototype.addEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.addEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    document.addEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.addEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    window.addEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.addEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    HTMLElement.prototype.removeEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.removeEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    document.removeEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.removeEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    window.removeEvent = function (eventName, fn, okFn = () => { }, options = false) {
      this.removeEventListener(eventName, fn, options);
      Judge.isFunction(okFn) && okFn();
    };
    /**
     * 为 HTMLElement 的原型添加 SoleID 属性,用于生成唯一标识符
     * @returns {string} - 生成的唯一标识符
     */
    Object.defineProperty(HTMLElement.prototype, "SoleID", {
      get: function () {
        if (!this._SoleID) {
          this._SoleID = (function () {
            let timestamp = new Date().getTime(); // 获取当前时间戳
            timestamp = timestamp - Math.floor(Math.random() * 10000);
            let random = Math.floor(Math.random() * 9996); // 生成一个随机数
            timestamp = timestamp.toString(12);
            return `SoleID_${timestamp}_${random}`; // 拼接生成唯一ID
          })();
        }
        return this._SoleID;
      }
    });
  }

  MainWindow.addEvent("mousedown", (event) => {
    const TargetElement = event.target;
    event.wEventName = "mousedown";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-mousedown")) {
          window[TargetElement.getAttribute("w-callback-mousedown")](event);
        }
      }
      {
        if (WClickElement !== TargetElement) {
          WClickElementCount = 1;
          // 移除其他的 WClick
          forEnd($(".WClick"), e => {
            e.parentNode.classList.remove("WClickParent");
            e.classList.remove("WClick");
          });
          // 设置点击元素的 WClick 属性
          TargetElement.classList.add("WClick");
          TargetElement.parentNode.classList.add("WClickParent");

          WClickElement = TargetElement;
        } else WClickElementCount++;
      }
    }
  });
  MainWindow.addEvent("click", (event) => {
    const TargetElement = event.target;
    event.wEventName = "click";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-click")) {
          window[TargetElement.getAttribute("w-callback-click")](event);
        }
      }
    }
  });
  MainWindow.addEvent("input", (event) => {
    const TargetElement = event.target;
    event.wEventName = "input";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-input")) {
          window[TargetElement.getAttribute("w-callback-input")](event);
        }
      }
    }
  });
  MainWindow.addEvent("mouseover", (event) => {
    const TargetElement = event.target;
    event.wEventName = "mouseover";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
        WMouseElement = TargetElement;
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-mouseover")) {
          window[TargetElement.getAttribute("w-callback-mouseover")](event);
        }
      }
    }
  });
  MainWindow.addEvent("dblclick", (event) => {
    const TargetElement = event.target;
    event.wEventName = "dblclick";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
        WMouseElement = TargetElement;
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-dblclick")) {
          window[TargetElement.getAttribute("w-callback-dblclick")](event);
        }
      }
    }
  });
  MainWindow.addEvent("copy", function (event) {
    const TargetElement = event.target;
    event.wEventName = "copy";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-copy")) {
          window[TargetElement.getAttribute("w-callback-copy")](event);
        }
      }
    }
  });
  MainWindow.addEvent("paste", function (event) {
    const TargetElement = event.target;
    event.wEventName = "paste";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-paste")) {
          window[TargetElement.getAttribute("w-callback-paste")](event);
        }
      }
    }
  });
  MainWindow.addEvent("cut", function (event) {
    const TargetElement = event.target;
    event.wEventName = "cut";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-cut")) {
          window[TargetElement.getAttribute("w-callback-cut")](event);
        }
      }
    }
  });
  MainWindow.addEvent("contextmenu", function (event) {
    const TargetElement = event.target;
    event.wEventName = "contextmenu";
    {
      { // 触发事件
        if (!TargetElement.w_Event)
          TargetElement.w_Event = () => { }
        TargetElement.w_Event(event);
      }
      { // 触发元素回调事件
        if (TargetElement.hasAttr("w-callback-contextmenu")) {
          window[TargetElement.getAttribute("w-callback-contextmenu")](event);
        }
      }
    }
  });

  document.addEvent("mousemove", (event) => {
    WMouseClientX = event.pageX;
    WMouseClientY = event.pageY;
    WLeaveDocument = false;
  });

  document.addEvent("mouseleave", function () {
    WLeaveDocument = true;
  });

  document.addEvent('visibilitychange', function () {
    const pageVisibility = document.visibilityState;
    WPageVisibility = pageVisibility;
  });

  //Object.freeze(WebUtilPro);
})();
// WebUtilPro SQJM 2023