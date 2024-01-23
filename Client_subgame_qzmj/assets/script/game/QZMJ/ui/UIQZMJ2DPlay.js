var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseMaJiangForm"),

    properties: {
        backCardSpriteFrame01:cc.SpriteFrame,
        backCardSpriteFrame02:cc.SpriteFrame,

        SaiZi1:cc.SpriteFrame,
        SaiZi2:cc.SpriteFrame,
        SaiZi3:cc.SpriteFrame,
        SaiZi4:cc.SpriteFrame,
        SaiZi5:cc.SpriteFrame,
        SaiZi6:cc.SpriteFrame,

        headPrefab:cc.Prefab,

        card01Prefab:cc.Prefab,
        card02Prefab:cc.Prefab,
        card03Prefab:cc.Prefab,
        card04Prefab:cc.Prefab,

	    bg_electricity:[cc.SpriteFrame],
	    bg_charging:cc.SpriteFrame,

	    giftPrefabs:[cc.Prefab],
    },

    OnCreateInit: function () {
    	//获取properties属性
    	this.InitControlNode();

		this.RoomSet = app[app.subGameName.toUpperCase()+"RoomSet"]();
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
	    this.RoomPosMgr = app[app.subGameName.toUpperCase()+"RoomPosMgr"]();

        this.InitBase();
        this.RegBaseEvent();
        this.LoadAllImages();
    },

    //获取控件节点
    InitControlNode:function () {
        this.btn_ready = this.GetWndNode("sp_ready/btn_ready");
		this.btn_weixin = this.GetWndNode("sp_ready/btn_weixin");
		this.btn_roomkey = this.GetWndNode("sp_ready/btn_roomkey");
		this.btn_exit = this.node.getChildByName("btn_exit");
		this.sp_leftnum = this.node.getChildByName("sp_leftnum");
		this.nd_dice = this.node.getChildByName("nd_dice");
		this.lbnum = this.sp_leftnum.getChildByName("lbnum").getComponent(cc.Label);
		this.labelRoomId = this.GetWndNode("roomInfo/imgRoomIdDi/labelRoomId").getComponent(cc.Label);
		this.labelWanfa = this.GetWndNode("roomInfo/labelWanfa").getComponent(cc.Label);
		this.labelJu = this.node.getChildByName("labelJu").getComponent(cc.Label);
		this.roomInfo = this.node.getChildByName("roomInfo");
		this.bg_jinpai = this.node.getChildByName("bg_jinpai");
		this.touzi1 = this.nd_dice.getChildByName("touzi01").getComponent(cc.Sprite);
		this.touzi2 = this.nd_dice.getChildByName("touzi02").getComponent(cc.Sprite);
		this.sp_middle = this.node.getChildByName("sp_middle");
		this.seat01 = this.sp_middle.getChildByName("seat01").getComponent(cc.Animation);
		this.seat02 = this.sp_middle.getChildByName("seat02").getComponent(cc.Animation);
		this.seat03 = this.sp_middle.getChildByName("seat03").getComponent(cc.Animation);
		this.seat04 = this.sp_middle.getChildByName("seat04").getComponent(cc.Animation);
		this.kaijin1 = this.node.getChildByName("jin1");
		this.kaijin2 = this.node.getChildByName("jin2");
		this.lb_power = this.node.getChildByName("lb_power").getComponent(cc.Label);
		this.bg_power = this.node.getChildByName("bg_power");
		this.headNode = this.GetWndNode("headNodes/headNode");
		this.cardNodes = this.node.getChildByName("cardNodes");
		this.headPosNode = this.GetWndNode("headNodes/headPos");
		this.time = this.node.getChildByName("time").getComponent(cc.Label);
		this.btn_voice = this.node.getChildByName("btn_voice");
		this.appVersion = this.node.getChildByName("appVersion").getComponent(cc.Label);
		this.resVersion = this.node.getChildByName("resVersion").getComponent(cc.Label);
		this.giftNode = this.node.getChildByName("giftNode");
		this.now_time = this.roomInfo.getChildByName("time").getComponent(cc.Label);
    },
