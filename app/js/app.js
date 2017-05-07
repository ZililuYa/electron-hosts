const {ipcRenderer} = require('electron');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

let listData = [];
let Judge = {
    ip: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
    dn: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/
};

//向客户端发送请求 获取Hosts
ipcRenderer.send('getHosts', '');

//设置web端回调
ipcRenderer.on('setHosts', (event, arg) => {
    setListData(arg);
});

//保存Hosts成功的回调
ipcRenderer.on('setHostsInfo', (event, arg) => {
    if (arg == "200") {
        vm.dataArr.ip = '';
        vm.dataArr.dn = '';
        vm.ipClass = '';
        vm.dnClasss = '';
    } else {
        alert('Save Error');
    }
});


let setListData = (data) => {
    let arr = data.split('\n');
    for (let x in arr) {
        if (arr[x].toString().indexOf('#') == -1 && arr[x].toString().indexOf('::') == -1) {
            let a = arr[x].toString().split('\t');
            if (a.length == 2)
                listData.push(a);
        }
    }
    vm.listData = listData;
};

let vm = avalon.define({
    $id: "container",
    listData: [],
    fb: '',
    dataArr: {
        ip: '',
        dn: ''
    },
    //添加
    addClick: function () {
        if (vm.ipJudge() && vm.dnJudge()) {
            vm.listData.push([vm.dataArr.ip, vm.dataArr.dn]);
            vm.postDataFun();
        }
    },
    //更新Hosts
    postDataFun: function () {
        let mainData = vm.listData.join('\n');
        mainData = mainData.replace(/\,/g, '\t');
        // $.post('/setHosts', {mainData: mainData}, function (data) {
        //
        // });
        ipcRenderer.send('saveHosts', mainData);

    },
    //删除
    deleteClick: function (i) {
        $("#alerts").addClass('show');
        alert(i);
        setTimeout(() => {
            $('#alerts').removeClass('show');
        }, 2000);
        vm.listData = deleteArr(vm.listData, parseInt(i));
        vm.postDataFun();
    },
    //IP验证
    ipJudge: () => {
        if (vm.dataArr.ip.match(Judge.ip)) {
            vm.ipClass = 'has-success';
            return true;
        } else {
            vm.ipClass = 'has-error';
            return false;
        }
    },
    //DN验证
    dnJudge: () => {
        if (vm.dataArr.dn.match(Judge.dn) || 'localhost' == vm.dataArr.dn) {
            vm.dnClass = 'has-success';
            return true;
        } else {
            vm.dnClass = 'has-error';
            return false;
        }
    },
    ipClass: '',
    dnClass: '',
    deleteInfo: 'DELETE&emsp;SUCCESS'
});

//数组删除
let deleteArr = (d, delIndex) => {
    let temArray = [];
    for (let i = 0; i < d.length; i++) {
        if (i != delIndex) {
            temArray.push(d[i]);
        }
    }
    return temArray;
};