var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		pokers: [cc.Node],
		pokerBg: cc.Node,
	},

	OnCreateInit: function () {
		this.PokerModle = app[app.subGameName + "_PokerCard"]();
		this.canTouch = false;
		this.timeOutList = [];
		for (let i = 0; i < this.pokers.length; i++) {
			//this.pokers[i].on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
			this.pokers[i].on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
			this.pokers[i].on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
			this.pokers[i].on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
		}
		//this.pokerBg.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
		this.pokerBg.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
		this.pokerBg.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
		this.pokerBg.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);

		this.node.getComponent(cc.Animation).on('finished', this.OnAniFinished, this);
	},

	OnShow: function (type, pokers) {
		if (!pokers) {
			console.error('show UIRubPoker need Pokers value');
			this.CloseForm();
			return;
		}
		for (let i = 0; i < this.timeOutList.length; i++)
			clearTimeout(this.timeOutList[i]);
		for (let i = 0; i < this.pokers.length; i++) {
			this.pokers[i].stopAllActions();
			this.pokers[i].x = 0;
			this.pokers[i].y = -80;
			this.pokers[i].angle = 0;
			this.pokers[i].active = false;
		}
		this.gameType = app.subGameName;
		this.rubType = type;
		this.dataPokers = pokers;
		this.UpdateUI();
		this.canTouch = true;
		this.timeOutList = [];

		this.pokerBg.x = 0;
		this.pokerBg.y = -80;
		this.pokerBg.active = true;

		this.minX = -(cc.winSize.width / 2);
		this.maxX = cc.winSize.width / 2;
		this.minY = -(cc.winSize.height / 2);
		this.maxY = cc.winSize.height / 2;
	},
	UpdateUI: function () {
		if (0 == this.rubType) {//搓五张的
			for (let i = 0; i < this.dataPokers.length; i++) {
				this.PokerModle.GetPokeCard(this.dataPokers[i], this.pokers[i], true);
				this.pokers[i].active = true;
			}
		} else {
			this.PokerModle.GetPokeCard(this.dataPokers[4], this.pokers[2], true);
			this.pokers[2].active = true;
		}
	},
	// update:function(dt){

	// },

	OnTouch: function (event) {
		if (!this.canTouch)
			return;
		if ('touchstart' == event.type) {

		}
		else if ('touchend' == event.type || 'touchcancel' == event.type) {
			if (event.target.x - event.target.width < this.minX)//牌有放大2倍宽不/2
				event.target.x = this.minX + event.target.width;
			else if (event.target.x + event.target.width > this.maxX)
				event.target.x = this.maxX - event.target.width;

			if (event.target.y < this.minY)
				event.target.y = this.minY;
			else if (event.target.y + event.target.height * 2 > this.maxY)//牌有放大2倍高*2
				event.target.y = this.maxY - event.target.height * 2;

			if (0 == this.rubType && 'card1' == event.target.name)
				this.canTouch = false;
			else if (1 == this.rubType)
				this.canTouch = false;

			if (!this.canTouch) {
				if (0 == this.rubType) {
					let self = this;
					let timeId = setTimeout(function () {
						for (let s = 0; s < self.timeOutList.length; s++) {
							if (timeId == self.timeOutList[s]) {
								self.timeOutList.splice(s, 1);
								break;
							}
						}
						self.pokerBg.active = false;
						for (let i = 0; i < self.pokers.length; i++) {
							let action = null;
							if (0 != i)
								action = cc.moveTo(0.5, cc.p(0, -80));
							else {
								action = cc.sequence(
									cc.moveTo(0.5, cc.p(0, -80)),
									cc.callFunc(self.OnRunActionEnd, self, [])
								);
							}
							self.pokers[i].runAction(action);
						}
					}, 1000);
					this.timeOutList.push(timeId);
				}
				else {
					this.OnAniFinished(null);
				}
			}
		}
		else if ('touchmove' == event.type) {
			let pos = this.node.convertToNodeSpaceAR(event.getLocation());
			event.target.y = pos.y;
			event.target.x = pos.x;
		}
	},

	OnRunActionEnd: function (sender, useData) {
		this.node.getComponent(cc.Animation).play("nnRubPokerAni");
	},

	OnAniFinished: function (event) {
		let self = this;
		let timeId = setTimeout(function () {
			for (let s = 0; s < self.timeOutList.length; s++) {
				if (timeId == self.timeOutList[s]) {
					self.timeOutList.splice(s, 1);
					break;
				}
			}
			self.CloseForm();
		}, 3000);
		this.timeOutList.push(timeId);
		app[app.subGameName + "Client"].OnEvent("RubPokerEnd", {});
	},
	OnClose: function () {
		for (let i = 0; i < this.pokers.length; i++) {
			this.pokers[i].stopAllActions();
			this.pokers[i].x = 0;
			this.pokers[i].y = -80;
			this.pokers[i].angle = 0;
			this.pokers[i].active = false;
		}
		for (let i = 0; i < this.timeOutList.length; i++)
			clearTimeout(this.timeOutList[i]);

		this.timeOutList = [];
	},
});
