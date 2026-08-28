import { randomUUID } from 'node:crypto'

type Request = { method?: string; body?: unknown }
type Response = { status: (code: number) => Response; setHeader: (name: string, value: string) => Response; json: (value: unknown) => void }
async function readBody(req: Request) {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>
  return {}
}
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).setHeader('Content-Type', 'application/json').json({ error: 'method_not_allowed' })
  }
  const body = await readBody(req)
  const sessionId = typeof body.sessionId === 'string' && body.sessionId ? body.sessionId : randomUUID()
  return res.status(200).setHeader('Content-Type', 'application/json').json({ ok: true, sessionId, persisted: false, mode: 'demo' })
}
