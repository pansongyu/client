(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubUserMessage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd61ddKhQw1Ng7YSQhXj9itq', 'UIClubUserMessage', __filename);
// script/ui/club/UIClubUserMessage.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        jiantouSprite: [cc.SpriteFrame]
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.btn_msg_more = this.node.getChildByName("time").getChildByName("btn_msg_more");
        this.btn_msg_sanshitian = this.node.getChildByName("time").getChildByName("btn_msg_sanshitian");
        this.btn_msg_santian = this.node.getChildByName("time").getChildByName("btn_msg_santian");
        this.btn_msg_yesterday = this.node.getChildByName("time").getChildByName("btn_msg_yesterday");
        this.btn_msg_today = this.node.getChildByName("time").getChildByName("btn_msg_today");
        this.pidEditBox = this.node.getChildByName("pidEditBox").getComponent(cc.EditBox);
        this.execPidEditBox = this.node.getChildByName("execPidEditBox").getComponent(cc.EditBox);
        var messageScrollView = this.node.getChildByName("messageScrollView");
        //messageScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);

        messageScrollView.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);

        this.clubNameColor = "<color=#fa59bc>";
        this.nameColor = "<color=#67b619>";
        this.actionColor = "<color=#e94817>";
        this.valueColor = "<color=#e6910b>";
        /**
         * 赛事疲劳值增加
         */
        this.UNION_EXEC_SPORTS_POINT_ADD = 1;
        /**
         * 赛事疲劳值减少
         */
        this.UNION_EXEC_SPORTS_POINT_MINUS = 2;

        /**
         * 分层修改
         */
        this.UNION_EXEC_BILI_CHANGE = 3;
        /**
         * 预留值修改
         */
        this.UNION_EXEC_RESERVED_VALUE_CHANGE = 48;
        /**
         * 推广员预警值关闭
         */
        this.UNION_EXEC_SPORTS_WARNING_CLOSE = 40;
        /**
         * 推广员预警值修改
         */
        this.UNION_EXEC_SPORTS_WARNING_CHANGE = 41;
        /**
         * 个人预警值关闭
         */
        this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CLOSE = 46;
        /**
         * 个人预警值修改
         */
        this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CHANGE = 47;
        /**
         * 亲友圈疲劳值增加
         */
        this.UNION_CLUB_EXEC_SPORTS_POINT_ADD = 114;
        /**
         * 亲友圈疲劳值减少
         */
        this.UNION_CLUB_EXEC_SPORTS_POINT_MINUS = 115;
        /**
         * 房费竞技点
         */
        this.UNION_ROOM_EXEC_SPORTS_POINT = 119;
        /**
         * 比赛分增加
         */
        this.UNION_ROOM_EXEC_SPORTS_POINT_ADD = 120;
        /**
         * 比赛分减少
         */
        this.UNION_ROOM_EXEC_SPORTS_POINT_MINUS = 121;
        /**
         * 授权增加比赛分
         */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD = 122;
        /**
         * 授权减少比赛分
         */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS = 123;

        /**
         * 补偿增加比赛分
         */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD = 124;
        /**
         * 补偿减少比赛分
         */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS = 125;
        /**
         * 报名费增加
         */
        this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADD = 126;
        /**
         * 洗牌消耗的比赛分
         */
        this.UNION_ROOM_QIEPAI_CONSUME = 129;
        /**
         * 洗牌收入的比赛分
         */
        this.UNION_ROOM_QIEPAI_INCOME = 130;
        /**
        * 授权增加比赛分
        */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD_SELF = 131;
        /**
        * 授权减少比赛分
        */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS_SELF = 132;

        /**
        * 补偿增加比赛分
        */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD_SELF = 133;
        /**
        * 补偿减少比赛分
        */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS_SELF = 134;
        /**
         * 发起审核增加比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_EXE = 137;
        /**
         * 发起审核减少比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_EXE = 138;
        /**
         * 被审核增加比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_OP = 139;
        /**
         * 被审核减少比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_Op = 140;
        /**
         * 报名费增加新类型
         */
        this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADDNew = 1006;
        /**
         * 保险箱增加新类型
         */
        this.PLAYER_CASE_SPORTS_POINT_ADD = 1009;
        /**
         * 保险箱减少新类型
         */
        this.PLAYER_CASE_SPORTS_POINT_SUB = 1010;
        /**
         * 保险箱关闭新类型
         */
        this.UNION_CASE_SPORTS_POINT_CLOSE = 1011;
        /**
         * 被踢出，玩家强制从保险箱取出
         */
        this.UNION_CASE_SPORTS_POINT_TICHU = 1012;
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, unionId, unionName, unionSign) {
        var pid = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var opClubId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;


        var messageScrollView = this.node.getChildByName("messageScrollView");
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        this.DestroyAllChildren(content);
        messageScrollView.getComponent(cc.ScrollView).scrollToTop();
        content.getComponent(cc.Layout).updateLayout();
        this.clubId = clubId;
        this.unionId = unionId;
        this.pid = pid;
        this.opClubId = opClubId;
        this.curDateType = 0;
        this.chooseType = 0;
        this.pidEditBox.string = "";
        this.execPidEditBox.string = "";
        var btn_default = this.node.getChildByName("time").getChildByName("btn_msg_today");
        this.OnClick(btn_default.name, btn_default);
        this.InitShowType();
    },

    InitShowType: function InitShowType() {
        var showType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.showType = showType;
        this.chooseType = showType;
        var tab = this.node.getChildByName('tab');
        if (this.showType == 0) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 1) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 2) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 3) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 4) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 5) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = false;
        } else if (this.showType == 6) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_yichang").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_duiju").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoming").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_xipai").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_fencheng").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_baoxianxiang").getChildByName("checkmark").active = true;
        }
    },

    OnTouch: function OnTouch(event) {
        if ('touchstart' == event.type) {} else if ('touchend' == event.type || 'touchcancel' == event.type) {
            //滑动结束动。检测哪些节点需要渲染
            this.CheckMessageDisplay();
        } else if ('touchmove' == event.type) {}
    },
    /*GetMessageDetail:function(){
        this.serverPack
    }, */
    CheckMessageDisplay: function CheckMessageDisplay() {
        var messageScrollView = this.node.getChildByName("messageScrollView");
        var ScrollOffset = messageScrollView.getComponent(cc.ScrollView).getScrollOffset();
        var gundongY = ScrollOffset.y;
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        content.getComponent(cc.Layout).updateLayout();
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < content.children.length; i++) {
            if (content.children[i].y + gundongY > -1300) {
                //需要渲染
                if (content.children[i].isDisplay == false) {
                    //开始渲染,把空节点替换成真实节点
                    var nullNode = content.children[i];
                    nullNode.isDisplay = true;
                    var child = cc.instantiate(demo);
                    child.getChildByName("lb_time").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayHourMinuteString(this.serverPack[i].execTime);
                    var lb_message = child.getChildByName("lb_message").getComponent(cc.RichText);
                    var msgStr = "";
                    var clubNameStr = "";
                    if (typeof this.serverPack[i].clubName != "undefined" && typeof this.serverPack[i].clubSign != "undefined") {
                        clubNameStr = "亲友圈" + this.clubNameColor + this.serverPack[i].clubName + "[" + this.serverPack[i].clubSign + "]</c>";
                    }
                    var execClubNameStr = "";
                    if (typeof this.serverPack[i].execClubName != "undefined" && typeof this.serverPack[i].execClubSign != "undefined") {
                        execClubNameStr = "亲友圈" + this.clubNameColor + this.serverPack[i].execClubName + "[" + this.serverPack[i].execClubSign + "]</c>";
                    }
                    var NameStr = "";
                    if (typeof this.serverPack[i].name != "undefined" && typeof this.serverPack[i].pid != "undefined") {
                        NameStr = "玩家" + this.nameColor + this.ComTool.GetBeiZhuName(this.serverPack[i].pid, this.serverPack[i].name) + "[" + this.serverPack[i].pid + "]</c>";
                    }
                    var execNameStr = "";
                    if (typeof this.serverPack[i].execName != "undefined" && typeof this.serverPack[i].execPid != "undefined") {
                        execNameStr = "玩家" + this.nameColor + this.ComTool.GetBeiZhuName(this.serverPack[i].execPid, this.serverPack[i].execName) + "[" + this.serverPack[i].execPid + "]</c>";
                    }
                    var roomKey = "";
                    if (typeof this.serverPack[i].roomKey != "undefined") {
                        roomKey = "[" + this.nameColor + this.serverPack[i].roomKey + "]</c>";
                    }
                    var curValueStr = "";
                    if (typeof this.serverPack[i].curValue != "undefined") {
                        curValueStr = "，当前比赛分为" + this.serverPack[i].curValue;
                    }
                    if (typeof this.serverPack[i].preValue != "undefined") {
                        curValueStr = curValueStr + "，您当前剩余比赛分" + this.serverPack[i].preValue;
                    }
                    switch (this.serverPack[i].execType) {
                        case this.UNION_EXEC_SPORTS_POINT_ADD:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "因比赛异常补偿/处罚</c>了比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_SPORTS_POINT_MINUS:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "因比赛异常补偿/处罚</c>了比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_BILI_CHANGE:
                            if (typeof this.serverPack[i].msg != "undefined") {
                                msgStr = NameStr + "因上级推广员修改" + this.actionColor + "报名费" + this.valueColor + this.serverPack[i].msg + "</c>分成，之前" + this.valueColor + this.serverPack[i].curValue + "," + "当前为：" + this.serverPack[i].value + "</c>";
                            } else {
                                msgStr = NameStr + "因上级推广员修改" + this.actionColor + "报名费</c>分成，之前" + this.valueColor + this.serverPack[i].curValue + "," + "当前为：" + this.serverPack[i].value + "</c>";
                            }
                            break;
                        case this.UNION_EXEC_RESERVED_VALUE_CHANGE:
                            msgStr = clubNameStr + NameStr + "被上级推广员" + execClubNameStr + execNameStr + this.actionColor + "通过预留设置修改</c>了报名费分成";
                            break;
                        case this.UNION_EXEC_SPORTS_WARNING_CLOSE:
                            msgStr = execNameStr + this.actionColor + "关闭</c>了" + NameStr + "的推广预警值";
                            break;
                        case this.UNION_EXEC_SPORTS_WARNING_CHANGE:
                            msgStr = execNameStr + this.actionColor + "修改</c>了" + NameStr + "的推广预警值为" + this.valueColor + this.serverPack[i].curValue + "，修改前为" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CLOSE:
                            msgStr = execNameStr + this.actionColor + "关闭了</c>" + NameStr + this.actionColor + "个人预警值";
                            break;
                        case this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CHANGE:
                            msgStr = execNameStr + this.actionColor + "修改了</c>" + NameStr + this.actionColor + "的个人预警值为" + this.valueColor + this.serverPack[i].curValue + "，修改前为" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_CLUB_EXEC_SPORTS_POINT_ADD:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "授权增加</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_CLUB_EXEC_SPORTS_POINT_MINUS:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "授权减少</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_EXEC_SPORTS_POINT:
                            msgStr = NameStr + "因房间" + roomKey + this.actionColor + "报名费</c>比赛分减少了" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_EXEC_SPORTS_POINT_ADD:
                            msgStr = NameStr + "参与房间" + roomKey + "对局比赛分" + this.actionColor + "增加了</c>" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_EXEC_SPORTS_POINT_MINUS:
                            msgStr = NameStr + "参与房间" + roomKey + "对局比赛分" + this.actionColor + "减少了</c>" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "授权增加</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "授权减少</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "因比赛异常补偿</c>了比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS:
                            msgStr = clubNameStr + NameStr + "被" + execClubNameStr + execNameStr + this.actionColor + "因比赛异常处罚</c>了比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADD:
                            msgStr = NameStr + "因房间" + roomKey + this.actionColor + "报名费</c>比赛分返还了" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD_SELF:
                            msgStr = "因对" + execClubNameStr + execNameStr + "比赛分进行了" + this.actionColor + "异常补偿</c>，您的比赛分减少了" + this.valueColor + this.serverPack[i].value + "</c>" + "，您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS_SELF:
                            msgStr = "因对" + execClubNameStr + execNameStr + "比赛分进行了" + this.actionColor + "异常处罚</c>，您的比赛分增加了" + this.valueColor + this.serverPack[i].value + "</c>" + "，您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD_SELF:
                            msgStr = "因对" + execClubNameStr + execNameStr + "比赛分进行了" + this.actionColor + "授权增加</c>，您的比赛分减少了" + this.valueColor + this.serverPack[i].value + "</c>" + "，您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS_SELF:
                            msgStr = "因对" + execClubNameStr + execNameStr + "比赛分进行了" + this.actionColor + "授权减少</c>，您的比赛分增加了" + this.valueColor + this.serverPack[i].value + "</c>" + "，您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_EXE:
                            msgStr = "因对" + execClubNameStr + execNameStr + "进行了" + this.actionColor + "审核</c>，您的比赛分增加了" + this.valueColor + this.serverPack[i].value + "</c>" + "，审核后您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_EXE:
                            msgStr = "因对" + execClubNameStr + execNameStr + "进行了" + this.actionColor + "审核</c>，您的比赛分减少了" + this.valueColor + this.serverPack[i].value + "</c>" + "，审核后您当前剩余比赛分" + this.serverPack[i].preValue;
                            break;
                        case this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_OP:
                            msgStr = clubNameStr + NameStr + this.actionColor + "审核增加了</c>" + execClubNameStr + execNameStr + "的比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + "，审核后比赛分" + this.serverPack[i].curValue;
                            if (typeof this.serverPack[i].preValue != "undefined") {
                                msgStr += ",您当前剩余比赛分为" + this.serverPack[i].preValue;
                            }
                            break;
                        case this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_Op:
                            msgStr = clubNameStr + NameStr + this.actionColor + "审核减少了</c>" + execClubNameStr + execNameStr + "的比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + "，审核后比赛分" + this.serverPack[i].curValue;
                            if (typeof this.serverPack[i].preValue != "undefined") {
                                msgStr += ",您当前剩余比赛分为" + this.serverPack[i].preValue;
                            }
                            break;
                        case 1008: //跟1006一样
                        case this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADDNew:
                            msgStr = NameStr + "因房间" + roomKey + this.actionColor + "报名费</c>比赛分返还了" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_QIEPAI_CONSUME:
                            msgStr = "因在房间" + roomKey + this.actionColor + "使用切牌功能</c>消耗比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_ROOM_QIEPAI_INCOME:
                            msgStr = "因" + execClubNameStr + execNameStr + "在房间" + roomKey + this.actionColor + "使用切牌功能</c>获得比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.PLAYER_CASE_SPORTS_POINT_ADD:
                            msgStr = "从身上转入比赛分" + this.valueColor + this.serverPack[i].value + "至保险箱，转出后身上剩余比赛分" + this.valueColor + this.serverPack[i].preValue + "，保险箱比赛分" + this.valueColor + this.serverPack[i].curValue;
                            break;
                        case this.PLAYER_CASE_SPORTS_POINT_SUB:
                            msgStr = "从保险箱中转出比赛分" + this.valueColor + this.serverPack[i].value + "至身上，转出后身上剩余比赛分" + this.valueColor + this.serverPack[i].preValue + "，保险箱比赛分" + this.valueColor + this.serverPack[i].curValue;
                            break;
                        case this.UNION_CASE_SPORTS_POINT_CLOSE:
                            msgStr = "因保险箱功能关闭，从保险箱中转出比赛分" + this.valueColor + this.serverPack[i].value + "至身上，转出后身上剩余比赛分" + this.valueColor + this.serverPack[i].preValue + "，保险箱比赛分" + this.valueColor + this.serverPack[i].curValue;
                            break;
                        case this.UNION_CASE_SPORTS_POINT_TICHU:
                            msgStr = "将" + NameStr + "踢出亲友圈，从该玩家保险箱中取出" + this.valueColor + this.serverPack[i].value + "比赛分，取出后您身上比赛分为" + this.valueColor + this.serverPack[i].preValue;
                            break;
                        default:
                            msgStr = "位置消息类型:" + this.serverPack[i].execType;
                            break;
                    }
                    lb_message.string = msgStr;
                    child.active = true;
                    nullNode.addChild(child);
                }
            }
        }
    },

    ShowBtn: function ShowBtn() {
        this.btn_msg_today.active = false;
        this.btn_msg_yesterday.active = false;
        this.btn_msg_santian.active = false;
        this.btn_msg_sanshitian.active = false;
        var btnLable = this.btn_msg_more.getChildByName("label").getComponent(cc.Label);
        if (this.curDateType == 0) {
            btnLable.string = "今  天";
        } else if (this.curDateType == 1) {
            btnLable.string = "昨  天";
        } else if (this.curDateType == 2) {
            btnLable.string = "近三天";
        } else if (this.curDateType == 3) {
            btnLable.string = "近三十天";
        } else if (this.curDateType == 5) {
            btnLable.string = "近七天";
        }
    },

    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        this.ShowBtn();
        var messageScrollView = this.node.getChildByName("messageScrollView");
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.DestroyAllChildren(content);
            messageScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.getComponent(cc.Layout).updateLayout();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = new cc.Node();
            child.width = demo.width;
            child.height = demo.height;
            child.active = true;
            child.isDisplay = false;
            child.execType = serverPack[i].execType;
            child.messageID = i;
            content.addChild(child);
        }
        this.serverPack = serverPack;
        this.CheckMessageDisplay();
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_msg_more' == btnName) {
            this.btn_msg_today.active = !this.btn_msg_today.active;
            this.btn_msg_yesterday.active = !this.btn_msg_yesterday.active;
            this.btn_msg_santian.active = !this.btn_msg_santian.active;
            //this.btn_msg_sanshitian.active = !this.btn_msg_sanshitian.active;
            var img_jiantou = this.btn_msg_more.getChildByName("img_jiantou").getComponent(cc.Sprite);
            if (this.btn_msg_today.active) {
                img_jiantou.spriteFrame = this.jiantouSprite[1];
            } else {
                img_jiantou.spriteFrame = this.jiantouSprite[0];
            }
        } else if ('btn_msg_today' == btnName) {
            this.curDateType = 0;
            this.SendPackByType(true);
        } else if ('btn_msg_yesterday' == btnName) {
            this.curDateType = 1;
            this.SendPackByType(true);
        } else if ('btn_msg_santian' == btnName) {
            this.curDateType = 2;
            this.SendPackByType(true);
        } else if ('btn_msg_sanshitian' == btnName) {
            this.curDateType = 3;
            this.SendPackByType(true);
        } else if ('btn_all' == btnName) {
            // this.filterShow(0);
            this.InitShowType(0);
            this.SendPackByType(true);
        } else if ('btn_yichang' == btnName) {
            // this.filterShow(1);
            this.InitShowType(1);
            this.SendPackByType(true);
        } else if ('btn_duiju' == btnName) {
            // this.filterShow(2);
            this.InitShowType(2);
            this.SendPackByType(true);
        } else if ('btn_baoming' == btnName) {
            // this.filterShow(3);
            this.InitShowType(3);
            this.SendPackByType(true);
        } else if ('btn_xipai' == btnName) {
            // this.filterShow(4);
            this.InitShowType(4);
            this.SendPackByType(true);
        } else if ('btn_fencheng' == btnName) {
            // this.filterShow(5);
            this.InitShowType(5);
            this.SendPackByType(true);
        } else if ('btn_baoxianxiang' == btnName) {
            // this.filterShow(6);
            this.InitShowType(6);
            this.SendPackByType(true);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },
    filterShow: function filterShow(type) {
        //各个类型的消息id
        var typeList = { 0: [], 1: [122, 123, 124, 125, 137, 138, 139, 140], 2: [1, 2, 114, 115, 120, 121], 3: [119, 126, 1006, 1008], 4: [129, 130], 5: [3], 6: [1009, 1010, 1011, 1012] };
        var match = typeList[type];
        var messageScrollView = this.node.getChildByName("messageScrollView");
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        messageScrollView.getComponent(cc.ScrollView).scrollToTop();

        var demo = this.node.getChildByName("demo");
        for (var i = 0; i < content.children.length; i++) {
            var execType = content.children[i].execType;
            if (match.length > 0) {
                if (match.indexOf(execType) > -1) {
                    content.children[i].active = true;
                } else {
                    content.children[i].active = false;
                }
            } else {
                content.children[i].active = true;
            }
        }
        this.CheckMessageDisplay();
    },
    SendPackByType: function SendPackByType(isRefresh) {
        // this.InitShowType();   //默认获取全部数据
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.getType = this.curDateType;
        sendPack.chooseType = this.chooseType;
        var self = this;
        if (this.pid == 0) {
            app.NetManager().SendPack("club.CClubSportsPointDynamicByPid", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else {
            if (this.opClubId == 0) {
                sendPack.pid = this.pid;
                app.NetManager().SendPack("club.CClubSportsPointMemberDynamicByPid", sendPack, function (serverPack) {
                    self.UpdateScrollView(serverPack, isRefresh);
                }, function () {
                    // app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
                });
            } else {
                sendPack.opPid = this.pid;
                sendPack.opClubId = this.opClubId;
                app.NetManager().SendPack("union.CUnionSportsPointMemberDynamicByPid", sendPack, function (serverPack) {
                    self.UpdateScrollView(serverPack, isRefresh);
                }, function () {
                    // app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
                });
            }
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIClubUserMessage.js.map
        