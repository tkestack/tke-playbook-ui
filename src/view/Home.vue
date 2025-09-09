<template>
    <div class="home-container">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <h1>{{ t('header.title') }}</h1>
                    <span class="subtitle">{{ t('header.subtitle') }}</span>
                </div>
                <div class="header-actions">
                    <el-button @click="toggleLanguage" class="language-btn">
                        <el-icon>
                            <Switch />
                        </el-icon>
                        {{ locale === 'zh' ? 'EN' : '中文' }}
                    </el-button>
                    <el-button type="primary" @click="openGithubRepo">
                        <el-icon>
                            <Link />
                        </el-icon>
                        {{ t('header.githubRepo') }}
                    </el-button>
                </div>
            </div>
        </header>

        <!-- Hero 区域 -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="hero-text">
                    <h2 class="hero-title">{{ t('hero.title') }}</h2>
                    <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>

                    <!-- 搜索栏 -->
                    <div class="hero-search">
                        <el-input v-model="searchKeyword" :placeholder="t('hero.searchPlaceholder')" size="large"
                            clearable class="search-input" autocomplete="new-password" spellcheck="false"
                            :name="`search-${Date.now()}`">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                </div>

                <!-- 统计数据 -->
                <div class="hero-stats">
                    <div class="stat-card">
                        <div class="stat-number">{{ directories.length }}</div>
                        <div class="stat-label">{{ t('hero.stats.totalProjects') }}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ categories.length - 1 }}</div>
                        <div class="stat-label">{{ t('hero.stats.categories') }}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ lastUpdateTime }}</div>
                        <div class="stat-label">{{ t('hero.stats.lastUpdate') }}</div>
                    </div>
                </div>
            </div>

            <!-- 背景装饰 -->
            <div class="hero-decoration">
                <div class="decoration-circle circle-1"></div>
                <div class="decoration-circle circle-2"></div>
                <div class="decoration-circle circle-3"></div>
            </div>
        </section>

        <!-- 主要内容区 -->
        <main class="main-content">
            <div class="content-wrapper">
                <!-- 分类标签 -->
                <div class="filter-section">
                    <h3 class="section-title">{{ t('filter.title') }}</h3>
                    <div v-if="searchKeyword" class="search-result-info">
                        {{ t('filter.searchResult', { count: filteredDirectories.length }) }}
                    </div>
                    <div class="filter-tabs">
                        <el-button v-for="category in categories" :key="category.key"
                            :type="activeCategory === category.key ? 'primary' : ''"
                            @click="setActiveCategory(category.key)" class="category-btn">
                            <el-icon v-if="category.key === 'all'">
                                <Grid />
                            </el-icon>
                            <el-icon v-else-if="category.key === '测试1'">
                                <Document />
                            </el-icon>
                            <el-icon v-else-if="category.key === '测试2'">
                                <Tools />
                            </el-icon>
                            <el-icon v-else-if="category.key === '测试4'">
                                <Setting />
                            </el-icon>
                            <el-icon v-else>
                                <Folder />
                            </el-icon>
                            {{ category.label }}
                            <span class="category-count">{{ category.count }}</span>
                        </el-button>
                    </div>
                </div>

                <!-- 目录卡片网格 -->
                    <div class="directories-grid">
                        <div v-for="directory in filteredDirectories" :key="directory.directoryName" class="directory-card"
                            @click="openDirectoryDialog(directory)">
                            <div class="card-left">
                                <div class="card-icon">
                                    <el-icon :size="32" color="#0052d9">
                                        <component :is="directory.icon" />
                                    </el-icon>
                                </div>
                            </div>

                            <div class="card-right">
                                <div class="card-header">
                                    <h3 class="card-title">{{ locale === 'en' ? directory.nameEn : directory.name }}</h3>
                                    <div class="card-category">{{ locale === 'en' ? directory.categoryEn :
                                        directory.category }}
                                    </div>
                                </div>

                                <p class="card-description">{{ locale === 'en' ? directory.descriptionEn :
                                    directory.description }}
                                </p>

                                <div class="card-tags-row">
                                    <el-tag
                                        v-for="(tag, index) in (locale === 'en' ? directory.tagsEn : directory.tags).slice(0, 3)"
                                        :key="`${directory.directoryName}-${index}`" size="small" class="directory-tag">
                                        {{ tag }}
                                    </el-tag>
                                </div>

                                <div class="card-footer">
                                    <div class="card-stats">
                                        <span class="stat-item">
                                            <el-icon>
                                                <Files />
                                            </el-icon>
                                            {{ directory.fileCount }} {{ t('card.files') }}
                                        </span>
                                        <span class="stat-item">
                                            <el-icon>
                                                <Calendar />
                                            </el-icon>
                                            {{ formatRelativeTime(directory.updatedAt) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Playbook详情对话框 -->
                    <el-dialog
                        v-model="dialogVisible"
                        :title="locale === 'en' ? selectedDirectory?.nameEn : selectedDirectory?.name"
                        width="90%"
                        max-width="1200px"
                        class="playbook-dialog"
                        append-to-body
                        destroy-on-close
                        @closed="handleDialogClosed"
                        :fullscreen="isMobile"
                    >
                        <template #header>
                            <div class="dialog-header-wrapper">
                                <span class="dialog-title">{{ locale === 'en' ? selectedDirectory?.nameEn : selectedDirectory?.name }}</span>
                            </div>
                        </template>
                        
                        <div v-if="selectedDirectory" class="dialog-content">
                            <!-- 描述 -->
                            <div class="dialog-section">
                                <h3 class="dialog-section-title">{{ t('dialog.description') }}</h3>
                                <p class="dialog-description">{{ locale === 'en' ? selectedDirectory.descriptionEn : selectedDirectory.description }}</p>
                            </div>
                            

                            <!-- Giscus评论区 -->
                            <div class="dialog-section">
                                <h3 class="dialog-section-title">{{ t('dialog.comments') }}</h3>
                                <div class="giscus-container">
                                    <div class="giscus-comments">
                                        <Giscus
                                            v-if="selectedDirectory"
                                            id="giscus-comments"
                                            repo="tkestack/tke-playbook"
                                            repo-id="R_kgDOPdwrHA"
                                            category="General"
                                            categoryId="DIC_kwDOPdwrHM4Cu90Q"
                                            mapping="specific"
                                            :term="selectedDirectory.relativePath || selectedDirectory.directoryName"
                                            :reactions-enabled="true"
                                            :emit-metadata="true"
                                            input-position="top"
                                            theme="preferred_color_scheme"
                                            lang="zh-CN"
                                            loading="lazy"
                                            :key="selectedDirectory.relativePath || selectedDirectory.directoryName"
                                            host="https://giscus.app"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="openDirectory(selectedDirectory)">
                                    {{ t('dialog.viewOnGithub') }}
                                </el-button>
                                <el-button @click="closeDialog">{{ t('dialog.close') }}</el-button>
                            </div>
                        </template>
                    </el-dialog>

                <!-- 空状态 -->
                <div v-if="filteredDirectories.length === 0" class="empty-state">
                    <el-empty :description="t('empty.description')" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Giscus from '@giscus/vue'
import {
    Search,
    Link,
    Calendar,
    Files,
    Grid,
    Document,
    Tools,
    Setting,
    Folder,
    Switch,
    Close
} from '@element-plus/icons-vue'

// 国际化
const { t, locale } = useI18n()
const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const activeCategory = ref('all')
const lastUpdateTime = ref('')

// 目录数据（从 GitHub API 或生成的 JSON 文件获取）
const directories = ref([])

// 对话框相关数据
const dialogVisible = ref(false)
const selectedDirectory = ref(null)
const isMobile = ref(window.innerWidth <= 768)

// 语言切换
const toggleLanguage = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
    // 重新设置分类为全部，避免分类名称不匹配
    activeCategory.value = 'all'
}

// 分类处理工具函数
const normalizeCategory = (directory, isEnglish = false) => {
    const category = isEnglish ? directory.categoryEn : directory.category
    // 处理空值、null、undefined，统一转换为对应语言的"未定义"
    if (!category || category.trim() === '') {
        return isEnglish ? 'Undefined' : '未定义'
    }
    return category.trim()
}

const generateDynamicCategories = (directories) => {
    const isEnglish = locale.value === 'en'

    // 1. 提取所有分类
    const categorySet = new Set()
    directories.forEach(dir => {
        const category = normalizeCategory(dir, isEnglish)
        categorySet.add(category)
    })

    // 2. 生成分类对象
    const dynamicCategories = Array.from(categorySet).map(category => ({
        key: category,
        label: category,
        count: directories.filter(d => normalizeCategory(d, isEnglish) === category).length
    }))

    // 3. 排序：字母顺序，未定义放最后
    const undefinedKey = isEnglish ? 'Undefined' : '未定义'
    dynamicCategories.sort((a, b) => {
        if (a.key === undefinedKey) return 1
        if (b.key === undefinedKey) return -1
        return a.key.localeCompare(b.key, isEnglish ? 'en' : 'zh-CN')
    })

    // 4. 添加"全部"选项
    return [
        { key: 'all', label: t('filter.all'), count: directories.length },
        ...dynamicCategories
    ]
}

// 动态分类配置
const categories = computed(() => {
    return generateDynamicCategories(directories.value)
})

// 过滤后的目录列表
const filteredDirectories = computed(() => {
    let result = directories.value
    const isEnglish = locale.value === 'en'

    // 按分类过滤 - 使用动态分类
    if (activeCategory.value !== 'all') {
        result = result.filter(d => {
            const normalizedCategory = normalizeCategory(d, isEnglish)
            return normalizedCategory === activeCategory.value
        })
    }

    // 按搜索关键词过滤 - 搜索对应语言的标题
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(d => {
            const title = isEnglish ? d.nameEn : d.name
            return title.toLowerCase().includes(keyword)
        })
    }

    return result
})

