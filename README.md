# Pexels 视频搜索 ForwardWidget 组件

## 🎯 项目简介

这是一个基于 Pexels API 的 ForwardWidget 组件，提供高质量免费视频的搜索、获取和管理功能。支持热门视频浏览、关键词搜索、随机视频获取等多种使用场景。

## 📁 项目结构

```
├── pexels_video_widget.js         # 主要的 Widget 组件代码
├── pexels_widget_guide.md         # 详细使用指南
├── pexels_widget_examples.js      # 功能使用示例
├── wallpaper_widget_demo.js       # 优化后的壁纸 Demo
├── wallpaper_widget_analysis.md   # Demo 分析文档
├── ForwardWidget_Development_Guide.md  # 框架开发指南
└── README.md                       # 项目总览（本文件）
```

## 🚀 主要功能

### 1. 热门视频模块 (`getPopularVideos`)
- 获取 Pexels 平台当前最热门的视频
- 支持分页浏览和分辨率过滤
- 自动缓存机制，提升性能

### 2. 搜索视频模块 (`searchVideos`)
- 基于关键词搜索特定主题视频
- 支持多种过滤条件：方向、尺寸、质量
- 智能搜索结果排序

### 3. 随机视频模块 (`getRandomVideos`)
- 获取随机高质量视频
- 支持分类别随机获取
- 智能随机算法，避免重复

## ⚡ 快速开始

### 1. 获取 Pexels API 密钥

```bash
# 1. 访问 Pexels 官网注册账户
https://www.pexels.com

# 2. 申请 API 访问权限
https://www.pexels.com/api/

# 3. 获取您的 API 密钥
```

### 2. 配置 Widget

```javascript
// 在 ForwardWidget 应用中配置参数
{
    api_key: "YOUR_PEXELS_API_KEY",  // 必填：您的 API 密钥
    query: "nature",                 // 搜索关键词
    per_page: "15",                  // 每页视频数量
    orientation: "landscape",        // 视频方向
    size: "large"                    // 视频尺寸偏好
}
```

### 3. 基本使用示例

```javascript
// 获取热门视频
const popularVideos = await getPopularVideos({
    api_key: "YOUR_API_KEY",
    per_page: "20",
    page: "1"
});

// 搜索特定主题视频
const searchResults = await searchVideos({
    api_key: "YOUR_API_KEY",
    query: "ocean waves",
    orientation: "landscape"
});

// 获取随机视频
const randomVideos = await getRandomVideos({
    api_key: "YOUR_API_KEY",
    category: "nature",
    count: "10"
});
```

## 📋 参数配置

### 通用参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `api_key` | string | ✅ | Pexels API 密钥 | `"YOUR_API_KEY"` |
| `per_page` | string | ❌ | 每页数量 (10-30) | `"15"` |
| `page` | string | ❌ | 页码 | `"1"` |

### 搜索专用参数

| 参数 | 类型 | 必填 | 说明 | 可选值 |
|------|------|------|------|--------|
| `query` | string | ✅ | 搜索关键词 | `"nature"`, `"ocean"` |
| `orientation` | string | ❌ | 视频方向 | `"all"`, `"landscape"`, `"portrait"`, `"square"` |
| `size` | string | ❌ | 视频尺寸 | `"all"`, `"large"`, `"medium"`, `"small"` |

### 随机视频专用参数

| 参数 | 类型 | 必填 | 说明 | 可选值 |
|------|------|------|------|--------|
| `category` | string | ❌ | 视频类别 | `"nature"`, `"ocean"`, `"city"`, `"sky"` |
| `count` | string | ❌ | 视频数量 | `"10"`, `"15"`, `"20"` |

## 📊 返回数据格式

每个视频项目包含完整的 ForwardWidget 兼容数据：

```javascript
{
    id: "pexels_12345",               // 唯一标识
    type: "video",                    // 媒体类型
    title: "Pexels 视频 #12345",      // 视频标题
    description: "高质量视频描述",     // 详细描述
    posterPath: "封面图片URL",        // 视频封面
    videoUrl: "高质量视频URL",        // 主视频地址
    previewUrl: "预览视频URL",        // 预览地址
    duration: 30,                     // 时长（秒）
    durationText: "00:30",            // 格式化时长
    rating: "4.5",                    // 评分
    genreTitle: "视频素材",           // 分类
    link: "原始页面URL",              // 来源链接
    videoFiles: [...]                 // 多质量文件列表
}
```

