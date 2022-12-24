import { t } from "@lingui/macro";

const Languages: {
    [x: string]: { flag: string; language: string; dialect?: string }
  } = {
    // usa: {
    //   flag: '/images/flags/us-flag.png',
    //   language: t`American`,
    // },
    en: {
      flag: '/images/flags/us-flag.png',
      language: t`English`,
    },
    de: {
      flag: '/images/flags/de-flag.png',
      language: t`German`,
    },
    it: {
      flag: '/images/flags/it-flag.png',
      language: t`Italian`,
    },
    ru: {
      flag: '/images/flags/ru-flag.png',
      language: t`Russian`,
    },
    ro: {
      flag: '/images/flags/ro-flag.png',
      language: t`Romanian`,
    },
    vi: {
      flag: '/images/flags/vi-flag.png',
      language: t`Vietnamese`,
    },
    tr: {
      flag: '/images/flags/tr-flag.png',
      language: t`Turkish`,
    },
    'zh-CN': {
      flag: '/images/flags/ch-flag.png',
      language: t`Chinese`,
      dialect: '简',
    },
    'zh-TW': {
      flag: '/images/flags/ch-flag.png',
      language: t`Chinese`,
      dialect: '繁',
    },
    es: {
      flag: '/images/flags/es-flag.png',
      language: t`Spanish`,
    },
    'es-AR': {
      flag: '/images/flags/es-flag.png',
      language: t`Spanish`,
      dialect: 'AR',
    },
    ko: {
      flag: '/images/flags/ko-flag.png',
      language: t`Korean`,
    },
    ja: {
      flag: '/images/flags/ja-flag.png',
      language: t`Japanese`,
    },
    fr: {
      flag: '/images/flags/fr-flag.png',
      language: t`French`,
    },
  }

  export default Languages