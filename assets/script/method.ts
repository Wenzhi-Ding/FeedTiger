import global from "./global";
import {getRandomInt, getItemPosition, getRandomArrayElements} from "./tool";
import {mergeItemAnim} from "./animation";


// 将动态加载封装
export function loadItem (x:number, y:number, item:number, item2:number) {
    let target_tile = cc.find('Canvas/Board/Tile_' + x + y);
    
    var _item = item * 10 + item2;
    cc.resources.load('物品' + _item, cc.SpriteFrame, function(err, assets) {
        target_tile.getComponent(cc.Sprite).spriteFrame = <cc.SpriteFrame> assets;
    });
    global.tiles[x][y] = item;
    if (item > 0 && item < 5) {
        global.item_dict[item] += 1;
    }
    return 1;
}


// 更新缓存区
export function updateBuffer (flag:Boolean) {
    var next_item:number = getRandomInt(2) + 1;
    var next_item2:number = getRandomInt(3);
    var _next_item = next_item * 10 + next_item2;
    if (flag == true) {
        next_item = 5;
        _next_item = 50;
    };
    let target_tile:cc.Node = cc.find('Canvas/Info/Next_Item/Tile');
    target_tile.opacity = 0;
    cc.resources.load('物品' + _next_item, cc.SpriteFrame, function(err, assets) {
        target_tile.getComponent(cc.Sprite).spriteFrame = <cc.SpriteFrame> assets;
    });
    cc.tween(target_tile).to(1, {opacity: 255}).start();
    global.next_item = next_item;
    global.next_item2 = next_item2;
    // cc.log(global.next_item)
}


// 更新分数
export function updateScore () {
    cc.find('Canvas/Info/Score/Label').getComponent(cc.Label).string = String(global.score);
}


// 更新技能剩余次数
function updateSkill () {
    cc.find('Canvas/Info/Btn_Skill/Label').getComponent(cc.Label).string = '乾坤大挪移(' + global.skill_res + ')';
}


// 初始化
export function initialize () {
    cc.game.setFrameRate(15);
    cc.find('Canvas/Alert').active = false;
    cc.find('Canvas/Board').active = true;

    // 初始化全局变量
    global.score = 0;
    global.tiles = [
        [0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];  // 左右上下各多一层，方便在合并时做判断
    global.item_dict = {1:0, 2:0, 3:0, 4:0};
    global.skill_res = 5;

    // 初始化显示分数和技能次数
    updateScore();
    updateSkill();

    // 初始化棋盘状态
    var i, j:number;
    for (i = 1; i <= 4; i++) {
        for (j = 1; j <= 4; j++) {
            loadItem(i, j, 0, 0);  // 物品0表示空图
        };
    };

    // 随机生成两个初始物品
    var flag:number = 0;
    var x:number, y:number, item:number, item2:number;
    while (flag < 2) {
        x = getRandomInt(4) + 1;
        y = getRandomInt(4) + 1;
        item = getRandomInt(2) + 1;  // 物品从1开始计数，只刷新前2种
        item2 = getRandomInt(3);
        // cc.log(x, y, item);
        if (global.tiles[x][y] == 0) {
            flag += loadItem(x, y, item, item2);
        };
    };

    // 随机生成缓冲区物品
    updateBuffer(false);
}


// 合并三连
export function mergeItem (x:number, y:number) {
    // 横向纵向分别判断
    var horz:number = 1;
    var horz_mark:number[][] = [];
    var vert:number = 1;
    var vert_mark:number[][] = [];
    var item:number = global.tiles[x][y];

    
    
    var _y = y;
    while (global.tiles[x][_y - 1] == item) {
        _y -= 1;
        horz += 1;
        horz_mark.push([x, _y]);
    }

    var _y = y;
    while (global.tiles[x][_y + 1] == item) {
        _y += 1;
        horz += 1;
        horz_mark.push([x, _y]);
    }

    var _x = x;
    while (global.tiles[_x - 1][y] == item) {
        _x -= 1;
        vert += 1;
        vert_mark.push([_x, y]);
    }

    var _x = x;
    while (global.tiles[_x + 1][y] == item) {
        _x += 1;
        vert += 1;
        vert_mark.push([_x, y]);
    }

    var final_mark:number[][] = [];
    if (horz >= 3) {
        final_mark = final_mark.concat(horz_mark);
    };
    if (vert >= 3) {
        final_mark = final_mark.concat(vert_mark);
    };

    if (final_mark.length > 0) {
        var target_item:number = item + 1;
        if (final_mark.length >= 3 && target_item < 4) {  // 超过3连，此处大于等于3表示有3个或以上其他方块要合并过来
            target_item += 1;  // 在原先基础上多升一级
        };

        cc.log("merging", item);
        
        global.item_dict[item] = global.item_dict[item] - final_mark.length - 1;
        global.score += Math.pow(2, target_item + 1) * 10;
        updateScore();
        mergeItemAnim(final_mark, x, y, target_item);
    }
}


// 乾坤大挪移的逻辑
export function skill () {
    if (global.skill_res > 0) {
        for (var item = 1; item <=4; item++) {
            if (global.item_dict[item] >= 3) {  // 稍后改成while
                let marks = getRandomArrayElements(getItemPosition(item), 3);
                let target_x = marks[2][0];
                let target_y = marks[2][1];
                marks.pop();
                mergeItemAnim(marks, target_x, target_y, item + 1);
                global.item_dict[item] -= 3;
                // cc.log(item, global.item_dict[item]);
                global.skill_res -= 1;
                updateSkill();
                break;
            };
        };
    };
}