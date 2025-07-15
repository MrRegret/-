/**
 * 元气壁纸 ForwardWidget
 * 支持随机获取、分类浏览、关键词搜索
 * Created for ForwardWidget development standard compliance
 */

const WIDGET_CONFIG = {
    name: '元气壁纸',
    version: '1.0.0',
    description: '高质量动态和静态壁纸获取工具',
    author: 'FWD Team',
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

// 壁纸API客户端
class YuanqiWallpaperClient {
    constructor() {
        this.cache = new Map();
        this.requestCount = 0;
        this.lastRequestTime = 0;
    }

    // 请求限制控制
    async rateLimit() {
        const now = Date.now();
        if (now - this.lastRequestTime < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.lastRequestTime = now;
        this.requestCount++;
    }

    // 获取缓存键
    getCacheKey(type, params = {}) {
        return `${type}_${JSON.stringify(params)}`;
    }

    // 检查缓存
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < WIDGET_CONFIG.cacheDuration) {
            return cached.data;
        }
        return null;
    }

    // 设置缓存
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        
        // 清理过期缓存
        if (this.cache.size > 100) {
            const now = Date.now();
            for (const [k, v] of this.cache.entries()) {
                if (now - v.timestamp > WIDGET_CONFIG.cacheDuration) {
                    this.cache.delete(k);
                }
            }
        }
    }

    // 解析HTML页面获取壁纸数据
    parseWallpaperData(html) {
        const wallpapers = [];
        
        // 提取图片数据的正则表达式
        const imageRegex = /data-image-id="(\d+)"[\s\S]*?data-detail="([^"]*)"[\s\S]*?data-classify-id="(\d+)"[\s\S]*?data-wallpaper-type="(\d+)"[\s\S]*?src="([^"]*?)"/g;
        
        let match;
        while ((match = imageRegex.exec(html)) !== null) {
            const [, id, title, categoryId, type, imageUrl] = match;
            
            wallpapers.push({
                id: id,
                title: title || `壁纸_${id}`,
                categoryId: categoryId,
                category: WIDGET_CONFIG.categories[categoryId] || '未知',
                type: type === '1' ? '动态' : '静态',
                imageUrl: imageUrl,
                downloadUrl: imageUrl,
                detailUrl: `${WIDGET_CONFIG.baseUrl}/dn/pd${id}.html`,
                timestamp: Date.now()
            });
        }
        
        return wallpapers;
    }

    // 获取首页壁纸
    async getHomePage() {
        await this.rateLimit();
        
        const cacheKey = this.getCacheKey('homepage');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${WIDGET_CONFIG.baseUrl}/dn/d/`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const wallpapers = this.parseWallpaperData(html);
            
            this.setCache(cacheKey, wallpapers);
            return wallpapers;
            
        } catch (error) {
            console.error('获取首页壁纸失败:', error);
            throw new Error(`获取首页壁纸失败: ${error.message}`);
        }
    }

    // 根据分类获取壁纸
    async getByCategory(categoryId) {
        await this.rateLimit();
        
        const cacheKey = this.getCacheKey('category', { categoryId });
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const categoryPath = categoryId === '109' ? 
                `/dtag_109_a14fdede25965c8c0bd3ceb11f364baf/` : 
                `/dn/c${categoryId}d/`;
                
            const response = await fetch(`${WIDGET_CONFIG.baseUrl}${categoryPath}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const wallpapers = this.parseWallpaperData(html);
            
            this.setCache(cacheKey, wallpapers);
            return wallpapers;
            
        } catch (error) {
            console.error(`获取分类${categoryId}壁纸失败:`, error);
            throw new Error(`获取分类壁纸失败: ${error.message}`);
        }
    }

    // 搜索壁纸
    async searchWallpapers(keyword) {
        await this.rateLimit();
        
        const cacheKey = this.getCacheKey('search', { keyword });
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // 尝试搜索，如果网站有搜索API的话
            // 这里先返回相关分类的结果作为搜索结果
            const searchResults = [];
            
            // 根据关键词匹配分类
            const matchingCategories = Object.entries(WIDGET_CONFIG.categories)
                .filter(([id, name]) => name.includes(keyword) || keyword.includes(name));
                
            if (matchingCategories.length > 0) {
                for (const [categoryId] of matchingCategories) {
                    const categoryWallpapers = await this.getByCategory(categoryId);
                    searchResults.push(...categoryWallpapers.slice(0, 6)); // 每个分类取6个
                }
            } else {
                // 如果没有匹配的分类，返回首页的壁纸
                const homeWallpapers = await this.getHomePage();
                searchResults.push(...homeWallpapers.slice(0, 12));
            }
            
            this.setCache(cacheKey, searchResults);
            return searchResults;
            
        } catch (error) {
            console.error('搜索壁纸失败:', error);
            throw new Error(`搜索失败: ${error.message}`);
        }
    }

    // 获取随机壁纸
    async getRandomWallpapers(count = 12) {
        try {
            const homeWallpapers = await this.getHomePage();
            const shuffled = homeWallpapers.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('获取随机壁纸失败:', error);
            throw error;
        }
    }

    // 获取统计信息
    getStats() {
        return {
            requestCount: this.requestCount,
            cacheSize: this.cache.size,
            categories: Object.keys(WIDGET_CONFIG.categories).length
        };
    }
}

