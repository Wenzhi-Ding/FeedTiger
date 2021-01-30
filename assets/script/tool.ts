import global from "./global";


// 生成随机数
export function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// 遍历网格取坐标
export function getItemPosition (item) {
    let marks:number[][] = [];
    for (var i = 1; i <= 4; i++) {
        for (var j = 1; j <= 4; j++) {
            if (global.tiles[i][j] == item) {
                marks.push([i, j]);
            };
        };
    };
    return marks;
}


// 列表随机取N个元素
export function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}