//--------------显示函数-----------------
	OnShow: function () {
		//确保该玩家还在该房间内，否则强制退出房间
		this.CheckInRoom();
		this.btn_voice.active = this.IsShowVoice();
		if(cc.sys.isNative){
			app[app.subGameName + "Client"].RegEvent("EvtBatteryLevel", this.OnEvent_BatteryLevel, this);
			app[app.subGameName+"_NativeManager"]().CallToNative("registerReceiver", []);
			this.appVersion.string = "appV" + app[app.subGameName+"_NativeManager"]().CallToNative("getVersion", [], "String");
			this.resVersion.string = "resV" + app[app.subGameName+"_HotUpdateMgr"]().getLocalVersion();
		} else{
			this.appVersion.string = '';
			this.resVersion.string = '';
		}
		this.CheckUpdateNotice();
		this.BackTime=0;
		this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIChooseChi");
		let is3DShow=this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName+"_is3DShow");
		if(is3DShow==1){
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "Play");
			this.CloseForm();
			return;
		}
		this.OnGiftAniEnd(null);//清理表情
		this.DelNode();
		this.room = this.RoomMgr.GetEnterRoom();
		this.InitAllCards();
		this.InitAllHead();
		this.InitAllNdOut();
		let room = this.room;
		let RoomPosMgr = room.GetRoomPosMgr();
		this.ShowMiddleSeatName(room);
		this.EffectActionState = this.NoAction;
		this.HideAllChild();
		this.StopPlayPosActionHelp();
		let SceneManager = app[app.subGameName+"_SceneManager"]();
		if(!room){
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
		//如果是初始化
		let GameBackMusic=this.LocalDataManager.GetConfigProperty("SysSetting","GameBackMusic");
		SceneManager.PlayMusic(GameBackMusic);

		if(state == this.ShareDefine.RoomState_Init){
			this.OnRoomInit(room);
		}
		else if(state == this.ShareDefine.RoomState_Playing){
			let clientPos = RoomPosMgr.GetClientPos();
			let isAuto = room.GetRoomDataInfo()['posList'][clientPos].trusteeship;
			if(isAuto){
				app[app.subGameName+"_GameManager"]().SetAutoPlayIng(true);
				app[app.subGameName+"_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay");
			}
			let dissolveInfo=room.GetRoomProperty('dissolve');
			if(typeof(dissolveInfo)!="undefined"){
				if(dissolveInfo){
					let posAgreeList=dissolveInfo.posAgreeList;
					if(0 != posAgreeList.length){
						this.FormManager.ShowForm(app.subGameName+"_UIMessage02");
					}
				}
			}
			this.OnRoomPlaying(room);
		}
		else if(state == this.ShareDefine.RoomState_End){
			this.OnRoomEnd(room);
		}
		else{
			this.ErrLog("OnShow:%s error",state);
		}
		//显示房间信息
		this.ShowRoomData();
		let dissolve = room.GetRoomProperty("dissolve");
		let endSec = dissolve["endSec"];
		if(endSec){
			this.FormManager.ShowForm(app.subGameName+"_UIMessage02");
		}
		let changePlayerNum = room.GetRoomProperty("changePlayerNum");
		let endSec2 = changePlayerNum["endSec"];
		if(endSec2){
			this.FormManager.ShowForm(app.subGameName+"_UIMessage03");
		}
		app[app.subGameName + "Client"].OnEvent('Head_PosUpdate',{});
		this.unschedule(this.ShowTime);
		this.time.string='';
		this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJHuPai");
		this.ShuaXining=false;
		this.CheckGpsIsOpen();
	},
	InitAllNdOut:function(){
		let players = this.RoomMgr.GetEnterRoom().GetRoomProperty('posList');
		this.playersCount=players.length;
		let childNum=6;
		if(this.playersCount==2){
			childNum = 20;
			for(let i=0;i<players.length;i++){
				let showpos=this.Pos2Show(i);
				this.Init2RenNdOut(showpos,childNum);
			}
		}else if(this.playersCount==3){
			childNum = 10;
			for(let i=0;i<players.length;i++){
				let showpos=this.Pos2Show(i);
				this.Init3RenNdOut(showpos,childNum);
			}
		}else if(this.playersCount==4){
			childNum = 9;
			for(let i=0;i<players.length;i++){
				let showpos=this.Pos2Show(i);
				this.InitNdOut(showpos,childNum);
			}
		}
	},
	Init2RenNdOut:function(pos,childNum){
		this.nd_out01=this.node.getChildByName('nd_out01');
		this.nd_out02=this.node.getChildByName('nd_out02');
		this.nd_out03=this.node.getChildByName('nd_out03');
		this.nd_out04=this.node.getChildByName('nd_out04');
		let nd_outLineNum=4;//总共4排
		let nd_outChild=false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName+'/nd_out');

		//初始化花
        let hua_node=this.GetWndNode(wndName+'/hua');
        for(let i=1;i<=8;i++){
        	let hua_child =null;
        	if(pos==1){
        		hua_child = cc.instantiate(this.nd_out01);
        	}else if(pos==2){
        		hua_child = cc.instantiate(this.nd_out02);
        	}else if(pos==3){
        		hua_child = cc.instantiate(this.nd_out03);
        	}else if(pos==4){
        		hua_child = cc.instantiate(this.nd_out04);
        	}

            hua_child.name="hua"+i;
            hua_child.active=true;
            hua_node.addChild(hua_child);
        }


		if(pos==1){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name="pai"+j;
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}else if(pos==2){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name="pai"+j;
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,Math.abs(j-12));
				}
			}
		}else if(pos==3){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name="pai"+Math.abs(j-(childNum+1));
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}else if(pos==4){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name="pai"+j;
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}
	},
	Init3RenNdOut:function(pos,childNum){
		this.nd_out01=this.node.getChildByName('nd_out01');
		this.nd_out02=this.node.getChildByName('nd_out02');
		this.nd_out03=this.node.getChildByName('nd_out03');
		this.nd_out04=this.node.getChildByName('nd_out04');
		let nd_outLineNum=4;//总共4排
		let nd_outChild=false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName+'/nd_out');
		//初始化花
        let hua_node=this.GetWndNode(wndName+'/hua');
        for(let i=1;i<=8;i++){
        	let hua_child =null;
        	if(pos==1){
        		hua_child = cc.instantiate(this.nd_out01);
        	}else if(pos==2){
        		hua_child = cc.instantiate(this.nd_out02);
        	}else if(pos==3){
        		hua_child = cc.instantiate(this.nd_out03);
        	}else if(pos==4){
        		hua_child = cc.instantiate(this.nd_out04);
        	}

            hua_child.name="hua"+i;
            hua_child.active=true;
            hua_node.addChild(hua_child);
        }
		if(pos==1){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name="pai"+j;
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}else if(pos==2){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name="pai"+j;
					nd_outChild.active=1;
					nd_outNodeChild.addChild(nd_outChild,Math.abs(j-12));
				}
			}
		}else if(pos==3){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name="pai"+Math.abs(j-(childNum+1));
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}else if(pos==4){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name="pai"+j;
					nd_outChild.active=true;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}
	},
	InitNdOut:function(pos,childNum){
		this.nd_out01=this.node.getChildByName('nd_out01');
		this.nd_out02=this.node.getChildByName('nd_out02');
		this.nd_out03=this.node.getChildByName('nd_out03');
		this.nd_out04=this.node.getChildByName('nd_out04');
		let nd_outLineNum=4;//总共4排
		let nd_outChild=false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName+'/nd_out');
		//初始化花
        let hua_node=this.GetWndNode(wndName+'/hua');
        for(let i=1;i<=8;i++){
        	let hua_child =null;
        	if(pos==1){
        		hua_child = cc.instantiate(this.nd_out01);
        	}else if(pos==2){
        		hua_child = cc.instantiate(this.nd_out02);
        	}else if(pos==3){
        		hua_child = cc.instantiate(this.nd_out03);
        	}else if(pos==4){
        		hua_child = cc.instantiate(this.nd_out04);
        	}

            hua_child.name="hua"+i;
            hua_child.active=true;
            hua_node.addChild(hua_child);
        }
		if(pos==1){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name="pai"+j;
					nd_outChild.active=1;
					nd_outNodeChild.addChild(nd_outChild,j);

				}
			}
		}else if(pos==2){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name="pai"+j;
					nd_outChild.active=1;
					nd_outNodeChild.addChild(nd_outChild,Math.abs(j-12));
				}
			}
		}else if(pos==3){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name="pai"+Math.abs(j-(childNum+1));
					nd_outChild.active=1;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}else if(pos==4){
			for(let i=1;i<=nd_outLineNum;i++){
				let nd_outNodeChild=nd_outNode.getChildByName('out'+i);
				nd_outNodeChild.removeAllChildren();
				for(let j=1;j<=childNum;j++){
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name="pai"+j;
					nd_outChild.active=1;
					nd_outNodeChild.addChild(nd_outChild,j);
				}
			}
		}
	},
    //局结束,光泽麻将扎码需要重写
    Event_SetEnd:function(event){
    	this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJHuPai");
        this.unschedule(this.ShowTime);
        this.time.string='';
        this.StopPlayPosActionHelp();
        this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJKeHu");
        let room = this.RoomMgr.GetEnterRoom();
        room.GetRoomProperty('set').seePosList = [];
        room.GetRoomProperty('set').guangyouPos = -1;
        let huPlayerDict = {};
        let argDict = event;
        let setEnd = argDict["setEnd"];
        this.setEnd=setEnd;
        let posResultList = setEnd["posResultList"];
        let huTypeArray=new Array();
        let huSexArray=new Array();
        let playerSex = false;
        let huType='';
        for(let i = 0; i < posResultList.length; i++){
            if(posResultList[i].huType != this.ShareDefine.HuType_NotHu){
                let key = posResultList[i].pos;
                let pos = posResultList[i]["pos"];
                huType=posResultList[i].huType;
                huPlayerDict[key] = huType;
                playerSex = this.InitHeroSex(pos);
                huTypeArray[pos]=huType;
                huSexArray[pos]=playerSex;
            }
        }
        let posIDList = Object.keys(huPlayerDict);
        let huCount = posIDList.length;
        if(huCount){
            for(let i=0;i<4;i++){
                if(huTypeArray[i]>0){
                    let soundName = "";
                    let huTypeId=huTypeArray[i];
                    if(huTypeId==this.ShareDefine.HuType_LiuJinDao){
                        soundName = [huSexArray[i],"_liujindao"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_QiangJin){
                        soundName = [huSexArray[i],"_qiangjin"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_SanJinDao){
                        soundName = [huSexArray[i],"_sanjindao"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_SanYou){
                        soundName = [huSexArray[i],"_sanyou"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_ShuangYou){
                        soundName = [huSexArray[i],"_shuangyou"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_SiJinDao){
                        soundName = [huSexArray[i],"_sijindao"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_WuJinDao){
                        soundName = [huSexArray[i],"_wujindao"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_DanYou){
                        soundName = [huSexArray[i],"_youjin"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_ShiSanYao){
                        soundName = [huSexArray[i],"_shisanyao"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_DDHu){
                        soundName = [huSexArray[i],"_qidui"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_QGH){
                        soundName = [huSexArray[i],"_qiangganghu"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_ZiMo){
                        soundName = [huSexArray[i],"_zimo"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_PingHu){
                        soundName = [huSexArray[i],"_pinghu"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_JinQue){
                        soundName = [huSexArray[i],"_jinque"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_JinLong){
                        soundName = [huSexArray[i],"_jinlong"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_YiZhangHua){
                        soundName = [huSexArray[i],"_yizhanghua"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_WHuaWGang){
                        soundName = [huSexArray[i],"_wuhuawugang"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_HunYiSe){
                        soundName = [huSexArray[i],"_hunyise"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_QingYiSe){
                        soundName = [huSexArray[i],"_qingyise"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_DiHu){
                        soundName = [huSexArray[i],"_dihu"].join("");
                    }else if(huTypeId==this.ShareDefine.HuType_DanDiao){
                        soundName = [huSexArray[i],"_pinghu"].join("");
                    }else if(huTypeId == this.ShareDefine.HuType_JieDao ||
	                    huTypeId == this.ShareDefine.HuType_MenZi ||
	                    huTypeId == this.ShareDefine.HuType_PiHu ||
	                    huTypeId == this.ShareDefine.HuType_LuanFeng ||
	                    huTypeId == this.ShareDefine.HuType_CS_Tou ||
	                    huTypeId == this.ShareDefine.HuType_SC_Ke ||
	                    huTypeId == this.ShareDefine.HuType_SSBK ||
	                    huTypeId == this.ShareDefine.HuType_SSBK_Qing ||
	                    huTypeId == this.ShareDefine.HuType_JiePao){
                        soundName = [playerSex,"_pinghu"].join("");
                    }else if(huTypeId == this.ShareDefine.HuType_BuQiuR ||
	                    huTypeId == this.ShareDefine.HuType_KouTing ||
	                    huTypeId == this.ShareDefine.HuType_HaiDiLao ||
	                    huTypeId == this.ShareDefine.HuType_QingLong ||
	                    huTypeId == this.ShareDefine.HuType_SanAnKe){
                        soundName = [playerSex,"_pinghu"].join("");
                    }else if(huTypeId == this.ShareDefine.HuType_ZiMo){
                        soundName = [playerSex,"_pinghu"].join("");
                    }
                    if(soundName){
                        this.SoundManager.PlaySound(soundName);
                    }
                }
            }
            this.EffectActionState = this.EffectActionLong;
            this.OnEffectEnd(false,false);
        }
        else{
            //播放流局动画
            this.PlayEffect('liuju');
        }
        for(let posID = 0; posID <this.playersCount; posID++){
            let ShowPos=this.Pos2Show(posID);
            let formObj = this.GetCardComponentByPos(ShowPos);
            if(!formObj){
                this.ErrLog("Event_SetEnd not find:%s", formName);
                continue
            }
            if(ShowPos==1){
                formObj.OnClosePosActionHelp();
            }
            formObj.OnSetEnd(this.setEnd);
            let headFormObj = this.GetHeadByPos(ShowPos);
            headFormObj.UpDateLabJiFen();
            headFormObj.UpDateLabSportsPoint();
            headFormObj.OnClosePosActionHelp();
        }
        this.ActionFinishShowAllOutCard();
    },

    LoadAllImages:function(){
        let i=11;
        for(;i<=58;i++){
            let imageName = ["Card2DShow",i].join("");
            let imageInfo = this.IntegrateImage[imageName];
            if(!imageInfo){
                continue;
            }
            if(app['majiang_'+imageName]){
                continue;
            }
            let imagePath = imageInfo["FilePath"];
            let that = this;
                app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function(spriteFrame){
                    if(!spriteFrame){
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    //记录精灵图片对象
                    app['majiang_'+imageName]=spriteFrame;
            })
            .catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            })
        }
    },

    //摸牌
    Event_PosGetCard:function(event){
        this.HideAllSeeCard();
        let room = this.RoomMgr.GetEnterRoom();
        if(!room){
            this.ErrLog("Event_PosGetCard not enter room");
            return
        }
        let argDict = event;
        if(argDict){
            let pos = argDict["pos"];
            let isNormal = argDict["isNormal"];
            // let isBaiDa=argDict["isBaiDa"];
            // if(isBaiDa==true){
            //     let roomPosMgr = room.GetRoomPosMgr();
            //     let PlayerInfo=roomPosMgr.GetPlayerInfoByPos(pos);
            //     app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("BaiDaMesage", [PlayerInfo["name"]]);
            //     this.PosEffect(this.Pos2Show(pos),'guanerda');
            // }
            let formObj = this.GetCardComponentByPos(this.Pos2Show(pos));
            if(!formObj){
                this.ErrLog("Event_PosGetCard not find:%s", pos);
                return
            }
            formObj.OnPosGetCard();
            let leftCount = this.leftPaiNodeList.length;
            if(!leftCount){
                this.ErrLog("Event_PosGetCard leftPaiNodeList.length not card left:", argDict);
                return
            }
            if(isNormal){
                this.leftPaiNodeList.shift();
            }else{
                //从后面pop掉一张
                this.leftPaiNodeList.pop();
            }
            //刷新用户shoucard
            let clientSetPos = room.GetClientPlayerSetPos();
            if(!clientSetPos){
                this.ErrLog("PosgetCard GetClientPlayerSetPos fail");
                return
            }
            this.ShowLeftCardCount(room);
            app[app.subGameName + "Client"].OnEvent('Head_UpdateDa',{});
        }
    },
    ShowPosHuaCard:function(pos){
        let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
        let seatNode = this.GetWndNode(seatWndName);
        if(!seatNode){
            this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
            return
        }
        let hua_outNode = seatNode.getChildByName("hua");
        let hua_Out = hua_outNode.getComponent(app.subGameName+"_UIMJ2DPlay_Out");
        hua_Out.ShowHuaCard();
    },

    ShowPosOutCard:function(pos){
        let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
        let seatNode = this.GetWndNode(seatWndName);
        if(!seatNode){
            this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
            return
        }
        let nd_outNode = seatNode.getChildByName("nd_out");
        let UIPlay_Out = nd_outNode.getComponent(app.subGameName+"_UIMJ2DPlay_Out");
        UIPlay_Out.ShowAllOutCard();

        //显示花牌
        let hua_outNode = seatNode.getChildByName("hua");
        let hua_Out = hua_outNode.getComponent(app.subGameName+"_UIMJ2DPlay_Out");
        hua_Out.ShowHuaCard();
    },
    HideAllOutCard:function(){
        //遍历4个座位
        for(let index=0; index < this.ShareDefine.MJRoomJoinCount; index++){
            let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", index + 1, 2);
            let seatNode = this.GetWndNode(seatWndName);
            if(!seatNode){
                this.ErrLog("HideAllOutCard not find (%s)", seatWndName);
                continue
            }
            let nd_outNode = seatNode.getChildByName("nd_out");
            let UIPlay_Out = nd_outNode.getComponent(app.subGameName+"_UIMJ2DPlay_Out");
            UIPlay_Out.HideAllChild();

            //显示花牌
            let hua_outNode = seatNode.getChildByName("hua");
            let hua_Out = hua_outNode.getComponent(app.subGameName+"_UIMJ2DPlay_Out");
            hua_Out.HideAllChild();
        }
    },
    OnClose:function(){
        this.DelNode();
    },
    DelNode:function(){
        this.DeleteFormAllEffect();
        this.diceAnimation.stop();
        this.headNode.removeAllChildren();
        this.DeleteAllNdOut();
        this.cardNodes.getChildByName('card01').removeAllChildren();
        this.cardNodes.getChildByName('card02').removeAllChildren();
        this.cardNodes.getChildByName('card03').removeAllChildren();
        this.cardNodes.getChildByName('card04').removeAllChildren();
        this.node.getChildByName('sp_seat01').getChildByName('nd_out').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
        this.node.getChildByName('sp_seat02').getChildByName('nd_out').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
        this.node.getChildByName('sp_seat03').getChildByName('nd_out').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
        this.node.getChildByName('sp_seat04').getChildByName('nd_out').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
        this.node.getChildByName('sp_seat01').getChildByName('hua').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat02').getChildByName('hua').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat03').getChildByName('hua').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat04').getChildByName('hua').getComponent(app.subGameName+"_UIMJ2DPlay_Out").SetEffectNull();
    },
    DeleteAllNdOut:function(){
        let players = this.RoomMgr.GetEnterRoom().GetRoomProperty('posList');
        this.playersCount=players.length;
        for(let i=0;i<players.length;i++){
            let showpos=this.Pos2Show(i);
            let wndName = this.ComTool.StringAddNumSuffix("sp_seat", showpos, 2);
            let nd_outNode = this.GetWndNode(wndName+'/nd_out');
            for(let j=1;j<=3;j++){
                nd_outNode.getChildByName('out'+j).removeAllChildren();
            }
            let hua_node = this.GetWndNode(wndName+'/hua');
            hua_node.removeAllChildren();
        }
    },
    OnSetStart:function(roomSetId=0){
        let room = this.RoomMgr.GetEnterRoom();
        this.HideAllSeeCard();
        // this.ShowJin();
        this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJKeHu");
        this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJXiPai");
        let roomSet = room.GetRoomSet();

        let dPos = roomSet.GetRoomSetProperty("dPos");
        let DirectionDictKeys = Object.keys(this.DirectionDict);

        let roomPosMgr = room.GetRoomPosMgr();

        let ClientPos=roomPosMgr.GetClientPos();
        let DownPos=roomPosMgr.GetClientDownPos();
        let FacePos=roomPosMgr.GetClientFacePos();
        let UpPos=roomPosMgr.GetClientUpPos();

        /*if(dPos==ClientPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[0]]);
        }else if(dPos==DownPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[1]]);
        }else if(dPos==FacePos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[2]]);
        }else if(dPos==UpPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[3]]);
        }
        app[app.subGameName+"_SoundManager"]().PlaySound("dasaizi");*/

        this.StopPlayPosActionHelp();
        this.ShowAllOutCard(room);
        this.OnDiceFinished();
    },

    ShowKaiJinSprite:function(jin,btnNode){
            let cardType = Math.floor(jin/100);
            if(this.is3DShow==1){}
            let imageName = ["Card2DShow",cardType].join("");
            let imageInfo = this.IntegrateImage[imageName];
            if (imageInfo){
            let imagePath = imageInfo["FilePath"];
            let that = this;
            app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                    if(!spriteFrame){
                        that.ErrLog("ShowKaiJinSprite(%s) load spriteFrame fail", imagePath);
                        return;
                    }
                    btnNode.color=cc.color(255,255,0);
                    let wndSprite = btnNode.getComponent(cc.Sprite);
                    wndSprite.spriteFrame = spriteFrame;
                })
                .catch(function(error){
                    that.ErrLog("ShowKaiJinSprite(%s) error:%s", imagePath, error.stack);
            })
            }
            else {
                this.ErrLog('failed load imageName%s', imageName, cardType);
                return;
            }
    },
    ShowJin:function(){
        this.kaijin1.active=0;
        this.kaijin2.active=0;
        let jin1=this.RoomSet.get_jin1();
        let jin2=this.RoomSet.get_jinJin();
        let btnNode = this.GetWndNode("bg_jinpai");
        let btnNode2 = this.GetWndNode("bg_benjin");
        let that = this;
        if(jin1==0){
	        btnNode.active = false;
            let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
            wndSprite.spriteFrame ='';
        }else{
	        btnNode.active = true;
            let cardType = Math.floor(jin1/100);
            let imageName = ["CardShow",cardType].join("");
            let imageInfo = this.IntegrateImage[imageName];
            if (imageInfo){
            let imagePath = imageInfo["FilePath"];

            app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                    if(!spriteFrame){
                        that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath);
                        return;
                    }
                    btnNode.getChildByName('card').color=cc.color(255,255,0);
                    let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
                    wndSprite.spriteFrame = spriteFrame;
                })
                .catch(function(error){
                    that.ErrLog("JinShow(%s) error:%s", imagePath, error.stack);
            })
            }
            else {
                this.ErrLog('failed load imageName%s', imageName, cardType);
                return;
            }
        }
        if(jin2==0){
	        btnNode2.active = false;
            let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
            wndSprite2.spriteFrame ='';
        }else{
	        btnNode2.active = true;
            let cardType2 = Math.floor(jin2/100);
            let imageName2 = ["CardShow",cardType2].join("");
            let imageInfo2 = this.IntegrateImage[imageName2];
            if (imageInfo2){
            let imagePath2 = imageInfo2["FilePath"];
            app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath2, cc.SpriteFrame)
            .then(function(spriteFrame){
                    if(!spriteFrame){
                        that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath2);
                        return;
                    }
                    btnNode2.getChildByName('card').color=cc.color(255,255,0);
                    let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
                    wndSprite2.spriteFrame = spriteFrame;
                })
                .catch(function(error){
                    that.ErrLog("JinShow(%s) error:%s", imagePath2, error.stack);
            })
            }
            else {
                this.ErrLog('failed load imageName%s', imageName2, cardType2);
                return;
            }
        }
    },
	OnEvent_BatteryLevel:function(event){
		let power=event['Level'];
		let status=event['status'];
		if(power<=20){
			this.lb_power.node.color=cc.color(247,14,38);
		}else{
			this.lb_power.node.color=cc.color(255,255,255);
		}
		this.lb_power.string=power+"%";
		if(status==2){
			//充电中
			this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_charging;
		}else{
			if(power<=10){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[0];
			}else if(power<=20){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[1];
			}else if(power<=40){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[2];
			}else if(power<=60){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[3];
			}else if(power<100){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[4];
			}else{
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity[5];
			}
		}

	},

    ShowRoomData:function(){
        let room = this.RoomMgr.GetEnterRoom();
        let setID = room.GetRoomProperty("setID");
        if(setID==0){
        //    this.btn_exit.active=true;
        }else{
        //    this.btn_exit.active=false;
        }
        if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
            this.roomInfo.active = false;
            this.labelJu.node.active=false;
            this.node.getChildByName('btn_change').active=false;
            return;
        }else{
        	this.roomInfo.active = true;
            if(setID==0){
                this.node.getChildByName('btn_change').active=this.isChangeRen();
            }else{
                this.node.getChildByName('btn_change').active=false;
                this.FormManager.CloseForm(app.subGameName+'_UIMessage03');
            }
        }
        this.labelJu.node.active=true;
        let current = room.GetRoomConfigByProperty("setCount");
        this.roomInfo.active = true;
        // this.labelRoomId.string = "房间号："+room.GetRoomProperty("key");
        this.labelRoomId.string = room.GetRoomProperty("key");
        let playerAll = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
        let playerAllList= Object.keys(playerAll);
        let joinPlayerCount = playerAllList.length;

        if(current==102){
        	let total=joinPlayerCount*2;
        	let left=total-setID;
        	this.labelJu.string="剩:"+left+"庄";
        }else{
        	this.labelJu.string=app.i18n.t("UIMarkJuShu", {"Current": setID, "Total": current});
        }




        this.labelWanfa.string = this.WanFa();
    },
    Event_SetStart:function(event){
        this.ShowRoomData();
        this.FormManager.CloseForm("game/base/ui/majiang/"+app.subGameName+"_UIMJWinLost");
        this.HidePlayerReady();
        this.OnSetStart();
    },

	ShowImage:function () {
		this.SetWndProperty("sp_middle/seat01/sp1","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat01/sp2","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat02/sp1","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat02/sp2","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat03/sp1","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat03/sp2","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat04/sp1","image","UIPlay_2d_East0_1");
		this.SetWndProperty("sp_middle/seat04/sp2","image","UIPlay_2d_East0_1");
	},

	OnClick:function(btnName, btnNode){
		if(btnName == "btn_shuaxin"){
            this.Click_btn_shuaxin();
        }else if(btnName == "btn_change"){
            this.Click_btn_change();
        }else if(btnName == "btn_ok"){
            this.Click_btn_ok();
        }
		else if(btnName == "btn_ready"){
			this.Click_btn_ready();
		}else if(btnName == "btn_exit"){
			this.SetWaitForConfirm('UIMoreTuiChuFangJian',this.ShareDefine.Confirm,[],[]);
			//this.Click_btn_jiesan();
		}
		else if(btnName == "btn_out"){
			this.Click_btn_jiesan();
		}
		else if(btnName == "btn_weixin"){
			this.Click_btn_weixin();
		}else if (btnName == "btn_chat") {
			this.FormManager.ShowForm(app.subGameName+"_UIChat");
		}else if(btnName == "btn_voice"){

		}else if(btnName == "btn_roomkey"){
			let str = "房号："+this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
			this.Click_btn_fzkl(str);

		}else if(btnName=="btn_setting"){
			//let GameTyepStringUp=this.GameTyepStringUp();
			//GameTyepStringUp=GameTyepStringUp.replace('2D','');
			this.FormManager.ShowForm(app.subGameName+"_UISetting02");
			//this.FormManager.ShowForm('game/YGMJ/ui/UI'+GameTyepStringUp+'RoomSetting');
		}else if (btnName == "btn_gps") {
			this.OnBtn_GPS_Click();
		}else if(btnName == "btn_autoplay"){
			// this.Click_btn_moreshou();
			if(app[app.subGameName+"_GameManager"]().IsFristPlay()){
				app[app.subGameName+"_GameManager"]().SendAutoStart();
			}else{
				app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('MSG_CAN_NOT_AUTOPLAY');
			}
		}
		else{
			this.ErrLog("OnClick(%s) not find", btnName);
		}
	},
	//GPS按钮点击
	OnBtn_GPS_Click:function(){
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let PlayerCount = RoomPosMgr.GetRoomPlayerCount();
		if(PlayerCount <= 2){
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('MSG_GPS_LOST_PLAYER');
			return;
		}
		if (this.FormManager.IsFormShow(app.subGameName+"_UIGPSLoation")) {
			this.FormManager.CloseForm(app.subGameName+"_UIGPSLoation");
		} else {
			this.FormManager.ShowForm(app.subGameName+"_UIGPSLoation");
		}
	},
	OnUpdate:function(){
        let tick = Date.now();
        var DateNow = new Date();
        let Hours=DateNow.getHours();
        let Minutes=DateNow.getMinutes();
        var month = DateNow.getMonth() + 1;
        var day = DateNow.getDate();

        month=this.ComTool.StringAddNumSuffix("", month, 2);
        day=this.ComTool.StringAddNumSuffix("", day, 2);
        Hours=this.ComTool.StringAddNumSuffix("", Hours, 2);
        Minutes=this.ComTool.StringAddNumSuffix("", Minutes, 2);
        this.now_time.string=Hours+":"+Minutes;
        if(this.dealCardState == this.DealCard_InitState){

        }
        else if(this.dealCardState == this.DealCard_GetCardState){
            this.dealCardState = this.DealCard_InitState;
            //this.Deal_GetCardState(tick);
            this.AllPosOpenCardEffect2();
        }
        else if(this.dealCardState == this.DealCard_MoCardState){
            this.Deal_MoCardState(tick);
        }
        else if(this.dealCardState == this.DealCard_AlignCardState){
            if(this.nextDealCardTick > tick){
                return
            }
            /*let formObj = this.GetCardComponentByPos(1);
            formObj.OpenCardEffect2()*/
            this.dealCardState = this.DealCard_InitState;
        }
        else{
            this.ErrLog("OnUpdate dealCardState:%s error", this.dealCardState);
        }
    },
});