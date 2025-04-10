import { parseData, parseEnumProperty, parseParam } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockDataMini, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini, mockOutputParam } from './mockOutpuMini'
import { mockDataForEnumParsingExpectedOutput1, mockDataForEnumParsingExpectedOutput2, mockDataForEnumParsingExpectedOutput3, mockDataForEnumParsingExpectedOutput4, mockDataForEnumParsingInput1, mockDataForEnumParsingInput2, mockDataForEnumParsingInput3, mockDataForEnumParsingInput4 } from './mockDataPairs'

// test('parsed yaml swagger specs correctly', () => {
//   expect(parseData(mockDataMini)).toEqual(MockOutputMini)
// })

test('parses input param correctly', () => {
  expect(parseParam(mockDataPathForParams)).toEqual(mockOutputParam)
})

// test('parses schema with only type corretly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema with both type and format correctly', () => {
//   expect(true).toEqual(true)
// })

test('parses schema with only enum correctly', () => {
  expect(parseEnumProperty(mockDataForEnumParsingInput1)).toEqual(mockDataForEnumParsingExpectedOutput1)
})
test('parses schema with only enum correctly again', () => {
  expect(parseEnumProperty(mockDataForEnumParsingInput2)).toEqual(mockDataForEnumParsingExpectedOutput2)
})

test('parses schema with both type and enum correctly', () => {
  expect(parseEnumProperty(mockDataForEnumParsingInput3)).toEqual(mockDataForEnumParsingExpectedOutput3)
})
test('parses schema with both type with format and enum correctly', () => {
  expect(parseEnumProperty(mockDataForEnumParsingInput4)).toEqual(mockDataForEnumParsingExpectedOutput4)
})

// test('parses schema of type "array" correctly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema of type "object" correctly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema of array of objects correctly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema of reference item correctly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema with "allOf" correctly', () => {
//   expect(true).toEqual(true)
// })

// test('parses schema with "oneOf" correctly', () => {
//   expect(true).toEqual(true)
// })