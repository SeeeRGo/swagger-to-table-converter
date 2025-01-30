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
const notBoolean = <T>(value: T): value is Exclude<T, boolean> => typeof value !== 'boolean'

type NonMixedSchema =  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject
type ParsedParam = {
  description: string
  paramName: string
  paramType?: string
  required?: boolean
  schema?: string | ParsedParam[]
}
const parseObjectSchema = (schema:  OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam[] => {
  const paramsArray = Object.values(schema.properties ?? {}).filter(notBoolean)
  return parseParameters(paramsArray, data)
}
const parsePrimitiveSchema = (schema: OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document): string | ParsedParam[] => schema.type === 'object' ? parseObjectSchema(schema, data) : `${schema.type}${schema.format ? `($${schema.format})` : ''}${schema.enum ? `[\n${schema.enum.join(',\n')}\n]` : ''}`
const parseSchemaWithReference = (schema:  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document) => '$ref' in schema ? parseReferenceSchema(data, schema) : parsePrimitiveSchema(schema, data)
const parseSchemaWithReferencendMixedObjects = (schema:  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.MixedSchemaObject, data: OpenAPIV3_1.Document) => 'items' in schema ? parsePrimitiveMixedSchema(schema) : parseSchemaWithReference(schema as NonMixedSchema, data)
const parsePrimitiveArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): string => typeof schema === 'boolean' ? 'Array of something' :  `Array(${parseSchemaWithReferenceAndArrays(schema.items, data)})`
const parsePrimitiveMixedSchema = (schema: OpenAPIV3_1.MixedSchemaObject): string => `Array of Mixed types`
const parseSchemaWithReferenceAndArrays = (schema: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): string | ParsedParam[] => typeof schema === 'boolean' ? 'Some Schema' : 'items' in schema && schema.type === 'array' ? parsePrimitiveArraySchema(schema, data) : parseSchemaWithReferencendMixedObjects(schema, data)

const parseReferenceSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.ReferenceObject) => {
  const referenceSchema = findSchema(data, getSchemaNameFromRef(schema.$ref))
  return referenceSchema ? parseSchemaWithReferenceAndArrays(referenceSchema, data) : ''
}

const getSchemaNameFromRef = (ref: string) => ref.split('/').at(-1)

const findSchema = (data: OpenAPIV3_1.Document, schemaName?: string) => {
  if(!schemaName) return undefined
  const schemaKey = data.components?.schemas ? Object.keys(data.components.schemas).find((key) => key === schemaName) : undefined
  return schemaKey && data.components?.schemas ? data.components?.schemas[schemaKey] : undefined
}

const parseParameters = (params: (OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.ReferenceObject)[], data: OpenAPIV3_1.Document): ParsedParam[] => params.map((param) => '$ref' in param ? {
  description: param.description ?? 'Нет описания',
  paramName: param.$ref.split('/').at(-1) ?? 'Не удалось получить назаваник'
} : {
  paramName: 'name' in param ? param.name as string : 'array',
  paramType: 'in' in param ? param.in as string : 'array',
  description: param.description ?? 'Нет описания',
  required: !!param.required, // TS is bugging about this. Or my types are wrong
  schema: parseSchemaWithReferenceAndArrays(param, data)
})

const parseResponseEntry = (methodDesc: OpenAPIV3_1.PathItemObject[keyof OpenAPIV3_1.PathItemObject], data: OpenAPIV3_1.Document) => typeof methodDesc === 'object' && 'responses' in methodDesc && '200' in methodDesc.responses ? {
  description: methodDesc.responses[200].description,
  schema: 'content' in methodDesc.responses[200] && methodDesc.responses[200].content && 'application/json' in methodDesc.responses[200].content && methodDesc.responses[200].content['application/json'].schema ?  parseSchemaWithReferenceAndArrays(methodDesc.responses[200].content['application/json'].schema, data) : 'No schema'
} : {
  schema: 'No schema'
} 
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
    responses: parseResponseEntry(methodDesc, data),
    inputParams: 'parameters' in methodDesc ? methodDesc?.parameters?.map((param: (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)) => '$ref' in param ? {
      description: param.description,
      paramName: param.$ref
    } : {
      paramName: param.name,
      paramType: param.in,
      description: param.description,
      required: param.required,
      schema: param.schema ? parseSchemaWithReferenceAndArrays(param.schema, data) : 'No schema'
    }) : []
  } : {
    path: key,
    method,
    responses: {
      schema: 'No schema'
    },
    inputParams: [],
  }) : []) : []
}
