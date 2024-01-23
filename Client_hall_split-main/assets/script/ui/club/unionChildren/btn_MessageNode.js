var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
    	jiantouSprite:[cc.SpriteFrame],
    },
    onLoad:function(){
    	this.btn_msg_more = this.node.getChildByName("time").getChildByName("btn_msg_more");
    	this.btn_msg_sanshitian = this.node.getChildByName("time").getChildByName("btn_msg_sanshitian");
    	this.btn_msg_santian = this.node.getChildByName("time").getChildByName("btn_msg_santian");
    	this.btn_msg_yesterday = this.node.getChildByName("time").getChildByName("btn_msg_yesterday");
    	this.btn_msg_today = this.node.getChildByName("time").getChildByName("btn_msg_today");
        this.pidEditBox = this.node.getChildByName("pidEditBox").getComponent(cc.EditBox);
        this.execPidEditBox = this.node.getChildByName("execPidEditBox").getComponent(cc.EditBox);
    	let messageScrollView = this.node.getChildByName("messageScrollView").getComponent(cc.ScrollView);
        messageScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);

        this.clubNameColor = "<color=#fa59bc>";
        this.nameColor = "<color=#67b619>";
        this.actionColor = "<color=#e94817>";
        this.valueColor = "<color=#e6910b>";
        //消息类型
        /**
         * 默认状态
         */
        this.UNION_EXEC_NOT = 0;
        /**
         * 比赛分增加
         */
        this.UNION_EXEC_SPORTS_POINT_ADD = 1;
        /**
         * 比赛分减去
         */
        this.UNION_EXEC_SPORTS_POINT_MINUS = 2;
        /**
         * 收益百分比
         */
        this.UNION_EXEC_SCORE_PERCENT = 3;
        /**
         * 审核加入
         */
        this.UNION_EXEC_JIARU = 4;
        /**
         * 退出
         */
        this.UNION_EXEC_TUICHU = 5;
        /**
         * 踢出
         */
        this.UNION_EXEC_TICHU = 6;
        /**
         * 邀请加入
         */
        this.UNION_EXEC_YAOQING = 7;
        /**
         * 创建赛事
         */
        this.UNION_EXEC_CREATER = 8;
        /**
         * 赛事解散
         */
        this.UNION_EXEC_DISSOLVE = 9;
        /**
         * 赛事启动
         */
        this.UNION_EXEC_START_UP = 10;
        /**
         * 赛事停用
         */
        this.UNION_EXEC_STOP_USING = 11;
        /**
         * 魔法表情使用
         */
        this.UNION_EXEC_EXPRESSION_START_UP = 12;
        /**
         * 魔法表情停止
         */
        this.UNION_EXEC_EXPRESSION_STOP_USING = 13;
        /**
         * 成员管理员
         */
        this.UNION_EXEC_BECOME_MGR = 14;
        /**
         * 取消管理员
         */
        this.UNION_EXEC_CANCEL_MGR = 15;
        /**
         * 创建房间
         */
        this.UNION_EXEC_CREATE_ROOM = 16;
        /**
         * 修改房间
         */
        this.UNION_EXEC_UPDATE_ROOM = 17;
        /**
         * 解散房间
         */
        this.UNION_EXEC_DISMISS_ROOM = 18;
        /**
         * 开启加入审核
         */
        this.UNION_EXEC_JOIN_OPEN = 19;
        /**
         * 关闭加入审核
         */
        this.UNION_EXEC_JOIN_STOP = 20;
        /**
         * 开启退出审核
         */
        this.UNION_EXEC_QUIT_OPEN = 21;
        /**
         * 加入退出审核
         */
        this.UNION_EXEC_QUIT_STOP = 22;
        /**
         * 比赛分清零设置,0不清零
         */
        this.UNION_EXEC_NO_CLEAR = 23;
        /**
         * 比赛分清零设置,1每天清零
         */
        this.UNION_EXEC_CLEAR_DAILY = 24;
        /**
         * 比赛分清零设置,2每周清零
         */
        this.UNION_EXEC_CLEAR_WEEKLY = 25;
        /**
         * 比赛分清零设置,3每月清零
         */
        this.UNION_EXEC_CLEAR_MONTHLY = 26;
        /**
         * 赛事名称更新
         */
        this.UNION_EXEC_UPDATE_NAME = 27;
        /**
         * 赛事总比赛分增加
         */
        this.UNION_EXEC_ADD = 28;
        /**
         * 赛事总比赛分减少
         */
        this.UNION_EXEC_MINUS = 29;
        /**
         * 不需要审核加入
         * 直接加入
         */
        this.UNION_EXEC_JIARU_NOT = 30;
        /**
         * 不需要审核审核
         * 直接退出
         */
        this.UNION_EXEC_TUICHU_NOT= 31;
        /**
         * 裁判力度
         */
        this.UNION_EXEC_INIT_SPORTS= 32;

        /**
         * 比赛频率
         */
        this.UNION_EXEC_MATCH_RATE= 33;
        /**
         * 奖励
         */
        this.UNION_EXEC_REWARD= 34;

        /**
         * 淘汰值
         */
        this.UNION_EXEC_OUT_SPORTS= 35;
        /**
         * 禁止参与游戏
         */
        this.UNION_EXEC_BAN_GAME= 36;
        /**
         * 取消禁止参与游戏
         */
        this.UNION_EXEC_CANCEL_BAN_GAME= 37;
        /**
         * 开启允许亲友圈添加同赛事玩家
         */
        this.UNION_EXEC_JOIN_CLUB_SAME_UNION_OPEN= 38;
        /**
         * 关闭允许亲友圈添加同赛事玩家
         */
        this.UNION_EXEC_JOIN_CLUB_SAME_UNION_STOP= 39;
        /**
         * 推广员预警值关闭
         */
        this.UNION_EXEC_SPORTS_WARNING_CLOSE= 40;
        /**
         * 推广员预警值修改
         */
        this.UNION_EXEC_SPORTS_WARNING_CHANGE= 41;
        /**
         * 聯盟预警值关闭
         */
        this.UNION_CLUB_EXEC_SPORTS_WARNING_CLOSE= 42;
        /**
         * 聯盟预警值修改
         */
        this.UNION_CLUB_EXEC_SPORTS_WARNING_CHANGE= 43;
        /**
         * 联赛增加禁止游戏人员
         */
        this.UNION_CLUB_BAN_GAME_PLAYER_ADD= 44;
        /**
         * 联赛删除禁止游戏人员
         */
        this.UNION_CLUB_BAN_GAME_PLAYER_DELETE= 45;
        /**
         * 个人预警值关闭
         */
        this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CLOSE= 46;
        /**
         * 个人预警值修改
         */
        this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CHANGE= 47;
        /**
         * 亲友圈收益变为区间分成
         */
        this.UNION_EXEC_SHARE_SECTION= 49;
        /**
         * 推广员区间分成修改
         */
        this.PROMOTION_EXEC_SHARE_SECTION_CHANGE= 50;
        /**
         * 推广员区间分成分牌修改
         */
        this.PROMOTION_EXEC_SHARE_SECTION_ALLOW_CHANGE= 51;
        /**
         * 申请复赛操作
         */
        this.UNION_APPLY_REMATCH_AGREE= 116;
        /**
         * 退赛申请操作
         */
        this.UNION_BACK_OFF_AGREE= 117;
        /**
         * 退赛拒绝操作
         */
        this.UNION_BACK_OFF_REFUSE= 118;
        /**
         * 授权增加比赛分
         */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD= 122;
        /**
         * 授权减少比赛分
         */
        this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS= 123;

        /**
         * 补偿增加比赛分
         */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD= 124;
        /**
         * 补偿减少比赛分
         */
        this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS= 125;


        this.UNION_Change_Table= 1007;

        //修改生存分
        this.UNION_Change_livePoint= 1017;

    },
    InitData:function (clubId, unionId, unionPostType) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.curPage = 1;
        this.curDateType = 0;
        this.pidEditBox.string = "";
        this.execPidEditBox.string = "";
        let btn_default = this.node.getChildByName("time").getChildByName("btn_msg_today");
        this.OnClick(btn_default.name,btn_default);
    },
    ShowBtn:function(){
        this.btn_msg_today.active = false;
        this.btn_msg_yesterday.active = false;
        this.btn_msg_santian.active = false;
        this.btn_msg_sanshitian.active = false;
        let btnLable = this.btn_msg_more.getChildByName("label").getComponent(cc.Label);
        if (this.curDateType == 0) {
            btnLable.string = "今  天";
        }else if (this.curDateType == 1) {
            btnLable.string = "昨  天";
        }else if (this.curDateType == 2) {
            btnLable.string = "近三天";
        }else if (this.curDateType == 3) {
            btnLable.string = "近三十天";
        }
    },
    GetNextPage:function(){
    	this.curPage++;
    	this.SendPackByType(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
        this.ShowBtn();
    	let messageScrollView = this.node.getChildByName("messageScrollView");
    	let content = messageScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		messageScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
    	let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
    		let child = cc.instantiate(demo);
    		if (i%2 == 0) {
    			child.getChildByName("img_tiaowen01").active = true;
    		}else{
    			child.getChildByName("img_tiaowen01").active = false;
    		}
            child.getChildByName("lb_time").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayHourMinuteString(serverPack[i].execTime);
    		let lb_message = child.getChildByName("lb_message").getComponent(cc.RichText);
            let msgStr = "";
            let clubNameStr = "";
            if (typeof(serverPack[i].clubName)!="undefined" && typeof(serverPack[i].clubSign)!="undefined") {
                clubNameStr = "亲友圈"+this.clubNameColor+serverPack[i].clubName+"["+serverPack[i].clubSign+"]</c>";
            }
            let NameStr = "";
            if (typeof(serverPack[i].name)!="undefined" && typeof(serverPack[i].pid)!="undefined") {
                NameStr = "玩家"+this.nameColor+serverPack[i].name+"["+serverPack[i].pid+"]</c>";
            }
            let ManageNameStr = "";
            if (typeof(serverPack[i].name)!="undefined" && typeof(serverPack[i].pid)!="undefined") {
                ManageNameStr = "裁判"+this.nameColor+serverPack[i].name+"["+serverPack[i].pid+"]</c>";
            }
            let execNameStr = "";
            if (typeof(serverPack[i].execName)!="undefined" && typeof(serverPack[i].execPid)!="undefined") {
                execNameStr = "玩家"+this.nameColor+serverPack[i].execName+"["+serverPack[i].execPid+"]</c>";
            }
            let curValueStr = "";
            if (typeof(serverPack[i].curValue) != "undefined") {
                curValueStr = "，当前比赛分为" + serverPack[i].curValue;
            }
            let preValueStr = "";
            if (typeof(serverPack[i].preValue) != "undefined") {
                preValueStr = "，修改前为" + serverPack[i].preValue;
            }
            switch(serverPack[i].execType){
                case this.UNION_EXEC_SPORTS_POINT_ADD:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"增加</c>了比赛分"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_EXEC_SPORTS_POINT_MINUS:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"减少</c>了比赛分"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_EXEC_SCORE_PERCENT:
                    if (typeof(serverPack[i].msg) != "undefined") {
                        msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"修改</c>了亲友圈玩法"+this.valueColor+serverPack[i].msg+"活跃度计算为"+this.valueColor+serverPack[i].value+"</c>"+preValueStr;
                    }else{
                        msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"修改</c>了亲友圈活跃度计算为"+this.valueColor+serverPack[i].value+"</c>"+preValueStr;
                    }
                    break;
                case this.UNION_EXEC_SHARE_SECTION:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"修改</c>了亲友圈活跃度计算为"+this.valueColor+"区间分成"+"</c>";
                    break;
                case this.UNION_EXEC_JIARU:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"审核加入</c>了赛事";
                    break;
                case this.UNION_EXEC_TUICHU:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"审核退出</c>了赛事";
                    break;
                case this.UNION_EXEC_TICHU:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"踢出</c>了赛事";
                    break;
                case this.UNION_EXEC_YAOQING:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"邀请加入</c>了赛事";
                    break;
                case this.UNION_EXEC_CREATER:
                    msgStr = ManageNameStr+this.actionColor+"创建</c>了赛事，当前赛事的裁判值为"+this.valueColor+serverPack[i].value+"</c>";
                    break;
                case this.UNION_EXEC_DISSOLVE:
                    msgStr = ManageNameStr+this.actionColor+"解散</c>了赛事";
                    break;
                case this.UNION_EXEC_START_UP:
                    msgStr = ManageNameStr+this.actionColor+"启用</c>了赛事";
                    break;
                case this.UNION_EXEC_STOP_USING:
                    msgStr = ManageNameStr+this.actionColor+"停用</c>了赛事";
                    break;
                case this.UNION_EXEC_EXPRESSION_START_UP:
                    msgStr = ManageNameStr+this.actionColor+"允许</c>了赛事房间使用魔法表情";
                    break;
                case this.UNION_EXEC_EXPRESSION_STOP_USING:
                    msgStr = ManageNameStr+this.actionColor+"禁止</c>了赛事房间使用魔法表情";
                    break;
                case this.UNION_EXEC_BECOME_MGR:
                    msgStr = NameStr+"被"+this.nameColor+serverPack[i].execName+"</c>"+this.actionColor+"设为</c>了赛事副裁判";
                    break;
                case this.UNION_EXEC_CANCEL_MGR:
                    msgStr = NameStr+"被"+this.nameColor+serverPack[i].execName+"</c>"+this.actionColor+"取消</c>了赛事副裁判";
                    break;
                case this.UNION_EXEC_CREATE_ROOM:
                    msgStr = ManageNameStr+this.actionColor+"创建</c>了赛事房间";
                    break;
                case this.UNION_EXEC_UPDATE_ROOM:
                    msgStr = ManageNameStr+this.actionColor+"修改</c>了赛事房间 "+this.valueColor+serverPack[i].value+"</c>";
                    break;
                case this.UNION_EXEC_DISMISS_ROOM:
                    msgStr = ManageNameStr+this.actionColor+"解散</c>了赛事房间";
                    break;
                case this.UNION_EXEC_JOIN_OPEN:
                    msgStr = ManageNameStr+this.actionColor+"开启</c>了加入审核";
                    break;
                case this.UNION_EXEC_JOIN_STOP:
                    msgStr = ManageNameStr+this.actionColor+"关闭</c>了加入审核";
                    break;
                case this.UNION_EXEC_QUIT_OPEN:
                    msgStr = ManageNameStr+this.actionColor+"开启</c>了退出审核";
                    break;
                case this.UNION_EXEC_QUIT_STOP:
                    msgStr = ManageNameStr+this.actionColor+"关闭</c>了退出审核";
                    break;
                case this.UNION_EXEC_NO_CLEAR:
                    msgStr = ManageNameStr+this.actionColor+"设置</c>了比赛分清零为"+this.actionColor+"不清零</c>";
                    break;
                case this.UNION_EXEC_CLEAR_DAILY:
                    msgStr = ManageNameStr+this.actionColor+"设置</c>了比赛分清零为"+this.actionColor+"每天清零</c>";
                    break;
                case this.UNION_EXEC_CLEAR_WEEKLY:
                    msgStr = ManageNameStr+this.actionColor+"设置</c>了比赛分清零为"+this.actionColor+"每周清零</c>";
                    break;
                case this.UNION_EXEC_CLEAR_MONTHLY:
                    msgStr = ManageNameStr+this.actionColor+"设置</c>了比赛分清零为"+this.actionColor+"每月清零</c>";
                    break;
                case this.UNION_EXEC_UPDATE_NAME:
                    msgStr = ManageNameStr+this.actionColor+"修改</c>了赛事名称为"+this.valueColor+serverPack[i].value+"</c>";
                    break;
                case this.UNION_EXEC_ADD:
                    msgStr = "赛事总比赛分增加"+this.valueColor+serverPack[i].value+"</c>";
                    break;
                case this.UNION_EXEC_MINUS:
                    msgStr = "赛事总比赛分减少"+this.valueColor+serverPack[i].value+"</c>";
                    break;
                case this.UNION_EXEC_JIARU_NOT:
                    msgStr = clubNameStr+NameStr+this.actionColor+"加入</c>了赛事";
                    break;
                case this.UNION_EXEC_TUICHU_NOT:
                    msgStr = clubNameStr+NameStr+this.actionColor+"退出</c>了赛事";
                    break;
                case this.UNION_EXEC_INIT_SPORTS:
                    msgStr = NameStr+this.actionColor+"修改</c>了赛事的裁判力度为"+this.valueColor+serverPack[i].value+preValueStr;
                    break;
                case this.UNION_EXEC_MATCH_RATE:
                    let dayStr = serverPack[i].value + "天";
                    if (serverPack[i].value == 1) {
                        dayStr = "每天";
                    }
                    msgStr = NameStr+this.actionColor+"修改</c>了赛事的赛事频率为"+this.valueColor+dayStr;
                    break;
                case this.UNION_EXEC_REWARD:
                    msgStr = NameStr+this.actionColor+"修改</c>了赛事的奖励";
                    break;
                case this.UNION_EXEC_OUT_SPORTS:
                    msgStr = NameStr+this.actionColor+"修改</c>了赛事的淘汰值为"+this.valueColor+serverPack[i].value+preValueStr;
                    break;
                case this.UNION_EXEC_BAN_GAME:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"禁止</c>了参与游戏";
                    break;
                case this.UNION_EXEC_CANCEL_BAN_GAME:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"取消禁止</c>了参与游戏";
                    break;
                case this.UNION_EXEC_JOIN_CLUB_SAME_UNION_OPEN:
                    msgStr = ManageNameStr+this.actionColor+"允许</c>了亲友圈添加同赛事玩家";
                    break;
                case this.UNION_EXEC_JOIN_CLUB_SAME_UNION_STOP:
                    msgStr = ManageNameStr+this.actionColor+"不允许</c>亲友圈添加同赛事玩家";
                    break;
                case this.UNION_EXEC_SPORTS_WARNING_CLOSE:
                    msgStr = execNameStr+this.actionColor+"关闭</c>了"+NameStr+"的推广预警值";
                    break;
                case this.UNION_EXEC_SPORTS_WARNING_CHANGE:
                    msgStr = execNameStr+this.actionColor+"修改</c>了"+NameStr+"的推广预警值为"+this.valueColor+serverPack[i].curValue+"，修改前为"+serverPack[i].preValue;
                    break;
                case this.UNION_CLUB_EXEC_SPORTS_WARNING_CLOSE:
                    msgStr = execNameStr+this.actionColor+"关闭</c>了"+clubNameStr+"的赛事预警值";
                    break;
                case this.UNION_CLUB_EXEC_SPORTS_WARNING_CHANGE:
                    msgStr = execNameStr+this.actionColor+"修改</c>了"+clubNameStr+"的赛事预警值为"+this.valueColor+serverPack[i].curValue+"，修改前为"+serverPack[i].preValue;
                    break;
                case this.UNION_CLUB_BAN_GAME_PLAYER_ADD:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"禁止游戏";
                    break;
                case this.UNION_CLUB_BAN_GAME_PLAYER_DELETE:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"取消禁止游戏";
                    break;
                case this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CLOSE:
                    msgStr = execNameStr+this.actionColor+"关闭了</c>"+NameStr+this.actionColor+"个人预警值";
                    break;
                case this.UNION_EXEC_PERSONAL_SPORTS_WARNING_CHANGE:
                    msgStr = execNameStr+this.actionColor+"修改了</c>"+NameStr+this.actionColor+"的个人预警值为"+this.valueColor+serverPack[i].curValue+"，修改前为"+serverPack[i].preValue;
                    break;
                case this.UNION_APPLY_REMATCH_AGREE:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"同意</c>了复赛申请，申请时比赛分为"+this.valueColor+serverPack[i].value;
                    break;
                case this.UNION_BACK_OFF_AGREE:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"同意</c>了退赛申请，申请时比赛分为"+this.valueColor+serverPack[i].value;
                    break;
                case this.UNION_BACK_OFF_REFUSE:
                    msgStr = NameStr+this.actionColor+"被</c>"+execNameStr+this.actionColor+"拒绝</c>了退赛申请";
                    break;
                case this.UNION_EXEC_EMPOWER_SPORTS_POINT_ADD:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"授权增加</c>了比赛分裁判值"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_EXEC_EMPOWER_SPORTS_POINT_MINUS:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"授权减少</c>了比赛分裁判值"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_ADD:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"因比赛异常补偿</c>了比赛分"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_EXEC_COMPENSATE_SPORTS_POINT_MINUS:
                    msgStr = clubNameStr+NameStr+"被"+execNameStr+this.actionColor+"因比赛异常处罚</c>了比赛分"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.UNION_Change_Table:
                    msgStr = this.actionColor+"修改开局桌子最多显示</c> "+this.valueColor+serverPack[i].value+"张</c>"+curValueStr;
                    break;
                case this.UNION_Change_livePoint:
                    msgStr = execNameStr+this.actionColor+"修改</c>了"+NameStr+"的生存分"+this.valueColor+serverPack[i].curValue+"，修改前"+serverPack[i].preValue;
                    break;
                default:
                    msgStr = "位置消息类型:"+serverPack[i].execType;
                    break;
            }
            lb_message.string = msgStr;
            child.active = true;
    		content.addChild(child);
    	}
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_msg_more'==btnName){
            this.btn_msg_today.active = !this.btn_msg_today.active;
            this.btn_msg_yesterday.active = !this.btn_msg_yesterday.active;
            this.btn_msg_santian.active = !this.btn_msg_santian.active;
            this.btn_msg_sanshitian.active = !this.btn_msg_sanshitian.active;
            let img_jiantou = this.btn_msg_more.getChildByName("img_jiantou").getComponent(cc.Sprite);
            if (this.btn_msg_today.active) {
                img_jiantou.spriteFrame = this.jiantouSprite[1];
            }else{
                img_jiantou.spriteFrame = this.jiantouSprite[0];
            }
        }else if('btn_msg_today' == btnName){
            this.curDateType = 0;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_yesterday' == btnName){
            this.curDateType = 1;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_santian' == btnName){
            this.curDateType = 2;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_sanshitian' == btnName){
            this.curDateType = 3;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_search' == btnName){
            this.curPage = 1;
            this.SendPackByType(true);
        }
    },
    SendPackByType:function(isRefresh){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.getType = this.curDateType;
        let pidStr = app.ComTool().GetBeiZhuID(this.pidEditBox.string);
        if (pidStr == "") {
            pidStr = "0";
        }
        let execPidStr = this.execPidEditBox.string;
        if (execPidStr == "") {
            execPidStr = "0";
        }
        let pid = parseInt(pidStr);
        let execPid = parseInt(execPidStr);
        if (isNaN(pid) || isNaN(execPid)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id",[],3);
            return;
        }
        sendPack.pid = pid;
        sendPack.execPid = execPid;
        let self = this;
        app.NetManager().SendPack("union.CUnionDynamic",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },
});