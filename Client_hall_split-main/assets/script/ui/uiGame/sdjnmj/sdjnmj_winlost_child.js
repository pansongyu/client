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
            if (huType == "Huang") {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint + "番");
            } else if (this.IsShowMulti2(huType)) {
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*2");
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*X" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },

    IsShowMulti2: function (huType) {
		let multi2 = ["DiFen", "PiaoHua", "HuaGang", "TianTing"];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
    },
    
    LabelName: function (huType) {
        let LabelArray = {
            PingHu: "平胡",
            GSKH: "杠开",
            Hua: "花胡",
            QYS: "清一色",
            HYS: "混一色",
            TianHu: "天胡",
            DiHu: "地胡",
            Long: "一条龙",
            PPH: "对对胡",
            JiangJiangHu: "将将胡",
            Huang: "荒庄",
            QDHu: "七对",
            DiFen: "底花",
            PiaoHua: "补花",
            HuaGang: "手花",
            Gen: "跟庄",
            TianTing: "明楼"
        };
        if (!LabelArray.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return LabelArray[huType];
    }
});
