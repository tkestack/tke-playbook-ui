#!/usr/bin/env node

/**
 * 生成目录数据脚本
 * 扫描项目目录中的 __meta__.txt 文件，生成 directories.json
 */

const fs = require('fs')
const path = require('path')

// 改进的 TOML 解析器（支持多行字符串和注释）
function parseToml(content) {
    const result = {}
    const lines = content.split('\n')
    let i = 0

    while (i < lines.length) {
        const line = lines[i].trim()
        
        // 跳过空行和注释行
        if (!line || line.startsWith('#')) {
            i++
            continue
        }

        // 匹配 key = value 格式
        const match = line.match(/^(\w+)\s*=\s*(.*)$/)
        if (match) {
            const [, key, valueStart] = match
            let value = valueStart.trim()

            // 处理多行字符串（以单引号或双引号开始但不结束的情况）
            if ((value.startsWith("'") && !value.endsWith("'")) || 
                (value.startsWith('"') && !value.endsWith('"'))) {
                
                const quote = value[0]
                let multilineValue = value.substring(1) // 去掉开始的引号
                i++
                
                // 继续读取后续行直到找到结束引号
                while (i < lines.length) {
                    const nextLine = lines[i]
                    if (nextLine.trim().endsWith(quote)) {
                        // 找到结束引号
                        multilineValue += '\n' + nextLine.trim().slice(0, -1) // 去掉结束的引号
                        break
                    } else {
                        multilineValue += '\n' + nextLine
                    }
                    i++
                }
                
                result[key] = multilineValue.trim()
            } else {
                // 处理单行值
                // 先检查是否有行内注释（但要小心引号内的#）
                let cleanValue = value
                
                if (value.startsWith('[') && value.endsWith(']')) {
                    // 数组格式: ["item1", "item2"]
                    try {
                        result[key] = JSON.parse(value)
                    } catch {
                        result[key] = []
                    }
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    // 单引号字符串
                    result[key] = value.slice(1, -1)
                } else if (value.startsWith('"') && value.endsWith('"')) {
                    // 双引号字符串
                    result[key] = value.slice(1, -1)
                } else if (value === 'true' || value === 'false') {
                    // 布尔值
                    result[key] = value === 'true'
                } else {
                    // 其他情况，可能包含行内注释
                    const commentIndex = value.indexOf('#')
                    if (commentIndex !== -1) {
                        cleanValue = value.substring(0, commentIndex).trim()
                    }
                    result[key] = cleanValue
                }
            }
        }
        
        i++
    }

    return result
}

// 递归扫描目录获取所有项目
function scanDirectories(rootPath) {
    const directories = []

    // 递归查找 __meta__.txt 文件
    function scanRecursively(currentPath) {
        try {
            const items = fs.readdirSync(currentPath, { withFileTypes: true })

            for (const item of items) {
                const fullPath = path.join(currentPath, item.name)
                
                // 跳过隐藏目录
                if (item.name.startsWith('.')) {
                    continue
                }

                if (item.isDirectory()) {
                    // 递归扫描子目录
                    scanRecursively(fullPath)
                } else if (item.isFile() && item.name === '__meta__.txt') {
                    // 找到 __meta__.txt 文件
                    const dirPath = path.dirname(fullPath)
                    const dirName = path.basename(dirPath)
                    
                    try {
                        const metaContent = fs.readFileSync(fullPath, 'utf-8')
                        const meta = parseToml(metaContent)

                        // 跳过草稿项目
                        if (meta.draft === true) {
                            console.log(`跳过草稿项目: ${dirName}`)
                            continue
                        }

                        // 计算文件数量
                        const fileCount = countFiles(dirPath)

                        // 获取目录统计信息
                        const stats = fs.statSync(dirPath)

                        // 计算相对于根路径的相对路径
                        const relativePath = path.relative(rootPath, dirPath).replace(/\\/g, '/');

                        const directory = {
                            name: meta.title || dirName,
                            nameEn: meta.title_en || meta.title || dirName, // 英文标题
                            directoryName: dirName, // 保存实际的目录名用于跳转
                            relativePath: relativePath, // 保存相对于根路径的完整路径
                            description: meta.description || '暂无描述',
                            descriptionEn: meta.description_en || meta.description || 'No description available', // 英文描述
                            createdAt: stats.birthtime.toISOString(),
                            updatedAt: stats.mtime.toISOString(),
                            fileCount: fileCount,
                            tags: meta.tag || [],
                            tagsEn: meta.tag_en || meta.tag || [], // 英文标签
                            status: 'active',
                            category: meta.class || '未定义',
                            categoryEn: meta.class_en || meta.class || 'Undefined', // 英文分类
                            icon: 'Document',
                            color: getColorByCategory(meta.class || '未定义'),
                            playbookUrl: meta.playbook_url || null // 添加自定义URL字段
                        }

                        directories.push(directory)
                        console.log(`处理项目: ${directory.name} (分类: ${directory.category})`)

                    } catch (error) {
                        console.error(`解析 ${fullPath} 失败:`, error.message)
                    }
                }
            }
        } catch (error) {
            console.error(`扫描目录 ${currentPath} 失败:`, error.message)
        }
    }

    // 开始递归扫描
    scanRecursively(rootPath)
    return directories
}

// 计算目录中的文件数量
function countFiles(dirPath) {
    let count = 0
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true })
        for (const item of items) {
            if (item.isFile()) {
                count++
            } else if (item.isDirectory() && !item.name.startsWith('.')) {
                count += countFiles(path.join(dirPath, item.name))
            }
        }
    } catch (error) {
        // 忽略权限错误等
    }
    return count
}

// 根据分类获取颜色
function getColorByCategory(category) {
    const colors = {
        'API': '#67C23A',
        '数据库': '#E6A23C',
        'DevOps': '#F56C6C',
        '模板': '#409EFF',
        '分类1': '#409EFF',
        '未定义': '#909399'
    }
    return colors[category] || '#409EFF'
}

// 主函数
function main() {
    console.log('开始生成目录数据...')

    const rootPath = process.cwd()
    const directories = scanDirectories(rootPath)

    const data = {
        lastUpdate: new Date().toISOString(),
        totalCount: directories.length,
        directories: directories
    }

    const outputPath = path.join(rootPath, 'public', 'directories.json')

    // 确保 public 目录存在
    const publicDir = path.dirname(outputPath)
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`\n生成完成！`)
    console.log(`- 总项目数: ${directories.length}`)
    console.log(`- 输出文件: ${outputPath}`)

    // 显示分类统计
    const categoryStats = {}
    directories.forEach(dir => {
        categoryStats[dir.category] = (categoryStats[dir.category] || 0) + 1
    })

    console.log('\n分类统计:')
    Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} 个项目`)
    })
}

// 运行脚本
if (require.main === module) {
    main()
}

module.exports = { parseToml, scanDirectories }
