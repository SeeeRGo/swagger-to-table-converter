import { OpenAPIV3_1 } from "@/open-api-types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export enum InputParamType {
  HEADER = 'header',
  QUERY = 'query',
  PATH = 'path',
}

// const notBoolean = <T>(value: T): value is Exclude<T, boolean> => typeof value !== 'boolean'
const isParameter = (value: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.ParameterObject): value is OpenAPIV3_1.ParameterObject => typeof value !== 'boolean' && 'in' in value
type NonMixedSchema = OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject
export type ParsedParam = {
  description: string
  paramName: string
  paramType?: string
  paramIn?: string // 'query' | 'path' | 'header'
  required?: boolean
}

type ParsingSchemaOptions = {
  parentParamName?: string
  parentParamType?: string
  parentParamRequired?: string[]
  ignoreParentParam?: boolean
  parentParamDescription?: string
  depth?: number
}

export type ParsedNestedSchema = {
  parentName: string
  parentType: string
  nestedParams: ParsedParam[]
}

type ParsedRequestBody = {
  schema: ParsedParam[],
  required: boolean,
  description: string
}

type ParsedResponse = {
  schema: ParsedParam[],
  description: string
}

type OneOfParsingParam = {
  oneOf: NonNullable<OpenAPIV3_1.NonArraySchemaObject['oneOf']>,
  description?: string
}

type AnyOfParsingParam = {
  anyOf: NonNullable<OpenAPIV3_1.NonArraySchemaObject['anyOf']>,
  description?: string
}

const sanitizeRef = (ref?: string) => ref ? ref.substring(ref.indexOf('#')) : ref

const getSchemaNameFromRef = (ref: string) => ref.split('/').at(-1)

const findSchema = (data: OpenAPIV3_1.Document, schemaName?: string) => {  
  if (!schemaName) return undefined
  const schemas = {
    ...(data.components?.schemas ?? {}),
    ...(data.components?.parameters ?? {}),
    ...(data.components?.requestBodies ?? {}),
  }
  const schemaKey = Object.keys(schemas).find((key) => key === schemaName)

  return schemaKey && Object.keys(schemas).length ? schemas[schemaKey] : undefined
}

export const parseData = (data?: OpenAPIV3_1.Document) => {
    return Object.entries(data?.paths ?? {}).flatMap(([pathKey, pathObj]) => Object.entries(pathObj ?? {}).map(([method, methodDef]) => {
      
      return ({
        path: pathKey,
        method,
        methodDesc: typeof methodDef === 'string' ? methodDef : Array.isArray(methodDef) ? 'Some Array  Method' : methodDef.description, //@ts-expect-error idk
        responses: parseResponses(methodDef.responses, data), //@ts-expect-error idk
        requests: parseRequestBody(methodDef.requestBody, data), //@ts-expect-error idk
        inputParams: parseParameters(methodDef?.parameters ?? [], data, {})
      })
    }))
}

export const parseParameters = (parameters: (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[], data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = ''}: ParsingSchemaOptions): ParsedParam[] => {
  return parameters.flatMap(parameter => parseParam(parameter, data, {parentParamName, parentParamType}))
}

