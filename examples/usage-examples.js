/**
 * Pexels动态壁纸 ForwardWidget 使用示例
 * 
 * 本文件包含了各种使用场景的示例代码
 * 请根据您的需求修改和使用
 */

// ========================================
// 示例1: 基本的随机壁纸获取
// ========================================

async function example1_BasicRandomWallpaper() {
  try {
    // 获取高清横向的中等时长随机壁纸
    const wallpapers = await getRandomWallpaper({
      quality: 'hd',
      orientation: 'landscape', 
      duration: 'medium'
    });
    
    if (wallpapers.length > 0) {
      const wallpaper = wallpapers[0];
      console.log('获取到随机壁纸:', wallpaper.title);
      console.log('视频URL:', wallpaper.videoUrl);
      console.log('封面URL:', wallpaper.coverUrl);
      
      // 在页面中显示
      displayWallpaper(wallpaper);
    }
  } catch (error) {
    console.error('获取随机壁纸失败:', error);
  }
}

// ========================================
// 示例2: 搜索特定主题的壁纸
// ========================================

async function example2_SearchWallpapers() {
  const queries = ['ocean waves', 'mountain landscape', 'city lights', 'forest trees'];
  
  for (const query of queries) {
    try {
      const wallpapers = await searchWallpaper({
        query: query,
        page: 1,
        per_page: 5
      });
      
      console.log(`搜索"${query}"找到 ${wallpapers.length} 个结果:`);
      
      wallpapers.forEach((wallpaper, index) => {
        console.log(`  ${index + 1}. ${wallpaper.title} - ${wallpaper.duration}s`);
      });
      
    } catch (error) {
      console.error(`搜索"${query}"失败:`, error);
    }
  }
}

// ========================================
// 示例3: 获取不同分类的热门壁纸
// ========================================

async function example3_TrendingWallpapers() {
  const categories = ['popular', 'curated', 'latest'];
  
  for (const category of categories) {
    try {
      const wallpapers = await getTrendingWallpaper({
        category: category
      });
      
      console.log(`${category}分类找到 ${wallpapers.length} 个壁纸:`);
      
      wallpapers.slice(0, 3).forEach((wallpaper, index) => {
        console.log(`  ${index + 1}. ${wallpaper.title} (${wallpaper.width}x${wallpaper.height})`);
      });
      
    } catch (error) {
      console.error(`获取${category}壁纸失败:`, error);
    }
  }
}

// ========================================
// 示例4: 创建壁纸轮播效果
// ========================================

class WallpaperSlideshow {
  constructor(container, interval = 10000) {
    this.container = container;
    this.interval = interval;
    this.currentIndex = 0;
    this.wallpapers = [];
    this.isPlaying = false;
  }
  
  async loadWallpapers(count = 10) {
    try {
      // 获取多个随机壁纸
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(getRandomWallpaper({
          quality: 'hd',
          orientation: 'landscape'
        }));
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const results = await Promise.all(promises);
      this.wallpapers = results.flat().filter(w => w.type === 'video');
      
      console.log(`加载了 ${this.wallpapers.length} 个壁纸`);
      return this.wallpapers.length > 0;
      
    } catch (error) {
      console.error('加载壁纸失败:', error);
      return false;
    }
  }
  
  start() {
    if (this.wallpapers.length === 0) {
      console.error('没有可用的壁纸');
      return;
    }
    
    this.isPlaying = true;
    this.showCurrent();
    
    this.timer = setInterval(() => {
      if (this.isPlaying) {
        this.next();
      }
    }, this.interval);
  }
  
  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.wallpapers.length;
    this.showCurrent();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.wallpapers.length) % this.wallpapers.length;
    this.showCurrent();
  }
  
  showCurrent() {
    const wallpaper = this.wallpapers[this.currentIndex];
    if (wallpaper && this.container) {
      this.displayInContainer(wallpaper);
    }
  }
  
  displayInContainer(wallpaper) {
    // 创建视频元素
    const video = document.createElement('video');
    video.src = wallpaper.videoUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    
    // 清空容器并添加新视频
    this.container.innerHTML = '';
    this.container.appendChild(video);
    
    // 添加信息覆盖层
    const info = document.createElement('div');
    info.innerHTML = `
      <div style="position: absolute; bottom: 20px; left: 20px; color: white; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px;">
        <h3>${wallpaper.title}</h3>
        <p>摄影师: ${wallpaper.photographer}</p>
        <p>时长: ${wallpaper.duration}秒</p>
      </div>
    `;
    this.container.appendChild(info);
  }
}

