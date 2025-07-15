WidgetMetadata = {
  id: "yuanqi_wallpaper",
  title: "元气壁纸",
  description: "高质量动态和静态壁纸获取工具，支持随机获取、分类浏览和关键词搜索",
  author: "FWD Team",
  site: "https://mbizhi.cheetahfun.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      name: "random_wallpaper",
      title: "随机壁纸",
      description: "获取随机推荐的高质量壁纸",
      requiresWebView: false,
      functionName: "getRandomWallpapers",
      params: [
        {
          name: "count",
          title: "数量",
          type: "enumeration",
          enumOptions: [
            {
              value: "6",
              title: "6张",
            },
            {
              value: "12",
              title: "12张",
            },
            {
              value: "18",
              title: "18张",
            },
            {
              value: "24",
              title: "24张",
            }
          ],
          value: "12",
        },
      ]
    },
    {
      name: "category_wallpaper",
      title: "分类壁纸",
      description: "根据分类获取专题壁纸",
      requiresWebView: false,
      functionName: "getCategoryWallpapers",
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              value: "109",
              title: "4K超清",
            },
            {
              value: "2",
              title: "风景自然",
            },
            {
              value: "1",
              title: "动漫二次元",
            },
            {
              value: "3",
              title: "人物美女",
            },
            {
              value: "6",
              title: "可爱动物",
            },
            {
              value: "8",
              title: "游戏截图",
            },
            {
              value: "17",
              title: "小清新",
            },
            {
              value: "9",
              title: "其他类型",
            }
          ],
          value: "2",
        },
        {
          name: "count",
          title: "数量",
          type: "enumeration",
          enumOptions: [
            {
              value: "6",
              title: "6张",
            },
            {
              value: "12",
              title: "12张",
            },
            {
              value: "18",
              title: "18张",
            }
          ],
          value: "12",
        },
      ]
    },
    {
      name: "search_wallpaper",
      title: "搜索壁纸",
      description: "根据关键词搜索相关壁纸",
      requiresWebView: false,
      functionName: "searchWallpapers",
      params: [
        {
          name: "keyword",
          title: "关键词",
          type: "enumeration",
          enumOptions: [
            {
              value: "风景",
              title: "风景",
            },
            {
              value: "动漫",
              title: "动漫",
            },
            {
              value: "美女",
              title: "美女",
            },
            {
              value: "动物",
              title: "动物",
            },
            {
              value: "游戏",
              title: "游戏",
            },
            {
              value: "4K",
              title: "4K",
            },
            {
              value: "小清新",
              title: "小清新",
            }
          ],
          value: "风景",
        },
        {
          name: "count",
          title: "数量",
          type: "enumeration",
          enumOptions: [
            {
              value: "6",
              title: "6张",
            },
            {
              value: "12",
              title: "12张",
            }
          ],
          value: "6",
        },
      ]
    }
  ],
};

// 配置信息
const WIDGET_CONFIG = {
  baseUrl: 'https://mbizhi.cheetahfun.com',
  cdnUrl: 'https://img-baofun.zhhainiao.com',
  cacheDuration: 30 * 60 * 1000, // 30分钟缓存
  categories: {
    '109': '4K',
    '2': '风景',
    '1': '动漫',
    '3': '美女',
    '6': '动物',
    '8': '游戏',
    '17': '小清新',
    '9': '其他'
  }
};

// 缓存系统
const Cache = {
  data: new Map(),
  
  get(key) {
    const cached = this.data.get(key);
    if (cached && Date.now() - cached.timestamp < WIDGET_CONFIG.cacheDuration) {
      return cached.value;
    }
    return null;
  },
  
  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now()
    });
    
    // 清理过期缓存
    if (this.data.size > 50) {
      const now = Date.now();
      for (const [k, v] of this.data.entries()) {
        if (now - v.timestamp > WIDGET_CONFIG.cacheDuration) {
          this.data.delete(k);
        }
      }
    }
  },
  
  clear() {
    this.data.clear();
  }
};

// 请求限制控制
let lastRequestTime = 0;
async function rateLimit() {
  const now = Date.now();
  if (now - lastRequestTime < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  lastRequestTime = now;
}

// 解析HTML页面获取壁纸数据
function parseWallpaperData(html) {
  const wallpapers = [];
  
  try {
    // 提取图片数据的正则表达式
    const imageRegex = /data-image-id="(\d+)"[\s\S]*?data-detail="([^"]*)"[\s\S]*?data-classify-id="(\d+)"[\s\S]*?data-wallpaper-type="(\d+)"[\s\S]*?src="([^"]*?)"/g;
    
    let match;
    while ((match = imageRegex.exec(html)) !== null) {
      const [, id, title, categoryId, type, imageUrl] = match;
      
      // 确保图片URL完整
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('//')) {
        fullImageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        fullImageUrl = WIDGET_CONFIG.cdnUrl + imageUrl;
      }
      
      wallpapers.push({
        id: id,
        type: type === '1' ? 'video' : 'image',
        title: title || `${WIDGET_CONFIG.categories[categoryId] || '壁纸'}_${id}`,
        coverUrl: fullImageUrl,
        videoUrl: type === '1' ? fullImageUrl : undefined,
        imageUrl: type === '0' ? fullImageUrl : undefined,
        downloadUrl: fullImageUrl,
        category: WIDGET_CONFIG.categories[categoryId] || '未知',
        detailUrl: `${WIDGET_CONFIG.baseUrl}/dn/pd${id}.html`,
        source: '元气壁纸'
      });
    }
  } catch (error) {
    console.error('解析壁纸数据失败:', error);
  }
  
  return wallpapers;
}

