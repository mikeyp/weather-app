import dotenv from 'dotenv'
import { NextApiRequest, NextApiResponse } from 'next'
import DarkSky from 'dark-sky'

dotenv.config()

const darksky = new DarkSky(process.env.DARK_SKY_KEY)

const latitude = 40.1973041
const longitude = -84.636513

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const forecast = await darksky.options({
      latitude,
      longitude
    })
    .get()
    res.status(200).json(forecast)
  } catch (err) {
    console.log(err)
  }
}