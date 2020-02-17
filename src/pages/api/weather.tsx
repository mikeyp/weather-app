import dotenv from 'dotenv'
import { NextApiRequest, NextApiResponse } from 'next'
import faunadb from 'faunadb'
import DarkSky from 'dark-sky'

dotenv.config()

const darksky = new DarkSky(process.env.DARK_SKY_KEY)
const q = faunadb.query

const latitude = 40.1973041
const longitude = -84.636513

const refreshForecast = async () => {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
  const forecast = await darksky.options({
    latitude,
    longitude
  })
    .language('en')
    .exclude('minutely,daily')
    .units('us')
    .get()

  client.query(
    q.Do(
      q.Update(
        q.Select([ "ref" ], q.Get(q.Match(q.Index("kv_key"), "forecast"))),
        { data: { key: "forecast", value: forecast } }
      ),
      q.Update(
        q.Select([ "ref" ], q.Get(q.Match(q.Index("kv_key"), "timestamp"))),
        { data: { key: "timestamp", value: Math.floor(Date.now() / 1000) } }
      )
    )
  )

  return forecast
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
  try {
    const timestamp = await client.query(
      q.Select(["data", "value"], q.Get(q.Match(q.Index("kv_key"), "timestamp")))
    )


    if (timestamp < (Math.floor(Date.now() / 1000) - 179)) {
      const newForecast = await refreshForecast()
      res.status(200).json(newForecast)
    }
    else {
      const forecast = await client.query(
        q.Select(["data", "value"], q.Get(q.Match(q.Index("kv_key"), "forecast")))
      )
      res.status(200).json(forecast)
    }


  } catch (err) {
    res.status(400).json({ error: err })
    console.error(err)
  }
}