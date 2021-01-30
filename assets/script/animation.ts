import global from "./global";
import {loadItem, mergeItem, updateScore, updateBuffer} from "./method";
import { getRandomInt } from "./tool";


// 点到点的动画封装
function addHocAnim (source_x:number, source_y:number, target_x:number, target_y:number) {
    // cc.log('addHocAnim()', source_x, source_y, target_x, target_y);
    let source_tile = cc.find('Canvas/Board/Tile_' + source_x + source_y);
    let target_tile = cc.find('Canvas/Board/Tile_' + target_x + target_y);
    // cc.log(source_tile.x, source_tile.y, source_tile.opacity);
    cc.tween(source_tile)
        // .call(() => {cc.log('execute anim')})
        .to(0.3, {position: cc.v3(target_tile.x, target_tile.y, 0), opacity: 0})
        .to(0.001, {position: cc.v3(source_tile.x, source_tile.y, 0)})  // 复位
        .call(() => {loadItem(source_x, source_y, 0, 0)})  // 趁透明度0换图
        .delay(0.5)
        .to(0.1, {opacity: 255})
        .start();
}


// 合并的动画单独写
export function mergeItemAnim (marks:number[][], target_x:number, target_y:number, target_item:number) {
    for (var i = 0; i < marks.length; i++) {
        var mark = marks[i];
        let source_x = mark[0];
        let source_y = mark[1];
        addHocAnim(source_x, source_y, target_x, target_y);
        global.tiles[source_x][source_y] = 0;
        // cc.log('In for');
    };
    var target_item2 = getRandomInt(3)
    if (target_item == 5) {
        target_item2 = 0;
    }
    loadItem(target_x, target_y, target_item, target_item2);

    // 结束游戏前的强调动画
    if (target_item >= global.HIGHEST_LEVEL) {
        let diamond:cc.Node = cc.find('Canvas/Board/Tile_' + target_x + target_y);
        let blink = cc.tween()
                        .to(0.2, {opacity: 0})
                        .to(0.2, {opacity: 255});
        cc.tween(diamond)
            .repeat(2, blink)
            .to(1, {angle: 360})
            .repeat(2, blink )
            .call(() => {endGame();})
            .start();
    };

    // 迭代判断（等待0.5秒）
    setTimeout(() => {
        mergeItem(target_x, target_y);
    }, 500);
}


// 结束
function endGame () {
    cc.find('Canvas/Alert/Thank').active = false;
    
    let alert:cc.Node = cc.find('Canvas/Alert');
    let board:cc.Node = cc.find('Canvas/Board');
    alert.opacity = 0;
    alert.active = true;
    cc.tween(board).to(0.5, {opacity: 0}).start();
    cc.tween(alert).to(0.5, {opacity: 255}).start();
    board.active = false;
    
    global.score = 5201314;
    updateScore();
    updateBuffer(true);  
}


export function yes () {
    let text:cc.Node = cc.find('Canvas/Alert/Text');
    let yes1:cc.Node = cc.find('Canvas/Alert/Btn_Yes1');
    let yes2:cc.Node = cc.find('Canvas/Alert/Btn_Yes2');
    let thank:cc.Node = cc.find('Canvas/Alert/Thank');  // 后面换最新的“欢呼”和“开心”吧


    cc.tween(text).to(1, {y: 280, scale: 0.8}).start();
    cc.tween(yes1).to(1, {y: 50}).start();
    cc.tween(yes2).to(1, {y: 50}).start();

    thank.opacity = 0;
    thank.active = true;
    cc.tween(thank)
        .to(1, {opacity: 0})
        .to(1, {opacity: 255})
        .start();
}