const {ccclass, property} = cc._decorator;
import {loadItem, updateBuffer, mergeItem} from "./method";
import global from "./global";

@ccclass
export default class Click extends cc.Component {

    x:number; y:number; next_item:number; next_item2:number;

    insert(event) {
        // 如果某格已经有物品，不响应
        // cc.log(global.tiles[this.x][this.y]);
        if (global.tiles[this.x][this.y] == 0) {
            loadItem(this.x, this.y, this.next_item, this.next_item2);
            mergeItem(this.x, this.y);
            updateBuffer(false);
        };
        // cc.log(global.tiles);
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.x = Number(this.node.name.slice(5, 6));
        this.y = Number(this.node.name.slice(6, 7));
        this.node.on(cc.Node.EventType.TOUCH_END, this.insert, this)
    }

    // start () {}

    update (dt) {
        this.next_item = global.next_item;
        this.next_item2 = global.next_item2;
    }
}
