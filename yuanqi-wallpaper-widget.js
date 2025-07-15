WidgetMetadata = {
  id: "yuanqi_video_wallpaper",
  title: "元气动态壁纸",
  description: "专业动态壁纸获取工具 - 高质量视频壁纸随机获取和分类浏览",
  author: "Assistant",
  site: "https://mbizhi.cheetahfun.com/",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      name: "random_video_wallpaper",
      title: "随机动态壁纸",
      description: "随机获取高质量动态壁纸",
      requiresWebView: false,
      functionName: "getRandomVideoWallpapers",
      params: [
        {
          name: "count",
          title: "数量",
          type: "enumeration",
          enumOptions: [
            {
              value: "6",
              title: "6个",
            },
            {
              value: "12",
              title: "12个",
            },
            {
              value: "18",
              title: "18个",
            }
          ],
          value: "6",
        },
        {
          name: "quality",
          title: "视频质量",
          type: "enumeration",
          enumOptions: [
            {
              value: "preview",
              title: "预览版",
            },
            {
              value: "standard",
              title: "标准版",
            },
            {
              value: "hd",
              title: "高清版",
            }
          ],
          value: "standard",
        }
      ]
    },
    {
      name: "category_video_wallpaper", 
      title: "分类动态壁纸",
      description: "按分类获取动态壁纸",
      requiresWebView: false,
      functionName: "getCategoryVideoWallpapers",
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              value: "dongman",
              title: "动漫动态",
            },
            {
              value: "fengjing", 
              title: "风景动态",
            },
            {
              value: "meinv",
              title: "美女动态",
            },
            {
              value: "dongwu",
              title: "动物动态",
            },
            {
              value: "youxi",
              title: "游戏动态",
            },
            {
              value: "qingxin",
              title: "清新动态",
            }
          ],
          value: "dongman",
        },
        {
          name: "quality",
          title: "视频质量",
          type: "enumeration",
          enumOptions: [
            {
              value: "preview",
              title: "预览版",
            },
            {
              value: "standard",
              title: "标准版",
            },
            {
              value: "hd",
              title: "高清版",
            }
          ],
          value: "standard",
        }
      ]
    },
    {
      name: "search_video_wallpaper",
      title: "搜索动态壁纸", 
      description: "根据关键词搜索动态壁纸",
      requiresWebView: false,
      functionName: "searchVideoWallpapers",
      params: [
        {
          name: "keyword",
          title: "关键词",
          type: "enumeration",
          enumOptions: [
            {
              value: "动漫",
              title: "动漫",
            },
            {
              value: "风景",
              title: "风景",
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
          value: "动漫",
        },
        {
          name: "quality",
          title: "视频质量",
          type: "enumeration",
          enumOptions: [
            {
              value: "preview",
              title: "预览版",
            },
            {
              value: "standard",
              title: "标准版",
            },
            {
              value: "hd",
              title: "高清版",
            }
          ],
          value: "standard",
        }
      ]
    }
  ],
};

// 缓存对象
const videoWallpaperCache = new Map();
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

// 解析动态壁纸数据（专门针对视频壁纸）
function parseVideoWallpapers(html) {
  const wallpapers = [];
  
  try {
    // 查找所有动态壁纸（data-wallpaper-type="1"）
    const videoRegex = /<a[^>]*data-wallpaper-type="1"[^>]*data-image-id="(\d+)"[^>]*title="([^"]*)"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>/g;
    
    let match;
    while ((match = videoRegex.exec(html)) !== null) {
      const [, imageId, title, coverUrl] = match;
      
      // 生成视频URL（基于图像URL模式）
      const videoBaseName = coverUrl.match(/\/([^\/]+)\.jpg$/)?.[1];
      if (videoBaseName) {
        const baseVideoUrl = `https://img-baofun.zhhainiao.com/pcwallpaper_ugc/live/${videoBaseName}`;
        const previewVideoUrl = `https://img-baofun.zhhainiao.com/pcwallpaper_ugc/preview/${videoBaseName}_preview.mp4`;
        
        wallpapers.push({
          id: `yuanqi_video_${imageId}`,
          type: "video",
          title: title || `动态壁纸 ${imageId}`,
          coverUrl: coverUrl,
          videoUrl: `${baseVideoUrl}.mp4`,
          previewVideoUrl: previewVideoUrl,
          detailUrl: `https://mbizhi.cheetahfun.com/dn/pd${imageId}.html`,
          source: '元气壁纸'
        });
      }
    }
  } catch (error) {
    console.error('解析视频壁纸数据失败:', error);
  }
  
  return wallpapers;
}

