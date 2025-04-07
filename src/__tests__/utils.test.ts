import { parseData } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockData } from './mockInput'
import { MockOutputMini } from './mockOutpuMini'

test('parsed yaml swagger specs correctly', () => {
  expect(parseData(mockDataMini)).toEqual(MockOutputMini)
})