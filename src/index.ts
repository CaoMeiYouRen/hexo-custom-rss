import Hexo from 'hexo'
import { json2xml } from './utils/xml'
export interface CustomRssConfig {

}

export function customRssPlugin(hexo: Hexo) {
    const config = hexo.config.customRss as CustomRssConfig

    hexo.extend.generator.register('custom-rss', (locals, callback) => {

    })
}

customRssPlugin(hexo)
