import { parseData, parseParam } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockDataMini, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini, mockOutputParam } from './mockOutpuMini'

test('parsed yaml swagger specs correctly', () => {
  expect(parseData(mockDataMini)).toEqual(MockOutputMini)
})

test('parses input param correctly', () => {
  expect(parseParam(mockDataPathForParams)).toEqual(mockOutputParam)
})