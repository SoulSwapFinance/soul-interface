import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { classNames } from '../../functions'
import { useRouter } from 'next/router'

const LANGUAGES: {
  [x: string]: { flag: string; language: string; dialect?: string }
} = {
  en: {
    flag: '/images/flags/us-flag.png',
    language: `English`,
  },
  de: {
    flag: '/images/flags/de-flag.png',
    language: `German`,
  },
  es: {
    flag: '/images/flags/es-flag.png',
    language: `Spanish`,
  },
  fr: {
    flag: '/images/flags/fr-flag.png',
    language: `French`,
  },
  it: {
    flag: '/images/flags/it-flag.png',
    language: `Italian`,
  },
  tr: {
    flag: '/images/flags/tr-flag.png',
    language: `Turkish`,
  },
  // 'zh-CN': {
  //   flag: '/images/flags/ch-flag.png',
  //   language: `Chinese`,
  //   dialect: '简',
  // },
  // ru: {
  //   flag: '/images/flags/ru-flag.png',
  //   language: `Russian`,
  // },
  // ro: {
  //   flag: '/images/flags/ro-flag.png',
  //   language: `Romanian`,
  // },
  // vi: {
  //   flag: '/images/flags/vi-flag.png',
  //   language: `Vietnamese`,
  // },
  // 'zh-TW': {
  //   flag: '/images/flags/ch-flag.png',
  //   language: `Chinese`,
  //   dialect: '繁',
  // },
  // 'es-AR': {
  //   flag: '/images/flags/es-flag.png',
  //   language: `Spanish`,
  //   dialect: 'AR',
  // },
  // ko: {
  //   flag: '/images/flags/ko-flag.png',
  //   language: `Korean`,
  // },
  // ja: {
  //   flag: '/images/flags/ja-flag.png',
  //   language: `Japanese`,
  // },
}

export default function LangSwitcher() {
  const { locale, locales, asPath } = useRouter()
  const ogStyle = `inline-flex justify-center w-full px-4 py-2 text-sm font-bold bg-transparent border rounded shadow-sm text-primary border-dark-800 hover:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-700 focus:ring-dark-800`
  const statStyle = `flex items-center md:space-x-2 rounded bg-dark-900 border border-dark-800 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`
  const hybridStyle = `flex items-center justify-center px-3 py-2.5 md:space-x-2 rounded bg-dark-900 border border-dark-800 hover:bg-dark-800 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`
  return (
    <Menu as="div" className="relative inline-block text-right">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className={classNames(hybridStyle, ``)}>
              <Image src={LANGUAGES[locale].flag} alt={LANGUAGES[locale].language} width={20} height={20} />
              {/* <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" /> */}
            </Menu.Button>
          </div>

          {/* <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          > */}
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-10 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute right-0 w-[161px] mt-2 origin-top-right divide-y divide-dark-600 rounded shadow-lg bg-dark-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-2 space-y-2">
                {locales.map((locale) => {
                  const { flag, language, dialect } = LANGUAGES[locale]
                  return (
                    <Menu.Item key={locale}>
                      {({ active }) => (
                        <Link href={asPath} locale={locale}>
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-dark-700 text-high-emphesis' : 'text-primary',
                              'group flex items-center px-4 py-2 text-sm hover:bg-dark-700 focus:bg-dark-700 rounded'
                            )}
                          >
                            <Image
                              className="inline w-3 h-3 mr-1 align-middle"
                              src={flag}
                              width={20}
                              height={20}
                              alt={language}
                              aria-hidden="true"
                            />
                            <span className="ml-4">{language}</span>
                            {dialect && (
                              <sup>
                                <small>{dialect}</small>
                              </sup>
                            )}
                          </a>
                        </Link>
                      )}
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
