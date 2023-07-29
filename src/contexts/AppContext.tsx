import React, { createContext, ReactNode, useContext, useReducer } from "react"
// import { API_URL } from "config/constants"
import CoinGeckoService from "services/data/CoinGeckoService"
import { DataService } from "services/data/DataTypes"
import RestDataService from "services/data/RestDataService"
// import CalculateService from "services/utils/CalculateService"
import TokenUtilService from "services/utils/TokenUtilService"
import Reducer, { initialState } from "stores/reducer"
import { ActionValues, State } from "stores/types"

export const API_URL: string = process.env.API_URL || "http://localhost:8000";

export const handleLogoError = (event: React.SyntheticEvent) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.src = "/icon-quiz.jpg"
}
interface AppContextProps {
  store: [State, React.Dispatch<ActionValues>]
  dataService: DataService
  handleLogoError: (event: React.SyntheticEvent) => void
  coinGeckoService: CoinGeckoService
  // calculateService: CalculateService
  tokenUtilService: TokenUtilService
}
const AppContext = createContext<AppContextProps>({} as AppContextProps)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  const dataService = RestDataService(API_URL)
  const coinGeckoService = CoinGeckoService.getInstance()
  // const calculateService = CalculateService.getInstance()
  const tokenUtilService = TokenUtilService.getInstance()

  return (
    <AppContext.Provider
      value={{
        store: [state, dispatch],
        dataService,
        coinGeckoService,
        // calculateService,
        tokenUtilService,
        handleLogoError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

export const useStore = () => {
  const { store } = useContext(AppContext)
  return store
}

export const useDataService = () => {
  const { dataService } = useAppContext()
  return dataService
}

export const useCoingeckoService = () => {
  const { coinGeckoService } = useAppContext()
  return coinGeckoService
}

// export const useCalculateService = () => {
//   const { calculateService } = useAppContext()
//   return calculateService
// }

export const useTokenUtilService = () => {
  const { tokenUtilService } = useAppContext()
  return tokenUtilService
}