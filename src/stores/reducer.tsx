import { DataService } from "../services/data/DataTypes"
import { ActionTypes, ActionValues, State } from "./types"

export const initialState = {
  loading: false,
  auth: null,
  dataService: {} as DataService,
}

export const Reducer = (state: State, action: ActionValues): State => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case ActionTypes.SET_AUTH:
      return { ...state, auth: action.payload }
    default:
      throw new Error()
  }
}
export default Reducer