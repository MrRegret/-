/**
 * Pexels 视频搜索 Widget
 * 基于 Pexels API 的高质量视频搜索和随机获取组件
 */

var WidgetMetadata = {
    id: "pexels_video",
    title: "Pexels 视频库",
    description: "搜索和获取 Pexels 高质量免费视频",
    author: "Developer",
    site: "https://www.pexels.com",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    detailCacheDuration: 300,  // 5分钟详情缓存
    modules: [
        {
            name: "popular_videos",
            title: "热门视频",
            description: "获取 Pexels 平台热门视频",
            requiresWebView: false,
            functionName: "getPopularVideos",
            cacheDuration: 3600, // 1小时缓存
            params: [
                {
                    name: "api_key",
                    title: "API 密钥",
                    type: "input",
                    description: "输入您的 Pexels API 密钥",
                    value: "",
                    placeholder: "请输入 Pexels API Key"
                },
                {
                    name: "per_page",
                    title: "每页数量",
                    type: "enumeration",
                    description: "每次获取的视频数量",
                    enumOptions: [
                        { value: "10", title: "10个视频" },
                        { value: "15", title: "15个视频" },
                        { value: "20", title: "20个视频" },
                        { value: "30", title: "30个视频" }
                    ],
                    value: "15"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "选择页码",
                    value: "1"
                },
                {
                    name: "min_width",
                    title: "最小宽度",
                    type: "enumeration",
                    description: "视频最小宽度要求",
                    enumOptions: [
                        { value: "0", title: "不限制" },
                        { value: "1280", title: "1280px (高清)" },
                        { value: "1920", title: "1920px (全高清)" },
                        { value: "3840", title: "3840px (4K)" }
                    ],
                    value: "0"
                }
            ]
        },
        {
            name: "search_videos",
            title: "搜索视频",
            description: "根据关键词搜索视频",
            requiresWebView: false,
            functionName: "searchVideos",
            cacheDuration: 1800, // 30分钟缓存
            params: [
                {
                    name: "api_key",
                    title: "API 密钥",
                    type: "input",
                    description: "输入您的 Pexels API 密钥",
                    value: "",
                    placeholder: "请输入 Pexels API Key"
                },
                {
                    name: "query",
                    title: "搜索关键词",
                    type: "input",
                    description: "输入搜索关键词",
                    value: "nature",
                    placeholder: "例如: nature, ocean, city"
                },
                {
                    name: "orientation",
                    title: "视频方向",
                    type: "enumeration",
                    description: "选择视频方向",
                    enumOptions: [
                        { value: "all", title: "所有方向" },
                        { value: "landscape", title: "横向" },
                        { value: "portrait", title: "纵向" },
                        { value: "square", title: "正方形" }
                    ],
                    value: "all"
                },
                {
                    name: "size",
                    title: "视频尺寸",
                    type: "enumeration",
                    description: "选择视频尺寸偏好",
                    enumOptions: [
                        { value: "all", title: "所有尺寸" },
                        { value: "large", title: "大尺寸" },
                        { value: "medium", title: "中等尺寸" },
                        { value: "small", title: "小尺寸" }
                    ],
                    value: "all"
                },
                {
                    name: "per_page",
                    title: "每页数量",
                    type: "enumeration",
                    description: "每次获取的视频数量",
                    enumOptions: [
                        { value: "10", title: "10个视频" },
                        { value: "15", title: "15个视频" },
                        { value: "20", title: "20个视频" },
                        { value: "30", title: "30个视频" }
                    ],
                    value: "15"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "选择页码",
                    value: "1"
                }
            ]
        },
        {
            name: "random_videos",
            title: "随机视频",
            description: "获取随机的高质量视频",
            requiresWebView: false,
            functionName: "getRandomVideos",
            cacheDuration: 1200, // 20分钟缓存
            params: [
                {
                    name: "api_key",
                    title: "API 密钥",
                    type: "input",
                    description: "输入您的 Pexels API 密钥",
                    value: "",
                    placeholder: "请输入 Pexels API Key"
                },
                {
                    name: "category",
                    title: "视频类别",
                    type: "enumeration",
                    description: "选择随机视频的类别",
                    enumOptions: [
                        { value: "all", title: "所有类别" },
                        { value: "nature", title: "自然风光" },
                        { value: "ocean", title: "海洋" },
                        { value: "mountain", title: "山川" },
                        { value: "city", title: "城市" },
                        { value: "sky", title: "天空" },
                        { value: "forest", title: "森林" },
                        { value: "animals", title: "动物" },
                        { value: "technology", title: "科技" },
                        { value: "abstract", title: "抽象" }
                    ],
                    value: "all"
                },
                {
                    name: "count",
                    title: "视频数量",
                    type: "count",
                    description: "获取随机视频的数量",
                    value: "10"
                }
            ]
        }
    ]
};

// Pexels API 基础配置
const PEXELS_BASE_URL = "https://api.pexels.com";
const DEFAULT_HEADERS = {
    "User-Agent": "ForwardWidget/1.0 (https://example.com)"
};

/**
 * 验证 API 密钥
 * @param {string} apiKey - API 密钥
 * @returns {boolean} 是否有效
 */
function validateApiKey(apiKey) {
    return apiKey && typeof apiKey === 'string' && apiKey.trim().length > 0;
}

/**
 * 构建请求头
 * @param {string} apiKey - API 密钥
 * @returns {Object} 请求头对象
 */
function buildHeaders(apiKey) {
    return {
        ...DEFAULT_HEADERS,
        "Authorization": apiKey
    };
}

/**
 * 转换 Pexels 视频数据为 ForwardWidget 格式
 * @param {Object} pexelsVideo - Pexels API 返回的视频对象
 * @returns {Object} ForwardWidget 格式的视频对象
 */
