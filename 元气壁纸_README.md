# 元气壁纸 ForwardWidget

> 🎨 高质量动态和静态壁纸获取工具，完全兼容ForwardWidget开发标准

## 📋 项目概述

**元气壁纸 ForwardWidget** 是基于 `https://mbizhi.cheetahfun.com` 开发的专业壁纸获取组件，提供随机获取、分类浏览和关键词搜索功能。该组件完全遵循FWD（ForwardWidget）开发标准，支持现代化的UI设计和高效的缓存机制。

### ✨ 核心特性

- **🎲 随机获取**: 智能随机推荐高质量壁纸
- **📂 分类浏览**: 支持8大分类（4K、风景、动漫、美女、动物、游戏、小清新、其他）
- **🔍 关键词搜索**: 智能匹配分类和内容搜索
- **⚡ 智能缓存**: 30分钟缓存机制，减少网络请求
- **📱 响应式设计**: 完美适配桌面和移动设备
- **🎨 现代化UI**: 渐变背景、毛玻璃效果、动画交互

## 🚀 快速开始

### 基础使用

```html
<!DOCTYPE html>
<html>
<head>
    <title>元气壁纸演示</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <!-- 组件容器 -->
    <div id="wallpaper-widget-container"></div>
    
    <!-- 引入脚本 -->
    <script src="yuanqi-wallpaper-widget.js"></script>
</body>
</html>
```

### 手动初始化

```javascript
// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
    // 创建组件实例
    const widget = new WallpaperWidget();
    
    // 初始化到指定容器
    await widget.initialize('my-wallpaper-container');
    
    console.log('元气壁纸组件已初始化');
});
```

### 编程式API调用

```javascript
// 获取随机壁纸
const randomWallpapers = await wallpaperWidget.client.getRandomWallpapers(6);

// 获取指定分类壁纸
const animeWallpapers = await wallpaperWidget.client.getByCategory('1'); // 动漫

// 搜索壁纸
const searchResults = await wallpaperWidget.client.searchWallpapers('风景');

// 获取组件状态
const status = wallpaperWidget.getStatus();
console.log('组件状态:', status);
```

## 🛠️ 功能详解

### 1. 随机壁纸模块

```javascript
// 随机获取功能
class RandomModule {
    async getRandomWallpapers(count = 12) {
        // 从首页获取壁纸并随机排序
        const homeWallpapers = await this.getHomePage();
        return homeWallpapers.sort(() => 0.5 - Math.random()).slice(0, count);
    }
}
```

**特性:**
- 支持自定义获取数量
- 真随机算法排序
- 自动去重和过滤

### 2. 分类浏览模块

```javascript
// 支持的分类
const categories = {
    '109': '4K',      // 超高清壁纸
    '2': '风景',       // 自然风景
    '1': '动漫',       // 动漫二次元
    '3': '美女',       // 人像美女
    '6': '动物',       // 可爱动物
    '8': '游戏',       // 游戏截图
    '17': '小清新',    // 清新风格
    '9': '其他'        // 其他类型
};

// 获取分类壁纸
await wallpaperWidget.selectCategory('2'); // 选择风景分类
```

### 3. 智能搜索模块

```javascript
// 搜索算法
async searchWallpapers(keyword) {
    // 1. 优先匹配分类名称
    const matchingCategories = Object.entries(categories)
        .filter(([id, name]) => name.includes(keyword));
    
    // 2. 获取匹配分类的壁纸
    if (matchingCategories.length > 0) {
        for (const [categoryId] of matchingCategories) {
            const wallpapers = await this.getByCategory(categoryId);
            searchResults.push(...wallpapers.slice(0, 6));
        }
    }
    
    // 3. fallback到首页推荐
    return searchResults;
}
```

### 4. 缓存机制

```javascript
// 智能缓存系统
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 30 * 60 * 1000; // 30分钟
    }
    
    // 缓存策略
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        
        // 自动清理过期缓存
        this.cleanExpiredCache();
    }
}
```

## 🎨 UI组件详解

### 响应式网格布局

```css
.wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

@media (max-width: 768px) {
    .wallpaper-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
}
```

### 现代化交互效果

```css
.wallpaper-item {
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.wallpaper-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.wallpaper-image {
    transition: transform 0.3s ease;
}

.wallpaper-item:hover .wallpaper-image {
    transform: scale(1.05);
}
```

### 毛玻璃效果

```css
.wallpaper-widget {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    backdrop-filter: blur(10px);
}

.nav-btn {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
}
```