export const parseParam = (param: OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | undefined, data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {  
  if (param === undefined) return [{
    paramName: 'Нет схемы - где-то ошибка логики парсинга',
    description: 'Нет схемы - где-то ошибка логики парсинга'
  }]
  if (typeof param === 'boolean') return [{
    paramName: `param - ${param}`,
    description: `param - ${param}`
  }]
  if ('$ref' in param) {
    const repNums = parentParamName.split('.').reduce((acc, el) => {
      const currentRepetitions = acc[el] ?? 0
      acc[el] = currentRepetitions + 1
      return acc
    }, {} as Record<string, number>)
    if (Object.values(repNums ?? {}).reduce((max, num) => num > max ? num : max, 0) > 1) return []
    const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(param?.$ref) ?? ''))
    if (typeof referenceSchema === 'object' && 'in' in referenceSchema) {
      return parseParam(referenceSchema, data, {parentParamName, parentParamType})
    }
    if (typeof referenceSchema === 'object' && 'content' in referenceSchema) {
      return parseRequestBody(referenceSchema, data).schema
    }

    const res = parseParam(referenceSchema, data, {parentParamName, parentParamType})
    return res
  }

  if ('schema' in param) {
    if (param.schema && ('$ref' in param.schema || 'allOf' in param.schema || 'oneOf' in param.schema || param.schema.type === 'array')) {
      const parsedSchema = parseSchema(param.schema, data, { parentParamName, parentParamType, parentParamDescription })
      
      return [{
        paramName: param.name,
        paramIn: param.in,
        paramType: parsedSchema?.at(0)?.paramType ?? 'Не распарсился тип',
        description: param.description ?? parentParamDescription ?? 'Нет описания параметра',
        required: !!param.required
      }]
    }

    const parsedType = parsePropertyType(param.schema, data, {parentParamType})
    
    return [{
      paramName: param.name,
      paramIn: param.in,
      paramType: parsedType,
      description: param.description ?? '',
      required: !!param.required
    }]
  }
  return [{
    paramName: 'Какой-то непонятный входной параметр - ошибка логики парсинга' ,
    description: 'Какой-то непонятный входной параметр - ошибка логики парсинга - ' + param  
  }]
}

export const parseSchema = (schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ParameterObject | undefined, data: OpenAPIV3_1.Document,{ parentParamName = '', parentParamType = '', parentParamRequired, ignoreParentParam, depth = 0, parentParamDescription}: ParsingSchemaOptions = {}): ParsedParam[] => {
  if (schema === undefined) return [{
    paramName: 'Нет схемы - где-то ошибка логики парсинга',
    description: 'Нет схемы - где-то ошибка логики парсинга'
  }]
  if (typeof schema === 'boolean') return [{
    paramName: `schema - ${schema}`,
    description: `schema - ${schema}`
  }]
  if ('$ref' in schema) return parseRefSchema(schema, data, {parentParamName, parentParamType, parentParamRequired, ignoreParentParam, depth: depth + 1, parentParamDescription})
  if ('in' in schema) return parseParam(schema, data, {parentParamName, parentParamType, parentParamDescription})
  if (schema.properties) {
    
    const res = [
      ...(parseAllOf(schema.allOf ?? [], data, {parentParamName, parentParamRequired, depth, parentParamDescription: schema.description})),
      ...parseProperties(schema.properties, schema.required, data,{ parentParamName, parentParamType, parentParamRequired})
    ]
    
    return res
  }
  if ('items' in schema) {
    if (schema.type === 'array') {
      return parseArraySchema(schema, data, schema.required, {parentParamName, parentParamType: parentParamType ? parentParamType : parentParamType + 'array', parentParamRequired})
    }
    else return parseMixedSchema(schema)
  }
  if (schema.enum) return [{
    paramName: parentParamName, 
    paramType: parsePropertyType(schema, data, {parentParamType}), // @ts-expect-error no undefined in type
    description: schema.description,
    required: !!schema.required
  }]
  if (schema.allOf) {    
    return parseAllOf(schema.allOf, data, {parentParamName, parentParamRequired, depth, parentParamDescription: schema.description})
  }
  if (schema.anyOf) return parseAnyOf({anyOf: schema.anyOf, description: schema.description}, data, {parentParamName})
  if (schema.oneOf) {    
    const parsedOneOf = parseOneOf({
      oneOf: schema.oneOf,
      description: schema.description
    }, data,{ parentParamName, parentParamType, parentParamRequired})
    
    return parsedOneOf
  } 
  if (schema.type === 'string' || schema.type === 'integer' || schema.type === 'boolean' || schema.type === 'number') {
    const parsedPrimitive = [{
      paramName: parentParamName,
      paramType: parsePropertyType(schema, data, {parentParamType}),
      description: schema.description ?? parentParamDescription,
      required: !!schema.required
    }]
     // @ts-expect-error no undefined in type
    return parsedPrimitive
  }
      
  return [{
    paramName: 'Какой-то непонятный необработанный кейс - ошибка логики парсинга' + String(schema),
    description: 'Какой-то непонятный необработанный кейс - ошибка логики парсинга' + String(schema)
  }]
}