// 方法
const fetchDirectoriesFromGitHub = async () => {
    try {
        // 首先尝试从本地 JSON 文件获取数据，添加时间戳避免缓存
        const timestamp = new Date().getTime()
        const response = await fetch(`./directories.json?t=${timestamp}`)
        if (response.ok) {
            const data = await response.json()
            // 处理目录数据，确保每个项目都有有效的分类
            const processedDirectories = (data.directories || []).map(dir => ({
                ...dir,
                category: dir.category || '未定义' // 为缺少 category 字段的目录项设置默认值
            }))
            directories.value = processedDirectories
            lastUpdateTime.value = formatDate(new Date(data.lastUpdate))
            console.log('成功获取目录数据:', data)
        } else {
            // 如果没有 JSON 文件，设置空数据
            directories.value = []
            lastUpdateTime.value = formatDate(new Date())
        }
    } catch (error) {
        console.error('获取目录数据失败:', error)
        ElMessage.error('获取目录数据失败，请稍后重试')
        // 设置空数据状态
        directories.value = []
    }
}

const setActiveCategory = (category) => {
    activeCategory.value = category
}

const openDirectory = (directory) => {
    let githubUrl

    // 优先使用自定义的 playbookUrl
    if (directory.playbookUrl) {
        githubUrl = directory.playbookUrl
    } else if (directory.relativePath) {
        // 使用完整的相对路径构建 URL，但要去掉 tke-playbook/ 前缀
        let relativePath = directory.relativePath
        if (relativePath.startsWith('tke-playbook/')) {
            relativePath = relativePath.substring('tke-playbook/'.length)
        }
        githubUrl = `https://github.com/tkestack/tke-playbook/tree/main/${relativePath}`
    } else {
        // 默认跳转到主仓库的对应目录
        const directoryName = directory.directoryName || directory.name
        githubUrl = `https://github.com/tkestack/tke-playbook/tree/main/${directoryName}`
    }

    window.open(githubUrl, '_blank')
}

