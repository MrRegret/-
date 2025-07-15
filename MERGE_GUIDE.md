# 📦 Pexels Widget 本地合并指南

## 🎯 快速合并步骤

### 方案A: 一键创建完整项目

```bash
# 1. 创建项目目录
mkdir pexels-forwardwidget && cd pexels-forwardwidget

# 2. 初始化Git
git init

# 3. 创建目录结构
mkdir -p {src,docs,examples,assets}

# 4. 创建所有必要文件
touch src/pexels_video_widget.js
touch README.md
touch docs/usage_guide.md
touch examples/usage_examples.js
touch docs/development_guide.md

# 5. 添加到Git
git add .
git commit -m "Initial project structure"
```

### 方案B: 合并到现有项目

```bash
# 1. 进入现有项目
cd your-existing-project

# 2. 创建Widget分支
git checkout -b feature/pexels-widget

# 3. 创建Widget目录
mkdir -p widgets/pexels
cd widgets/pexels

# 4. 创建文件
touch pexels_video_widget.js
touch README.md
touch usage_guide.md

# 5. 提交合并
git add .
git commit -m "Add Pexels video widget"
```

## 📁 文件内容速查表

### 主文件: `src/pexels_video_widget.js`
```
复制完整组件代码 (complete_pexels_widget.js 的全部内容)
大小: ~15KB
功能: 完整的Pexels API集成
```

### 说明文档: `README.md`
```
项目概述和快速开始指南
包含功能特性、使用示例、配置说明
大小: ~8KB
```

### 使用指南: `docs/usage_guide.md`
```
详细的使用说明和API密钥获取步骤
包含参数配置、故障排除、最佳实践
大小: ~12KB
```

### 示例代码: `examples/usage_examples.js`
```
7种不同场景的使用示例
包含基础用法到高级功能的完整演示
大小: ~10KB
```

## 🔧 验证合并结果

### 检查文件完整性
```bash
# 查看文件列表
find . -name "*.js" -o -name "*.md" | sort

# 检查文件大小
ls -la src/ docs/ examples/

# 验证Git状态
git status
git log --oneline -5
```

### 测试功能完整性
```bash
# 检查主文件语法
node -c src/pexels_video_widget.js

# 查看组件元数据
grep -A 10 "WidgetMetadata" src/pexels_video_widget.js
```

## 📋 合并后检查清单

- [ ] ✅ 主组件文件创建成功 (`pexels_video_widget.js`)
- [ ] ✅ 项目README完整 (`README.md`)
- [ ] ✅ 使用指南到位 (`usage_guide.md`)
- [ ] ✅ 示例代码齐全 (`usage_examples.js`)
- [ ] ✅ Git提交记录清晰
- [ ] ✅ 文件权限正确
- [ ] ✅ 目录结构合理

## 🚀 下一步操作

### 本地测试
```bash
# 在ForwardWidget环境中测试
# 1. 部署主文件到Widget环境
# 2. 配置Pexels API密钥
# 3. 测试三个主要功能模块
```

### 远程推送 (可选)
```bash
# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 推送到远程
git push -u origin main
```

### 创建发布版本
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release v1.0.0: Pexels Video Widget"

# 推送标签
git push origin v1.0.0
```

## 💡 专业提示

1. **备份现有代码**: 在合并前备份现有项目
2. **分支管理**: 使用功能分支进行开发
3. **提交信息**: 使用规范的提交信息格式
4. **文档更新**: 及时更新项目文档
5. **版本控制**: 使用语义化版本号

## 🆘 常见问题解决

### 问题1: 文件权限错误
```bash
# 修复文件权限
chmod 644 *.js *.md
chmod 755 src/ docs/ examples/
```

### 问题2: Git冲突
```bash
# 查看冲突文件
git status

# 解决冲突后
git add .
git commit -m "Resolve merge conflicts"
```

### 问题3: 文件编码问题
```bash
# 确保UTF-8编码
file -i *.js *.md

# 转换编码（如需要）
iconv -f ISO-8859-1 -t UTF-8 file.js > file_utf8.js
```

---

> 💡 **提示**: 按照以上步骤操作即可完成本地合并。如遇问题，请检查文件路径和权限设置。