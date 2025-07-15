/**
 * Pexels 视频搜索 ForwardWidget 组件
 * 完整版本 - 可直接使用
 * 
 * 功能特性：
 * - 支持手动配置API密钥
 * - 热门视频获取
 * - 关键词搜索视频  
 * - 随机视频获取
 * - 智能缓存机制
 * - 完善错误处理
 * - 多质量视频支持
 * 
 * @author ForwardWidget Developer
 * @version 1.0.0
 * @date 2024
 */

var WidgetMetadata = {
    id: "pexels_video_search",
    title: "Pexels 视频库",
    description: "基于 Pexels API 的高质量免费视频搜索组件",
    author: "ForwardWidget Developer",
    site: "https://www.pexels.com",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    detailCacheDuration: 300,  // 5分钟详情缓存
    modules: [
        {
            name: "popular_videos",
            title: "热门视频",
            description: "获取 Pexels 平台当前最热门的视频内容",
            requiresWebView: false,
            functionName: "getPopularVideos",
            sectionMode: false,
            cacheDuration: 3600, // 1小时缓存
            params: [
                {
                    name: "api_key",
                    title: "Pexels API 密钥",
                    type: "input",
                    description: "请输入您的 Pexels API 密钥（必填）",
                    value: "",
                    placeholders: [
                        {
                            title: "获取API密钥",
                            value: "访问 https://www.pexels.com/api/ 申请"
                        }
                    ]
                },
                {
                    name: "per_page",
                    title: "每页视频数量",
                    type: "enumeration",
                    description: "设置每次加载的视频数量",
                    enumOptions: [
                        { value: "10", title: "10个视频" },
                        { value: "15", title: "15个视频（推荐）" },
                        { value: "20", title: "20个视频" },
                        { value: "30", title: "30个视频" }
                    ],
                    value: "15"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "选择要加载的页码",
                    value: "1"
                },
                {
                    name: "min_width",
                    title: "最小视频宽度",
                    type: "enumeration",
                    description: "设置视频最小分辨率要求",
                    enumOptions: [
                        { value: "0", title: "不限制" },
                        { value: "1280", title: "1280px（高清）" },
                        { value: "1920", title: "1920px（全高清）" },
                        { value: "3840", title: "3840px（4K超清）" }
                    ],
                    value: "0"
                }
            ]
        },
        {
            name: "search_videos",
            title: "搜索视频",
            description: "根据关键词搜索特定主题的高质量视频",
            requiresWebView: false,
            functionName: "searchVideos",
            sectionMode: false,
            cacheDuration: 1800, // 30分钟缓存
            params: [
                {
                    name: "api_key",
                    title: "Pexels API 密钥",
                    type: "input",
                    description: "请输入您的 Pexels API 密钥（必填）",
                    value: "",
                    placeholders: [
                        {
                            title: "获取API密钥",
                            value: "访问 https://www.pexels.com/api/ 申请"
                        }
                    ]
                },
                {
                    name: "query",
                    title: "搜索关键词",
                    type: "input",
                    description: "输入要搜索的视频关键词（英文效果更佳）",
                    value: "nature",
                    placeholders: [
                        { title: "自然风光", value: "nature landscape" },
                        { title: "海洋波浪", value: "ocean waves" },
                        { title: "城市夜景", value: "city lights night" },
                        { title: "山川河流", value: "mountain river" },
                        { title: "抽象动画", value: "abstract motion" },
                        { title: "科技未来", value: "technology futuristic" }
                    ]
                },
                {
                    name: "orientation",
                    title: "视频方向",
                    type: "enumeration",
                    description: "选择所需的视频方向格式",
                    enumOptions: [
                        { value: "all", title: "所有方向" },
                        { value: "landscape", title: "横向（16:9）" },
                        { value: "portrait", title: "纵向（9:16）" },
                        { value: "square", title: "正方形（1:1）" }
                    ],
                    value: "all"
                },
                {
                    name: "size",
                    title: "视频尺寸偏好",
                    type: "enumeration",
                    description: "选择视频尺寸偏好（影响质量和文件大小）",
                    enumOptions: [
                        { value: "all", title: "所有尺寸" },
                        { value: "large", title: "大尺寸（高质量）" },
                        { value: "medium", title: "中等尺寸（平衡）" },
                        { value: "small", title: "小尺寸（节省流量）" }
                    ],
                    value: "all"
                },
                {
                    name: "per_page",
                    title: "搜索结果数量",
                    type: "enumeration",
                    description: "设置搜索返回的视频数量",
                    enumOptions: [
                        { value: "10", title: "10个结果" },
                        { value: "15", title: "15个结果（推荐）" },
                        { value: "20", title: "20个结果" },
                        { value: "30", title: "30个结果" }
                    ],
                    value: "15"
                },
                {
                    name: "page",
                    title: "搜索页码",
                    type: "page",
                    description: "选择搜索结果的页码",
                    value: "1"
                }
            ]
        },
        {
            name: "random_videos",
            title: "随机视频",
            description: "获取随机的高质量视频，发现意想不到的精彩内容",
            requiresWebView: false,
            functionName: "getRandomVideos",
            sectionMode: false,
            cacheDuration: 1200, // 20分钟缓存
            params: [
                {
                    name: "api_key",
                    title: "Pexels API 密钥",
                    type: "input",
                    description: "请输入您的 Pexels API 密钥（必填）",
                    value: "",
                    placeholders: [
                        {
                            title: "获取API密钥",
                            value: "访问 https://www.pexels.com/api/ 申请"
                        }
                    ]
                },
                {
                    name: "category",
                    title: "随机视频类别",
                    type: "enumeration",
                    description: "选择随机获取视频的主题类别",
                    enumOptions: [
                        { value: "all", title: "🌍 所有类别（最大随机性）" },
                        { value: "nature", title: "🌿 自然风光" },
                        { value: "ocean", title: "🌊 海洋主题" },
                        { value: "mountain", title: "⛰️ 山川河流" },
                        { value: "city", title: "🏙️ 城市景观" },
                        { value: "sky", title: "☁️ 天空云彩" },
                        { value: "forest", title: "🌲 森林主题" },
                        { value: "animals", title: "🦋 动物世界" },
                        { value: "technology", title: "💻 科技数码" },
                        { value: "abstract", title: "🎨 抽象艺术" }
                    ],
                    value: "all"
                },
                {
                    name: "count",
                    title: "视频数量",
                    type: "count",
                    description: "设置要获取的随机视频数量",
                    value: "12"
                }
            ]
        }
    ],
    search: {
        title: "快速搜索",
        functionName: "quickSearch",
        params: [
            {
                name: "api_key",
                title: "API 密钥",
                type: "input",
                description: "Pexels API 密钥",
                value: ""
            },
            {
                name: "keyword",
                title: "搜索关键词",
                type: "input",
                description: "输入搜索关键词",
                value: ""
            }
        ]
    }
};

