# ForwardWidget 开发指南

## 概述

ForwardWidget 是一个用于构建模块的 JavaScript 组件框架，提供了丰富的网页相关功能和数据模型支持。每个 Widget 都是一个独立的 JavaScript 文件，需要遵循特定的结构和规范。

## Widget 结构

### 1. Widget 元数据配置

每个 Widget 脚本必须以 `WidgetMetadata` 对象开始：

```javascript
var WidgetMetadata = {
    id: "unique_id",                        // Widget 唯一标识符
    title: "Widget Title",                  // Widget 显示标题
    description: "Description",             // Widget 描述
    author: "Author Name",                  // 作者
    site: "https://example.com",            // 网站地址
    version: "1.0.0",                       // Widget 版本
    requiredVersion: "0.0.1",               // 所需 ForwardWidget 版本
    detailCacheDuration: 60,                // 详情数据缓存时长（秒），默认 60 秒
    modules: [                              // 功能模块列表
        {
            title: "Module Title",          // 模块标题
            description: "Description",     // 模块描述
            requiresWebView: false,         // 是否需要 WebView
            functionName: "functionName",   // 处理函数名
            sectionMode: false,             // 是否支持分段模式
            cacheDuration: 3600,            // 缓存时长（秒），默认 3600 秒
            params: [/* 参数配置 */]
        }
    ],
    search: {                               // 搜索功能配置（可选）
        title: "Search",
        functionName: "search",
        params: [/* 搜索参数配置 */]
    }
};
```

### 2. 参数配置

参数配置对象结构：

```javascript
{
    name: "paramName",                      // 参数名
    title: "Param Title",                   // 参数显示标题
    type: "input",                          // 参数类型
    description: "Description",             // 参数描述
    value: "defaultValue",                  // 默认值
    belongTo: {                             // 条件触发配置
        paramName: "param name",            // 所属参数名
        value: ["value"]                    // 所属参数值
    },
    placeholders: [                         // 占位符选项
        {
            title: "Option Title",
            value: "optionValue"
        }
    ],
    enumOptions: [                          // 枚举选项
        {
            title: "Option Title",
            value: "optionValue"
        }
    ]
}
```

## 参数类型

| 类型 | 说明 |
|------|------|
| `input` | 文本输入框 |
| `count` | 数字计数器 |
| `constant` | 常量值 |
| `enumeration` | 枚举选择器 |
| `page` | 页码选择器 |
| `offset` | 当前位置 |

## 处理函数规范

每个模块需要实现对应的处理函数：

```javascript
async function functionName(params = {}) {
    try {
        // 1. 参数验证
        if (!params.requiredParam) {
            throw new Error("缺少必要参数");
        }

        // 2. 发送请求
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 ...",
                Referer: "https://example.com",
            },
        });

        // 3. 解析响应
        const docId = Widget.dom.parse(response.data);
        const elements = Widget.dom.select(docId, "selector");

        // 4. 返回结果
        return elements.map((element) => ({
            id: "unique_id",
            type: "type",
            title: "title",
            coverUrl: "url",
            // ... 其他属性
        }));
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
```

## API 接口

### DOM 操作 API

Widget 内置了 cheerio 进行 DOM 解析：

```javascript
// 获得 cheerio 句柄
const $ = Widget.html.load(htmlContent);
```

### HTTP 请求 API

```javascript
// GET 请求
const response = await Widget.http.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 ...",
        Referer: "https://example.com",
    },
});

// POST 请求
const response = await Widget.http.post(url, {
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
});

let data = response.data;
```

### 详情数据加载

当数据 type 为 link 时，需要实现 `loadDetail` 函数：

```javascript
async function loadDetail(link) {
    // 需返回一个带有 videoUrl 的对象
}
```

## 返回数据格式

处理函数需要返回符合 ForwardWidget 数据模型的对象数组：

```javascript
{
    id: "unique_id",                        // 唯一标识符（根据类型确定）
    type: "type",                           // 类型标识: url, douban, imdb, tmdb
    title: "title",                         // 标题
    posterPath: "url",                      // 纵向封面图片地址
    backdropPath: "url",                    // 横向封面地址
    releaseDate: "date",                    // 发布时间
    mediaType: "tv|movie",                  // 媒体类型
    rating: "5",                            // 评分
    genreTitle: "genre",                    // 分类
    duration: 123,                          // 时长数字
    durationText: "00:00",                  // 时长文本
    previewUrl: "url",                      // 预览视频地址
    videoUrl: "videoUrl",                   // 视频播放地址
    link: "link",                           // 详情页打开地址
    episode: 0,                             // 集数
    description: "description",             // 描述
    childItems: [VideoItem]                 // 嵌套对象（最多一层）
}
```

### ID 规则说明

- **type 为 url**: id 为对应的 URL
- **type 为 douban、imdb**: id 为对应的 ID 值
- **type 为 tmdb**: id 需要由 type.id 组成，如：`tv.123`、`movie.234`

## 最佳实践

### 1. 错误处理
- 使用 try-catch 捕获异常
- 提供有意义的错误信息
- 在控制台输出调试信息

### 2. 参数验证
- 验证必要参数是否存在
- 验证参数值是否有效
- 提供默认值处理

### 3. 性能优化
- 使用适当的请求头
- 缓存重复使用的数据
- 优化 DOM 选择器

### 4. 代码组织
- 使用清晰的函数命名
- 添加必要的注释
- 模块化处理逻辑

## 调试方法

App 内置了模块测试工具：

1. 使用 `console.log()` 输出调试信息
2. 检查网络请求和响应
3. 验证 DOM 解析结果
4. 测试不同参数组合

## 开发流程

1. **定义 Widget 元数据**: 配置基本信息和模块结构
2. **实现处理函数**: 按照规范编写数据处理逻辑
3. **测试和调试**: 使用内置工具验证功能
4. **优化性能**: 根据最佳实践优化代码
5. **部署使用**: 将 Widget 文件部署到 ForwardWidget 环境

---

> 本指南基于 ForwardWidget 框架规范整理，适用于开发自定义 Widget 模块。