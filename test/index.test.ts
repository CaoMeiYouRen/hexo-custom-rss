import { describe, it, expect, vi, Mock } from 'vitest'
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

describe('customRss', async () => {
    const db = new Database()
    const Tag = db.model('tags', {
        name: String,
        permalink: String,
        posts: Array,
    })
    const Category = db.model('categories', {
        name: String,
        permalink: String,
        posts: Array,
    })
    const Post = db.model('posts', {
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
    await Post.insert([
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

})
