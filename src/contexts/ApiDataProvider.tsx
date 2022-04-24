import React, { useReducer } from "react";

const initial = {} as any;
export const ApiDataContext = React.createContext(null);

export const ApiDataProvider: React.FC<any> = ({ children }) => {
  const apiDataReducer = (state: any, action: any) => {
    switch (action.type) {
      case "pending":
        return {
          ...state,
          [action.call]: {
            state: "pending",
            response: null,
            error: null,
          },
        };

      case "success":
        return {
          ...state,
          [action.call]: {
            state: "success",
            response: action.data,
            error: null,
          },
        };

      case "failed":
        return {
          ...state,
          [action.call]: {
            state: "failed",
            response: null,
            error: action.error,
          },
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(apiDataReducer, initial);

  return (
    <ApiDataContext.Provider value={[state, dispatch]}>
      {children}
    </ApiDataContext.Provider>
  );
};