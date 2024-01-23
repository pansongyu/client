/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
    },

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },

    IsShowMulti2: function (huType) {
		let multi2 = [
            "GangJing", "AnGang", "MingGang"
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
    },
    
    LabelName: function (huType) {
        let huTypeDict = {};

        huTypeDict["GSKH"]="杠上开花";
        huTypeDict["QiangGangHu"]="抢杠胡";
        huTypeDict["GangHouPao"]="杠后炮";
        huTypeDict["MoHuaZiChong"]="摸花自冲";
        huTypeDict["MoHuaFangChong"]="摸花放冲";
        huTypeDict["PingHu"]="小胡";
        huTypeDict["PPHu"]="对对胡";
        huTypeDict["QD"]="七对";
        huTypeDict["QYS"]="清一色";
        huTypeDict["HYS"]="混一色";
        huTypeDict["MenQing"]="门清";
        huTypeDict["BaoTing"]="报听";
        huTypeDict["DD"]="单张独钓";
        huTypeDict["HDLY"]="海底捞月";
        huTypeDict["FengAnKe"]="风暗刻";
        huTypeDict["FengMingGang"]="风明杠";
        huTypeDict["MingGang"]="明杠";
        huTypeDict["FengAnGang"]="风暗杠";
        huTypeDict["AnGang"]="暗杠";
        huTypeDict["FengPeng"]="风碰";
        huTypeDict["QiongHen"]="穷狠";
        huTypeDict["YingHua"]="硬花";
        huTypeDict["HuPai"]="胡牌";
        huTypeDict["HuaFen"]="花分";
        huTypeDict["DunZiFen"]="墩子分";
        huTypeDict["PiaoFen"]="漂分";
        huTypeDict["Piao"]="飘";

        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return huTypeDict[huType];
    },
});
