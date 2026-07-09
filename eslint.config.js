import { defineConfig } from 'eslint/config'
import cmyr from 'eslint-config-cmyr'

export default defineConfig([
    cmyr,
    {
        languageOptions: {
            globals: {
                hexo: true,
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
])
