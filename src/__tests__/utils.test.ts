import { parseData, parsePropertyType, parseParam, parseSchema, parseArraySchema, parseRefSchema, parseParameters, parseRequestBody } from '@/lib/utils'
import { expect, test } from 'vitest'
import { expectedParsedData } from './mockOutput'
import { mockDataMini, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini, mockOutputParam } from './mockOutpuMini'
import { allOfInput, allOfOutput, arrayPropTypeExpectedOutput, arrayPropTypeInput, attributeInput, attributeOutput, catalogsPostOutput, catalogspostPathInput, inputParamsInput, inputParamsOutput, mockDataForEnumParsingExpectedOutput1, mockDataForEnumParsingExpectedOutput2, mockDataForEnumParsingExpectedOutput3, mockDataForEnumParsingExpectedOutput4, mockDataForEnumParsingInput1, mockDataForEnumParsingInput2, mockDataForEnumParsingInput3, mockDataForEnumParsingInput4, mockDataForObjectParsingJustProperties, mockDataInput, mockOutputForObjectParsingJustProperties, nestedRequiredInput, nestedRequiredOutput, objectWithNestedInput, objectWithNestedOutput, oneOfNoRefInput, oneOfNoRefOutput, plainParamInput, plainParamOutput, plainRefInput, plainRefOutput, propertyToParseParamTypeInput, propertyToParseParamTypeOutput, refParamInput, refParamOutput, refPropInput, refPropOutput, requestBodyPlainInput, requestBodyPlainOutput, requiredInput, requiredOutput } from './mockDataPairs'

test('parsed yaml swagger specs correctly', () => {
  expect(parseData(mockDataMini).at(0)).toEqual(MockOutputMini.at(0))
})

test.todo('parse application/json request body correctly')
test.todo('parse text/plain request body correctly')
test.todo('parse required request body correctly')
test.todo('parse ref request body correctly')
test.todo('parse 200 response application/json correctly')
test.todo('parse 201 response application/json correctly')
test.todo('parse 400 response application/json correctly')
test.todo('parse ref response correctly')
test.todo('parse text/plain response correctly')
test.todo('parse response with multiple possible codes correctly')
// test('parses huge requestBody correctly', () => {
//   const actual = parseRequestBody(catalogspostPathInput.requestBody, mockDataMini)
//   expect(actual).toEqual(catalogsPostOutput.requests)
// })
// test('parses requestBody correctly', () => {
//   expect(parseRequestBody(requestBodyPlainInput, mockDataMini)).toEqual(requestBodyPlainOutput)
// })

// test('parses schema with oneOf property with multiple entries corretly', () => {
//   expect(parseSchema(oneOfNoRefInput, mockDataInput)).toEqual(oneOfNoRefOutput)
// })

// test('parses schema with anyOf property with multiple entries corretly', () => {
//   expect(parseSchema(attributeInput, mockDataInput)).toEqual(attributeOutput)
// })

// test('correctly parses nested object schema if no explicit type property is present', () => {
//   expect(parsePropertyType(propertyToParseParamTypeInput, mockDataInput, {})).toEqual(propertyToParseParamTypeOutput)
// })

// test('parses plain input param correctly', () => {
//   expect(parseParam(refParamInput, mockDataInput, {})).toEqual(refParamOutput)
// })

// test('parses ref input param correctly', () => {
//   expect(parseParam(plainParamInput, mockDataInput, {})).toEqual(plainParamOutput)
// })

// test('parses input param correctly', () => {
//   expect(parseParameters(inputParamsInput, mockDataInput, {})).toEqual(inputParamsOutput)
// })


// test('parses object schema with nested properties', () => {
//   expect(parseSchema(objectWithNestedInput, mockDataInput, {})).toEqual(objectWithNestedOutput)
// })

// test('parses schema with only enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput1, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput1)
// })
// test('parses schema with only enum correctly again', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput2, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput2)
// })

// test('parses schema with both type and enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput3, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput3)
// })
// test('parses schema with both type with format and enum correctly', () => {
//   expect(parsePropertyType(mockDataForEnumParsingInput4, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput4)
// })

// test('parses schema of type "array" correctly', () => {
//   expect(parseArraySchema(arrayPropTypeInput, mockDataInput, arrayPropTypeInput.required, {})).toEqual(arrayPropTypeExpectedOutput)
// })

// test('parses schema of type "object" with just properties object correctly', () => {
//   expect(parseSchema(mockDataForObjectParsingJustProperties, mockDataInput)).toEqual(mockOutputForObjectParsingJustProperties)
// })

// test('parses plain ref schema', () => {
//   expect(parseRefSchema(plainRefInput, mockDataInput, {})).toEqual(plainRefOutput)
// })

// test('parses allOf ref schema', () => {
//   expect(parseSchema(allOfInput, mockDataInput)).toEqual(allOfOutput)
// })

// test('correctly parses nested non-required properties when parent property is required', () => {
//   expect(parseSchema(requiredInput, mockDataInput)).toEqual(requiredOutput)
// })

// test('parses ref schema with array with oneOf type correctly', () => {
//   expect(parseRefSchema(refPropInput, mockDataInput, {})).toEqual(refPropOutput)
// })
// test.todo('parses nested required in allOf refs correctly')
  
// test.todo('parses schema of reference item correctly')

// test.todo('parses schema with "allOf" correctly')

// test.todo('parses schema with "oneOf" correctly')