const {ccclass, property} = cc._decorator;
import {initialize} from "./method";
import global from "./global";

@ccclass
export default class Init extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        initialize();
    }
}