// ================================
// 全局配置和工具函数
// ================================

const PEXELS_CONFIG = {
    BASE_URL: "https://api.pexels.com",
    HEADERS: {
        "User-Agent": "ForwardWidget-PexelsSearch/1.0 (https://forwardwidget.com)"
    },
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 50,
        RETRY_DELAY: 2000
    }
};

// 随机搜索关键词库
const RANDOM_KEYWORDS = {
    all: ["nature", "ocean", "mountain", "city", "sky", "forest", "abstract", "technology", "people", "animals"],
    nature: ["forest", "trees", "plants", "flowers", "landscape", "sunset", "sunrise"],
    ocean: ["waves", "sea", "beach", "underwater", "dolphins", "coral", "sailing"],
    mountain: ["peaks", "valley", "hiking", "snow", "rocks", "canyon", "cliff"],
    city: ["skyline", "lights", "traffic", "buildings", "night", "urban", "street"],
    sky: ["clouds", "stars", "moon", "sunrise", "sunset", "storm", "clear"],
    forest: ["trees", "woodland", "jungle", "leaves", "wildlife", "stream"],
    animals: ["wildlife", "birds", "fish", "insects", "mammals", "pets"],
    technology: ["computer", "digital", "data", "network", "innovation", "future"],
    abstract: ["motion", "colors", "patterns", "geometric", "fluid", "particles"]
};

