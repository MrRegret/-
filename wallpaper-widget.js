/**
 * ForwardWidget - 动态壁纸组件
 * 符合FWD开发规范的完整实现
 * @author ForwardWidget Team
 * @version 2.0.0
 */

WidgetMetadata = {
  id: "pexels_wallpaper",
  title: "Pexels动态壁纸",
  description: "基于Pexels API的高质量动态壁纸组件，支持随机获取和内容搜索",
  author: "VEUS.5",
  site: "https://github.com/ForwardWidget/pexels-wallpaper",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  icon: "🎬",
  tags: ["壁纸", "视频", "Pexels", "动态"],
  modules: [
    {
      name: "pexels_config",
      title: "API配置",
      description: "配置Pexels API密钥和基本设置",
      requiresWebView: true,
      functionName: "showConfigInterface",
      params: []
    },
    {
      name: "random_wallpaper",
      title: "随机壁纸",
      description: "随机获取Pexels优质视频壁纸",
      requiresWebView: false,
      functionName: "getRandomWallpaper",
      params: [
        {
          name: "quality",
          title: "视频质量",
          type: "enumeration",
          enumOptions: [
            { value: "hd", title: "高清 (HD)" },
            { value: "sd", title: "标清 (SD)" },
            { value: "original", title: "原质量" }
          ],
          value: "hd"
        },
        {
          name: "orientation",
          title: "方向",
          type: "enumeration",
          enumOptions: [
            { value: "landscape", title: "横向" },
            { value: "portrait", title: "纵向" },
            { value: "square", title: "正方形" }
          ],
          value: "landscape"
        },
        {
          name: "duration",
          title: "时长范围",
          type: "enumeration",
          enumOptions: [
            { value: "short", title: "短视频 (<30s)" },
            { value: "medium", title: "中等 (30s-2min)" },
            { value: "long", title: "长视频 (>2min)" },
            { value: "all", title: "全部" }
          ],
          value: "medium"
        }
      ]
    },
    {
      name: "search_wallpaper",
      title: "搜索壁纸",
      description: "根据关键词搜索特定内容的动态壁纸",
      requiresWebView: false,
      functionName: "searchWallpaper",
      params: [
        {
          name: "query",
          title: "搜索关键词",
          type: "string",
          value: "nature",
          placeholder: "输入搜索关键词，如：ocean, forest, city..."
        },
        {
          name: "page",
          title: "页码",
          type: "number",
          value: 1,
          min: 1,
          max: 50
        },
        {
          name: "per_page",
          title: "每页数量",
          type: "enumeration",
          enumOptions: [
            { value: "5", title: "5个" },
            { value: "10", title: "10个" },
            { value: "15", title: "15个" },
            { value: "20", title: "20个" }
          ],
          value: "10"
        }
      ]
    },
    {
      name: "trending_wallpaper",
      title: "热门壁纸",
      description: "获取当前热门的动态壁纸",
      requiresWebView: false,
      functionName: "getTrendingWallpaper",
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            { value: "popular", title: "最受欢迎" },
            { value: "latest", title: "最新上传" },
            { value: "curated", title: "精选推荐" }
          ],
          value: "popular"
        }
      ]
    }
  ],
};

/**
 * 全局配置和状态管理
 */