// 获取详细的视频信息（包含多分辨率）
async function getDetailedVideoInfo(imageId) {
  const cacheKey = `detail_${imageId}`;
  
  // 检查缓存
  if (videoWallpaperCache.has(cacheKey)) {
    const cached = videoWallpaperCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  try {
    const detailUrl = `https://mbizhi.cheetahfun.com/dn/pd${imageId}.html`;
    const html = await fetchHTML(detailUrl);
    
    if (!html) return null;
    
    // 从页面脚本中提取视频信息
    const scriptMatch = html.match(/window\.__NUXT__=\(function[^}]+\{[^}]+videoData:\{([^}]+\})/);
    if (scriptMatch) {
      // 提取视频URL（更详细的解析）
      const videoMatch = html.match(/video:"([^"]*\.mp4)"/);
      const video2kMatch = html.match(/video_2k:"([^"]*\.mp4)"/);
      const video1920Match = html.match(/video_1920:"([^"]*\.mp4)"/);
      const previewMatch = html.match(/preview_video:"([^"]*_preview\.mp4)"/);
      const titleMatch = html.match(/wname:"([^"]*)"/);
      const coverMatch = html.match(/preview_jpg:"([^"]*)"/);
      
      const videoInfo = {
        id: `yuanqi_video_${imageId}`,
        type: "video",
        title: titleMatch ? titleMatch[1] : `动态壁纸 ${imageId}`,
        coverUrl: coverMatch ? coverMatch[1] : '',
        videoUrl: videoMatch ? videoMatch[1] : null,
        video2kUrl: video2kMatch ? video2kMatch[1] : null,
        video1920Url: video1920Match ? video1920Match[1] : null,
        previewVideoUrl: previewMatch ? previewMatch[1] : null,
        detailUrl: detailUrl,
        source: '元气壁纸'
      };
      
      // 缓存结果
      videoWallpaperCache.set(cacheKey, {
        data: videoInfo,
        timestamp: Date.now()
      });
      
      return videoInfo;
    }
  } catch (error) {
    console.error(`获取视频详情失败 ${imageId}:`, error);
  }
  
  return null;
}

// 根据质量选择视频URL
function selectVideoUrl(videoInfo, quality) {
  if (!videoInfo) return null;
  
  switch (quality) {
    case 'preview':
      return {
        ...videoInfo,
        videoUrl: videoInfo.previewVideoUrl || videoInfo.videoUrl
      };
    case 'hd':
      return {
        ...videoInfo,
        videoUrl: videoInfo.video2kUrl || videoInfo.video1920Url || videoInfo.videoUrl
      };
    case 'standard':
    default:
      return {
        ...videoInfo,
        videoUrl: videoInfo.video1920Url || videoInfo.videoUrl
      };
  }
}