## 🔧 高级功能

### 1. 智能缓存策略
- **热门视频**: 缓存 1 小时
- **搜索结果**: 缓存 30 分钟  
- **随机视频**: 缓存 20 分钟

### 2. 错误处理机制
- API 密钥验证
- 网络错误重试
- 友好的错误提示
- 完整的日志记录

### 3. 多质量视频支持
```javascript
// 自动选择最佳质量
const bestVideo = videoFiles.find(file => file.quality === 'hd') || videoFiles[0];

// 多种分辨率选项
{
    "tiny": "480x270",     // 小尺寸，适合预览
    "small": "640x360",    // 中小尺寸
    "medium": "1280x720",  // 高清
    "large": "1920x1080",  // 全高清
    "original": "3840x2160" // 4K原画质
}
```

## 📚 文档链接

- **[详细使用指南](./pexels_widget_guide.md)** - 完整的配置和使用说明
- **[功能示例](./pexels_widget_examples.js)** - 7种使用场景的代码示例
- **[ForwardWidget 开发指南](./ForwardWidget_Development_Guide.md)** - 框架开发规范
- **[壁纸 Demo 分析](./wallpaper_widget_analysis.md)** - 最佳实践示例

## 🎨 使用场景

### 🎬 内容创作
```javascript
// 获取适合视频背景的素材
const backgroundVideos = await searchVideos({
    api_key: "YOUR_KEY",
    query: "abstract motion",
    orientation: "landscape",
    size: "large"
});
```

### 📱 移动应用
```javascript
// 获取适合手机屏幕的纵向视频
const mobileVideos = await searchVideos({
    api_key: "YOUR_KEY",
    query: "city night",
    orientation: "portrait",
    size: "medium"
});
```

### 🎲 创意灵感
```javascript
// 随机获取不同类别的创意素材
const inspirationVideos = await getRandomVideos({
    api_key: "YOUR_KEY",
    category: "all",
    count: "20"
});
```

### 🔍 素材库管理
```javascript
// 批量获取分类素材
const categories = ["nature", "technology", "people"];
const categorizedVideos = {};

for (const category of categories) {
    categorizedVideos[category] = await getRandomVideos({
        api_key: "YOUR_KEY",
        category: category,
        count: "15"
    });
}
```

## ⚠️ 注意事项

### 1. API 限制
- Pexels API 有请求频率限制
- 建议合理使用缓存机制
- 避免短时间内大量请求

### 2. 版权说明
- Pexels 视频均为免费使用
- 无需注明来源，但建议标注
- 遵守 Pexels 使用条款

### 3. 性能优化
- 根据用途选择合适的视频质量
- 利用预览功能减少带宽消耗
- 合理设置缓存时间

## 🛠️ 故障排除

### 常见问题解决

| 问题 | 解决方案 |
|------|----------|
| API 密钥无效 | 检查密钥是否正确，账户是否正常 |
| 请求频率过高 | 等待后重试，利用缓存机制 |
| 搜索无结果 | 尝试更通用的关键词 |
| 视频加载失败 | 选择较小尺寸或重新获取链接 |

### 调试技巧
```javascript
// 启用详细日志
console.log("API 请求参数:", params);
console.log("返回数据:", response.data);

// 测试 API 连接
const isConnected = await testApiConnection("YOUR_API_KEY");
console.log("API 连接状态:", isConnected);
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目遵循 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Pexels](https://www.pexels.com) - 提供高质量免费视频资源
- [ForwardWidget](https://github.com/forwardwidget) - 优秀的组件框架
- 所有贡献者和测试用户

---

> 💡 **提示**: 使用前请确保已获取有效的 Pexels API 密钥，详细步骤请参阅 [使用指南](./pexels_widget_guide.md#🔑-获取-pexels-api-密钥)。