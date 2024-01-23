(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubUserMessageNew.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9d51clHe6VF67Bd2aqsYmhL', 'UIClubUserMessageNew', __filename);
// script/ui/club/UIClubUserMessageNew.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        jiantouSprite: [cc.SpriteFrame],
        allMsgTypeDemo: [cc.Prefab]
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.btn_msg_more = this.node.getChildByName("time").getChildByName("btn_msg_more");
        this.btn_msg_sanshitian = this.node.getChildByName("time").getChildByName("btn_msg_sanshitian");
        this.btn_msg_santian = this.node.getChildByName("time").getChildByName("btn_msg_santian");
        this.btn_msg_yesterday = this.node.getChildByName("time").getChildByName("btn_msg_yesterday");
        this.btn_msg_today = this.node.getChildByName("time").getChildByName("btn_msg_today");
        var messageScrollView = this.node.getChildByName("messageScrollView");

        this.RegEvent("OnUnionDynamic", this.Event_UnionDynamic, this);

        this.pageMsgNum = 20;

        this.clubNameColor = "<color=#fa59bc>";
        this.nameColor = "<color=#67b619>";
        this.actionColor = "<color=#e94817>";
        this.valueColor = "<color=#e6910b>";
        this.Msg_AllType = [
        //异常补偿的消息0
        [
        /**
         * 赛事疲劳值增加 this.UNION_EXEC_SPORTS_POINT_ADD = 
         */
        1,
        /**
         * 亲友圈疲劳值增加 this.UNION_CLUB_EXEC_SPORTS_POINT_ADD = 
         */
        114,
        /**
         * 补偿增加比赛分 this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD= 
         */
        124,
        /**
        * 补偿增加比赛分 this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD_SELF= 
        */
        133],
        //异常处罚的消息1
        [
        /**
         * 赛事疲劳值减少 this.UNION_EXEC_SPORTS_POINT_MINUS = 
         */
        2,

        /**
         * 亲友圈疲劳值减少 this.UNION_CLUB_EXEC_SPORTS_POINT_MINUS = 
         */
        115,
        /**
         * 补偿减少比赛分 this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS= 
         */
        125,
        /**
        * 补偿减少比赛分 this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS_SELF= 
        */
        134],
        //授权增加的消息2
        [
        /**
         * 授权增加比赛分 this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD= 
         */
        122,
        /**
        * 授权增加比赛分 this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD_SELF= 
        */
        131,
        /**
         * 跨级变换增加 CLUB_KUAJI_SPOINTCHANGE_ADD
         */
        1020],
        //授权减少的消息3
        [
        /**
         * 授权减少比赛分this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS= 
         */
        123,
        /**
        * 授权减少比赛分this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS_SELF= 
        */
        132,
        /**
         * 跨级变换减少 CLUB_KUAJI_SPOINTCHANGE_SUB
         */
        1021],
        //报名费的消息4
        [
        /**
         * 房费竞技点(赢家报名费)this.UNION_ROOM_EXEC_SPORTS_POINT = 
         */
        119,
        /**
         * 报名费增加this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADD= 
         */
        126,
        /**
         * 报名费增加新类型this.UNION_ROOM_EXEC_SPORTS_POINT_ENTRY_FEE_ADDNew= 
         */
        1006, 1008,
        /**
         * 推广员竞技点收益收入分成到保险箱UNION_EXEC_PROMOTION_SHARE_INCOME_CASEPOINT
         */
        1013],
        //输赢比赛分的消息5
        [
        /**
         * 比赛分增加 this.UNION_ROOM_EXEC_SPORTS_POINT_ADD = 
         */
        120,
        /**
         * 比赛分减少 this.UNION_ROOM_EXEC_SPORTS_POINT_MINUS = 
         */
        121],
        //洗牌费的消息6
        [
        /**
         * 洗牌消耗的比赛分this.UNION_ROOM_QIEPAI_CONSUME= 
         */
        129,
        /**
         * 洗牌收入的比赛分this.UNION_ROOM_QIEPAI_INCOME= 
         */
        130],
        //保险柜的消息7
        [
        /**
         * 保险箱增加新类型this.PLAYER_CASE_SPORTS_POINT_ADD= 
         */
        1009,
        /**
         * 保险箱减少新类型this.PLAYER_CASE_SPORTS_POINT_SUB= 
         */
        1010,
        /**
         * 保险箱关闭新类型this.UNION_CASE_SPORTS_POINT_CLOSE= 
         */
        1011],
        //分层修改的消息8
        [
        /**
         * 分层修改this.UNION_EXEC_BILI_CHANGE = 
         */
        3,
        /**
         * 预留值修改this.UNION_EXEC_RESERVED_VALUE_CHANGE = 
         */
        48,
        /**
         * 亲友圈收益变为区间分成UNION_EXEC_SHARE_SECTION
         */
        49],
        //踢出玩家的消息9
        [
        /**
         * 被踢出，玩家强制从保险箱取出this.UNION_CASE_SPORTS_POINT_TICHU= 
         */
        1012],
        //预警值消息10
        [
        /**
         * 推广员预警值关闭this.UNION_EXEC_SPORTS_WARNING_CLOSE= 
         */
        40,
        /**
         * 推广员预警值修改this.UNION_EXEC_SPORTS_WARNING_CHANGE= 
         */
        41,
        /**
         * 个人预警值关闭this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CLOSE= 
         */
        46,
        /**
         * 个人预警值修改this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CHANGE= 
         */
        47],
        //审核比赛分消息11
        [
        /**
         * 发起审核增加比赛分this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_EXE= 
         */
        137,
        /**
         * 发起审核减少比赛分this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_EXE= 
         */
        138,
        /**
         * 被审核增加比赛分this.UNION_EXEC_EXAMINE_SPORTS_POINT_ADD_OP= 
         */
        139,
        /**
         * 被审核减少比赛分this.UNION_EXEC_EXAMINE_SPORTS_POINT_MINUS_Op= 
         */
        140],
        //区间分成消息12
        [
        /**
         * 推广员区间分成修改PROMOTION_EXEC_SHARE_SECTION_CHANGE
         */
        50,
        /**
         * 推广员区间分成分牌修改PROMOTION_EXEC_SHARE_SECTION_ALLOW_CHANGE
         */
        51],
        //区间分成消息13
        [
        /**
         * 新报名费
         */
        1014],
        //区间分成消息14
        [
        /**
        * 生存积分关闭
        */
        1016,
        /**
         * 生存积分开启
         */
        1017,
        /**
         * 生存积分变换
         */
        1018,
        /*
        * 淘汰分
        */
        1019],
        //区间分成消息15
        [
        //直属玩家被踢出 CLUB_ZHI_SHU_TICHU
        1022,
        //直属玩家加入 CLUB_ZHI_SHU_JIARU
        1023],
        //区间分成消息16
        [
        //直属玩家被修改归属 CLUB_ZHI_SHU_CHANGE_BELONG
        1024]];
    },

    //---------显示函数--------------------
    OnShow: function OnShow(clubId, unionId, unionName, unionSign) {
        var pid = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var opClubId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var btn_defaultName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "btn_ChooseType_0";

        var lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";

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
        this.ShowBtn();
        this.chooseType = 0;
        //服务端下发的页数
        this.curServerPage = 1;
        this.curClientPage = 1;
        this.needGetNewMsg = false;
        this.allMsgList = []; //客户端本地缓存消息，避免翻页频繁请求
        var btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name, btn_default);

        //是否显示生存任务
        this.node.getChildByName("left").getChildByName("btn_ChooseType_8").active = app.ClubManager().GetUnionTypeByLastClubData() == 1;
        this.node.getChildByName("left").getChildByName("btn_ChooseType_9").active = app.ClubManager().GetUnionTypeByLastClubData() == 1;
        this.node.getChildByName("left").getChildByName("btn_ChooseType_6").active = app.ClubManager().GetUnionTypeByLastClubData() == 0; //中至的不显示保险柜
        //btn_ChooseType_6
        this.node.getChildByName("left").getChildByName("btn_ChooseType_3").active = false;

        // btn_default = this.node.getChildByName("time").getChildByName("btn_msg_today");
        // this.OnClick(btn_default.name,btn_default);
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
    //获取
    GetMsgListByPage: function GetMsgListByPage() {
        var tempMsgList = [];
        if (this.allMsgList.length > (this.curClientPage - 1) * this.pageMsgNum) {
            var startIndex = (this.curClientPage - 1) * this.pageMsgNum;
            var endIndex = startIndex + this.pageMsgNum;
            if (this.allMsgList.length - endIndex <= this.pageMsgNum * 2) {
                this.needGetNewMsg = true;
            }
            for (var i = startIndex; i < endIndex; i++) {
                if (typeof this.allMsgList[i] != "undefined") {
                    tempMsgList.push(this.allMsgList[i]);
                } else {
                    this.needGetNewMsg = false;
                    break;
                }
            }
        }
        return tempMsgList;
    },
    UpdateScrollView: function UpdateScrollView(msgList, isRefresh) {
        if (msgList.length == 0 && this.curClientPage > 1) {
            app.SysNotifyManager().ShowSysMsg('已经到最后一页了', [], 3);
            return;
        }
        this.node.getChildByName("page").getChildByName("lb_page").getComponent(cc.Label).string = this.curClientPage;
        var messageScrollView = this.node.getChildByName("messageScrollView");
        var content = messageScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.DestroyAllChildren(content);
            messageScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.getComponent(cc.Layout).updateLayout();
        }
        for (var i = 0; i < msgList.length; i++) {
            var msgType = this.GetMsgTypeByExecType(msgList[i].execType);
            if (msgType == -1) {
                console.log("未知消息类型:" + msgList[i].execType);
                continue;
            }
            var demo = this.allMsgTypeDemo[msgType];
            if (typeof demo == "undefined" || demo == null) {
                console.log("未找到消息预设体:" + msgType);
                continue;
            }
            var msgNode = cc.instantiate(demo);
            msgNode.getComponent(msgNode.name).InitData(msgList[i]);
            content.addChild(msgNode);
        }
        this.node.getChildByName("total").getComponent(cc.Label).string = "总计:" + (this.totalNum || 0).toFixed(2);
    },
    GetMsgTypeByExecType: function GetMsgTypeByExecType(execType) {
        for (var i = 0; i < this.Msg_AllType.length; i++) {
            if (this.Msg_AllType[i].indexOf(execType) > -1) {
                return i;
            }
        }
        return -1;
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
            this.ShowBtn();
            this.SendPackByType(true, true);
        } else if ('btn_msg_yesterday' == btnName) {
            this.curDateType = 1;
            this.ShowBtn();
            this.SendPackByType(true, true);
        } else if ('btn_msg_santian' == btnName) {
            this.curDateType = 2;
            this.ShowBtn();
            this.SendPackByType(true, true);
        } else if ('btn_msg_sanshitian' == btnName) {
            this.curDateType = 3;
            this.ShowBtn();
            this.SendPackByType(true, true);
        } else if ('btn_next' == btnName) {
            if (this.needGetNewMsg) {
                this.curServerPage++;
                this.SendPackByType(true, false);
            }
            this.curClientPage++;
            var msgList = this.GetMsgListByPage();
            if (msgList.length > 0) {
                this.UpdateScrollView(msgList, true);
            } else {
                this.curClientPage--;
            }
        } else if ('btn_last' == btnName) {
            if (this.curClientPage <= 1) {
                return;
            }
            this.curClientPage--;
            var _msgList = this.GetMsgListByPage();
            this.UpdateScrollView(_msgList, true);
        } else if (btnName.startsWith("btn_ChooseType_")) {
            this.curServerPage = 1;
            this.curClientPage = 1;
            this.needGetNewMsg = false;
            this.allMsgList = [];
            this.chooseType = btnName.replace('btn_ChooseType_', '');
            this.ClickLeftBtn(btnName);
            this.node.getChildByName("total").active = this.chooseType == 7;
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    ClickLeftBtn: function ClickLeftBtn(clickName) {
        var leftNode = this.node.getChildByName("left");
        var allLeftBtn = [];
        for (var i = 0; i < leftNode.children.length; i++) {
            allLeftBtn.push(leftNode.children[i]);
        }
        for (var _i = 0; _i < allLeftBtn.length; _i++) {
            if (allLeftBtn[_i].name == clickName) {
                allLeftBtn[_i].getChildByName("img_off").active = false;
                allLeftBtn[_i].getChildByName("lb_off").active = false;
                allLeftBtn[_i].getChildByName("img_on").active = true;
                allLeftBtn[_i].getChildByName("lb_on").active = true;
            } else {
                allLeftBtn[_i].getChildByName("img_off").active = true;
                allLeftBtn[_i].getChildByName("lb_off").active = true;
                allLeftBtn[_i].getChildByName("img_on").active = false;
                allLeftBtn[_i].getChildByName("lb_on").active = false;
            }
        }
        this.SendPackByType(true, true);
    },
    SendPackByType: function SendPackByType(isRefresh, isClearMsgList) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.getType = this.curDateType;
        sendPack.chooseType = this.chooseType;
        sendPack.pageNum = this.curServerPage;
        var self = this;
        if (this.pid == 0) {
            app.NetManager().SendPack("club.CClubSportsPointDynamicByPid", sendPack, function (serverPack) {
                self.totalNum = 0;
                if (isClearMsgList) {
                    self.allMsgList = serverPack;
                } else {
                    self.allMsgList.concat(serverPack);
                }
                for (var i = 0; i < self.allMsgList.length; i++) {
                    self.totalNum += self.allMsgList[i].num || 0;
                }
                self.curServerPage = 1; //服务端只有第一页的数据走原接口返回，其他走通知消息
                self.curClientPage = 1;
                self.UpdateScrollView(self.GetMsgListByPage(), isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else {
            if (this.opClubId == 0) {
                sendPack.pid = this.pid;
                app.NetManager().SendPack("club.CClubSportsPointMemberDynamicByPid", sendPack, function (serverPack) {
                    if (isClearMsgList) {
                        self.allMsgList = serverPack;
                    } else {
                        self.allMsgList.concat(serverPack);
                    }
                    self.curServerPage = 1; //服务端只有第一页的数据走原接口返回，其他走通知消息
                    self.curClientPage = 1;
                    self.UpdateScrollView(self.GetMsgListByPage(), isRefresh);
                }, function () {});
            } else {
                sendPack.opPid = this.pid;
                sendPack.opClubId = this.opClubId;
                app.NetManager().SendPack("union.CUnionSportsPointMemberDynamicByPid", sendPack, function (serverPack) {
                    if (isClearMsgList) {
                        self.allMsgList = serverPack;
                    } else {
                        self.allMsgList.concat(serverPack);
                    }
                    self.curServerPage = 1; //服务端只有第一页的数据走原接口返回，其他走通知消息
                    self.curClientPage = 1;
                    self.UpdateScrollView(self.GetMsgListByPage(), isRefresh);
                }, function () {});
            }
        }
    },
    //接收服务端异步通知消息，合并消息数组
    Event_UnionDynamic: function Event_UnionDynamic(event) {
        for (var i = 0; i < event.unionDynamicItemList.length; i++) {
            if (this.allMsgList.indexOf(event.unionDynamicItemList[i]) < 0) {
                this.allMsgList.push(event.unionDynamicItemList[i]);
            }
        }
        // this.allMsgList.concat(event.unionDynamicItemList);
        this.curServerPage = event.pageNum;
        this.needGetNewMsg = false;
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
        //# sourceMappingURL=UIClubUserMessageNew.js.map
        