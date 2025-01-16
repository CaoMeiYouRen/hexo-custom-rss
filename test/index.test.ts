import { describe, it, expect, vi, Mock } from 'vitest'
import type Hexo from 'hexo'
import { customRssPlugin, customRss } from '../src/index'

describe('customRssPlugin', () => {
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

    it('should register generator when enabled', () => {
        customRssPlugin(mockHexo)
        expect(mockHexo.extend.generator.register).toHaveBeenCalledWith('rss', expect.any(Function))
    })

    it('should not register generator when disabled', () => {
        const disabledHexo = {
            ...mockHexo,
            config: {
                ...mockHexo.config,
                customRss: {
                    enable: false,
                },
            },
        } as unknown as Hexo
        customRssPlugin(disabledHexo)
        expect(mockHexo.extend.generator.register).not.toHaveBeenCalled()
    })

})

describe('customRss', () => {

})

