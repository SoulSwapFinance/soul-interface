import { useContext } from "react";
import { ApiDataContext } from "contexts/ApiDataProvider";

const useApiData = () => {
  const [apiData, dispatchApiData] = useContext(ApiDataContext);

  return { apiData, dispatchApiData };
};

export default useApiData;