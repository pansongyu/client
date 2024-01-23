"use strict";
cc._RF.push(module, 'fbdf4VJ1RxPkbZkJdgN+x1P', 'UIClubMessage');
// script/ui/club/UIClubMessage.js

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
        // messageScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);

        messageScrollView.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
        messageScrollView.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);

        this.clubNameColor = "<color=#fa59bc>";
        this.nameColor = "<color=#67b619>";
        this.actionColor = "<color=#e94817>";
        this.valueColor = "<color=#e6910b>";
        //亲友圈成员消息动态
        /**
         * 推广员预警值关闭
         */
        this.UNION_EXEC_SPORTS_WARNING_CLOSE = 40;
        /**
         * 推广员预警值修改
         */
        this.UNION_EXEC_SPORTS_WARNING_CHANGE = 41;
        /**
         * 亲友圈收益变为区间分成
         */
        this.UNION_EXEC_SHARE_SECTION = 49;
        /**
         * 推广员区间分成修改
         */
        this.PROMOTION_EXEC_SHARE_SECTION_CHANGE = 50;
        /**
         * 推广员区间分成分牌修改
         */
        this.PROMOTION_EXEC_SHARE_SECTION_ALLOW_CHANGE = 51;
        /**
         * 推广员归属变更
         */
        this.PROMOTION_BELONG_CHANGE = 52,
        /**
         * 默认状态
         */
        this.Club_EXEC_NOT = 100;
        /**
         * 加入
         */
        this.Club_EXEC_JIARU = 101;
        /**
         * 退出
         */
        this.Club_EXEC_TUICHU = 102;
        /**
         * 踢出
         */
        this.Club_EXEC_TICHU = 103;
        /**
         * 成员管理员
         */
        this.Club_EXEC_BECOME_MGR = 104;
        /**
         * 取消管理员
         */
        this.Club_EXEC_CANCEL_MGR = 105;

        /**
         * 成员创建者
         */
        this.Club_EXEC_CREATER = 106;
        /**
         * 任命合伙人
         */
        this.Club_EXEC_APPOINT_PARTNER = 107;
        /**
         * 卸任合伙人
         */
        this.Club_EXEC_CANCEL_PARTNER = 108;
        /**
         * 创建房间
         */
        this.Club_EXEC_CREATE_ROOM = 109;
        /**
         * 禁用房间
         */
        this.Club_EXEC_BAN_ROOM = 110;
        /**
         * 修改房间
         */
        this.Club_EXEC_UPDATE_ROOM = 111;
        /**
         * 解散房间
         */
        this.Club_EXEC_DISMISS_ROOM = 112;
        /**
         * 正常房间
         */
        this.Club_EXEC_NOMARL_ROOM = 113;
        //亲友圈比赛分动态
        /**
         * 亲友圈疲劳值增加
         */
        this.UNION_CLUB_EXEC_SPORTS_POINT_ADD = 114;
        /**
         * 亲友圈疲劳值减少
         */
        this.UNION_CLUB_EXEC_SPORTS_POINT_MINUS = 115;

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
         * 成为赛事管理员
         */
        this.PLAYER_BECOME_UNIONMGR = 127;
        /**
         * 成为推广员管理员
         */
        this.PLAYER_BECOME_PROMOTIONMGR = 128;
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
         * 取消赛事管理员
         */
        this.PLAYER_CANCEL_UNIONMGR = 135;
        /**
         * 取消推广员管理员
         */
        this.PLAYER_CANCEL_PROMOTIONMGR = 136;
        /**
         * 被审核增加比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_OP = 139;
        /**
         * 被审核减少比赛分
         */
        this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_Op = 140;
        /**
         * 设置为推广员
         */
        this.CLUB_PROMOTION_DYNAMIC_SET = 1001;
        /**
         * 上任了推广员
         */
        this.CLUB_PROMOTION_DYNAMIC_APPOINT = 1002;
        /**
         * 卸任了推广员
         */
        this.CLUB_PROMOTION_DYNAMIC_LEAVE_OFFICE = 1003;
        /**
         * 删除推广员
         */
        this.CLUB_PROMOTION_DYNAMIC_DELETE = 1004;
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

    OnShow: function OnShow(clubId, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.curPage = 1;
        this.curDateType = 0;
        this.pidEditBox.string = "";
        this.execPidEditBox.string = "";
        var btn_default = this.node.getChildByName("time").getChildByName("btn_msg_today");
        this.OnClick(btn_default.name, btn_default);
        this.InitShowType();
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
        }
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.SendPackByType(false);
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        this.ShowBtn();
        var messageScrollView = this.node.getChildByName("messageScrollView");
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            messageScrollView.getComponent(cc.ScrollView).scrollToTop();
            //content.removeAllChildren();
            this.DestroyAllChildren(content);
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

                    var curValueStr = "";
                    if (typeof this.serverPack[i].curValue != "undefined") {
                        curValueStr = "，当前比赛分为" + this.serverPack[i].curValue.toString();
                    }
                    var preValueStr = "";
                    if (typeof this.serverPack[i].preValue != "undefined") {

                        if (this.serverPack[i].preValue >= 1000000) {
                            preValueStr = "，您当前剩余比赛分" + (this.serverPack[i].preValue / 10000).toFixed(1).toString() + '万';
                        } else {
                            preValueStr = "，您当前剩余比赛分" + this.serverPack[i].preValue.toString();
                        }
                    }
                    switch (this.serverPack[i].execType) {
                        case this.UNION_EXEC_SPORTS_WARNING_CLOSE:
                            msgStr = execNameStr + this.actionColor + "关闭</c>了" + NameStr + "的推广预警值";
                            break;
                        case this.UNION_EXEC_SPORTS_WARNING_CHANGE:
                            msgStr = execNameStr + this.actionColor + "修改</c>了" + NameStr + "的推广预警值为" + this.valueColor + this.serverPack[i].curValue + "，修改前为" + this.serverPack[i].preValue;
                            break;
                        case this.Club_EXEC_JIARU:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "批准加入</c>了亲友圈";
                            break;
                        case this.Club_EXEC_TUICHU:
                            if (this.serverPack[i].pid == this.serverPack[i].execPid) {
                                msgStr = NameStr + this.actionColor + "退出</c>了亲友圈";
                            } else {
                                msgStr = NameStr + "被" + execNameStr + this.actionColor + "批准退出</c>了亲友圈";
                            }
                            break;
                        case this.Club_EXEC_TICHU:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "踢出</c>了亲友圈";
                            break;
                        case this.Club_EXEC_BECOME_MGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "设为</c>亲友圈管理";
                            break;
                        case this.Club_EXEC_CANCEL_MGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "取消</c>亲友圈管理";
                            break;
                        case this.Club_EXEC_CREATER:
                            msgStr = NameStr + this.actionColor + "创建了</c>亲友圈";
                            break;
                        case this.Club_EXEC_APPOINT_PARTNER:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "认命为</c>亲友圈合伙人";
                            break;
                        case this.Club_EXEC_CANCEL_PARTNER:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "卸任为</c>亲友圈合伙人";
                            break;
                        case this.Club_EXEC_CREATE_ROOM:
                            msgStr = NameStr + this.actionColor + "创建</c>了亲友圈房间";
                            break;
                        case this.Club_EXEC_BAN_ROOM:
                            msgStr = NameStr + this.actionColor + "禁用</c>了亲友圈房间";
                            break;
                        case this.Club_EXEC_UPDATE_ROOM:
                            msgStr = NameStr + this.actionColor + "修改</c>了亲友圈房间";
                            break;
                        case this.Club_EXEC_DISMISS_ROOM:
                            msgStr = NameStr + this.actionColor + "解散</c>了亲友圈房间";
                            break;
                        case this.Club_EXEC_NOMARL_ROOM:
                            msgStr = NameStr + this.actionColor + "启用</c>了亲友圈房间";
                            break;
                        case this.UNION_CLUB_EXEC_SPORTS_POINT_ADD:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "增加</c>了比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;
                        case this.UNION_CLUB_EXEC_SPORTS_POINT_MINUS:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "减少</c>了比赛分值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr;
                            break;

                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "授权增加</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr + preValueStr;
                            break;
                        case this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "授权减少</c>了比赛分裁判值" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr + preValueStr;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "因比赛异常补偿</c>了比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr + preValueStr;
                            break;
                        case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "因比赛异常处罚</c>了比赛分" + this.valueColor + this.serverPack[i].value + "</c>" + curValueStr + preValueStr;
                            break;
                        case this.PLAYER_BECOME_UNIONMGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "设置</c>为赛事管理";
                            break;
                        case this.PLAYER_CANCEL_UNIONMGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "取消</c>赛事管理";
                            break;
                        case this.PLAYER_BECOME_PROMOTIONMGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "设置</c>为推广管理";
                            break;
                        case this.PLAYER_CANCEL_PROMOTIONMGR:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "取消</c>推广管理";
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
                        case this.CLUB_PROMOTION_DYNAMIC_SET:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "设置</c>为推广员";
                            break;
                        case this.CLUB_PROMOTION_DYNAMIC_APPOINT:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "上任</c>了推广员";
                            break;
                        case this.CLUB_PROMOTION_DYNAMIC_LEAVE_OFFICE:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "卸任</c>了推广员";
                            break;
                        case this.CLUB_PROMOTION_DYNAMIC_DELETE:
                            msgStr = NameStr + "被" + execNameStr + this.actionColor + "删除</c>了推广员";
                            break;
                        case this.PROMOTION_BELONG_CHANGE:
                            var toNameStr = "";
                            if (typeof this.serverPack[i].msg != "undefined" && typeof this.serverPack[i].roomKey != "undefined") {
                                toNameStr = "玩家" + this.nameColor + this.ComTool.GetBeiZhuName(this.serverPack[i].roomKey, this.serverPack[i].msg) + "[" + this.serverPack[i].roomKey + "]</c>";
                            }
                            msgStr = NameStr + "被" + execNameStr + "设置为" + toNameStr + "的下属玩家";
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
                        case this.UNION_EXEC_SHARE_SECTION:
                            msgStr = clubNameStr + NameStr + "被" + execNameStr + this.actionColor + "修改</c>了亲友圈活跃度计算为" + this.valueColor + "区间分成" + "</c>";
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
            this.curPage = 1;
            this.SendPackByType(true);
        } else if ('btn_msg_yesterday' == btnName) {
            this.curDateType = 1;
            this.curPage = 1;
            this.SendPackByType(true);
        } else if ('btn_msg_santian' == btnName) {
            this.curDateType = 2;
            this.curPage = 1;
            this.SendPackByType(true);
        } else if ('btn_msg_sanshitian' == btnName) {
            this.curDateType = 3;
            this.curPage = 1;
            this.SendPackByType(true);
        } else if ('btn_search' == btnName) {
            this.curPage = 1;
            this.SendPackByType(true);
        } else if ('btn_all' == btnName) {
            this.filterShow(0);
            this.InitShowType(0);
        } else if ('btn_jiaru' == btnName) {
            this.filterShow(1);
            this.InitShowType(1);
        } else if ('btn_tuichu' == btnName) {
            this.filterShow(2);
            this.InitShowType(2);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    InitShowType: function InitShowType() {
        var showType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.showType = showType;
        var tab = this.node.getChildByName('tab');
        if (this.showType == 0) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_jiaru").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_tuichu").getChildByName("checkmark").active = false;
        } else if (this.showType == 1) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_jiaru").getChildByName("checkmark").active = true;
            tab.getChildByName("btn_tuichu").getChildByName("checkmark").active = false;
        } else if (this.showType == 2) {
            tab.getChildByName("btn_all").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_jiaru").getChildByName("checkmark").active = false;
            tab.getChildByName("btn_tuichu").getChildByName("checkmark").active = true;
        }
    },

    OnTouch: function OnTouch(event) {
        if ('touchstart' == event.type) {} else if ('touchend' == event.type || 'touchcancel' == event.type) {
            //滑动结束动。检测哪些节点需要渲染
            this.CheckMessageDisplay();
        } else if ('touchmove' == event.type) {}
    },
    filterShow: function filterShow(type) {
        //各个类型的消息id
        var typeList = { 0: [], 1: [4, 7, 30, 101], 2: [5, 6, 31, 102, 103] };
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
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.pageNum = this.curPage;
        sendPack.getType = this.curDateType;
        var pidStr = this.ComTool.GetBeiZhuID(this.pidEditBox.string);
        if (pidStr == "") {
            pidStr = "0";
        }
        var execPidStr = this.ComTool.GetBeiZhuID(this.execPidEditBox.string);
        if (execPidStr == "") {
            execPidStr = "0";
        }
        var pid = parseInt(pidStr);
        var execPid = parseInt(execPidStr);
        if (isNaN(pid) || isNaN(execPid)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        sendPack.pid = pid;
        sendPack.execPid = execPid;
        var self = this;
        app.NetManager().SendPack("club.CClubDynamic", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
        });
    }
});

cc._RF.pop();