import { Document, OpenAPIV3_1 } from "@/open-api-types"
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

export interface ParsedParam {
  paramName: string
  paramType?: InputParamType
  description: string
  required: boolean
  schema: string
  schemaComment: string
} 
const notBoolean = <T>(value: T): value is Exclude<T, boolean> => typeof value !== 'boolean'
const getPropetiesFromValueType = (data: OpenAPIV3_1.Document, value: Exclude<OpenAPIV3_1.SchemaObject, boolean>): any => {
  if(value.type === 'array') {
    return parseSchema(data, value.items)
  } else if (Array.isArray(value.type)) {
    return []
  } else {
    const paramsArray = Object.values(value.properties ?? {}).filter(notBoolean)
    return parseParameters(paramsArray)
  }
}

const parsePrimitiveSchema = (schema: OpenAPIV3_1.NonArraySchemaObject): string => `${schema.type}${schema.format ? `($${schema.format})` : ''}`
const parsePrimitiveArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject): string => `Array(${parsePrimitiveSchema(schema.items)})`

const parseSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject) => {
  if (typeof schema !== 'object') return undefined
  if ('$ref' in schema) {
    const referenceSchema = findSchema(data, getSchemaNameFromRef(schema.$ref))
    return referenceSchema ? parseSchema(data, referenceSchema) : undefined
  }
  return getPropetiesFromValueType(data, schema)
}
const getSchemaNameFromRef = (ref: string) => ref.split('/').at(-1)
const findSchema = (data: OpenAPIV3_1.Document, schemaName?: string) => {
  if(!schemaName) return undefined
  const schemaKey = data.components?.schemas ? Object.keys(data.components.schemas).find((key) => key === schemaName) : undefined
  return schemaKey && data.components?.schemas ? data.components?.schemas[schemaKey] : undefined
}
const parsePrimitiveProperty = (param: OpenAPIV3_1.NonArraySchemaObject, required: boolean): ParsedParam => {
  return {
    paramName: param.title ?? 'Нет названия',
    paramType: undefined,
    description: param.description ?? 'Нет описания',
    required,
    schema: parsePrimitiveSchema(param),
    schemaComment: ''
  } 
}
const parsePrimitiveParam = (param: OpenAPIV3_1.ParameterObject): ParsedParam => {
  return {
    paramName: param.name ?? 'Нет названия',
    paramType: param.in as InputParamType,
    description: param.description ?? 'Нет описания',
    required: !!param.required,
    schema: param.schema ? '$ref' in param.schema ? '' : parsePrimitiveSchema(param.schema) : '',
    schemaComment: ''
  } 
}
const parseParameters = (params: (OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.ReferenceObject)[]) => params.map((param) => '$ref' in param ? {
  description: param.description,
  paramName: param.$ref.split('/').at(-1)
} : {
  paramName: param.name,
  paramType: param.in,
  description: param.description,
  required: param.required,
  schema: `${param.schema}`
})
export const parseData = (data?: OpenAPIV3_1.Document) => {
  // const parsedSchemas = data?.components?.schemas ? Object.entries(data.components.schemas).map(([key, value]) => typeof value === 'object' ? {
  //   name: key,
  //   properties: Object.entries(value?.properties ?? {}).map(([valKey, valValue]) => typeof valValue === 'object' && '$ref' in valValue ? {
  //     name: valKey,
  //     type: valValue.$ref, 
  //     required: Array.isArray(value.required) ? !!value.required?.some(reqField => reqField === valKey) : false,
  //     description: valValue?.description ?? 'no Desc'
  //   } : {
  //     name: valKey,
  //     type: typeof valValue === 'object' ? valValue.type : 'no type', 
  //     required: Array.isArray(value.required) ? !!value.required?.some(reqField => reqField === valKey) : false,
  //     //@ts-expect-error typings are not for prototyping
  //     description: valValue?.description ?? 'no Desc'
  //   })
  // } : {
  //   name: key,
  //   properties: []
  // }) : []
  // return parsedSchemas
  return data?.paths ? Object.entries(data?.paths).flatMap(([key, value]) => value ? Object.entries(value).map(([method, methodDesc]) => typeof methodDesc === 'object' ? {
    path: key,
    method,
    methodDesc: 'summary' in methodDesc ? methodDesc?.summary : '',
    inputParams: 'parameters' in methodDesc ? methodDesc?.parameters?.map((param: (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)) => '$ref' in param ? {
      description: param.description,
      paramName: param.$ref
    } : {
      paramName: param.name,
      paramType: param.in,
      description: param.description,
      required: param.required,
      schema: `${param.schema}`
    }) : []
  } : {
    path: key,
    method,
    inputParams: [],
  }) : []) : []
}