## 📊 数据结构

### 壁纸对象结构

```javascript
const wallpaperObject = {
    id: "577132",                    // 唯一标识
    title: "短发少女",                // 壁纸标题
    categoryId: "3",                 // 分类ID
    category: "美女",                // 分类名称
    type: "静态",                    // 类型：动态/静态
    imageUrl: "https://img-baofun.zhhainiao.com/...", // 图片URL
    downloadUrl: "https://img-baofun.zhhainiao.com/...", // 下载URL
    detailUrl: "https://mbizhi.cheetahfun.com/dn/pd577132.html", // 详情页URL
    timestamp: 1672531200000         // 获取时间戳
};
```

### API响应格式

```javascript
// 成功响应
const successResponse = {
    success: true,
    data: [wallpaperObject, ...],
    count: 12,
    timestamp: Date.now()
};

// 错误响应
const errorResponse = {
    success: false,
    error: "获取壁纸失败",
    code: "FETCH_ERROR",
    timestamp: Date.now()
};
```

## ⚙️ 配置选项

### 全局配置

```javascript
const WIDGET_CONFIG = {
    name: '元气壁纸',
    version: '1.0.0',
    description: '高质量动态和静态壁纸获取工具',
    author: 'FWD Team',
    baseUrl: 'https://mbizhi.cheetahfun.com',
    cdnUrl: 'https://img-baofun.zhhainiao.com',
    cacheDuration: 30 * 60 * 1000,  // 缓存时长
    categories: { /* 分类配置 */ }
};
```

### 自定义配置

```javascript
// 修改缓存时长为1小时
WIDGET_CONFIG.cacheDuration = 60 * 60 * 1000;

// 自定义基础URL
WIDGET_CONFIG.baseUrl = 'https://your-proxy-domain.com';

// 添加自定义分类
WIDGET_CONFIG.categories['100'] = '自定义分类';
```

## 🔧 高级功能

### 1. 批量下载

```javascript
// 批量下载当前页面的所有壁纸
async function batchDownload() {
    const wallpapers = wallpaperWidget.ui.wallpapers;
    
    for (let i = 0; i < wallpapers.length; i++) {
        const wallpaper = wallpapers[i];
        await wallpaperWidget.downloadWallpaper(wallpaper.downloadUrl, wallpaper.title);
        
        // 延迟避免服务器压力
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
```

### 2. 自定义过滤器

```javascript
// 添加自定义过滤器
function filterWallpapers(wallpapers, options = {}) {
    let filtered = wallpapers;
    
    // 按类型过滤
    if (options.type) {
        filtered = filtered.filter(w => w.type === options.type);
    }
    
    // 按分类过滤
    if (options.category) {
        filtered = filtered.filter(w => w.category === options.category);
    }
    
    // 按时间过滤（最近上传）
    if (options.recent) {
        const cutoff = Date.now() - options.recent;
        filtered = filtered.filter(w => w.timestamp > cutoff);
    }
    
    return filtered;
}

// 使用示例
const recentAnimeWallpapers = filterWallpapers(wallpapers, {
    type: '动态',
    category: '动漫',
    recent: 7 * 24 * 60 * 60 * 1000 // 最近7天
});
```

### 3. 事件监听

```javascript
// 监听壁纸加载事件
wallpaperWidget.on('wallpapersLoaded', (wallpapers) => {
    console.log(`加载了 ${wallpapers.length} 张壁纸`);
});

// 监听下载事件
wallpaperWidget.on('downloadStarted', (wallpaper) => {
    console.log(`开始下载: ${wallpaper.title}`);
});

// 监听错误事件
wallpaperWidget.on('error', (error) => {
    console.error('组件错误:', error);
});
```

## 📈 性能优化

### 1. 图片懒加载

```javascript
// 实现图片懒加载
function setupLazyLoading() {
    const images = document.querySelectorAll('.wallpaper-image');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
```

### 2. 虚拟滚动

```javascript
// 大量数据时使用虚拟滚动
class VirtualScroller {
    constructor(container, itemHeight, renderItem) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.setupVirtualScroll();
    }
    
    setupVirtualScroll() {
        // 虚拟滚动实现
        // 只渲染可见区域的项目
    }
}
```

### 3. 请求去重

