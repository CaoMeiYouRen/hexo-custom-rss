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
    follow_challenge?: {
        feedId: string
        userId: string
    }
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
    enable: boolean
    feeds: RssFeedConfig[]
}

export function customRssPlugin(hexo: Hexo) {
    const config = hexo.config.customRss as CustomRssConfig
    if (config?.enable === false || !config?.feeds?.length) {
        return
    }

    hexo.extend.generator.register('rss', (locals, callback) => {
        console.log('customRssPlugin start')
        const results = config.feeds.flatMap((feedConfig) => {
            if (!feedConfig.formats?.length) {
                feedConfig.formats = ['rss2'] // 默认格式
            }
            if (!feedConfig.limit) {
                feedConfig.limit = 10
            }

            const posts = locals.posts.filter((post: Post) => {
                const hasTag = feedConfig?.tags?.some((tag) => post.tags.map((t: { name: any }) => t.name).includes(tag))
                const hasCategory = feedConfig?.categories?.some((category) => post.categories.map((c: { name: any }) => c.name).includes(category))
                return hasTag || hasCategory
            }).slice(0, feedConfig.limit) as Post[]

            const commonData = posts.map((post: Post) => ({
                guid: post.permalink,
                title: post.title,
                link: post.permalink,
                description: feedConfig.content !== false ? post.content : post.excerpt,
                summary: post.excerpt,
                pubDate: post.date.toUTCString(),
                updated: post.date.toISOString(),
                category: [...post.categories, ...post.tags].map((tag) => tag.name),
                image: post.image,
                author: post.author || hexo.config.author,
            }))

            return feedConfig.formats.map((format) => {
                let data: string
                let path = feedConfig.path
                const follow_challenge = feedConfig.follow_challenge || {}
                switch (format) {
                    case 'rss2':
                        path += '.xml'
                        data = json2xml({
                            rss: {
                                channel: {
                                    follow_challenge,
                                    title: hexo.config.title,
                                    link: hexo.config.url,
                                    description: hexo.config.description,
                                    image: {
                                        url: hexo.config.icon,
                                        title: hexo.config.title,
                                        link: hexo.config.url,
                                    },
                                    'atom:link': {
                                        href: hexo.config.url + path,
                                        rel: 'self',
                                        type: 'application/rss+xml',
                                    },
                                    generator: {
                                        uri: 'https://hexo.io',
                                        version: hexo.version,
                                        _: 'hexo-custom-rss',
                                    },
                                    item: commonData.map((item) => ({
                                        guid: item.guid,
                                        title: item.title,
                                        link: item.link,
                                        description: item.description,
                                        pubDate: item.pubDate,
                                        category: item.category,
                                        author: item.author,
                                        enclosure: item.image && {
                                            url: item.image,
                                            type: 'image',
                                        },
                                    })),
                                },
                            },
                        })

                        break
                    case 'atom':
                        path += '.atom'
                        data = json2xml({
                            feed: {
                                follow_challenge,
                                id: hexo.config.url,
                                title: hexo.config.title,
                                link: hexo.config.url,
                                subtitle: hexo.config.description,
                                author: {
                                    name: hexo.config.author,
                                    email: hexo.config.email,
                                },
                                generator: {
                                    uri: 'https://hexo.io',
                                    version: hexo.version,
                                    _: 'hexo-custom-rss',
                                },
                                entry: commonData.map((item) => ({
                                    id: item.guid,
                                    title: item.title,
                                    link: item.link,
                                    content: item.description,
                                    summary: item.summary,
                                    updated: item.updated,
                                    category: item.category,
                                    image: item.image,
                                    author: item.author,
                                })),
                            },
                        })

                        break
                    case 'json':
                        path += '.json'
                        data = JSON.stringify({
                            version: 'https://jsonfeed.org/version/1',
                            follow_challenge,
                            title: hexo.config.title,
                            home_page_url: hexo.config.url,
                            feed_url: hexo.config.url + path,
                            icon: hexo.config.icon,
                            description: hexo.config.description,
                            author: {
                                name: hexo.config.author,
                                email: hexo.config.email,
                            },
                            items: commonData.map((item) => ({
                                id: hexo.config.guid,
                                title: item.title,
                                url: item.link,
                                content_text: item.description,
                                summary: item.summary,
                                date_published: item.updated,
                                tags: item.category,
                                image: item.image,
                                author: item.author,
                            })),
                        }, null, 2)

                        break
                }
                return {
                    path,
                    data,
                }
            })
        })
        console.log('customRssPlugin end')
        callback(null, results)
    })
}

customRssPlugin(hexo)
