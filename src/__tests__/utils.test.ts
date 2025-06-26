import { parseData, parsePropertyType, parseParam, parseSchema, parseArraySchema, parseRefSchema, parseParameters, parseRequestBody, parseResponse, parseResponses } from '@/lib/utils'
import { expect, test } from 'vitest'
import { mockDataMini, mockDataOnlyRecursive, mockDataPathForParams } from './mockInputMini'
import { MockOutputMini } from './mockOutpuMini'
import { allOfInput, allOfOutput, arrayPropTypeExpectedOutput, arrayPropTypeInput, attributeInput, attributeOutput, catalogsPostOutput, catalogspostPathInput, inputParamsInput, inputParamsOutput, jsonRequestBodyInput, jsonRequestBodyOutput, mockDataForEnumParsingExpectedOutput1, mockDataForEnumParsingExpectedOutput2, mockDataForEnumParsingExpectedOutput3, mockDataForEnumParsingExpectedOutput4, mockDataForEnumParsingInput1, mockDataForEnumParsingInput2, mockDataForEnumParsingInput3, mockDataForEnumParsingInput4, mockDataForObjectParsingJustProperties, mockDataInput, mockOutputForObjectParsingJustProperties, nestedRequiredInput, nestedRequiredOutput, objectWithNestedInput, objectWithNestedOutput, oneOfNoRefInput, oneOfNoRefOutput, plainParamInput, plainParamOutput, plainRefInput, plainRefOutput, plainRefRequestBodyInput, plainRefRequestBodyOutput, plainTextRequestBodyInput, plainTextRequestBodyOutput, propertyToParseParamTypeInput, propertyToParseParamTypeOutput, recursiveAllOfInput, recursiveAllOfOutput, refParamInput, refParamOutput, refPropInput, refPropOutput, refRequestBodyRecursiveInput, refRequestBodyRecursiveOutput, requestBodyPlainInput, requestBodyPlainOutput, requiredInput, requiredOutput, response200jsonInput, response200jsonOutput, response201jsonInput, response201jsonOutput, response400jsonInput, response400jsonOutput, responseMultiCodeInput, responseMultiCodeOutput, responsePlainTextInput, responsePlainTextOutput, responseRefInput, responseRefOutput } from './mockDataPairs'
import { mockData } from './mockInput'

test('parsed yaml swagger specs correctly', () => {
  expect(parseData(mockDataMini)).toEqual(MockOutputMini)
})

test('parse application/json request body correctly', () => {
  expect(parseRequestBody(jsonRequestBodyInput, mockData)).toEqual(jsonRequestBodyOutput)
})
test('parse text/plain request body correctly', () => {
  expect(parseRequestBody(plainTextRequestBodyInput, mockData)).toEqual(plainTextRequestBodyOutput)
})
test('parse required request body correctly', () => {
  expect(parseRequestBody(plainTextRequestBodyInput, mockData)).toEqual(plainTextRequestBodyOutput)
})
test('parse ref request body correctly', () => {
  expect(parseRequestBody(plainRefRequestBodyInput, mockData)).toEqual(plainRefRequestBodyOutput)
})
test('parse ref schema with recursive type', () => {
  expect(parseRequestBody(refRequestBodyRecursiveInput, mockDataOnlyRecursive)).toEqual(refRequestBodyRecursiveOutput)
})
test('parse 200 response application/json correctly', () => {
  expect(parseResponse(response200jsonInput, mockData, '200')).toEqual(response200jsonOutput)
})
test('parse 201 response application/json correctly', () => {
  expect(parseResponse(response201jsonInput, mockData, '201')).toEqual(response201jsonOutput)
})
test('parse 400 response application/json correctly', () => {
  expect(parseResponse(response400jsonInput, mockData, '400')).toEqual(response400jsonOutput)
})
test('parse ref response correctly', () => {
  expect(parseResponse(responseRefInput, mockData, '400')).toEqual(responseRefOutput)
})
test('parse text/plain response correctly', () => {
  expect(parseResponse(responsePlainTextInput, mockData, '200')).toEqual(responsePlainTextOutput)
})
test('parse response with multiple possible codes correctly', () => {
  expect(parseResponses(responseMultiCodeInput, mockData)).toEqual(responseMultiCodeOutput)
})
test('parses huge requestBody correctly', () => {
  const actual = parseRequestBody(catalogspostPathInput.requestBody, mockDataMini)
  expect(actual).toEqual(catalogsPostOutput.requests)
})
test('parses requestBody correctly', () => {
  expect(parseRequestBody(requestBodyPlainInput, mockDataMini)).toEqual(requestBodyPlainOutput)
})

test('parses schema with oneOf property with multiple entries corretly', () => {
  expect(parseSchema(oneOfNoRefInput, mockDataInput)).toEqual(oneOfNoRefOutput)
})

test('parses schema with anyOf property with multiple entries corretly', () => {
  expect(parseSchema(attributeInput, mockDataInput)).toEqual(attributeOutput)
})

test('correctly parses nested object schema if no explicit type property is present', () => {
  expect(parsePropertyType(propertyToParseParamTypeInput, mockDataInput, {})).toEqual(propertyToParseParamTypeOutput)
})

test('parses plain input param correctly', () => {
  expect(parseParam(refParamInput, mockDataInput, {})).toEqual(refParamOutput)
})

test('parses ref input param correctly', () => {
  expect(parseParam(plainParamInput, mockDataInput, {})).toEqual(plainParamOutput)
})

test('parses input param correctly', () => {
  expect(parseParameters(inputParamsInput, mockDataInput, {})).toEqual(inputParamsOutput)
})

test('parses object schema with nested properties', () => {
  expect(parseSchema(objectWithNestedInput, mockDataInput, {})).toEqual(objectWithNestedOutput)
})

test('parses schema with only enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput1, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput1)
})
test('parses schema with only enum correctly again', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput2, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput2)
})

test('parses schema with both type and enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput3, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput3)
})
test('parses schema with both type with format and enum correctly', () => {
  expect(parsePropertyType(mockDataForEnumParsingInput4, mockDataInput, {})).toEqual(mockDataForEnumParsingExpectedOutput4)
})

test('parses schema of type "array" correctly', () => {
  expect(parseArraySchema(arrayPropTypeInput, mockDataInput, arrayPropTypeInput.required, {})).toEqual(arrayPropTypeExpectedOutput)
})

test('parses schema of type "object" with just properties object correctly', () => {
  expect(parseSchema(mockDataForObjectParsingJustProperties, mockDataInput)).toEqual(mockOutputForObjectParsingJustProperties)
})

test('parses plain ref schema', () => {
  expect(parseRefSchema(plainRefInput, mockDataInput, {})).toEqual(plainRefOutput)
})

test('parses allOf ref schema', () => {
  expect(parseSchema(allOfInput, mockDataInput)).toEqual(allOfOutput)
})

test('parses allOf ref recursive schema', () => {
  expect(parseSchema(recursiveAllOfInput, mockDataInput)).toEqual(recursiveAllOfOutput)
})

test('correctly parses nested non-required properties when parent property is required', () => {
  expect(parseSchema(requiredInput, mockDataInput)).toEqual(requiredOutput)
})

test('parses ref schema with array with oneOf type correctly', () => {
  expect(parseRefSchema(refPropInput, mockDataInput, {})).toEqual(refPropOutput)
})