// ========================================
// 示例5: 智能壁纸推荐系统
// ========================================

class SmartWallpaperRecommender {
  constructor() {
    this.userPreferences = this.loadPreferences();
    this.viewHistory = [];
  }
  
  loadPreferences() {
    const stored = localStorage.getItem('wallpaper_preferences');
    return stored ? JSON.parse(stored) : {
      preferredTags: [],
      preferredDuration: 'medium',
      preferredOrientation: 'landscape',
      likedPhotographers: []
    };
  }
  
  savePreferences() {
    localStorage.setItem('wallpaper_preferences', JSON.stringify(this.userPreferences));
  }
  
  async getRecommendations(count = 5) {
    const recommendations = [];
    
    try {
      // 基于喜欢的标签搜索
      if (this.userPreferences.preferredTags.length > 0) {
        for (const tag of this.userPreferences.preferredTags.slice(0, 3)) {
          const results = await searchWallpaper({
            query: tag,
            page: 1,
            per_page: 3
          });
          recommendations.push(...results);
        }
      }
      
      // 获取热门推荐
      const trending = await getTrendingWallpaper({
        category: 'curated'
      });
      recommendations.push(...trending.slice(0, count));
      
      // 去重并按偏好排序
      const unique = this.removeDuplicates(recommendations);
      return this.sortByPreference(unique).slice(0, count);
      
    } catch (error) {
      console.error('获取推荐失败:', error);
      return [];
    }
  }
  
  removeDuplicates(wallpapers) {
    const seen = new Set();
    return wallpapers.filter(wallpaper => {
      const key = wallpaper.id;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  
  sortByPreference(wallpapers) {
    return wallpapers.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // 标签匹配加分
      a.tags.forEach(tag => {
        if (this.userPreferences.preferredTags.includes(tag)) {
          scoreA += 10;
        }
      });
      
      b.tags.forEach(tag => {
        if (this.userPreferences.preferredTags.includes(tag)) {
          scoreB += 10;
        }
      });
      
      // 摄影师偏好加分
      if (this.userPreferences.likedPhotographers.includes(a.photographer)) {
        scoreA += 5;
      }
      if (this.userPreferences.likedPhotographers.includes(b.photographer)) {
        scoreB += 5;
      }
      
      return scoreB - scoreA;
    });
  }
  
  recordView(wallpaper) {
    this.viewHistory.push({
      wallpaper: wallpaper,
      timestamp: Date.now()
    });
    
    // 只保留最近100个记录
    if (this.viewHistory.length > 100) {
      this.viewHistory = this.viewHistory.slice(-100);
    }
  }
  
  likeWallpaper(wallpaper) {
    // 添加标签到偏好
    wallpaper.tags.forEach(tag => {
      if (!this.userPreferences.preferredTags.includes(tag)) {
        this.userPreferences.preferredTags.push(tag);
      }
    });
    
    // 添加摄影师到偏好
    if (!this.userPreferences.likedPhotographers.includes(wallpaper.photographer)) {
      this.userPreferences.likedPhotographers.push(wallpaper.photographer);
    }
    
    this.savePreferences();
  }
}

// ========================================
// 示例6: 性能监控和缓存管理
// ========================================

class WallpaperPerformanceMonitor {
  constructor() {
    this.stats = {
      apiCalls: 0,
      cacheHits: 0,
      errors: 0,
      totalResponseTime: 0
    };
  }
  
