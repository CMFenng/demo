function getFileDate(e) {
    let file = e.target.files[0];
    // 判断文件是否存在
    if (file) {
        let reader = new FileReader();
        // 文件加载成功
        reader.onload = function(e) {
            // 处理数据
            handleData(e.target.result);
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
                key: itemArr[i].split("=")[0],
                value: itemArr[i].split("=")[1]
            };
            arr.push(obj);
        }
    }
    console.log(arr);
}