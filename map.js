/*
 * 天地图展示组件
 * MIT License
 * Copyright (c) 2025 guo@yuesh.com
 */
console.log( '%c调用方式：%cshowMap( {zuobiao, item, zoom, sContent, isShow, type, key} )', 'color: #2196F3; font-size: 16px; font-weight: bold;', 'color: #333; font-size: 14px;' );
console.log( '%c参数说明：', 'color: #4CAF50; font-size: 15px; font-weight: bold;' );
console.log( '%czuobiao：%c坐标 (如：116.372830,39.863320)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%citem：%c地图容器ID (如：allmap)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%czoom：%c缩放级别 (如：16)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%csContent：%c文字内容 (如：<div style="padding:10px;">某某某公司<br>地址：浙江省杭州市xx区xx街道xx号</div>)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%cisShow：%c是否显示文字 (0 不显示, 默认1显示)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%ctype：%c坐标类型 (默认空, 百度坐标系, 可选值：tianditu, 天地图坐标系)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%ckey：%c天地图API密钥 (如：1234567890)', 'color: #FF5722; font-size: 14px;', 'color: #666;' );
console.log( '%c使用百度坐标系时，会自动转换为天地图坐标系，精度会降低', 'color: #4CAF50; font-size: 14px;' );

function showMap( config ) {
  // 参数验证
  if ( !config || typeof config !== 'object' ) {
    console.error( '配置参数必须是一个对象' );
    return;
  }

  let {
    zuobiao,
    item,
    zoom = 16,
    sContent = '',
    isShow = 1,
    type = '',
    key = ''
  } = config;

  // 必要参数检查
  if ( !zuobiao ) {
    console.error( '坐标(zuobiao)是必需的参数' );
    return;
  }

  if ( !item ) {
    console.error( '地图容器ID(item)是必需的参数' );
    return;
  }

  // 参数类型验证
  if ( typeof zuobiao !== 'string' ) {
    console.error( '坐标(zuobiao)必须是字符串类型' );
    return;
  }

  if ( typeof item !== 'string' ) {
    console.error( '地图容器ID(item)必须是字符串类型' );
    return;
  }

  if ( typeof zoom !== 'number' || zoom < 1 || zoom > 18 ) {
    console.error( '缩放级别(zoom)必须是1-18之间的数字' );
    return;
  }

  if ( sContent && typeof sContent !== 'string' ) {
    console.error( '文字内容(sContent)必须是字符串类型' );
    return;
  }

  if ( typeof isShow !== 'number' || ( isShow !== 0 && isShow !== 1 ) ) {
    console.error( '是否显示文字(isShow)必须是0或1' );
    return;
  }

  if ( type && typeof type !== 'string' ) {
    console.error( '坐标类型(type)必须是字符串类型' );
    return;
  }

  if ( key && typeof key !== 'string' ) {
    console.error( '天地图API密钥(key)必须是字符串类型' );
    return;
  }

  if ( key ) {
    let script = document.createElement( 'script' );
    script.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=' + key;
    script.onload = function() {
      console.log( '✓ 天地图API加载成功！' );
      initMap( zuobiao, item, zoom, sContent, isShow, type );
    };
    script.onerror = function() {
      console.error( '✗ 天地图API加载失败！' );
    };
    document.head.appendChild( script );
  } else {
    initMap( zuobiao, item, zoom, sContent, isShow, type );
  }
}

// 定义初始化函数
function initMap( zuobiao, item, zoom, sContent, isShow = 1, type = '' ) {
  // 验证必要参数
  if ( !zuobiao || !item || !zoom ) {
    console.error( 'initMap: 缺少必要参数' );
    return;
  }

  // 解析坐标
  let arrlnglat = zuobiao.split( ',' );
  if ( arrlnglat.length !== 2 ) {
    console.error( '坐标格式不正确，应为 "经度,纬度" 的格式' );
    return;
  }

  let wgs = {
    lon: parseFloat( arrlnglat[ 0 ] ),
    lat: parseFloat( arrlnglat[ 1 ] )
  };

  // 验证坐标有效性
  if ( isNaN( wgs.lon ) || isNaN( wgs.lat ) ) {
    console.error( '坐标值无效，请提供有效的数字' );
    return;
  }

  // 根据坐标类型进行转换
  wgs = type == 'tianditu' ? wgs : baiduTomars( wgs );

  try {
    let center = new T.LngLat( wgs.lon, wgs.lat );
    let map = new T.Map( item );
    map.centerAndZoom( center, zoom );
    map.enableScrollWheelZoom();

    let control = new T.Control.Zoom();
    map.addControl( control );

    // 定义控制位置常量
    let leftTOP = T_ANCHOR_TOP_LEFT;
    let rightTOP = T_ANCHOR_TOP_RIGHT;
    let leftBOTTOM = T_ANCHOR_BOTTOM_LEFT;
    let rightBOTTOM = T_ANCHOR_BOTTOM_RIGHT;
    let controlPosition = T_ANCHOR_TOP_LEFT;
    control.setPosition( controlPosition );

    let marker = new T.Marker( center );
    map.addOverLay( marker );

    if ( sContent ) {
      let infoWin1 = new T.InfoWindow();
      infoWin1.setContent( sContent );
      if ( isShow ) {
        marker.openInfoWindow( infoWin1 );
      }

      marker.addEventListener( "click", function() {
        marker.openInfoWindow( infoWin1 );
      } );
    }
  } catch ( error ) {
    console.error( '初始化地图时发生错误:', error );
  }
}

