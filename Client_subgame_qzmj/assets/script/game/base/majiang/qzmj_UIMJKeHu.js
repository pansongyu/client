/*
 UIKeHu 胡牌提示
 */
var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_more:cc.Node,
        btn_less:cc.Node
    },

    OnCreateInit: function () {
        this.ComTool = app[app.subGameName+"_ComTool"]();
	    this.RegEvent("SetEnd", this.Event_SetEnd);
	    this.ShowKeHu=true;
    },
    jinNum:function(){
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin=roomSet.get_jin1();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let cardIDList=shouCard.slice();
		let haveJin=0;
		for(let i=0;i<cardIDList.length;i++){
			if(Math.floor(jin/100)==Math.floor(cardIDList[i]/100)){
				haveJin++;
			}
		}
		return haveJin;
	},
	/*
	是否配置游金必游
	 */
	isYouJinBiYou:function(){
    	if(app.subGameName=='lymj'){
	    	let room = this.RoomMgr.GetEnterRoom();
	    	let kexuanwanfa=room.GetRoomConfigByProperty('kexuanwanfa');
	        if(kexuanwanfa.length>0){
	            	if(kexuanwanfa.indexOf(0)>-1){
	            		return true;
	            	}
	        }
    	}
    	return false;
	},
	//双金必游检测,厦门麻将
    ShuangJinBiYou:function(){
    	if(app.subGameName=='xmmj'){
	    	let room = this.RoomMgr.GetEnterRoom();
			let current = room.GetRoomConfigByProperty("setCount");
			if(current!=100){
				if(this.jinNum()>=2){
	            	return true;
	        	}
			}
		}
		return false;
    },
    //有金必游检测,龙岩麻将
    YouJinBiYou:function(){
    	if(app.subGameName=='lymj'){
	    	let room = this.RoomMgr.GetEnterRoom();
	    	let kexuanwanfa=room.GetRoomConfigByProperty('kexuanwanfa');
	        if(kexuanwanfa.length>0){
	            	if(kexuanwanfa.indexOf(0)>-1){
	            		let clientSetPos = room.GetClientPlayerSetPos();
						let shouCard = clientSetPos.GetSetPosProperty("shouCard");
						let jin1=this.RoomSet.get_jin1();
						for(let index=0; index < shouCard.length; index++){
							let cardID=shouCard[index];
							if(Math.floor(cardID/100)==Math.floor(jin1/100)){
								return true;
							}
						}
	            	}
	        }
    	}
    	return false;
    },
    //仙游麻将进金
    //qzmj_kexuanwanfa
    XianYouJinJin:function(){
    	if(app.subGameName=='qzmj'){
	    	let room = this.RoomMgr.GetEnterRoom();
	    	let kexuanwanfa=room.GetRoomConfigByProperty('kexuanwanfa');
	        if(kexuanwanfa.length>0){
	            	if(kexuanwanfa.indexOf(0)>-1){
	            		return true;
	            	}
	        }
    	}
    	return false;
    },
    XiLaiQiaoJinJin:function(){
    	if(app.subGameName=='xlqmj'){
	    	return true;
    	}
    	return false;
    },
    QingDaoJinJin:function(){
    	if(app.subGameName=='qdmj'){
	    	let room = this.RoomMgr.GetEnterRoom();
	    	let wanfa=room.GetRoomConfigByProperty('wanfa');
	        if(wanfa==1){
	           return true;
	        }
    	}
    	return false;
    },
	Event_SetEnd:function(){
		this.CloseForm();
	},

    OnShow: function () { 
		this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        this.RoomSet = this.RoomMgr.GetEnterRoom().GetRoomSet();
        this.is3DShow=app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName+"_is3DShow");
		this.Show_KeHuPai();
    },
	Show_KeHuPai:function () {
		if(this.ShowKeHu==false){
			return false;
		} 
		
	    let jin1=this.RoomSet.get_jin1();
	    if(this.XiLaiQiaoJinJin()==true){
	    	jin1=this.RoomSet.get_jinJin();
	    }
	    let jin2=this.RoomSet.get_jin2();
        let room = this.RoomMgr.GetEnterRoom();
		if(!room){
			this.ErrLog("Show_KeHuPai not enter room");
			this.CloseForm();
			return
		}
		let roomPosMgr = room.GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let huCardTypeInfo = room.GetRoomSet().GetHuCardTypeInfo(clientPos);
		let cardTypeList = Object.keys(huCardTypeInfo);
		cardTypeList.SortList();
		let count = cardTypeList.length;

		//如果可胡34种,为任意可胡
		if(count >= 21){
			this.SetWndProperty("layout/card01/card", "image", "AnyCard");
			this.SetWndProperty("layout/card01/lb_num", "text", "");
			this.SetWndProperty("layout/card01", "active", 1);
			count = 1;
		}
		else{
			for(let i = 0; i < count; i++){
				let cardIDType = cardTypeList[i];
				let imageName ='';
				if(this.is3DShow==1 || this.is3DShow==2){
					imageName = ["CardShow", cardIDType].join("");
				}else if(this.is3DShow==0){
					imageName = ["Card2DShow", cardIDType].join("");
				}else {

				}
				let path = this.ComTool.StringAddNumSuffix("layout/card", i+1, 2);
				this.SetWndProperty(path+"/card", "image", imageName);
				let numPath = [path,"lb_num"].join("/");
				let numString = app.i18n.t("UIKeHu_cheng", {"KeHu":huCardTypeInfo[cardIDType]});
				if(cardIDType== Math.floor(jin1/100) || cardIDType== Math.floor(jin2/100)){
				    var value = numString.replace(/[^0-9]/ig,"");
				    numString="x "+(parseInt(value)-1).toString();
				}
				this.SetWndProperty(numPath, "text", numString);
				this.SetWndProperty(path, "active", 1);
				/*if(cardIDType== Math.floor(jin1/100)){
					this.SetWndProperty(path, "active", 0);
				}else{
					this.SetWndProperty(path, "active", 1);
				}*/
			}
		}

        let pai = this.node.getChildByName('layout').children;

		for(let i = count+1; i < pai.length; i++){
			if(i<=21){
				let path = this.ComTool.StringAddNumSuffix("layout/card", i, 2);
				this.SetWndProperty(path, "active", 0);
			}
		}
    },
    OnClick_less:function(){
    	this.ShowKeHu=false;
    	this.btn_more.active=true;
    	this.btn_less.active=false;
    	for(let i = 0; i < 21; i++){
			let path = this.ComTool.StringAddNumSuffix("layout/card", i+1, 2);
			this.SetWndProperty(path, "active", 0);
		}
    },
    OnClick_more:function(){
    	this.ShowKeHu=true;
    	this.Show_KeHuPai();
    	this.btn_more.active=false;
    	this.btn_less.active=true;
    },
});