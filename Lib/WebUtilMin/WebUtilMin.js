/**
 * @name WebUtilMin
 * @description 网页工具
 * @version 2.5.0
 * @author Wang Jia Ming
 * @createDate 2024-10-1
 * @license AGPL-3.0
 * 
 * https://opensource.org/licenses/AGPL-3.0
 */
const _WebUtilPro_VERSION = "2.5.0";
var Html = document.getElementsByTagName("html")[0];
var Head = document.head;
var Body = document.body;
const MainWindow = document.getElementById("MainWindow");

// 点击的元素
var WClickElement = null;
var WClickElementCount = 1;

// 页面可见性
var WPageVisibility = true;

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
  function $(selector, obj = document, operation = null) {
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
        return Array.from(context.getElementsByTagName(selector));
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

    if (Judge.isArray(elementObject)) {
      elementObject.first = elementObject[0];
      elementObject.last = elementObject[elementObject.length - 1];
    }

    // 提供链式调用支持
    elementObject.$ = function (subSelector, operation = null) {
      return $(subSelector, this, operation);
    }

    elementObject.isNull = () => {
      return elementObject.length === 0;
    }

    return elementObject;
  }

  /**
   * 用于判断各种数据类型的工具类
   */
  class Judge {

    /**
     * 验证字符串是否符合常规
     * @param {string} data 待验证数据
     * @param {Set} invalidChars 存储违法字符的数组
     * @returns {boolean} 验证结果
     */
    static isValidString(data, { invalidChars = null, type = "text" } = {}) {
      // 定义合法字符的正则表达式
      const regex = {
        text: () => /^[a-zA-Z0-9-_()!@#$%^&*=+?<>:;.\[\]-\u4e00-\u9fa5]+$/.test(data),
        file: () => !/[:\\*\/"<>@?\n]/.test(data),
      };

      const result = regex[type];
      if (!result) throw Code_Error.ParameterMismatch(type);

      if (result(data)) {
        return true;
      } else {
        if (Judge.isSet(invalidChars)) {
          forEnd(data, (e) => {
            if (!result.test(e)) {
              invalidChars.add(e);
            }
          });
        }
        return false;
      }
    }

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
     * 判断给定的参数是否为自定义类型(通过构造函数定义)
     * @param {any} ...args - 要检查的参数
     * @returns {boolean} 如果参数是通过构造函数定义的自定义类型,则返回 true;否则返回 false
     */
    static isCustomType(customType, ...args) {
      return Judge.IS(it => (it instanceof customType), ...args);
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
      return Judge.IS(it => (typeof it === 'number' || it instanceof Number || Number.isInteger(it)), ...args);
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
     * 判断给定的参数是否为对象类型包括普通对象,数组,null等,并检测对象是否包含指定属性
     * @param {any} obj - 要检查的参数
     * @param {...string} props - 要检测的属性列表
     * @returns {boolean} 如果参数是对象类型且包含指定属性,则返回 true;否则返回 false
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
    static strToBool(str) {
      if (str === "true" || str === "1") {
        return true;
      } else if (str === "false" || str === "0") {
        return false;
      }
      return null;
    }

    /**  
     * 将给定的值转换为布尔值
     *   
     * 如果传入的值是真值,则返回true;否则返回false
     * 真值包括:任何非假值的值,如非空字符串,非零数字,非null对象等
     * 假值包括:false,0,"",null,undefined,NaN
     *   
     * @param {any} value - 需要被转换为布尔值的任意值
     * @returns {boolean} - 转换后的布尔值
     */
    static toBoolean(value) {
      if (value) return true;
      return false;
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
   * 遍历数组或指定长度的范围,基于条件执行操作,支持正序或逆序遍历.
   *
   * @param {Array|number} Arrs - 被遍历的数组或指定的长度
   *   - 如果是数组,将遍历数组的每一个元素
   *   - 如果是数字,将遍历从 `start` 到该数字的索引
   * @param {Function} condition - 判断条件的回调函数
   *   - 当遍历元素时,如果传入的参数是数组元素,则回调函数接收 `element, index, count`
   *   - 如果传入的是索引,则回调函数接收 `index, count`
   *   - 回调函数可以返回 `true`,`"continue"`,`"break"` 以控制遍历流程:
   *     - `true`:返回当前元素（数组情况下）或索引（数字情况下）,并停止遍历
   *     - `"continue"`:跳过当前元素,继续下一次循环
   *     - `"break"`:停止遍历
   * @param {Object} [options={}] - 可选参数
   * @param {number} [options.start=0] - 遍历开始的索引或数字范围的起始值
   * @param {Array<number>} [options.skip=[]] - 需要跳过的索引数组
   * @param {number} [options.end=null] - 遍历的结束条件,当计数器达到该值时停止遍历
   * @param {boolean} [options.isReversal=false] - 是否进行逆序遍历默认为正序遍历
   * @param {boolean} [options.autoReplace=false] - 是否自动替换数组元素为回调函数的返回值默认为 `false`
   * @returns {any|null} - 满足条件的元素（对于数组）或索引（对于数字）; 如果没有找到匹配项,则返回 `null`
   */
  function forEnd(Arrs, condition, { start = 0, skip = null, isReversal = false, autoReplace = false } = {}) {
    if (!Judge.isArray(Arrs) && !Judge.isNumber(Arrs)) return null;
    let count = 0;
    if (skip === null) {
      skip = []; // 如果skip未提供,则设为空数组
    }

    if (isReversal) {
      if (Judge.isNumber(Arrs)) {
        for (let index = Arrs - 1; index >= start; index--) {
          if (skip.includes(index)) continue;
          count++;
          const value = condition(index, count);
          if (value === true) return index;
          else if (value === "continue") continue;
          else if (value === "break") break;
        }
      } else {
        for (let index = Arrs.length - 1; index >= start; index--) {
          if (skip.includes(index)) continue;
          count++;
          const element = Arrs[index];
          const value = condition(element, index, count);
          if (autoReplace) Arrs[index] = value;
          if (value === true) return element;
          else if (value === "continue") continue;
          else if (value === "break") break;
        }
      }
    } else {
      if (Judge.isNumber(Arrs)) {
        for (let index = start; index < Arrs; index++) {
          if (skip.includes(index)) continue;
          count++;
          const value = condition(index, count);
          if (value === true) return index;
          else if (value === "continue") continue;
          else if (value === "break") break;
        }
      } else {
        for (let index = start; index < Arrs.length; index++) {
          if (skip.includes(index)) continue;
          count++;
          const element = Arrs[index];
          const value = condition(element, index, count);
          if (autoReplace) Arrs[index] = value;
          if (value === true) return element;
          else if (value === "continue") continue;
          else if (value === "break") break;
        }
      }
    }
    return null; // 如果没有匹配到任何元素,则返回null
  }

  /**
   * 遍历对象的属性,并根据条件进行处理
   * @param {Object} inputObj - 要遍历的对象
   * @param {Function} condition - 对每个属性值执行的条件函数,接受参数(value, key, index, count)
   * @param {number} [start=0] - 开始遍历的索引,默认为 0
   * @param {Array<number>} [skip=[]] - 跳过的索引数组
   * @returns {*} 如果条件函数返回 true,则返回符合条件的属性值:否则返回 null
   */
  function forIn(inputObj, condition, { start = 0, skip = [] } = {}) {
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
    return null; // 如果没有匹配到任何元素,则返回 null
  }

  /**
   * 遍历对象的属性,并根据条件进行处理
   * @param {Object} inputObj - 要遍历的对象
   * @param {Function} condition - 对每个属性值执行的条件函数,接受参数(value, key, index, count)
   * @param {number} [start=0] - 开始遍历的索引,默认为 0
   * @param {Array<number>} [skip=[]] - 跳过的索引数组
   * @returns {*} 如果条件函数返回 true,则返回符合条件的属性值:否则返回 null
   */
  function forOf(inputObj, condition, { start = 0, skip = [] } = {}) {
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
   * Algorithm 类提供了一系列静态方法的算法操作
   */
  class Algorithm {

    /**
     * 计算给定起始日期与指定日期之间的天数差
     * @param {string} strStartDate - 起始日期,格式通常为 'YYYY-MM-DD'
     * @param {string} [strEndtDate=new Date] - 结束日期,格式通常为 'YYYY-MM-DD',默认为当前日期
     * @returns {number} - 两个日期之间的天数差
     */
    static calculateDaysDiff(strStartDate, strEndtDate = new Date) {
      let startDate = new Date(strStartDate); // 将字符串转换为日期对象
      let todayDate = new Date(strEndtDate); // 默认为当前日期
      let timeDiff = Math.abs(todayDate.getTime() - startDate.getTime()); // 获取两个日期的时间差（毫秒）
      let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 将时间差转换为天数，并向上取整
      return daysDiff; // 返回天数差
    }

    /**
     * 获取指定范围内的所有整数
     * @param {number} start - 范围的起始值
     * @param {number} end - 范围的结束值
     * @returns {number[]} - 包含范围内所有整数的数组
     */
    static getNumbersBetween(start, end) {
      let numbers = []; // 存储结果的数组
      // 确保start不大于end
      let min = Math.min(start, end);
      let max = Math.max(start, end);

      // 使用循环从min遍历到max(包括max)
      for (let i = min; i <= max; i++) {
        numbers.push(i); // 将每个整数添加到数组中
      }
      return numbers; // 返回结果数组
    }

    /**
     * 获取指定范围内的所有整数,允许指定步长
     * @param {number} start - 范围的起始值
     * @param {number} end - 范围的结束值
     * @param {number} [step=1] - 步长,默认为1
     * @returns {number[]} - 包含范围内所有整数的数组，按照指定步长
     */
    static getNumbersBetweenWithStep(start, end, step = 1) {
      let numbers = []; // 存储结果的数组
      // 确保start不大于end,且step为正数  
      if (start > end && step > 0) {
        [start, end] = [end, start]; // 交换start和end的值
        step = -step; // 如果start大于end,则反向遍历并改变步长  
      }

      // 使用循环从start遍历到end(包括end)
      for (let i = start; (step > 0 && i <= end) || (step < 0 && i >= end); i += step) {
        numbers.push(i); // 将每个整数添加到数组中
      }
      return numbers; // 返回结果数组
    }

    /**
     * 计算当前值相对于最大值的百分比
     * @param {number} currentValue - 当前值
     * @param {number} maxValue - 最大值
     * @param {number} [fixed=0] - 小数点后保留的位数,默认为0
     * @returns {string} - 百分比值,保留指定位数的小数
     */
    static calculatePercentage(currentValue, maxValue, fixed = 0) {
      let percentage = (currentValue / maxValue) * 100; // 计算百分比
      return percentage.toFixed(fixed); // 保留指定位数的小数并返回
    }
  }

  return {
    $,
    forEnd,
    forIn,
    forOf,

    Judge,
    TypeCast,
    Algorithm,
  };

})();

(function () {
  const {
    $,
    Code_Error,
    Judge,
    forEnd,
    forIn,
    forOf,
    TypeCast,
    Algorithm
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
          this.classList.remove(...classNames);
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
          this.classList.add(...classNames);
        } else {
          this.classList.add(classNames);
        }
        return this;
      }
      /**
       * 扩展 HTMLElement 原型的 toggleClass 方法,根据布尔值来添加或移除指定类名
       * @param {string} className - 要操作的类名
       * @param {boolean} addClass - 是否添加类名,true 表示添加,false 表示移除
       * @return {HTMLElement} 返回当前 HTML 元素本身以便实现链式调用
       */
      HTMLElement.prototype.toggleClass = function (className, addClass) {
        if (addClass) {
          this.classList.add(className);
        } else {
          this.classList.remove(className);
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
          fragment.append(...element);
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

    Object.defineProperty(HTMLElement.prototype, "wInitData", {
      get: function () {
        if (!this._wInitData) {
          this._wInitData = {};
          const str = this.attr("w-init-data");
          if (Judge.isEmptyString(this.attr("w-init-data"))) return this._wInitData;

          const regex = /\[([^\]]*)\]/g;
          const matches = Array.from(str.matchAll(regex), m => m[1]);
          forEnd(matches, item => {
            const arr = item.split(":");
            this._wInitData[arr[0]] = arr[1];
          })
          this.removeAttr("w-init-data");
        }
        return this._wInitData;
      }
    });
  }
  // ==================== // 
  forEnd($("[w-init-data]"), item => item.wInitData); // 初始化所有 w-init-data
  // ==================== // 

  const CustomizeEvents = (TargetElement, event) => {
    if (!TargetElement.eventSlot) TargetElement.eventSlot = () => { };
    TargetElement.eventSlot(event);

    if (TargetElement.hasAttr(`w-callback-${event.wEventName}`)) {
      window[TargetElement.getAttribute(`w-callback-${event.wEventName}`)](event);
    }
  }

  MainWindow.addEvent("mousedown", (event) => {
    const TargetElement = event.target;
    event.wEventName = "mousedown";
    CustomizeEvents(TargetElement, event);
    {
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
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("input", (event) => {
    const TargetElement = event.target;
    event.wEventName = "input";
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("dblclick", (event) => {
    const TargetElement = event.target;
    event.wEventName = "dblclick";
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("copy", function (event) {
    const TargetElement = event.target;
    event.wEventName = "copy";
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("paste", function (event) {
    const TargetElement = event.target;
    event.wEventName = "paste";
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("cut", function (event) {
    const TargetElement = event.target;
    event.wEventName = "cut";
    CustomizeEvents(TargetElement, event);
  });
  MainWindow.addEvent("contextmenu", function (event) {
    const TargetElement = event.target;
    event.wEventName = "contextmenu";
    CustomizeEvents(TargetElement, event);
  });


  document.addEvent("mouseleave", function () {
  });

  document.addEvent("visibilitychange", function () {
    const pageVisibility = document.visibilityState;
    WPageVisibility = pageVisibility;
  });
})();
// WebUtilMin SQJM 2024