export const parseRefSchema = (ref: OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', parentParamRequired, ignoreParentParam, depth = 0, parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {
  const repNums = parentParamName.split('.').reduce((acc, el) => {
    const currentRepetitions = acc[el] ?? 0
    acc[el] = currentRepetitions + 1
    return acc
  }, {} as Record<string, number>)
  if (Object.values(repNums ?? {}).reduce((max, num) => num > max ? num : max, 0) > 1) return []
  
  const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(ref.$ref) ?? ''))
  
  if (referenceSchema && typeof referenceSchema !== 'boolean' && 'content' in referenceSchema) return []
  if (typeof referenceSchema === 'object' && 'in' in referenceSchema) {
    return [
      {
        paramName: parentParamName,
        paramType: parsePropertyType(referenceSchema.schema, data, {parentParamType}),
        paramIn: referenceSchema.in,
        description: referenceSchema?.description ?? 'No description for ref description',
      },
      ...parseParam(referenceSchema, data, {parentParamName, parentParamType})
    ]
  }
  const isPrimitiveSchema = typeof referenceSchema === 'object' && 'type' in referenceSchema && (referenceSchema.type === 'string' || referenceSchema.type === 'integer' || referenceSchema.type === 'boolean' || referenceSchema.type === 'number')
  const noParentParam = typeof referenceSchema !== 'object' || 'oneOf' in referenceSchema || isPrimitiveSchema || ignoreParentParam
  const parentParamArr = noParentParam ? [] : [{
    paramName: parentParamName,
    paramType: parsePropertyType(referenceSchema, data, {parentParamType}),
    description: ref.description ?? referenceSchema.description ?? parentParamDescription ?? '',
    required: parentParamRequired?.some(prop => parentParamName.endsWith(prop) || parentParamName.endsWith(`${prop}[index]`)) ?? false
  }]
  return [
    ...parentParamArr,
    ...parseSchema(referenceSchema, data, {parentParamName, parentParamType, parentParamRequired, depth: depth + 1, parentParamDescription: ref.description ?? parentParamDescription })
  ]
}

