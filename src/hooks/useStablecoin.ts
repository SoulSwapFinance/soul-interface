import { useState, useEffect } from 'react'
const useStablecoin = () => {
    // TODO: update URL
  const url = 'https://api.thorus.fi/stable.json'
  // const [data, setData] = useState(null)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetch(url + '?t=' + new Date().getTime())
  //       .then((response) => response.json())
  //       .then((result) => {
  //         setData(result)
  //       })
  //   }
  //   fetchData()

  //   const interval = setInterval(() => {
  //     fetchData()
  //   }, 10000)
  // }, [])
  // return { data }
}
export default useStablecoin
