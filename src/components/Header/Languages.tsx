import { t } from "@lingui/macro";

const Languages: {
    [x: string]: { flag: string; language: string; abbr: string, dialect?: string }
  } = {
    en: {
      flag: '/images/flags/us-flag.png',
      language: t`English`,
      abbr: t`EN`,
    },
    de: {
      flag: '/images/flags/de-flag.png',
      language: t`German`,
      abbr: t`DE`
    },
    es: {
      flag: '/images/flags/es-flag.png',
      language: t`Spanish`,
      abbr: t`ES`
    },
    fr: {
      flag: '/images/flags/fr-flag.png',
      language: t`French`,
      abbr: t`FR`
    },
    it: {
      flag: '/images/flags/it-flag.png',
      language: t`Italian`,
      abbr: t`IT`
    },
    tr: {
      flag: '/images/flags/tr-flag.png',
      language: t`Turkish`,
      abbr: t`TR`
    },
    // 'zh-CN': {
    //   flag: '/images/flags/ch-flag.png',
    //   language: t`Chinese`,
    //   dialect: '简',
    // },
    // ru: {
    //   flag: '/images/flags/ru-flag.png',
    //   language: t`Russian`,
    // },
    // ro: {
    //   flag: '/images/flags/ro-flag.png',
    //   language: t`Romanian`,
    // },
    // vi: {
    //   flag: '/images/flags/vi-flag.png',
    //   language: t`Vietnamese`,
    // },
    // 'zh-TW': {
    //   flag: '/images/flags/ch-flag.png',
    //   language: t`Chinese`,
    //   dialect: '繁',
    // },
    // 'es-AR': {
    //   flag: '/images/flags/es-flag.png',
    //   language: t`Spanish`,
    //   dialect: 'AR',
    // },
    // ko: {
    //   flag: '/images/flags/ko-flag.png',
    //   language: t`Korean`,
    // },
    // ja: {
    //   flag: '/images/flags/ja-flag.png',
    //   language: t`Japanese`,
    // },
  }

  export default Languages