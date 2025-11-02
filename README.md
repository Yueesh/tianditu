# 天地图展示组件

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是一个基于天地图API的JavaScript组件库，提供了便捷的地图展示功能，支持坐标转换、标记点显示、信息窗口等功能。

## 功能特性

- 🌍 支持天地图API集成
- 📍 坐标转换（百度坐标系 ↔ 天地图坐标系）
- 📌 标记点显示
- 💬 信息窗口展示
- 🔧 简单易用的API接口
- 🎯 支持自定义缩放级别
- 📋 坐标拾取工具

## 项目结构

```
.
├── map.js          # 地图展示核心组件
├── getPoint.html   # 坐标拾取工具
└── README.md       # 项目说明文档
```

## 安装使用


### 引入地图组件

```html
<script src="map.js"></script>
```

## API说明

### showMap(config)

初始化并显示地图的核心函数。

#### 参数说明

| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| zuobiao | string | 是 | - | 坐标 (如："116.372830,39.863320") |
| item | string | 是 | - | 地图容器ID (如："allmap") |
| zoom | number | 否 | 16 | 缩放级别 (1-18) |
| sContent | string | 否 | "" | 文字内容 (HTML格式) |
| isShow | number | 否 | 1 | 是否显示文字 (0 不显示, 1 显示) |
| type | string | 否 | "" | 坐标类型 ("tianditu" 表示天地图坐标系，其他值表示百度坐标系) |
| key | string | 否 | "" | 天地图API密钥 |

#### 使用示例

```javascript
showMap({
  zuobiao: "116.372830,39.863320",
  item: "allmap",
  zoom: 16,
  sContent: '<div style="padding:10px;">某某某公司<br>地址：浙江省杭州市xx区xx街道xx号</div>',
  isShow: 1,
  type: "",
  key: "your_tianditu_key"
});
```

## 坐标拾取工具

项目包含一个实用的坐标拾取工具 `getPoint.html`，可以帮助您获取地图上的任意坐标点。

使用方法：
1. 修改 `getPoint.html` 文件中的天地图API密钥
2. 打开 `getPoint.html` 文件
3. 在地图上点击任意位置
4. 坐标会自动复制到剪贴板并弹窗显示

## 坐标转换说明

当使用百度坐标系时，系统会自动转换为天地图坐标系，但转换过程会导致精度轻微降低。

## 许可证

本项目采用 MIT 许可证，详情请见 [LICENSE](./LICENSE) 文件。

```
Copyright (c) 2023 某某某公司

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```