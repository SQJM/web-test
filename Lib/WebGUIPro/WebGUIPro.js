/**
 * @name WebGUIPro
 * @version 2.5.0
 * @description 网页控件
 * @author Wang Jia Ming
 * @createDate 2023-5-7
 * @license AGPL-3.0
 * 
 * https://opensource.org/licenses/AGPL-3.0
 * 
 * 依赖库/框架:
 * - WebUtilPro.js (2.5.0)
 */
const WebGUIPro = (function () {
    "use strict";

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
        elementStyle,
        elementAnimation,
        Judge,
        TypeCast,
        generateUniqueId,
        eventTrigger,
        includeCssFiles,
        uniquenessElement,
        createElement,
        WDirection,
        WSortord,
        WVarType,
        WWindowOperation,
        WPlace
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

    // 最大宽度
    const MAX_WIDTH = 300000;
    // 最大高度
    const MAX_HEIGHT = 300000;

    // 删除子 ui
    function _DeleteSonUi(ui) {
        forEnd(ui.$("[winit]"), e => e.Class.delete());
    }

    // 设置或移除类名
    function _SetClassList(ui, bool, className) {
        if (!Judge.isBoolean(bool)) throw UI_Error.ParameterMismatch(bool);
        if (!Judge.isString(className)) throw UI_Error.ParameterMismatch(className);
        bool ? ui.addClass(className) : ui.removeClass(className);
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
                if (Judge.isEmptyString(value)) throw UI_Error.ParameterMismatch(`key:${key} value:${value || "null"} index:${i}`);
                This.ui.Class.setCallback(key, window[value]);
            });
        }
    }

    class WindowFlags {
        static MinButtonHint = 0x000001;
        static RestoreButtonHint = 0x000010;
        static CloseButtonHint = 0x000100;

        static Get(flags, {
            min = {
                text: "\ue15b"
            },
            restore = {
                text: "\ue3c1"
            },
            close = {
                text: "\ue14c"
            }
        } = {}) {
            const minBtn = createElement(min);
            minBtn.addClass(["material-icons", "min", "btn"]);
            const restoreBtn = createElement(restore);
            restoreBtn.addClass(["material-icons", "restore", "btn"]);
            const closeBtn = createElement(close);
            closeBtn.addClass(["material-icons", "close", "btn"]);
            const group = createElement({
                classList: ["w-window-flags"]
            });

            if ((flags & this.MinButtonHint) === 0) group.appendChild(minBtn);
            if ((flags & this.RestoreButtonHint) === 0) group.appendChild(restoreBtn);
            if ((flags & this.CloseButtonHint) === 0) group.appendChild(closeBtn);

            group.ClickEvent = function (event) { }
            group.addEvent("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const TargetElement = event.target;
                let eventName;
                const btn = getAppointParent(TargetElement, e => { return e.hasClass("btn") && e.parentNode === group });
                if (btn.hasClass("min")) {
                    eventName = "min";
                } else if (btn.hasClass("restore")) {
                    eventName = "restore";
                } else if (btn.hasClass("close")) {
                    eventName = "close";
                }
                group.ClickEvent(eventName);
            });

            return group;
        }
    }


    class WItem {
        #Item;

        constructor(item = null) {
            if (Judge.isHTMLElement(item)) {
                this.#Item = item;
            } else if (Judge.isNull(item)) {
                this.#Item = createElement({
                    attribute: [["w-item", ""]]
                });
            } else {
                throw UI_Error.ParameterMismatch(item);
            }
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

        setDraggable(is = true) {
            return WItem.SetDraggable(this.#Item, is);
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
        static SetDraggable(item, is = true) {
            if (Judge.isHTMLElement(item)) {
                item.attr("draggable", is)
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

        // 清除带选择标签的项
        static RemoveSelectTagItem(container) {
            if (Judge.isHTMLElement(container)) {
                forEnd(container.$(">.select"), (item) => { item.removeClass("select"); });
            } else {
                throw UI_Error.ParameterMismatch(container);
            }
        }

        // 返回 ui 项
        static ReturnUiInItem(indexOrItem = 0 || HTMLElement, This) {
            const item = WItem.ReturnItem(indexOrItem, This);
            if (This.ui.contains(item)) {
                return item;
            } else {
                throw UI_Error.ParameterMismatch(indexOrItem);
            }
        }

        // 返回项
        static ReturnItem(indexOrItem = 0 || HTMLElement, This) {
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
        static ReturnUiInView(indexOrView = 0 || HTMLElement, This) {
            const view = WView.ReturnView(indexOrView, This);
            if (This.ui.contains(view)) {
                return view;
            } else {
                throw UI_Error.ParameterMismatch(indexOrView);
            }
        }

        // 返回视图
        static ReturnView(indexOrView = 0 || HTMLElement, This) {
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


    class UI {
        // 初始化 ui 配置
        initUIConfig() {
            const map = _ConfigToMap(this.ui.attr("w-ui-config"));
            _InitUIConfigCallbackEvent(map, this);
            if (Judge.isMap(map)) {
                this.UIConfigMap(map);
            }
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
            _DeleteSonUi(this.ui);
            this.Callbacks.delete();
            this.ui.remove();
        }

        constructor(Callbacks, initUIConfigMap) {
            this.Callbacks = Callbacks;
            this.UIConfigMap = initUIConfigMap;
        }
    }

    class UI2 {
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
            _DeleteSonUi(this.ui);
            this.Callbacks.delete();
            this.ui.remove();
        }

        constructor(Callbacks) {
            this.Callbacks = Callbacks;
        }
    }

    class WidgetUI extends UI2 {
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
            this.ui.css({ maxWidth: `${width}px` });
        }

        // 设置最大高度
        setMaxHeight(height) {
            this.ui.css({ maxHeight: `${height}px` });
        }

        // 设置最小宽度
        seMinWidth(width) {
            this.ui.css({ minWidth: `${width}px` });
        }

        // 设置最小高度
        setMinHeight(height) {
            this.ui.css({ minHeight: `${height}px` });
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
        setContent(view = "" || HTMLElement, isRender = true) {
            if (WView.Is(view)) {
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
        // 显示
        show() {
            this.ui.w_Event = (event) => {
                if (event.wEventName !== "click") return;
                this.close();
            }
            this.ui.removeAttr("open");
            this.ui.showModal();
        }

        // 设置内容
        setContent(view = "" || HTMLElement, isRender = true) {
            if (WView.Is(view)) {
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


    class WList extends UI {
        #TriggerMode = WEvent.mousedown;

        // 设置反转排序项
        setReverse(bool = true, sortord = WSortord.Column) {
            if (!Judge.isValueInObject(sortord, WSortord)) throw UI_Error.ParameterMismatch(sortord);
            _SetClassList(this.ui, bool, `w-${sortord}-reverse`);
        }

        // 设置排序方向
        setSortDirection(sortord = WSortord.Column) {
            if (!Judge.isValueInObject(sortord, WSortord)) throw UI_Error.ParameterMismatch(sortord);
            _SetClassList(this.ui, false, `w-${WSortord.Column}-direction`);
            _SetClassList(this.ui, false, `w-${WSortord.Row}-direction`);

            _SetClassList(this.ui, true, `w-${sortord}-direction`);
        }

        // 设置项拖拽
        setItemDraggable(indexOrItem = 0 || HTMLElement, is = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            is ? item.attr("draggable", "true") : item.removeAttr("draggable", "false");
        }

        // 设置项固定
        setItemFixed(indexOrItem = 0 || HTMLElement, is = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            is ? item.addClass("fixed") : item.removeClass("fixed");
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

        // 获取选中的项
        getSelectItem() {
            return this.ui.$(">.select")[0];
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
        removeItem(indexOrItem = 0 || HTMLElement, isSort = true) {
            const item = WItem.ReturnUiInItem(indexOrItem, this);
            WItem.RemoveItem(item);

            isSort && this.sortItem();
            this.Callbacks.removeItem(indexOrItem);
        }

        // 移除所有项
        removeItemAll() {
            forEnd(this.getItemAll(), item => { this.removeItem(item, false) });
        }

        // 添加项
        addItem(item = "" || HTMLElement, isSort = true) {
            if (WItem.Is(item)) {
                this.ui.appendChild(item);
            } else if (Judge.isString(item)) {
                this.ui.appendChild(createElement({
                    attribute: [["w-item", ""]],
                    text: item
                }));
            } else {
                throw UI_Error.ParameterMismatch(item);
            }

            isSort && this.sortItem();
            this.Callbacks.addItem(item);
        }

        // 添加多项
        addItems(items = [], isSort = true) {
            forEnd(items, (item, i) => {
                try {
                    this.addItem(item, false);
                } catch (error) {
                    throw `${error} #Error index : ${i}`;
                }
            });
            isSort && this.sortItem();
        }

        // 在项之后插入项
        insertItem(item = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insert", v1, v2)) return;

            v2.insertAdjacentElement('afterend', v1);
            this.sortItem();
        }

        // 在项之前插入项
        insertBeforeItem(item = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WItem.ReturnUiInItem(item, this), v2 = WItem.ReturnUiInItem(target, this);

            if (!this.Callbacks.swapItem("insertBefore", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortItem();
        }

        // 交换项
        swapItem(item = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WItem.ReturnItem(item, this), v2 = WItem.ReturnItem(target, this);

            if (!this.Callbacks.swapItem("swap", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortItem();
        }

        // 设置项
        setItemContent(indexOrItem = 0 || HTMLElement, content = "" || HTMLElement) {
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
        setDisabledItem(indexOrItem = 0 || HTMLElement, is = true) {
            const item = WItem.ReturnItem(indexOrItem, this);
            is ? item.attr("disabled") : item.removeAttr("disabled");
        }

        // 选择项
        selectItem(indexOrItem = 0 || HTMLElement) {
            const item = WItem.ReturnItem(indexOrItem, this);
            WItem.RemoveSelectTagItem(this.ui);
            WItem.SelectItem(item);
        }

        // 设置选择项的触发方式
        setSelectItemTriggerMode(mode = WEvent.mousedown || WEvent.click) {
            if (mode !== WEvent.mousedown || mode !== WEvent.click) throw UI_Error.ParameterMismatch(content);
            this.#TriggerMode = mode;
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.sortItem();

            this.ui.addEvent("mousedown", (event) => {
                if (this.#TriggerMode !== WEvent.mousedown) return;

                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!item || WItem.IsDisabled(item) || !this.Callbacks.selectItem(item, TargetElement)) return;
                this.selectItem(item);
            }, () => {
                const selectItem = this.ui.$(">.select")[0];
                if (selectItem) eventTrigger(selectItem, WEvent.mousedown);
            });
            this.ui.addEvent("contextmenu", (event) => {
                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!item || WItem.IsDisabled(item)) return;
                this.Callbacks.contextMenu(event, item, TargetElement);
            });
            this.ui.addEvent("click", (event) => {
                if (this.#TriggerMode !== WEvent.click) return;

                const TargetElement = event.target;
                const item = WItem.GetItem(TargetElement, this.ui);
                if (!item || WItem.IsDisabled(item) || !this.Callbacks.selectItem(item, TargetElement)) return;
                this.selectItem(item);
            }, () => {
                const selectItem = this.ui.$(">.select")[0];
                if (selectItem) eventTrigger(selectItem, WEvent.click);
            });
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                addItem: () => { },
                removeItem: () => { },
                selectItem: () => { return true },
                contextMenu: () => { },
                swapItem: () => { }
            }, (map) => {
                if (map.has("reverse")) this.setReverse();
                if (map.has("sortDirection")) {
                    this.setSortDirection(map.get("sortDirection"));
                }
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    classList: ["w-list"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WButton extends UI {
        #EventWait = false;

        #EventAgent = (event) => {
            const TargetElement = event.target;
            if (this.ui.hasAttr("disabled")) return;
            if (this.#EventWait) {
                _SetClassList(this.ui, true, "w-pointer-events-none");
                this.Callbacks.click(TargetElement, event);
                _SetClassList(this.ui, false, "w-pointer-events-none");
            } else
                this.Callbacks.click(TargetElement, event);
        }

        // 设置事件代理
        setEventAgent(bool = true) {
            if (bool) {
                this.ui.addEvent("click", this.#EventAgent);
            } else {
                this.ui.removeEvent("click", this.#EventAgent);
            }
        }

        // 设置事件等待
        setEventWait(bool = true) {
            if (!Judge.isBoolean(bool)) throw UI_Error.ParameterMismatch(bool);
            this.#EventWait = bool;
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

        // 初始化
        #init() {
            this.initUIConfig();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                click: () => { }
            }, (map) => {
                if (map.has("eventAgent")) this.setEventAgent();
                if (map.has("eventWait")) this.setEventWait();
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    tagName: "button",
                    classList: ["w-button"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WEdit extends UI {
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

        // 设置只读
        setReadObly(bool = true) {
            bool ? this.ui.attr("readonly", "") : this.ui.removeAttr("readonly");
        }

        // 设置最大输入长度
        setMaxLength(length = null) {
            if (!Judge.isNumber(length) || !Judge.isNull(length)) throw UI_Error.ParameterMismatch(length);
            Judge.isNull(length) ? this.ui.removeAttr("maxlength") : this.ui.attr("maxlength", length);
        }

        // 设置类型
        setType(type = WInputType.text) {
            if (!Judge.isValueInObject(type, WInputType)) throw UI_Error.ParameterMismatch(type);
            this.ui.attr("type", type);
        }

        // 设置 ui 禁用
        setDisabled(bool = true) {
            if (bool) {
                this.ui.attr("disabled", "");
            } else {
                this.ui.removeAttr("disabled");
            }
        }

        // 初始化
        #init() {
            this.initUIConfig();

            const fn = debounce((event) => { this.Callbacks.valueChange(event) }, 80);
            this.ui.w_Event = (event) => {
                if (event.wEventName === "input") {
                    this.Callbacks.input(event);
                    fn(event);
                } else if (event.wEventName === "copy") {
                    this.Callbacks.copy(event);
                } else if (event.wEventName === "paste") {
                    this.Callbacks.paste(event);
                } else if (event.wEventName === "cut") {
                    this.Callbacks.cut(event);
                }
            }
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                input: () => { },
                valueChange: () => { },
                copy: () => { },
                paste: () => { },
                cut: () => { }
            }, (map) => {
                if (map.has("readObly")) this.setReadObly();
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    tagName: "input",
                    attribute: [["type", WInputType.text]],
                    classList: ["w-edit"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WText extends UI {
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

        // 设置只读
        setReadObly(bool = true) {
            bool ? this.ui.attr("readonly", "") : this.ui.removeAttr("readonly");
        }

        // 设置最大输入长度
        setMaxLength(length = null) {
            if (!Judge.isNumber(length) || !Judge.isNull(length)) throw UI_Error.ParameterMismatch(length);
            Judge.isNull(length) ? this.ui.removeAttr("maxlength") : this.ui.attr("maxlength", length);
        }

        // 设置 ui 禁用
        setDisabled(bool = true) {
            if (bool) {
                this.ui.attr("disabled", "");
            } else {
                this.ui.removeAttr("disabled");
            }
        }

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

            const fn = debounce((event) => { this.Callbacks.valueChange(event) }, 80);
            this.ui.w_Event = (event) => {
                if (event.wEventName === "input") {
                    this.Callbacks.input(event);
                    fn(event);
                } else if (event.wEventName === "copy") {
                    this.Callbacks.copy(event);
                } else if (event.wEventName === "paste") {
                    this.Callbacks.paste(event);
                } else if (event.wEventName === "cut") {
                    this.Callbacks.cut(event);
                }
            }
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                input: () => { },
                valueChange: () => { },
                copy: () => { },
                paste: () => { },
                cut: () => { }
            }, (map) => {
                if (map.has("readObly")) this.setReadObly();
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    tagName: "textarea",
                    classList: ["w-text"]
                });
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
            const legendText = this.ui.attr("legend");
            if (Judge.isTrue(legendText)) {
                this.setLegendText(legendText);
            } else {
                throw UI_Error.MissingVitalElement("legend text");
            }
        }

        constructor(Element = null, legend = "") {
            super({
                delete: () => { }
            }, (map) => {
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    tagName: "fieldset",
                    classList: ["w-fieldset"],
                    attribute: [["legend", legend]]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WStacked extends UI {
        // 移除视图
        removeView(indexOrView = 0 || HTMLElement, isSort = true) {
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

        // 获取选中视图
        getSelectView() {
            return this.ui.$(">[w-view].select")[0];
        }

        // 选择视图
        selectView(indexOrView = 0 || HTMLElement) {
            WView.RemoveSelectTagView(this.ui);
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
        insertItem(view = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WView.ReturnUiInView(view, this), v2 = WView.ReturnUiInView(target, this);

            if (!this.Callbacks.swapView("insert", v1, v2)) return;

            v2.insertAdjacentElement('afterend', v1);
            this.sortView();
        }

        // 在项之前插入项
        insertBeforeItem(view = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WView.ReturnUiInView(view, this), v2 = WView.ReturnUiInView(target, this);

            if (!this.Callbacks.swapView("insertBefore", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortView();
        }

        // 交换项
        swapItem(view = 0 || HTMLElement, target = 0 || HTMLElement) {
            const v1 = WView.ReturnView(view, this), v2 = WView.ReturnView(target, this);

            if (!this.Callbacks.swapView("swap", v1, v2)) return;

            this.ui.insertBefore(v1, v2);
            this.sortView();
        }

        // 初始化
        #init() {
            this.initUIConfig();

            this.sortView();
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                addView: () => { },
                removeView: () => { },
                selectView: () => { },
                swapView: () => { }
            }, (map) => {
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    classList: ["w-stacked"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }

    class WTab extends UI {
        #BarElement = createElement({ attribute: [["w-bar", ""]], classList: ["w-list"], callback: (bar) => { new WList(bar) } });
        #ContentElement = createElement({ attribute: [["w-content", ""]], classList: ["w-stacked"], callback: (content) => { new WStacked(content) } });

        // 渲染 bar
        #renderBar() {
            this.#BarElement.innerRemove();
            const items = [];
            forEnd(this.getTabAll(), view => {
                const title = createElement({ attribute: [["w-item", ""]] });
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
        removeTab(indexOrView = 0 || HTMLElement) {
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
        selectTab(indexOrView = 0 || HTMLElement) {
            WView.RemoveSelectTagView(this.#ContentElement);
            WItem.RemoveSelectTagItem(this.#BarElement);
            const index = WView.GetIndex(WView.ReturnUiInView(indexOrView, this));

            this.#ContentElement.Class.selectView(indexOrView);
            WItem.SelectItem(this.#getBarItemAll()[index]);

            this.Callbacks.selectTab(indexOrView);
        }

        // 覆盖 tab 标题项配置
        coverTabConfig(indexOrView = 0 || HTMLElement, config = []) {
            if (!Judge.isArray(config) && config !== null) throw UI_Error.ParameterMismatch(config);
            const tab = WView.ReturnUiInView(indexOrView, this);
            config ? tab.attr("tab-config", config.join(" ")) : tab.attr("tab-config", "");
            this.#renderBar();
        }

        // 设置 tab 标题项配置
        setTabConfig(indexOrView = 0 || HTMLElement, config = {}, isAdd = true) {
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
            this.ui.append(this.#BarElement, this.#ContentElement);
            this.addTabs(this.ui.$(">[w-view]"));

            const defaultSelect = this.#ContentElement.$(">.select")[0];
            if (defaultSelect) this.selectTab(defaultSelect); else this.selectTab(0);

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
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                addTab: () => { },
                removeTab: () => { },
                selectTab: () => { },
                swapTab: () => { }
            }, (map) => {
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    classList: ["w-tab"],
                    child: [
                        this.#BarElement,
                        this.#ContentElement
                    ]
                });
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
                        attribute: [["w-item", ""]],
                        child: [
                            createElement({
                                tagName: "img",
                                attribute: [["src", item.src]]
                            }),
                            createElement({
                                attribute: [["src", item.src], ["w-item", ""]],
                                text: item.text
                            })
                        ]
                    }));
                } else if (Judge.isString(item)) {
                    arr.push(createElement({
                        attribute: [["w-item", ""]],
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
        setDisabledItem(indexOrItem = 0 || HTMLElement, is = true) {
            const item = WItem.ReturnItem(indexOrItem, this);
            is ? item.attr("disabled") : item.removeAttr("disabled");
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
        }

        constructor(Element = null) {
            super({
                delete: () => { },
                setItemPath: () => { },
                selectItem: () => { }
            }, (map) => {
                if (map.has("split")) this.setItemSplitSign(map.get("split"));
                if (map.has("path")) this.setItemPath(map.get("path").split(","));
            });
            if (IsUiInit(this, Element)) return;
            if (Judge.isHTMLElement(Element)) {
                this.ui = Element;
            } else if (Judge.isNull(Element)) {
                this.ui = createElement({
                    classList: ["w-breadcrumbs"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init();
        }
    }


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
            titleBtn: WindowFlags.Get(WindowFlags.MinButtonHint | WindowFlags.RestoreButtonHint),
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

        // 显示
        show(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.show();
            this.#initPosition(position);
        }

        // 模态显示
        showModal(position = WPlace.Center.Center) {
            this.ui.removeAttr("open");
            this.ui.showModal(position);
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
        setContent(view = "" || HTMLElement, isRender = true) {
            if (WView.Is(view)) {
                this.#View.content.innerRemove();
                view.addClass("content");
                this.#View.content.appendChild(view);
            } else if (Judge.isString(view)) {
                this.#View.content.innerRemove();
                this.#View.content.appendChild(createElement({
                    attribute: [["w-view", ""]],
                    classList: ["content"],
                    text: view
                }));
            } else {
                throw UI_Error.ParameterMismatch(view);
            }
            isRender && anewRender(this.#View.content);
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
            iconSrc = "",
            title = "",
            content = "",
            width = 300,
            height = 200,
            minWidth = 300,
            minHeight = 200,
            maxWidth = MAX_WIDTH,
            maxHeight = MAX_HEIGHT,
            windowOperation = WWindowOperation.default,
            draggable = true
        } = {}) {
            this.#View.titleText.textContent = title;
            this.#View.title.append(this.#View.titleIcon, this.#View.titleText, this.#View.titleBtn);

            this.setContent(content);
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
                    fn: _ => true
                });
            }
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                close: () => { },
                titleButton: (eventName) => {
                    if (eventName === "close") {
                        elementAnimation(this.ui, "WebGUIPro-opacity 0.1s reverse forwards", () => { this.delete() });
                    }
                }
            });
            if (Judge.isObject(obj)) {
                this.ui = createElement({
                    tagName: "dialog",
                    classList: ["w-dialog"],
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
        // 初始化
        #init({
            parent = MainWindow,
            content = "",
            width = 300,
            height = 200,
            minWidth = 300,
            minHeight = 200,
            maxWidth = MAX_WIDTH,
            maxHeight = MAX_HEIGHT,
            x = 0,
            y = 0
        } = {}) {

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
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                close: () => { }
            });
            if (Judge.isObject(obj)) {
                this.ui = createElement({
                    tagName: "dialog",
                    classList: ["w-activity"]
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
            content = "",
            direction = WDirection.Bottom
        } = {}) {
            this.setContent(content);
            this.setDirection(direction);

            this.ui.removeAttr("open");
            parent.appendFragment(this.ui);
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
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
                this.ui = createElement({
                    tagName: "dialog",
                    classList: ["w-drawer"]
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
                    fn: _ => true
                });
            }
        }

        constructor(obj = {}) {
            super({
                delete: () => { },
                close: () => { }
            });
            if (Judge.isObject(obj)) {
                this.ui = createElement({
                    tagName: "dialog",
                    classList: ["w-floating"]
                });
            } else {
                throw UI_Error.ParameterMismatch(Element);
            }
            this.ui.Class = this;
            this.#init(obj);
        }
    }

    /**
     * 根据指定的规则替换包含在元素内部的文本内容
     * 元素必须具有属性 `w-value-entry`
     */
    function WValueEntry() {
        forEnd($("[w-value-entry]"), (e) => {
            const regex = /{{([^{}]+)}}/g;
            const str = e.innerText;
            e.innerText = str.replace(regex, (match, p1) => {
                const trimmedP1 = p1.trim();
                if (trimmedP1.endsWith('()')) {
                    // 如果是函数调用，则使用 Function 构造函数执行函数
                    const dynamicFunction = new Function(`return ${trimmedP1}`);
                    return dynamicFunction();
                } else {
                    // 否则获取全局变量的值
                    const globalValue = window[trimmedP1];
                    return globalValue !== undefined ? globalValue : ''; // 如果变量不存在则返回空字符串
                }
            });
        });
    }

    // 判断 ui 是否初始化
    function IsUiInit(uiClass, ui) {
        if (ui.attr("winit") !== `${uiClass.constructor.name}`) {
            ui.attr("winit", uiClass.constructor.name)
        } else return true;
    }

    const ControlDataList = [
        ["list", WList],
        ["breadcrumbs", WBreadcrumbs],
        ["button", WButton],
        ["edit", WEdit],
        ["text", WText],
        ["fieldset", WFieldset],
        ["stacked", WStacked],
        ["tab", WTab]
    ];

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

    const DefaultTheme = (() => {
        const { transition, animation, bgColor, cursor, borderRadius, border, boxShadow, fontSize, color, borderBottom, opacity, filter } = ThemeProperty;
        return {
            ".w-list": {
                "*[w-item]:hover": {
                    [bgColor]: "#00000010",
                    [cursor]: "context-menu"
                },
                "*[w-item].select": {
                    [bgColor]: "#00000030"
                },
                "*[w-item].drag-select": {
                    [bgColor]: "#00000020"
                }
            },
            ".w-dialog": {
                [borderRadius]: "8px",
                [border]: "solid 1.5px #c9c9c9dd",
                [boxShadow]: "0 0 30px 6px #3333332a",
                ".title": {
                    [bgColor]: "#f3f3f3",
                },
                ".content": {
                    [bgColor]: "#ebebeb"
                },
                "&::backdrop": {
                    [bgColor]: "#ffffff0f"
                },
            },
            ".w-activity": {
                [bgColor]: "#ebebeb",
                [borderRadius]: "8px",
                [border]: "solid 1.5px #c9c9c9dd",
                [boxShadow]: "0 0 30px 6px #3333332a",
                "&::backdrop": {
                    [bgColor]: "#00000000"
                }
            },
            ".w-floating": {
                [bgColor]: "#ebebeb",
                [borderRadius]: "8px",
                [border]: "solid 1.5px #c9c9c9dd",
                "&::backdrop": {
                    [bgColor]: "#00000000"
                }
            },
            ".w-drawer": {
                [bgColor]: "#ebebeb",
                [borderRadius]: "8px",
                [border]: "solid 1.5px #c9c9c9dd",
                [boxShadow]: "0 0 30px 6px #3333332a",
                "&::backdrop": {
                    [bgColor]: "#00000000"
                },
                "&[direction='bottom']": {
                    [animation]: "WebGUIPro-appear-bottom-to-top .3s"
                },
                "&[direction='top']": {
                    [animation]: "WebGUIPro-appear-top-to-bottom .3s"
                },
                "&[direction='right']": {
                    [animation]: "WebGUIPro-appear-left-to-right .3s"
                },
                "&[direction='left']": {
                    [animation]: "WebGUIPro-appear-right-to-left .3s"
                }
            },
            ".w-window-flags": {
                ".btn": {
                    [fontSize]: "18px"
                },
                ".min:hover": {
                    [bgColor]: "#e3e3e3dc"
                },
                ".restore:hover": {
                    [bgColor]: "#e3e3e3dc"
                },
                ".close:hover": {
                    [color]: "#fff",
                    [bgColor]: "red"
                }
            },
            ".w-tab": {
                "*[w-bar]": {
                    [bgColor]: "#f9f9f9",
                    "*[w-item]": {
                        [border]: "solid 1.5px #00000000",
                        ".delete-btn": {
                            [borderRadius]: "4px"
                        },
                        ".delete-btn:hover": {
                            [color]: "#fff",
                            [bgColor]: "#333",
                        }
                    },
                    "[w-item].select": {
                        [borderBottom]: "solid 1.5px #333",
                        [bgColor]: "#00000010",
                        ".delete-btn.hide": {
                            [opacity]: 1
                        }
                    },
                    "[w-item][disabled]": {
                        [color]: "#6a6a6a",
                        [filter]: "grayscale(100%)",
                        [bgColor]: "#d2d2d2",
                        ".delete-btn.hide": {
                            [opacity]: 0.5
                        }
                    },
                    "[w-item][disabled]:hover": {
                        ".delete-btn.hide": {
                            [opacity]: 0.5
                        }
                    },
                    "[w-item]:hover": {
                        ".delete-btn.hide": {
                            [opacity]: 1
                        }
                    }
                },
                "*[w-content]": {
                    [border]: "solid 1.5px #333"
                }
            },
            ".w-breadcrumbs": {
                [bgColor]: "#fff",
                "*[w-item]": {
                    [cursor]: "pointer",
                    [color]: "#333"
                },
                "*[w-item].WClick": {
                    [color]: "#666"
                },
                "*[w-item]:hover": {
                    [color]: "#666"
                }
            }
        }
    })();

    function setTheme(Theme = DefaultTheme) {
        const property = elementStyle.getProperty(Theme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) {
            throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        }
        elementStyle.set("WebGUIPro-Theme", Theme);
    }

    function addTheme(Theme = DefaultTheme) {
        const property = elementStyle.getProperty(Theme);
        const illegalProperty = TypeCast.findExtraItemsInFirstArray(property, TypeCast.objectValueToArray(ThemeProperty));
        if (illegalProperty) {
            throw UI_Error.CustomError("Theme property illegal", illegalProperty);
        }
        elementStyle.add("WebGUIPro-Theme", Theme);
    }

    function render(stylepath = null) {
        if (!Judge.isNull(stylepath)) {
            stylepath = stylepath + "/style/";
            includeCssFiles([
                [stylepath + "Ui.css", null, _WebUtilPro__STYLE_ELEMENT]
            ]);
        }
        setTheme();
        anewRender();
    }

    function anewRender(element = MainWindow) {
        forEnd(ControlDataList, (arr) => {
            forEnd($(`.w-${arr[0]}`), (e) => {
                if (e.hasAttr("winit")) return;
                e.attr("winit", "");
                new arr[1](e);
            });
            if (element === `.w-${arr[0]}` && !element.hasAttr("winit")) {
                element.attr("winit", "");
                new arr[1](element);
            }
        });
    }

    // Object.preventExtensions(this);
    return {
        render,
        anewRender,
        WValueEntry,

        addTheme,
        setTheme,

        DefaultTheme,
        ThemeProperty,

        WItem,
        WindowFlags,

        WList,
        WButton,
        WEdit,
        WText,
        WFieldset,
        WStacked,
        WTab,

        Dialog,
        Activity,
        Drawer,
        Floating
    };
})();

