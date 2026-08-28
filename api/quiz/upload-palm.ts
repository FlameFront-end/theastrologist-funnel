type Request = { method?: string }
type Response = { status: (code: number) => Response; setHeader: (name: string, value: string) => Response; json: (value: unknown) => void }

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).setHeader('Content-Type', 'application/json').json({ error: 'method_not_allowed' })
  }
  // Demo endpoint: no binary is persisted. The response matches the original contract.
  return res.status(200).setHeader('Content-Type', 'application/json').json({ ok: true, path: '/demo/palm-photo.webp', stored: false, mode: 'demo' })
}
