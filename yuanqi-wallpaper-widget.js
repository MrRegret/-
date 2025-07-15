WidgetMetadata = {
  id: "yuanqi_wallpaper",
  title: "元气壁纸",
  description: "元气壁纸 - 随机获取和分类浏览高质量壁纸",
  author: "Assistant",
  site: "https://mbizhi.cheetahfun.com/",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      name: "random_wallpaper",
      title: "随机壁纸",
      description: "随机获取壁纸",
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
            }
          ],
          value: "6",
        },
      ]
    },
    {
      name: "category_wallpaper", 
      title: "分类壁纸",
      description: "按分类获取壁纸",
      requiresWebView: false,
      functionName: "getCategoryWallpapers",
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              value: "4k",
              title: "4K壁纸",
            },
            {
              value: "landscape", 
              title: "风景壁纸",
            },
            {
              value: "anime",
              title: "动漫壁纸",
            },
            {
              value: "beauty",
              title: "美女壁纸", 
            },
            {
              value: "animals",
              title: "动物壁纸",
            },
            {
              value: "games",
              title: "游戏壁纸",
            },
            {
              value: "fresh",
              title: "清新壁纸",
            },
            {
              value: "others",
              title: "其他壁纸",
            }
          ],
          value: "4k",
        },
      ]
    },
    {
      name: "search_wallpaper",
      title: "搜索壁纸", 
      description: "根据关键词搜索壁纸",
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
              value: "清新",
              title: "清新",
            }
          ],
          value: "风景",
        },
      ]
    }
  ],
};

// 缓存对象
const wallpaperCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟

// 工具函数：延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 工具函数：获取网页HTML
async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('获取HTML失败:', error);
    return null;
  }
}

// 工具函数：解析壁纸数据
function parseWallpapers(html) {
  const wallpapers = [];
  
  // 使用正则表达式提取图片信息
  const imgRegex = /<img[^>]+class="item-image"[^>]*>/g;
  const imgMatches = html.match(imgRegex) || [];
  
  imgMatches.forEach((imgTag, index) => {
    const srcMatch = imgTag.match(/src="([^"]+)"/);
    const altMatch = imgTag.match(/alt="([^"]+)"/);
    
    if (srcMatch) {
      let imageUrl = srcMatch[1];
      
      // 处理相对路径
      if (imageUrl.startsWith('/')) {
        imageUrl = 'https://mbizhi.cheetahfun.com' + imageUrl;
      }
      
      wallpapers.push({
        id: `yuanqi_${Date.now()}_${index}`,
        type: "image",
        title: altMatch ? altMatch[1] : `元气壁纸 ${index + 1}`,
        coverUrl: imageUrl,
        imageUrl: imageUrl
      });
    }
  });
  
  return wallpapers;
}

// 获取分类页面的壁纸
async function fetchCategoryWallpapers(category) {
  const cacheKey = `category_${category}`;
  
  // 检查缓存
  if (wallpaperCache.has(cacheKey)) {
    const cached = wallpaperCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  const categoryMap = {
    '4k': '4k',
    'landscape': 'fengjing', 
    'anime': 'dongman',
    'beauty': 'meinv',
    'animals': 'dongwu',
    'games': 'youxi',
    'fresh': 'qingxin',
    'others': 'qita'
  };
  
  const categoryPath = categoryMap[category] || '4k';
  const url = `https://mbizhi.cheetahfun.com/dn/d/${categoryPath}/`;
  
  const html = await fetchHTML(url);
  if (!html) {
    return [];
  }
  
  const wallpapers = parseWallpapers(html);
  
  // 缓存结果
  wallpaperCache.set(cacheKey, {
    data: wallpapers,
    timestamp: Date.now()
  });
  
  return wallpapers;
}

// 随机获取壁纸
async function getRandomWallpapers(params = {}) {
  const count = parseInt(params.count ?? 6);
  const categories = ['4k', 'landscape', 'anime', 'beauty', 'animals', 'games', 'fresh', 'others'];
  const allWallpapers = [];
  
  try {
    // 从多个分类随机获取壁纸
    const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const category of selectedCategories) {
      const wallpapers = await fetchCategoryWallpapers(category);
      allWallpapers.push(...wallpapers);
      await delay(1000); // 限制请求频率
    }
    
    // 随机打乱并返回指定数量
    const shuffled = allWallpapers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
    
  } catch (error) {
    console.error('获取随机壁纸失败:', error);
    return [];
  }
}

// 获取分类壁纸
async function getCategoryWallpapers(params = {}) {
  const category = params.category ?? '4k';
  
  try {
    const wallpapers = await fetchCategoryWallpapers(category);
    return wallpapers.slice(0, 12); // 返回前12张
    
  } catch (error) {
    console.error('获取分类壁纸失败:', error);
    return [];
  }
}

// 搜索壁纸
async function searchWallpapers(params = {}) {
  const keyword = params.keyword ?? '风景';
  
  try {
    // 根据关键词映射到对应分类
    const keywordMap = {
      '风景': 'landscape',
      '动漫': 'anime', 
      '美女': 'beauty',
      '动物': 'animals',
      '游戏': 'games',
      '清新': 'fresh'
    };
    
    const category = keywordMap[keyword] || 'landscape';
    const wallpapers = await fetchCategoryWallpapers(category);
    
    // 过滤包含关键词的壁纸
    const filtered = wallpapers.filter(wallpaper => 
      wallpaper.title.includes(keyword) || 
      wallpaper.title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return filtered.length > 0 ? filtered.slice(0, 10) : wallpapers.slice(0, 10);
    
  } catch (error) {
    console.error('搜索壁纸失败:', error);
    return [];
  }
}