import { useRouter } from 'next/router'
import { FC } from 'react'

const Back: FC<{ href?: string }> = ({ href }) => {
  const router = useRouter()
  const action = () => {
    href ? router.push(href) : router.back()
  }
    // back: () => router.back(),
    // forward: () => router.back(),
    // push: (href: string) => router.push(href),
    // replace: (href: string) => router.replace(href),
  return (
    <div>
      <a
        onClick={action}
        className="flex items-center space-x-2 text-base text-center cursor-pointer font text-secondary hover:text-high-emphesis"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{`Back`}</span>
      </a>
    </div>
  )
}

export default Back
