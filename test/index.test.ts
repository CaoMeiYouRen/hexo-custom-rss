import { describe, it, expect, vi, Mock, beforeAll, beforeEach, afterEach } from 'vitest'
import type Hexo from 'hexo'
import Database from 'warehouse'
import { customRss, CustomRssConfig, RssFeedConfig } from '../src/index'
const mockHexo = {
    config: {
        title: 'Test Blog',
        description: 'A test blog',
        url: 'https://example.com',
        language: 'en',
        icon: 'https://example.com/icon.png',
        author: 'Test Author',
        email: 'test@example.com',
        customRss: {
            enable: true,
            feeds: [
                {
                    title: 'Test Feed',
                    description: 'Test feed description',
                    tags: ['test'],
                    categories: ['test'],
                    path: 'feed',
                    formats: ['rss2', 'atom', 'json'],
                    limit: 5,
                    content: true,
                },
            ],
        },
    },
    version: '1.0.0',
    extend: {
        generator: {
            register: vi.fn(),
        },
    },
    posts: {
        filter: vi.fn().mockReturnValue({
            sort: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue([]),
            }),
        }),
    },
} as unknown as Hexo

describe('customRss', () => {
    let db: Database
    let Post: any
    let Tag: any
    let Category: any

    beforeAll(async () => {
        db = new Database()
        Tag = db.model('tags', {
            name: String,
            permalink: String,
            posts: Array,
        })
        Category = db.model('categories', {
            name: String,
            permalink: String,
            posts: Array,
        })
        Post = db.model('posts', {
            title: String,
            permalink: String,
            excerpt: String,
            content: String,
            date: Date,
            updated: Date,
            tags: { type: Database.Schema.Types.Array, ref: 'tags' },
            categories: { type: Database.Schema.Types.Array, ref: 'categories' },
            image: String,
            author: String,
        })
    })

    beforeEach(async () => {
        const inserted = await Post.insert([
            {
                title: 'Test Post',
                permalink: '/test-post',
                excerpt: 'Test excerpt',
                content: 'Test content',
                date: new Date(),
                updated: new Date(),
                tags: [],
                categories: [],
                image: '',
                author: 'Test Author',
            },
        ])
    })

    afterEach(async () => {
        await Post.remove({})
    })
    it('should generate valid RSS feed', async () => {
        const feeds = [
            {
                title: 'Test Feed',
                description: 'Test feed description',
                tags: ['test'],
                categories: ['test'],
                path: 'feed',
                formats: ['rss2', 'atom', 'json'],
                limit: 5,
                content: true,
            },
        ] as RssFeedConfig[]
        const config = {
            enable: true,
            feeds,
        } as CustomRssConfig

        const posts = await Post.find({})

        const callback = vi.fn()
        customRss(mockHexo, config, { posts }, callback)

        expect(callback).toHaveBeenCalled()
        const result = callback.mock.calls[0][1]
        expect(result).instanceOf(Array)
        expect(result[0]).toMatchObject({
            path: 'feed.xml',
            data: expect.any(String),
        })
    })

    it('should handle empty posts', async () => {
        const feeds = [
            {
                title: 'Test Feed',
                description: 'Test feed description',
                tags: ['test'],
                categories: ['test'],
                path: 'feed',
                formats: ['rss2'],
                limit: 5,
                content: true,
            },
        ] as RssFeedConfig[]
        const config = {
            enable: true,
            feeds,
        } as CustomRssConfig

        const posts = await Post.find({})
        posts.length = 0 // clear posts

        const callback = vi.fn()
        customRss(mockHexo, config, { posts }, callback)

        expect(callback).toHaveBeenCalled()
        const result = callback.mock.calls[0][1]
        expect(result).instanceOf(Array)
        expect(result[0]).toMatchObject({
            path: 'feed.xml',
            data: expect.any(String),
        })
    })

    it('should generate different formats', async () => {
        const feeds = [
            {
                title: 'Test Feed',
                description: 'Test feed description',
                tags: ['test'],
                categories: ['test'],
                path: 'feed',
                formats: ['rss2', 'atom', 'json'],
                limit: 5,
                content: true,
            },
        ] as RssFeedConfig[]
        const config = {
            enable: true,
            feeds,
        } as CustomRssConfig

        const posts = await Post.find({})

        const callback = vi.fn()
        customRss(mockHexo, config, { posts }, callback)

        expect(callback).toHaveBeenCalled()
        const result = callback.mock.calls[0][1]
        expect(result).instanceOf(Array)
        expect(result).toHaveLength(3)
        expect(result[0].path).toBe('feed.xml')
        expect(result[1].path).toBe('feed.atom')
        expect(result[2].path).toBe('feed.json')
    })

    it('should respect limit config', async () => {
        const feeds = [
            {
                title: 'Test Feed',
                description: 'Test feed description',
                tags: ['test'],
                categories: ['test'],
                path: 'feed',
                formats: ['rss2'],
                limit: 1,
                content: true,
            },
        ] as RssFeedConfig[]
        const config = {
            enable: true,
            feeds,
        } as CustomRssConfig

        const posts = await Post.find({})

        const callback = vi.fn()
        customRss(mockHexo, config, { posts }, callback)

        expect(callback).toHaveBeenCalled()
        const result = callback.mock.calls[0][1]
        expect(result).instanceOf(Array)
        expect(result[0].data).toBeDefined()
    })
})