// 打开目录对话框
const openDirectoryDialog = (directory) => {
    selectedDirectory.value = directory
    dialogVisible.value = true
    
    // 延迟加载Giscus，确保DOM已经渲染
    setTimeout(() => {
        // Giscus会自动加载，无需手动调用
    }, 100)
}

// 处理对话框关闭
const handleDialogClosed = () => {
    // 关闭对话框
    dialogVisible.value = false
    // 清空选中的目录
    selectedDirectory.value = null
}

const openGithubRepo = () => {
    window.open('https://github.com/tkestack/tke-playbook', '_blank')
}

const closeDialog = () => {
    dialogVisible.value = false
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN')
}

const formatRelativeTime = (date) => {
    const now = new Date()
    const target = new Date(date)
    const diff = now - target
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return t('card.updatedToday')
    if (days === 1) return t('card.updatedYesterday')
    if (days < 7) return t('card.updatedDaysAgo', { days })
    if (days < 30) return t('card.updatedWeeksAgo', { weeks: Math.floor(days / 7) })
    return t('card.updatedMonthsAgo', { months: Math.floor(days / 30) })
}

// 窗口大小变化监听
const handleResize = () => {
    isMobile.value = window.innerWidth <= 768
}

// 生命周期
onMounted(() => {
    fetchDirectoriesFromGitHub()
    window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>
