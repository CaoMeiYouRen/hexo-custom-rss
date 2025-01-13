import Hexo from 'hexo'
import { json2xml } from './utils/xml'

export type Format = 'rss2' | 'atom' | 'json'

export interface RssFeedConfig {
    title?: string
    description?: string
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
        const results = config.feeds.flatMap((feedConfig) => {
            if (!feedConfig.formats?.length) {
                feedConfig.formats = ['rss2'] // 默认格式
            }
            if (!feedConfig.limit) {
                feedConfig.limit = 10
            }

            const posts = locals.posts.filter((post: Post) => {
                const postTags = post.tags ? post.tags.map((tag: { name: string }) => tag.name) : []
                const postCategories = post.categories ? post.categories.map((category: { name: string }) => category.name) : []
                const hasTag = feedConfig?.tags?.some((tag) => postTags.includes(tag))
                const hasCategory = feedConfig?.categories?.some((category) => postCategories.includes(category))
                return hasTag || hasCategory
            }).slice(0, feedConfig.limit) as Post[]

            const commonData = posts.map((post: Post) => ({
                guid: post.permalink,
                title: post.title,
                link: post.permalink,
                description: feedConfig.content !== false ? post.content : post.excerpt,
                summary: post.excerpt,
                pubDate: new Date(post.date).toUTCString(),
                updated: new Date(post.date).toISOString(),
                category: [...post.categories.map((category: { name: string }) => category.name), ...post.tags.map((tag: { name: string }) => tag.name)],
                image: post.image,
                author: post.author || hexo.config.author,
            }))

            return feedConfig.formats.map((format) => {
                let data: string
                let path = feedConfig.path
                const follow_challenge = feedConfig.follow_challenge
                const title = feedConfig.title || hexo.config.title
                const description = feedConfig.description || hexo.config.description
                switch (format) {
                    case 'rss2':
                        path += '.xml'
                        data = json2xml({
                            $: {
                                version: '2.0',
                            },
                            channel: {
                                follow_challenge,
                                title,
                                link: hexo.config.url,
                                description,
                                image: {
                                    url: hexo.config.icon,
                                    title,
                                    link: hexo.config.url,
                                },
                                'atom:link': {
                                    $: {
                                        href: hexo.config.url + path,
                                        rel: 'self',
                                    },
                                    type: 'application/rss+xml',
                                },
                                generator: {
                                    $: {
                                        uri: 'https://hexo.io',
                                        version: hexo.version,
                                    },
                                    _: 'Hexo',
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
                        }, { rootName: 'rss' })

                        break
                    case 'atom':
                        path += '.atom'
                        data = json2xml({
                            $: {
                                xmlns: 'http://www.w3.org/2005/Atom',
                            },
                            follow_challenge,
                            id: hexo.config.url,
                            title,
                            link: hexo.config.url,
                            subtitle: description,
                            author: {
                                name: hexo.config.author,
                                email: hexo.config.email,
                            },
                            generator: {
                                $: {
                                    uri: 'https://hexo.io',
                                    version: hexo.version,
                                },
                                _: 'Hexo',
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
                        }, { rootName: 'feed' })

                        break
                    case 'json':
                        path += '.json'
                        data = JSON.stringify({
                            version: 'https://jsonfeed.org/version/1',
                            follow_challenge,
                            title,
                            home_page_url: hexo.config.url,
                            feed_url: hexo.config.url + path,
                            icon: hexo.config.icon,
                            description,
                            author: {
                                name: hexo.config.author,
                                email: hexo.config.email,
                            },
                            items: commonData.map((item) => ({
                                id: hexo.config.guid,
                                title: item.title,
                                url: item.link,
                                content_html: item.description,
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
        callback(null, results)
    })
}

customRssPlugin(hexo)
