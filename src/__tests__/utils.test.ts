import { parseData, parsePropertyType, parseParam, parseSchema, parseArraySchema, parseRefSchema, parseParameters } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockDataMini, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini, mockOutputParam } from './mockOutpuMini'
import { allOfInput, allOfOutput, arrayPropTypeExpectedOutput, arrayPropTypeInput, inputParamsInput, inputParamsOutput, mockDataForEnumParsingExpectedOutput1, mockDataForEnumParsingExpectedOutput2, mockDataForEnumParsingExpectedOutput3, mockDataForEnumParsingExpectedOutput4, mockDataForEnumParsingInput1, mockDataForEnumParsingInput2, mockDataForEnumParsingInput3, mockDataForEnumParsingInput4, mockDataForObjectParsingJustProperties, mockDataInput, mockOutputForObjectParsingJustProperties, plainParamInput, plainParamOutput, plainRefInput, plainRefOutput, refParamInput, refParamOutput, refPropInput, refPropOutput } from './mockDataPairs'

// test('parsed yaml swagger specs correctly', () => {
//   expect(parseData(mockDataMini)).toEqual(MockOutputMini)
// })
test('parses schema with oneOf property with single entry corretly', () => {
  expect(true).toEqual(true)
})

test('parses schema with oneOf property with multiple entries corretly', () => {
  expect(true).toEqual(true)
})

test('parses plain input param correctly', () => {
  expect(parseParam(refParamInput, mockDataInput)).toEqual(refParamOutput)
})

test('parses куа input param correctly', () => {
  expect(parseParam(plainParamInput, mockDataInput)).toEqual(plainParamOutput)
})

test('parses input param correctly', () => {
  expect(parseParameters(inputParamsInput, mockDataInput)).toEqual(inputParamsOutput)
})


// test('parses schema with both type and format correctly', () => {
//   expect(true).toEqual(true)
// })

test('parses schema with only enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput1, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput1)
})
test('parses schema with only enum correctly again', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput2, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput2)
})

test('parses schema with both type and enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput3, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput3)
})
test('parses schema with both type with format and enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput4, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput4)
})

test('parses schema of type "array" correctly', () => {
  expect(parseArraySchema(arrayPropTypeInput, mockDataInput)).toEqual(arrayPropTypeExpectedOutput)
})

test('parses schema of type "object" with just properties object correctly', () => {
  expect(parseSchema(mockDataForObjectParsingJustProperties, mockDataInput)).toEqual(mockOutputForObjectParsingJustProperties)
})

test('parses plain ref schema', () => {
  expect(parseRefSchema(plainRefInput, mockDataInput)).toEqual(plainRefOutput)
})

test('parses allOf ref schema', () => {
  expect(parseSchema(allOfInput, mockDataInput)).toEqual(allOfOutput)
})

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

// test('parses schema with array with oneOf type correctly', () => {
//   expect(parseRefSchema(refPropInput, mockDataInput)).toEqual(refPropOutput)
// })