WidgetMetadata = {
  id: "wallpaper",
  title: "动态壁纸",
  description: "动态壁纸",
  author: "test",
  site: "https://",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  modules: [
    {
      name: "dynamic_wallpaper",
      title: "动态壁纸",
      description: "动态壁纸",
      requiresWebView: false,
      functionName: "loadWallpaperItems",
      params: [
        {
          name: "index",
          title: "索引",
          type: "enumeration",
          enumOptions: [
            {
              value: "0",
              title: "动态壁纸1",
            },
            {
              value: "1",
              title: "动态壁纸2",
            }
          ],
          value: "0",
        },
      ]
    }
  ],
};

async function loadWallpaperItems(params = {}) {
  const wallpapers = [
    {
      id: "0",
      type: "video",
      title: "动态壁纸",
      coverUrl: "https://images.pexels.com/videos/19120693/deep-blue-deep-sea-hammershark-shark-19120693.jpeg?auto=compress&cs=tinysrgb&w=1600&loading=lazy",
      videoUrl: "https://videos.pexels.com/video-files/19120693/uhd_25fps.mp4",
    },
    {
      id: "1",
      type: "video",
      title: "动态壁纸",
      coverUrl: "https://images.pexels.com/videos/6093604/brown-horse-cinematic-flock-horse-6093604.jpeg?auto=compress&cs=tinysrgb&w=1600&loading=lazy",
      videoUrl: "https://videos.pexels.com/video-files/6093604/6093604-uhd_2560_1440_24fps.mp4",
    }
  ];

  const index = params.index ?? 0;
  if (index >= 0 && index < wallpapers.length) {
    return [wallpapers[index]];
  }

  return [];
}