```javascript
// 防止重复请求
class RequestDeduplicator {
    constructor() {
        this.pendingRequests = new Map();
    }
    
    async request(key, requestFn) {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }
        
        const promise = requestFn();
        this.pendingRequests.set(key, promise);
        
        try {
            const result = await promise;
            return result;
        } finally {
            this.pendingRequests.delete(key);
        }
    }
}
```

## 🔒 安全考虑

### 1. XSS防护

```javascript
// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 在渲染壁纸标题时使用
title: escapeHtml(wallpaper.title)
```

### 2. URL验证

```javascript
// 验证图片URL的安全性
function isValidImageUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:' && 
               urlObj.hostname.includes('zhhainiao.com');
    } catch {
        return false;
    }
}
```

### 3. CSP配置

```html
<!-- 建议的CSP配置 -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https://img-baofun.zhhainiao.com; 
               connect-src 'self' https://mbizhi.cheetahfun.com;">
```

## 🐛 故障排除

### 常见问题

**1. 图片加载失败**
```javascript
// 解决方案：添加错误处理
img.onerror = function() {
    this.src = 'data:image/svg+xml,<svg>...</svg>'; // 默认图片
};
```

**2. 跨域问题**
```javascript
// 解决方案：使用代理或CORS头
const proxyUrl = 'https://your-proxy.com/';
const response = await fetch(proxyUrl + targetUrl);
```

**3. 缓存过期**
```javascript
// 解决方案：手动清理缓存
wallpaperWidget.client.cache.clear();
```

### 调试模式

```javascript
// 启用调试模式
WIDGET_CONFIG.debug = true;

// 查看缓存状态
console.log('缓存状态:', wallpaperWidget.client.getStats());

// 查看当前状态
console.log('组件状态:', wallpaperWidget.getStatus());
```

## 📚 API参考

### WallpaperWidget 类

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `initialize(containerId)` | containerId: string | Promise<void> | 初始化组件 |
| `switchPage(page)` | page: string | Promise<void> | 切换页面 |
| `loadRandomWallpapers()` | - | Promise<void> | 加载随机壁纸 |
| `selectCategory(categoryId)` | categoryId: string | Promise<void> | 选择分类 |
| `searchWallpapers(keyword)` | keyword: string | Promise<void> | 搜索壁纸 |
| `downloadWallpaper(url, title)` | url: string, title: string | Promise<void> | 下载壁纸 |
| `previewWallpaper(url, title)` | url: string, title: string | void | 预览壁纸 |
| `getStatus()` | - | Object | 获取状态信息 |

### YuanqiWallpaperClient 类

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `getHomePage()` | - | Promise<Array> | 获取首页壁纸 |
| `getByCategory(categoryId)` | categoryId: string | Promise<Array> | 获取分类壁纸 |
| `searchWallpapers(keyword)` | keyword: string | Promise<Array> | 搜索壁纸 |
| `getRandomWallpapers(count)` | count: number | Promise<Array> | 获取随机壁纸 |
| `getStats()` | - | Object | 获取统计信息 |

## 🎯 最佳实践

### 1. 组件初始化

```javascript
// ✅ 推荐：等待DOM加载
document.addEventListener('DOMContentLoaded', async () => {
    await initializeWallpaperWidget();
});

// ❌ 不推荐：立即执行
initializeWallpaperWidget(); // 可能DOM未加载
```

### 2. 错误处理

```javascript
// ✅ 推荐：完整的错误处理
try {
    const wallpapers = await client.getRandomWallpapers();
    ui.updateWallpaperGrid(wallpapers);
} catch (error) {
    console.error('加载失败:', error);
    ui.showError('加载失败，请稍后重试');
}

// ❌ 不推荐：忽略错误
const wallpapers = await client.getRandomWallpapers();
ui.updateWallpaperGrid(wallpapers);
```

### 3. 性能优化

```javascript
// ✅ 推荐：使用缓存
const cached = client.getFromCache(cacheKey);
if (cached) return cached;

// ✅ 推荐：请求去重
if (this.pendingRequests.has(key)) {
    return this.pendingRequests.get(key);
}

// ✅ 推荐：适当的请求间隔
await new Promise(resolve => setTimeout(resolve, 1000));
```

## 📄 许可证

MIT License - 请参阅 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境设置

1. 克隆仓库
2. 安装依赖（如果有）
3. 运行测试
4. 提交更改

### 代码规范

- 使用 ES6+ 语法
- 遵循 JSDoc 注释规范
- 保持代码简洁和可读性
- 添加适当的错误处理

---

**🎨 元气壁纸 ForwardWidget - 让您的桌面更精彩！**