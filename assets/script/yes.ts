import {yes} from './animation'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, yes, this)
    }
}
