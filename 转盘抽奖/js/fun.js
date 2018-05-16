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


//====================================


// 初始化转盘
function initPlate() {
    let plateCanvas = document.getElementById("plate");
    let plateCtx = plateCanvas.getContext("2d");
    let pointerCanvas = document.getElementById("pointer");
    let pointerCtx = pointerCanvas.getContext("2d");

    var itemData = {
        text: ["奖品1", "奖品2", "奖品3", "奖品4", "奖品5", "奖品6"],
        radio: [25, 15, 5, 15, 30, 10]
    };

    if (eval(itemData.radio.join("+")) !== 100) {
        alert("百分比错误！");
    }

    let lineW = 5;
    let num = itemData.text.length;
    let sectorDeg = Math.PI * 2 / num;

    pointerCanvas.style.transform = `translate(-50%, -50%) rotate(-90deg)`;

    pointerCanvas.onclick = function () {
        // 测试数据
        var d = 0;
        d = d + 3600;
        plateCanvas.style.transform = `rotate(${ d }deg)`;

        var randomNum = Math.random()*100;    // [0, 100)
    };


    initCircle();
    initPointer();

    // 初始化圆盘
    function initCircle() {
        let plateCenterX = plateCanvas.width/2;
        let plateCenterY = plateCanvas.height/2;
        let plateR = plateCenterX < plateCenterY ? plateCenterX-lineW : plateCenterY-lineW;

        // plateCanvas.style.transform = `rotate(${ -sectorDeg/2-90 }deg)`;

        for (let i = 0; i < num; i++) {
            drawSector(plateCtx, plateCenterX, plateCenterY, plateR, sectorDeg*i, sectorDeg*(i+1), itemData.text[i]);
        }
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

    // 画扇形
    function drawSector(ctx, x, y, r, sDeg, eDeg, text) {
        // 第一次保存
        ctx.save();
        // 重新映射画布上的 (0, 0) 位置
        ctx.translate(x, y);
        // 重置当前路径
        ctx.beginPath();
        // 画出扇形的圆弧
        ctx.arc(0, 0, r, sDeg, eDeg);
        // 定义线粗和颜色
        ctx.lineWidth = lineW;
        ctx.strokeStyle = "#40AA53";
        // 画出路径
        ctx.stroke();

        // 重新定义线粗和颜色
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#40AA53";

        // 第二次保存
        ctx.save();
        // 旋转当前画布至扇形的起始位置
        ctx.rotate(sDeg);
        // 连接圆弧一端至 (0, 0)
        ctx.lineTo(0, 0);
        // 画出路径
        ctx.stroke();
        // 连接 (0, 0) 至圆弧另一端
        ctx.lineTo(r, 0);
        // 画出路径
        ctx.stroke();
        // 定义填充样式
        ctx.fillStyle = "#0ff";
        // 填充
        ctx.fill();
        // 移动画笔至 (0, 0)，不会创建线条
        ctx.moveTo(0, 0);
        // 还原第二次保存
        ctx.restore();

        // 第三次保存
        ctx.save();
        // 旋转当前画布至扇形的中心位置
        ctx.rotate(Math.PI/2 + eDeg-(eDeg-sDeg)/2);
        // 定义样式
        ctx.fillStyle = "#cc0000";
        ctx.font = "30px Microsoft YaHei";
        ctx.textAlign = "center";
        ctx.fillText(text, 0, -r*2/3);
        // 还原第三次保存
        ctx.restore();

        ctx.closePath();
        // 还原第一次保存
        ctx.restore();
    }
}