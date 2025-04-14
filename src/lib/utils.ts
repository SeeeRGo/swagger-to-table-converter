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

// export interface ParsedParam {
//   paramName: string
//   paramType?: InputParamType
//   description: string
//   required: boolean
//   schema: string
//   schemaComment: string
// } 
// const notBoolean = <T>(value: T): value is Exclude<T, boolean> => typeof value !== 'boolean'
const isParameter = (value: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.ParameterObject): value is OpenAPIV3_1.ParameterObject => typeof value !== 'boolean' && 'in' in value
type NonMixedSchema = OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject
export type ParsedParam = {
  description: string
  paramName: string
  paramType?: string
  paramIn?: string // 'query' | 'path'
  required?: boolean
}

export type ParsedNestedSchema = {
  parentName: string
  parentType: string
  nestedParams: ParsedParam[]
}

const sanitizeRef = (ref?: string) => ref ? ref.substring(ref.indexOf('#')) : ref

const getSchemaNameFromRef = (ref: string) => ref.split('/').at(-1)

const findSchema = (data: OpenAPIV3_1.Document, schemaName?: string) => {  
  if (!schemaName) return undefined
  const schemas = {
    ...(data.components?.schemas ?? {}),
    ...(data.components?.parameters ?? {}),
  }
  const schemaKey = Object.keys(schemas).find((key) => key === schemaName)

  return schemaKey && Object.keys(schemas).length ? schemas[schemaKey] : undefined
}

export const parseData = (data?: OpenAPIV3_1.Document) => {
    return '' 
}

export const parseParameters = (parameters: (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[], data: OpenAPIV3_1.Document): ParsedParam[] => {
  return parameters.flatMap(parameter => [parseParam(parameter, data)])
}

export const parseParam = (param: OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | undefined, data: OpenAPIV3_1.Document): ParsedParam => {  
  if (param === undefined) return 'Нет схемы - где-то ошибка логики парсинга'
  if (typeof param === 'boolean') return `param - ${param}`
  if ('$ref' in param) {
    const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(param?.$ref) ?? ''))

    const res = parseParam(referenceSchema, data)
    return res
  }

  if ('schema' in param) {
    if (param.schema && ('$ref' in param.schema || 'allOf' in param.schema || 'oneOf' in param.schema || param.schema.type === 'array')) {
      const parsedSchema = parseSchema(param.schema, data)
      
      return {
        paramName: param.name,
        paramIn: param.in,
        paramType: typeof parsedSchema !== 'string' ? parsedSchema.parentType : parsedSchema,
        description: param.description ?? '',
        required: !!param.required
      }
    }

    const parsedType = parsePropertyType(param.schema, data)
    
    return {
      paramName: param.name,
      paramIn: param.in,
      paramType: parsedType,
      description: param.description ?? '',
      required: !!param.required
    }
  }
  return 'Какой-то непонятный входной параметр - ошибка логики парсинга' 
}

export const parseSchema = (schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ParameterObject | undefined, data: OpenAPIV3_1.Document): string | ParsedNestedSchema => {
  if (schema === undefined) return 'Нет схемы - где-то ошибка логики парсинга'
  if (typeof schema === 'boolean') return `schema - ${schema}`
  if ('$ref' in schema) return parseRefSchema(schema, data)
  if ('in' in schema) return ''
  if (schema.properties) return parseProperties(schema.properties, schema.required, data)
  if ('items' in schema) {
    if (schema.type === 'array') return parseArraySchema(schema, data)
    else return parseMixedSchema(schema)
  }
  if (schema.enum) return parsePropertyType(schema, data)
  if (schema.allOf) return parseAllOf(schema.allOf, data)
  if (schema.oneOf) return parseOneOf(schema.oneOf, data)
  if (schema.type === 'string' || schema.type === 'integer' || schema.type === 'boolean' || schema.type === 'number') return parsePropertyType(schema, data)
    console.log('schema unknown case', schema);
      
  return 'Какой-то непонятный необработанный кейс - ошибка логики парсинга' + String(schema)
}