// UI组件管理器
class WallpaperUI {
    constructor(client) {
        this.client = client;
        this.currentPage = 'random';
        this.currentCategory = null;
        this.currentKeyword = '';
        this.wallpapers = [];
    }

    // 创建主界面
    createMainInterface() {
        return `
            <div class="wallpaper-widget">
                <header class="widget-header">
                    <h2>🎨 ${WIDGET_CONFIG.name}</h2>
                    <div class="widget-version">v${WIDGET_CONFIG.version}</div>
                </header>

                <nav class="widget-nav">
                    <button class="nav-btn ${this.currentPage === 'random' ? 'active' : ''}" 
                            onclick="wallpaperWidget.switchPage('random')">
                        🎲 随机壁纸
                    </button>
                    <button class="nav-btn ${this.currentPage === 'category' ? 'active' : ''}" 
                            onclick="wallpaperWidget.switchPage('category')">
                        📂 分类浏览
                    </button>
                    <button class="nav-btn ${this.currentPage === 'search' ? 'active' : ''}" 
                            onclick="wallpaperWidget.switchPage('search')">
                        🔍 搜索壁纸
                    </button>
                </nav>

                <main class="widget-content">
                    ${this.createPageContent()}
                </main>

                <footer class="widget-footer">
                    <div class="widget-stats">
                        请求次数: <span id="request-count">0</span> | 
                        缓存项目: <span id="cache-size">0</span>
                    </div>
                </footer>
            </div>
        `;
    }

    // 创建页面内容
    createPageContent() {
        switch (this.currentPage) {
            case 'random':
                return this.createRandomPage();
            case 'category':
                return this.createCategoryPage();
            case 'search':
                return this.createSearchPage();
            default:
                return this.createRandomPage();
        }
    }

    // 创建随机壁纸页面
    createRandomPage() {
        return `
            <div class="random-page">
                <div class="page-header">
                    <h3>随机壁纸</h3>
                    <button class="refresh-btn" onclick="wallpaperWidget.loadRandomWallpapers()">
                        🔄 刷新
                    </button>
                </div>
                <div class="wallpaper-grid" id="wallpaper-grid">
                    <div class="loading">🔄 加载中...</div>
                </div>
            </div>
        `;
    }

    // 创建分类浏览页面
    createCategoryPage() {
        const categories = Object.entries(WIDGET_CONFIG.categories);
        
        return `
            <div class="category-page">
                <div class="page-header">
                    <h3>分类浏览</h3>
                </div>
                
                <div class="category-selector">
                    ${categories.map(([id, name]) => `
                        <button class="category-btn ${this.currentCategory === id ? 'active' : ''}"
                                onclick="wallpaperWidget.selectCategory('${id}')">
                            ${name}
                        </button>
                    `).join('')}
                </div>
                
                <div class="wallpaper-grid" id="wallpaper-grid">
                    ${this.currentCategory ? '<div class="loading">🔄 加载中...</div>' : 
                      '<div class="no-selection">请选择一个分类</div>'}
                </div>
            </div>
        `;
    }