  async monitoredApiCall(apiFunction, ...args) {
    const startTime = Date.now();
    
    try {
      this.stats.apiCalls++;
      const result = await apiFunction(...args);
      
      const responseTime = Date.now() - startTime;
      this.stats.totalResponseTime += responseTime;
      
      console.log(`API调用完成，耗时: ${responseTime}ms`);
      return result;
      
    } catch (error) {
      this.stats.errors++;
      console.error('API调用失败:', error);
      throw error;
    }
  }
  
  getStats() {
    const avgResponseTime = this.stats.apiCalls > 0 ? 
      this.stats.totalResponseTime / this.stats.apiCalls : 0;
      
    return {
      ...this.stats,
      averageResponseTime: avgResponseTime,
      successRate: this.stats.apiCalls > 0 ? 
        (this.stats.apiCalls - this.stats.errors) / this.stats.apiCalls : 0
    };
  }
  
  clearStats() {
    this.stats = {
      apiCalls: 0,
      cacheHits: 0,
      errors: 0,
      totalResponseTime: 0
    };
  }
}

// ========================================
// 工具函数
// ========================================

function displayWallpaper(wallpaper) {
  console.log('显示壁纸:', {
    标题: wallpaper.title,
    描述: wallpaper.description,
    尺寸: `${wallpaper.width}x${wallpaper.height}`,
    时长: `${wallpaper.duration}秒`,
    摄影师: wallpaper.photographer,
    标签: wallpaper.tags.join(', ')
  });
}

function createWallpaperElement(wallpaper) {
  const element = document.createElement('div');
  element.className = 'wallpaper-item';
  element.innerHTML = `
    <video src="${wallpaper.videoUrl}" 
           poster="${wallpaper.coverUrl}"
           controls 
           loop 
           muted>
    </video>
    <div class="wallpaper-info">
      <h3>${wallpaper.title}</h3>
      <p>by ${wallpaper.photographer}</p>
      <span class="duration">${wallpaper.duration}s</span>
    </div>
  `;
  return element;
}

// ========================================
// 使用示例
// ========================================

async function runExamples() {
  console.log('=== Pexels动态壁纸 ForwardWidget 使用示例 ===\n');
  
  // 示例1: 基本随机壁纸
  console.log('1. 获取随机壁纸...');
  await example1_BasicRandomWallpaper();
  
  // 示例2: 搜索壁纸
  console.log('\n2. 搜索不同主题的壁纸...');
  await example2_SearchWallpapers();
  
  // 示例3: 热门壁纸
  console.log('\n3. 获取热门壁纸...');
  await example3_TrendingWallpapers();
  
  // 示例4: 轮播效果
  console.log('\n4. 创建壁纸轮播...');
  const container = document.getElementById('wallpaper-container');
  if (container) {
    const slideshow = new WallpaperSlideshow(container, 5000);
    await slideshow.loadWallpapers(5);
    slideshow.start();
    
    // 10秒后停止
    setTimeout(() => {
      slideshow.stop();
      console.log('轮播已停止');
    }, 10000);
  }
  
  // 示例5: 智能推荐
  console.log('\n5. 获取智能推荐...');
  const recommender = new SmartWallpaperRecommender();
  const recommendations = await recommender.getRecommendations(3);
  console.log(`获取到 ${recommendations.length} 个推荐壁纸`);
  
  // 示例6: 性能监控
  console.log('\n6. 性能监控测试...');
  const monitor = new WallpaperPerformanceMonitor();
  
  await monitor.monitoredApiCall(getRandomWallpaper, { quality: 'hd' });
  await monitor.monitoredApiCall(searchWallpaper, { query: 'ocean', per_page: 5 });
  
  console.log('性能统计:', monitor.getStats());
}

// 页面加载完成后运行示例
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已配置API
    if (getConfigStatus().hasApiKey) {
      runExamples();
    } else {
      console.log('请先配置Pexels API密钥后再运行示例');
    }
  });
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WallpaperSlideshow,
    SmartWallpaperRecommender,
    WallpaperPerformanceMonitor,
    displayWallpaper,
    createWallpaperElement,
    runExamples
  };
}