export const parseRefSchema = (ref: OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document, isParameter: boolean = false): string | ParsedNestedSchema => {
  
  const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(ref.$ref) ?? ''))
  
  return isParameter ? parseParam(referenceSchema, data) : parseSchema(referenceSchema, data)
}

export const parseArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): string | ParsedNestedSchema => {
  if (schema === undefined) return 'Нет массива и/или его элементов - где-то ошибка логики парсинга'
  if (typeof schema === 'boolean') return `schema - ${schema}`
  const itemsSchema = parseSchema(schema.items, data)
  // console.log('itemsSchema', itemsSchema);
  
  const itemsNestedSchema: ParsedNestedSchema = typeof itemsSchema !== 'string' ? itemsSchema : {
    parentName: '',
    parentType:  itemsSchema,
    nestedParams: []
  }
  
  return {
    parentName: '',
    parentType: `${schema.type}[${itemsNestedSchema.parentType}]`,
    nestedParams: itemsNestedSchema.nestedParams
  }
}
export const parseMixedSchema = (schema: OpenAPIV3_1.MixedSchemaObject): string | ParsedNestedSchema => {
  return ''
}

export const parseProperties = (properties: OpenAPIV3_1.NonArraySchemaObject['properties'], required:  OpenAPIV3_1.NonArraySchemaObject['required'], data: OpenAPIV3_1.Document): string | ParsedNestedSchema => {
  if (!properties) return 'Нет пропертей схемы типа объект - где-то ошибка логики парсинга'
  return {
    parentName: '',
    parentType: 'object',
    nestedParams: Object.entries(properties).flatMap(([name, property]): ParsedParam[] => {      
      if (property === undefined) return 'Нет отдельного свойства - где-то ошибка логики парсинга'
      if (typeof property === 'boolean') return `property - ${property}`
      if ('$ref' in property) return parseRefSchema(property, data)
        if ('items' in property) {
          if (property.type === 'array') return parseArraySchema(property, data)
          else return parseMixedSchema(property)
        }
      return [{
        paramName: name,
        paramType: parsePropertyType(property, data),
        description: property.description ?? '',
        required: required ? required.some(prop => prop === name) : false
      }]
    })
  }
}
export const parseAllOf = (allOfArr: NonNullable<OpenAPIV3_1.NonArraySchemaObject['allOf']>, data: OpenAPIV3_1.Document): ParsedNestedSchema => {
  const nestedParams = allOfArr.flatMap(schema => {
    const allOfItemSchema = parseSchema(schema, data)
    return typeof allOfItemSchema !== 'string' ? allOfItemSchema.nestedParams : []
  })
  return {
    parentName: '',
    parentType: nestedParams.length ? 'object' : allOfArr.map(schema => {
      const allOfItemSchema = parseSchema(schema, data)
      return allOfItemSchema
    }).join(), // case to be refactored
    nestedParams: nestedParams
  }
}
export const parseOneOf = (oneOfArr: NonNullable<OpenAPIV3_1.NonArraySchemaObject['oneOf']>, data: OpenAPIV3_1.Document): string | ParsedNestedSchema => {
  if (oneOfArr.length === 1) return parseSchema(oneOfArr[0], data)
  return ''
}

type PropertiesRecord = OpenAPIV3_1.NonArraySchemaObject['properties'] 
export const parsePropertyType = (property: NonNullable<PropertiesRecord>[string] | undefined, data: OpenAPIV3_1.Document): string => {
  if (!property) return 'Не передано свойство - ошибка в логике парсинга'  
  if (typeof property === 'boolean') return `schema - ${property}`
  if ('$ref' in property) {
    const parsedRef = parseRefSchema(property, data)
    if (typeof parsedRef === 'string') return parsedRef
    return parsedRef.parentType
  }

  const parsedType = property.type ?? typeof property.enum?.at(0) ?? ''
  const parsedFormat = property.format ? `[${property.format}]` : ''
  const parsedPattern = property.pattern ? `[${property.pattern}]` : ''
  const parsedEnum = property.enum ? `[\n${property.enum.join(',\n')}\n]` : ''
  return `${parsedType}${parsedFormat}${parsedPattern}${parsedEnum}`
}