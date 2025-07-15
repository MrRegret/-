/**
 * Pexels 视频搜索 Widget 使用示例
 * 展示各种功能的调用方法和参数配置
 */

// ================================
// 示例 1: 获取热门视频
// ================================

async function exampleGetPopularVideos() {
    const params = {
        api_key: "YOUR_PEXELS_API_KEY",  // 替换为您的实际 API 密钥
        per_page: "20",                  // 每页 20 个视频
        page: "1",                       // 第一页
        min_width: "1920"                // 最小宽度 1920px (全高清)
    };

    try {
        const videos = await getPopularVideos(params);
        console.log("获取到热门视频数量:", videos.length);
        
        // 显示前3个视频的信息
        videos.slice(0, 3).forEach((video, index) => {
            console.log(`视频 ${index + 1}:`, {
                id: video.id,
                title: video.title,
                duration: video.durationText,
                videoUrl: video.videoUrl,
                posterPath: video.posterPath
            });
        });
        
        return videos;
    } catch (error) {
        console.error("获取热门视频失败:", error.message);
    }
}

// ================================
// 示例 2: 搜索特定主题的视频
// ================================

async function exampleSearchVideos() {
    const params = {
        api_key: "YOUR_PEXELS_API_KEY",  // 替换为您的实际 API 密钥
        query: "ocean waves",            // 搜索海浪视频
        orientation: "landscape",        // 横向视频
        size: "large",                   // 大尺寸视频
        per_page: "15",                  // 每页 15 个
        page: "1"                        // 第一页
    };

    try {
        const videos = await searchVideos(params);
        console.log(`搜索 "${params.query}" 的结果数量:`, videos.length);
        
        // 分析视频文件质量分布
        const qualityStats = {};
        videos.forEach(video => {
            if (video.videoFiles) {
                video.videoFiles.forEach(file => {
                    qualityStats[file.quality] = (qualityStats[file.quality] || 0) + 1;
                });
            }
        });
        
        console.log("视频质量分布:", qualityStats);
        return videos;
    } catch (error) {
        console.error("搜索视频失败:", error.message);
    }
}

// ================================
// 示例 3: 获取随机视频
// ================================

async function exampleGetRandomVideos() {
    const params = {
        api_key: "YOUR_PEXELS_API_KEY",  // 替换为您的实际 API 密钥
        category: "nature",              // 自然风光类别
        count: "12"                      // 获取 12 个随机视频
    };

    try {
        const videos = await getRandomVideos(params);
        console.log(`获取到 ${params.category} 类别的随机视频数量:`, videos.length);
        
        // 显示视频时长统计
        const durations = videos.map(video => video.duration);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        const maxDuration = Math.max(...durations);
        const minDuration = Math.min(...durations);
        
        console.log("视频时长统计:", {
            平均时长: `${Math.round(avgDuration)}秒`,
            最长时长: `${maxDuration}秒`,
            最短时长: `${minDuration}秒`
        });
        
        return videos;
    } catch (error) {
        console.error("获取随机视频失败:", error.message);
    }
}

// ================================
// 示例 4: 高级搜索 - 多种参数组合
// ================================

async function exampleAdvancedSearch() {
    // 搜索适合移动端的纵向视频
    const mobileParams = {
        api_key: "YOUR_PEXELS_API_KEY",
        query: "city night",
        orientation: "portrait",         // 纵向视频，适合手机
        size: "medium",                  // 中等尺寸，节省流量
        per_page: "10",
        page: "1"
    };

    // 搜索适合桌面端的横向高清视频
    const desktopParams = {
        api_key: "YOUR_PEXELS_API_KEY",
        query: "mountain landscape",
        orientation: "landscape",        // 横向视频
        size: "large",                   // 大尺寸，高质量
        per_page: "15",
        page: "1"
    };

    try {
        console.log("=== 搜索移动端适用视频 ===");
        const mobileVideos = await searchVideos(mobileParams);
        console.log("移动端视频数量:", mobileVideos.length);

        console.log("=== 搜索桌面端适用视频 ===");
        const desktopVideos = await searchVideos(desktopParams);
        console.log("桌面端视频数量:", desktopVideos.length);

        return {
            mobile: mobileVideos,
            desktop: desktopVideos
        };
    } catch (error) {
        console.error("高级搜索失败:", error.message);
    }
}

// ================================
// 示例 5: 批量获取不同类别的随机视频
// ================================

