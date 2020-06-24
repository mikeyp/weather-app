import { NextPage } from 'next'
import fetch from 'node-fetch'
import moment from 'moment'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

const Page: NextPage = () => {
  const [updatedAt, setUpdatedAt] = useState('')

  const options = {
    refreshInterval: 25000, // 25 seconds
    onSuccess: (data) => {
      setUpdatedAt(moment.unix(data.currently.time).fromNow());
    }
  }

  const { data, error } = useSWR('/api/weather', fetcher, options)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading data....</div>

  return (
    <div>
      <div>Current temp: { data.currently.temperature }</div>
      <div>Forecast age: { updatedAt }</div>
    </div>
  )
}

export default Page