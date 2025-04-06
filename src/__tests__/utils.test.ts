import { parseData } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockData } from './mockInput'

test('parsed yaml swagger specs correctly', () => {
  expect(parseData(mockData)).toEqual(expectedParsedData)
})