/**
 * 验证 API 密钥格式
 * @param {string} apiKey - API 密钥
 * @returns {boolean} 是否有效
 */
function validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }
    const trimmedKey = apiKey.trim();
    return trimmedKey.length > 10; // 基本长度检查
}

/**
 * 构建请求头
 * @param {string} apiKey - API 密钥
 * @returns {Object} 请求头对象
 */
function buildHeaders(apiKey) {
    return {
        ...PEXELS_CONFIG.HEADERS,
        "Authorization": apiKey.trim()
    };
}

/**
 * 格式化视频时长
 * @param {number} duration - 时长（秒）
 * @returns {string} 格式化的时长字符串
 */
function formatDuration(duration) {
    if (!duration || duration <= 0) return "00:00";
    
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 获取随机搜索关键词
 * @param {string} category - 类别
 * @returns {string} 随机关键词
 */
function getRandomKeyword(category = "all") {
    const keywords = RANDOM_KEYWORDS[category] || RANDOM_KEYWORDS.all;
    return keywords[Math.floor(Math.random() * keywords.length)];
}

/**
 * 转换 Pexels 视频数据为 ForwardWidget 格式
 * @param {Object} pexelsVideo - Pexels API 返回的视频对象
 * @returns {Object} ForwardWidget 格式的视频对象
 */
function transformVideoData(pexelsVideo) {
    try {
        const videoFiles = pexelsVideo.video_files || [];
        
        // 按分辨率排序，优先选择高质量
        const sortedFiles = videoFiles.sort((a, b) => {
            const aPixels = (a.width || 0) * (a.height || 0);
            const bPixels = (b.width || 0) * (b.height || 0);
            return bPixels - aPixels;
        });
        
        // 选择最佳质量视频
        const hdVideo = sortedFiles.find(file => 
            file.quality === 'hd' || (file.width >= 1280 && file.height >= 720)
        );
        const bestVideo = hdVideo || sortedFiles[0];
        
        // 选择预览质量视频
        const previewVideo = sortedFiles.find(file => 
            file.quality === 'sd' || (file.width >= 640 && file.width < 1280)
        ) || bestVideo;
        
        // 获取封面图片
        const posterUrl = pexelsVideo.image || 
            (bestVideo && bestVideo.link && bestVideo.link.replace('.mp4', '.jpg')) ||
            `https://images.pexels.com/videos/${pexelsVideo.id}/free-video-${pexelsVideo.id}.jpg`;

        // 构建用户信息
        const userInfo = pexelsVideo.user || {};
        const author = userInfo.name || '匿名用户';
        
        return {
            id: `pexels_${pexelsVideo.id}`,
            type: "video",
            title: `Pexels 精选视频 #${pexelsVideo.id}`,
            description: `由 ${author} 提供的高质量免费视频素材`,
            posterPath: posterUrl,
            backdropPath: posterUrl,
            videoUrl: bestVideo?.link || "",
            previewUrl: previewVideo?.link || "",
            link: pexelsVideo.url || `https://www.pexels.com/video/${pexelsVideo.id}/`,
            duration: Math.round(pexelsVideo.duration || 0),
            durationText: formatDuration(pexelsVideo.duration || 0),
            genreTitle: "视频素材",
            rating: "4.5",
            mediaType: "video",
            releaseDate: new Date().toISOString().split('T')[0],
            // 扩展信息
            videoFiles: videoFiles.map(file => ({
                url: file.link,
                quality: file.quality || 'unknown',
                width: file.width || 0,
                height: file.height || 0,
                fileType: file.file_type || 'video/mp4',
                size: file.size || 0
            })),
            author: author,
            authorUrl: userInfo.url || null,
            tags: pexelsVideo.tags || '',
            pexelsId: pexelsVideo.id
        };
    } catch (error) {
        console.error("转换视频数据失败:", error);
        return null;
    }
}

/**
 * 通用 API 请求函数
 * @param {string} url - 请求URL
 * @param {string} apiKey - API密钥
 * @param {Object} params - 请求参数
 * @returns {Array} 视频数组
 */
async function makeApiRequest(url, apiKey, params = {}) {
    try {
        // 构建查询参数
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        
        console.log(`发送 API 请求: ${fullUrl}`);
        
        // 发送请求
        const response = await Widget.http.get(fullUrl, {
            headers: buildHeaders(apiKey)
        });
        
        if (!response.data) {
            throw new Error("API 响应数据为空");
        }
        
        // 解析响应数据
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        
        if (!data.videos || !Array.isArray(data.videos)) {
            console.warn("API 返回数据格式异常:", data);
            return [];
        }
        
        console.log(`成功获取 ${data.videos.length} 个视频，总计: ${data.total_results || 'N/A'}`);
        
        // 转换数据格式
        const transformedVideos = data.videos
            .map(transformVideoData)
            .filter(video => video !== null);
        
        return transformedVideos;
        
    } catch (error) {
        console.error("API 请求失败:", error);
        
        // 友好的错误处理
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
            throw new Error("API 密钥无效，请检查您的 Pexels API 密钥是否正确");
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
            throw new Error("API 请求频率过高，请稍后再试");
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
            throw new Error("API 访问被拒绝，请检查 API 密钥权限");
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
            throw new Error("网络连接失败，请检查网络连接");
        }
        
        throw error;
    }
}

