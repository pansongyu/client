var app = require("app");
cc.Class({
    extends: require("UIUnionManager"),

    properties: {
       
    },

    UpdateLeftBtn:function(){
        let btn_Setting = this.node.getChildByName("left").getChildByName("btn_Setting");
        let btn_Data = this.node.getChildByName("left").getChildByName("btn_Data");
        let btn_Member = this.node.getChildByName("left").getChildByName("btn_Member");
        let btn_Wanfa = this.node.getChildByName("left").getChildByName("btn_Wanfa");
        let btn_Message = this.node.getChildByName("left").getChildByName("btn_Message");
        let btn_MemberCheck = this.node.getChildByName("left").getChildByName("btn_MemberCheck");
        let btn_RaceRank = this.node.getChildByName("left").getChildByName("btn_RaceRank");
        let btn_ForbidTable = this.node.getChildByName("left").getChildByName("btn_ForbidTable");
        let btn_RaceRankZhongzhi = this.node.getChildByName("left").getChildByName("btn_RaceRankZhongzhi");
        btn_RaceRankZhongzhi.active = false;//仅盟主有
        let btn_Management = this.node.getChildByName("left").getChildByName("btn_Management");
        let btn_ForbidGame = this.node.getChildByName("left").getChildByName("btn_ForbidGame");
        let btn_SetSkinType = this.node.getChildByName("left").getChildByName("btn_SetSkinType");
        if(this.myisminister == app.ClubManager().Club_MINISTER_MGRSS){//赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }else if (this.unionPostType == app.ClubManager().UNION_GENERAL) {//普通成员
            btn_Setting.active = false;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = false;
            if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                btn_MemberCheck.active = true;   
            }else{
                btn_MemberCheck.active = false;
            }
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        }else if(this.unionPostType == app.ClubManager().UNION_CLUB){//亲友圈创建者
            btn_Setting.active = true;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        }else if(this.unionPostType == app.ClubManager().UNION_MANAGE){//赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }else if(this.unionPostType == app.ClubManager().UNION_CREATE){//赛事创建者
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
            btn_RaceRankZhongzhi.active = true;
        }
        //赛事数据暂时放后台统计
        btn_Data.active = false;
        btn_RaceRank.active = false;
    },
});