package com.yangfan.qihang.gvapi;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import com.tencent.gcloud.voice.GCloudVoiceErrorCode;
import com.tencent.gcloud.voice.IGCloudVoiceNotify;

/**
 * Created by Lilac on 2018/8/28
 *
 * <p>
 * GCloudVoice 接口回调实现类，建议将 GCloudVoice 的初始化工作和回调实现交由一个全局管理类统一管理
 * <p>
 * GCloudVoice SDK 的说明请参考线上文档：
 * http://gcloud.qq.com/document/5923b83582fb561c1b3024b5
 * <p>
 * GCloudVoice SDK 官方网站：
 * http://gcloud.qq.com/product/6
 */

public class GvoiceNotify implements IGCloudVoiceNotify {

    private Context mCtx;                           // 显示回调结果
    private static String mFileID;                  // 上传音频文件成功时服务端返回的文件唯一性标识符
    private static boolean uploadSuccess = false;  // 音频文件上传成功与否的标志
    private Handler mHandler;
    private volatile static GvoiceNotify gvoiceNotify = null;

    /**
     * 传递消息用的标志位
     */
    public static final int MSG_JOINROOM = 1000;
    public static final int MSG_QUITROOM = 1001;
    public static final int MSG_ROLECHANGED = 1002;
    public static final int MSG_UPLOADFILE = 1003;
    public static final int MSG_DOWNLOADFILE = 1004;
    public static final int MSG_PLAYRECODEFILE = 1005;
    public static final int MSG_APPLYKEY = 1006;
    public static final int MSG_STT = 1007;
    public static final int MSG_RSTT = 1008;
    public static final String KEY_STT = "stt";
    public static final String KEY_RSTT = "rstt";
    public static final String KEY_FILEID = "fileId";

    public GvoiceNotify() {
        super();
    }

    public GvoiceNotify(Context ctx) {
        super();
        mCtx = ctx;
    }

    public GvoiceNotify(Context ctx, Handler handler) {
        super();
        mCtx = ctx;
        mHandler = handler;
    }

    // 单例
    public static GvoiceNotify getInstance(Context ctx, Handler handler) {
        if (gvoiceNotify == null) {
            synchronized (GvoiceManager.class) {
                if (gvoiceNotify == null) {
                    gvoiceNotify = new GvoiceNotify(ctx, handler);
                }
            }
        }
        return gvoiceNotify;
    }



