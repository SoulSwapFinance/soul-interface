import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'state'
import { AuthenState, AutoSignIn, UserProfile, authenActions } from 'state/auth/reducer'
import { useAppDispatch } from 'state/hooks'

const { setConfirmChangeProfile, updateConnectingWallet, updateProcessingLogin, setAutoSignIn } = authenActions

// connecting metamask ...
export function useIsConnectingWallet(): [boolean, (data: boolean) => void] {
  const dispatch = useAppDispatch()
  const connectingWallet = useSelector((state: AppState) => state.auth.isConnectingWallet)

  const setConnectedWallet = useCallback(
    (data: boolean) => {
      dispatch(updateConnectingWallet(data))
    },
    [dispatch],
  )

  return [connectingWallet, setConnectedWallet]
}

// info relate profile, session
export function useSessionInfo(): AuthenState & { userInfo: UserProfile | undefined } {
  const authen = useSelector((state: AppState) => state.auth)
  const userInfo = useMemo(
    () => (authen.isLogin ? authen.signedUserInfo : authen.anonymousUserInfo),
    [authen.signedUserInfo, authen.anonymousUserInfo, authen.isLogin],
  )
  return { ...authen, userInfo }
}

export const useSetPendingAuthentication = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (value: boolean) => {
      dispatch(updateProcessingLogin(value))
    },
    [dispatch],
  )
}

export const useSetConfirmChangeProfile = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (value: boolean) => {
      dispatch(setConfirmChangeProfile(value))
    },
    [dispatch],
  )
}

export function useIsAutoLoginAfterConnectWallet(): [AutoSignIn, (v: AutoSignIn) => void] {
  const dispatch = useAppDispatch()
  const autoSignIn = useSelector((state: AppState) => state.auth.autoSignIn)

  const setAutoSignInAfterConnect = useCallback(
    (data: AutoSignIn) => {
      dispatch(setAutoSignIn(data))
    },
    [dispatch],
  )

  return [autoSignIn, setAutoSignInAfterConnect]
}