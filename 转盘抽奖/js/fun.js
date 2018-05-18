function getFileDate(e) {
    let file = e.target.files[0];
    // 判断文件是否存在
    if (file) {
        let reader = new FileReader();
        // 文件加载成功
        reader.onload = function(e) {
            // 处理数据
            let data = handleData(e.target.result);
            if (data !== undefined) {
                document.getElementById("box1").classList.add("hide");
                document.getElementById("box2").classList.remove("hide");
                initPlate(data);
            }
        };
        reader.readAsText(file);
    }
}

function handleData(data) {
    // 分割
    let itemArr = data.split("\n");
    let result = {};
    result.text = [];
    result.radio = [];

    for (let i = 0; i < itemArr.length; i++) {
        // 过滤多余的空行
        if (itemArr[i] === "") {
            continue;
        } else {
            result.text.push(itemArr[i].split("=")[0]);
            result.radio.push(+itemArr[i].split("=")[1]);
        }
    }
    if (eval(result.radio.join("+")) !== 100) {
        alert("文件错误或百分比错误！");
        return;
    }
    return result;
}


//====================================


// 初始化转盘
function initPlate(data) {
    // let data = {
    //     text: ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "谢谢参与"],
    //     radio: [5, 7, 10, 15, 18, 20, 25]
    // };

    let plateCanvas = document.getElementById("plate");
    let plateCtx = plateCanvas.getContext("2d");
    let pointerCanvas = document.getElementById("pointer");
    let pointerCtx = pointerCanvas.getContext("2d");
    let btn = document.getElementById("btn");

    let lineW = 5;
    let num = data.text.length;
    let sectorDeg = 360 / num;
    // 角度转弧度
    let deg = Math.PI / 180;
    let round = 0;
    let initCircleDeg = -90-sectorDeg/2;

    initCircle();
    initPointer();

    btn.onclick = function () {
        let randomNum = Math.random()*100;    // [0, 100)
        round++;

        data.radio.reduce((prev, curv, i) => {
            if (randomNum >= prev && randomNum < prev + curv) {
                runPlate(i, prev);
            }
            return prev + curv;
        }, 0);
    };

    // 初始化圆盘
    function initCircle() {
        plateCanvas.style.transform = `rotate(${ initCircleDeg }deg)`;

        let plateCenterX = plateCanvas.width/2;
        let plateCenterY = plateCanvas.height/2;
        let plateR = plateCenterX < plateCenterY ? plateCenterX-lineW : plateCenterY-lineW;

        for (let i = 0; i < num; i++) {
            drawSector(plateCtx, plateCenterX, plateCenterY, plateR, sectorDeg*i*deg, sectorDeg*(i+1)*deg, data.text[i]);
        }
        plateCanvas.style.transition = `transform 6s`;
    }

    // 初始化指针
    function initPointer() {
        pointerCanvas.style.transform = `translate(-50%, -50%) rotate(-90deg)`;
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

    // 转动圆盘
    function runPlate(i) {
        console.log(`下标：${ i } --- 文本：${ data.text[i] }`);
        setTimeout(function () {
            alert(`恭喜你，抽中 ${ data.text[i] }！`);
        }, 6000);
        plateCanvas.style.transform = `rotate(${ initCircleDeg + 3600*round + sectorDeg*(num-i) }deg)`;
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