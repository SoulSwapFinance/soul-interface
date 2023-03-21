export interface State {
    loading?: boolean;
    auth?: any;
  }
  
  export interface ActionValues {
    type: string;
    payload: number | string | boolean | State | any | null;
  }
  
  export enum ActionTypes {
    SET_LOADING = "SET_LOADING",
    SET_AUTH = "SET_AUTH",
  }