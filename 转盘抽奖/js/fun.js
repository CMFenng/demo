function getFileDate(e) {
    let file = e.target.files[0];
    // 判断文件是否存在
    if (file) {
        let reader = new FileReader();
        // 文件加载成功
        reader.onload = function(e) {
            // 处理数据
            let data = handleData(e.target.result);
            // 绘制转盘
            // drawPan();
        };
        reader.readAsText(file);
    }
}

function handleData(data) {
    // 分割
    let itemArr = data.split("\n");
    let arr = [];

    for (let i = 0; i < itemArr.length; i++) {
        // 过滤多余的空行
        if (itemArr[i] === "") {
            continue;
        } else {
            let obj = {
                option: itemArr[i].split("=")[0],
                ratio: itemArr[i].split("=")[1]
            };
            arr.push(obj);
        }
    }
    console.log(arr);
    return arr;
}


// function canvasApp() {
//
//     var cvs = document.getElementById("cvs");
//     var ctx = cvs.getContext("2d");
//
//     cvs.style.transform = `rotate(${ -Math.PI * 2 / 6 / 2 }deg)`;
//
//     drawScreen(ctx);
//
// }

// 封装一个扇形函数

// ctx: Canvas绘图环境
// x,y: 位移目标点
// r: 圆弧半径
// sDeg: 旋转起始角度
// eDeg: 旋转终点角度

// function drawSector(ctx, x, y, r, sDeg, eDeg) {
//     // 初始保存
//     ctx.save();
//
//     //位移到目标点
//     // ctx.translate(x, y);
//     ctx.beginPath();
//
//     // 画出圆弧
//     ctx.arc(0, 0, r, sDeg, eDeg);
//
//     // 再次保存以备旋转
//     ctx.save();
//
//     // 旋转至起始角度
//     ctx.rotate(eDeg);
//
//     // 移动到终点，准备连接终点与圆心
//     ctx.moveTo(r, 0);
//
//     // 连接到圆心
//     ctx.lineTo(0, 0);
//
//     // 还原
//     ctx.restore();
//
//     // 旋转至起点角度
//     ctx.rotate(sDeg);
//
//     // 从圆心连接到起点
//     ctx.lineTo(r, 0);
//
//     ctx.closePath();
//     // 还原到最初保存的状态
//     ctx.restore();
// }

// function drawScreen (ctx) {
//
//     var deg = Math.PI / 180;
//
//     var obj = {
//         x: 300,
//         y: 300,
//         r: 300,
//         sDeg: [30, 111, 190, 233, 280, 345],
//         eDeg: [111, 190, 233, 280, 345, 30],
//         style: ['#f00', '#0f0', '#00f', '#789', '#abcdef']
//     }
//     // ctx.translate(300, 300);
//     for (var i = 0; i < obj.sDeg.length; i++) {
//
//         drawSector(ctx, obj.x, obj.y, obj.r, obj.sDeg[i] * deg, obj.eDeg[i] * deg);
//         ctx.fill();
//         ctx.fillStyle = obj.style[i];
//     }
//
// }

// function drawScreen(ctx) {
//     var deg = Math.PI / 180;
//
//     let obj = {
//         x: 300,
//         y: 300,
//         r: 300-5,
//         sDeg: [0, 60, 120, 180, 240, 300],
//         eDeg: [60, 120, 180, 240, 300, 360],
//         text: ["奖品1", "奖品2", "奖品3", "奖品4", "奖品5", "奖品6"]
//     };
//
//     for (let i =0; i <obj.sDeg.length; i++) {
//
//         drawSector(ctx, obj.x, obj.y, obj.r, obj.sDeg[i] * deg, obj.eDeg[i] * deg, obj.text[i]);
//
//     }
//
//     let cvs_pointer = document.getElementById("cvs_pointer");
//     var ctx_pointer = cvs_pointer.getContext("2d");
//
//     cvs_pointer.style.transform = `rotate(-90deg)`;
//
//     ctx_pointer.save();
//     ctx_pointer.beginPath();
//     // ctx.moveTo(300,300);
//     ctx_pointer.arc(100, 100, 50, Math.PI/10, Math.PI*2-Math.PI/10);
//     ctx_pointer.lineTo(200, 100);
//     ctx_pointer.closePath();
//     // ctx.stroke();
//     ctx_pointer.fillStyle = "#f00";
//     ctx_pointer.fill();
// }

// function drawSector(ctx, x, y, r, sDeg, eDeg, text) {
//     ctx.save();
//     ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.arc(x, y, r, sDeg, eDeg);
//     ctx.strokeStyle = "#40AA53";
//     ctx.stroke();
//     ctx.lineWidth = 1;
//     ctx.lineTo(x, y);
//     ctx.closePath();
//     ctx.strokeStyle = "#40AA53";
//     ctx.stroke();
//     ctx.fillStyle = "#0ff";
//     ctx.fill();
//     ctx.fillStyle = "#cc0000";
//     ctx.font = "50px Microsoft YaHei";
//     ctx.textAlign = "center";
//     var width = ctx.measureText(text);
//     ctx.fillText(text, 300, 100);
//     console.log(width);
//     // ctx.measureText(text);
// }

//====================================


// 初始化转盘
function initPlate() {
    var plateCanvas = document.getElementById("plate");
    var pointerCanvas = document.getElementById("pointer");
    var plateCtx = plateCanvas.getContext("2d");
    var pointerCtx = pointerCanvas.getContext("2d");

    // pointerCanvas.style.transform = `rotate(-90deg)`;

    // 测试数据
    var d = 0;
    pointerCanvas.onclick = function () {
        d = d + 3600;
        console.log(d);
        plateCanvas.style.transform = `rotate(${ d }deg)`;
    }

    var deg = Math.PI / 180;

    var plateCenterX = plateCanvas.width/2;
    var plateCenterY = plateCanvas.height/2;
    var lineW = 5;
    // 转盘半径
    var plateR = plateCenterX < plateCenterY ? plateCenterX-lineW : plateCenterY-lineW;
    var itemData = {
        text: ["奖品1", "奖品2", "奖品3", "奖品4", "奖品5", "奖品6"],
        radio: []
    };

    initCircle();
    initText();
    initPointer();

    // 初始化圆盘
    function initCircle() {
        let num = itemData.text.length;
        let sectorDeg = Math.PI * 2 / num;

        for (let i = 0; i < num; i++) {

            drawSector(plateCtx, plateCenterX, plateCenterY, plateR, sectorDeg*i, sectorDeg*(i+1));
        }
    }

    // 初始化文本
    function initText() {

    }

    // 初始化指针
    function initPointer() {
        let pointerCenterX = pointerCanvas.width/2;
        let pointerCenterY = pointerCanvas.height/2;
        let pointerR = pointerCenterX < pointerCenterY ? pointerCenterX/2 : pointerCenterY/2;

        pointerCtx.save();
        pointerCtx.beginPath();
        pointerCtx.arc(pointerCenterX, pointerCenterY, pointerR, Math.PI/10, Math.PI*2-Math.PI/10);
        pointerCtx.lineTo(pointerCenterX+pointerR*2, pointerCenterY);
        pointerCtx.closePath();
        pointerCtx.fillStyle = "#ff0000";
        pointerCtx.fill();
    }

    function drawSector(ctx, x, y, r, sDeg, eDeg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, sDeg, eDeg);
        ctx.lineWidth = lineW;
        ctx.strokeStyle = "#40AA53";
        ctx.stroke();
        ctx.lineTo(x, y);
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.strokeStyle = "#40AA53";
        ctx.stroke();
        ctx.fillStyle = "#0ff";
        ctx.fill();
    }
}