export const parseRequestBody = (requestBody: OpenAPIV3_1.RequestBodyObject, data: OpenAPIV3_1.Document): ParsedRequestBody => {  
  if (requestBody?.content && 'application/json' in requestBody.content) {
    return {
      schema: parseSchema(requestBody.content['application/json'].schema, data, {}),
      required: !!requestBody.required,
      description: requestBody?.description ?? requestBody.content['application/json'].example?.description ?? ''
    }
  }
  if (requestBody?.content && 'text/plain' in requestBody.content) {
    return {
      schema: parseSchema(requestBody.content['text/plain'].schema, data, { parentParamName: 'plain_text_body'}),
      required: !!requestBody.required,
      description: requestBody?.description ?? requestBody.content['text/plain'].example?.description ?? ''
    }
  }
  if (requestBody && '$ref' in requestBody) {  
    // @ts-expect-error idk
    const referenceRequestBody = findSchema(data, getSchemaNameFromRef(sanitizeRef(requestBody.$ref) ?? ''))  
     // @ts-expect-error idke
    return parseRequestBody(referenceRequestBody, data)
  }
  return {
    schema: [],
    required: false,
    description: ''
  }
}
export const parseResponses = (response: OpenAPIV3_1.ResponsesObject, data: OpenAPIV3_1.Document) => ({
  "200": parseResponse((response ?? {})["200"], data, '200'),
  "201": parseResponse((response ?? {})["201"], data, '201'),
  "400": parseResponse((response ?? {})["400"], data, '400'),
})
// @ts-expect-error idk
export const parseResponse = (responseCode?: OpenAPIV3_1.ResponsesObject[string], data: OpenAPIV3_1.Document, code: string): ParsedResponse => {
  if (responseCode && '$ref' in responseCode) {
    const referenceResponse = findSchema(data, getSchemaNameFromRef(sanitizeRef(responseCode.$ref) ?? ''))
    console.log('referenceResponse', responseCode.$ref, referenceResponse);
    
    return {
       // @ts-expect-error idk
      schema: parseSchema(referenceResponse, data, {}), // @ts-expect-error idk
      description: referenceResponse?.description ?? `Нет описания ответа ${code} кода`,
    }
  }
  if (responseCode && 'content' in responseCode && responseCode.content && "application/json" in responseCode.content && "schema" in responseCode.content["application/json"]) {
    return {
      description: responseCode?.description ?? `Нет описания ответа ${code} кода`,
      schema: parseSchema(responseCode.content["application/json"]?.schema, data, {})
    }
  }
  if (responseCode && 'content' in responseCode && responseCode.content && "text/plain" in responseCode.content && "schema" in responseCode.content["text/plain"]) {
    return {
      description: responseCode?.description ?? `Нет описания ответа ${code} кода`,
      schema: parseSchema(responseCode.content["text/plain"]?.schema, data, { parentParamName: 'plain_text_response' })
    }
  }
  return {
    description: `В схеме ответов нет кода ${code}`,
    schema: []
  }
}

const isObjectSchema = (schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ParameterObject | OpenAPIV3_1.RequestBodyObject, data: OpenAPIV3_1.Document): boolean => {  
  if (typeof schema === 'boolean') return false
  if ('properties' in schema) return true
  if ('$ref' in schema) {
    const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(schema?.$ref) ?? ''))
    if (!referenceSchema) return false
    return isObjectSchema(referenceSchema, data)
  }
  if ('type' in schema && schema.type !== 'object') return false
  return true
}

export const parseArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document, required: OpenAPIV3_1.NonArraySchemaObject['required'],{ parentParamName = '', parentParamType = '', parentParamRequired}: ParsingSchemaOptions): ParsedParam[] => {
  
  if (schema === undefined) return [{
    paramName: parentParamName,
    description: 'Нет массива и/или его элементов - где-то ошибка логики парсинга'
  }]
  if (typeof schema === 'boolean') return [{
    paramName: parentParamName,
    description: `schema - ${schema}`
  }]
  let items = typeof schema.items === 'object' ? { description: schema.description, ...schema.items } : schema.items
  
  let itemsType = 'unknown'
  
  if (typeof schema.items === 'object') {
    if('$ref' in schema.items) {
      const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(schema.items.$ref) ?? ''))
      
      if(typeof referenceSchema === 'object' && 'type' in referenceSchema && typeof referenceSchema.type === 'string') {   
             
        itemsType = referenceSchema.type
        items = typeof items === 'boolean' ? items : {
          ...items,
          required: referenceSchema.required
        }

      } else if (typeof referenceSchema === 'object' && 'oneOf' in referenceSchema && referenceSchema.oneOf) {
        itemsType = parseOneOf({ oneOf: referenceSchema.oneOf, description: referenceSchema.description }, data, {}).at(0)?.paramType ?? 'unparsedOneOf'
      }
    } else if ('type' in schema.items && typeof schema.items.type === 'string') {

      itemsType = schema.items.type
      
    } else if ('properties' in schema.items || 'allOf' in schema.items) {
      itemsType = 'object'
    }
  }
  
  const itemsSchema = parseSchema(items, data, {parentParamName: `${parentParamName}[index]`, parentParamType: isObjectSchema(schema.items, data) ? '' : 'array', parentParamRequired: required, parentParamDescription: schema.description })  
  
  const parentParam: ParsedParam[] = typeof schema.items === 'object' && (isObjectSchema(schema.items, data)) ? [{
    paramName: `${parentParamName}[index]`,
    description: schema.description ?? '',
    paramType: `array[${itemsType}]`,
    required: required ? required.some(prop => {
      return parentParamName.endsWith(prop) || parentParamName.endsWith(`${prop}[index]`)
    }) : false
  }] : []
  const res = [...parentParam, ...itemsSchema]
  
  return res
}
export const parseMixedSchema = (schema: OpenAPIV3_1.MixedSchemaObject): ParsedParam[] => {
  return [{
    paramName: 'Some mixed schema',
    description: 'Some mixed schema',
    paramType: 'MIXED SCHEMA PARSING NOT IMPLEMENTED YET'
  }]
}