// 获取网页内容
async function fetchPageContent(url) {
  await rateLimit();
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('获取页面内容失败:', error);
    throw error;
  }
}

// 随机壁纸模块
async function getRandomWallpapers(params = {}) {
  const count = parseInt(params.count || 12);
  const cacheKey = `random_${count}`;
  
  // 检查缓存
  const cached = Cache.get(cacheKey);
  if (cached) {
    return cached.slice(0, count);
  }
  
  try {
    // 获取首页内容
    const html = await fetchPageContent(`${WIDGET_CONFIG.baseUrl}/dn/d/`);
    const allWallpapers = parseWallpaperData(html);
    
    if (allWallpapers.length === 0) {
      return [{
        id: "error",
        type: "error",
        title: "获取壁纸失败",
        coverUrl: "",
        description: "未能获取到壁纸数据，请稍后重试"
      }];
    }
    
    // 随机排序并返回指定数量
    const shuffled = allWallpapers.sort(() => 0.5 - Math.random());
    const result = shuffled.slice(0, count);
    
    // 缓存结果
    Cache.set(cacheKey, result);
    
    return result;
    
  } catch (error) {
    console.error('获取随机壁纸失败:', error);
    return [{
      id: "error",
      type: "error",
      title: "网络错误",
      coverUrl: "",
      description: `获取随机壁纸失败: ${error.message}`
    }];
  }
}

// 分类壁纸模块
async function getCategoryWallpapers(params = {}) {
  const categoryId = params.category || '2';
  const count = parseInt(params.count || 12);
  const cacheKey = `category_${categoryId}_${count}`;
  
  // 检查缓存
  const cached = Cache.get(cacheKey);
  if (cached) {
    return cached.slice(0, count);
  }
  
  try {
    // 构建分类URL
    const categoryPath = categoryId === '109' ? 
      `/dtag_109_a14fdede25965c8c0bd3ceb11f364baf/` : 
      `/dn/c${categoryId}d/`;
    
    const html = await fetchPageContent(`${WIDGET_CONFIG.baseUrl}${categoryPath}`);
    const wallpapers = parseWallpaperData(html);
    
    if (wallpapers.length === 0) {
      return [{
        id: "error",
        type: "error",
        title: "分类无壁纸",
        coverUrl: "",
        description: `${WIDGET_CONFIG.categories[categoryId] || '该分类'}暂无壁纸数据`
      }];
    }
    
    const result = wallpapers.slice(0, count);
    
    // 缓存结果
    Cache.set(cacheKey, result);
    
    return result;
    
  } catch (error) {
    console.error('获取分类壁纸失败:', error);
    return [{
      id: "error",
      type: "error",
      title: "分类获取失败",
      coverUrl: "",
      description: `获取${WIDGET_CONFIG.categories[categoryId] || '分类'}壁纸失败: ${error.message}`
    }];
  }
}

// 搜索壁纸模块
async function searchWallpapers(params = {}) {
  const keyword = params.keyword || '风景';
  const count = parseInt(params.count || 6);
  const cacheKey = `search_${keyword}_${count}`;
  
  // 检查缓存
  const cached = Cache.get(cacheKey);
  if (cached) {
    return cached.slice(0, count);
  }
  
  try {
    let searchResults = [];
    
    // 根据关键词匹配分类
    const matchingCategories = Object.entries(WIDGET_CONFIG.categories)
      .filter(([id, name]) => name.includes(keyword) || keyword.includes(name));
    
    if (matchingCategories.length > 0) {
      // 从匹配的分类中获取壁纸
      for (const [categoryId] of matchingCategories) {
        try {
          const categoryPath = categoryId === '109' ? 
            `/dtag_109_a14fdede25965c8c0bd3ceb11f364baf/` : 
            `/dn/c${categoryId}d/`;
          
          const html = await fetchPageContent(`${WIDGET_CONFIG.baseUrl}${categoryPath}`);
          const categoryWallpapers = parseWallpaperData(html);
          
          // 每个分类取部分壁纸
          searchResults.push(...categoryWallpapers.slice(0, Math.ceil(count / matchingCategories.length)));
          
          if (searchResults.length >= count) break;
        } catch (error) {
          console.error(`获取分类${categoryId}失败:`, error);
        }
      }
    }
    
    // 如果没有匹配的分类或结果不足，从首页获取
    if (searchResults.length < count) {
      try {
        const html = await fetchPageContent(`${WIDGET_CONFIG.baseUrl}/dn/d/`);
        const homeWallpapers = parseWallpaperData(html);
        
        // 补充剩余数量
        const needed = count - searchResults.length;
        searchResults.push(...homeWallpapers.slice(0, needed));
      } catch (error) {
        console.error('从首页补充壁纸失败:', error);
      }
    }
    
    if (searchResults.length === 0) {
      return [{
        id: "error",
        type: "error",
        title: "搜索无结果",
        coverUrl: "",
        description: `没有找到关键词"${keyword}"相关的壁纸`
      }];
    }
    
    const result = searchResults.slice(0, count);
    
    // 缓存结果
    Cache.set(cacheKey, result);
    
    return result;
    
  } catch (error) {
    console.error('搜索壁纸失败:', error);
    return [{
      id: "error",
      type: "error",
      title: "搜索失败",
      coverUrl: "",
      description: `搜索"${keyword}"失败: ${error.message}`
    }];
  }
}