    /**
     * 加入房间时回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param roomName:加入的房间名
     * @param memberID:如果加入成功的话，表示加入后的成员ID
     */
    @Override
    public void OnJoinRoom(int completeCode, String roomName, int memberID) {
        String msg;

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_JOINROOM_SUCC) {
            msg = "OnJoinRoom 成功" +
                    "Room name: " + roomName + "\t" +
                    "Member ID: " + memberID + "\t";

            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_JOINROOM;
                message.arg1 = completeCode;
                message.obj = "{\"roomName\":"+roomName+",\"memberID\":"+memberID+"}";
                mHandler.sendMessage(message);
            }
        } else {
            msg = "OnJoinRoom 遇到问题\t" +
                    "Code: " + completeCode + "\t" +
                    "Room name: " + roomName + "\t";
        }
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 进房断网3min后会被踢出当前房间
     *
     * @param completeCode：参见IGCloudVoiceNotify.GCloudVoiceCompleteCode定义
     * @param roomName:加入的房间名
     * @param memberID:如果加入成功的话，表示加入后的成员ID
     */
    @Override
    public void OnStatusUpdate(int completeCode, String roomName, int memberID) {
        String msg = "OnStatusUpdate: \t" +
                "Code: " + completeCode + "\t" +
                "Room name: " + roomName + "\t" +
                "Member ID: " + memberID + "\t";
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 退出房间时回调
     *
     * @param completeCode:参见 IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param roomName:退出的房间名
     */
    @Override
    public void OnQuitRoom(int completeCode, String roomName) {
        String msg;

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_QUITROOM_SUCC) {
            msg = "OnQuitRoom 成功\t" +
                    "Code: " + completeCode + "\t" +
                    "Room name: " + roomName + "\t";

            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_QUITROOM;
                message.arg1 = completeCode;
                message.obj = "{\"roomName\":"+roomName+"}";
                mHandler.sendMessage(message);
            }
        }else {
            msg = "OnQuitRoom 遇到问题\t" +
                    "Code: " + completeCode + "\t" +
                    "Room name: " + roomName + "\t";
        }
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 当房间中的其他成员开始说话或者停止说话的时候，通过该回调进行通知
     *
     * @param members:状态发生改变的  members
     *                         值为 [memberID status] 对，共有 count 对
     *                         status 取值："0"：停止说话 "1"：开始说话 "2"：继续说话
     * @param count:状态发生改变的成员数
     */
    @Override
    public void OnMemberVoice(int[] members, int count) {
        String msg = "OnMemberVoice: \t" +
                "Count: " + count + "\t";
        for (int i = 0; i < members.length - 1; i += 2) {
            msg = msg + "Status of member " + i + " is: " + (i + 1) + "\t";
        }
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 当开启了多路房间，且当前用户所在的房间内有成员的说话状态发生变化时，通过该回调进行通知
     *
     * @param roomName：有成员的说话状态发生变化的房间名
     * @param memberId：状态发生改变的成员ID
     * @param status：状态发生改变的成员当前的状态，状态取值："0"：停止说话 "1"：开始说话 "2"：继续说话
     */
    @Override
    public void OnMemberVoice(String roomName, int memberId, int status) {
        String msg = "OnMemberVoice in multi room: \t" +
                "Room name: " + roomName + "\t" +
                "MemberId: " + memberId + "\t" +
                "Status: " + status + "\t";
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 上传语音文件后的结果通过该函数进行回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:上传的文件路径
     * @param fileID:文件的ID                                              注意！该 ID 是音频文件的唯一标识符，下载音频文件时需要提供该标识符
     */
    @Override
    public void OnUploadFile(int completeCode, String filePath, String fileID) {
        String msg;
        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_UPLOAD_RECORD_DONE) {
            uploadSuccess = true;
            mFileID = fileID;
            msg = "UploadFile 成功\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";

            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_UPLOADFILE;
                message.arg1 = completeCode;
                Bundle fileidResult = new Bundle();
                fileidResult.putString(KEY_FILEID, fileID);
                message.setData(fileidResult);
                mHandler.sendMessage(message);
            }
        } else {
            msg = "UploadFile 遇到错误\t" +
                    "Code: " + completeCode + "\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";
        }
        Utils.logI(msg);
    }

    /**
     * 下载语音文件后的结果通过该函数进行回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:上传的文件路径
     * @param fileID:需要下载的文件的ID，该ID在OnUploadFile回调中提供
     */
    @Override
    public void OnDownloadFile(int completeCode, String filePath, String fileID) {

        String msg;
        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_DOWNLOAD_RECORD_DONE) {
            msg = "DownloadFile 成功\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";

            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_DOWNLOADFILE;
                message.arg1 = completeCode;
                mHandler.sendMessage(message);
            }
        } else {
            msg = "DownloadFile 失败\t" +
                    "Code: " + completeCode + "\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";
        }
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 如果用户没有暂停播放，而语音文件已经播放完了，通过该回调函数进行通知
     *
     * @param completeCode:参见  IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:播放的文件路径
     */
    @Override
    public void OnPlayRecordedFile(int completeCode, String filePath) {
        String msg = "OnPlayRecordedFile: \t" +
                "Code: " + completeCode + "\t" +
                "File path: " + filePath + "\t";
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_PLAYFILE_DONE) {
            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_PLAYRECODEFILE;
                message.arg1 = completeCode;
                mHandler.sendMessage(message);
            }
        }
    }

    /**
     * 请求语音消息许可的时候会回调
     *
     * @param completeCode:参见 IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     */
    @Override
    public void OnApplyMessageKey(int completeCode) {
        String msg;

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_MESSAGE_KEY_APPLIED_SUCC) {
            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_APPLYKEY;
                message.arg1 = completeCode;
                mHandler.sendMessage(message);
            }
            msg = "OnApplyMessageKey 成功";
        } else {
            msg = "OnApplyMessageKey 遇到错误\t"
                    + "Code: " + completeCode + "\t";
        }
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 语音转文字的结果通过该函数回调进行通知
     *
     * @param completeCode:参见                          IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param fileID:翻译文件的fileID，该ID在OnUploadFile回调中提供
     * @param result:翻译的文字结果
     */
    @Override
    public void OnSpeechToText(int completeCode, String fileID, String result) {
        String msg;


        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_STT_SUCC) {
            msg = "OnSpeechToText 成功\t" +
                    "Result: " + result + "\t";
            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_STT;
                message.arg1 = completeCode;
                Bundle sttResult = new Bundle();
                sttResult.putString(KEY_STT, result);
                message.setData(sttResult);
                mHandler.sendMessage(message);
            }
        } else {
            msg = "OnSpeechToText 遇到错误\t" +
                    "Code: " + completeCode + "\t" +
                    "FileID: " + fileID + "\n";
        }
        Utils.logI(msg);
    }

    /**
     * TODO 内部接口，无需关心
     *
     * @param pAudioData:录音缓冲文件
     * @param nDataLength：已录音的文件长度
     */
    @Override
    public void OnRecording(char[] pAudioData, int nDataLength) {
        String msg = "OnRecording\t";
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);
    }

    /**
     * 在语音转文字模式下，停止录音后就会实时进行语音转文字，语音转文字的结果通过该接口进行通知
     * <p>
     * 当实时语音转文字失败时，可考虑采用离线语音转文字接口重新尝试
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param errCode:服务器错误码，无需关注
     * @param result:语音转文字结果
     * @param voicePath:音频文件路径，即开始录音时传入的录音文件保存地址
     */
    @Override
    public void OnStreamSpeechToText(int completeCode, int errCode, String result, String voicePath) {
        String msg;

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_RSTT_SUCC) {
            msg = "OnStreamSpeechToText 成功\t" +
                    "Result: " + result + "\t";

            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_RSTT;
                message.arg1 = completeCode;
                Bundle rsttResult = new Bundle();
                rsttResult.putString(KEY_RSTT, result);
                message.setData(rsttResult);
                mHandler.sendMessage(message);
            }
        } else {
            msg = "OnStreamSpeechToText 遇到错误\t" +
                    "Code: " + completeCode + "\t" +
                    "ErrCode: " + errCode + "\t" +
                    "VoicePath: " + voicePath + "\t";
        }
        Utils.logI(msg);
    }

    @Override
    public void OnSpeechTranslate(int i, String s, String s1, String s2, int i1) {
        String msg = "OnSpeechTranslate 未实现任何方法，估计是新增接口，未知\t";
        Utils.logI(msg);
    }

    /**
     * 在国战语音房间，角色发生改变时通过该回调进行通知，一般是在调用ChangeRole方法后进行回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param roomName：房间名
     * @param memberId：角色变化的成员ID
     * @param role：当前角色：1：主播；2：观众
     */
    @Override
    public void OnRoleChanged(int completeCode, String roomName, int memberId, int role) {
        String msg = "OnRoleChanged: \t" +
                "Code: " + completeCode + "\t" +
                "RoomName: " + roomName + "\t" +
                "MemberId: " + memberId + "\t" +
                "Role: " + role + "\t";
        Utils.logI(msg);
//        Utils.showShortMsg(mCtx, msg);

        if (completeCode == GCloudVoiceErrorCode.GCloudVoiceCompleteCode.GV_ON_ROLE_SUCC) {
            if (mHandler != null) {
                Message message = mHandler.obtainMessage();
                message.what = MSG_ROLECHANGED;
                message.arg1 = completeCode;
                message.arg2 = role;
                mHandler.sendMessage(message);
            }
        }
    }

    /**
     * 当发生了定义在GCloudVoiceEvent类中的事件时，通过该回调进行通知
     *
     * @param eventId:定义在GCloudVoiceEvent类中的事件ID
     * @param eventInfo:事件描述信息
     */
    @Override
    public void OnEvent(int eventId, String eventInfo) {
        String msg = "OnEvent: \t" +
                "EventId: " + eventId + "\t" +
                "EventInfo: " + eventInfo + "\t";
        Utils.logI(msg);
    }

    /**
     * 获取上传文件成功时从服务端得到的 fileID
     * 注意！该 ID 是音频文件的唯一标识符，下载音频文件时需要提供该标识符
     *
     * @return the fileID
     */
    public String getFileID() {
        if (uploadSuccess) {
            return mFileID;
        } else {
            return "";
        }
    }
}
