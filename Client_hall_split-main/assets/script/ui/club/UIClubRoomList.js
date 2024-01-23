/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
    	roomlist_scrollView:cc.ScrollView,
        roomlist_layout:cc.Node,
        roomlist_demo:cc.Node,
        roomlist_bottom:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.RegEvent("OnClubRoomCfgs", this.Event_RoomCfgs);
        this.RegEvent("OnClubRoomCfgChange", this.Event_RoomCfgChange);
        this.discountType = [];
    },

    //---------显示函数--------------------

    OnShow:function(clubId){
        this.clubId=clubId;
    	this.roomlist_demo.active=false;
        this.roomlist_scrollView.scrollToTop();
        //this.roomlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.roomlist_layout);
        app.ClubManager().SendGetRoomCfg(this.clubId);
        //this.ShowRoomList();
        let that = this;
        // app.NetManager().SendPack('discount.CDiscountList',{clubId:clubId},function(serverPack){
        //     that.GetDiscountTypeData(serverPack);
        // },function(error){
        //     console.error(error);
        // });
        // app.NetManager().SendPack('game.CPlayerAllGameList',{},function(serverPack){
        //     that.gameList = serverPack.gameList;
        // },function(error){
        //     console.error(error);
        // });
    },
    GetDiscountTypeData: function (serverPack) {
        console.log("GetDiscountTypeData", serverPack);
        this.discountType = serverPack;
    },
    Event_RoomCfgChange:function(event){
        let clubId = event.clubId;
        if(this.clubId != clubId)
            return;
        let isCreate = event.isCreate;
        let nomarlState = app.ClubManager().Enum_RoomCfg_Nomarl;
        let disableState = app.ClubManager().Enum_RoomCfg_Disable;
        let delState = app.ClubManager().Enum_RoomCfg_Delete;
        let reviseState = app.ClubManager().Enum_RoomCfg_Revise;
        let roomData = event.clubCreateGameSet;

        let waitRoomCount=event.waitRoomCount;
        let playingRoomCount=event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string=waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string=playingRoomCount;


        if(isCreate)
            this.roomCfgs.push(roomData);
        else{
            for(let i=0;i<this.roomCfgs.length;i++){
                if(roomData.bRoomConfigure.gameIndex == this.roomCfgs[i].bRoomConfigure.gameIndex){
                    if(delState == roomData.status)
                        this.roomCfgs.splice(i,1);
                    else
                        this.roomCfgs[i] = roomData;
                    break;
                }
            }
        }
        let cfg = null;
        if(!isCreate && delState != roomData.status)
            cfg = roomData;
        //还没修改this.roomCfgs
        this.ShowRoomList(cfg);
    },
    Event_RoomCfgs:function(event){
        let clubId = event.clubId;
        if(this.clubId != clubId)
            return;
        this.roomCfgs = event.clubCreateGameSets;
        this.ShowRoomList();
        let waitRoomCount=event.waitRoomCount;
        let playingRoomCount=event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string=waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string=playingRoomCount;
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if('MSG_CLUB_DissolveRoomCfg' == msgID){
            let roomData = backArgList[0];
            let jesanState = app.ClubManager().Enum_RoomCfg_Delete;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,jesanState);
        }else if('MSG_CLUB_DissolveRoom' == msgID){
            app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        }else if('MSG_CLUB_EXIT' == msgID){
            app.ClubManager().SendPlayerStateChange(this.clubId,app.HeroManager().GetHeroProperty("pid"),app.ClubManager().Enum_Leave);
            //this.FormManager.ShowForm('bottom');
        this.FormManager.CloseFormReal('ui/club/UIClubManager');
        }
        else if('MSG_CLUB_KICKPlayer' == msgID){
            let data = backArgList[0];
            app.ClubManager().SendPlayerStateChange(data.clubId,data.pid,data.kickState);
        }
    },
    ShowRoomList:function(roomCfg=null){
        if(!roomCfg){
            this.roomlist_scrollView.scrollToTop();
            //this.roomlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.roomlist_layout);
            for(let i=0;i<this.roomCfgs.length;i++){
                let nodePrefab = cc.instantiate(this.roomlist_demo);
                nodePrefab.name = this.roomCfgs[i].bRoomConfigure.gameIndex.toString();
                nodePrefab.roomData = this.roomCfgs[i];
                let gameType = this.roomCfgs[i].gameType;
                let cfg = this.roomCfgs[i].bRoomConfigure;
                let nameData = app.RoomCfgManager().GetRoomData(gameType,cfg);
                gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;

                nodePrefab.getChildByName('name').getComponent(cc.Label).string=app.RoomCfgManager().GetGameName(gameType,true);
                nodePrefab.getChildByName('renshu').getComponent(cc.Label).string=this.roomCfgs[i].bRoomConfigure.playerNum.toString();
                let payType='';
                if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==2){
                    payType=',大赢家付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                }else if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==1){
                    payType=',AA付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                }else if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==0){
                    payType=',管理付';
                }
                nodePrefab.getChildByName('wanfa').getComponent(cc.Label).string=app.RoomCfgManager().WanFa(this.roomCfgs[i].gameType,cfg)+payType;
                nodePrefab.getChildByName('zhuoshu').getComponent(cc.Label).string=this.roomCfgs[i].roomCount;
                nodePrefab.active=true;
                this.roomlist_layout.addChild(nodePrefab);
            }
        }else{
            let childs = this.roomlist_layout.children;
            let idxStr = roomCfg.bRoomConfigure.gameIndex.toString();
            for(let i=0;i<childs.length;i++){
                if(idxStr == childs[i].name){
                    childs[i].roomData = roomCfg;
                    let gameType = roomCfg.gameType;
                    let cfg = roomCfg.bRoomConfigure;
                    let nameData = app.RoomCfgManager().GetRoomData(gameType,cfg);
                    gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;
                    let gameName = app.RoomCfgManager().GetGameName(gameType,true);
                    let nameLabel = childs[i].getChildByName('name').getComponent(cc.Label);
                    nameLabel.string = gameName;
                    let renLabel = childs[i].getChildByName('renshu').getComponent(cc.Label);
                    renLabel.string = roomCfg.bRoomConfigure.playerNum.toString();
                    let wanfaLabel = childs[i].getChildByName('wanfa').getComponent(cc.Label);
                    gameType = roomCfg.gameType;
                    let payType='';
                    if(cfg.paymentRoomCardType==2){
                        payType=',胜家付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                    }else if(cfg.paymentRoomCardType==1){
                        payType=',AA付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                    }else if(cfg.paymentRoomCardType==0){
                        payType=',管理付';
                    }
                    wanfaLabel.string = app.RoomCfgManager().WanFa(gameType,cfg) + payType;
                    let zhuoLabel = childs[i].getChildByName('zhuoshu').getComponent(cc.Label);
                    zhuoLabel.string = roomCfg.roomCount;
                    break;
                }
            }
        }

    },

    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_jiesan' == btnName){
            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            this.SetWaitForConfirm('MSG_CLUB_DissolveRoomCfg',this.ShareDefine.Confirm,[],[roomData]);
        }else if('btn_qiyong' == btnName){
            let manage=btnNode.parent;
            manage.getComponent(cc.Sprite).enabled = false;
            manage.getChildByName('btn_jiesan').active=false;
            manage.getChildByName('btn_jinyong').active=false;
            manage.getChildByName('btn_qiyong').active=false;
            manage.getChildByName('btn_xiugai').active=false;

            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            let qiyongState = app.ClubManager().Enum_RoomCfg_Nomarl;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,qiyongState);
        }
        else if('btn_jinyong' == btnName){
            let manage=btnNode.parent;

            manage.getComponent(cc.Sprite).enabled = false;
            manage.getChildByName('btn_jiesan').active=false;
            manage.getChildByName('btn_jinyong').active=false;
            manage.getChildByName('btn_qiyong').active=false;
            manage.getChildByName('btn_xiugai').active=false;

            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            let jinyongState = app.ClubManager().Enum_RoomCfg_Disable;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,jinyongState);
        }
        else if('btn_manage'==btnName){
            let manage=btnNode.parent;
            let status = manage.parent.roomData.status;

            manage.getChildByName('btn_jiesan').active=!manage.getChildByName('btn_jiesan').active;
            manage.getComponent(cc.Sprite).enabled = manage.getChildByName('btn_jiesan').active;
            if(status==0){
                manage.getChildByName('btn_qiyong').active=false;
                manage.getChildByName('btn_jinyong').active=!manage.getChildByName('btn_jinyong').active;
            }else{
                manage.getChildByName('btn_qiyong').active=!manage.getChildByName('btn_qiyong').active;
                manage.getChildByName('btn_jinyong').active=false;
            }
            
            manage.getChildByName('btn_xiugai').active=!manage.getChildByName('btn_xiugai').active;
        }
        else if('btn_xiugai' == btnName){
            let changeRoomData = btnNode.parent.parent.roomData;
            let changeClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            let curCityId = changeClubData.cityId;
            let changeData = {};
            let selectGameList = [];
            selectGameList.push(app.ShareDefine().GametTypeNameDict[changeRoomData.gameType.toUpperCase()]);
            changeData.gameList = selectGameList;
            if(0 == changeData.gameList.length){
                this.ErrLog('btn_createRoom Error Club Not Set GameList');
                return
            }
            let nameData = app.RoomCfgManager().GetRoomData(changeRoomData.gameType,changeRoomData.bRoomConfigure);
            changeClubData = {};
            changeClubData.clubId = this.clubId;
            changeClubData.cityId = curCityId;
            // changeClubData.roomKey = changeRoomData.roomKey;
            changeClubData.gameIndex = changeRoomData.bRoomConfigure.gameIndex;//用来判断保存还是创建
            let selectType = ''!=nameData.smallName1?nameData.smallName1:nameData.bigName1;
            changeClubData.enableGameType = selectType;//不禁用的按钮
            changeData.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom',changeData,'',changeClubData);
        }else if('btn_createRoom' == btnName){
            let nowClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            let data = {};
            data.gameList = app.Client.GetAllGameId();
            if(0 == data.gameList.length){
                console.log('btn_createRoom Error Club Not Set GameList');
                return
            }
            //let gameType = this.ShareDefine.GametTypeID2PinYin[data.gameList[0]];
            let clubData = {};
            clubData.clubId = this.clubId;
            clubData.cityId = nowClubData.cityId;
            clubData.roomKey = '0';
            clubData.gameIndex = 0;//用来判断保存还是创建
            clubData.enableGameType = '';//不禁用的按钮
            data.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom',data,'',clubData);
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