    // 创建搜索页面
    createSearchPage() {
        return `
            <div class="search-page">
                <div class="page-header">
                    <h3>搜索壁纸</h3>
                </div>
                
                <div class="search-controls">
                    <input type="text" 
                           class="search-input" 
                           placeholder="输入关键词搜索壁纸..."
                           value="${this.currentKeyword}"
                           onkeypress="if(event.key==='Enter') wallpaperWidget.searchWallpapers(this.value)">
                    <button class="search-btn" onclick="wallpaperWidget.searchWallpapers(document.querySelector('.search-input').value)">
                        🔍 搜索
                    </button>
                </div>
                
                <div class="wallpaper-grid" id="wallpaper-grid">
                    ${this.currentKeyword ? '<div class="loading">🔄 加载中...</div>' : 
                      '<div class="no-search">输入关键词开始搜索</div>'}
                </div>
            </div>
        `;
    }

    // 创建壁纸网格
    createWallpaperGrid(wallpapers) {
        if (!wallpapers || wallpapers.length === 0) {
            return '<div class="no-results">😔 没有找到壁纸</div>';
        }

        return wallpapers.map(wallpaper => `
            <div class="wallpaper-item" data-id="${wallpaper.id}">
                <div class="wallpaper-image-container">
                    <img src="${wallpaper.imageUrl}" 
                         alt="${wallpaper.title}"
                         class="wallpaper-image"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><text y=\"50\" font-size=\"14\" fill=\"%23999\">加载失败</text></svg>'">
                    <div class="wallpaper-overlay">
                        <div class="wallpaper-type">${wallpaper.type}</div>
                        <div class="wallpaper-category">${wallpaper.category}</div>
                    </div>
                </div>
                <div class="wallpaper-info">
                    <h4 class="wallpaper-title" title="${wallpaper.title}">${wallpaper.title}</h4>
                    <div class="wallpaper-actions">
                        <button class="action-btn download-btn" 
                                onclick="wallpaperWidget.downloadWallpaper('${wallpaper.downloadUrl}', '${wallpaper.title}')">
                            💾 下载
                        </button>
                        <button class="action-btn preview-btn" 
                                onclick="wallpaperWidget.previewWallpaper('${wallpaper.imageUrl}', '${wallpaper.title}')">
                            👁️ 预览
                        </button>
                        <button class="action-btn detail-btn" 
                                onclick="wallpaperWidget.openDetail('${wallpaper.detailUrl}')">
                            🔗 详情
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 更新壁纸网格
    updateWallpaperGrid(wallpapers) {
        const grid = document.getElementById('wallpaper-grid');
        if (grid) {
            grid.innerHTML = this.createWallpaperGrid(wallpapers);
        }
        this.wallpapers = wallpapers;
    }

    // 更新统计信息
    updateStats() {
        const stats = this.client.getStats();
        const requestCountEl = document.getElementById('request-count');
        const cacheSizeEl = document.getElementById('cache-size');
        
        if (requestCountEl) requestCountEl.textContent = stats.requestCount;
        if (cacheSizeEl) cacheSizeEl.textContent = stats.cacheSize;
    }

    // 创建CSS样式
    createStyles() {
        return `
            <style>
                .wallpaper-widget {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    color: #333;
                }

                .widget-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid rgba(255,255,255,0.2);
                }

                .widget-header h2 {
                    margin: 0;
                    color: white;
                    font-size: 24px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .widget-version {
                    color: rgba(255,255,255,0.7);
                    font-size: 12px;
                    margin-top: 5px;
                }

                .widget-nav {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 25px;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .nav-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    backdrop-filter: blur(10px);
                }

                .nav-btn:hover, .nav-btn.active {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .widget-content {
                    background: rgba(255,255,255,0.95);
                    border-radius: 10px;
                    padding: 20px;
                    min-height: 400px;
                    backdrop-filter: blur(10px);
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #eee;
                }

                .page-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 18px;
                }

                .refresh-btn, .search-btn {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .refresh-btn:hover, .search-btn:hover {
                    background: #45a049;
                }

                .category-selector {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                    justify-content: center;
                }

                .category-btn {
                    background: #f0f0f0;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }

                .category-btn:hover, .category-btn.active {
                    background: #667eea;
                    color: white;
                    transform: translateY(-1px);
                }

                .search-controls {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    align-items: center;
                }

                .search-input {
                    flex: 1;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .wallpaper-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .wallpaper-item {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }

                .wallpaper-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }

                .wallpaper-image-container {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }

                .wallpaper-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .wallpaper-item:hover .wallpaper-image {
                    transform: scale(1.05);
                }

                .wallpaper-overlay {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 5px;
                }

                .wallpaper-type, .wallpaper-category {
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .wallpaper-info {
                    padding: 15px;
                }

                .wallpaper-title {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .wallpaper-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .action-btn {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    color: #495057;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 12px;
                    flex: 1;
                    min-width: 70px;
                }

                .action-btn:hover {
                    background: #e9ecef;
                    transform: translateY(-1px);
                }

                .download-btn:hover {
                    background: #28a745;
                    color: white;
                    border-color: #28a745;
                }

                .preview-btn:hover {
                    background: #17a2b8;
                    color: white;
                    border-color: #17a2b8;
                }

                .detail-btn:hover {
                    background: #6f42c1;
                    color: white;
                    border-color: #6f42c1;
                }

                .loading, .no-results, .no-selection, .no-search {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                    font-size: 16px;
                    grid-column: 1 / -1;
                }

                .widget-footer {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 2px solid rgba(255,255,255,0.2);
                    text-align: center;
                }

                .widget-stats {
                    color: rgba(255,255,255,0.8);
                    font-size: 12px;
                }

                .preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }

                .preview-content {
                    max-width: 90%;
                    max-height: 90%;
                    position: relative;
                }

                .preview-image {
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 10px;
                }

                .preview-close {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .wallpaper-widget {
                        padding: 15px;
                    }
                    
                    .widget-nav {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .wallpaper-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 15px;
                    }
                    
                    .search-controls {
                        flex-direction: column;
                    }
                    
                    .wallpaper-actions {
                        justify-content: center;
                    }
                }
            </style>
        `;
    }
}

// 主控制器
class WallpaperWidget {
    constructor() {
        this.client = new YuanqiWallpaperClient();
        this.ui = new WallpaperUI(this.client);
        this.isInitialized = false;
    }

    // 初始化组件
    async initialize(containerId = 'wallpaper-widget-container') {
        try {
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                document.body.appendChild(container);
            }

            // 注入样式
            if (!document.getElementById('wallpaper-widget-styles')) {
                const styleElement = document.createElement('div');
                styleElement.id = 'wallpaper-widget-styles';
                styleElement.innerHTML = this.ui.createStyles();
                document.head.appendChild(styleElement);
            }

            // 创建界面
            container.innerHTML = this.ui.createMainInterface();

            // 加载默认内容
            await this.loadRandomWallpapers();
            
            // 设置定时更新统计信息
            setInterval(() => this.ui.updateStats(), 5000);

            this.isInitialized = true;
            console.log(`✅ ${WIDGET_CONFIG.name} 初始化完成`);
            
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('初始化失败，请刷新页面重试');
        }
    }

    // 切换页面
    async switchPage(page) {
        this.ui.currentPage = page;
        
        // 重新渲染内容区域
        const contentElement = document.querySelector('.widget-content');
        if (contentElement) {
            contentElement.innerHTML = this.ui.createPageContent();
        }

        // 根据页面加载对应内容
        switch (page) {
            case 'random':
                await this.loadRandomWallpapers();
                break;
            case 'category':
                if (this.ui.currentCategory) {
                    await this.loadCategoryWallpapers(this.ui.currentCategory);
                }
                break;
            case 'search':
                if (this.ui.currentKeyword) {
                    await this.performSearch(this.ui.currentKeyword);
                }
                break;
        }
    }

    // 加载随机壁纸
    async loadRandomWallpapers() {
        try {
            this.showLoading();
            const wallpapers = await this.client.getRandomWallpapers(12);
            this.ui.updateWallpaperGrid(wallpapers);
            this.ui.updateStats();
        } catch (error) {
            console.error('加载随机壁纸失败:', error);
            this.showError('加载失败，请稍后重试');
        }
    }

    // 选择分类
    async selectCategory(categoryId) {
        this.ui.currentCategory = categoryId;
        await this.loadCategoryWallpapers(categoryId);
        
        // 更新分类按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="wallpaperWidget.selectCategory('${categoryId}')"]`)?.classList.add('active');
    }

    // 加载分类壁纸
    async loadCategoryWallpapers(categoryId) {
        try {
            this.showLoading();
            const wallpapers = await this.client.getByCategory(categoryId);
            this.ui.updateWallpaperGrid(wallpapers);
            this.ui.updateStats();
        } catch (error) {
            console.error(`加载分类${categoryId}壁纸失败:`, error);
            this.showError('加载分类壁纸失败，请稍后重试');
        }
    }

    // 搜索壁纸
    async searchWallpapers(keyword) {
        if (!keyword || !keyword.trim()) {
            this.showError('请输入搜索关键词');
            return;
        }

        this.ui.currentKeyword = keyword.trim();
        await this.performSearch(this.ui.currentKeyword);
    }

    // 执行搜索
    async performSearch(keyword) {
        try {
            this.showLoading();
            const wallpapers = await this.client.searchWallpapers(keyword);
            this.ui.updateWallpaperGrid(wallpapers);
            this.ui.updateStats();
        } catch (error) {
            console.error('搜索失败:', error);
            this.showError('搜索失败，请稍后重试');
        }
    }

    // 下载壁纸
    async downloadWallpaper(imageUrl, title) {
        try {
            // 创建下载链接
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${title.replace(/[^\w\s-]/g, '')}.jpg`;
            link.target = '_blank';
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('开始下载壁纸');
            
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败，请稍后重试');
        }
    }

    // 预览壁纸
    previewWallpaper(imageUrl, title) {
        // 创建预览模态框
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-content">
                <img src="${imageUrl}" alt="${title}" class="preview-image">
                <button class="preview-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    // 打开详情页
    openDetail(detailUrl) {
        window.open(detailUrl, '_blank');
    }

    // 显示加载状态
    showLoading() {
        const grid = document.getElementById('wallpaper-grid');
        if (grid) {
            grid.innerHTML = '<div class="loading">🔄 加载中...</div>';
        }
    }

    // 显示错误信息
    showError(message) {
        const grid = document.getElementById('wallpaper-grid');
        if (grid) {
            grid.innerHTML = `<div class="no-results">❌ ${message}</div>`;
        }
    }

    // 显示成功信息
    showSuccess(message) {
        // 可以在这里添加成功提示的显示逻辑
        console.log(`✅ ${message}`);
    }

    // 获取组件状态
    getStatus() {
        return {
            initialized: this.isInitialized,
            currentPage: this.ui.currentPage,
            currentCategory: this.ui.currentCategory,
            currentKeyword: this.ui.currentKeyword,
            wallpaperCount: this.ui.wallpapers.length,
            stats: this.client.getStats()
        };
    }
}

// 全局变量和初始化
let wallpaperWidget = null;

// 自动初始化
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWallpaperWidget);
    } else {
        initializeWallpaperWidget();
    }
}

// 初始化函数
async function initializeWallpaperWidget() {
    try {
        wallpaperWidget = new WallpaperWidget();
        await wallpaperWidget.initialize();
    } catch (error) {
        console.error('元气壁纸组件初始化失败:', error);
    }
}

// 模块导出（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WallpaperWidget,
        YuanqiWallpaperClient,
        WallpaperUI,
        WIDGET_CONFIG
    };
}

// ForwardWidget 模块定义
if (typeof window !== 'undefined') {
    window.YuanqiWallpaperWidget = {
        WallpaperWidget,
        YuanqiWallpaperClient,
        WallpaperUI,
        WIDGET_CONFIG,
        initialize: initializeWallpaperWidget
    };
}