/* eslint-disable @next/next/no-img-element */
import { useAppContext } from "contexts/AppContext"
import { Token } from "../../types/Token"

const Hero = ({ data: token }: { data?: Token }) => {
  const { tokenUtilService } = useAppContext()
  const handleLogoError = (event: React.SyntheticEvent) => {
    const imgElement = event.target as HTMLImageElement
    imgElement.src = "/icon-quiz.jpg"
  }

  return (
    <div className="bg-black">
      <div className="container px-4 py-24 mx-auto">
        {!token ? (
          <div className="flex items-center col-span-2">
            <div>
              <div className="inline-block w-8 h-8 rounded-full loading-black"></div>
            </div>
            <div className="ml-2">
              <div>
                <div className="inline-block w-40 h-8 rounded loading-black"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center col-span-2">
            <div>
              <img
                src={tokenUtilService.logo(token?.symbol)}
                width="30px"
                height="30px"
                className="inline-block rounded-full"
                onError={handleLogoError}
                alt={token?.symbol}
              />
            </div>
            <div className="ml-2">
              <h2 className="text-3xl font-medium text-white">
                {tokenUtilService.symbol(token?.symbol)}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero