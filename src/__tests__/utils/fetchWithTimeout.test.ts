import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchWithTimeout } from '@/utils/fetchWithTimeout'

describe('fetchWithTimeout', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns response on successful fetch', async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      statusText: 'OK',
    })
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse)

    const result = await fetchWithTimeout('https://api.example.com/data')

    expect(result.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        headers: expect.any(Headers),
        signal: expect.any(AbortSignal),
      })
    )
  })

  it('throws descriptive error on HTTP failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: 'Internal Server Error' })
    )

    await expect(fetchWithTimeout('https://api.example.com/data')).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    )
  })

  it('throws timeout error when request aborts', async () => {
    const abortError = new Error('AbortError')
    abortError.name = 'AbortError'
    vi.mocked(fetch).mockRejectedValueOnce(abortError)

    await expect(
      fetchWithTimeout('https://api.example.com/data', {}, { timeout: 1 })
    ).rejects.toThrow('Request timed out')
  })
})
