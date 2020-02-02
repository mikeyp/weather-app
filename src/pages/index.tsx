import { NextPage } from 'next'
import fetch from 'unfetch'
import useSWR from 'swr'

const fetcher = async (path: string) => {
  const res = await fetch(path)
  const json = await res.json()
  return json
}

const Page: NextPage = (children) => {
  const { data, error } = useSWR('/api/weather', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>Current temp: {data.currently.temperature}</div>
}


export default Page