//electrin
const electrin = require('electron');

//对话窗口
const dialog = electrin.dialog;

//键盘控制
const globalShortcut = electrin.globalShortcut;

//控制应用生命周期的模块
const {app} = electrin;

//创建本地浏览器窗口的模块
const {BrowserWindow} = electrin;

//指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的时候该窗口将会自动关闭
let win;

const path = require('path');
const url = require('url');

let openHtml = (html) => {
    win.loadURL(url.format({
        pathname: path.join(__dirname, html),
        protocol: 'file:',
        slashes: true
    }));
};

let createWindow = () => {
    //创建一个新的浏览器窗口
    //API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/browser-window.md
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        resizable: false,//禁止改变窗口大小
        frame: false,//设置成frame模式
        // API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/frameless-window.md
        // title:hidden
        // backgroundColor: 'transparent'
    });

    //并且装载应用的index.html页面
    openHtml('index.html');

    //打开开发工具页面
    // win.webContents.openDevTools();

    //当窗口关闭时调用的方法
    win.on('closed', () => {
        //解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里存放窗口对象，在窗口关闭的时候应当删除对应的元素。
        win = null;
    });

    //不显示菜单栏
    win.setMenu(null);


    globalShortcut.register('Alt+Z', () => {

        //直接关闭
        app.quit();

        //验证 是否关闭。系统窗口
        // dialog.showMessageBox({
        //     type: 'info',
        //     message: 'Alt+Z 触发 关闭窗口，那么是否关闭？',
        //     detail: 'Alt+Z Triggers Close The Window, Then Close?',
        //     buttons: ['No','Yes']
        // }, function (index) {
        //     if(index==1){
        //         app.quit();
        //     }
        // })
    });

    //触发调试 Alt+F12
    globalShortcut.register('Alt+F12', () => {
        win.webContents.openDevTools();
    });

    //调试
    // win.webContents.openDevTools();

};

//当electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
//有些API只能在该事件发生后才能被使用。
app.on(
    'ready', createWindow
);

//当所有的窗口被关闭后退出应用
app.on(
    'window-all-closed', () => {
        //对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过CMD+Q显示退出
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

app.on(
    'activate', () => {
        //对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他窗口打开
        if (win === null) {
            createWindow();
        }
    }
);

//API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/menu.md
//API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/menu-item.md
//获取菜单
const Menu = require('electron').Menu;
//自定义菜单那
let template = [
    {
        label: 'HOSTS ',
        click: () => {
            openHtml('index.html');
        }
    }, {
        label: 'CALCULATOR',
        click: () => {
            openHtml('html/calculator/index.html');
        }
    },
    // {
    //
    //     label: '其他',
    //     submenu: [
    //         {
    //             label: 'Undo',
    //             accelerator: 'CmdOrCtrl+M',
    //             role: 'minimize',
    //             click: () => {
    //                 console.log('Ctrl+Z');
    //             }
    //         }
    //     ]
    // }
];
let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


require('./controller/ipcMain');


//自动刷新
require('electron-reload')(__dirname, {
    electron: require('electron-prebuilt')
});

//
// app.on('will-quit', function () {
//     globalShortcut.unregisterAll()
// });