"use strict";
cc._RF.push(module, '97f4feLyU9P6Kl1pxehQksY', 'UITask');
// script/ui/UITask.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        // top_tip:cc.Node,
        prefab_demo1: cc.Node,
        prefab_demo2: cc.Node,
        reward_icon: [cc.SpriteFrame],
        newer_task_bar: cc.Node,
        day_task_bar: cc.Node,
        special_layout: cc.Node,
        newer_layout: cc.Node,
        day_layout: cc.Node
    },
    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow() {
        app.FormManager().ShowForm('UITop', "UITask");
        this.prefab_demo1.active = false;
        this.prefab_demo2.active = false;
        // this.top_tip.active=false;
        this.ShowTask();
        if (!this.newer_layout.children) {
            this.task_bar[0].active = false;
        }
    },
    ShowTask: function ShowTask() {
        app.NetManager().SendPack("task.CTaksTaskList", {}, this.GetTaskInfoList.bind(this), this.GetTaskInfoListFail.bind(this));
    },
    GetTaskInfoListFail: function GetTaskInfoListFail() {
        this.ShowXianJin(0);
        this.ShowSpecialTask([]);
        this.ShowNewerTask([]);
        this.ShowDayTask([]);
    },
    GetTaskInfoList: function GetTaskInfoList(data) {
        var taskItemInfos = data.taskItemInfos;
        var drawMoney = data.drawMoney;
        this.ShowXianJin(drawMoney);
        //显示任务
        var specialTask = [];
        var newerTask = [];
        var dayTask = [];
        for (var i = 0; i < taskItemInfos.length; i++) {
            if (taskItemInfos[i].taskType == 1) {
                newerTask.push(taskItemInfos[i]);
            } else if (taskItemInfos[i].taskType == 2) {
                dayTask.push(taskItemInfos[i]);
            } else if (taskItemInfos[i].taskType == 3) {
                specialTask.push(taskItemInfos[i]);
            }
        }
        this.ShowSpecialTask(specialTask);
        this.ShowNewerTask(newerTask);
        this.ShowDayTask(dayTask);
    },
    ShowDayTask: function ShowDayTask(Task) {
        if (Task.length == 0) {
            this.day_layout.active = false;
            this.day_task_bar.active = false;
            return;
        }
        //this.day_layout.removeAllChildren();
        this.DestroyAllChildren(this.day_layout);
        this.day_task_bar.active = true;
        this.day_layout.active = true;
        // let top_tip=cc.instantiate(this.top_tip);
        // top_tip.getChildByName('lb').getComponent(cc.Label).string='每日任务';
        // top_tip.active=true;
        // this.day_layout.addChild(top_tip);
        for (var i = 0; i < Task.length; i++) {
            var add = cc.instantiate(this.prefab_demo2);
            add.name = 'task_' + Task[i].id;
            add.getChildByName('rich_title').getComponent(cc.RichText).string = '<color=#9d3d17>' + Task[i].title + '</c> <color=#ff2522>(' + Task[i].value + '/' + Task[i].targetValue + ')</color>';
            add.getChildByName('content').getComponent(cc.Label).string = Task[i].content;

            this.ShowReward(add, Task[i].rewardInfo[0]);
            this.ShowTaskBtn(add, Task[i].taskState);
            add.active = true;
            add.targetType = Task[i].targetType;
            add.task_id = Task[i].id;
            this.day_layout.addChild(add);
        }
    },
    ShowNewerTask: function ShowNewerTask(Task) {
        if (Task.length == 0) {
            this.newer_layout.active = false;
            this.newer_task_bar.active = false;
            return;
        }
        //this.newer_layout.removeAllChildren();
        this.DestroyAllChildren(this.newer_layout);
        this.newer_task_bar.active = true;
        this.newer_layout.active = true;
        // let top_tip=cc.instantiate(this.top_tip);
        // top_tip.getChildByName('lb').getComponent(cc.Label).string='新手任务';
        // top_tip.active=true;
        // this.newer_layout.addChild(top_tip);
        for (var i = 0; i < Task.length; i++) {
            var add = cc.instantiate(this.prefab_demo2);
            add.name = 'task_' + Task[i].id;
            add.getChildByName('rich_title').getComponent(cc.RichText).string = '<color=#9d3d17>' + Task[i].title + '</c> <color=#ff2522>(' + Task[i].value + '/' + Task[i].targetValue + ')</color>';
            add.getChildByName('content').getComponent(cc.Label).string = Task[i].content;

            this.ShowReward(add, Task[i].rewardInfo[0]);
            this.ShowTaskBtn(add, Task[i].taskState);
            add.active = true;
            add.targetType = Task[i].targetType;
            add.task_id = Task[i].id;
            this.newer_layout.addChild(add);
        }
    },
    ShowSpecialTask: function ShowSpecialTask(Task) {
        if (Task.length == 0) {
            this.special_layout.active = false;
            return;
        }
        //this.special_layout.removeAllChildren();
        this.DestroyAllChildren(this.special_layout);
        this.special_layout.active = true;
        for (var i = 0; i < Task.length; i++) {
            var add = cc.instantiate(this.prefab_demo1);
            add.name = 'task_' + Task[i].id;
            add.getChildByName('title').getComponent(cc.Label).string = Task[i].title;
            add.getChildByName('content').getComponent(cc.Label).string = Task[i].content;
            this.ShowReward(add, Task[i].rewardInfo[0]);
            this.ShowTaskBtn(add, Task[i].taskState);
            add.active = true;
            add.targetType = Task[i].targetType;
            add.task_id = Task[i].id;
            this.special_layout.addChild(add);
        }
    },
    ShowTaskBtn: function ShowTaskBtn(node, taskState) {
        if (taskState == 0) {
            node.getChildByName('btn_task').active = true;
            node.getChildByName('btn_finish').active = false;
        } else if (taskState == 1) {
            node.getChildByName('btn_task').active = false;
            node.getChildByName('btn_finish').active = true;
        } else {
            node.getChildByName('btn_task').active = false;
            node.getChildByName('btn_finish').active = false;
        }
    },
    ShowReward: function ShowReward(node, rewardInfo) {
        var prizeType = rewardInfo.prizeType;
        var count = rewardInfo.count;
        //1-金币,// 2-(水晶)兑换券// 6-金币// 8-红包  // 9圈卡  // 10 固定红包
        //1 - 乐豆   //2 - 房卡 //3 - 圈卡  //4 - 固定红包  //5 - 随机红包
        node.getChildByName('type').getComponent(cc.Sprite).spriteFrame = this.reward_icon[prizeType - 1];
        // if(prizeType==1){
        //     node.getChildByName('type').getComponent(cc.Sprite).spriteFrame=this.reward_icon[0];
        // }else if(prizeType==2){
        //     node.getChildByName('type').getComponent(cc.Sprite).spriteFrame=this.reward_icon[1];
        // }else if(prizeType==6){
        //     node.getChildByName('type').getComponent(cc.Sprite).spriteFrame=this.reward_icon[2];
        // }else if(prizeType==8 || prizeType==10){
        //     count=count/100;
        //     node.getChildByName('type').getComponent(cc.Sprite).spriteFrame=this.reward_icon[3];
        // }else if(prizeType==9){
        //     node.getChildByName('type').getComponent(cc.Sprite).spriteFrame=this.reward_icon[4];
        // }
        // else{
        //     this.ShowSysMsg(prizeType + "没有这类型")
        // }
        if (count >= 10000) {
            node.getChildByName('num').getComponent(cc.Label).string = '+' + count / 10000 + '万';
        } else {
            node.getChildByName('num').getComponent(cc.Label).string = '+' + count;
        }
    },
    ShowXianJin: function ShowXianJin(money) {
        this.node.getChildByName('left_main').getChildByName('lb_xianjin').getComponent(cc.Label).string = money / 100;
    },
    /*
                            Invite,         // 1-邀请新用户
                            ReferralCode,       // 2-绑定邀请码
                            Promoters,      // 3-成为推广员
                            Arena,          // 4-进入比赛场完成游戏
                            Club,           // 5-加入/创建一个亲友圈
                            Certification,      // 6-完成实名认证
                            ShareCardType,      // 7-分享X次牌型
                            SetCount,       // 8-完成X局游戏
                            Share,          // 9-通过微信/朋友圈分享游戏X次
                            InviteCount,        // 10-成功邀请新用户统计
    */
    GoTask: function GoTask(targetType) {
        if (targetType == 1) {
            this.FormManager.ShowForm('UITaskYaoQing');
        } else if (targetType == 2) {
            this.FormManager.ShowForm('UIBangDingTuiGuang');
        } else if (targetType == 3) {
            this.FormManager.ShowForm('UIDaiLiCopy');
        } else if (targetType == 4) {
            this.FormManager.ShowForm('UIRacePublic');
        } else if (targetType == 5) {
            this.ShowSysMsg("暂无亲友圈界面");
            // this.FormManager.ShowForm("ui/club/UIClubNone");
            //this.FormManager.ShowForm("ui/club/UIClub");
            //this.FormManager.ShowForm('UIClub');
        } else if (targetType == 6) {
            this.FormManager.ShowForm('UIShiMing');
        } else if (targetType == 7) {
            this.ShowSysMsg("去参与麻将牌局游戏吧");
        } else if (targetType == 8) {
            this.ShowSysMsg("去参与任意游戏吧");
        } else if (targetType == 9) {
            this.FormManager.ShowForm('UIShare');
        } else if (targetType == 10) {
            this.FormManager.ShowForm('UITaskYaoQing');
        }
    },
    LingQu: function LingQu(task_id) {
        var that = this;
        app.NetManager().SendPack("task.CTaksReceiveTask", { 'id': task_id }, function (reward) {
            var msg = [];
            for (var i = 0; i < reward.length; i++) {
                if (reward[i].prizeType == 1) {
                    msg.push('乐豆' + reward[i].count);
                } else if (reward[i].prizeType == 2) {
                    msg.push('兑换券' + reward[i].count);
                } else if (reward[i].prizeType == 6) {
                    msg.push('房卡' + reward[i].count);
                } else if (reward[i].prizeType == 8) {
                    msg.push('红包' + reward[i].count / 100 + '元');
                } else if (reward[i].prizeType == 9) {
                    msg.push('圈卡' + reward[i].count + '张');
                }
            }
            var text = msg.join(',');
            that.ShowSysMsg("恭喜您获得" + text);
            that.ShowTask();
        }, function (evnet) {
            that.ShowSysMsg("奖励领取失败，请稍后重试");
        });
    },
    OnClick: function OnClick(btnName, btnNode) {

        if ('btn_task' == btnName) {
            var targetType = btnNode.parent.targetType;
            this.GoTask(targetType);
        } else if ('btn_finish' == btnName) {
            //task.CTaksReceiveTask
            var task_id = btnNode.parent.task_id;
            this.LingQu(task_id);
        } else if ('btn_tixian' == btnName) {
            this.ShowSysMsg("功能开发中...");
        }
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
    }
});

cc._RF.pop();