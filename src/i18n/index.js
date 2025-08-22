import { createI18n } from 'vue-i18n'

// 中文语言包
const zh = {
  header: {
    title: 'PLAYBOOK MARKET',
    subtitle: 'TKE',
    githubRepo: 'GitHub 仓库'
  },
  hero: {
    title: '欢迎来到 TKE Playbook',
    subtitle: '本网站汇集了 TKE 最新的最佳实践 Playbook。学习如何使用和构建基于低成本、全托管容器化平台自动扩展的应用。',
    searchPlaceholder: '搜索项目',
    stats: {
      totalProjects: '项目总数',
      categories: '分类数量',
      lastUpdate: '最后更新'
    }
  },
  filter: {
    title: '浏览分类',
    searchResult: '找到 {count} 个匹配的项目',
    all: '全部'
  },
  card: {
    files: '文件',
    updatedToday: '今天更新',
    updatedYesterday: '昨天更新',
    updatedDaysAgo: '{days}天前更新',
    updatedWeeksAgo: '{weeks}周前更新',
    updatedMonthsAgo: '{months}个月前更新'
  },
  empty: {
    description: '暂无目录数据'
  },
  categories: {
    undefined: '未定义'
  }
}

// 英文语言包
const en = {
  header: {
    title: 'PLAYBOOK MARKET',
    subtitle: 'TKE',
    githubRepo: 'GitHub Repository'
  },
  hero: {
    title: 'Welcome to TKE Playbook',
    subtitle: 'This website brings together the latest TKE best practice Playbooks. Learn how to use and build auto-scaling applications based on low-cost, fully managed containerized platforms.',
    searchPlaceholder: 'Search projects',
    stats: {
      totalProjects: 'Total Projects',
      categories: 'Categories',
      lastUpdate: 'Last Update'
    }
  },
  filter: {
    title: 'Browse Categories',
    searchResult: 'Found {count} matching projects',
    all: 'All'
  },
  card: {
    files: 'files',
    updatedToday: 'Updated today',
    updatedYesterday: 'Updated yesterday',
    updatedDaysAgo: 'Updated {days} days ago',
    updatedWeeksAgo: 'Updated {weeks} weeks ago',
    updatedMonthsAgo: 'Updated {months} months ago'
  },
  empty: {
    description: 'No directory data available'
  },
  categories: {
    undefined: 'Undefined'
  }
}

const i18n = createI18n({
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n