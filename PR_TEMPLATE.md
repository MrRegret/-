# 🎬 Add Pexels Video Search Widget

## 📋 Overview
This PR introduces a comprehensive Pexels API-based video search widget for ForwardWidget, enabling users to discover and integrate high-quality free videos from Pexels platform.

## ✨ Key Features
- **🔥 Popular Videos**: Fetch trending videos from Pexels with pagination support
- **🔍 Video Search**: Advanced keyword-based search with multiple filtering options
- **🎲 Random Videos**: Intelligent random video discovery across 10 categories
- **🔑 Manual API Configuration**: User-friendly API key input for each module
- **⚡ Smart Caching**: Optimized multi-tier caching (1h/30min/20min)
- **🛡️ Robust Error Handling**: Comprehensive error handling with user-friendly messages
- **📱 Multi-Quality Support**: Automatic quality selection from 4K to mobile-optimized

## 📁 Files Added
```
widgets/pexels-video/
├── pexels_video_widget.js    # Main widget component (~15KB)
├── README.md                 # Project overview and quick start
└── usage_guide.md           # Comprehensive documentation
```

## 🔧 Technical Implementation

### Widget Structure
- **3 Core Modules**: Popular, Search, Random video functionality
- **20+ Parameters**: Extensive configuration options
- **ForwardWidget Compliant**: Follows all framework specifications
- **Production Ready**: Complete error handling and validation

### API Integration
- **Pexels Videos API v1**: Full integration with official API
- **Rate Limiting**: Intelligent request management
- **Quality Selection**: Automatic best quality detection
- **Data Transformation**: Complete ForwardWidget data model mapping

### Caching Strategy
```javascript
modules: [
    { name: "popular_videos", cacheDuration: 3600 },   // 1 hour
    { name: "search_videos", cacheDuration: 1800 },    // 30 minutes  
    { name: "random_videos", cacheDuration: 1200 }     // 20 minutes
]
```

## 🎯 Use Cases
- **Content Creation**: Video background assets
- **Mobile Applications**: Portrait/landscape video assets
- **Website Design**: High-quality video backgrounds
- **Creative Inspiration**: Random video discovery
- **Asset Management**: Organized video resource collection

## 🧪 Testing & Validation
- [x] API integration tested with live Pexels API
- [x] All three modules functional
- [x] Error scenarios properly handled
- [x] Data transformation verified
- [x] Caching mechanism validated
- [x] Multiple video qualities tested
- [x] Parameter validation working
- [x] ForwardWidget compatibility confirmed

## 📖 Documentation
- **Setup Guide**: Complete API key acquisition walkthrough
- **Usage Examples**: 7 different scenarios with code samples
- **Parameter Reference**: Detailed explanation of all options
- **Troubleshooting**: Common issues and solutions
- **Best Practices**: Performance optimization tips

## 🔐 API Key Requirements
Users need to obtain a free Pexels API key from: https://www.pexels.com/api/
- No payment required for basic usage
- Straightforward application process
- Clear documentation provided in widget guide

## 🚀 Quick Start
```javascript
// Basic usage example
const videos = await searchVideos({
    api_key: "YOUR_PEXELS_API_KEY",
    query: "nature landscape",
    orientation: "landscape",
    size: "large",
    per_page: "15"
});
```

## 📊 Performance Metrics
- **File Size**: ~15KB (optimized)
- **API Efficiency**: Smart caching reduces redundant calls
- **Load Time**: Minimal impact with proper caching
- **Memory Usage**: Efficient data structure handling

## 🤝 Code Quality
- **JSDoc Documentation**: Complete function documentation
- **Error Handling**: Try-catch blocks for all async operations
- **Input Validation**: Comprehensive parameter validation
- **Code Organization**: Clear separation of concerns
- **Best Practices**: Follows ForwardWidget development guidelines

## 🔄 Future Enhancements
- [ ] Video download functionality
- [ ] Playlist management
- [ ] Advanced filtering options
- [ ] Offline caching
- [ ] Bulk operations

## 📞 Support & Resources
- **Pexels API**: https://www.pexels.com/api/
- **Widget Documentation**: See included usage guide
- **Issue Reporting**: [Link to issues page]

---

### 🏷️ Related Issues
Closes #[issue_number] (if applicable)

### 📋 Checklist
- [x] Code follows project coding standards
- [x] Self-review completed
- [x] Documentation is comprehensive
- [x] Examples tested and working
- [x] Error handling implemented
- [x] Performance considerations addressed
- [x] Security best practices followed
- [x] ForwardWidget compatibility verified

### 🎉 Ready for Review
This widget is production-ready and provides immediate value to ForwardWidget users seeking high-quality video content integration.