const WallpaperConfig = {
  apiKey: null,
  baseUrl: "https://api.pexels.com/videos",
  defaultParams: {
    per_page: 10,
    orientation: "landscape"
  },
  cache: new Map(),
  cacheExpiry: 30 * 60 * 1000, // 30分钟缓存
  
  // 从本地存储加载配置
  load() {
    try {
      const stored = localStorage.getItem('pexels_wallpaper_config');
      if (stored) {
        const config = JSON.parse(stored);
        this.apiKey = config.apiKey;
        return true;
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
    return false;
  },
  
  // 保存配置到本地存储
  save() {
    try {
      const config = { apiKey: this.apiKey };
      localStorage.setItem('pexels_wallpaper_config', JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('保存配置失败:', error);
      return false;
    }
  },
  
  // 验证API密钥
  async validateApiKey(apiKey) {
    try {
      const response = await fetch(`${this.baseUrl}/popular?per_page=1`, {
        headers: { 'Authorization': apiKey }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

/**
 * Pexels API客户端
 */
class PexelsApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = WallpaperConfig.baseUrl;
  }
  
  async makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('API密钥未配置，请先设置Pexels API密钥');
    }
    
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
    
    // 检查缓存
    const cacheKey = url.toString();
    const cached = WallpaperConfig.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < WallpaperConfig.cacheExpiry) {
      return cached.data;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': this.apiKey,
        'User-Agent': 'ForwardWidget/2.0.0'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败 (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // 缓存结果
    WallpaperConfig.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  async searchVideos(query, params = {}) {
    return await this.makeRequest('search', {
      query,
      ...WallpaperConfig.defaultParams,
      ...params
    });
  }
  
  async getPopularVideos(params = {}) {
    return await this.makeRequest('popular', {
      ...WallpaperConfig.defaultParams,
      ...params
    });
  }
  
  async getCuratedVideos(params = {}) {
    return await this.makeRequest('curated', {
      ...WallpaperConfig.defaultParams,
      ...params
    });
  }
}

/**
 * 视频处理工具
 */
const VideoUtils = {
  /**
   * 获取最佳质量的视频URL
   */
  getBestVideoUrl(video, quality = 'hd') {
    const files = video.video_files || [];
    
    // 质量优先级映射
    const qualityMap = {
      'hd': ['hd', 'sd', 'original'],
      'sd': ['sd', 'hd', 'original'], 
      'original': ['original', 'hd', 'sd']
    };
    
    const priorities = qualityMap[quality] || qualityMap['hd'];
    
    for (const targetQuality of priorities) {
      const file = files.find(f => f.quality === targetQuality);
      if (file) return file.link;
    }
    
    // fallback到第一个可用文件
    return files.length > 0 ? files[0].link : null;
  },
  
  /**
   * 过滤视频时长
   */
  filterByDuration(videos, duration = 'all') {
    if (duration === 'all') return videos;
    
    return videos.filter(video => {
      const videoDuration = video.duration || 0;
      
      switch (duration) {
        case 'short':
          return videoDuration <= 30;
        case 'medium':
          return videoDuration > 30 && videoDuration <= 120;
        case 'long':
          return videoDuration > 120;
        default:
          return true;
      }
    });
  },
  
  /**
   * 格式化视频数据
   */
  formatVideo(video, quality = 'hd') {
    return {
      id: video.id.toString(),
      type: "video",
      title: `视频壁纸 - ${video.width}x${video.height}`,
      description: video.user?.name ? `by ${video.user.name}` : '',
      coverUrl: video.image,
      videoUrl: this.getBestVideoUrl(video, quality),
      duration: video.duration,
      width: video.width,
      height: video.height,
      tags: video.tags || [],
      photographer: video.user?.name || 'Unknown',
      photographerUrl: video.user?.url || '',
      source: 'Pexels',
      sourceUrl: video.url
    };
  }
};

/**
 * 显示API配置界面
 */
async function showConfigInterface() {
  // 加载现有配置
  WallpaperConfig.load();
  
  const configHtml = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pexels动态壁纸 - API配置</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .config-container {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                padding: 40px;
                max-width: 500px;
                width: 100%;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header h1 {
                color: #333;
                font-size: 28px;
                margin-bottom: 8px;
            }
            
            .header p {
                color: #666;
                font-size: 14px;
            }
            
            .form-group {
                margin-bottom: 24px;
            }
            
            .form-label {
                display: block;
                color: #333;
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .form-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .form-help {
                margin-top: 8px;
                font-size: 12px;
                color: #666;
                line-height: 1.4;
            }
            
            .form-help a {
                color: #667eea;
                text-decoration: none;
            }
            
            .form-help a:hover {
                text-decoration: underline;
            }
            
            .button-group {
                display: flex;
                gap: 12px;
                margin-top: 30px;
            }
            
            .btn {
                flex: 1;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: #667eea;
                color: white;
            }
            
            .btn-primary:hover {
                background: #5a67d8;
                transform: translateY(-1px);
            }
            
            .btn-secondary {
                background: #e2e8f0;
                color: #4a5568;
            }
            
            .btn-secondary:hover {
                background: #cbd5e0;
            }
            
            .status {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                text-align: center;
            }
            
            .status.success {
                background: #c6f6d5;
                color: #22543d;
                border: 1px solid #68d391;
            }
            
            .status.error {
                background: #fed7d7;
                color: #742a2a;
                border: 1px solid #fc8181;
            }
            
            .loading {
                display: none;
                text-align: center;
                color: #666;
            }
            
            .feature-list {
                background: #f8fafc;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            
            .feature-list h3 {
                color: #333;
                margin-bottom: 12px;
                font-size: 16px;
            }
            
            .feature-list ul {
                list-style: none;
                padding: 0;
            }
            
            .feature-list li {
                color: #666;
                margin-bottom: 8px;
                position: relative;
                padding-left: 20px;
                font-size: 14px;
            }
            
            .feature-list li::before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #48bb78;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="config-container">
            <div class="header">
                <h1>🎬 Pexels动态壁纸</h1>
                <p>配置您的Pexels API密钥以获取高质量视频壁纸</p>
            </div>
            
            <div id="status"></div>
            
            <form id="configForm">
                <div class="form-group">
                    <label for="apiKey" class="form-label">Pexels API 密钥</label>
                    <input 
                        type="password" 
                        id="apiKey" 
                        class="form-input" 
                        placeholder="输入您的Pexels API密钥..."
                        value="${WallpaperConfig.apiKey || ''}"
                        required
                    >
                    <div class="form-help">
                        没有API密钥？访问 <a href="https://www.pexels.com/api/" target="_blank">Pexels API</a> 免费注册获取
                    </div>
                </div>
                
                <div class="button-group">
                    <button type="button" class="btn btn-secondary" onclick="testApiKey()">测试连接</button>
                    <button type="submit" class="btn btn-primary">保存配置</button>
                </div>
            </form>
            
            <div class="loading" id="loading">
                <p>正在测试API连接...</p>
            </div>
            
            <div class="feature-list">
                <h3>功能特性</h3>
                <ul>
                    <li>随机获取Pexels优质视频壁纸</li>
                    <li>支持关键词搜索特定内容</li>
                    <li>多种视频质量和方向选择</li>
                    <li>智能缓存机制提升性能</li>
                    <li>热门和精选视频推荐</li>
                </ul>
            </div>
        </div>
        
        <script>
            const configForm = document.getElementById('configForm');
            const statusDiv = document.getElementById('status');
            const loadingDiv = document.getElementById('loading');
            
            function showStatus(message, type = 'success') {
                statusDiv.innerHTML = \`<div class="status \${type}">\${message}</div>\`;
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
            }
            
            async function testApiKey() {
                const apiKey = document.getElementById('apiKey').value.trim();
                
                if (!apiKey) {
                    showStatus('请输入API密钥', 'error');
                    return;
                }
                
                loadingDiv.style.display = 'block';
                
                try {
                    const response = await fetch('https://api.pexels.com/videos/popular?per_page=1', {
                        headers: { 'Authorization': apiKey }
                    });
                    
                    if (response.ok) {
                        showStatus('✅ API密钥验证成功！', 'success');
                    } else {
                        showStatus('❌ API密钥无效，请检查后重试', 'error');
                    }
                } catch (error) {
                    showStatus('❌ 网络错误，请检查网络连接', 'error');
                } finally {
                    loadingDiv.style.display = 'none';
                }
            }
            
            configForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const apiKey = document.getElementById('apiKey').value.trim();
                
                if (!apiKey) {
                    showStatus('请输入API密钥', 'error');
                    return;
                }
                
                // 保存配置
                try {
                    const config = { apiKey };
                    localStorage.setItem('pexels_wallpaper_config', JSON.stringify(config));
                    showStatus('✅ 配置保存成功！', 'success');
                    
                    // 可以通过postMessage通知父窗口
                    if (window.parent !== window) {
                        window.parent.postMessage({
                            type: 'configSaved',
                            config: config
                        }, '*');
                    }
                } catch (error) {
                    showStatus('❌ 保存配置失败', 'error');
                }
            });
            
            // 监听快捷键
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    configForm.dispatchEvent(new Event('submit'));
                }
            });
        </script>
    </body>
    </html>
  `;
  
  return [{
    type: "html",
    content: configHtml
  }];
}

/**
 * 获取随机壁纸
 */
async function getRandomWallpaper(params = {}) {
  try {
    // 加载配置
    if (!WallpaperConfig.load() || !WallpaperConfig.apiKey) {
      throw new Error('请先配置Pexels API密钥');
    }
    
    const client = new PexelsApiClient(WallpaperConfig.apiKey);
    const { quality = 'hd', orientation = 'landscape', duration = 'medium' } = params;
    
    // 随机选择获取方式
    const methods = ['popular', 'curated'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    
    // 随机页码 (1-10)
    const randomPage = Math.floor(Math.random() * 10) + 1;
    
    const requestParams = {
      page: randomPage,
      per_page: 20,
      orientation
    };
    
    let response;
    if (method === 'popular') {
      response = await client.getPopularVideos(requestParams);
    } else {
      response = await client.getCuratedVideos(requestParams);
    }
    
    let videos = response.videos || [];
    
    if (videos.length === 0) {
      throw new Error('未找到符合条件的视频');
    }
    
    // 按时长过滤
    videos = VideoUtils.filterByDuration(videos, duration);
    
    if (videos.length === 0) {
      throw new Error('未找到符合时长要求的视频');
    }
    
    // 随机选择一个视频
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    
    return [VideoUtils.formatVideo(randomVideo, quality)];
    
  } catch (error) {
    console.error('获取随机壁纸失败:', error);
    
    // 返回错误信息
    return [{
      id: "error",
      type: "error",
      title: "获取失败",
      description: error.message,
      coverUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU2NTY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7plJnor688L3RleHQ+PC9zdmc+"
    }];
  }
}

/**
 * 搜索壁纸
 */
async function searchWallpaper(params = {}) {
  try {
    // 加载配置
    if (!WallpaperConfig.load() || !WallpaperConfig.apiKey) {
      throw new Error('请先配置Pexels API密钥');
    }
    
    const client = new PexelsApiClient(WallpaperConfig.apiKey);
    const { 
      query = 'nature',
      page = 1,
      per_page = 10
    } = params;
    
    if (!query.trim()) {
      throw new Error('请输入搜索关键词');
    }
    
    const response = await client.searchVideos(query, {
      page: Math.max(1, parseInt(page)),
      per_page: Math.max(1, Math.min(80, parseInt(per_page)))
    });
    
    const videos = response.videos || [];
    
    if (videos.length === 0) {
      return [{
        id: "no_results",
        type: "info",
        title: "未找到结果",
        description: `没有找到关于 "${query}" 的视频`,
        coverUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdhNjE2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7ml6DmkJzntII8L3RleHQ+PC9zdmc+"
      }];
    }
    
    return videos.map(video => VideoUtils.formatVideo(video));
    
  } catch (error) {
    console.error('搜索壁纸失败:', error);
    
    return [{
      id: "error",
      type: "error", 
      title: "搜索失败",
      description: error.message,
      coverUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU2NTY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7plJnor688L3RleHQ+PC9zdmc+"
    }];
  }
}

/**
 * 获取热门壁纸
 */
async function getTrendingWallpaper(params = {}) {
  try {
    // 加载配置
    if (!WallpaperConfig.load() || !WallpaperConfig.apiKey) {
      throw new Error('请先配置Pexels API密钥');
    }
    
    const client = new PexelsApiClient(WallpaperConfig.apiKey);
    const { category = 'popular' } = params;
    
    const requestParams = {
      page: 1,
      per_page: 15
    };
    
    let response;
    switch (category) {
      case 'latest':
        // Pexels API doesn't have a direct latest endpoint, use search with recent
        response = await client.searchVideos('trending', requestParams);
        break;
      case 'curated':
        response = await client.getCuratedVideos(requestParams);
        break;
      case 'popular':
      default:
        response = await client.getPopularVideos(requestParams);
        break;
    }
    
    const videos = response.videos || [];
    
    if (videos.length === 0) {
      throw new Error('未找到热门视频');
    }
    
    return videos.map(video => VideoUtils.formatVideo(video));
    
  } catch (error) {
    console.error('获取热门壁纸失败:', error);
    
    return [{
      id: "error",
      type: "error",
      title: "获取失败",
      description: error.message,
      coverUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU2NTY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7plJnor688L3RleHQ+PC9zdmc+"
    }];
  }
}

/**
 * 工具函数：清理缓存
 */
function clearCache() {
  WallpaperConfig.cache.clear();
  return true;
}

/**
 * 工具函数：获取配置状态
 */
function getConfigStatus() {
  return {
    hasApiKey: !!WallpaperConfig.apiKey,
    cacheSize: WallpaperConfig.cache.size,
    lastUpdate: Date.now()
  };
}

// 初始化配置
WallpaperConfig.load();
