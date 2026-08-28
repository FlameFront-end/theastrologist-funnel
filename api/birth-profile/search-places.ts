type Request = { method?: string; query?: Record<string, string | string[] | undefined> }
type Response = { status: (code: number) => Response; setHeader: (name: string, value: string) => Response; json: (value: unknown) => void }

const PLACES = [
  { name: 'Москва, Россия', tz: 'Europe/Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Санкт-Петербург, Россия', tz: 'Europe/Moscow', lat: 59.9343, lon: 30.3351 },
  { name: 'Минск, Беларусь', tz: 'Europe/Minsk', lat: 53.9006, lon: 27.559 },
  { name: 'Киев, Украина', tz: 'Europe/Kyiv', lat: 50.4501, lon: 30.5234 },
  { name: 'Варшава, Польша', tz: 'Europe/Warsaw', lat: 52.2297, lon: 21.0122 },
]

export default function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).setHeader('Content-Type', 'application/json').json({ error: 'method_not_allowed' })
  }
  const raw = req.query?.q
  const query = (Array.isArray(raw) ? raw[0] : raw ?? '').trim().toLocaleLowerCase('ru')
  const results = query.length < 2 ? [] : PLACES.filter(place => place.name.toLocaleLowerCase('ru').includes(query)).slice(0, 8)
  return res.status(200).setHeader('Content-Type', 'application/json').json({ results })
}
