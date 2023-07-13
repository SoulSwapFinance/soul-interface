module.exports = {
  catalogs: [
    {
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {},
  // format: 'po-gettext',
  formatOptions: { 
    origins: false,
    lineNumbers: false
  },
  sourceLocale: 'en',
  locales: 
  ['en', 'es', 'de', 'fr', 'it', 'tr'],
  // ['de', 'en', 'es', 'es-AR', 'it', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'fr', 'tr'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: 'src',
}
