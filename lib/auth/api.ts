// lib/auth/api.ts
export interface FieldIssue {
  field: string
  message: string
}

interface ApiErrorBody {
  code: string
  message: string
  retry_after?: number
  attempts_left?: number
  details?: FieldIssue[]
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly retryAfter?: number
  readonly attemptsLeft?: number
  readonly details: FieldIssue[]

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.retryAfter = body.retry_after
    this.attemptsLeft = body.attempts_left
    this.details = body.details ?? []
  }
}

export async function rawPost<T>(endpoint: string, body?: unknown, accessToken?: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')

  let res: Response
  try {
    res = await fetch(`${base}/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body ?? {}),
    })
  } catch {
    throw new ApiError(0, { code: 'network_error', message: "Can't reach the server. Check your connection and try again." })
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const err = data?.error
    throw new ApiError(res.status, {
      code: err?.code ?? (res.status >= 500 ? 'server_error' : 'unknown_error'),
      message: err?.message ?? 'Something went wrong. Please try again.',
      retry_after: err?.retry_after,
      attempts_left: err?.attempts_left,
      details: err?.details,
    })
  }

  return data as T
}

// turns any thrown error into what a form needs: field errors, countdown seconds, attempts left
export function toFormError(err: unknown) {
  if (err instanceof ApiError) {
    const fields: Record<string, string> = {}
    for (const d of err.details) fields[d.field] ??= d.message
    return { code: err.code, message: err.message, fields, retryAfter: err.retryAfter, attemptsLeft: err.attemptsLeft }
  }
  return { code: 'unknown_error', message: 'Something went wrong. Please try again.', fields: {} as Record<string, string>, retryAfter: undefined, attemptsLeft: undefined }
}