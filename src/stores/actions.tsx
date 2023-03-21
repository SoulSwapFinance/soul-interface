import { ActionTypes, ActionValues, State } from "./types"

export const setAuth = (
  payload: number | string | boolean | State | any | null
): ActionValues => {
  return {
    type: ActionTypes.SET_AUTH,
    payload,
  }
}

export const setLoading = (
  payload: boolean
): ActionValues => {
  return {
    type: ActionTypes.SET_LOADING,
    payload,
  }
}