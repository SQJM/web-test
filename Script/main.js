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
        a.ui.eventSlot = (event) => {
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
            iconSrc: "./Icon.png",
            time: 6000
        });
        new WebGUIPro.Message({
            content: "hello world!1",
            iconSrc: "./Icon.png",
            time: 6000
        });
    }

    { // test5
        MainWindow.addEvent("contextmenu", (event) => {
            event.preventDefault();
            const f = new WebGUIPro.ContextMenu({
                eventID: "hello",
                items: [
                    {
                        text: "iterm2",
                        key: "ctrl s"
                    },
                    null,
                    {
                        text: "iterm3",
                        more: {

                        }
                    },
                    {
                        text: "iterm4",
                        callback: (event) => {
                            f.delete();
                        }
                    }
                ],
                x: event.pageX,
                y: event.pageY
            });
            f.setCallback("close", () => { f.delete() })
            f.show();
        })
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

    const j =
    {
        "type": "TBT",
        "name": "Easy",
        "version": "1.0.0",
        "description": "This Blog Theme. 2024/10/07",
        "author": "SQJM",
        "state": false,
        "data": {
            "div": {
                "color": "red"
            }
        },
        "depend": {
            "WebUtilPro": "2.5.0"
        }
    }
}

window.onload = () => {
    render("./Lib/WebGUIPro");
    _INIT_PAGE_WebUtilPro_(() => {
        init();
    }, 300);
}