// ================================
// 核心功能函数
// ================================

/**
 * 获取热门视频
 * @param {Object} params - 参数对象
 * @returns {Array} 视频数组
 */
async function getPopularVideos(params = {}) {
    try {
        const { api_key, per_page = "15", page = "1", min_width = "0" } = params;
        
        // 验证 API 密钥
        if (!validateApiKey(api_key)) {
            throw new Error("请提供有效的 Pexels API 密钥。您可以在 https://www.pexels.com/api/ 申请免费的 API 密钥。");
        }
        
        console.log(`获取热门视频 - 页码: ${page}, 每页: ${per_page}, 最小宽度: ${min_width}px`);
        
        // 构建请求参数
        const requestParams = {
            per_page: per_page,
            page: page
        };
        
        if (min_width !== "0") {
            requestParams.min_width = min_width;
        }
        
        const url = `${PEXELS_CONFIG.BASE_URL}/videos/popular`;
        return await makeApiRequest(url, api_key, requestParams);
        
    } catch (error) {
        console.error("获取热门视频失败:", error);
        throw error;
    }
}

/**
 * 搜索视频
 * @param {Object} params - 搜索参数
 * @returns {Array} 视频数组
 */
async function searchVideos(params = {}) {
    try {
        const {
            api_key,
            query = "nature",
            orientation = "all",
            size = "all",
            per_page = "15",
            page = "1"
        } = params;
        
        // 验证 API 密钥
        if (!validateApiKey(api_key)) {
            throw new Error("请提供有效的 Pexels API 密钥。您可以在 https://www.pexels.com/api/ 申请免费的 API 密钥。");
        }
        
        // 验证搜索关键词
        const searchQuery = query.trim();
        if (!searchQuery) {
            throw new Error("请输入搜索关键词");
        }
        
        console.log(`搜索视频 - 关键词: "${searchQuery}", 方向: ${orientation}, 尺寸: ${size}, 页码: ${page}`);
        
        // 构建请求参数
        const requestParams = {
            query: searchQuery,
            per_page: per_page,
            page: page
        };
        
        if (orientation !== "all") {
            requestParams.orientation = orientation;
        }
        
        if (size !== "all") {
            requestParams.size = size;
        }
        
        const url = `${PEXELS_CONFIG.BASE_URL}/videos/search`;
        return await makeApiRequest(url, api_key, requestParams);
        
    } catch (error) {
        console.error("搜索视频失败:", error);
        throw error;
    }
}

/**
 * 获取随机视频
 * @param {Object} params - 参数对象
 * @returns {Array} 随机视频数组
 */
