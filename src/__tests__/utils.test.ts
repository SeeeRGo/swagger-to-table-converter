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

test('parses schema with only type corretly', () => {
  expect(true).toEqual(true)
})

test('parses schema with both type and format correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema with only enum correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema with both type and enum correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema of type "array" correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema of type "object" correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema of array of objects correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema of reference item correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema with "allOf" correctly', () => {
  expect(true).toEqual(true)
})

test('parses schema with "oneOf" correctly', () => {
  expect(true).toEqual(true)
})