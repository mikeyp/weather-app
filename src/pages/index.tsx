import { NextPage } from 'next'
import fetch from 'unfetch'
import moment from 'moment'
import { useState, useEffect } from 'react'

const Page: NextPage = (children) => {
  const [loaded, setLoaded] = useState(false)
  const [updatedAt, setUpdatedAt] = useState('')
  const [forecast, setForecast] = useState({ currently:  { time: 0, temperature: 0} })

  const updateForecast = () => {
    console.log("updating forecast")
    fetch('/api/weather')
      .then(r => r.json())
      .then(data => {
        setForecast(data)
        setUpdatedAt(getFormattedDate(data.currently.time));
      })
      .then(() => setLoaded(true))
  }

  useEffect(() => {
    updateForecast()
    const updateInterval = setInterval(() => {
      updateForecast()
    }, 1000 * 60)
  }, [])

  useEffect(() => {
    if (loaded) {
      const interval = setInterval(() => {
        setUpdatedAt(getFormattedDate(forecast.currently.time));
      }, 4000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [forecast, loaded])

  const getFormattedDate = (time) => {
    return moment.unix(time).fromNow()
  }

  return (
    <div>
      { loaded &&
        <>
          <div>Current temp: { forecast.currently.temperature }</div>
        <div>Forecast age: { updatedAt }</div>
        </>
      }
    </div>
  )
}


export default Page