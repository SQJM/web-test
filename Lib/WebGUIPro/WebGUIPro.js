/**
 * @name WebGUIPro
 * @version 2.5.0
 * @description 网页控件
 * @author Wang Jia Ming
 * @createDate 2023-5-7
 * @license AGPL-3.0-1
 * 
 * 依赖库/框架:
 * - WebUtilPro.js (2.5.0)
 */
const _WebGUIPro_VERSION = "2.5.0";
const WebGUIPro = (function () {
    "use strict";

    if (_WebUtilPro_VERSION !== "2.5.0") throw `No matching WebUtilPro(2.5.0)`;

    const {
        $,
        getAppointParent,
        forEnd,
        forIn,
        forOf,
        debounce,
        WEvent,
        WInputType,
        AddDraggable,
        LevelMessage,
        elementStyle,
        elementAnimation,
        Judge,
        TypeCast,
        generateUniqueId,
        eventTrigger,
        includeCssFiles,
        uniquenessElement,
        runAsyncOnce,
        createElement,
        WDirection,
        WSortord,
        VitalEvent,
        WVarType,
        WWindowModel,
        WWindowOperation,
        WEventLevel,
        WLayoutDirection,
        WPlace,
        Algorithm
    } = WebUtilPro;

    // Ui 错误
    const UI_Error = {
        // 参数不匹配
        ParameterMismatch: (...arg) => {
            return new Error(`UI Error : <${arg}> Parameter mismatch`);
        },
        // 不存在的项
        NotExistItem: (...arg) => {
            return new Error(`UI Error : <${arg}> Not exist item`);
        },
        // 不存在的视图
        NotExistView: (...arg) => {
            return new Error(`UI Error : <${arg}> Not exist view`);
        },
        // 变量不存在
        VariableDoesNotExist: (...arg) => {
            return new Error(`UI Error: <${arg}> Variable does not exist`);
        },
        // 缺失重要元素
        MissingVitalElement: (...arg) => {
            return new Error(`UI Error: <${arg}> Missing vital element`);
        },
        // 自定义错误
        CustomError: (error, ...arg) => {
            return new Error(`UI Error: <${arg}> ${error}`);
        },
    }

    const ThemeProperty = {
        // 背景相关  
        bg: "background",
        bgColor: "background-color",
        bgImage: "background-image",
        bgRepeat: "background-repeat",
        bgPosition: "background-position",
        bgSize: "background-size",
        bgAttachment: "background-attachment",

        // 文本和字体相关  
        color: "color",
        fontSize: "font-size",
        fontFamily: "font-family",
        fontWeight: "font-weight",
        fontStyle: "font-style",
        textAlign: "text-align",
        textDecoration: "text-decoration",
        textTransform: "text-transform",
        textIndent: "text-indent",
        lineHeight: "line-height",
        letterSpacing: "letter-spacing",
        wordSpacing: "word-spacing",
        whiteSpace: "white-space",

        // 边框相关  
        border: "border",
        borderRadius: "border-radius",
        borderTop: "border-top",
        borderRight: "border-right",
        borderBottom: "border-bottom",
        borderLeft: "border-left",
        borderWidth: "border-width",
        borderColor: "border-color",
        borderStyle: "border-style",

        // 盒子模型相关  
        margin: "margin",
        marginTop: "margin-top",
        marginRight: "margin-right",
        marginBottom: "margin-bottom",
        marginLeft: "margin-left",
        padding: "padding",
        paddingTop: "padding-top",
        paddingRight: "padding-right",
        paddingBottom: "padding-bottom",
        paddingLeft: "padding-left",
        boxShadow: "box-shadow",
        boxSizing: "box-sizing",

        // 其他常用属性  
        scale: "scale",
        opacity: "opacity",
        cursor: "cursor",
        overflow: "overflow",
        outline: "outline",
        clear: "clear",
        zIndex: "z-index",
        transform: "transform",
        filter: "filter",
        transition: "transition",
        animation: "animation",
        listStyle: "list-style",
        verticalAlign: "vertical-align"
    };

    // 最大宽度
    const MAX_WIDTH = "100dvw";
    // 最大高度
    const MAX_HEIGHT = "100dvh";

    const NONE = "none";

    // 删除子 ui
    function _DeleteSonUi(ui) {
        forEnd(ui.$("[winit]"), e => e.Class.delete());
    }

    function _DeleteUi(This) {
        _DeleteSonUi(This.ui);
        This.Callbacks.delete();
        _WebUtilPro__ZERO_ELEMENT.focus();
        This.ui.remove();
    }

    function _ConfigToMap(config) {
        if (Judge.isFalse(config)) return;
        if (!Judge.isString(config)) throw UI_Error.ParameterMismatch(config);
        const arr = [...new Set(config.split(" "))];
        const map = new Map;
        forEnd(arr, e => {
            const item = e.split(":");
            if (Judge.isArray(item) && item.length > 1) {
                map.set(item[0], item[1]);
            } else {
                map.set(e, "");
            }
        })
        return map;
    }
    function _MapToConfig(map) {
        if (!Judge.isMap(map)) throw UI_Error.ParameterMismatch(map);
        const arr = [];
        forOf(map, (value, key) => {
            if (key) {
                arr.push(`${value}:${key}`);
            } else {
                arr.push(value);
            }
        });
        return arr.join(" ");
    }
    function _ConfigValueToMap(value) {
        if (Judge.isFalse(value)) return;
        if (!Judge.isString(value)) throw UI_Error.ParameterMismatch(value);
        const arr = [...new Set(value.split(";"))];
        const map = new Map;
        forEnd(arr, e => {
            const item = e.split("=");
            if (Judge.isArray(item) && item.length > 1) {
                map.set(item[0], item[1]);
            } else {
                map.set(e, "");
            }
        })
        return map;
    }

    // 初始化 ui 配置回调事件
    function _InitUIConfigCallbackEvent(map, This) {
        if (Judge.isFalse(map)) return;
        if (!Judge.isMap(map)) throw UI_Error.ParameterMismatch(map);
        if (map.has("callbacks")) {
            const m = _ConfigValueToMap(map.get("callbacks"));
            forOf(m, (value, key, i) => {
                if (!value) return false;
                if (Judge.isEmptyString(value)) throw UI_Error.ParameterMismatch(`key:${key} value:${value || "null"} index:${i}`);
                This.ui.Class.setCallback(key, window[value]);
            });
        }
    }

    //=======================================================================//

    class WindowFlags {
        static MinButtonHint = 0x000001;
        static RestoreButtonHint = 0x000010;
        static CloseButtonHint = 0x000100;

        static Get(flags = null, {
            min = {
                text: "\ue15b"
            },
            toggle = {
                text: "\ue3c1"
            },
            close = {
                text: "\ue14c"
            }
        } = {}) {
            const minBtn = createElement(min);
            minBtn.addClass(["material-icons", "min", "btn"]);
            const toggleBtn = createElement(toggle);
            toggleBtn.addClass(["material-icons", "toggle", "restore", "btn"]);
            const closeBtn = createElement(close);
            closeBtn.addClass(["material-icons", "close", "btn"]);
            const group = createElement({
                classList: ["w-window-flags"]
            });

            if ((flags & this.MinButtonHint) === 0) group.appendChild(minBtn);
            if ((flags & this.RestoreButtonHint) === 0) group.appendChild(toggleBtn);
            if ((flags & this.CloseButtonHint) === 0) group.appendChild(closeBtn);

            group.toggleMode = "restore";

            group.ClickEvent = function (event) { }
            group.SetToggleMode = function (mode) {
                if (mode === "maximize") {
                    toggleBtn.removeClass("restore");
                    toggleBtn.addClass("maximize");
                    toggleBtn.innerText = "\ue3e0";
                    group.toggleMode = mode;
                } else if (mode === "restore") {
                    toggleBtn.addClass("restore");
                    toggleBtn.removeClass("maximize");
                    toggleBtn.innerText = "\ue3c1";
                    group.toggleMode = mode;
                }
            }
            group.addEvent("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const TargetElement = event.target;
                let eventName;
                const btn = getAppointParent(TargetElement, e => { return e.hasClass("btn") && e.parentNode === group });
                if (!btn) return;
                if (btn.hasClass("min")) {
                    eventName = "min";
                } else if (btn.hasClass("restore") && !btn.hasClass("maximize")) {
                    eventName = "maximize";
                    group.SetToggleMode("maximize");
                } else if (btn.hasClass("close")) {
                    eventName = "close";
                } else if (btn.hasClass("maximize")) {
                    eventName = "restore";
                    group.SetToggleMode("restore");
                }
                group.ClickEvent(eventName);
            });

            return group;
        }
    }

    //=======================================================================//

    class WItem {
        #Item;

        constructor(item = null) {
            if (Judge.isHTMLElement(item)) {
                this.#Item = item;
            } else if (Judge.isNull(item)) {
                this.#Item = createElement({
                    attribute: [["w-item"]]
                });
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
        }

        getText() {
            return WItem.GetText(this.#Item);
        }

        getIndex() {
            return WItem.GetIndex(this.#Item);
        }

        removeItem() {
            return WItem.RemoveItem(this.#Item);
        }

        selectItem() {
            return WItem.SelectItem(this.#Item);
        }

        removeSelectItem() {
            return WItem.RemoveSelectItem(this.#Item);
        }

        setDraggable(bool = true) {
            return WItem.SetDraggable(this.#Item, bool);
        }

        isDisabled() {
            return WItem.IsDisabled(this.#Item);
        }

        isSelect() {
            return WItem.IsSelect(this.#Item);
        }

        // 判断是否是 item
        static Is(item) {
            return Judge.isHTMLElement(item) && item.hasAttr("w-item");
        }

        // 获取项索引
        static GetIndex(item) {
            if (Judge.isHTMLElement(item) && item.hasAttribute("w-index"))
                return parseInt(item.getAttribute("w-index"));
            else return -1;
        }

        // 获取文本
        static GetText(item) {
            if (Judge.isHTMLElement(item))
                return item.textContent;
        }

        // 移除项
        static RemoveItem(item) {
            if (Judge.isHTMLElement(item)) {
                item.remove();
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
        }

        // 判断项是否被禁用
        static IsDisabled(item) {
            return item.hasAttr("disabled");
        }

        // 判断是否被选择
        static IsSelect(item) {
            return item.hasClass("select");
        }

        // 获取项
        static GetItem(element, parentNode) {
            return getAppointParent(element, e => { return e.hasAttr("w-item") && e.parentNode === parentNode });
        }

        // 选择项
        static SelectItem$(item, parentNode) {
            let target;
            if (Judge.isHTMLElement(item)) {
                if (item.attr("w-item")) {
                    target = item;
                } else {
                    target = WItem.GetItem(item, parentNode);
                }
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
            if (WItem.IsDisabled(target)) {
                target.removeClass("select");
                return false;
            } else if (target) {
                target.addClass("select");
                return target;
            } else {
                throw UI_Error.NotExistItem(item);
            }
        }

        // 设置拖拽
        static SetDraggable(item, bool = true) {
            if (Judge.isHTMLElement(item)) {
                item.attr("draggable", bool)
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
        }

        // 选择项
        static SelectItem(item) {
            if (!Judge.isHTMLElement(item)) {
                throw UI_Error.ParameterMismatch(item);
            }
            if (WItem.IsDisabled(item)) {
                item.removeClass("select");
                return false;
            } else if (item) {
                item.addClass("select");
                return item;
            } else {
                throw UI_Error.NotExistItem(item);
            }
        }

        // 清除选择项
        static RemoveSelectItem(item) {
            if (!Judge.isHTMLElement(item)) {
                throw UI_Error.ParameterMismatch(item);
            }
            if (item) {
                item.removeClass("select");
                return item;
            } else {
                throw UI_Error.NotExistItem(item);
            }
        }

        // 清除带选择标签的项
        static RemoveSelectTagItem(container) {
            if (Judge.isHTMLElement(container)) {
                forEnd(container.$(">.select"), (item) => { item.removeClass("select"); });
            } else {
                throw UI_Error.ParameterMismatch(container);
            }
        }

        // 返回 ui 项
        static ReturnUiInItem(indexOrItem = 0, This) {
            const item = WItem.ReturnItem(indexOrItem, This);
            if (This.judgeElementBelongToUI(item)) {
                return item;
            } else {
                throw UI_Error.ParameterMismatch(indexOrItem);
            }
        }

        // 返回项
        static ReturnItem(indexOrItem = 0, This) {
            let item;
            if (Judge.isNumber(indexOrItem)) {
                item = This.getItem(indexOrItem);
            } else if (Judge.isHTMLElement(indexOrItem) && WItem.Is(indexOrItem)) {
                item = indexOrItem;
            } else {
                throw UI_Error.ParameterMismatch(indexOrItem);
            }
            return item;
        }
    }

    class WView {
        #View;

        constructor(view = null) {
            if (Judge.isHTMLElement(view)) {
                this.#View = view;
            } else if (Judge.isNull(view)) {
                this.#View = createElement({
                    attribute: [["w-view", ""]]
                });
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
        }

        getIndex() {
            return WView.GetItemView(this.#View);
        }

        removeView() {
            return WView.RemoveView(this.#View);
        }

        selectView() {
            return WView.SelectView(this.#View);
        }

        isSelect() {
            return WView.IsSelect(this.#View);
        }

        // 判断是否是 view
        static Is(view) {
            return Judge.isHTMLElement(view) && view.hasAttr("w-view");
        }

        // 获取视图索引
        static GetIndex(view) {
            if (Judge.isHTMLElement(view) && view.hasAttribute("w-index"))
                return parseInt(view.getAttribute("w-index"));
            else return -1;
        }

        // 移除视图
        static RemoveView(view) {
            if (Judge.isHTMLElement(view)) {
                view.remove();
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
        }

        // 判断是否被选择
        static IsSelect(view) {
            return view.hasClass("select");
        }

        // 选择视图
        static SelectView(view) {
            if (!Judge.isHTMLElement(view)) throw UI_Error.ParameterMismatch(view);
            if (view) {
                view.addClass("select");
                return view;
            } else {
                throw UI_Error.NotExistItem(view);
            }
        }

        // 清除带选择标签的视图
        static RemoveSelectTagView(container) {
            if (Judge.isHTMLElement(container)) {
                forEnd(container.$(">.select"), (view) => { view.removeClass("select"); });
            } else {
                throw UI_Error.ParameterMismatch(container);
            }
        }

        // 返回 ui 视图
        static ReturnUiInView(indexOrView = 0, This) {
            const view = WView.ReturnView(indexOrView, This);
            if (This.judgeElementBelongToUI(view)) {
                return view;
            } else {
                throw UI_Error.ParameterMismatch(indexOrView);
            }
        }

        // 返回视图
        static ReturnView(indexOrView = 0, This) {
            let view;
            if (Judge.isNumber(indexOrView)) {
                if (This.getView) {
                    view = This.getView(indexOrView);
                } else if (This.getTab) {
                    view = This.getTab(indexOrView);
                }
            } else if (Judge.isHTMLElement(indexOrView) && WView.Is(indexOrView)) {
                view = indexOrView;
            } else {
                throw UI_Error.ParameterMismatch(indexOrView);
            }
            return view;
        }
    }

    //=======================================================================//

    class UIPrototype {
        constructor() {
            this.EventSlot = new Map;
        }

        addEventSlot(slot) {
            const slotID = slot.Class.getSlotID();
            this.EventSlot.set(slotID, slot);
        }

        removeEventSlot(slot) {
            const slotID = slot.Class.getSlotID();
            this.EventSlot.delete(slotID);
        }
    }

    //=======================================================================//

    class GenerateUI {
        constructor(uiClassName = "", {
            tagName = "div",
            attribute = [],
            child = []
        } = {}) {
            const obj = {
                tagName: tagName,
                classList: [],
                attribute: attribute,
                child: child
            };
            obj.classList.push(uiClassName);
            return createElement(obj);
        }
    }

    class UI extends UIPrototype {
        // 初始化 ui 配置
        initUIConfig() {
            const map = _ConfigToMap(this.ui.attr("w-ui-config"));
            _InitUIConfigCallbackEvent(map, this);
            if (Judge.isMap(map)) {
                this.UIConfigMap(map);
            }
            this.ui.removeAttr("w-ui-config");
        }

        // 设置回调
        setCallback(type = "delete", fn = () => { }) {
            if (this.Callbacks.hasOwnProperty(type)) {
                this.Callbacks[type] = fn;
            } else {
                throw UI_Error.ParameterMismatch(type);
            }
        }

        // 删除 ui
        delete() {
            _DeleteUi(this);
        }

        // 判断元素是否属于 ui
        judgeElementBelongToUI(element = HTMLElement) {
            if (!Judge.isHTMLElement(element)) throw UI_Error.ParameterMismatch(element);
            return this.ui.contains(element);
        }

        constructor(Callbacks, initUIConfigMap) {
            super();
            this.Callbacks = Callbacks;
            this._Callbacks = Callbacks;
            this.UIConfigMap = initUIConfigMap;
        }
    }

    class UI2 extends UIPrototype {
        // 设置回调
        setCallback(type = "delete", fn = () => { }) {
            if (this.Callbacks.hasOwnProperty(type)) {
                this.Callbacks[type] = fn;
            } else {
                throw UI_Error.ParameterMismatch(type);
            }
        }

        // 删除 ui
        delete() {
            _DeleteUi(this);
        }

        // 判断元素是否属于 ui
        judgeElementBelongToUI(element = HTMLElement) {
            if (!Judge.isHTMLElement(element)) throw UI_Error.ParameterMismatch(element);
            return this.ui.contains(element);
        }

        constructor(Callbacks) {
            super();
            this.Callbacks = Callbacks;
            this._Callbacks = Callbacks;
        }
    }

    class InputUI extends UI {
        // 设置 ui 禁用
        setDisabled(bool = true) {
            bool ? this.ui.attr("disabled", "") : this.ui.removeAttr("disabled");
        }

        // 设置只读
        setReadOnly(bool = true) {
            bool ? this.ui.attr("readonly", "") : this.ui.removeAttr("readonly");
        }

        // 是否只读
        isReadOnly() {
            return this.ui.hasAttr("readonly");
        }

        constructor(Callbacks, initUIConfigMap) {
            super(Callbacks, initUIConfigMap);
        }
    }

    class InputUI2 extends InputUI {
        // 设置状态
        setState(bool = true) {
            if (!Judge.isBoolean(bool)) throw UI_Error.ParameterMismatch(bool);
            this.ui.checked = bool;
        }

        // 获取状态
        getState() {
            return this.ui.checked;
        }

        constructor(Callbacks, initUIConfigMap) {
            super(Callbacks, initUIConfigMap);
        }
    }

    class InputUI3 extends InputUI {
        // 获取值
        getValue(returnType = WVarType.string) {
            if (returnType === WVarType.string) {
                return this.ui.value;
            } else if (returnType === WVarType.number) {
                return parseInt(this.ui.value);
            } else if (returnType === WVarType.float) {
                return parseFloat(this.ui.value);
            } else throw UI_Error.ParameterMismatch(returnType);
        }

        // 设置值
        setValue(value) {
            this.ui.value = value;
        }

        // 获取值长度
        getValueLength() {
            return this.ui.value.length;
        }

        // 清空值
        removeValue() {
            this.ui.value = null;
        }

        // 添加值
        appValue(value) {
            this.ui.value = this.ui.value + value;
        }

        // 设置最大输入长度
        setMaxLength(length = null) {
            if (!Judge.isNumber(length) || !Judge.isNull(length)) throw UI_Error.ParameterMismatch(length);
            Judge.isNull(length) ? this.ui.removeAttr("maxlength") : this.ui.attr("maxlength", length);
        }

        // 设置最小输入长度
        setMaxLength(length = null) {
            if (!Judge.isNumber(length) || !Judge.isNull(length)) throw UI_Error.ParameterMismatch(length);
            Judge.isNull(length) ? this.ui.removeAttr("minlength") : this.ui.attr("minlength", length);
        }

        constructor(Callbacks, initUIConfigMap) {
            super(Callbacks, initUIConfigMap);
        }
    }

    class WidgetUI extends UI2 {
        DIALOG = true;

        // 显示
        show() {
            this.ui.removeAttr("open");
            this.ui.show();
        }

        // 模态显示
        showModal() {
            this.ui.removeAttr("open");
            this.ui.showModal();
        }

        // 设置最大宽度
        setMaxWidth(width) {
            this.ui.css({ maxWidth: `${width}` });
        }

        // 设置最大高度
        setMaxHeight(height) {
            this.ui.css({ maxHeight: `${height}` });
        }

        // 设置最小宽度
        seMinWidth(width) {
            this.ui.css({ minWidth: `${width}` });
        }

        // 设置最小高度
        setMinHeight(height) {
            this.ui.css({ minHeight: `${height}` });
        }

        // 设置宽度
        setWidth(width) {
            this.ui.css({ width: `${width}px` });
        }

        // 设置高度
        setHeight(height) {
            this.ui.css({ height: `${height}px` });
        }

        // 设置坐标 x
        setX(x) {
            this.ui.css({ left: `${x}px` });
        }

        // 设置坐标 y
        setY(y) {
            this.ui.css({ top: `${y}px` });
        }

        // 设置坐标 x,y
        setXY(x, y) {
            this.setX(x);
            this.setY(y);
        }

        // 设置内容
        setContent(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.ui.innerRemove();
                view.addClass("content");
                this.ui.appendChild(view);
            } else if (Judge.isString(view)) {
                this.ui.innerRemove();
                this.ui.appendChild(createElement({
                    attribute: [["w-view", ""]],
                    classList: ["content"],
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.ui);
        }

        // 关闭
        close() {
            this.ui.close();
            this.Callbacks.close();
        }

        constructor(Callbacks) {
            super(Callbacks);
        }
    }

    class WidgetUI2 extends UI2 {
        DIALOG = true;

        // 显示
        show() {
            this.ui.eventSlot = (event) => {
                if (event.wEventName !== "click") return;
                this.close();
            }
            this.ui.removeAttr("open");
            this.ui.showModal();
        }

        // 设置内容
        setContent(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.ui.innerRemove();
                view.addClass("content");
                this.ui.appendChild(view);
            } else if (Judge.isString(view)) {
                this.ui.innerRemove();
                this.ui.appendChild(createElement({
                    attribute: [["w-view", ""]],
                    classList: ["content"],
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.ui);
        }

        // 关闭
        close() {
            this.ui.close();
            this.Callbacks.close();
        }

        constructor(Callbacks) {
            super(Callbacks);
        }
    }

    class WidgetUI3 extends UI2 {
        DIALOG = true;

        // 显示
        show() {
            this.ui.eventSlot = (event) => {
                if (event.wEventName !== "click") return;
                this.close();
            }
            this.ui.removeAttr("open");
            this.ui.showModal();
        }

        // 设置坐标 x
        setX(x) {
            this.ui.css({ left: `${x}px` });
        }

        // 设置坐标 y
        setY(y) {
            this.ui.css({ top: `${y}px` });
        }

        // 设置坐标 x,y
        setXY(x, y) {
            this.setX(x);
            this.setY(y);
        }

        // 关闭
        close() {
            this.ui.close();
            this.Callbacks.close();
        }

        constructor(Callbacks) {
            super(Callbacks);
        }
    }

    //=======================================================================//

    class Link {
        static ListContainer(ui, listUI) {
            const arr = Object.getOwnPropertyNames(ListContainer.prototype);
            arr.splice("constructor", 1);
            forEnd(arr, name => {
                ui[name] = ListContainer.prototype[name].bind(listUI);
            });
        }
    }

    //=======================================================================//

    class ListContainer extends UI {
        #SeriesTrigger = false;
        #MultipleMode = false;

        // 设置多单选模式
        setMultipleMode(bool = false) {
            this.#MultipleMode = TypeCast.toBoolean(bool);
        }

        // 设置连续触发
        setSeriesTrigger(bool = false) {
            this.#SeriesTrigger = TypeCast.toBoolean(bool);
        }

        // 设置项拖拽
        setItemDraggable(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            bool ? item.attr("draggable", "true") : item.removeAttr("draggable", "false");
        }

        // 设置项固定
        setItemFixed(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            bool ? item.addClass("fixed") : item.removeClass("fixed");
        }

        // 设置选择项的触发方式
        setSelectItemTriggerMode(mode = WEvent.mousedown || WEvent.click) {
            if (mode !== WEvent.mousedown || mode !== WEvent.click) throw UI_Error.ParameterMismatch(content);
            this.TriggerMode = mode;
        }

        // 设置反转排序项
        setReverse(bool = true, sortord = WSortord.Column) {
            if (!Judge.isValueInObject(sortord, WSortord)) throw UI_Error.ParameterMismatch(sortord);
            this.ui.toggleClass(`w-${sortord}-reverse`, bool);
        }

        // 设置排序方向
        setSortDirection(sortord = WSortord.Column) {
            if (!Judge.isValueInObject(sortord, WSortord)) throw UI_Error.ParameterMismatch(sortord);
            this.ui.removeClass(`w-${WSortord.Column}-direction`, `w-${WSortord.Row}-direction`);
            this.ui.addClass(`w-${sortord}-direction`);
        }

        #filtrationData(item, precisionFiltration = null) {
            const arr = [];
            item.hasAttr("w-filtration") && arr.push({
                element: item,
                text: item.textContent
            });
            forEnd(item.$("[w-filtration]"), element => {
                arr.push({
                    element: element,
                    text: element.textContent
                });
            });
            return arr;
        }

        // 过滤
        filtration(condition = () => true) {
            forEnd(this.getItemAll(), item => {
                if (condition(item, this.#filtrationData(item))) {
                    item.removeClass("hide");
                } else {
                    item.addClass("hide");
                }
            });
        }

        // 显示所有项
        showItemAll() {
            forEnd(this.getItemAll(), item => item.removeClass("hide"));
        }

        // 隐藏所有项
        hideItemAll() {
            forEnd(this.getItemAll(), item => item.addClass("hide"));
        }

        // 排序项
        sortItem() {
            forEnd(this.ui.$(">[w-item]"), (item, i) => { item.attr("w-index", i); });
        }

        // 返回项数量
        itemSize() {
            return this.getItemAll().length;
        }

        // 通过索引获取项
        getItem(index = 0) {
            return this.getItemAll()[index];
        }

        // 获取所有项
        getItemAll() {
            return this.ui.$(">[w-item]");
        }

        // 获取所有隐藏项
        getHideItemAll() {
            return this.ui.$(">[w-item]").filter(item => { return item.hasClass("hide") });
        }

        // 获取所有非隐藏项
        getNotHideItemAll() {
            return this.ui.$(">[w-item]").filter(item => { return !item.hasClass("hide") });
        }

        // 获取选中的项
        getSelectItem() {
            if (this.#MultipleMode) return this.ui.$(">.select"); else return this.ui.$(">.select").first;
        }

        // 获取选中的项索引
        getSelectItemIndex() {
            const item = this.ui.$(">.select").first;
            let i = 0;
            item && (i = parseInt(item.attr("w-index")));
            return i;
        }

        // 获取禁用的项
        getDisabledItem() {
            return this.ui.$(">[disabled]");
        }

        // 清除选择项
        clearSelectItem() {
            WItem.RemoveSelectTagItem(this.ui);
        }

        // 根据索引或者项移除项
        removeItem(indexOrItem = 0, isSort = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            WItem.RemoveItem(item);

            isSort && this.sortItem();
            this.Callbacks.removeItem(item);
        }

        // 根据索引或者项移除多项
        removeItems(items = 0, isSort = true) {
            forEnd(items, item => this.removeItem(item, false));
            isSort && this.sortItem();
        }

        // 移除所有项
        removeItemAll() {
            forEnd(this.getItemAll(), item => { this.removeItem(item, false) });
        }

        // 使项出现在视口
        itemIntoView(indexOrItem = 0, obj = { behavior: 'smooth' }) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            item.scrollIntoView(obj);
        }

        // 移除预选
        removePreselection(indexOrItem = this.gePreselection()) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            if (!item) return false;
            item.removeClass("preselection");
            return true;
        }

        // 获取预选
        gePreselection() {
            return this.ui.$(".preselection").first;
        }

        // 预选
        preselection(indexOrItem = 0, isGoto = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            this.removePreselection();
            item.addClass("preselection");
            if (isGoto) this.itemIntoView(indexOrItem);
        }

        // 确定预选
        definitePreselection(isDefault = true) {
            const item = this.gePreselection();
            this.removePreselection(item);
            isDefault ? this.selectItem(item) : (item && this.selectItem(item));
        }

        // 添加项
        addItem(item = "", isSort = true, isClone = false) {
            if (WItem.Is(item)) {
                isClone && (item = item.cloneNode(true));
                this.ui.appendChild(item);
            } else if (Judge.isString(item) || Judge.isNumber(item)) {
                this.ui.appendChild(createElement({
                    attribute: [["w-item"]],
                    text: item
                }));
            } else {
                throw UI_Error.ParameterMismatch(item);
            }

            isSort && this.sortItem();
            this.Callbacks.addItem(item);
        }

        // 添加多项
        addItems(items = [], isSort = true, isClone = false) {
            if (!Judge.isArray(items)) {
                throw UI_Error.ParameterMismatch(items);
            }
            forEnd(items, (item, i) => {
                try {
                    item && this.addItem(item, false, isClone);
                } catch (error) {
                    throw UI_Error.CustomError(error, `#Error index : ${i}`);
                }
            });
            isSort && this.sortItem();
        }

        // 在项之后插入项
        insertItem(item = 0, target = 0) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insert", v1, v2)) return;

            v2.insertAdjacentElement('afterend', v1);
            this.sortItem();
        }

        // 在项之前插入项
        insertBeforeItem(item = 0, target = 0) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insertBefore", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortItem();
        }

        // 交换项
        swapItem(item = 0, target = 0) {
            const v1 = WItem.ReturnItem(item, this), v2 = WItem.ReturnItem(target, this);

            if (!this.Callbacks.swapItem("swap", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortItem();
        }

        // 设置项
        setItemContent(indexOrItem = 0, content = "") {
            const item = WItem.ReturnItem(indexOrItem, this);

            if (Judge.isString(content)) {
                item.innerRemove();
                item.innerText = content;
            } else if (Judge.isHTMLElement(content)) {
                item.innerRemove();
                item.appendChild(content);
            } else {
                throw UI_Error.ParameterMismatch(content);
            }
        }

        // 设置禁用项
        setDisabledItem(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnItem(indexOrItem, this);
            bool ? item.attr("disabled") : item.removeAttr("disabled");
        }

        // 选择项
        selectItem(indexOrItem = 0) {
            const item = WItem.ReturnItem(indexOrItem, this);
            return eventTrigger(item, this.TriggerMode);
        }

        // 选择所有项
        selectItemAll() {
            this.#MultipleMode && forEnd(this.getItemAll(), item => WItem.SelectItem(item));
        }

        // 反选所有项
        InvertSelectItemAll() {
            this.#MultipleMode && forEnd(this.getItemAll(), item => {
                if (item.hasClass("select")) {
                    WItem.RemoveSelectItem(item);
                } else {
                    WItem.SelectItem(item);
                }
            });
        }

        // 初始化
        #init() {
            this.TriggerMode = WEvent.mousedown;

            this.sortItem();

            const _selectItem = (indexOrItem = 0) => {
                const item = WItem.ReturnItem(indexOrItem, this);

                if (this.#MultipleMode) {
                    if (item.hasClass("select")) {
                        WItem.RemoveSelectItem(item);
                    } else {
                        WItem.SelectItem(item);
                    }
                } else {
                    WItem.RemoveSelectTagItem(this.ui);
                    WItem.SelectItem(item);
                }
                this.Callbacks.selectItemChange(item);
            }

            this.ui.addEvent("mousedown", (event) => {
                const TargetElement = event.target;
                if (this.TriggerMode !== WEvent.mousedown || TargetElement.hasAttr("w-prevent-default")) return;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!this.#SeriesTrigger && !this.#MultipleMode) {
                    const si = this.getSelectItem();
                    if (si && WItem.GetIndex(si) === WItem.GetIndex(item)) return;
                }
                if (!item || WItem.IsDisabled(item) || !this.Callbacks.selectItem(item, TargetElement, event)) return;
                _selectItem(item);
            }, () => {
                eventTrigger(this.getSelectItem(), WEvent.mousedown);
            });
            this.ui.addEvent("contextmenu", (event) => {
                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!item || WItem.IsDisabled(item)) return;
                this.Callbacks.contextMenu(event, item, TargetElement);
            });
            this.ui.addEvent("click", (event) => {
                if (this.TriggerMode !== WEvent.click) return;

                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!this.#SeriesTrigger && !this.#MultipleMode) {
                    const si = this.getSelectItem();
                    if (si && WItem.GetIndex(si) === WItem.GetIndex(item)) return;
                }
                if (!item || WItem.IsDisabled(item) || !this.Callbacks.selectItem(item, TargetElement, event)) return;
                _selectItem(item);
            }, () => {
                eventTrigger(this.getSelectItem(), WEvent.click);
            });
        }

        constructor(Element = null, Callbacks, initUIConfigMap) {
            super(Callbacks, initUIConfigMap);
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class Button extends UI {
        #EventAgent = (event) => {
            const TargetElement = event.target;
            this.Callbacks.click(TargetElement, event);
        }

        // 设置事件代理
        setEventAgent(bool = true) {
            if (bool)
                this.ui.addEvent("click", this.#EventAgent);
            else
                this.ui.removeEvent("click", this.#EventAgent);
        }

        // 设置 ui 禁用
        setDisabled(bool = true) {
            if (bool) {
                this.ui.attr("disabled", "");
            } else {
                this.ui.removeAttr("disabled");
            }
        }

        // 设置文本
        setText(text = "") {
            this.ui.textContent = text;
        }

        constructor(Element = null, Callbacks, initUIConfigMap) {
            super(Callbacks, initUIConfigMap);
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
        }
    }

    //=======================================================================//

    class WDefault extends UI2 {
        // 初始化
        #init() {
            this.initUIConfig();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-default")) {
            super(Element, {
                delete: () => { },
                create: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WSelectList extends ListContainer {
        // 添加项
        addItem(item = "", isSort = true, isClone = false) {
            if (WItem.Is(item)) {
                this.ui.appendChild(item.cloneNode(isClone));
            } else if (Judge.isString(item) || Judge.isNumber(item)) {
                this.ui.appendChild(createElement({
                    attribute: [["w-item"]],
                    text: item
                }));
            } else {
                throw UI_Error.ParameterMismatch(item);
            }

            isSort && this.sortItem();
            this.Callbacks.addItem(item);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-select-list")) {
            super(Element, {
                delete: () => { },
                create: () => { },
                addItem: () => { },
                removeItem: () => { },
                selectItem: () => true,
                selectItemChange: () => { },
                contextMenu: () => { },
                swapItem: () => true
            }, (map) => {
                if (map.has("reverse")) this.setReverse();
                if (map.has("sortDirection")) {
                    this.setSortDirection(map.get("sortDirection"));
                }
            });
            this.#init();
        }
    }

    class WList extends ListContainer {

        // 初始化
        #init() {
            this.initUIConfig();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-list")) {
            super(Element, {
                delete: () => { },
                create: () => { },
                addItem: () => { },
                removeItem: () => { },
                selectItem: () => true,
                selectItemChange: () => { },
                contextMenu: () => { },
                swapItem: () => true
            }, (map) => {
                if (map.has("reverse")) this.setReverse();
                if (map.has("multiple")) this.setMultipleMode(true);
                if (map.has("sortDirection")) this.setSortDirection(map.get("sortDirection"));
            });
            this.#init();
        }
    }

    class WButton extends Button {
        // 初始化
        #init() {
            this.initUIConfig();

            this.ui.eventSlot = (event) => {
                if (event.wEventName === "click") this.Callbacks.click(event);
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-button", { tagName: "button" })) {
            super(Element, {
                delete: () => { },
                create: () => { },
                click: () => { }
            }, (map) => {
                if (map.has("eventAgent")) this.setEventAgent();
            });
            this.#init();
        }
    }

    class WBoolButton extends Button {
        // 设置 bool
        setBool(bool = true) {
            this.ui.attr("w-bool", bool);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            if (!this.ui.hasAttr("w-bool")) {
                this.setBool();
            }

            this.ui.eventSlot = (event) => {
                if (event.wEventName === "click") {
                    const bool = TypeCast.strToBool(this.ui.attr("w-bool")) || false;
                    this.Callbacks.click(bool);
                    this.setBool(!bool);
                }
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-bool-button", { tagName: "button" })) {
            super(Element, {
                delete: () => { },
                create: () => { },
                click: () => { }
            }, (map) => {
                if (map.has("eventAgent")) this.setEventAgent();
            });
            this.#init();
        }
    }

    class WEdit extends InputUI3 {
        // 设置类型
        setType(type = WInputType.text) {
            if (!Judge.isValueInObject(type, WInputType)) throw UI_Error.ParameterMismatch(type);
            this.ui.attr("type", type);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            const fn = debounce((event) => { this.Callbacks.valueChange(event, this.getValue()) }, 80);
            const fn1 = debounce(() => {
                if (this.ui.hasAttr("min")) {
                    const min = parseInt(this.ui.attr("min"));
                    if (this.getValue(WVarType.number) < min) {
                        this.setValue(min);
                    }
                }
                if (this.ui.hasAttr("max")) {
                    const max = parseInt(this.ui.attr("max"));
                    if (this.getValue(WVarType.number) > max) {
                        this.setValue(max);
                    }
                }
            }, 100);
            this.ui.eventSlot = (event) => {
                if (this.ui.attr("type") === "number") {
                    fn1();
                }
                if (event.wEventName === "input") {
                    this.Callbacks.input(event);
                    fn(event);
                } else if (event.wEventName === "copy") {
                    this.Callbacks.copy(event);
                } else if (event.wEventName === "paste") {
                    this.Callbacks.paste(event);
                } else if (event.wEventName === "cut") {
                    this.Callbacks.cut(event);
                } else if (event.wEventName === "contextmenu") {
                    this.Callbacks.contextmenu(event);
                }
            }

            if (!this.ui.hasAttr("type")) this.setType(WInputType.text);

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-edit", { tagName: "input", attribute: ["type", WInputType.text] })) {
            super({
                delete: () => { },
                create: () => { },
                input: () => { },
                valueChange: () => { },
                copy: () => { },
                paste: () => { },
                cut: () => { },
                contextmenu: () => { }
            }, (map) => {
                if (map.has("readOnly")) this.setReadOnly();
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WText extends InputUI3 {
        // 设置大小调整模式
        setResizeMode(mode = WWindowOperation.both) {
            if (!Judge.isValueInObject(mode, WWindowOperation)) throw UI_Error.ParameterMismatch(mode);
            this.ui.removeClass([
                "w-resize-none",
                "w-resize-both",
                "w-resize-horizontal",
                "w-resize-vertical"
            ]);

            this.ui.addClass(`w-resize-${mode}`);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            const fn = debounce((event) => { this.Callbacks.valueChange(event, this.getValue()) }, 80);
            this.ui.eventSlot = (event) => {
                if (event.wEventName === "input") {
                    this.Callbacks.input(event);
                    fn(event);
                } else if (event.wEventName === "copy") {
                    this.Callbacks.copy(event);
                } else if (event.wEventName === "paste") {
                    this.Callbacks.paste(event);
                } else if (event.wEventName === "cut") {
                    this.Callbacks.cut(event);
                } else if (event.wEventName === "contextmenu") {
                    this.Callbacks.contextmenu(event);
                }
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-text", { tagName: "textarea" })) {
            super({
                delete: () => { },
                create: () => { },
                input: () => { },
                valueChange: () => { },
                copy: () => { },
                paste: () => { },
                cut: () => { },
                contextmenu: () => { }
            }, (map) => {
                if (map.has("readOnly")) this.setReadOnly();

            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WFieldset extends UI {
        #LegendElement = createElement({
            tagName: "legend",
            classList: ["legend"]
        });

        // 设置 legend 文本
        setLegendText(text) {
            this.#LegendElement.textContent = text;
        }

        // 初始化
        #init() {
            this.initUIConfig();

            const first = this.ui.firstElementChild;
            this.ui.appendChild(this.#LegendElement);
            if (first !== this.#LegendElement) {
                this.ui.insertBefore(this.#LegendElement, first);
            }

            if (this.ui.hasAttr("legend")) {
                this.setLegendText(this.ui.attr("legend"));
                this.ui.removeAttr("legend")
            } else {
                throw UI_Error.MissingVitalElement("legend text");
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-fieldset", { tagName: "fieldset", attribute: ["legend", ""] })) {
            super({
                delete: () => { },
                create: () => { },
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WStacked extends UI {
        // 移除视图
        removeView(indexOrView = 0, isSort = true) {
            const view = WView.ReturnUiInView(indexOrView, this);
            WView.RemoveView(view);

            isSort && this.sortView();
            this.Callbacks.removeView(indexOrView);
        }

        // 添加视图
        addView(view = HTMLElement, isSort = true) {
            if (WView.Is(view)) {
                this.ui.appendChild(view);
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isSort && this.sortView();
            this.Callbacks.addView(view);
        }

        // 添加多视图
        addViews(views = [], isSort = true) {
            forEnd(views, (view, i) => {
                try {
                    this.addView(view, false);
                } catch (error) {
                    throw `${error} #Error index : ${i}`;
                }
            });
            isSort && this.sortView();
        }

        // 获取视图
        getView(index = 0) {
            return this.getViewAll()[index];
        }

        // 获取所有视图
        getViewAll() {
            return this.ui.$("[w-view]");
        }

        // 获取视图数量
        getViewSize() {
            return this.ui.$("[w-view]").length;
        }

        // 获取选中视图
        getSelectView() {
            return this.ui.$(">[w-view].select").first;
        }

        // 选择视图
        selectView(indexOrView = 0) {
            WView.RemoveSelectTagView(this.ui);
            if (indexOrView >= this.getViewSize()) return false;
            const view = WView.ReturnUiInView(indexOrView, this);
            WView.SelectView(view);
            this.Callbacks.selectView(indexOrView);
        }

        // 排序视图
        sortView() {
            forEnd(this.ui.$(">[w-view]"), (view, i) => { view.attr("w-index", i); });
        }

        // 返回视图数量
        viewSize() {
            return this.getItemAll().length;
        }

        // 在项之后插入项
        insertItem(view = 0, target = 0) {
            const v1 = WView.ReturnUiInView(view, this), v2 = WView.ReturnUiInView(target, this);

            if (!this.Callbacks.swapView("insert", v1, v2)) return;

            v2.insertAdjacentElement('afterend', v1);
            this.sortView();
        }

        // 在项之前插入项
        insertBeforeItem(view = 0, target = 0) {
            const v1 = WView.ReturnUiInView(view, this), v2 = WView.ReturnUiInView(target, this);

            if (!this.Callbacks.swapView("insertBefore", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortView();
        }

        // 交换项
        swapItem(view = 0, target = 0) {
            const v1 = WView.ReturnView(view, this), v2 = WView.ReturnView(target, this);

            if (!this.Callbacks.swapView("swap", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortView();
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.sortView();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-stacked")) {
            super({
                delete: () => { },
                create: () => { },
                addView: () => { },
                removeView: () => { },
                selectView: () => { },
                swapView: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WTab extends UI {
        #BarElement = createElement({ classList: ["w-list", "bar", "w-son-ui"], callback: (bar) => { new WList(bar) } });
        #ContentElement = createElement({ classList: ["w-stacked", "content", "w-son-ui"], callback: (content) => { new WStacked(content) } });

        // 渲染 bar
        #renderBar() {
            this.#BarElement.innerRemove();
            const items = [];
            forEnd(this.getTabAll(), view => {
                const title = createElement({ attribute: [["w-item"]] });
                const icon = createElement({
                    tagName: "img",
                    classList: ["icon", "w-center-flex"],
                    attribute: [["draggable", "false"]]
                });
                const text = createElement({
                    tagName: "span",
                    classList: ["text", "w-center-flex"],
                    text: view.attr("tab-title")
                });
                const deleteBtn = createElement({
                    tagName: "i",
                    classList: ["delete-btn", "material-icons", "w-center-flex"],
                    text: "\ue14c"
                });
                title.append(icon, text, deleteBtn);
                const map = _ConfigToMap(view.attr("tab-config"));

                if (map.has("disabled")) title.attr("disabled", "");
                if (map.has("move")) title.attr("draggable", "true");
                if (map.has("fixed")) title.addClass("fixed");
                if (map.has("delete")) {
                    deleteBtn.style.display = "flex";
                    if (map.get("delete") === "auto-hide") deleteBtn.addClass("hide");
                } else deleteBtn.style.display = "none";
                if (map.has("icon")) {
                    icon.style.display = "flex";
                    icon.attr("src", map.get("icon"));
                } else icon.style.display = "none";
                items.push(title);
            });
            this.#BarElement.Class.addItems(items);
            const selectItemArray = this.#ContentElement.$(">[w-view].select");
            if (selectItemArray && selectItemArray.length > 0)
                forEnd(selectItemArray, view => {
                    this.selectTab(WView.GetIndex(view));
                    return true;
                });
            else
                forEnd(this.#BarElement.$(">[w-item]:not([disabled])"), item => {
                    this.selectTab(WItem.GetIndex(item));
                    return true;
                });
        }

        #getBarItemAll() {
            return this.#BarElement.Class.getItemAll();
        }

        // 移除 tab
        removeTab(indexOrView = 0) {
            this.#ContentElement.Class.removeView(indexOrView);
            this.#renderBar();
            this.Callbacks.removeTab(indexOrView);
        }

        // 添加 tab
        addTab(view = HTMLElement, isRender = true) {
            this.#ContentElement.Class.addView(view);
            isRender && this.#renderBar();
            this.Callbacks.addTab(view);
        }

        // 添加多 tab
        addTabs(views = [], isRender = true) {
            forEnd(views, (view, i) => {
                try {
                    this.addTab(view, false);
                } catch (error) {
                    throw `${error} #Error index : ${i}`;
                }
            });
            isRender && this.#renderBar();
        }

        // 获取 tab
        getTab(index) {
            return this.getTabAll()[index];
        }

        // 获取所有 tab
        getTabAll() {
            return this.#ContentElement.Class.getViewAll();
        }

        // 获取选中 tab
        getSelectTab() {
            return this.#ContentElement.Class.getSelectView();
        }

        // 选择 tab
        selectTab(indexOrView = 0) {
            WView.RemoveSelectTagView(this.#ContentElement);
            WItem.RemoveSelectTagItem(this.#BarElement);
            const index = WView.GetIndex(WView.ReturnUiInView(indexOrView, this));

            this.#ContentElement.Class.selectView(indexOrView);
            WItem.SelectItem(this.#getBarItemAll()[index]);

            this.Callbacks.selectTab(indexOrView);
        }

        // 覆盖 tab 标题项配置
        coverTabConfig(indexOrView = 0, config = []) {
            if (!Judge.isArray(config) && config !== null) throw UI_Error.ParameterMismatch(config);
            const tab = WView.ReturnUiInView(indexOrView, this);
            config ? tab.attr("tab-config", config.join(" ")) : tab.attr("tab-config", "");
            this.#renderBar();
        }

        // 设置 tab 标题项配置
        setTabConfig(indexOrView = 0, config = {}, isAdd = true) {
            if (!Judge.isObject(config)) throw UI_Error.ParameterMismatch(config);
            const tab = WView.ReturnUiInView(indexOrView, this);

            const map = _ConfigToMap(tab.attr("tab-config"));
            if (isAdd) {
                forIn(config, (value, key) => {
                    map.set(key, value);
                });
            } else {
                forIn(config, (value, key) => {
                    map.delete(key);
                });
            }
            tab.attr("tab-config", _MapToConfig(map));
            this.#renderBar();
        }

        // 排序 tab
        sortTab() {
            const v1 = this.#getBarItemAll();
            const v2 = this.getTabAll();
            if (v1.length !== v2.length) throw UI_Error.CustomError("Tab and view asymmetry", `Tab size : ${v1.length}, View size : ${v2.length}`);

            this.#BarElement.Class.sortItem();
            this.#ContentElement.Class.sortView();
        }

        // 返回 tab 数量
        tabSize() {
            return this.#ContentElement.Class.viewSize();
        }

        // 初始化
        #init() {
            this.addTabs(this.ui.$(">[w-view]"));

            const defaultSelect = this.#ContentElement.$(">.select").first;
            if (defaultSelect) this.selectTab(defaultSelect); else if (this.#ContentElement.Class.getViewSize() !== 0) this.selectTab(0);

            this.initUIConfig();

            this.#BarElement.Class.setCallback("selectItem", (item, TargetElement) => {
                if (item && !WItem.IsDisabled(item) && !TargetElement.hasClass("delete-btn")) {
                    this.selectTab(WItem.GetIndex(item));
                }
                return false;
            });
            this.#BarElement.addEvent("click", (event) => {
                const TargetElement = event.target;
                if (TargetElement.hasAttr("w-bar") || !TargetElement.hasClass("delete-btn")) return;
                const item = WItem.GetItem(TargetElement, this.#BarElement);
                if (item && !WItem.IsDisabled(item)) {
                    this.removeTab(WItem.GetIndex(item));
                }
            });

            this.Callbacks.create();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                create: () => { },
                addTab: () => { },
                removeTab: () => { },
                selectTab: () => { },
                swapTab: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                this.ui.append(this.#BarElement, this.#ContentElement);
            } else if (Judge.isNull(Element)) {
                this.ui = new GenerateUI("w-tab", { child: [this.#BarElement, this.#ContentElement] });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WBreadcrumbs extends UI {
        #SplitSign = ">";

        // 排序项
        sortItem() {
            forEnd(this.ui.$(">[w-item]"), (item, i) => { item.attr("w-index", i); });
        }

        // 渲染项分割符
        renderItemSplitSign() {
            forEnd(this.ui.$(">[w-item]"), (item) => { item.attr("w-split", this.#SplitSign); });
        }

        // 设置项分割符
        setItemSplitSign(sign = ">") {
            this.#SplitSign = sign || ">";
            this.renderItemSplitSign();
        }

        // 设置项路径
        setItemPath(path = []) {
            if (!Judge.isArray(path)) throw UI_Error.ParameterMismatch(path);
            this.ui.innerRemove();
            const arr = [];
            forEnd(path, item => {
                if (WItem.Is(item)) {
                    arr.push(item);
                } else if (Judge.isObject(item, "text", "src")) {
                    arr.push(createElement({
                        attribute: [["w-item"]],
                        child: [
                            createElement({
                                tagName: "img",
                                attribute: [["src", item.src]]
                            }),
                            createElement({
                                attribute: [["src", item.src], ["w-item"]],
                                text: item.text
                            })
                        ]
                    }));
                } else if (Judge.isString(item)) {
                    arr.push(createElement({
                        attribute: [["w-item"]],
                        text: item
                    }));
                } else {
                    throw UI_Error.ParameterMismatch(item);
                }
            });
            this.ui.append(...arr);
            this.sortItem();
            this.renderItemSplitSign();
            this.Callbacks.setItemPath(path);
        }

        // 设置禁用项
        setDisabledItem(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnItem(indexOrItem, this);
            bool ? item.attr("disabled") : item.removeAttr("disabled");
        }

        // 初始化
        #init() {
            this.sortItem();

            this.initUIConfig();

            this.ui.addEvent("click", (event) => {
                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!item || WItem.IsDisabled(item)) return;
                this.Callbacks.selectItem(item);
            });

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-breadcrumbs")) {
            super({
                delete: () => { },
                create: () => { },
                setItemPath: () => { },
                selectItem: () => { }
            }, (map) => {
                if (map.has("split")) this.setItemSplitSign(map.get("split"));
                if (map.has("path")) this.setItemPath(map.get("path").split(","));
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WSash extends UI {
        #This;
        #That;
        #CurrentPointer;
        #Width;
        #Height;
        #Limit = {
            min: 0,
            max: 0
        }

        // 设置布局
        setLayout(layoutDirection = WLayoutDirection.vertical) {
            if (!Judge.isValueInObject(layoutDirection, WLayoutDirection)) throw UI_Error.ParameterMismatch(layoutDirection);
            this.ui.attr("layout", layoutDirection);
        }

        // 设置限制
        setLimit(min = 0, max = 0) {
            this.#Limit.min = min;
            this.#Limit.max = max;
        }

        // 设置这
        setThis(element = HTMLElement) {
            if (!Judge.isHTMLElement(element)) throw UI_Error.ParameterMismatch(element);
            this.#This = element;
        }

        // 设置那
        setThat(element = HTMLElement) {
            if (!Judge.isHTMLElement(element)) throw UI_Error.ParameterMismatch(element);
            this.#That = element;
        }

        // 同时设置 这 那
        setThisThat(This = HTMLElement, That = HTMLElement) {
            this.setThis(This);
            this.setThat(That);
        }

        // 设置 ui 禁用
        setDisabled(bool = true) {
            if (bool) {
                this.ui.attr("disabled", "");
            } else {
                this.ui.removeAttr("disabled");
            }
        }

        #moveV = (event) => {
            const TargetElement = event.target;
            if (TargetElement !== this.ui && TargetElement.tagName.toLowerCase() === "iframe") {
                this.release(event);
                return;
            }
            if (event.pageX <= 1 || event.pageX >= MainWindow.offsetWidth - 5) return;
            const delta = event.pageX - this.#CurrentPointer;
            const result = this.#Width + delta;
            if (!this.Callbacks.move(result, WLayoutDirection.vertical)) {
                this.release(event);
                return;
            }
            if (result > this.#Limit.max || result < this.#Limit.min) {
                return;
            }
            this.#This.css("width", `${result}px`);
        }
        #moveH = (event) => {
            const TargetElement = event.target;
            if (TargetElement !== this.ui && TargetElement.tagName.toLowerCase() === "iframe") {
                this.release(event);
                return;
            }
            if (event.pageY <= 1 || event.pageY >= MainWindow.offsetHeight - 5) return;
            const delta = event.pageY - this.#CurrentPointer;
            const result = this.#Height - delta;
            if (!this.Callbacks.move(result, WLayoutDirection.horizontal)) {
                this.release(event);
                return;
            }
            if (result > this.#Limit.max || result < this.#Limit.min) {
                return;
            }
            this.#This.css("height", `${result}px`);
        }

        // 移除事件
        release = () => {
            this.#Width = 0; this.#Height = 0;
            document.removeEvent("mouseup", this.release);
            document.removeEvent("mousemove", this.#moveV);
            document.removeEvent("mousemove", this.#moveH);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.ui.addEvent("mousedown", (event) => {
                if (this.ui.attr("layout") === WLayoutDirection.vertical) {
                    this.#CurrentPointer = event.pageX;
                    if (this.#This) {
                        this.#Width = this.#This.rect().width;
                        document.addEvent("mousemove", this.#moveV);
                    }
                } else {
                    this.#CurrentPointer = event.pageY;
                    if (this.#This) {
                        this.#Height = this.#This.rect().height;
                        document.addEvent("mousemove", this.#moveH);
                    }
                }
                document.addEvent("mouseup", this.release);
            });

            if (this.ui.attr("layout") === WLayoutDirection.vertical) {
                this.setLayout();
            } else {
                this.setLayout(WLayoutDirection.horizontal);
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-sash")) {
            super({
                delete: () => { },
                create: () => { },
                move: () => true,
                dblclick: () => { }
            }, (map) => {
                if (map.has("limit")) {
                    const m = _ConfigValueToMap(map.get("limit"));
                    let min = 0, max = 0;
                    if (m.has("min")) min = parseInt(m.get("min"));
                    if (m.has("max")) max = parseInt(m.get("max"));
                    this.setLimit(min, max);
                }
                if (map.has("this")) this.setThis($(map.get("this")));
                if (map.has("that")) this.setThat($(map.get("that")));
                if (map.has("auto")) {
                    const parent = this.ui.parentNode;
                    this.setThis(parent.$(".w-this").first);
                    this.setThat(parent.$(".w-that").first);
                }
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WDropList extends UI {
        #TitleIconElement = createElement({ tagName: "img", classList: ["icon"] });
        #TitleTextElement = createElement({ classList: ["text"] });
        #TitleSignElement = createElement({ tagName: "i", classList: ["sign", "material-icons"], text: "\ue313" });
        #TitleElement = createElement({ classList: ["title"], child: [this.#TitleIconElement, this.#TitleTextElement, this.#TitleSignElement] });
        #ContentElement = createElement({ classList: ["w-list", "content", "w-son-ui"], callback: (content) => { new WList(content) } });

        // 列表元素
        getList() {
            return this.#ContentElement.Class;
        }

        // 设置标题文本
        setTitleText(text = "") {
            this.#TitleTextElement.textContent = text;
        }

        // 获取标题文本
        getTitleText() {
            return this.#TitleTextElement.textContent;
        }

        // 设置标题图标
        setTitleIcon(src = "") {
            if (src === "") {
                this.#TitleIconElement.css("display", "none");
            } else {
                this.#TitleIconElement.attr("src", src);
                this.#TitleIconElement.css("display", "block");
            }
        }

        // 设置显示状态
        setShowState(bool = true) {
            if (bool) {
                this.Callbacks.show();
                this.ui.attr("open", "");
            } else {
                this.Callbacks.close();
                this.ui.removeAttr("open");
            }
        }

        // 初始化
        #init() {
            Link.ListContainer(this, this.#ContentElement.Class);
            this.initUIConfig();
            this.#ContentElement.append(...this.ui.$(">[w-item]"));
            this.#ContentElement.Class.sortItem();

            this.#ContentElement.Class.Callbacks.selectItem = (item) => {
                this.Callbacks.selectItem(item);
                return true;
            }

            this.#TitleElement.eventSlot = (event) => {
                if (event.wEventName !== "click") return;
                this.setShowState(!this.ui.hasAttr("open"));
            }

            this.Callbacks.create();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                create: () => { },
                show: () => { },
                close: () => { },
                selectItem: () => { }
            }, (map) => {
                if (map.has("icon")) this.setTitleIcon(map.get("icon"));
                if (map.has("title")) this.setTitleText(map.get("title"));
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                this.ui.append(this.#TitleElement, this.#ContentElement);
            } else if (Judge.isNull(Element)) {
                this.ui = new GenerateUI("w-drop-list", { child: [this.#TitleElement, this.#ContentElement] });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WSelect extends UI {
        #RobustDisplay = true;
        #VitalEvent = null;

        #TitleIconElement = createElement({ tagName: "img", classList: ["icon"] });
        #TitleTextElement = createElement({ classList: ["text"] });
        #TitleSignElement = createElement({ tagName: "i", classList: ["sign", "material-icons"], text: "\ue313" });
        #TitleElement = createElement({ classList: ["title"], child: [this.#TitleIconElement, this.#TitleTextElement, this.#TitleSignElement] });
        #ContentElement = createElement({ classList: ["w-list", "content", "w-son-ui"], callback: (content) => { new WList(content) } });

        // 列表元素
        getList() {
            return this.#ContentElement.Class;
        }

        // 设置标题文本
        setTitleText(text = "") {
            this.#TitleTextElement.textContent = text;
        }

        // 获取选择值
        getValue() {
            return this.#TitleTextElement.textContent;
        }

        // 设置标题图标
        setTitleIcon(src = "") {
            if (src === "") {
                this.#TitleIconElement.css("display", "none");
            } else {
                this.#TitleIconElement.attr("src", src);
                this.#TitleIconElement.css("display", "block");
            }
        }

        // 通过字符串选择项
        selectTextItem(text = "") {
            if (!Judge.isString(text)) throw UI_Error.ParameterMismatch(text);
            forEnd(this.#ContentElement.Class.getItemAll(), item => {
                if (item.textContent === text) {
                    this.selectItem(parseInt(item.attr("w-index")));
                    return true;
                }
            });
        }

        // 设置显示状态
        setShowState(bool = true) {
            if (bool) {
                this.Callbacks.show();
                this.ui.attr("open", "");
            } else {
                this.Callbacks.close();
                this.ui.removeAttr("open");
            }
        }

        // 设置强壮显示
        setRobustDisplay(bool = true) {
            this.#RobustDisplay = TypeCast.toBoolean(bool);
        }

        // 初始化
        #init() {
            Link.ListContainer(this, this.#ContentElement.Class);
            this.initUIConfig(this, this.#ContentElement.Class);
            this.#ContentElement.append(...this.ui.$(">[w-item]"));
            this.#ContentElement.Class.sortItem();

            this.#ContentElement.Class.Callbacks.selectItem = (item) => {
                this.Callbacks.selectItem(item);

                this.setShowState(false);
                this.setTitleText(WItem.GetText(item));

                return true;
            }

            const fn = event => {
                const TargetElement = event.target;
                if (!this.ui.contains(TargetElement)) {
                    this.setShowState(false);
                    if (this.#VitalEvent) {
                        this.#VitalEvent.dispose();
                        this.#VitalEvent = null;
                    } else {
                        MainWindow.removeEvent("mousedown", fn);
                    }
                }
            }
            this.#TitleElement.eventSlot = (event) => {
                if (event.wEventName !== "click") return;
                const bool = !this.ui.hasAttr("open");
                this.setShowState(bool);
                if (bool && this.#RobustDisplay) {
                    if (this.#VitalEvent) {
                        this.#VitalEvent.dispose();
                        this.#VitalEvent = null;
                    }
                    this.#VitalEvent = new VitalEvent(this.ui, () => { MainWindow.addEvent("mousedown", fn); }, () => { MainWindow.removeEvent("mousedown", fn); });
                } else {
                    if (this.#VitalEvent) {
                        this.#VitalEvent.dispose();
                        this.#VitalEvent = null;
                    }
                }
            }

            this.Callbacks.create();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                create: () => { },
                show: () => { },
                close: () => { },
                selectItem: () => { }
            }, (map) => {
                if (map.has("icon")) this.setTitleIcon(map.get("icon"));
                if (map.has("title")) {
                    const m = _ConfigValueToMap(map.get("title"));
                    if (m.has("index")) {
                        const item = this.ui.$(">[w-item]")[parseInt(m.get("index"))];
                        WItem.RemoveSelectTagItem(this.ui);
                        if (item) {
                            WItem.SelectItem(item);
                            this.setTitleText(WItem.GetText(item));
                        }
                    }
                }
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                this.ui.append(this.#TitleElement, this.#ContentElement);
            } else if (Judge.isNull(Element)) {
                this.ui = new GenerateUI("w-select", { child: [this.#TitleElement, this.#ContentElement] });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WWidget extends UI {

        // 设置内容
        setContent(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.ui.innerRemove();
                this.ui.appendChild(view);
            } else if (Judge.isString(view)) {
                this.ui.innerRemove();
                this.ui.appendChild(createElement({
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.ui);
        }

        // 添加内容
        addContent(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.ui.appendChild(view);
            } else if (Judge.isString(view)) {
                this.ui.appendChild(createElement({
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.ui);
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-widget")) {
            super({
                delete: () => { },
                create: () => { },
                contextmenu: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WAppBar extends UI {
        #FixedState = false;

        #BarMoreElement = createElement({ tagName: "i", classList: ["more", "material-icons"], text: "\ue5d2" });
        #ContentIconElement = createElement({ tagName: "img", classList: ["icon"] });
        #ContentTitleElement = createElement({ classList: ["title"] });
        #ContentWidgetElement = createElement({ classList: ["widget", "w-son-ui"], callback: (widget) => { new WWidget(widget) } });
        #ContentElement = createElement({ classList: ["content"], child: [this.#ContentIconElement, this.#ContentTitleElement, this.#ContentWidgetElement] });

        // 获取 widget 元素
        getWidget() {
            return this.#ContentWidgetElement;
        }

        // 获取标题文本
        getTitleText() {
            return this.#ContentTitleElement.innerText;
        }

        // 设置标题文本
        setTitleText(text = "") {
            this.#ContentTitleElement.textContent = text;
        }

        // 设置标题
        setTitle(html = "") {
            this.#ContentTitleElement.innerHTML = html;
        }

        // 设置标题图标
        setTitleIcon(src = "") {
            if (src === "") {
                this.#ContentIconElement.css("display", "none");
            } else {
                this.#ContentIconElement.attr("src", src);
                this.#ContentIconElement.css("display", "block");
            }
        }

        // 设置显示状态
        setShowState(bool = true) {
            if (bool) {
                this.Callbacks.show();
                this.ui.attr("open", "");
            } else {
                this.Callbacks.close();
                this.ui.removeAttr("open");
            }
        }

        // 设置固定
        setFixed(bool = true) {
            this.#FixedState = bool;
        }

        // 设置更多按钮回调
        setMoreCallback(fn = () => { }) {
            this.#BarMoreElement.onclick = fn;
        }

        // 设置更多按钮可视性
        setMoreVisuality(bool = true) {
            if (bool) this.#BarMoreElement.css("display", "flex"); else this.#BarMoreElement.css("display", "none");
        }

        // 设置更多按钮位置
        setMorePlace(place = "left") {
            if (place !== "left" && place !== "right") throw UI_Error.ParameterMismatch(place);
            if (place === "left") {
                this.ui.attr("more", "left");
            } else {
                this.ui.attr("more", "right");
            }
        }

        #scrollDetection = (state = this.#FixedState) => {
            if (state) {
                MainWindow.css("margin-top", "55px");
                this.ui.attr("fixed", "");
                if (Body.scrollTop === 0) {
                    MainWindow.css("margin-top", "0px");
                    this.ui.removeAttr("fixed");
                }
            } else {
                MainWindow.css("margin-top", "0px");
                this.ui.removeAttr("fixed");
            }
        }

        // 初始化
        #init() {
            this.initUIConfig(this, this.#ContentElement.Class);
            this.setTitleText(this.ui.attr("app-title"));

            Body.addEvent("scroll", this.#scrollDetection);

            this.Callbacks.create();
        }

        constructor(Element = null) {
            super({
                delete: () => { Body.removeEventr("scroll", this.#scrollDetection) },
                create: () => { },
                show: () => { },
                close: () => { }
            }, (map) => {
                if (map.has("icon")) this.setTitleIcon(map.get("icon")); else this.setTitleIcon("");
                if (map.has("fixed")) this.setFixed();
                if (map.has("more")) {
                    this.setMoreCallback(window[map.get("more")]);
                }
                if (map.has("no-more")) {
                    this.setMoreVisuality(false);
                }
                if (map.has("style")) {
                    const m = _ConfigValueToMap(map.get("style"));
                    if (m.has("more") && m.get("more") === "right") {
                        this.setMorePlace("right");
                    } else {
                        this.setMorePlace();
                    }
                }
            });
            if (IsUIInit(this, Element)) return false;

            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                this.ui.append(this.#BarMoreElement, this.#ContentElement);
            } else if (Element === null) {
                this.ui = new GenerateUI("w-app-bar", { child: [this.#BarMoreElement, this.#ContentElement] });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WEventSlot extends UI {
        // 初始化
        #init() {
            this.initUIConfig();

            this.addAddEventSlot();

            this.Callbacks.create();
        }

        // 给所有 ui 添加事件槽
        addAddEventSlot() {
            forEnd(this.getAllUI(), ui => {
                ui.Class.addEventSlot(this.ui);
            });
        }

        // 移除所有 ui 的事件槽
        removeAllEventSlot() {
            forEnd(this.getAllUI(), ui => {
                ui.Class.removeEventSlot(this.ui);
            });
        }

        // 获取槽 id
        getSlotID() {
            return this.ui.attr("slot-id");
        }

        // 获取槽内的所有 ui
        getAllUI() {
            return this.ui.$("[w-ui]");
        }

        // 设置槽 id
        setSlotID(id = "") {
            this.ui.attr("slot-id", id);
        }

        // 添加监听事件
        addEvent(event = "") {
            forEnd(this.getAllUI(), ui => {
                if (ui.Class.Callbacks.hasOwnProperty(event)) {
                    ui.Class._Callbacks[event] = ui.Class.Callbacks[event];
                    const fn = ui.Class.Callbacks[event];
                    ui.Class.Callbacks[event] = (...args) => {
                        if (this.Callbacks.monitor(event, ui, [...args]))
                            fn(args);
                    }
                }
            });
        }

        // 移除监听事件
        removeEvent(event = "") {
            const InUI = this.ui.$("[w-ui]");
            forEnd(InUI, ui => {
                if (ui.Class.Callbacks.hasOwnProperty(event)) {
                    ui.Class.Callbacks[event] = ui.Class._Callbacks[event];
                    ui.Class._Callbacks[event] = null;
                }
            });
        }

        constructor(Element = new GenerateUI("w-event-slot")) {
            super({
                delete: () => { },
                create: () => { },
                monitor: () => true,
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WPaging extends UI {
        #UpElement = createElement({ tagName: "span", classList: ["material-icons", "up"], text: "\ue314" });
        #NumbersElement = createElement({ classList: ["w-list", "numbers", "w-son-ui"], callback: (list) => { new WList(list) } });
        #DownElement = createElement({ tagName: "span", classList: ["material-icons", "down"], text: "\ue315" });

        #InputElement = createElement({ tagName: "input", classList: ["w-edit", "input"], attribute: [["type", "number"], ["min", "1"], ["title", "1~?"]], callback: (input) => { new WEdit(input) } });
        #SkipButtonElement = createElement({ tagName: "button", classList: ["w-button", "button"], text: "跳转", callback: (btn) => { new WButton(btn) } });
        #SkipElement = createElement({ classList: ["skip"], child: [this.#InputElement, this.#SkipButtonElement] });

        #PageNumber = 1;
        #CurrentPageNumber = 1;

        // 设置数据大小和单页的数据大小
        setDataSize(size, pageSize) {
            this.#PageNumber = Math.ceil(size / pageSize);
            this.#InputElement.attr("title", `1~${this.#PageNumber}`);
            this.refresh();
        }

        // 跳转
        skip(number = 1) {
            if (number < 1) number = 1;
            if (number > this.#PageNumber) number = this.#PageNumber;
            this.Callbacks.skip(number);
            this.#CurrentPageNumber = number;
            this.refresh();
        }

        // 刷新
        refresh() {
            this.#NumbersElement.Class.removeItemAll();
            this.#NumbersElement.Class.addItems(Algorithm.getPaginationList(this.#CurrentPageNumber, this.#PageNumber));
            forEnd(this.#NumbersElement.Class.getItemAll(), item => {
                if (parseInt(item.innerText) === this.#CurrentPageNumber) item.addClass("select");
            });
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.ui.append(this.#UpElement, this.#NumbersElement, this.#DownElement, this.#SkipElement);

            this.#NumbersElement.Class.setCallback("selectItem", (item, target, event) => {
                event.stopPropagation();
                this.skip(parseInt(item.innerText));
                return false;
            });

            this.#SkipButtonElement.Class.setCallback("click", () => {
                this.skip(parseInt(this.#InputElement.value));
                this.#InputElement.value = "";
                this.#SkipButtonElement.removeClass("show");
            });

            this.#UpElement.eventSlot = (event) => {
                if (event.wEventName === "click") this.skip(parseInt(this.#CurrentPageNumber) - 1);
            }
            this.#DownElement.eventSlot = (event) => {
                if (event.wEventName === "click") this.skip(parseInt(this.#CurrentPageNumber) + 1);
            }

            this.#InputElement.Class.setCallback("input", () => {
                if (Judge.isEmptyString(this.#InputElement.value))
                    this.#SkipButtonElement.removeClass("show");
                else
                    this.#SkipButtonElement.addClass("show");
            });

            this.skip();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-paging")) {
            super({
                delete: () => { },
                create: () => { },
                skip: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WTreeList extends UI {
        #AccurateFold = false;
        #SeriesTrigger = false;
        #RootData = [];

        #createNodeItem(text = "", idKey = null) {
            const indent = createElement({ classList: ["indent"] });

            const item = createElement({
                attribute: [["w-item"]],
                child: [
                    indent,
                    createElement({ classList: ["twistie"], text: "\ue315" }),
                    createElement({ tagName: "span", classList: ["text"], textContent: text || "" })
                ]
            });

            const node = {
                element: item,
                state: false,
                child: []
            }
            idKey && (node["id-key"] = idKey);
            return node;
        }

        #findElementById(id, callback = () => { }) {
            const fn = (data) => {
                return forEnd(data, (item, i) => {
                    if (item.dataId === id) {
                        callback(item, i, data);
                        return true;
                    }
                    if (item.child && item.child.length > 0) {
                        let found = fn(item.child);
                        if (found) return found;
                    }
                });
            }
            fn(this.#RootData);
        }

        // 设置连续触发
        setSeriesTrigger(bool = false) {
            this.#SeriesTrigger = TypeCast.toBoolean(bool);
        }

        // 设置精准折叠
        setAccurateFold(bool = true) {
            this.#AccurateFold = TypeCast.toBoolean(bool);
            this.#AccurateFold ? this.ui.attr("accurate-fold", "") : this.ui.removeAttr("accurate-fold");
        }

        // 设置项拖拽
        setItemDraggable(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            bool ? item.attr("draggable", "true") : item.removeAttr("draggable", "false");
        }

        // 设置项固定
        setItemFixed(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            bool ? item.addClass("fixed") : item.removeClass("fixed");
        }

        // 返回项数量
        itemSize() {
            return this.getItemAll().length;
        }

        // 通过索引获取项
        getItem(index = 0) {
            return this.getItemAll()[index];
        }

        // 获取所有项
        getItemAll() {
            return this.ui.$(">[w-item]");
        }

        // 获取选中的项
        getSelectItem() {
            return this.ui.$(">.select").first;
        }

        // 获取选中的项数据ID
        getSelectItemDataID() {
            const item = this.getSelectItem();
            if (item) return parseInt(item.attr("data-id"));
            return null;
        }

        // 获取禁用的项
        getDisabledItem() {
            return this.ui.$(">[disabled]");
        }

        // 获取数据
        getData() {
            const data = [];
            const fn = (arr = [], node = []) => {
                forEnd(arr, selector => {
                    const obj = {};
                    obj["text"] = selector["element"].$(".text").first.textContent;
                    if (selector["element"].hasAttr("id-key")) obj["id-key"] = selector["element"].attr("id-key");
                    if (selector["child"].length >= 1) {
                        obj["child"] = [];
                        fn(selector["child"], obj["child"]);
                    }
                    node.push(obj);
                });
            };
            fn(this.#RootData, data);
            return data;
        }

        // 排序项
        sortItem() {
            forEnd(this.ui.$(">[w-item]"), (item, i) => { item.attr("w-index", i); });
        }

        // 清除选择项
        clearSelectItem() {
            WItem.RemoveSelectTagItem(this.ui);
        }

        // 根据索引或者项移除项
        removeItem(indexOrItem = 0) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);

            this.#findElementById(parseInt(item.attr("data-id")), (e, i, data) => {
                item.remove();
                data.splice(i, 1);
            });

            this.Callbacks.removeItem(item);
            this.fastRender();
        }

        // 添加项
        addItem(item = "", idKey = null) {
            if (Judge.isString(item) || Judge.isNumber(item)) {
                this.#RootData.push(this.#createNodeItem(item, idKey));
            } else {
                throw UI_Error.ParameterMismatch(item);
            }

            this.Callbacks.addItem(item);
            this.render();
        }

        // 添加子项
        addChildItem(item = "", id = 1, idKey = null) {
            if (Judge.isString(item) || Judge.isNumber(item)) {
                this.#findElementById(id, parent => {
                    parent["child"].push(this.#createNodeItem(item, idKey));
                    parent["state"] = true;
                });
            } else {
                throw UI_Error.ParameterMismatch(item);
            }

            this.Callbacks.addItem(item);
            this.render();
        }

        // 在项之后插入项
        insertItem(item = 0, target = 0) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insert", v1, v2)) return;
            let moveItem;
            this.#findElementById(parseInt(v1.attr("data-id")), (item, i, data) => {
                moveItem = data.splice(i, 1);
            });
            let arr, index;
            this.#findElementById(parseInt(v2.attr("data-id")), (item, i, data) => {
                arr = data;
                index = i;
            });
            if (arr[index + 1])
                arr.splice(index + 1, 0, moveItem[0]);
            else
                arr.push(moveItem[0]);
            this.render();
        }

        // 在项之前插入项
        insertBeforeItem(item = 0, target = 0) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insertBefore", v1, v2)) return;

            let moveItem;
            this.#findElementById(parseInt(v1.attr("data-id")), (item, i, data) => {
                moveItem = data.splice(i, 1);
            });
            let arr, index;
            this.#findElementById(parseInt(v2.attr("data-id")), (item, i, data) => {
                arr = data;
                index = i;
            });
            arr.splice(index, 0, moveItem[0]);
            this.render();
        }

        // 交换项
        swapItem(item = 0, target = 0) {
            const v1 = WItem.ReturnItem(item, this), v2 = WItem.ReturnItem(target, this);

            if (!this.Callbacks.swapItem("swap", v1, v2)) return;

            const t1 = v1.$(".text").first.textContent, t2 = v2.$(".text").first.textContent;

            this.#findElementById(parseInt(v1.attr("data-id")), item => {
                item.element.$(".text").first.textContent = t2;
            });
            this.#findElementById(parseInt(v2.attr("data-id")), item => {
                item.element.$(".text").first.textContent = t1;
            });
        }

        // 设置项
        setItemContent(indexOrItem = 0, content = "") {
            if (!Judge.isString(content)) throw UI_Error.ParameterMismatch(content);
            const item = WItem.ReturnItem(indexOrItem, this);
            item.$(".text").first.textContent = content;
        }

        // 设置禁用项
        setDisabledItem(indexOrItem = 0, bool = true) {
            const item = WItem.ReturnItem(indexOrItem, this);
            bool ? item.attr("disabled") : item.removeAttr("disabled");
        }

        // 选择项
        selectItem(indexOrItem = 0) {
            const item = WItem.ReturnItem(indexOrItem, this);
            return eventTrigger(item, WEvent.click);
        }

        // 加载数据
        loadData(treeData = [], isRender = false) {
            if (!Judge.isArray(treeData)) throw UI_Error.ParameterMismatch(`${treeData} Not Array`);
            this.#RootData = [];
            const fn = (arr, root = this.#RootData) => {
                forEnd(arr, obj => {
                    const node = this.#createNodeItem(obj.text);
                    node["id-key"] = obj["id-key"] || "";
                    root.push(node);

                    const child = obj["child"];
                    if (Judge.isArray(child) && child.length > 0) {
                        fn(child, node["child"]);
                    }
                });
            }
            fn(treeData);
            this.ui.innerClear();
            isRender && this.render();
        }

        // 快速渲染
        fastRender() {
            let index = 0;
            const fn_init = (data, indentLevel = 0, parent = 0) => {
                forEnd(data, obj => {
                    index++;
                    obj.element.attr("id-key", obj["id-key"] || "");
                    obj.element.attr("data-id", index);
                    obj.element.attr("parent-id", parent);
                    obj.element.$(".indent").first.css("width", `${indentLevel}px`);
                    obj["dataId"] = index;

                    if (obj.child) {
                        obj.child.length > 0 ? obj.element.addClass("parent") : obj.element.removeClass("parent");
                        fn_init(obj.child, indentLevel + 16, index);
                    }
                });
            }
            fn_init(this.#RootData);

            const fn = (data, state = null) => {
                forEnd(data, obj => {
                    if (!Judge.isNull(state)) {
                        (obj.element.hasClass("parent")) && (obj.state ? obj.element.addClass("open") : obj.element.removeClass("open"));
                        if (state) {
                            obj.element.addClass("show");
                            fn(obj.child, obj.state);
                        } else {
                            obj.element.removeClass("show");
                            fn(obj.child, false);
                        }
                    } else {
                        obj.state ? obj.element.addClass("open") : obj.element.removeClass("open");
                        fn(obj.child, obj.state);
                    }
                });
            }
            fn(this.#RootData);
        }

        // 渲染
        render() {
            this.fastRender();

            const Fragment = [];
            const fn = (data) => {
                forEnd(data, obj => {
                    Fragment.push(obj.element);
                    if (obj.child) fn(obj.child);
                });
            }
            fn(this.#RootData);

            this.ui.appendFragment(Fragment);
            this.sortItem();
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.ui.addEvent("click", event => {
                let TargetElement = event.target;
                let ChangeCondition = true;
                if (this.#AccurateFold) {
                    if (TargetElement.hasClass("twistie")) TargetElement = TargetElement.parentNode;
                    else ChangeCondition = false;
                }
                if (!this.ui.contains(TargetElement) || TargetElement === this.ui || !this.Callbacks.selectItem(TargetElement, parseInt(TargetElement.attr("data-id")))) return;

                if (TargetElement.hasClass("parent") && ChangeCondition) {
                    this.#findElementById(parseInt(TargetElement.attr("data-id")), item => { item.state = !item.state; });
                    this.fastRender();
                }

                if (!this.#SeriesTrigger) {
                    const si = this.getSelectItem();
                    if (si && WItem.GetIndex(si) === WItem.GetIndex(TargetElement)) return;
                }

                WItem.RemoveSelectTagItem(this.ui);
                WItem.SelectItem(TargetElement);
                this.Callbacks.selectItemChange(TargetElement, parseInt(TargetElement.attr("data-id")), TargetElement.$(".text").first.textContent);
            });
            this.ui.addEvent("contextmenu", (event) => {
                const TargetElement = event.target;
                this.Callbacks.contextMenu(event, TargetElement);
            });

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-tree-list")) {
            super({
                delete: () => { },
                create: () => { },
                addItem: () => { },
                removeItem: () => { },
                selectItem: () => true,
                selectItemChange: () => { },
                contextMenu: () => { },
                swapItem: () => true
            }, (map) => {
                if (map.has("accurateFold")) this.setAccurateFold();
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WSwitch extends InputUI2 {
        // 初始化
        #init() {
            this.initUIConfig();

            this.ui.attr("type", "checkbox");

            this.ui.eventSlot = (event) => {
                if (event.wEventName === "click") {
                    if (this.Callbacks.click(this.getState())) {
                        this.Callbacks.stateChange(this.getState());
                    } else {
                        this.setState(!this.getState());
                    }
                }
            }

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-switch")) {
            super({
                delete: () => { },
                create: () => { },
                click: () => true,
                stateChange: () => { }
            }, (map) => {
                if (map.has("readOnly")) this.setReadOnly();
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WProgress extends UI {
        #SliderElement = createElement({ classList: ["slider"] });
        #BarElement = createElement({ classList: ["bar"], child: this.#SliderElement });
        #InputElement = createElement({ tagName: "input", classList: ["input"], attribute: [["type", "range"]] });

        #Max = 100;

        // 设置进度条宽度
        #setBarWidth() {
            this.#BarElement.css("width", `${Algorithm.calculatePercentage(this.getValue(WVarType.number), this.#Max) || 0}%`);
        }

        // 设置滑块可视性
        setSlider(bool = false) {
            if (bool) {
                this.#SliderElement.css("opacity", "1");
            } else {
                this.#SliderElement.css("opacity", "0");
            }
        }

        // 获取值
        getValue(returnType = WVarType.string) {
            if (returnType === WVarType.string) {
                return this.#InputElement.value;
            } else if (returnType === WVarType.number) {
                return parseInt(this.#InputElement.value);
            } else if (returnType === WVarType.float) {
                return parseFloat(this.#InputElement.value);
            } else throw UI_Error.ParameterMismatch(returnType);
        }

        // 设置只读
        setReadOnly(bool = true) {
            bool ? this.#InputElement.attr("readonly", "") : this.#InputElement.removeAttr("readonly");
        }

        // 是否只读
        isReadOnly() {
            return this.#InputElement.hasAttr("readonly");
        }

        // 设置值
        setValue(value) {
            this.#InputElement.value = value;
            this.#setBarWidth();
        }

        // 设置最大值
        setMaxValue(value) {
            this.#Max = parseInt(value);
            this.#InputElement.attr("max", value);
        }

        // 清空值
        removeValue() {
            this.#InputElement.value = 0;
            this.#BarElement.css("width", "0%");
        }

        // 添加值
        appValue(value) {
            this.#InputElement.value = parseInt(this.#InputElement.value) + parseInt(value);
            this.#setBarWidth();
        }

        // 设置 ui 禁用
        setDisabled(bool = true) {
            bool ? this.#InputElement.attr("disabled", "") : this.#InputElement.removeAttr("disabled");
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.#InputElement.addEvent("input", () => {
                this.#setBarWidth();
            });
            this.#setBarWidth();

            this.Callbacks.create();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                create: () => { }
            }, (map) => {
                if (map.has("slider")) this.setSlider(TypeCast.strToBool(map.get("slider")));
                if (map.has("readOnly")) this.setReadOnly();
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                this.ui.append(this.#InputElement, this.#BarElement);
            } else if (Element === null) {
                this.ui = new GenerateUI("w-progress", { child: [this.#InputElement, this.#SliderElement, this.#BarElement] });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WLabel extends UI {
        // 设置文本
        setText(text = "") {
            this.ui.textContent = text;
        }

        setHtml(html = "") {
            this.ui.innerHTML = html;
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.Callbacks.create();
        }

        constructor(Element = new GenerateUI("w-label", { tagName: "label" })) {
            super({
                delete: () => { },
                create: () => { }
            }, (map) => {
            });
            if (IsUIInit(this, Element)) return false;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    //=======================================================================//

    class WScope {
        #Observer = null;

        #GetElementAll(callback = () => { }) {
            const uis = this.ui.$("[w-class-name]");
            const result = this.ui.hasAttr("w-sync-class-name");
            forEnd(uis, ui => {
                const name = ui.attr("w-class-name");
                if (result && !ui.hasClass(name)) ui.addClass(name);
                callback(ui, name);
            });
        }

        #Refresh$ui() {
            this.$ui = {};
            this.#GetElementAll((ui, name) => {
                this.$ui[name] = ui;
            });
        }

        #Refresh$uiClass() {
            this.$uiClass = {};
            this.#GetElementAll((ui, name) => {
                ui.Class && (this.$uiClass[name] = ui.Class);
            });
        }

        get$ui(fn = () => { }) {
            fn(this.$ui);
        }

        get$uiClass(fn = () => { }) {
            fn(this.$uiClass);
        }

        // 初始化
        #init() {
            anewRender(this.ui);
            this.#Refresh$ui();
            this.#Refresh$uiClass();

            const callback = (mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach(node => {
                            if (node.hasAttr && node.hasAttr("winit")) {
                                this.#Refresh$ui();
                                this.#Refresh$uiClass();
                            }
                        });
                        mutation.removedNodes.forEach(node => {
                            if (node.hasAttr && node.hasAttr("winit") && node.hasAttr("w-class-name")) {
                                const name = node.attr("w-class-name");
                                delete this.$uiClass[name];
                                delete this.$ui[name];
                            }
                        });
                    }
                }
            };
            this.#Observer = new MutationObserver(callback);
            this.#Observer.observe(this.ui, { childList: true, subtree: true });
        }

        constructor(Element = new GenerateUI("", { attribute: "w-scope" })) {
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
                if (!this.ui.hasAttr("w-scope") || this.ui.attr("w-scope") !== "") return;
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.ui.attr("w-scope", "init");
            this.#init();
        }
    }

    //=======================================================================//

    class Dialog extends WidgetUI {
        #DraggableClass;

        #View = {
            titleIcon: createElement({
                tagName: "img",
                classList: ["icon"],
                attribute: [["draggable", "false"]]
            }),
            titleText: createElement({
                tagName: "h1",
                classList: ["text"],
            }),
            titleBtn: null,
            title: createElement({
                classList: ["title"]
            }),

            content: createElement({
                classList: ["content"],
            }),
            bottom: createElement({
                classList: ["bottom"],
            }),
        };

        getView() {
            return this.#View;
        }

        // 设置拖动区域
        setDraggableLimit(limit) {
            this.#DraggableClass.updateLimit(limit);
        }

        // 设置标题图标
        setTitleIcon(src = "") {
            if (src === "") {
                this.#View.titleIcon.css("display", "none");
                this.#View.titleIcon.src = "";
            } else {
                this.#View.titleIcon.css("display", "block");
                this.#View.titleIcon.src = src;
            }
        }

        // 设置窗口操作
        setWindowOperation(operation = WWindowOperation.default) {
            if (!Judge.isValueInObject(operation, WWindowOperation)) throw UI_Error.ParameterMismatch(operation);
            this.ui.removeClass([
                "w-resize-none",
                "w-resize-both",
                "w-resize-horizontal",
                "w-resize-vertical"
            ]);
            this.ui.addClass(`w-resize-${operation}`);
        }

        // 设置全屏
        setFullScreen(bool = true) {
            this.ui.attr("full-screen", bool);
        }

        // 显示
        show(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.show();
            this.#initPosition(position);
        }

        // 模态显示
        showModal(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.showModal();
            this.#initPosition(position);
        }

        // 设置坐标 x
        setX(x) {
            if (this.#DraggableClass) {
                this.#DraggableClass.setTransformX(x);
            } else {
                this.ui.css({ left: `${x}px` });
            }
        }

        // 设置坐标 y
        setY(y) {
            if (this.#DraggableClass) {
                this.#DraggableClass.setTransformY(y);
            } else {
                this.ui.css({ top: `${y}px` });
            }
        }

        // 设置内容
        setContent(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.#View.content.innerRemove();
                view.addClass("content");
                this.#View.content.appendChild(view);
            } else if (Judge.isString(view)) {
                this.#View.content.innerRemove();
                this.#View.content.appendChild(createElement({
                    attribute: ["w-view"],
                    classList: ["content"],
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.#View.content);
        }

        // 设置底部
        setBottom(view = "", isRender = true) {
            if (Judge.isHTMLElement(view)) {
                this.#View.bottom.innerRemove();
                view.addClass("bottom");
                this.#View.bottom.appendChild(view);
            } else if (Judge.isString(view)) {
                this.#View.bottom.innerRemove();
                this.#View.bottom.appendChild(createElement({
                    attribute: ["w-view"],
                    classList: ["bottom"],
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.#View.bottom);
        }

        // 设置信息
        setMessage(msg) {
            if (!Judge.isCustomType(LevelMessage, msg)) throw UI_Error.ParameterMismatch(msg);
            this.#View.content.innerRemove();
            let htmlicon = "&#xe315;";
            if (msg.level() === "inquiry") {
                htmlicon = "&#xe8fd;";
            } else if (msg.level() === "warning") {
                htmlicon = "&#xe002;";
            }
            this.#View.content.appendChild(createElement({
                attribute: [["w-view"], ["message-level", msg.level()]],
                classList: ["content"],
                child: [
                    createElement({
                        classList: ["icon"],
                        html: htmlicon
                    }),
                    createElement({
                        classList: ["text"],
                        text: msg.message()
                    })
                ]
            }));
        }

        // 设置回调按钮
        setCallbackButton(callbackButton) {
            if (!Judge.isArray(callbackButton)) throw UI_Error.ParameterMismatch(callbackButton);
            this.#View.bottom.innerRemove();
            forEnd(callbackButton, btn => {
                const button = createElement({
                    tagName: "button",
                    classList: ["w-button", "callback-button"],
                    text: btn[0],
                    callback: btn => { new WButton(btn) }
                });
                this.#View.bottom.appendChild(button);
                button.Class.setCallback("click", (event) => {
                    if (btn[1](event)) this.delete();
                });
            });
        }

        // 初始化窗口出现位置
        #initPosition(position) {
            const wH = MainWindow.rect().height;
            const wW = MainWindow.rect().width;
            const uH = this.ui.rect().height;
            const uW = this.ui.rect().width;
            if (position === 0) {
                this.setXY(0, 0);
            } else if (position === 1) {
                this.setXY(0, wH / 2 - uH / 2);
            } else if (position === 2) {
                this.setXY(0, wH - uH);
            } else if (position === 3) {
                this.setXY(wW / 2 - uW / 2, 0);
            } else if (position === 4) {
                this.setXY(wW / 2 - uW / 2, wH / 2 - uH / 2);
            } else if (position === 5) {
                this.setXY(wW / 2 - uW / 2, wH - uH);
            } else if (position === 6) {
                this.setXY(wW - uW, 0);
            } else if (position === 7) {
                this.setXY(wW - uW, wH / 2 - uH / 2);
            } else if (position === 8) {
                this.setXY(wW - uW, wH - uH);
            } else {
                throw UI_Error.ParameterMismatch(position);
            }
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            limit = {},
            iconSrc = "",
            title = "",
            content = "",
            bottom = "",
            message = null,
            width = 300,
            height = 200,
            minWidth = 300,
            minHeight = 200,
            maxWidth = MAX_WIDTH,
            maxHeight = MAX_HEIGHT,
            windowOperation = WWindowOperation.default,
            callbackButton = [],
            draggable = true,
            flags = WindowFlags.Get(WindowFlags.MinButtonHint | WindowFlags.RestoreButtonHint),
            render = false
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);

            this.#View.titleBtn = flags;
            this.#View.titleText.textContent = title;
            this.#View.title.append(this.#View.titleIcon, this.#View.titleText, this.#View.titleBtn);

            if (message === null) {
                this.setContent(content);
            } else {
                this.setMessage(message);
            }

            this.setBottom(bottom);
            this.setCallbackButton(callbackButton);
            this.setHeight(height);
            this.setWidth(width);
            this.seMinWidth(minWidth);
            this.setMinHeight(minHeight);
            this.setMaxWidth(maxWidth);
            this.setMaxHeight(maxHeight);
            this.setTitleIcon(iconSrc);
            this.setWindowOperation(windowOperation);

            this.#View.titleBtn.ClickEvent = (eventName) => {
                this.Callbacks.titleButton(eventName);
            }

            this.ui.removeAttr("open");

            parent.appendFragment(this.ui);
            if (draggable) {
                this.#DraggableClass = new AddDraggable({
                    element: this.#View.titleText,
                    effectElement: this.ui,
                    fn: this.Callbacks.draggable,
                });
                this.setDraggableLimit(limit);
            }
            if (render) anewRender(this.ui);
            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                close: () => { },
                titleButton: (eventName) => {
                    if (eventName === "close") this.delete()
                },
                draggable: () => true
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-dialog", {
                    tagName: "dialog",
                    child: [this.#View.title, this.#View.content, this.#View.bottom]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class Activity extends WidgetUI {
        // 显示
        show(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.show();
            this.#initPosition(position);
        }

        // 模态显示
        showModal(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.showModal();
            this.#initPosition(position);
        }

        // 初始化窗口出现位置
        #initPosition(position) {
            const wH = MainWindow.rect().height;
            const wW = MainWindow.rect().width;
            const uH = this.ui.rect().height;
            const uW = this.ui.rect().width;
            if (position === 0) {
                this.setXY(0, 0);
            } else if (position === 1) {
                this.setXY(0, wH / 2 - uH / 2);
            } else if (position === 2) {
                this.setXY(0, wH - uH);
            } else if (position === 3) {
                this.setXY(wW / 2 - uW / 2, 0);
            } else if (position === 4) {
                this.setXY(wW / 2 - uW / 2, wH / 2 - uH / 2);
            } else if (position === 5) {
                this.setXY(wW / 2 - uW / 2, wH - uH);
            } else if (position === 6) {
                this.setXY(wW - uW, 0);
            } else if (position === 7) {
                this.setXY(wW - uW, wH / 2 - uH / 2);
            } else if (position === 8) {
                this.setXY(wW - uW, wH - uH);
            } else {
                throw UI_Error.ParameterMismatch(position);
            }
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            content = "",
            width = 300,
            height = 200,
            minWidth = 300,
            minHeight = 200,
            maxWidth = MAX_WIDTH,
            maxHeight = MAX_HEIGHT,
            x = 0,
            y = 0,
            render = true
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);

            this.setContent(content);
            this.setHeight(height);
            this.setWidth(width);
            this.seMinWidth(minWidth);
            this.setMinHeight(minHeight);
            this.setMaxWidth(maxWidth);
            this.setMaxHeight(maxHeight);

            this.setXY(x, y);

            this.ui.removeAttr("open");

            parent.appendFragment(this.ui);

            if (render) {
                anewRender(this.ui);
            }

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                close: () => { }
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-activity", {
                    tagName: "dialog"
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class Drawer extends WidgetUI2 {
        // 设置出现方向
        setDirection(direction) {
            if (!Judge.isValueInObject(direction, WDirection)) throw UI_Error.ParameterMismatch(direction);
            this.ui.attr("direction", direction);
        }

        // 获取 ui 出现方向
        getDirection() {
            return this.ui.attr("direction");
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            content = "",
            direction = WDirection.Bottom
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);

            this.setContent(content);
            this.setDirection(direction);

            this.ui.removeAttr("open");



            parent.appendFragment(this.ui);

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                close: () => {
                    this.ui.showModal();
                    switch (this.getDirection()) {
                        case "bottom":
                            elementAnimation(this.ui, "WebGUIPro-appear-bottom-to-top .2s reverse forwards", () => { this.delete() });
                            break;
                        case "top":
                            elementAnimation(this.ui, "WebGUIPro-appear-top-to-bottom .2s reverse forwards", () => { this.delete() });
                            break;
                        case "right":
                            elementAnimation(this.ui, "WebGUIPro-appear-left-to-right .2s reverse forwards", () => { this.delete() });
                            break;
                        case "left":
                            elementAnimation(this.ui, "WebGUIPro-appear-right-to-left .2s reverse forwards", () => { this.delete() });
                            break;
                        default: this.delete(); break;
                    }
                }
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-drawer", {
                    tagName: "dialog"
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class Floating extends WidgetUI {
        #DraggableClass;

        // 设置拖动区域
        setDraggableLimit(limit) {
            this.#DraggableClass.updateLimit(limit);
        }

        // 设置坐标 x
        setX(x) {
            if (this.#DraggableClass) {
                this.#DraggableClass.setTransformX(x);
            } else {
                this.ui.css({ left: `${x}px` });
            }
        }

        // 设置坐标 y
        setY(y) {
            if (this.#DraggableClass) {
                this.#DraggableClass.setTransformY(y);
            } else {
                this.ui.css({ top: `${y}px` });
            }
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            limit = {},
            content = "",
            width = 100,
            height = 100,
            minWidth = 100,
            minHeight = 100,
            maxWidth = MAX_WIDTH,
            maxHeight = MAX_HEIGHT,
            draggable = true,
            draggableElement = this.ui
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);

            this.setContent(content);
            this.setHeight(height);
            this.setWidth(width);
            this.seMinWidth(minWidth);
            this.setMinHeight(minHeight);
            this.setMaxWidth(maxWidth);
            this.setMaxHeight(maxHeight);

            this.ui.removeAttr("open");

            parent.appendFragment(this.ui);
            if (draggable) {
                this.#DraggableClass = new AddDraggable({
                    element: draggableElement,
                    effectElement: this.ui,
                    fn: this.Callbacks.draggable
                });
                this.setDraggableLimit(limit);
            }

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                close: () => { },
                draggable: () => true
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-floating", {
                    tagName: "dialog"
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class Message extends UI2 {
        #View = {
            icon: createElement({
                tagName: "img",
                classList: ["icon"],
                attribute: [["draggable", "false"]]
            }),

            title: createElement({
                tagName: "h1",
                classList: ["title"],
            }),
            text: createElement({
                classList: ["text"]
            }),

            content: createElement({
                classList: ["content"],
            }),

            message: createElement({
                classList: ["message"],
            }),

            messageBox: createElement({
                classList: ["message-box"],
            })
        };

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            content = "",
            title = "",
            iconSrc = "",
            place = WPlace.Center.Bottom,
            level = WEventLevel.normal,
            time = 2000
        } = {}) {
            this.ui.attr("event-id", eventID);
            this.#View.message.attr("level", level);

            this.#View.content.append(this.#View.title, this.#View.text);
            this.#View.message.append(this.#View.icon, this.#View.content);

            this.#View.text.textContent = content;
            this.#View.title.textContent = title;
            if (iconSrc === "") {
                this.#View.icon.css("display", "none");
                this.#View.icon.src = "";
            } else {
                this.#View.icon.css("display", "block");
                this.#View.icon.src = iconSrc;
            }

            setTimeout(() => {
                this.Callbacks.remove(this.#View.message);
            }, time);

            const existUI = $(`[event-id="${eventID}"]`).first;
            if (existUI) {
                this.ui = existUI;
                this.ui.$(">.message-box").first.appendChild(this.#View.message);
            } else {
                this.ui.attr("place", TypeCast.analysisPlace(place, true));
                this.#View.messageBox.appendChild(this.#View.message);
                parent.appendFragment(this.ui);
            }
            this.ui.scrollTo(0, this.ui.rect().height);

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                remove: message => {
                    elementAnimation(message, "WebGUIPro-scale-opacity .3s reverse forwards", () => {
                        message.remove();
                        if (!this.ui.$(">.message-box").first.firstElementChild) this.delete();
                    });
                }
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-message", {
                    //tagName: "dialog",
                    child: this.#View.messageBox
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class ContextMenu extends WidgetUI3 {
        #List = createElement({
            classList: ["w-list"],
            callback: list => { new WList(list) }
        });
        #TimeId;

        // 创建项
        #createItem(item = "" || {}) {
            const icon = createElement({ classList: ["icon"] });
            const text = createElement({ classList: ["text"] });
            const key = createElement({ classList: ["key"] });
            const more = createElement({ classList: ["more", "material-icons"], html: "&#xe315;" });

            icon.attr("none", "");
            key.attr("none", "");
            more.attr("none", "");

            const left = createElement({ classList: ["left"], child: [icon, text] });
            const right = createElement({ classList: ["right"], child: [key, more] });

            const itemElement = createElement({
                attribute: [["w-item"]],
                classList: ["item"],
                child: [left, right]
            });
            if (Judge.isObject(item)) {
                text.textContent = item.text;

                item.icon && (icon.removeAttr("none") && icon.attr("src", item.icon));
                item.key && (key.removeAttr("none") && (key.textContent = item.key));
                item.callback && (itemElement.eventSlot = (event) => {
                    if (event.wEventName === "click") {
                        this.Callbacks.click(itemElement);
                        item.callback(event);
                    }
                });

                item.more && more.removeAttr("none");
            } else if (Judge.isString(item)) {
                text.textContent = item;
            } else if (Judge.isNull(item)) {
                return createElement({ attribute: [["w-item"]], classList: ["split"] })
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
            return itemElement;
        }

        // 添加项 
        addItem(item = "" || {}) {
            this.#List.Class.addItem(this.#createItem(item));
        }

        // 添加多项 
        addItems(items = []) {
            if (Judge.isArray(items)) {
                forEnd(items, obj => {
                    this.#List.Class.addItem(this.#createItem(obj), false);
                });
                this.#List.Class.sortItem();
            } else {
                throw UI_Error.ParameterMismatch(items);
            }
        }

        // 设置内容
        setContent(items = "" || []) {
            if (Judge.isArray(items)) {
                this.#List.Class.removeItemAll();
                this.addItems(items);
            } else if (Judge.isString(items)) {
                this.#List.Class.removeItemAll();
                this.addItem(items);
            } else {
                throw UI_Error.ParameterMismatch(items);
            }
        }

        setXY(x, y) {
            clearTimeout(this.#TimeId);
            this.#TimeId = setTimeout(() => {
                const { width: w, height: h } = this.parent.rect();
                const { width: ew, height: eh } = this.ui.rect();
                if (y + eh >= h) y = h - eh;
                if (x + ew >= w) x = w - ew;
                if (y <= 0) y = 0;
                if (x <= 0) x = 0;
                this.setX(x);
                this.setY(y);
            }, 0);
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            items = {},
            x = 0,
            y = 0
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);
            this.parent = parent;

            this.setContent(items);

            this.ui.removeAttr("open");
            this.parent.appendFragment(this.ui);
            this.setXY(x, y);

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                click: () => { },
                close: () => { }
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-contextmenu", {
                    tagName: "dialog",
                    child: this.#List
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    class Animation extends UI2 {
        // 关闭动画
        close() {
            this.ui.css("display", "none");
        }

        // 显示动画
        show() {
            this.ui.css("display", "flex");
        }

        // 设置窗口模式
        setWindowModel(windowModel = WWindowModel.fullscreen) {
            if (!Judge.isValueInObject(windowModel, WWindowModel)) throw UI_Error.ParameterMismatch(windowModel);
            this.ui.attr("window-model", windowModel);
        }

        // 加载图像
        loadImage(src = "") {
            const img = createElement({
                tagName: "img",
                attribute: [["src", src]],
                classList: ["image"]
            });
            this.ui.innerRemove();
            this.ui.appendChild(img);
        }

        // 初始化
        #init({
            parent = MainWindow,
            eventID = generateUniqueId(),
            windowModel = WWindowModel.fullscreen
        } = {}) {
            uniquenessElement($(`[event-id="${eventID}"]`));
            this.ui.attr("event-id", eventID);

            this.setWindowModel(windowModel);

            parent.appendFragment(this.ui);

            this.Callbacks.create();
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                create: () => { },
                remove: () => { }
            });
            if (Judge.isObject(obj)) {
                this.ui = new GenerateUI("w-animation");
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    //=======================================================================//

    // 代码元素
    class WCode extends HTMLElement {

        constructor() {
            super();
        }

        connectedCallback() {
        }

        disconnectedCallback() {
        }

        adoptedCallback() {
        }

        attributeChangedCallback(name, oldValue, newValue) {
        }
    }

    // 一次性元素
    class WSingleUse extends HTMLElement {

        constructor() {
            super();
        }

        connectedCallback() {
            if (this.attr("load")) {
                const value = this.attr("load-value") || "{}";
                const json = JSON.parse(value) || "";
                try {
                    window[this.attr("load")](json);
                } catch (error) {
                    new Function(this.attr("load") + `('${value}')`)();
                }
            }
            if (this.attr("auto-remove")) {
                setTimeout(() => {
                    this.remove();
                }, parseInt(this.attr("auto-remove")));
            }
        }

        disconnectedCallback() {
            if (this.attr("remove")) {
                try {
                    const value = this.attr("remove-value") || "";
                    const json = JSON.parse(value) || "";
                    window[this.attr("remove")](json);
                } catch (error) {
                    new Function(this.attr("remove") + `('${value}')`)();
                }
            }
        }

        adoptedCallback() {
            if (this.attr("move")) {
                try {
                    const value = this.attr("move-value") || "";
                    const json = JSON.parse(value) || "";
                    window[this.attr("move")](json);
                } catch (error) {
                    new Function(this.attr("move") + `('${value}')`)();
                }
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
        }
    }

    (() => {
        window.customElements.define('w-code', WCode);
        window.customElements.define('w-single-use', WSingleUse);
    })();

    //=======================================================================//

    /**
     * UISystemPro 类负责管理 UI 模板
     */
    class UISystemPro {
        static TemplateElement = createElement({ tagName: "template" });
        static Path = "";

        constructor(path = "") {
            if (UISystemPro.Execute) return; else {
                UISystemPro.Execute = true;

                Object.freeze(UISystemPro.Execute);
            }
            UISystemPro.Path = path;
            UISystemPro.TemplateElement.id = `UISystemPro-${path}`;
            MainWindow.appendChild(UISystemPro.TemplateElement);
        }

        static toBase62(str = "") {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let output = '';

            for (let i = 0; i < str.length; i++) {
                let charCode = str.charCodeAt(i);
                let value = charCode;

                while (value > 0) {
                    let remainder = value % 62;
                    value = Math.floor(value / 62);
                    output = chars[remainder] + output;
                }
            }

            return output;
        }

        static render(uiPaths = [], loadFn = () => { }) {
            let i = 0;
            const fn = (uiPath = uiPaths[i]) => {
                if (!uiPath) {
                    loadFn(UISystemPro.TemplateElement);
                    return;
                }
                i += 1;
                const iframe = createElement({ tagName: "iframe" });
                iframe.style.display = "none";
                iframe.src = `${UISystemPro.Path}/${uiPath}.ui`;

                MainWindow.appendChild(iframe);
                iframe.contentWindow.onload = () => {
                    const content = iframe.contentDocument.querySelector("pre").textContent;
                    MainWindow.removeChild(iframe);

                    const virtualContainer = createElement({ html: content });

                    const dataArgv = virtualContainer.$("script[data-argv]").first;
                    if (dataArgv) dataArgv.remove();

                    const ui = virtualContainer.$("template").first;
                    const style = virtualContainer.$("style").first || createElement({ tagName: "style" });
                    const script = virtualContainer.$("script").first || createElement({ tagName: "script" });

                    const element = createElement({
                        html: `${ui.innerHTML}`,
                        attribute: UISystemPro.toBase62(`${UISystemPro.Path}/${uiPath}`),
                        child: [
                            createElement({ tagName: "style", attribute: "w-module-style", textContent: style.textContent }),
                            createElement({ tagName: "script", attribute: "w-module-script", textContent: `((argv)=>{${script.textContent}})` })
                        ]
                    });
                    forEnd(ui.attrs(true), att => { element.setAttribute(att.name, att.value); });

                    UISystemPro.TemplateElement.content.appendChild(element);
                    fn();
                };
            }
            fn();
        }

        static get(uiPath = "", argv = {}) {
            const key = UISystemPro.toBase62(`${UISystemPro.Path}/${uiPath}`).toLowerCase();
            const ui = UISystemPro.TemplateElement.content.querySelector(`[${key}]`);
            if (ui) {
                const newUI = document.importNode(ui, true);
                const script = newUI.$("[w-module-script]").first;
                script["__argv"] = () => {
                    runAsyncOnce(() => { delete script.__argv; });
                    return argv;
                };
                script.attr(script.SoleID, "")
                script.textContent += `($("[${script.SoleID}]").first.__argv());`;
                newUI.attr("w-scope", "");
                const scope = new WScope(newUI);
                argv["scope"] = scope;
                return scope;
            }
            return null;
        }

        static remove(uiPath = "") {
            const key = UISystemPro.toBase62(`${UISystemPro.Path}/${uiPath}`).toLowerCase();
            const ui = UISystemPro.TemplateElement.content.querySelector(`[${key}]`);
            if (ui) {
                ui.remove();
                return true;
            }
            return false;
        }
    }
    Object.freeze(UISystemPro.TemplateElement);
    Object.freeze(UISystemPro.Path);

    //=======================================================================//

    /**
     * 根据指定的规则替换包含在元素内部的文本内容
     * 元素必须具有属性 `w-value-entry`
     */
    function WValueEntry(element = MainWindow) {
        forEnd(element.$("[w-value-entry]"), e => {
            const regex = /{{([^{}]+)}}/g;
            const str = e.innerText;
            e.innerText = str.replace(regex, (match, p1) => {
                const trimmedP1 = p1.trim();
                if (trimmedP1.endsWith('()')) {
                    // 如果是函数调用，则使用 Function 构造函数执行函数
                    const dynamicFunction = new Function(`return ${trimmedP1}`);
                    return dynamicFunction();
                } else if (e.attr("w-value-entry")) {
                    return eval(trimmedP1);
                } else {
                    // 否则获取全局变量的值
                    let globalValue = window[trimmedP1];
                    return globalValue !== undefined ? globalValue : ''; // 如果变量不存在则返回空字符串
                }
            });
        });
    }

    // 判断 ui 是否初始化
    function IsUIInit(uiClass, ui) {
        if (ui.attr("winit") !== `${uiClass.constructor.name}`) {
            ui.attr("winit", uiClass.constructor.name);
            !ui.hasClass("w-son-ui") && ui.attr("w-ui", "");
        } else return true;
    }

    // 判断是否是 WebGUIPro UI
    function IsUI(element) {
        return element.attr("winit") && element.Class.Callbacks;
    }

    const ControlDataList = [
        ["default", WDefault],
        ["label", WLabel],
        ["progress", WProgress],
        ["switch", WSwitch],
        ["list", WList],
        ["tree-list", WTreeList],
        ["breadcrumbs", WBreadcrumbs],
        ["button", WButton],
        ["bool-button", WBoolButton],
        ["paging", WPaging],
        ["edit", WEdit],
        ["text", WText],
        ["fieldset", WFieldset],
        ["stacked", WStacked],
        ["tab", WTab],
        ["sash", WSash],
        ["drop-list", WDropList],
        ["select", WSelect],
        ["widget", WWidget],
        ["app-bar", WAppBar],
        ["event-slot", WEventSlot],
        ["select-list", WSelectList]
    ];

    function getControlClassList() {
        return ControlDataList.map(arr => `w-${arr[0]}`);
    }

    function setTheme(Theme) {
        const property = elementStyle.getProperty(Theme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        elementStyle.set("WebGUIPro-Theme", Theme);
    }

    function addTheme(Theme) {
        const property = elementStyle.getProperty(Theme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        elementStyle.add("WebGUIPro-Theme", Theme);
    }

    function setUITheme(uiClassName, Theme = {}) {
        const uiSelector = `.${uiClassName}`;
        const uiTheme = {
            [uiSelector]: Theme
        };

        const property = elementStyle.getProperty(uiTheme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        elementStyle.set(`WebGUIPro-ui-${uiClassName}-Theme`, uiTheme);
    }

    function addUITheme(uiClassName, Theme = {}) {
        const uiSelector = `.${uiClassName}`;
        const uiTheme = {
            [uiSelector]: Theme
        };

        const property = elementStyle.getProperty(uiTheme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        elementStyle.add(`WebGUIPro-ui-${uiClassName}-Theme`, uiTheme);
    }

    function importCss(stylepath = null) {
        if (!Judge.isNull(stylepath)) {
            stylepath = stylepath + "/style/";
            includeCssFiles([
                [stylepath + "DefaultTheme.css"],
                [stylepath + "Ui.css", null, _WebUtilPro__STYLE_ELEMENT]
            ]);
        }
    }

    function render( init = () => { }) {

        anewRender();

        {
            const fn = event => {
                const TargetElement = event.target;
                if ($("dialog") && event.key === "Escape") {
                    const result = getAppointParent(TargetElement, parent => parent && (parent.hasAttr && parent.hasAttr("event-id")));
                    if (result && (result.Class && result.Class.DIALOG)) {
                        result.Class.delete();
                    }
                }
            };
            document.removeEvent("keydown", fn);
            document.addEvent("keydown", fn);
        }

        init();
    }

    function anewRender(element = MainWindow) {
        forEnd(element.$("[w-scope]"), scope => { new WScope(scope); });
        if (element.hasAttr("w-scope")) new WScope(element);
        forEnd(ControlDataList, (arr) => {
            forEnd(element.$(`.w-${arr[0]}`), (e) => {
                if (e.hasAttr("winit")) return;
                e.attr("winit", "");
                new arr[1](e);
            });
            if (element.hasClass(`.w-${arr[0]}`) && !element.hasAttr("winit")) {
                element.attr("winit", "");
                new arr[1](element);
            }
        });
    }

    // Object.preventExtensions(this);
    return {
        importCss,
        render,
        anewRender,
        WValueEntry,

        getControlClassList,

        addTheme,
        setTheme,
        setUITheme,
        addUITheme,

        IsUI,

        ThemeProperty,

        MAX_WIDTH,
        MAX_HEIGHT,
        NONE,

        UI,
        UI2,
        InputUI,
        InputUI2,
        InputUI3,
        WidgetUI,
        WidgetUI2,
        WidgetUI3,

        WItem,
        WView,
        WindowFlags,

        Link,

        ListContainer,
        Button,

        WDefault,
        WList,
        WButton,
        WBoolButton,
        WEdit,
        WText,
        WFieldset,
        WStacked,
        WTab,
        WSash,
        WDropList,
        WSelect,
        WAppBar,
        WWidget,
        WEventSlot,
        WSelectList,
        WPaging,
        WTreeList,
        WSwitch,
        WProgress,
        WLabel,

        WScope,

        Dialog,
        Activity,
        Drawer,
        Floating,
        Message,
        ContextMenu,
        Animation,

        WCode,
        WSingleUse,

        UISystemPro
    };
})();
