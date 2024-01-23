var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
		
    },
    OnCreateInit: function (cards) {
       
        
    },
    OnShow: function (cards) {
        let c = []
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            c.push(element.key)
        }
        cards = c
        this.cards = cards
        cards.sort()
        this.totalNum = 0
        this.cardMap = {}
        for (let i = 0; i < cards.length; i++) {
            const element = this.GetValue(cards[i]);
            if(!element) continue
            if (!this.cardMap[element]) {
                this.cardMap[element] = []
            }
            this.cardMap[element].push(cards[i])
        }
        cc.log(this.cardMap)

        let model = this.node.getChildByName("model")
        let bg = this.node.getChildByName("bg")
        for (let i = 0; i < bg.children.length; i++) {
            const element = bg.children[i];
            element.destroy()
        }
        for (const key in this.cardMap) {
            if (!Object.hasOwnProperty.call(this.cardMap, key)) continue;
            let item = cc.instantiate(model)
            item.parent = bg
            item.active = true
            let name = this.GetName(key)
            item.getChildByName("poker").getChildByName("Label").getComponent(cc.Label).string = name
            item.name = key
        }
        model.active = false
    },
    GetValue:function(v){
        let or = parseInt(v.substring(0,4))
        v = or
        if(!v) v = 0
        v = v%16;
        if(or > 0x40){
            return 14
        }
        if (v == 14) {
            return 1
        }
        if (v == 15) {
            return 2
        }
        return v
    },
    GetName:function(v){
        if(!v) return ""
        let names = ["扑克A","扑克2","扑克3","扑克4","扑克5","扑克6","扑克7","扑克8","扑克9",
        "扑克10","扑克J","扑克Q","扑克K","小鬼","大鬼"]
        return names[v-1] || ""
    },
    Sure:function(){
        let bg = this.node.getChildByName("bg")
        let test = []
        for (let i = 0; i < bg.children.length; i++) {
            const element = bg.children[i].name;
            if (!this.cardMap[element] || this.cardMap[element].length == 0) continue
            let num = parseInt(bg.children[i].getChildByName("num").getComponent(cc.Label).string)
            for (let index = 0; index < Math.min(num, this.cardMap[element].length); index++) {
                test.push(parseInt(this.cardMap[element][index]))
            }
        }
        if(test.length != 13){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("请选择13张牌");
            return
        }
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        if(!RoomMgr) return;
		let roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if(!roomID) return
        let that = this
        this.SendChat(5, 9988, roomID, JSON.stringify(test),(msg)=>{
            console.log(msg)
            if(msg.code == "Success")
            {
                this.ShowSysMsg(msg.msg);
                that.CloseForm()
            }
        });
        console.log(test)
    },
    Add:function(event){
        let bg = this.node.getChildByName("bg")
        let key = event.target.parent.name
        let num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string)
        num ++
        if (this.totalNum >= 13) return
        if (num > this.cardMap[key].length) {
            num = this.cardMap[key].length
        }
        else{
            this.totalNum ++
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num
    },
    Del:function(event){
        let bg = this.node.getChildByName("bg")
        let key = event.target.parent.name
        let num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string)
        num --
        if (num < 0) {
            num = 0
        }
        else{
            this.totalNum --
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num
    },
    SendChat:function (type, quickID, roomID, content,success) {
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", 
        {"type":type, "quickID":quickID, "targetID":roomID, "content":content}, success);
	},
});
