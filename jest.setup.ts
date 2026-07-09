import '@testing-library/jest-dom'

// MSW v2 (built on undici) relies on Web APIs that jest's jsdom environment
// does not provide out of the box. `require` (instead of ESM imports, which
// hoist above this point) keeps the polyfills in the exact order undici needs:
// TextEncoder/TextDecoder must exist globally before undici itself loads.
const { TextDecoder, TextEncoder } = require('node:util')
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web')
const { Blob, File } = require('node:buffer')
const { BroadcastChannel, MessageChannel, MessagePort } = require('node:worker_threads')

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, configurable: true },
  TextDecoder: { value: TextDecoder, configurable: true },
  ReadableStream: { value: ReadableStream, configurable: true },
  TransformStream: { value: TransformStream, configurable: true },
  WritableStream: { value: WritableStream, configurable: true },
  Blob: { value: Blob, configurable: true },
  File: { value: File, configurable: true },
  MessageChannel: { value: MessageChannel, configurable: true },
  MessagePort: { value: MessagePort, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, configurable: true },
})

const { fetch, FormData, Headers, Request, Response } = require('undici')

Object.defineProperties(globalThis, {
  fetch: { value: fetch, configurable: true, writable: true },
  Headers: { value: Headers, configurable: true },
  FormData: { value: FormData, configurable: true },
  Request: { value: Request, configurable: true },
  Response: { value: Response, configurable: true },
})
