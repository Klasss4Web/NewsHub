import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from './logger.js'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.LOG_LEVEL
  })

  it('logs info messages by default', () => {
    logger.info('test message')
    expect(console.log).toHaveBeenCalledOnce()
    expect((console.log as ReturnType<typeof vi.fn>).mock.calls[0][1]).toBe(
      'test message'
    )
  })

  it('logs error messages', () => {
    logger.error('something went wrong')
    expect(console.error).toHaveBeenCalledOnce()
  })

  it('respects LOG_LEVEL', () => {
    process.env.LOG_LEVEL = 'error'
    logger.info('ignored')
    expect(console.log).not.toHaveBeenCalled()
    logger.error('logged')
    expect(console.error).toHaveBeenCalledOnce()
  })
})
