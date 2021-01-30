class GlobalData {

    public HIGHEST_LEVEL = 5;  // 何时触发

    public next_item:number = 0;
    public next_item2:number = 0;

    public score:number = 0;

    public tiles:number[][] = [
        [0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];  // 左右上下各多一层，方便在合并时做判断

    public item_dict = {1:0, 2:0, 3:0, 4:0};

    public skill_res:number = 5;
}

export default new GlobalData();