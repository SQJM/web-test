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
    }

}

function test1() {
    console.log("test1");
}

window.onload = () => {
    render("./Lib/WebGUIPro");
    _INIT_PAGE_WebUtilPro_(() => {
        init();
    }, 300);
}
