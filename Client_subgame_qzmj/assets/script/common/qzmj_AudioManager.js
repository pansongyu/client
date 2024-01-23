/*
录音管理器
 */
var app = require("qzmj_app");

var qzmj_AudioManager = app.BaseClass.extend({

    Init:function(){
        this.JS_Name = app["subGameName"] + "_AudioManager";
        
        this.audioFileName = ""; //播放录音文件位置
        this.recordFileName = "";//录音文件
        
        this.recordPos = null; //录音位置

        this.isRecording = false; //是否正在录音

        this.isVoiceTouchEnd = false;

        this.audioList = [];

        //播放录音完成
        app[app.subGameName + "Client"].RegEvent("palyAudioFinsh",           this.OnEvent_PlayAudioFinish,   this);
        //录音失败
        app[app.subGameName + "Client"].RegEvent("AudioError",               this.OnEvent_AudioError,        this);
        //录音停止失败
        app[app.subGameName + "Client"].RegEvent("AudioStopError",           this.OnEvent_AudioStopError,        this);
        //播放失败
        app[app.subGameName + "Client"].RegEvent("MedioRecordError",         this.OnEvent_MedioRecordError,  this);
        //准备录音
        app[app.subGameName + "Client"].RegEvent("wellPrepared",             this.OnEvent_wellPrepared,      this);
        //收到其他玩家播放语音
        app[app.subGameName + "_NetManager"]().RegNetPack("S" + app.subGameName.toUpperCase() + "_Voice",    this.OnPack_SPlayer_Voice,      this);
        //下载完成
        app[app.subGameName + "Client"].RegEvent("AMRFILEDOWNLOADFINISH",    this.OnEvt_AmrFileDownLoadFinish, this);
        //录音完成
        app[app.subGameName + "Client"].RegEvent("RECORDAUDIOFINSH",         this.OnEvt_RecordAudioFinsh,    this);
    },

    //销毁
    OnDestory:function(){
        this.setHeadInfo(false);
        this.audioFileName = "";
        this.recordFileName = "";

        this.recordPos = null;
        this.isRecording = false;

        this.audioList = [];
        this.stopRecord();
        this.stopPlayAudio();
    },

    //开关背景音乐
    setSound:function(flag){
        let value = app.LocalDataManager().GetConfigProperty("SysSetting","BackMusic");
        if(value){
            if(flag){
                app[app.subGameName+"_SceneManager"]().RecoverySceneMusic();
            }else{
	            app[app.subGameName+"_SoundManager"]().PauseAllSound();
            }
        }
    },


    //设置是否显示语音
    setHeadInfo:function(flag, pos ){
        app[app.subGameName + "Client"].OnEvent('Head_AudioNtf',{'bShow':flag,'pos':pos});
        if(flag){
            // let that = this;
            // // cc.director.getScene().getChildByName("Canvas").scheduleOnce(OnTimer, 100.0); 
            // setTimeout(function(){
            //     app[app.subGameName + "Client"].OnEvent('Head_AudioNtf',{'bShow':false,'pos':pos});
            // },100.0);
        }
    },

    //判断是否还有语音播放
    checkAudioList:function(){
        this.setHeadInfo(false);
        
        if(this.audioList.length > 0){
            let audioInfo = this.audioList.shift();
            this.playAudioOrDownLoad(audioInfo);
        }else{
            this.setSound(true);

            // this.setHeadInfo(false);
        }
    },

    //设置是否是touchEnd
    setTouchEnd:function(flag){
        this.isVoiceTouchEnd = flag;
    },

    //开始录音
    startRecord:function(){
        let IsAudio = app.LocalDataManager().GetConfigProperty("SysSetting", "IsAudio");
        if(!IsAudio){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_DONOT_AUDIO');
            return;
        }
        if(this.isRecording){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_LAST_RECORDING');
            return;
        }
        this.isRecording = true;
        
        var that = this;
        // cc.director.getScene().getChildByName("Canvas").scheduleOnce(OnTimer, 20.0); 

        setTimeout(function(){
            that.isRecording = false;
        },20.0);
        
        this.isVoiceTouchEnd = false;

        this.setSound(false);
        this.pausePlayAudio();

        this.audioFileName = this.getFileName();

        let argList = [{"Name":"fileName","Value":this.audioFileName}];
        let value = app[app.subGameName + "_NativeManager"]().CallToNative("startRecord", argList);
    },

    //停止录音
    stopRecord:function(){
        app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAudio");
        let value = app[app.subGameName + "_NativeManager"]().CallToNative("stopRecord", []);
    },

    //发送文件到服务器
    sendRecordFile:function(){

        if(this.audioFileName == null || this.audioFileName == "") return;
        
        if(!cc.sys.isNative) return;

        var data = jsb.fileUtils.getDataFromFile(this.audioFileName);

        var url = "http://voice.qp355.com:8080";
        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = null;
        try {
                httpRequest =  new ActiveXObject ("Microsoft.XMLHTTP");
        }catch(e){
            try {
                httpRequest = new XMLHttpRequest();
            }catch(e) {
                
            }
        }
        httpRequest.open("POST", url, true);
        httpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
        httpRequest.setRequestHeader('Content-Type', 'application/octet-stream');
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.setRequestHeader("Content-Type", "multipart/form-data;");


        var that = this;
        httpRequest.onerror = function(){
            that.ErrLog("sendRecordFile httpRequest.error:%s", url);
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_SEND_FAIL');
        };
        
        httpRequest.onreadystatechange = function(){
            that.SysLog("onreadystatechange httpRequest.status:%s, httpRequest.responseText:%s",httpRequest.status, httpRequest.responseText);
            //执行成功
            if (httpRequest.status == 200){
                
                var receivePack = JSON.parse(httpRequest.responseText);
                that.SysLog("sendRecordFile receivePack[status]:%s,receivePack[url]:%s", receivePack["status"],receivePack["url"]);
                if(receivePack["status"] == 1){
                    that.sendAudioURLToServer(receivePack["url"]);
                }else{
                    that.SysLog("sendRecordFile receivePack[status]=2 msg:%s", receivePack["msg"]);
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_SEND_FAIL');
                }
            }
            else{
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_SEND_FAIL');
                that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(data);
    },

    //下载文件
    downLoadRecordFile:function(serverURL, LocalURL){
        let downLoadMgr = app[app.subGameName + "_DownLoadMgr"]();
        downLoadMgr.DownFile(serverURL, LocalURL, "deleteString", "AMRFILEDOWNLOADFINISH");
    },

    //---------------发包接口------------------------
    //将URL上传到服务器
    sendAudioURLToServer:function(urls){
        let RoomMgr =app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room =  RoomMgr.GetEnterRoom();
        let roomID = room.GetRoomProperty("roomID");

        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Voice", {"roomID":roomID,  "url":urls});

        this.isRecording = false;

    },

    //----------------封包借口
    //收到回话
    OnPack_SPlayer_Voice:function(serverPack){
        let IsAudio = app.LocalDataManager().GetConfigProperty("SysSetting", "IsAudio");
        if(!IsAudio){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_DONOT_AUDIO');
            return;
        }

        let urls    = serverPack["url"];

        let RoomMgr =app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room = RoomMgr.GetEnterRoom();

        //不是自己房间
        if(RoomMgr.GetEnterRoomID() != serverPack["roomID"]){
            console.log("当前语音不是这个房间的id ---- " + RoomMgr.GetEnterRoomID() + " === " + serverPack["roomID"]);
            return;
        }

        this.audioList.push({"pos":serverPack["pos"], "url":serverPack["url"], "fileName": this.audioFileName});
        if(this.audioFileName != "" && room.GetRoomPosMgr().GetClientPos() != serverPack["pos"]){ //正在录音
            console.log("语音播放有误 ---- " + this.audioFileName);
            return;
        }
        //录音完成
        else if(this.audioFileName != "" && room.GetRoomPosMgr().GetClientPos() == serverPack["pos"]){
            if(this.recordFileName != ""){
                this.resumePlayAudio();
            }else{
                this.checkAudioList();
            }

        }else if( this.recordFileName != ""){ //上一个播放没有完成
            //this.resumePlayAudio();
            return;
        }
        //没有录音
        else{
            this.checkAudioList();
        }
        this.audioFileName = "";
    },

    ///-------------------------

    //下载或播放语音
    playAudioOrDownLoad:function(audioInfo){
        let IsAudio = app.LocalDataManager().GetConfigProperty("SysSetting", "IsAudio");
        if(!IsAudio){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_DONOT_AUDIO');
            return;
        }
       
        //自己直接播放
        let RoomMgr =app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room = RoomMgr.GetEnterRoom();
        
        if(room.GetRoomPosMgr().GetClientPos() == audioInfo["pos"]){
            if(this.recordFileName == ""){
                this.recordFileName = audioInfo["fileName"];
                this.recordPos =  audioInfo["pos"];
                this.playAudio(this.recordFileName, audioInfo["pos"]);
            }else{
                this.resumePlayAudio();
            }
        }else{
            this.recordFileName = this.getFileName();
            this.recordPos =  audioInfo["pos"];
            this.downLoadRecordFile(audioInfo["url"], this.recordFileName);
        }
    },

    //播放语音
    playAudio:function(filename, pos){
        if(filename == ""){
            return ;
        }
        
        this.setHeadInfo(false);

        this.setSound(false);

        let argList = [{"Name":"fileName","Value":filename}];
        let value = app[app.subGameName + "_NativeManager"]().CallToNative("playerRecord", argList);
       
        this.setHeadInfo(true, pos);
    },

    //停止语音
    stopPlayAudio:function(){
        this.setHeadInfo(false);
        let value = app[app.subGameName + "_NativeManager"]().CallToNative("stopPlayerRecord", []);
    },

    //暂停播放
    pausePlayAudio:function(){
        if(this.recordFileName == ""){
            return;
        }
        
        app[app.subGameName + "_NativeManager"]().CallToNative("pausePlayerRecord", []);
    },
    
    //继续播放
    resumePlayAudio:function(){
        app[app.subGameName + "_NativeManager"]().CallToNative("resumePlayerRecord", []);
    },


    ///------------------------------事件-----------------------
    //语音播放完成
    OnEvent_PlayAudioFinish:function(event){
        app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAudio");

        this.recordFileName = "";

        this.setHeadInfo(false);

        this.recordPos = null;

        this.checkAudioList();
    },
    //录制语音失败
    OnEvent_AudioError:function(event){

        app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_ERROR');

        this.stopRecord();
        
        this.audioFileName = "";
        this.isRecording = false;

        app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAudio");
        this.checkAudioList();
    },
    //录制停止语音失败
    OnEvent_AudioStopError:function(event){

        app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_AUDIO_STOP_ERROR');

        this.audioFileName = "";
        this.isRecording = false;

        app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAudio");
        this.checkAudioList();
    },
    //播放语音失败
    OnEvent_MedioRecordError:function(event){
        this.setHeadInfo(false);
        
        app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_PLAY_RECORD_ERROR');

        this.recordFileName = "";
        this.recordPos = null;
        this.checkAudioList();
    },
    //准备录制
    OnEvent_wellPrepared:function(event){
        if(this.isVoiceTouchEnd){ 
            this.audioFileName = "";
            this.isRecording = false;
    
            app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAudio");
            this.checkAudioList();
            return;
        }
        this.setSound(false);
        app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAudio");
    },

    //文件下载完成
    OnEvt_AmrFileDownLoadFinish:function(event){
        this.playAudio(this.recordFileName, this.recordPos);
    },

    //录音完成
    OnEvt_RecordAudioFinsh:function(event){
        this.sendRecordFile();  
    },

    //获取文件名
    getFileName:function(){
        var timestamp = (new Date()).valueOf();
        let storagePath = '/';
        if(cc.sys.isNative){
            storagePath = jsb ? (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + app.subGameName : '/';
        }
        let AccountID = app[app.subGameName+"_HeroAccountManager"]().GetAccountProperty("AccountID");
        let fileName = storagePath + AccountID + timestamp + Math.random()%16 + ".amr";
        return fileName;
    },
});


var g_qzmj_AudioManager = null;
  /**
  ...
  */
exports.GetModel = function(){
    if(!g_qzmj_AudioManager){
        g_qzmj_AudioManager = new qzmj_AudioManager();
    }
    return g_qzmj_AudioManager;
}