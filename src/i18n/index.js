import { createI18n } from 'vue-i18n'

// 中文语言包
const zh = {
  header: {
    title: 'PLAYBOOK MARKET',
    subtitle: 'TKE',
    githubRepo: 'GitHub 仓库',
    discussion: '讨论区',
    home: '主页'
  },
  discussion: {
    title: 'PLAYBOOK MARKET',
    subtitle: 'TKE',
    pageTitle: '社区讨论区',
    pageDescription: '在这里您可以与其他用户交流，分享经验，提出问题或建议。',
    giscusInfo: '关于评论系统',
    giscusDescription: '评论系统基于 GitHub Discussions，您需要使用 GitHub 账号登录才能发表评论。',
    viewOnGithub: '在 GitHub 上查看讨论',
    loadError: '评论系统加载失败，请刷新页面重试',
    loginWithGithub: '使用GitHub登录',
    logout: '登出',
    loginSuccess: '登录成功！',
    logoutSuccess: '已登出'
  },
  playbook: {
    title: 'Playbook详情',
    description: '查看Playbook详细信息和讨论'
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
  dialog: {
    close: '关闭',
    viewOnGithub: '在 GitHub 上查看',
    description: '描述',
    tags: '标签',
    comments: '评论'
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
    githubRepo: 'GitHub Repository',
    discussion: 'Discussion',
    home: 'Home'
  },
  discussion: {
    title: 'PLAYBOOK MARKET',
    subtitle: 'TKE',
    pageTitle: 'Community Discussion',
    pageDescription: 'Here you can communicate with other users, share experiences, ask questions or make suggestions.',
    giscusInfo: 'About the Comment System',
    giscusDescription: 'The comment system is based on GitHub Discussions. You need to log in with your GitHub account to post comments.',
    viewOnGithub: 'View discussions on GitHub',
    loadError: 'Failed to load comment system, please refresh the page and try again',
    loginWithGithub: 'Login with GitHub',
    logout: 'Logout',
    loginSuccess: 'Login successful!',
    logoutSuccess: 'Logged out'
  },
  playbook: {
    title: 'Playbook Details',
    description: 'View Playbook details and discussions'
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
  dialog: {
    close: 'Close',
    viewOnGithub: 'View on GitHub',
    description: 'Description',
    tags: 'Tags',
    comments: 'Comments'
  },
  categories: {
    undefined: 'Undefined'
  }
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh',
  globalInjection: true, // 全局注入
  messages: {
    zh,
    en
  }
})

export default i18n
