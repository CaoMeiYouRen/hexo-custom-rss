import Hexo from 'hexo'
import { json2xml } from './utils/xml'

export type Format = 'rss2' | 'atom' | 'json'

export interface RssFeedConfig {
    tags?: string[]
    categories?: string[]
    path: string
    formats: Format[]
    limit?: number
    content?: boolean
}

export interface CustomRssConfig {
    feeds: RssFeedConfig[]
}

export function customRssPlugin(hexo: Hexo) {
    const config = hexo.config.customRss as CustomRssConfig
    if (!config.feeds?.length) {
        return
    }
    hexo.extend.generator.register('custom-rss', (locals, callback) => {
        const results = config.feeds.flatMap((feedConfig) => {
            if (!feedConfig.formats?.length) {
                feedConfig.formats = ['rss2'] // 默认格式
            }
            const posts = locals.posts.filter((post: { tags: any[], categories: any[] }) => {
                const hasTag = feedConfig.tags ? feedConfig.tags.some((tag) => post.tags.map((t: { name: any }) => t.name).includes(tag)) : true
                const hasCategory = feedConfig.categories ? feedConfig.categories.some((category) => post.categories.map((c: { name: any }) => c.name).includes(category)) : true
                return hasTag && hasCategory
            }).slice(0, feedConfig.limit || locals.posts.length)

            const rssData = {
                rss: {
                    channel: {
                        title: hexo.config.title,
                        link: hexo.config.url,
                        description: hexo.config.description,
                        item: posts.map((post: { title: any, path: any, excerpt: any, content: any, date: Date }) => ({
                            title: post.title,
                            link: `${hexo.config.url}/${post.path}`,
                            description: feedConfig.content !== false ? post.content : post.excerpt,
                            pubDate: post.date.toUTCString(),
                        })),
                    },
                },
            }

            const atomData = {
                feed: {
                    title: hexo.config.title,
                    link: hexo.config.url,
                    subtitle: hexo.config.description,
                    entry: posts.map((post: { title: any, path: any, excerpt: any, content: any, date: Date }) => ({
                        title: post.title,
                        link: `${hexo.config.url}/${post.path}`,
                        summary: post.excerpt,
                        updated: post.date.toISOString(),
                        content: feedConfig.content !== false ? post.content : undefined,
                    })),
                },
            }

            const jsonData = {
                version: 'https://jsonfeed.org/version/1',
                title: hexo.config.title,
                home_page_url: hexo.config.url,
                description: hexo.config.description,
                items: posts.map((post: { title: any, path: any, excerpt: any, content: any, date: Date }) => ({
                    title: post.title,
                    url: `${hexo.config.url}/${post.path}`,
                    content_text: post.excerpt,
                    content_html: feedConfig.content !== false ? post.content : undefined,
                    date_published: post.date.toISOString(),
                })),
            }

            return feedConfig.formats.map((format) => {
                let data: string
                let path = feedConfig.path
                switch (format) {
                    case 'rss2':
                        data = json2xml(rssData, { rootName: 'rss', headless: true, xmldec: { version: '1.0', encoding: 'UTF-8' } })
                        path += '.xml'
                        break
                    case 'atom':
                        data = json2xml(atomData, { rootName: 'feed', headless: true, xmldec: { version: '1.0', encoding: 'UTF-8' } })
                        path += '.atom'
                        break
                    case 'json':
                        data = JSON.stringify(jsonData, null, 2)
                        path += '.json'
                        break
                }
                return {
                    path,
                    data,
                }
            })
        })

        callback(null, results)
    })
}

customRssPlugin(hexo)
