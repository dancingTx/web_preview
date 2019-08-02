module.exports = {
    base: '/web_preview/',
    title: '技术博客',
    description: '一个专门写技术的博客',
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    themeConfig: {
        // 导航栏
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide' },
            {
                text: '选择语言',
                items:
                    [
                        { text: '简体中文', link: '/language/simple-chinese' },
                        { text: 'English', link: '/language/english' }
                    ]
            },
            { text: 'Github', link: '/github' },
        ],
        // 侧边栏
        sidebar: [
            {
                title: 'Group 1',
                collapsable: false,
                children: [
                    '/about',
                    '/concat'
                ]
            },
            {
                title: 'Group 2',
                children: [ 
                    '/foo/one'
                ]
            }
        ],
        lastUpdated: 'Last Updated', // string | boolean
    }
}