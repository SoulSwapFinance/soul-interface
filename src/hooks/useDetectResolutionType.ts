import { useEffect, useState } from "react";

const useDetectResolutionType = () => {
  const [width, setWidth] = useState(window.innerWidth);
  let timeout: any;
  const handleWindowSizeChange = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setWidth(window.innerWidth);
    }, 300);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const getResolutionType = () => {
    if (width <= 576) {
      return "mobile";
    }
    if (width <= 768) {
      return "tablet";
    }
    if (width <= 1200) {
      return "desktop";
    }
    return "ultra";
  };

  return { resolutionType: getResolutionType(), width };
};

export default useDetectResolutionType;