function transformVideoData(pexelsVideo) {
    // 获取不同质量的视频文件
    const videoFiles = pexelsVideo.video_files || [];
    
    // 按质量排序，优先选择高质量
    const sortedFiles = videoFiles.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    // 选择最佳视频URL
    const bestVideo = sortedFiles.find(file => file.quality === 'hd') || sortedFiles[0];
    const mediumVideo = sortedFiles.find(file => file.quality === 'sd') || bestVideo;
    
    // 获取封面图片
    const posterUrl = pexelsVideo.image || (videoFiles[0] && videoFiles[0].link.replace('.mp4', '.jpg'));

    return {
        id: `pexels_${pexelsVideo.id}`,
        type: "video",
        title: `Pexels 视频 #${pexelsVideo.id}`,
        description: `由 ${pexelsVideo.user?.name || '匿名用户'} 提供的高质量视频`,
        posterPath: posterUrl,
        backdropPath: posterUrl,
        videoUrl: bestVideo?.link || "",
        previewUrl: mediumVideo?.link || "",
        link: pexelsVideo.url,
        duration: pexelsVideo.duration || 0,
        durationText: formatDuration(pexelsVideo.duration || 0),
        genreTitle: "视频素材",
        rating: "4.5",
        mediaType: "video",
        releaseDate: new Date().toISOString().split('T')[0],
        // 添加额外的视频文件信息
        videoFiles: videoFiles.map(file => ({
            url: file.link,
            quality: file.quality,
            width: file.width,
            height: file.height,
            fileType: file.file_type
        }))
    };
}

/**
 * 格式化时长
 * @param {number} duration - 时长（秒）
 * @returns {string} 格式化的时长字符串
 */
function formatDuration(duration) {
    if (!duration) return "00:00";
    
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

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
            throw new Error("请提供有效的 Pexels API 密钥");
        }

        console.log(`获取热门视频 - 页码: ${page}, 每页: ${per_page}, 最小宽度: ${min_width}`);

        // 构建请求URL
        const url = `${PEXELS_BASE_URL}/videos/popular`;
        const queryParams = new URLSearchParams({
            per_page: per_page,
            page: page
        });

        if (min_width !== "0") {
            queryParams.append("min_width", min_width);
        }

        // 发送请求
        const response = await Widget.http.get(`${url}?${queryParams.toString()}`, {
            headers: buildHeaders(api_key)
        });

        if (!response.data) {
            throw new Error("API 响应数据为空");
        }

        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        
        if (!data.videos || !Array.isArray(data.videos)) {
            console.warn("API 返回数据格式异常:", data);
            return [];
        }

        console.log(`成功获取 ${data.videos.length} 个热门视频`);
        
        // 转换数据格式
        return data.videos.map(transformVideoData);

    } catch (error) {
        console.error("获取热门视频失败:", error);
        
        // 根据错误类型提供友好的错误信息
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
            throw new Error("API 密钥无效，请检查您的 Pexels API 密钥");
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
            throw new Error("API 请求频率过高，请稍后再试");
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
            throw new Error("网络连接失败，请检查网络连接");
        }
        
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
            throw new Error("请提供有效的 Pexels API 密钥");
        }

        // 验证搜索关键词
        if (!query || query.trim().length === 0) {
            throw new Error("请输入搜索关键词");
        }

        console.log(`搜索视频 - 关键词: "${query}", 方向: ${orientation}, 尺寸: ${size}, 页码: ${page}`);

        // 构建请求URL
        const url = `${PEXELS_BASE_URL}/videos/search`;
        const queryParams = new URLSearchParams({
            query: query.trim(),
            per_page: per_page,
            page: page
        });

        if (orientation !== "all") {
            queryParams.append("orientation", orientation);
        }

        if (size !== "all") {
            queryParams.append("size", size);
        }

        // 发送请求
        const response = await Widget.http.get(`${url}?${queryParams.toString()}`, {
            headers: buildHeaders(api_key)
        });

        if (!response.data) {
            throw new Error("API 响应数据为空");
        }

        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        
        if (!data.videos || !Array.isArray(data.videos)) {
            console.warn("搜索结果为空或格式异常:", data);
            return [];
        }

        console.log(`搜索到 ${data.videos.length} 个视频，总计: ${data.total_results || 'N/A'}`);
        
        // 转换数据格式
        return data.videos.map(transformVideoData);

    } catch (error) {
        console.error("搜索视频失败:", error);
        
        // 根据错误类型提供友好的错误信息
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
            throw new Error("API 密钥无效，请检查您的 Pexels API 密钥");
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
            throw new Error("API 请求频率过高，请稍后再试");
        }
        
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
        const { api_key, category = "all", count = "10" } = params;

        // 验证 API 密钥
        if (!validateApiKey(api_key)) {
            throw new Error("请提供有效的 Pexels API 密钥");
        }

        console.log(`获取随机视频 - 类别: ${category}, 数量: ${count}`);

        // 随机视频策略：使用不同的搜索词和随机页码
        const searchTerms = category === "all" 
            ? ["nature", "ocean", "mountain", "city", "sky", "forest", "abstract", "technology"]
            : [category];

        // 随机选择搜索词
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        // 随机页码 (1-10)
        const randomPage = Math.floor(Math.random() * 10) + 1;

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
 * 测试 API 连接
 * @param {string} apiKey - API 密钥
 * @returns {Promise<boolean>} 是否连接成功
 */
async function testApiConnection(apiKey) {
    try {
        const response = await Widget.http.get(`${PEXELS_BASE_URL}/videos/popular?per_page=1`, {
            headers: buildHeaders(apiKey)
        });
        
        return response.status === 200;
    } catch (error) {
        console.error("API 连接测试失败:", error);
        return false;
    }
}