async function exampleBatchRandomVideos() {
    const categories = ["nature", "ocean", "city", "sky", "forest"];
    const apiKey = "YOUR_PEXELS_API_KEY";  // 替换为您的实际 API 密钥
    
    const results = {};

    try {
        for (const category of categories) {
            console.log(`正在获取 ${category} 类别的随机视频...`);
            
            const params = {
                api_key: apiKey,
                category: category,
                count: "5"  // 每个类别 5 个视频
            };

            const videos = await getRandomVideos(params);
            results[category] = videos;
            
            console.log(`${category} 类别获取到 ${videos.length} 个视频`);
            
            // 避免请求过于频繁，稍作延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 输出统计信息
        const totalVideos = Object.values(results).reduce((total, videos) => total + videos.length, 0);
        console.log(`\n批量获取完成，总共获取到 ${totalVideos} 个视频`);
        console.log("各类别视频数量:", Object.keys(results).map(key => `${key}: ${results[key].length}`).join(", "));

        return results;
    } catch (error) {
        console.error("批量获取随机视频失败:", error.message);
    }
}

// ================================
// 示例 6: 智能视频推荐系统
// ================================

async function exampleSmartRecommendation(userPreferences = {}) {
    const {
        preferredOrientation = "all",    // 用户偏好的视频方向
        preferredSize = "large",         // 用户偏好的视频尺寸
        interests = ["nature", "city"],  // 用户兴趣
        maxDuration = 60                 // 最大时长偏好（秒）
    } = userPreferences;

    const apiKey = "YOUR_PEXELS_API_KEY";  // 替换为您的实际 API 密钥
    const recommendations = [];

    try {
        console.log("=== 智能视频推荐系统 ===");
        console.log("用户偏好:", userPreferences);

        // 基于用户兴趣搜索视频
        for (const interest of interests) {
            const params = {
                api_key: apiKey,
                query: interest,
                orientation: preferredOrientation,
                size: preferredSize,
                per_page: "10",
                page: "1"
            };

            const videos = await searchVideos(params);
            
            // 根据时长偏好过滤视频
            const filteredVideos = videos.filter(video => 
                !maxDuration || video.duration <= maxDuration
            );

            recommendations.push(...filteredVideos);
            console.log(`${interest} 主题推荐视频: ${filteredVideos.length} 个`);

            // 添加延迟避免频率过高
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 随机打乱推荐结果
        const shuffledRecommendations = recommendations.sort(() => Math.random() - 0.5);
        
        // 取前15个作为最终推荐
        const finalRecommendations = shuffledRecommendations.slice(0, 15);

        console.log(`\n最终推荐视频数量: ${finalRecommendations.length}`);
        
        // 显示推荐视频的概览
        finalRecommendations.forEach((video, index) => {
            console.log(`推荐 ${index + 1}: ${video.title} (${video.durationText})`);
        });

        return finalRecommendations;
    } catch (error) {
        console.error("智能推荐失败:", error.message);
    }
}

// ================================
// 示例 7: 视频质量分析工具
// ================================

async function exampleVideoQualityAnalysis() {
    const apiKey = "YOUR_PEXELS_API_KEY";  // 替换为您的实际 API 密钥
    
    const params = {
        api_key: apiKey,
        query: "abstract",
        per_page: "20",
        page: "1"
    };

    try {
        console.log("=== 视频质量分析 ===");
        const videos = await searchVideos(params);

        const analysis = {
            totalVideos: videos.length,
            qualityDistribution: {},
            resolutionDistribution: {},
            durationAnalysis: {
                total: 0,
                average: 0,
                min: Infinity,
                max: 0
            },
            fileSizeAnalysis: {}
        };

        videos.forEach(video => {
            // 时长分析
            analysis.durationAnalysis.total += video.duration;
            analysis.durationAnalysis.min = Math.min(analysis.durationAnalysis.min, video.duration);
            analysis.durationAnalysis.max = Math.max(analysis.durationAnalysis.max, video.duration);

            // 视频文件分析
            if (video.videoFiles) {
                video.videoFiles.forEach(file => {
                    // 质量分布
                    const quality = file.quality || 'unknown';
                    analysis.qualityDistribution[quality] = (analysis.qualityDistribution[quality] || 0) + 1;

                    // 分辨率分布
                    const resolution = `${file.width}x${file.height}`;
                    analysis.resolutionDistribution[resolution] = (analysis.resolutionDistribution[resolution] || 0) + 1;
                });
            }
        });

        // 计算平均时长
        analysis.durationAnalysis.average = Math.round(analysis.durationAnalysis.total / videos.length);

        console.log("分析结果:");
        console.log("总视频数:", analysis.totalVideos);
        console.log("质量分布:", analysis.qualityDistribution);
        console.log("分辨率分布:", analysis.resolutionDistribution);
        console.log("时长分析:", {
            平均时长: `${analysis.durationAnalysis.average}秒`,
            最短时长: `${analysis.durationAnalysis.min}秒`,
            最长时长: `${analysis.durationAnalysis.max}秒`
        });

        return analysis;
    } catch (error) {
        console.error("视频质量分析失败:", error.message);
    }
}

// ================================
// 使用示例运行器
// ================================

async function runExamples() {
    console.log("开始运行 Pexels Widget 示例...\n");

    // 注意：请将 "YOUR_PEXELS_API_KEY" 替换为您的实际 API 密钥
    
    try {
        // 示例 1: 热门视频
        console.log("📺 示例 1: 获取热门视频");
        await exampleGetPopularVideos();
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 2: 搜索视频
        console.log("🔍 示例 2: 搜索视频");
        await exampleSearchVideos();
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 3: 随机视频
        console.log("🎲 示例 3: 获取随机视频");
        await exampleGetRandomVideos();
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 4: 高级搜索
        console.log("🚀 示例 4: 高级搜索");
        await exampleAdvancedSearch();
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 5: 批量获取
        console.log("📦 示例 5: 批量获取随机视频");
        await exampleBatchRandomVideos();
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 6: 智能推荐
        console.log("🧠 示例 6: 智能视频推荐");
        const userPrefs = {
            preferredOrientation: "landscape",
            preferredSize: "large",
            interests: ["nature", "ocean"],
            maxDuration: 45
        };
        await exampleSmartRecommendation(userPrefs);
        console.log("\n" + "=".repeat(50) + "\n");

        // 示例 7: 质量分析
        console.log("📊 示例 7: 视频质量分析");
        await exampleVideoQualityAnalysis();

        console.log("\n✅ 所有示例运行完成！");
    } catch (error) {
        console.error("❌ 示例运行过程中出现错误:", error.message);
    }
}

// 导出函数供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exampleGetPopularVideos,
        exampleSearchVideos,
        exampleGetRandomVideos,
        exampleAdvancedSearch,
        exampleBatchRandomVideos,
        exampleSmartRecommendation,
        exampleVideoQualityAnalysis,
        runExamples
    };
}

// 如果直接运行此文件，则执行所有示例
if (typeof require !== 'undefined' && require.main === module) {
    runExamples();
}