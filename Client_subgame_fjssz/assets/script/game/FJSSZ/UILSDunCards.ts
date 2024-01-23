
const {ccclass, property} = cc._decorator;
var app = require("fjssz_app");
@ccclass
export default class UILSDunCards extends cc.Component {

    posVec : cc.Vec2[] = []
    angleVec : number[] = []
    onLoad(){
        for (let i = 1; i <= 13; i++) {
			let node = this.node.getChildByName("dun_card" + i)
            this.posVec.push(cc.v2( node.x, node.y))
            this.angleVec.push(0/*node.angle*/)
            node.zIndex = i
		}
        if(this.node.getChildByName("img_special")){
            this.node.getChildByName("img_special").zIndex = cc.macro.MAX_ZINDEX
        }
        if (this.node.getChildByName("show")) {
            this.node.getChildByName("show").zIndex = cc.macro.MAX_ZINDEX
        }
        if (this.node.getChildByName("reset")) {
            this.node.getChildByName("reset").zIndex = cc.macro.MAX_ZINDEX
        }
    }
    startAni() {
        this.stopWaitAnim()
        this.schedule(this.playWaitAnim.bind(this), 2, 99999,0.0)
        let names = ["dun_card3", "dun_card8","dun_card13"]
        for (let dunIndex = 0; dunIndex < names.length; dunIndex++) {
            let node = this.node.getChildByName(names[dunIndex]).getChildByName("tag")
            if(node) node.active = false
        }
        this.resetIndex()
    }

    stopWaitAnim()
    {
        this.unscheduleAllCallbacks()
        for (let i = 1; i <= 13; i++) {
			let node = this.node.getChildByName("dun_card" + i)
            node.x = this.posVec[i-1].x
            node.y = this.posVec[i-1].y
            node.angle = this.angleVec[i-1]
            node.stopAllActions()
        }
    }

    resetAngle()
    {
        for (let i = 1; i <= 13; i++) {
			let node = this.node.getChildByName("dun_card" + i)
            node.x = this.posVec[i-1].x
            node.y = this.posVec[i-1].y
            node.angle = 0
        }
    }

    playWaitAnim () {
        // let m = this.node.getChildByName("dun_card11")
        // for (let i = 1; i <= 13; i++) {
		// 	let node = this.node.getChildByName("dun_card" + i)
        //     if (i <= 3) {
        //         cc.tween(node).delay(0.4)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
        //     else if (i <= 8) {
        //         cc.tween(node).delay(0.2)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1.2)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
        //     else{
        //         cc.tween(node)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1.4)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
		// }
    }
    showCardType(dunIndex, cardType){
        let names = ["dun_card3", "dun_card8","dun_card13"]
        let node = this.node.getChildByName(names[dunIndex]).getChildByName("tag")
        if(!node) return
        if (cardType == 9 || cardType == 10) {
            cardType = 8
        }
        cc.loader.loadRes("texture/game/ls/play/cardType_"+cardType, cc.SpriteFrame, function (error, spriteFrame) {
            if(error){
                return;
            }
            node.active = true
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }

    fanPaiAction(dunIndex){
        let s = [[1,3], [4, 8],[9,13]]
        let s2 = s[dunIndex]
        if(!s2) return
        for (let i = s2[0]; i <= s2[1]; i++) {
            let node = this.node.getChildByName("dun_card" + i)
            node.stopAllActions()
            if(node.zIndex < 1000) node.zIndex = 1000+node.zIndex
            cc.tween(node)
            .to(0.1, {scale : 1.3})
            .delay(0.45)
            .to(0.1, {angle:0})
            .delay(0.2)
            .to(0.1, {scale : 1.0})
            .call(()=>{
                //if(node.zIndex >= 1000) node.zIndex = node.zIndex - 1000
            })
            .start()
        }
    }

    touch(){
        if (this.node.parent.parent && this.node.parent.parent.name == "sp_seat00") {
            let ranked = app[app.subGameName.toUpperCase() + "RoomSet"]().GetRoomSetProperty("ranked");
            cc.log(ranked)
            if(!ranked || !ranked.dunPos || !ranked.dunPos.first) return
            var dunPos = ranked.dunPos
			let cards = dunPos.first.concat(dunPos.second).concat(dunPos.third)
            for (let i = 1; i <= 13; i++) {
				let node = this.node.getChildByName("dun_card" + i)
				app.playuissz.ShowResultCard(cards[i-1] || 0, node)
			}
            this.scheduleOnce(()=>{
                for (let i = 1; i <= 13; i++) {
                    let node = this.node.getChildByName("dun_card" + i)
                    node.getChildByName("poker_back").active = true
                }
            }, 5)
        }
    }

    reset(){
        if (this.node.parent.parent && this.node.parent.parent.name == "sp_seat00") {
            let ranked = app[app.subGameName.toUpperCase() + "RoomSet"]().GetRoomSetProperty("ranked");
            cc.log(ranked)
            if(!ranked || !ranked.dunPos || !ranked.dunPos.first) return
			app.playuissz.Click_btn_baipai()
        }
    }
    resetIndex() {
        let s = [[1,3], [4, 8],[9,13]]
        for (let dunIndex = 0; dunIndex < 3; dunIndex++) {
            let s2 = s[dunIndex]
            if(!s2) continue
            for (let i = s2[0]; i <= s2[1]; i++) {
                let node = this.node.getChildByName("dun_card" + i)
                node.stopAllActions()
                if(node.zIndex >= 1000) node.zIndex = node.zIndex-1000
                node.rotation = 0
            }
        }
    }
    protected update(dt: number): void {
        let showActive = true
        let showReset = true
        let node = this.node.getChildByName("dun_card1")
        if (!this.node.parent.parent || this.node.parent.parent.name != "sp_seat00") {
            showActive = false
            showReset = false
        }else if(node.getChildByName("poker_back").active == false){
            showActive = false
        }
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room = RoomMgr.GetEnterRoom();
		let roomState = room.GetRoomProperty("state");
        if (roomState != app[app.subGameName + "_ShareDefine"]().RoomState_Playing) {
            showActive = false
            showReset = false
        }
        let ClientPos = RoomMgr.GetEnterRoom().GetRoomPosMgr().GetClientPos();
        let myPosInfo = RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(ClientPos);
        if (!myPosInfo || !myPosInfo.isCardReady) {
            showReset = false
        }
        if (this.node.getChildByName("show")) {
            this.node.getChildByName("show").active = showActive
        }
        if (this.node.getChildByName("reset")) {
            this.node.getChildByName("reset").active = showReset
        }
    }
}