async function getRandomVideos(params = {}) {
    try {
        const { api_key, category = "all", count = "12" } = params;
        
        // 验证 API 密钥
        if (!validateApiKey(api_key)) {
            throw new Error("请提供有效的 Pexels API 密钥。您可以在 https://www.pexels.com/api/ 申请免费的 API 密钥。");
        }
        
        console.log(`获取随机视频 - 类别: ${category}, 数量: ${count}`);
        
        // 随机策略：使用多个搜索词和随机页码
        const searchTerms = category === "all" 
            ? RANDOM_KEYWORDS.all
            : RANDOM_KEYWORDS[category] || [category];
        
        // 随机选择搜索词
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        // 随机页码 (1-5，避免过深的页面)
        const randomPage = Math.floor(Math.random() * 5) + 1;
        
        console.log(`使用搜索词 "${randomTerm}"，页码 ${randomPage} 获取随机视频`);
        
        // 使用搜索功能获取随机视频
        const searchResults = await searchVideos({
            api_key,
            query: randomTerm,
            per_page: count,
            page: randomPage.toString(),
            orientation: "all",
            size: "all"
        });
        
        // 随机打乱结果
        const shuffledResults = searchResults.sort(() => Math.random() - 0.5);
        
        // 限制返回数量
        const limitedResults = shuffledResults.slice(0, parseInt(count));
        
        console.log(`成功获取 ${limitedResults.length} 个随机视频`);
        
        return limitedResults;
        
    } catch (error) {
        console.error("获取随机视频失败:", error);
        throw error;
    }
}

/**
 * 快速搜索功能
 * @param {Object} params - 搜索参数
 * @returns {Array} 搜索结果
 */
async function quickSearch(params = {}) {
    try {
        const { api_key, keyword = "" } = params;
        
        if (!validateApiKey(api_key)) {
            throw new Error("请提供有效的 Pexels API 密钥");
        }
        
        if (!keyword.trim()) {
            // 如果没有关键词，返回热门视频
            return await getPopularVideos({ api_key, per_page: "10" });
        }
        
        // 执行搜索
        return await searchVideos({
            api_key,
            query: keyword.trim(),
            per_page: "10",
            page: "1"
        });
        
    } catch (error) {
        console.error("快速搜索失败:", error);
        throw error;
    }
}

// ================================
// 辅助功能函数
// ================================

/**
 * 测试 API 连接
 * @param {string} apiKey - API密钥
 * @returns {Object} 测试结果
 */
async function testApiConnection(apiKey) {
    try {
        if (!validateApiKey(apiKey)) {
            return { success: false, message: "API 密钥格式无效" };
        }
        
        const response = await Widget.http.get(`${PEXELS_CONFIG.BASE_URL}/videos/popular?per_page=1`, {
            headers: buildHeaders(apiKey)
        });
        
        if (response.status === 200) {
            return { success: true, message: "API 连接成功" };
        } else {
            return { success: false, message: `API 返回状态码: ${response.status}` };
        }
    } catch (error) {
        console.error("API 连接测试失败:", error);
        return { success: false, message: error.message };
    }
}

/**
 * 获取视频详情（可选功能）
 * @param {string} videoId - 视频ID
 * @param {string} apiKey - API密钥
 * @returns {Object} 视频详情
 */
async function getVideoDetail(videoId, apiKey) {
    try {
        if (!validateApiKey(apiKey)) {
            throw new Error("API 密钥无效");
        }
        
        const response = await Widget.http.get(`${PEXELS_CONFIG.BASE_URL}/videos/${videoId}`, {
            headers: buildHeaders(apiKey)
        });
        
        if (!response.data) {
            throw new Error("获取视频详情失败");
        }
        
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        return transformVideoData(data);
        
    } catch (error) {
        console.error("获取视频详情失败:", error);
        throw error;
    }
}

// ================================
// 导出函数（可选）
// ================================

// 如果在支持模块的环境中，导出主要函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getPopularVideos,
        searchVideos,
        getRandomVideos,
        quickSearch,
        testApiConnection,
        getVideoDetail,
        validateApiKey,
        transformVideoData
    };
}

// ================================
// 组件初始化日志
// ================================

console.log("🎬 Pexels 视频搜索 Widget 已加载");
console.log("📋 支持的功能：热门视频、搜索视频、随机视频");
console.log("🔑 请在配置中填入有效的 Pexels API 密钥");
console.log("📖 API 密钥申请地址：https://www.pexels.com/api/");
console.log("✨ Widget 版本: 1.0.0 - 完整功能版本");