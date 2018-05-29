/**
 * 读取文件
 * @param e 事件对象
 */
function getFileDate(e) {
    // 只读取文件列表中的第一项
    let file = e.target.files[0];
    // 判断文件是否存在
    if (file) {
        let reader = new FileReader();
        // 文件加载成功
        reader.onload = function(event) {
            // 处理数据
            let data = handleData(event.target.result);
            // 文件数据正确
            if (data !== undefined) {
                document.getElementById("fileBox").classList.add("hide");
                document.getElementById("canvasBox").classList.remove("hide");
                initPlate(data);
            } else {
                // 文件数据出错，清空文件选择框的值
                e.target.value = "";
            }
        };
        // 加载文本
        reader.readAsText(file);
    }
}

/**
 * 处理文件数据
 * @param data 原始数据
 */
function handleData(data) {
    // 分割
    let itemArr = data.split("\n");
    let result = {};
    // 存放奖项
    result.text = [];
    // 存放百分比
    result.radio = [];

    for (let i = 0; i < itemArr.length; i++) {
        // 过滤多余的空行
        if (itemArr[i] === "") {
            continue;
        } else {
            let itemKey = itemArr[i].split("=")[0];
            let itemVal = itemArr[i].split("=")[1];
            result.text.push(itemKey);
            // 不为空字符串 且 不为 NaN 且 为 number 类型
            if (itemVal !== "" && !isNaN(+itemVal) && typeof (+itemVal) == "number") {
                result.radio.push(+itemVal);
            }
        }
    }
    // 奖项和百分比不能一一对应
    if (result.text.length !== result.radio.length) {
        alert("文件错误！");
        return;
    // 百分比相加不等于 100
    } else if (eval(result.radio.join("+")) !== 100) {
        alert("百分比错误！");
        return;
    } else {
        return result;
    }
}

/**
 * 初始化转盘
 * @param data 文件的数据
 */
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

    // 转盘边框的宽度
    let lineW = 5;
    // 奖项数量
    let num = data.text.length;
    // 每个奖项占据的角度
    let sectorDeg = 360 / num;
    // 角度转弧度
    let deg = Math.PI / 180;
    // 轮数
    let round = 0;
    // 圆盘的出事角度
    let initCircleDeg = -90-sectorDeg/2;

    initCircle();
    initPointer();

    // 注册点击事件
    btn.onclick = function () {
        let randomNum = Math.random()*100;    // [0, 100)
        round++;

        // 叠加器
        data.radio.reduce((prev, curv, i) => {
            if (randomNum >= prev && randomNum < prev + curv) {
                runPlate(i, prev);
            }
            return prev + curv;
        }, 0);
    };

    /**
     * 初始化圆盘
     */
    function initCircle() {
        plateCanvas.style.transform = `rotate(${ initCircleDeg }deg)`;

        // 中心坐标
        let plateCenterX = plateCanvas.width/2;
        let plateCenterY = plateCanvas.height/2;
        // 半径
        let plateR = plateCenterX < plateCenterY ? plateCenterX-lineW : plateCenterY-lineW;

        for (let i = 0; i < num; i++) {
            // 绘制扇形
            drawSector(plateCtx, plateCenterX, plateCenterY, plateR, sectorDeg*i*deg, sectorDeg*(i+1)*deg, data.text[i]);
        }
        plateCanvas.style.transition = `transform 6s`;
    }

    /**
     * 初始化指针
     */
    function initPointer() {
        pointerCanvas.style.transform = `translate(-50%, -50%) rotate(-90deg)`;
        // 中心坐标
        let pointerCenterX = pointerCanvas.width/2;
        let pointerCenterY = pointerCanvas.height/2;
        // 半径
        let pointerR = pointerCenterX < pointerCenterY ? pointerCenterX/2 : pointerCenterY/2;

        pointerCtx.save();
        pointerCtx.beginPath();
        // 绘制圆形
        pointerCtx.arc(pointerCenterX, pointerCenterY, pointerR, Math.PI/10, Math.PI*2-Math.PI/10);
        pointerCtx.lineTo(pointerCenterX+pointerR*2, pointerCenterY);
        pointerCtx.closePath();
        pointerCtx.fillStyle = "#ff0000";
        pointerCtx.fill();
    }

    /**
     * 转动转盘
     * @param i 对应的奖项下标
     */
    function runPlate(i) {
        console.log(`下标：${ i } --- 文本：${ data.text[i] }`);
        // 按钮失能
        btn.setAttribute("disabled", "true");
        // 定时弹出框弹出
        setTimeout(function () {
            alert(data.text[i]);
        }, 6500);
        plateCanvas.style.transform = `rotate(${ initCircleDeg + 3600*round + sectorDeg*(num-i) }deg)`;
    }

    /**
     * 绘制扇形
     * @param ctx   canvas 的 context 实例
     * @param x     x 轴坐标
     * @param y     y 轴坐标
     * @param r     半径
     * @param sDeg  扇形开始的弧度
     * @param eDeg  扇形结束的弧度
     * @param text  文本
     */
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