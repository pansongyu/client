/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        
        let hupaifangshi = this.GetIdxByKey('hupaifangshi');
        let xiapao = this.GetIdxByKey('xiapao');
        let fengpai = this.GetIdxByKey('fengpai');
        let gangdi = this.GetIdxByKey('gangdi');
        let zimosuanfen = this.GetIdxByKey('zimosuanfen');
        let dianpaosuanfen = this.GetIdxByKey('dianpaosuanfen');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "hupaifangshi": hupaifangshi,
            "xiapao": xiapao,
            "fengpai": fengpai,
            "gangdi": gangdi,
            "zimosuanfen": zimosuanfen,
            "dianpaosuanfen": dianpaosuanfen,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    AdjustSendPack: function (sendPack) {
        return sendPack;
    },
    UpdateOnClickToggle:function(){
        if(this.Toggles["kexuanwanfa"]){
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if(this.Toggles["hupaifangshi"][0].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][4].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][4].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
    },
});

module.exports = fzmjChildCreateRoom;