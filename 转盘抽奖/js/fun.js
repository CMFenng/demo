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



function canvasApp() {

    var cvs = document.getElementById("cvs");
    var ctx = cvs.getContext("2d");

    drawScreen(ctx);

}

// 封装一个扇形函数

// ctx: Canvas绘图环境
// x,y: 位移目标点
// r: 圆弧半径
// sDeg: 旋转起始角度
// eDeg: 旋转终点角度

function drawSector(ctx, x, y, r, sDeg, eDeg) {
    // 初始保存
    ctx.save();

    //位移到目标点
    // ctx.translate(x, y);
    ctx.beginPath();

    // 画出圆弧
    ctx.arc(0, 0, r, sDeg, eDeg);

    // 再次保存以备旋转
    ctx.save();

    // 旋转至起始角度
    ctx.rotate(eDeg);

    // 移动到终点，准备连接终点与圆心
    ctx.moveTo(r, 0);

    // 连接到圆心
    ctx.lineTo(0, 0);

    // 还原
    ctx.restore();

    // 旋转至起点角度
    ctx.rotate(sDeg);

    // 从圆心连接到起点
    ctx.lineTo(r, 0);

    ctx.closePath();
    // 还原到最初保存的状态
    ctx.restore();
}

function drawScreen (ctx) {

    var deg = Math.PI / 180;

    var obj = {
        x: 300,
        y: 300,
        r: 300,
        sDeg: [30, 111, 190, 233, 280, 345],
        eDeg: [111, 190, 233, 280, 345, 30],
        style: ['#f00', '#0f0', '#00f', '#789', '#abcdef']
    }
    // ctx.translate(300, 300);
    for (var i = 0; i < obj.sDeg.length; i++) {

        drawSector(ctx, obj.x, obj.y, obj.r, obj.sDeg[i] * deg, obj.eDeg[i] * deg);
        ctx.fill();
        ctx.fillStyle = obj.style[i];
    }

}