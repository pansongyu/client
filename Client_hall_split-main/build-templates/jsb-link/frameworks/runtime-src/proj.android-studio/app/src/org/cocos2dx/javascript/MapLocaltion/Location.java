package org.cocos2dx.javascript.MapLocaltion;

import android.Manifest;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.PermissionChecker;
import android.util.Log;
import android.widget.Toast;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;
import com.amap.api.location.AMapLocationClientOption.AMapLocationProtocol;
import com.amap.api.location.AMapLocationListener;
//import com.amap.api.maps.AMapUtils;
//import com.amap.api.maps.model.LatLng;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * 高精度定位模式功能演示
 *
 */
public class Location implements
		ActivityCompat.OnRequestPermissionsResultCallback {
	private  AMapLocationClient locationClient = null;
	private  AMapLocationClientOption locationOption = null;
	private  AMapLocationListener locationListener = null;
	private  static  Location  instance;
	private  int getLocationThredCount = 0;//定时任务次数
	private  static  int MAXGETLOCATIONTHREDCOUNT = 3;//最大次数
	/**
	 * 判断是否需要检测，防止不停的弹框
	 */
	public boolean isNeedCheck = true;
	/**
	 * 需要进行检测的权限数组
	 */
	protected String[] needPermissions = {
			Manifest.permission.ACCESS_COARSE_LOCATION,
			Manifest.permission.ACCESS_FINE_LOCATION,
			Manifest.permission.WRITE_EXTERNAL_STORAGE,
			Manifest.permission.READ_EXTERNAL_STORAGE,
			Manifest.permission.READ_PHONE_STATE,
			Manifest.permission.RECORD_AUDIO,
			Manifest.permission.MODIFY_AUDIO_SETTINGS
	};



	public static Location getInstance(){
		if (instance == null){
			synchronized (Location.class){
				if (instance == null){
					instance = new Location();
					instance.init();
				}
			}
		}
		return instance;
	}

	public void init(){
		checkPermissions(needPermissions);

		initLocation();
	}


	public void onDestroy() {
		stopLocation();
		destroyLocation();
	}

	/**
	 * 初始化定位
	 * 
	 * @since 2.8.0
	 * @author hongming.wang
	 *
	 */
	public  void initLocation(){
		//初始化client
		try {
			locationClient = new AMapLocationClient(AppActivity.getInstance().getApplicationContext());
		}catch (Exception e){

		}

		locationOption = getDefaultOption();
		//设置定位参数
		locationClient.setLocationOption(locationOption);
		// 设置定位监听
		initLocationListener();
		locationClient.setLocationListener(locationListener);
	}
	
	/**
	 * 默认的定位参数
	 * @since 2.8.0
	 * @author hongming.wang
	 *
	 */
	private  AMapLocationClientOption getDefaultOption(){
		AMapLocationClientOption mOption = new AMapLocationClientOption();
		mOption.setLocationMode(AMapLocationMode.Battery_Saving);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
		mOption.setGpsFirst(true);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
		mOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
		mOption.setInterval(5000);//可选，设置定位间隔。默认为2秒
		mOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
		mOption.setOnceLocation(true);//可选，设置是否单次定位。默认是false
		mOption.setOnceLocationLatest(false);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
		AMapLocationClientOption.setLocationProtocol(AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
		mOption.setSensorEnable(true);//可选，设置是否使用传感器。默认是false
		mOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
		mOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
//		mOption.setLocationMode(AMapLocationMode.Hight_Accuracy);//设置精度

		mOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）

		return mOption;
	}
	
	/**
	 * 定位监听
	 */
	public  void initLocationListener(){
		locationListener = new AMapLocationListener() {
			@Override
			public void onLocationChanged(AMapLocation location) {
				if (null != location) {
					Log.e("Location", "onLocationChanged: "+"errorcode = " +location.getErrorCode());
					StringBuffer sb = new StringBuffer();
					//errCode等于0代表定位成功，其他的为定位失败，具体的可以参照官网定位错误码说明
					if(location.getErrorCode() == 0){

						if (location.getAddress().equals("")){
//							if (MAXGETLOCATIONTHREDCOUNT <= getLocationThredCount){
//								clearGetLocationThredCount();
//								return;
//							}
//
//							Timer timer = new Timer();
//							timer.schedule(new TimerTask() {
//								@Override
//								public void run() {
//									Log.e("Location", "timeTask");
//									getLocationThredCount++;
//									startLocation();
//								}
//							}, 1000*5);

//							Thread myThread = new Thread(new Runnable() {
//								@Override
//								public void run() {
//									Log.e("Location", "timeTask");
//									try {
//										Thread.sleep(1000*5);
//									} catch (InterruptedException e) {
//										e.printStackTrace();
//									}
//									getLocationThredCount++;
//									startLocation();
//								}
//							});
//
//							myThread.start();
							try {
								JSONObject mJsonobjData = new JSONObject();
								mJsonobjData.put("state", Contants.GetLocation_Error);
								mJsonobjData.put("error", sb.toString());
								mJsonobjData.put("mapType", "gaodeMap");
								NativeMgr.OnCallBackToJs("GETLOCATION", mJsonobjData);
							} catch (JSONException e) {
								e.printStackTrace();
							}

							return;
						}

						try {
							JSONObject mJsonobjData = new JSONObject();
							mJsonobjData.put("state", Contants.GetLocation_Success);
							mJsonobjData.put("Latitude",  location.getLatitude());
							mJsonobjData.put("Longitude",  location.getLongitude());
							mJsonobjData.put("Address",location.getAddress());//地址，如果option中设置isNeedAddress为false，则没有此结果，网络定位结果中会有地址信息，GPS定位不返回地址信息。
							mJsonobjData.put("Country",location.getCountry());//国家信息
							mJsonobjData.put("Province",location.getProvince());//省信息
							mJsonobjData.put("City",location.getCity());//城市信息
							mJsonobjData.put("District",location.getDistrict());//城区信息
							mJsonobjData.put("Street", location.getStreet());//街道信息
							mJsonobjData.put("StreetNum", location.getStreetNum());//街道门牌号信息
							mJsonobjData.put("CityCode", location.getCityCode());//城市编码
							mJsonobjData.put("AdCode", location.getAdCode());//地区编码
							mJsonobjData.put("AoiName", location.getAoiName());//获取当前定位点的AOI信息
							mJsonobjData.put("BuildingId", location.getBuildingId());//获取当前室内定位的建筑物Id
							mJsonobjData.put("Floor", location.getFloor());//获取当前室内定位的楼层
							mJsonobjData.put("GpsAccuracyStatus", location.getGpsAccuracyStatus());//获取GPS的当前状态
							mJsonobjData.put("mapType", "gaodeMap");
							mJsonobjData.put("locationWhere", 1);
							org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("GETLOCATION", mJsonobjData);
							clearGetLocationThredCount();
						} catch (JSONException e) {
							e.printStackTrace();
						}

//						stopLocation();

					} else {

						try {
							JSONObject mJsonobjData = new JSONObject();
							mJsonobjData.put("state", Contants.GetLocation_Error);
							mJsonobjData.put("error", sb.toString());
							mJsonobjData.put("mapType", "gaodeMap");
							NativeMgr.OnCallBackToJs("GETLOCATION", mJsonobjData);
						} catch (JSONException e) {
							e.printStackTrace();
						}
//						stopLocation();
					}
				} else {
					try {
						JSONObject mJsonobjData = new JSONObject();
						mJsonobjData.put("state", Contants.GetLocation_Error);
						mJsonobjData.put("error", "定位失败，loc is null");
						mJsonobjData.put("mapType", "gaodeMap");
						org.cocos2dx.javascript.NativeMgr.OnCallBackToJs("GETLOCATION", mJsonobjData);
					} catch (JSONException e) {
						e.printStackTrace();
					}
//					stopLocation();
				}
			}
		};
	}

	/**
	 * 开始定位
	 * 
	 * @since 2.8.0
	 * @author hongming.wang
	 *
	 */
	public  void startLocation(){
		//根据控件的选择，重新设置定位参数
		//resetOption();

		if(isNeedCheck){
			checkPermissions(needPermissions);
		}

		// 设置定位参数
		locationClient.setLocationOption(locationOption);
		// 启动定位
		locationClient.startLocation();
	}
	
	/**
	 * 停止定位
	 * 
	 * @since 2.8.0
	 * @author hongming.wang
	 *
	 */
	private  void stopLocation(){
		// 停止定位
		locationClient.stopLocation();
	}


	/**
	 * 销毁定位
	 * 
	 * @since 2.8.0
	 * @author hongming.wang
	 *
	 */
	private void destroyLocation(){
		if (null != locationClient) {
			/**
			 * 如果AMapLocationClient是在当前Activity实例化的，
			 * 在Activity的onDestroy中一定要执行AMapLocationClient的onDestroy
			 */
			locationClient.onDestroy();
			locationClient = null;
			locationOption = null;
		}
	}
	/*
	* //根据经纬度获取距离
	* */
	public    float getDistance(double  startlatitude, double startlongitude, double endlatitude, double endlongitude){
		Log.e("getDistance","startlatitude="+startlatitude+",startlongitude="+startlongitude+",endlatitude="+endlatitude+",endlongitude="+endlongitude);
//		LatLng startLatlng = new LatLng(startlatitude, startlongitude);
//		LatLng endLatlng = new LatLng(endlatitude, endlongitude);
//		float distance = AMapUtils.calculateLineDistance(startLatlng, endLatlng);
		double distance1 = gps2m(startlatitude, startlongitude, endlatitude, endlongitude);
		Log.e("getDistance", "distance="+distance1);
		return   (float) distance1;
	}

	private final double EARTH_RADIUS = 6378137.0;
	private double gps2m(double lat_a, double lng_a, double lat_b, double lng_b) {
		double radLat1 = (lat_a * Math.PI / 180.0);
		double radLat2 = (lat_b * Math.PI / 180.0);
		double a = radLat1 - radLat2;
		double b = (lng_a - lng_b) * Math.PI / 180.0;
		double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
				+ Math.cos(radLat1) * Math.cos(radLat2)
				* Math.pow(Math.sin(b / 2), 2)));
		s = s * EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		return s;
	}

	@Override
	public void onRequestPermissionsResult(int requestCode,  String[] permissions,  int[] grantResults) {
		Log.e("RequestPermissions", "123456");
		Toast.makeText(AppActivity.getInstance().getContext(), "onRequestPermissionsResult ", Toast.LENGTH_LONG).show();
		if (requestCode == AppActivity.MY_PERMISSIONS_REQUEST_REQUESTCODE) {
			if (!verifyPermissions(grantResults)) {
				showMissingPermissionDialog();
				isNeedCheck = false;
			}
		}
	}

	/**
	 *
	 * @param  need RequestPermissonList
	 * @since 2.5.0
	 *
	 */
	private void checkPermissions(String... permissions) {
		Log.e("checkPermissions","0000000");
		List<String> needRequestPermissonList = findDeniedPermissions(permissions);
		if (null != needRequestPermissonList
				&& needRequestPermissonList.size() > 0) {
			ActivityCompat.requestPermissions(AppActivity.getInstance(),
					needRequestPermissonList.toArray(
							new String[needRequestPermissonList.size()]),
					AppActivity.MY_PERMISSIONS_REQUEST_REQUESTCODE);
			Log.e("checkPermissions","1111111");
		}
	}

	/**
	 * 获取权限集中需要申请权限的列表
	 *
	 * @param permissions
	 * @return
	 * @since 2.5.0
	 *
	 */
	private List<String> findDeniedPermissions(String[] permissions) {
		List<String> needRequestPermissonList = new ArrayList<String>();
		for (String perm : permissions) {
			Log.e("findDeniedPermissions",",checkSelfPermission="+ContextCompat.checkSelfPermission(AppActivity.getInstance(),	perm) + ",PermissionChecker="+ PermissionChecker.checkSelfPermission(AppActivity.getInstance(),	perm));
			if (ContextCompat.checkSelfPermission(AppActivity.getInstance(),
					perm) != PackageManager.PERMISSION_GRANTED
					/*|| ActivityCompat.shouldShowRequestPermissionRationale(
					AppActivity.getInstance(), perm)*/) {
				needRequestPermissonList.add(perm);
			}else{
				Log.e("findDeniedPermissions","perm="+perm);
			}
		}
		return needRequestPermissonList;
	}

	/**
	 * 检测是否说有的权限都已经授权
	 * @param grantResults
	 * @return
	 * @since 2.5.0
	 *
	 */
	private boolean verifyPermissions(int[] grantResults) {
		for (int result : grantResults) {
			if (result != PackageManager.PERMISSION_GRANTED) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 显示提示信息
	 *
	 * @since 2.5.0
	 *
	 */
	private void showMissingPermissionDialog() {
		Toast.makeText(AppActivity.getInstance().getContext(), "showMissingPermissionDialog ", Toast.LENGTH_LONG).show();
		Log.e("showMissingPermission", "123456");
	}

	/**
	 * 清楚次数
	 * */
	public  void clearGetLocationThredCount(){
		getLocationThredCount = 0;
	}
}
