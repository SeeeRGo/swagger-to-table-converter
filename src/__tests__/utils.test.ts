import { parseData, parsePropertyType, parseParam, parseSchema, parseArraySchema, parseRefSchema, parseParameters, parseRequestBody } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockDataMini, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini, mockOutputParam } from './mockOutpuMini'
import { allOfInput, allOfOutput, arrayPropTypeExpectedOutput, arrayPropTypeInput, attributeInput, attributeOutput, catalogsPostOutput, catalogspostPathInput, inputParamsInput, inputParamsOutput, mockDataForEnumParsingExpectedOutput1, mockDataForEnumParsingExpectedOutput2, mockDataForEnumParsingExpectedOutput3, mockDataForEnumParsingExpectedOutput4, mockDataForEnumParsingInput1, mockDataForEnumParsingInput2, mockDataForEnumParsingInput3, mockDataForEnumParsingInput4, mockDataForObjectParsingJustProperties, mockDataInput, mockOutputForObjectParsingJustProperties, nestedRequiredInput, nestedRequiredOutput, objectWithNestedInput, objectWithNestedOutput, oneOfNoRefInput, oneOfNoRefOutput, plainParamInput, plainParamOutput, plainRefInput, plainRefOutput, refParamInput, refParamOutput, refPropInput, refPropOutput, requestBodyPlainInput, requestBodyPlainOutput, requiredInput, requiredOutput } from './mockDataPairs'

// test('parsed yaml swagger specs correctly', () => {
//   // parseData(mockDataMini)
//   // expect(true).toEqual(true)
//   expect(parseData(mockDataMini)).toEqual(MockOutputMini)
// })
// test('parses requestBody correctly', () => {
//   expect(parseRequestBody(requestBodyPlainInput, mockDataMini)).toEqual(requestBodyPlainOutput)
// })
// test('parses huge requestBody correctly', () => {
//   const actual = parseRequestBody(catalogspostPathInput.requestBody, mockDataMini)
//   console.log('actual', actual);
  
//   expect(actual).toEqual(catalogsPostOutput.requests)
//   expect(true).toEqual(true)
// })

// test('parses schema with oneOf property with multiple entries corretly', () => {
//   expect(parseSchema(oneOfNoRefInput, mockDataInput)).toEqual(oneOfNoRefOutput)
// })

test('parses schema with anyOf property with multiple entries corretly', () => {
  // const actual = parseSchema(attributeInput, mockDataInput)
  // console.log('actual', actual);
  
  expect(parseSchema(attributeInput, mockDataInput).slice(0,60)).toEqual(attributeOutput.slice(0,60))
})

test.todo('parses nested required in allOf refs correctly')

// test('parses plain input param correctly', () => {
//   expect(parseParam(refParamInput, mockDataInput)).toEqual(refParamOutput)
// })

// test('parses ref input param correctly', () => {
//   expect(parseParam(plainParamInput, mockDataInput)).toEqual(plainParamOutput)
// })

// test('parses input param correctly', () => {
//   expect(parseParameters(inputParamsInput, mockDataInput)).toEqual(inputParamsOutput)
// })


// test('parses object schema with nested properties', () => {
//   expect(parseSchema(objectWithNestedInput, mockDataInput)).toEqual(objectWithNestedOutput)
// })

// test('parses schema with only enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput1, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput1)
// })
// test('parses schema with only enum correctly again', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput2, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput2)
// })

// test('parses schema with both type and enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput3, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput3)
// })
// test('parses schema with both type with format and enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput4, mockDataInput)).toEqual(mockDataForEnumParsingExpectedOutput4)
// })

// test('parses schema of type "array" correctly', () => {
//   expect(parseArraySchema(arrayPropTypeInput, mockDataInput, arrayPropTypeInput.required)).toEqual(arrayPropTypeExpectedOutput)
// })

// test('parses schema of type "object" with just properties object correctly', () => {
//   expect(parseSchema(mockDataForObjectParsingJustProperties, mockDataInput)).toEqual(mockOutputForObjectParsingJustProperties)
// })

// test('parses plain ref schema', () => {
//   expect(parseRefSchema(plainRefInput, mockDataInput)).toEqual(plainRefOutput)
// })

// test('parses allOf ref schema', () => {
//   expect(parseSchema(allOfInput, mockDataInput)).toEqual(allOfOutput)
// })

// test('correctly parses nested non-required properties when parent property is required', () => {
//   expect(parseSchema(requiredInput, mockDataInput)).toEqual(requiredOutput)
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