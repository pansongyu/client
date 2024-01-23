var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		kehuPrefab: cc.Prefab,
		layout: cc.Node,
	},

	OnCreateInit: function () {
	},
	SortByCardType: function (a, b) {
		if (a > b) {
			return 1;
		}
		return -1;
	},
	OnShow: function (cardMap, huCardTypeInfo) {
		cardMap.sort(this.SortByCardType);
		this.layout.removeAllChildren();
		let count = cardMap.length;
		if (count >= 21) {
			let addNode = cc.instantiate(this.kehuPrefab);
			addNode.name = this.ComTool.StringAddNumSuffix("card", 1, 2);
			this.layout.addChild(addNode);
			this.SetWndProperty("huscrollview/view/layout/card01/card", "image", "AnyCard");
			this.SetWndProperty("huscrollview/view/layout/card01/lb_num", "text", "");
			// this.SetWndProperty("layout/card01/redQ", "active", 0);
			this.SetWndProperty("huscrollview/view/layout/card01", "active", 1);
		} else {
			for (let i = 0; i < cardMap.length; i++) {
				let addNode = cc.instantiate(this.kehuPrefab);
				addNode.name = this.ComTool.StringAddNumSuffix("card", i + 1, 2);
				this.layout.addChild(addNode);
				let cardIDType = cardMap[i];
				let imageName = ["CardShow", cardIDType].join("");
				let path = this.ComTool.StringAddNumSuffix("huscrollview/view/layout/card", i + 1, 2);
				this.SetWndProperty(path + "/card", "image", imageName);
				this.SetWndProperty(path, "active", 1);
				let numPath = [path, "lb_num"].join("/");
				let numString = 4;
				if (huCardTypeInfo[cardIDType]) {
					numString = 4 - huCardTypeInfo[cardIDType];
				}
				this.SetWndProperty(numPath, "text", numString);
			}
		}
	},
	OnClose: function () {
		this.layout.removeAllChildren();
	},
});
