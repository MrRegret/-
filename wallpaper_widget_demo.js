/**
 * 动态壁纸 Widget
 * 提供高质量的视频壁纸资源
 */

var WidgetMetadata = {
    id: "wallpaper",
    title: "动态壁纸",
    description: "提供高质量的动态视频壁纸",
    author: "test",
    site: "https://pexels.com",
    version: "1.0.3",
    requiredVersion: "0.0.1",
    modules: [
        {
            name: "dynamic_wallpaper",
            title: "动态壁纸",
            description: "选择不同类型的动态壁纸",
            requiresWebView: false,
            functionName: "loadWallpaperItems",
            cacheDuration: 1800, // 30分钟缓存
            params: [
                {
                    name: "index",
                    title: "壁纸类型",
                    type: "enumeration",
                    description: "选择要加载的壁纸类型",
                    enumOptions: [
                        {
                            value: "0",
                            title: "深海鲨鱼",
                        },
                        {
                            value: "1",
                            title: "奔跑的马",
                        },
                        {
                            value: "2",
                            title: "所有壁纸",
                        }
                    ],
                    value: "0",
                },
                {
                    name: "quality",
                    title: "视频质量",
                    type: "enumeration",
                    description: "选择视频质量",
                    enumOptions: [
                        {
                            value: "hd",
                            title: "高清 (HD)",
                        },
                        {
                            value: "uhd",
                            title: "超高清 (UHD)",
                        }
                    ],
                    value: "hd",
                }
            ]
        }
    ],
};

/**
 * 加载壁纸数据
 * @param {Object} params - 参数对象
 * @param {string} params.index - 壁纸索引
 * @param {string} params.quality - 视频质量
 * @returns {Array} 壁纸数据数组
 */
async function loadWallpaperItems(params = {}) {
    try {
        // 参数验证和默认值
        const index = params.index ?? "0";
        const quality = params.quality ?? "hd";
        
        console.log(`加载壁纸 - 索引: ${index}, 质量: ${quality}`);

        // 壁纸数据定义
        const wallpapers = [
            {
                id: "shark_deep_sea",
                type: "video",
                title: "深海鲨鱼",
                description: "在深蓝色的海洋中游泳的锤头鲨",
                posterPath: "https://images.pexels.com/videos/19120693/deep-blue-deep-sea-hammershark-shark-19120693.jpeg?auto=compress&cs=tinysrgb&w=1600&loading=lazy",
                videoUrl: quality === "uhd" 
                    ? "https://videos.pexels.com/video-files/19120693/uhd_25fps.mp4"
                    : "https://videos.pexels.com/video-files/19120693/hd_25fps.mp4",
                genreTitle: "海洋生物",
                duration: 30,
                durationText: "00:30",
                rating: "4.8"
            },
            {
                id: "running_horse",
                type: "video", 
                title: "奔跑的马",
                description: "电影风格的棕色马群奔跑场景",
                posterPath: "https://images.pexels.com/videos/6093604/brown-horse-cinematic-flock-horse-6093604.jpeg?auto=compress&cs=tinysrgb&w=1600&loading=lazy",
                videoUrl: quality === "uhd"
                    ? "https://videos.pexels.com/video-files/6093604/6093604-uhd_2560_1440_24fps.mp4"
                    : "https://videos.pexels.com/video-files/6093604/6093604-hd_1920_1080_24fps.mp4",
                genreTitle: "动物",
                duration: 25,
                durationText: "00:25",
                rating: "4.6"
            }
        ];

        // 根据索引返回相应的壁纸
        if (index === "2") {
            // 返回所有壁纸
            console.log(`返回所有壁纸，共 ${wallpapers.length} 个`);
            return wallpapers;
        } else {
            const indexNum = parseInt(index, 10);
            if (indexNum >= 0 && indexNum < wallpapers.length) {
                console.log(`返回索引 ${indexNum} 的壁纸: ${wallpapers[indexNum].title}`);
                return [wallpapers[indexNum]];
            }
        }

        console.warn(`无效的索引: ${index}`);
        return [];
        
    } catch (error) {
        console.error("加载壁纸失败:", error);
        throw new Error(`加载壁纸失败: ${error.message}`);
    }
}

/**
 * 搜索壁纸 (可选功能)
 * @param {Object} params - 搜索参数
 * @returns {Array} 搜索结果
 */
async function searchWallpapers(params = {}) {
    try {
        const keyword = params.keyword?.toLowerCase() || "";
        
        if (!keyword) {
            return await loadWallpaperItems({ index: "2" }); // 返回所有壁纸
        }

        const allWallpapers = await loadWallpaperItems({ index: "2" });
        
        // 简单的关键词搜索
        const results = allWallpapers.filter(wallpaper => 
            wallpaper.title.toLowerCase().includes(keyword) ||
            wallpaper.description.toLowerCase().includes(keyword) ||
            wallpaper.genreTitle.toLowerCase().includes(keyword)
        );

        console.log(`搜索 "${keyword}" 找到 ${results.length} 个结果`);
        return results;
        
    } catch (error) {
        console.error("搜索壁纸失败:", error);
        throw error;
    }
}