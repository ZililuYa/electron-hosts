//通信模块，main process 与 renderer process (web page)
const {ipcMain}=require('electron');
const {shell} = require('electron');
const fs = require('fs');


ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('mian1' + arg);//prints ping
    //向页面端请求通讯
    event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log('main2' + arg);//prints ping
    event.returnValue = 'pong';
});


//打开文件
ipcMain.on('openFile', (event, arg) => {
    shell.openItem(arg);
});

//打开网站
ipcMain.on('openUrl', (event, arg) => {
    shell.openExternal(arg);
});


//-------------------


//判断文件夹或文件
let fsExistsSync = (path) => {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

let hosts = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
if (!fsExistsSync(hosts)) {
    hosts = '/etc/hosts';
    if (!fsExistsSync(hosts)) {
        hosts = false;
    }
}

//服务端获取Hosts
ipcMain.on('getHosts', (event, arg) => {
    fs.readFile(hosts, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        } else {
            event.sender.send('setHosts', data.toString());
            // res.send(data.toString());
        }
    });
});

//保存Hosts
ipcMain.on('saveHosts', (event, arg) => {
    fs.writeFile(hosts, arg, 'utf-8', function (err) {
        !err ? event.sender.send('setHostsInfo', '200') : event.sender.send('setHostsInfo', '500');
    });
});

