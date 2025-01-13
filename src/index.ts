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

export interface Post {
    title: string
    permalink: string
    excerpt: string
    content: string
    date?: Date
    tags?: any[]
    categories?: any[]
    image?: string
    author?: string
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

            const posts = locals.posts.filter((post: Post) => {
                const hasTag = feedConfig.tags ? feedConfig.tags.some((tag) => post.tags.map((t: { name: any }) => t.name).includes(tag)) : true
                const hasCategory = feedConfig.categories ? feedConfig.categories.some((category) => post.categories.map((c: { name: any }) => c.name).includes(category)) : true
                return hasTag && hasCategory
            }).slice(0, feedConfig.limit || locals.posts.length) as Post[]

            const commonData = posts.map((post: Post) => ({
                guid: post.permalink,
                title: post.title,
                link: post.permalink,
                description: feedConfig.content !== false ? post.content : post.excerpt,
                summary: post.excerpt,
                pubDate: post.date.toUTCString(),
                updated: post.date.toISOString(),
                category: post.tags.map((tag) => tag.name),
                image: post.image,
                author: post.author || hexo.config.author,
            }))

            return feedConfig.formats.map((format) => {
                let data: string
                let path = feedConfig.path
                switch (format) {
                    case 'rss2':
                        data = json2xml({
                            rss: {
                                channel: {
                                    guid: hexo.config.guid,
                                    title: hexo.config.title,
                                    link: hexo.config.url,
                                    description: hexo.config.description,
                                    item: commonData.map((item) => ({
                                        title: item.title,
                                        link: item.link,
                                        description: item.description,
                                        pubDate: item.pubDate,
                                        category: item.category,
                                        image: item.image,
                                    })),
                                },
                            },
                        })
                        path += '.xml'
                        break
                    case 'atom':
                        data = json2xml({
                            feed: {
                                id: hexo.config.guid,
                                title: hexo.config.title,
                                link: hexo.config.url,
                                subtitle: hexo.config.description,
                                entry: commonData.map((item) => ({
                                    title: item.title,
                                    link: item.link,
                                    content: item.description,
                                    summary: item.summary,
                                    updated: item.updated,
                                    category: item.category,
                                    image: item.image,
                                })),
                            },
                        })
                        path += '.atom'
                        break
                    case 'json':
                        data = JSON.stringify({
                            version: 'https://jsonfeed.org/version/1',
                            title: hexo.config.title,
                            home_page_url: hexo.config.url,
                            description: hexo.config.description,
                            items: commonData.map((item) => ({
                                id: hexo.config.guid,
                                title: item.title,
                                url: item.link,
                                content_text: item.description,
                                summary: item.summary,
                                date_published: item.updated,
                                tags: item.category,
                                image: item.image,
                            })),
                        }, null, 2)
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