export const parseNestedParam = (name: string, property: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject, required:  OpenAPIV3_1.NonArraySchemaObject['required'] = [], data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', depth = 0, parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {

  if (property === undefined) return [{
    paramName: name,
    paramType: 'Нет отдельного свойства - где-то ошибка логики парсинга',
    description: 'Нет отдельного свойства - где-то ошибка логики парсинга',
    required: false
  }]
  if (typeof property === 'boolean') return [{
    paramName: name,
    paramType: `property - ${property}`,
    description: `property - ${property}`,
    required: false
  }]
  if ('$ref' in property) {
    const parsedRef = parseRefSchema(property, data, {parentParamName: parentParamName + name, parentParamRequired: required, parentParamDescription})
    return parsedRef.map(param => {
        if (param.paramName.endsWith(name) || param.paramName.endsWith(`${name}[index]`)) {
          const res = {
            ...param,
            required: required ? required.some(prop => {
              return param.paramName.endsWith(prop) || param.paramName.endsWith(`${prop}[index]`)
            }) : false,
          }
        return res
      }
      return param
    })
  }
    if ('items' in property) {
      if (property.type === 'array') {
        
        const parsedArray = parseArraySchema(property, data, required, {parentParamName: parentParamName + name, parentParamType: parentParamType ? parentParamType : parentParamType + 'array', parentParamDescription})
        
        return parsedArray.map(parsed => {
          if (parsed.paramName.endsWith(name) || parsed.paramName.endsWith(`${name}[index]`)) {            
            return ({
              ...parsed,
              required: required ? required.some(prop => {
                return parsed.paramName.endsWith(prop) || parsed.paramName.endsWith(`${prop}[index]`)
              }) : false,
            })
          }
          return parsed
        })
      } else return parseMixedSchema(property)
    }
  if (property.properties) {
    const result = [{
      paramName: parentParamName + name,
      paramType: parsePropertyType(property, data, {parentParamType}),
      description: property.description ?? parentParamDescription ?? '',
      required: required ? required.some(prop => {
        return name.endsWith(prop) || name.endsWith(`${prop}[index]`)
      }) : false
    }]
    const res = [
      ...result,
      ...(parseAllOf(property.allOf ?? [], data, {parentParamName: parentParamName + name, parentParamRequired:required ?? [], depth: depth + 1, parentParamDescription: property.description })),
      ...parseProperties(property.properties, property.required, data, {parentParamName: parentParamName + name, parentParamType, depth: depth + 1, parentParamDescription: property.description})
    ]
    
    return res
  }
  if (property.allOf) {
    return parseAllOf(property.allOf, data, {parentParamName: parentParamName + name, parentParamRequired: required ?? [], depth, parentParamDescription: property.description}).map(param => {
      if (param.paramName.endsWith(name) || param.paramName.endsWith(`${name}[index]`)) {
        return {
          ...param,
          required: required ? required.some(prop => {
            return param.paramName.endsWith(prop) || param.paramName.endsWith(`${prop}[index]`)
          }) : false,
        }
      }
      return param
    })    
  }
  if (property.anyOf) return parseAnyOf({anyOf: property.anyOf, description: property.description}, data, {parentParamName: parentParamName + name, parentParamType, parentParamDescription: property.description})
  if ('oneOf' in property) {
    const parsedOneOf = parseOneOf({
      oneOf: property.oneOf ?? [],
      description: property.description
    }, data, {parentParamName: parentParamName + name, parentParamType, parentParamRequired: required ?? []}).map((oneOf, i) => {
      if (oneOf.paramName.endsWith(name) || oneOf.paramName.endsWith(`${name}[index]`)) {
        return {
          ...oneOf,
          required: required ? required.some(prop => {
            return oneOf.paramName.endsWith(prop) || oneOf.paramName.endsWith(`${prop}[index]`)
          }) : false,
          description: i === 0 ? property.description ?? '' : oneOf.description,
        }
      }
      return {
          ...oneOf,
          description: i === 0 ? property.description ?? '' : oneOf.description,
      }
    })    
    return parsedOneOf
  }
  const result = [{
    paramName: parentParamName + name,
    paramType: parsePropertyType(property, data, {parentParamType}),
    description: property.description ?? '',
    required: required ? required.some(prop => {
      return name.endsWith(prop) || name.endsWith(`${prop}[index]`)
    }) : false
  }]
  return result
}

