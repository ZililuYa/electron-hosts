const {ipcRenderer} = require('electron');


let init = () => {
    //监听mian process里发出的message
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        alert("web2" + arg);
        // prints “pong”
        // 在electron中web page里的console方法不起作用，因此使用alert作为测试方法
    });
};
init();

let bbb_hello = () => {
    //在web page里向main process发出message

    //不需要返回
    ipcRenderer.send('asynchronous-message', 'ping'); // prints “pong“
    ipcRenderer.sendSync('synchronous-message', 'ping'); // prints “pong“
    alert("web1" + 'ping');
};


let openFile = () => {
    const t1=document.getElementById('t1');
    ipcRenderer.send('openFile', t1.value);
};

let openUrl = () => {
    const t2=document.getElementById('t2');
    ipcRenderer.send('openUrl', t2.value);
};