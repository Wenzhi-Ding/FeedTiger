const {ccclass, property} = cc._decorator;
import {initialize} from './method'

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, initialize, this)
    }

}
