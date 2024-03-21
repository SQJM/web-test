const {
    WValueEntry,
    render,
} = WebGUIPro;

const {
    $,
    createElement,
    generateUniqueId,
    forEnd,
    getNowFormatDate,
    getElementScreenPosition,
    isValidFilename,
    includeCssFiles,
    _CLOSE_PAGE_WebUtilPro_,
    includeJsFiles,
    elementStyle,
    elementAnimation,
    TypeCast,
    AudioPlayer,
    _INIT_PAGE_WebUtilPro_,
    WPlace,
    WWindowOperation,
    WDirection,
    getBrowserInfo
} = WebUtilPro;

function init() {
    { // test 1
        const w = new WebGUIPro.Dialog({
            title: "test32e",
            iconSrc: "./Icon.png",
            content: "hello world!",
            position: WPlace.Center.Center
        });
        w.show();
        w.setWindowOperation(WWindowOperation.both);
    }

    { // test 2
        const a = new WebGUIPro.Activity({
            content: "hello world!"
        });
        a.showModal();
        a.ui.w_Event = (event) => {
            if (event.wEventName === "click") {
                a.delete();
            }
        }
    }

    { // test 3
        const f = new WebGUIPro.Floating({
            content: "hello world!"
        });
        f.show();
    }

    { // test 4
        new WebGUIPro.Message({
            eventID: "1",
            content: "hello world!",
            place: WPlace.Center.Top,
            time: 3000
        });
        new WebGUIPro.Message({
            eventID: "1",
            content: "hello world!1",
            time: 6000
        });
    }
}

function test1() {
    console.log("test1");
}

function test2(item) {
    const rect = item.rect();
    const a = new WebGUIPro.Activity({
        content: item.textContent,
        x: rect.x,
        y: rect.y + rect.height
    });
    a.showModal();
}

function test3() {
    const d = new WebGUIPro.Drawer({
        content: "hello world!",
        direction: WDirection.Left
    });
    d.show();
}

window.onload = () => {
    render("./Lib/WebGUIPro");
    _INIT_PAGE_WebUtilPro_(() => {
        init();
    }, 300);
}
