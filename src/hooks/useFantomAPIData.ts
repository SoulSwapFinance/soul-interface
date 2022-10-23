import { useContext } from "react";
import { FantomApiContext } from "contexts/FantomApiProvider";

const useFantomApiData = () => {
  const [apiData, dispatchApiData] = useContext(FantomApiContext);
  return { apiData, dispatchApiData };
};

export default useFantomApiData;