/**
 * 百度坐标转火星坐标（BD09 to GCJ02）
 * @param {Object} baidu_point - 百度坐标点 {lon: 经度, lat: 纬度}
 * @returns {Object} 火星坐标点 {lon: 经度, lat: 纬度}
 */
function baiduTomars( baidu_point ) {
  // 检查输入参数
  if ( !baidu_point || typeof baidu_point !== 'object' ) {
    console.error( 'baidu_point 参数无效' );
    return { lon: 0, lat: 0 };
  }

  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = baidu_point.lon - 0.0065;
  let y = baidu_point.lat - 0.006;
  let z = Math.sqrt( x * x + y * y ) - 0.00002 * Math.sin( y * x_pi );
  let theta = Math.atan2( y, x ) - 0.000003 * Math.cos( x * x_pi );

  let mars_point = {
    lon: z * Math.cos( theta ),
    lat: z * Math.sin( theta )
  };

  // 转换为WGS84坐标系
  return transformGCJ2WGS( mars_point.lat, mars_point.lon );
}

/**
 * 火星坐标系GCJ02转地球坐标系WGS84
 * @param {number} gcjLat - 火星坐标纬度
 * @param {number} gcjLon - 火星坐标经度
 * @returns {Object} WGS84坐标 {lat: 纬度, lon: 经度}
 */
function transformGCJ2WGS( gcjLat, gcjLon ) {
  let d = delta( gcjLat, gcjLon );
  return {
    'lat': gcjLat - d.lat,
    'lon': gcjLon - d.lon
  };
}

/**
 * 计算GCJ02与WGS84坐标系偏差
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @returns {Object} 坐标偏差 {lat: 纬度偏差, lon: 经度偏差}
 */
function delta( lat, lon ) {
  let PI = 3.14159265358979324;
  let a = 6378245.0; // 卫星椭球坐标投影到平面地图坐标系的投影因子
  let ee = 0.00669342162296594323; // 椭球的偏心率

  let dLat = transformLat( lon - 105.0, lat - 35.0 );
  let dLon = transformLon( lon - 105.0, lat - 35.0 );

  let radLat = lat / 180.0 * PI;
  let magic = Math.sin( radLat );
  magic = 1 - ee * magic * magic;
  let sqrtMagic = Math.sqrt( magic );

  dLat = ( dLat * 180.0 ) / ( ( a * ( 1 - ee ) ) / ( magic * sqrtMagic ) * PI );
  dLon = ( dLon * 180.0 ) / ( a / sqrtMagic * Math.cos( radLat ) * PI );

  return {
    'lat': dLat,
    'lon': dLon
  };
}

/**
 * 转换纬度
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @returns {number} 转换后的纬度值
 */
function transformLat( x, y ) {
  let PI = 3.14159265358979324;
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt( Math.abs( x ) );
  ret += ( 20.0 * Math.sin( 6.0 * x * PI ) + 20.0 * Math.sin( 2.0 * x * PI ) ) * 2.0 / 3.0;
  ret += ( 20.0 * Math.sin( y * PI ) + 40.0 * Math.sin( y / 3.0 * PI ) ) * 2.0 / 3.0;
  ret += ( 160.0 * Math.sin( y / 12.0 * PI ) + 320 * Math.sin( y * PI / 30.0 ) ) * 2.0 / 3.0;
  return ret;
}

/**
 * 转换经度
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @returns {number} 转换后的经度值
 */
function transformLon( x, y ) {
  let PI = 3.14159265358979324;
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt( Math.abs( x ) );
  ret += ( 20.0 * Math.sin( 6.0 * x * PI ) + 20.0 * Math.sin( 2.0 * x * PI ) ) * 2.0 / 3.0;
  ret += ( 20.0 * Math.sin( x * PI ) + 40.0 * Math.sin( x / 3.0 * PI ) ) * 2.0 / 3.0;
  ret += ( 150.0 * Math.sin( x / 12.0 * PI ) + 300.0 * Math.sin( x / 30.0 * PI ) ) * 2.0 / 3.0;
  return ret;
}