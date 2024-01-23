
var app = require("app");
cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        recordTimeLabel:cc.Label,
        recordIDLabel:cc.Label,

        juShuLabel:cc.Label,

        yinJiaNode1:cc.Node,
        yinJiaNode2:cc.Node,
        yinJiaNode3:cc.Node,
        yinJiaNode4:cc.Node,
    },

    //创建界面回掉
    OnCreateInit:function(){
        this.ComTool = app.ComTool();
        this.RoomRecordManager = app.RoomRecordManager();

        this.yinJiaNodeList = [this.yinJiaNode1, this.yinJiaNode2, this.yinJiaNode3, this.yinJiaNode4];
    },

    //显示
    OnShow:function(){
        let userData = this.GetFormProperty("UserData");

        this.yinJiaNode1.active = 0;
        this.yinJiaNode2.active = 0;
        this.yinJiaNode3.active = 0;
        this.yinJiaNode4.active = 0;

        this.SetRecordPlayerInfo(userData);

    },
    SetRecordPlayerInfo:function (userData) {
        let roomID = this.GetParent().GetRoomID();
        let allRecordList = this.RoomRecordManager.GetRoomRecordDetail(roomID);
        let recordList = allRecordList[userData];
        this.juShuLabel.string = recordList["setID"];
        this.recordTimeLabel.string = this.ComTool.GetDateYearMonthDayHourMinuteString(recordList["endSec"]);
        this.recordIDLabel.string = app.i18n.t("UIVideo_Child02_PaiJuID", {"PaiJuID":this.ComTool.GetPid(recordList["keyID"])});
        let playersList = recordList["players"];
        let pointList = recordList["point"];
        let setPoint = recordList["setPoint"];
        let setPointMax = this.ComTool.ListMaxNum(setPoint);
        let count = playersList.length;

        for(let i = 0; i < count; i++){
            let startPath = this.ComTool.StringAddNumSuffix("sp_info/nd_chengji", i+1, 2);
            let namePath = [startPath, "lb_name"].join("/");
            let IDPath = [startPath, "lb_id"].join("/");
            let chengJiPath = [startPath, "lb_chengji"].join("/");
            let zhongFenPath = [startPath, "sp_zongfen/lb_zongfen"].join("/");
            let headPath = [startPath, "touxiang/btn_head"].join("/");
            let headPathWeChatImage =  cc.find(headPath, this.node).getComponent("WeChatHeadImage");

            let player = playersList[i];

            let playerChengJi = 0;
            for(let j = 1; j <= userData; j++){
                let recordList = allRecordList[j];
                let setPoint = recordList["point"];
                playerChengJi += setPoint[i];
            }

            let playerZongFen = pointList[i];

            if(playerChengJi == setPointMax){
                this.yinJiaNodeList[i].active = 1;
            }
            else{
                this.yinJiaNodeList[i].active = 0;
            }

            let playerName = player["name"];
            let playerID = player["pid"];

            headPathWeChatImage.ShowHeroHead(playerID);
            this.GetWndComponent(namePath, cc.Label).string = this.ComTool.GetBeiZhuName(playerID,playerName);
            this.GetWndComponent(IDPath, cc.Label).string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(playerID)});
            this.GetWndComponent(chengJiPath, cc.Label).string = app.i18n.t("Integral",{"Integral":playerChengJi});
            this.GetWndComponent(zhongFenPath, cc.Label).string = app.i18n.t("UIVideo_Child_ZongFen", {"ZongFen":playerZongFen});

        }
    },
    //-------------点击函数-------------
    OnClick: function (btnName, btnNode) {

        if(btnName == "btn_benji"){
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        }
        else if(btnName == "btn_fenxiang"){
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        }
        else if(btnName == "btn_chakan"){
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        }
        else{
            this.ErrLog("OnClick not find btnName:%s", btnName);
        }

    },

});