export const parseProperties = (properties: OpenAPIV3_1.NonArraySchemaObject['properties'], required:  OpenAPIV3_1.NonArraySchemaObject['required'], data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', parentParamRequired = [], parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {
  
  if (!properties) return [{
    paramName: '',
    description: 'Нет пропертей схемы типа объект - где-то ошибка логики парсинга',
    paramType: 'Нет пропертей схемы типа объект - где-то ошибка логики парсинга'
  }]
  const parsedProperties = Object.entries(properties).flatMap(([name, property]): ParsedParam[] => {
    
    const parsed = parseNestedParam(name, property, required, data, {parentParamName: parentParamName ? `${parentParamName}.` : '', parentParamRequired, parentParamDescription})
    
    return parsed
  })   
  
  return parsedProperties
}
export const parseAllOf = (allOfArr: NonNullable<OpenAPIV3_1.NonArraySchemaObject['allOf']>, data: OpenAPIV3_1.Document, {parentParamName = '', parentParamRequired, depth = 0, parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {
  
  const parsedAllOf = allOfArr.flatMap((schema, i) => {
    
    const res = parseSchema(schema, data, {parentParamName, parentParamRequired, ignoreParentParam: i > 0 || depth > 0, depth, parentParamDescription})    
    return res.map(param => {
      
      return ({
        ...param,
        // required: parentParamRequired?.some(prop => param.paramName.endsWith(prop) || param.paramName.endsWith(`${prop}[index]`)),
      })
    })
  })

  return parsedAllOf
}
export const parseAnyOf = ({ anyOf, description }: AnyOfParsingParam, data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', parentParamDescription}: ParsingSchemaOptions): ParsedParam[] => {
  const res: ParsedParam[] = anyOf.flatMap((anyOfItem, i) => {
    if (typeof anyOfItem === 'boolean') return [{
      paramName: `one of schema - ${anyOfItem}`,
      description: `one of schema - ${anyOfItem}`
    }]
    
    const parsedOneOf = parseSchema(anyOfItem, data, {parentParamName: `Вариант ${i+1} ` + parentParamName, parentParamType, parentParamDescription})
    
    return parsedOneOf
  })
  
  return res.length <= 1 ? res.map(param => ({ ...param, description: description ?? parentParamDescription ?? 'No description in any of' })) : [
    {
      paramName: parentParamName,
      description: description ?? parentParamDescription ?? 'No description in any of parent param',
      paramType: 'Любая комбинация вариантов'
    },
    ...res
  ]
}
export const parseOneOf = ({ oneOf, description }: OneOfParsingParam, data: OpenAPIV3_1.Document, {parentParamName = '', parentParamType = '', parentParamRequired = [], parentParamDescription}: ParsingSchemaOptions): ParsedNestedSchema['nestedParams']=> {
  
  if (oneOf.length <= 1) {
    const res = parseSchema(oneOf.at(0), data, {parentParamName, parentParamType, parentParamRequired, parentParamDescription}).map(param => ({
      required: parentParamRequired?.some(prop => param.paramName.endsWith(prop) || param.paramName.endsWith(`${prop}[index]`)),
      ...param,
      description: param.description ?? description ?? '',
    }))
    return res
  }
  const res: ParsedParam[] = oneOf.flatMap((oneOfItem, i) => {
    if (typeof oneOfItem === 'boolean') return [{
      paramName: `one of schema - ${oneOfItem}`,
      description: `one of schema - ${oneOfItem}`
    }]
    
    const parsedOneOf = parseSchema(oneOfItem, data, {parentParamName: `Вариант ${i+1} ` + parentParamName, parentParamType, parentParamRequired})
    return parsedOneOf
  })
  
  return [
    {
      paramName: parentParamName,
      description: description ?? '',
      paramType: 'Один из вариантов',
      required: parentParamRequired?.some(prop => parentParamName.endsWith(prop) || parentParamName.endsWith(`${prop}[index]`))
    },
    ...res
  ]
}

type PropertiesRecord = OpenAPIV3_1.NonArraySchemaObject['properties'] 
export const parsePropertyType = (property: NonNullable<PropertiesRecord>[string] | undefined, data: OpenAPIV3_1.Document, {parentParamType = ''}: ParsingSchemaOptions): string => {
  
  if (!property) return 'Не передано свойство - ошибка в логике парсинга'  
  if (typeof property === 'boolean') return `schema - ${property}`
  if ('$ref' in property) {
    const parsedRef = parseRefSchema(property, data, {})
    
    return parsedRef.at(0)?.paramType ?? ''
  }
  if('oneOf' in property) {
    const joinedType = property.oneOf?.map(propPart => {
      if (typeof property === 'boolean') return 'boolean schema'
      //@ts-expect-error idk
      if ('$ref' in propPart) {
        const parsedRef = parseRefSchema(propPart, data, {})
        const res = parsedRef.at(0)?.paramType ?? ''
        return parentParamType ? `${parentParamType}[${res}]` : res
      }
      //@ts-expect-error idk
      const parsedType = propPart.type ?? typeof propPart.enum?.at(0) ?? ''
      //@ts-expect-error idk
      const parsedFormat = propPart.format ? `[${propPart.format}]` : ''
      //@ts-expect-error idk
      const parsedPattern = propPart.pattern ? `[${propPart.pattern}]` : ''
      //@ts-expect-error idk
      const parsedEnum = propPart.enum ? `[\n${propPart.enum.join(',\n')}\n]` : ''
      const resType = `${parsedType}${parsedFormat}${parsedPattern}${parsedEnum}`
      return parentParamType ? `${parentParamType}[${resType}]` : resType
    })
    const onlyUniqueJoinedTypes = new Set(joinedType ?? [])
    return Array.from(onlyUniqueJoinedTypes).join('\n')
  }
  if('properties' in property) return parentParamType ? `${parentParamType}[object]` : 'object'

  const parsedType = property.type ?? typeof property.enum?.at(0) ?? ''
  const parsedFormat = property.format ? `[${property.format}]` : ''
  const parsedPattern = property.pattern ? `[${property.pattern}]` : ''
  const parsedEnum = property.enum ? `[\n${property.enum.join(',\n')}\n]` : ''
  const resType = `${parsedType}${parsedFormat}${parsedPattern}${parsedEnum}`
  return parentParamType ? `${parentParamType}[${resType}]` : resType
}