// 获取分类页面的动态壁纸
async function fetchCategoryVideoWallpapers(category) {
  const cacheKey = `video_category_${category}`;
  
  // 检查缓存
  if (videoWallpaperCache.has(cacheKey)) {
    const cached = videoWallpaperCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  const categoryMap = {
    'dongman': 'c2d',
    'fengjing': 'c1d', 
    'meinv': 'c3d',
    'dongwu': 'c6d',
    'youxi': 'c4d',
    'qingxin': 'c10d'
  };
  
  const categoryPath = categoryMap[category] || 'c2d';
  const url = `https://mbizhi.cheetahfun.com/dn/${categoryPath}/`;
  
  const html = await fetchHTML(url);
  if (!html) {
    return [];
  }
  
  const wallpapers = parseVideoWallpapers(html);
  
  // 缓存结果
  videoWallpaperCache.set(cacheKey, {
    data: wallpapers,
    timestamp: Date.now()
  });
  
  return wallpapers;
}

// 随机获取动态壁纸
async function getRandomVideoWallpapers(params = {}) {
  const count = parseInt(params.count ?? 6);
  const quality = params.quality ?? 'standard';
  const categories = ['dongman', 'fengjing', 'meinv', 'dongwu', 'youxi', 'qingxin'];
  const allWallpapers = [];
  
  try {
    // 从多个分类随机获取动态壁纸
    const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const category of selectedCategories) {
      const wallpapers = await fetchCategoryVideoWallpapers(category);
      // 只取动态壁纸
      const videoWallpapers = wallpapers.filter(w => w.type === 'video');
      allWallpapers.push(...videoWallpapers);
      await delay(1000); // 限制请求频率
    }
    
    // 随机打乱并获取详细信息
    const shuffled = allWallpapers.sort(() => 0.5 - Math.random()).slice(0, count);
    const detailedWallpapers = [];
    
    for (const wallpaper of shuffled) {
      const imageId = wallpaper.id.replace('yuanqi_video_', '');
      const detailed = await getDetailedVideoInfo(imageId);
      if (detailed) {
        detailedWallpapers.push(selectVideoUrl(detailed, quality));
      }
      await delay(500); // 控制请求频率
    }
    
    return detailedWallpapers.filter(w => w && w.videoUrl);
    
  } catch (error) {
    console.error('获取随机动态壁纸失败:', error);
    return [];
  }
}

// 获取分类动态壁纸
async function getCategoryVideoWallpapers(params = {}) {
  const category = params.category ?? 'dongman';
  const quality = params.quality ?? 'standard';
  
  try {
    const wallpapers = await fetchCategoryVideoWallpapers(category);
    const videoWallpapers = wallpapers.filter(w => w.type === 'video').slice(0, 8);
    const detailedWallpapers = [];
    
    for (const wallpaper of videoWallpapers) {
      const imageId = wallpaper.id.replace('yuanqi_video_', '');
      const detailed = await getDetailedVideoInfo(imageId);
      if (detailed) {
        detailedWallpapers.push(selectVideoUrl(detailed, quality));
      }
      await delay(500);
    }
    
    return detailedWallpapers.filter(w => w && w.videoUrl);
    
  } catch (error) {
    console.error('获取分类动态壁纸失败:', error);
    return [];
  }
}

// 搜索动态壁纸
async function searchVideoWallpapers(params = {}) {
  const keyword = params.keyword ?? '动漫';
  const quality = params.quality ?? 'standard';
  
  try {
    // 根据关键词映射到对应分类
    const keywordMap = {
      '动漫': 'dongman',
      '风景': 'fengjing', 
      '美女': 'meinv',
      '动物': 'dongwu',
      '游戏': 'youxi',
      '清新': 'qingxin'
    };
    
    const category = keywordMap[keyword] || 'dongman';
    const wallpapers = await fetchCategoryVideoWallpapers(category);
    
    // 按关键词过滤
    const filtered = wallpapers.filter(wallpaper => 
      wallpaper.title.includes(keyword) || 
      wallpaper.title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const targetWallpapers = filtered.length > 0 ? filtered.slice(0, 6) : wallpapers.slice(0, 6);
    const detailedWallpapers = [];
    
    for (const wallpaper of targetWallpapers) {
      const imageId = wallpaper.id.replace('yuanqi_video_', '');
      const detailed = await getDetailedVideoInfo(imageId);
      if (detailed) {
        detailedWallpapers.push(selectVideoUrl(detailed, quality));
      }
      await delay(500);
    }
    
    return detailedWallpapers.filter(w => w && w.videoUrl);
    
  } catch (error) {
    console.error('搜索动态壁纸失败:', error);
    return [];
  }
}