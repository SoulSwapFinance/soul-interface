import { useState, useEffect } from 'react'
const useLuxorDashboard = () => {
  const url = 'https://ftmapi.soulswap.finance/summary'
  const [luxData, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      fetch(url + '?t=' + new Date().getTime())
        .then((response) => response.json())
        .then((result) => {
          setData(result)
        })
    }
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 10000)
  }, [])
  return { luxData }
}
export default useLuxorDashboard
