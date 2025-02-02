import { useRouter } from 'next/router'
import React from 'react'
import Image from 'next/image'

export default function Custom404() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <div className="w-[300px] h-[300px]">
        {/* <Image src="/images/404.png" alt="404" width={300} height={300} /> */}
        {'Error'}
      </div>
      <div className="text-2xl font-bold">Page Not Found</div>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 text-lg font-semibold text-white rounded bg-blue hover:bg-blue/90"
      >
        Go Home
      </button>
    </div>
  )
}