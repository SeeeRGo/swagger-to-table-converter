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

type NonMixedSchema =  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject
export type ParsedParam = {
  description: string
  paramName: string
  paramType?: string
  required?: boolean
  schema?: ParsedParam | ParsedParam[]
}
const parseObjectSchema = (schema:  OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam[] => {
  console.log('parseObjectSchema - schema', schema);
  
  const paramsArray = Object.entries(schema.properties ?? {}).map(([key, value]) => typeof value === 'boolean' ? {
    name: key,
    in: 'unknown param type',
    description: 'Нет описания',
  } : '$ref' in value ? {
    name: key,
    ...parseReferenceSchema(data, value)
  } : {
    name: key,
    in: value.type,
    required: !!schema.required?.find(reqKey => reqKey === key),
    description: value.description ?? 'Нет описания',
    ...(false ? { $ref: '' } : {})
  })
  console.log('parseObjectSchema - paramsArray', paramsArray);
    // @ts-expect-error types are not for prototyping

  return parseParameters(paramsArray, data)
}
const parsePrimitiveSchema = (schema: OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  return schema.type === 'object' ? parseObjectSchema(schema, data) : {
    description: schema.description ?? 'Primitive param description',
    paramName: 'primitive param name',
    paramType: `${schema.type}${schema.format ? `($${schema.format})` : ''}${schema.enum ? `[\n${schema.enum.join(',\n')}\n]` : ''}`, 
    schema: {
      description: schema.description ?? 'Primitive param description',
      paramName: 'primitive param name in schema',
      paramType: `${schema.type}${schema.format ? `($${schema.format})` : ''}${schema.enum ? `[\n${schema.enum.join(',\n')}\n]` : ''}`, 
    }
  }
}
const parseSchemaWithReference = (schema:  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document) => {
  if('$ref' in schema) {
    return parseReferenceSchema(data, schema)
  } else {
    // console.log('primitive schema to be parsed', schema);
    return parsePrimitiveSchema(schema, data)
  }
}
const parseSchemaWithReferencendMixedObjects = (schema:  OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.MixedSchemaObject, data: OpenAPIV3_1.Document) => {
  return 'items' in schema ? parsePrimitiveMixedSchema() : parseSchemaWithReference(schema as NonMixedSchema, data)
}
const parsePrimitiveArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  const parsedSchema = typeof schema === 'boolean' ? {
    description: 'Array of something',
    paramName: 'Unknown param'
  } : parseSchemaWithReferenceAndArrays(schema.items, data)
  // console.log('parsePrimitiveArraySchema', parsedSchema);
  
  return parsedSchema
}
const parsePrimitiveMixedSchema = (): ParsedParam => ({
  description: 'Array of mixed types',
  paramName: 'Unknown mixed type param'
})
const parseSchemaWithReferenceAndArrays = (schema: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject |  OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  // const parsedArraySchema = typeof schema !== 'boolean' && 'items' in schema && schema.type === 'array' ? parsePrimitiveArraySchema(schema, data) : ''
  // console.log('parseSchemaWithReferenceAndArrays - array', parsedArraySchema);
  // const parsedReferenceSchema = typeof schema === 'boolean' || ('items' in schema && schema.type === 'array') ? '' : parseSchemaWithReferencendMixedObjects(schema, data)
  // console.log('parseSchemaWithReferenceAndArrays - reference', parsedReferenceSchema);
  if(typeof schema === 'boolean') {
    return []
  } else if ('items' in schema && schema.type === 'array') {
    return parsePrimitiveArraySchema(schema, data)
  } else {
    return parseSchemaWithReferencendMixedObjects(schema, data)
  }

}

const parseReferenceSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.ReferenceObject) => {
  console.log('parseReferenceSchema', schema);
  
  const referenceSchema = findSchema(data, getSchemaNameFromRef(schema.$ref))
  const res = referenceSchema ? parseSchemaWithReferenceAndArrays(referenceSchema, data) : {
    description: 'Some reference type',
    paramName: 'Unknown reference type param'
  }
  console.log('parsedRef', res);
  
  return res
}

const getSchemaNameFromRef = (ref: string) => ref.split('/').at(-1)

const findSchema = (data: OpenAPIV3_1.Document, schemaName?: string) => {
  if(!schemaName) return undefined
  const schemaKey = data.components?.schemas ? Object.keys(data.components.schemas).find((key) => key === schemaName) : undefined
  return schemaKey && data.components?.schemas ? data.components?.schemas[schemaKey] : undefined
}

const parseParameters = (params: (OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.ReferenceObject)[], data: OpenAPIV3_1.Document): ParsedParam[] => params.map((param) => {
  if ('$ref' in param) {
    return {
      description: param.description ?? 'Нет описания',
      paramName: 'name' in param ? param.name as string : 'array',
      schema: parseReferenceSchema(data, param)
    }
  } else {
    // console.log('param', param);
    
    const schema = parseSchemaWithReferenceAndArrays(param, data)
    const paramParseResult = {
      paramName: 'name' in param ? param.name as string : 'array',
      paramType: 'in' in param ? param.in as string : 'array',
      description: param.description ?? 'Нет описания',
      required: !!param.required, // TS is bugging about this. Or my types are wrong
      schema
    }
    // console.log('paramParseResult', paramParseResult);
    return paramParseResult
  }
})

const parseResponseEntry = (methodDesc: OpenAPIV3_1.PathItemObject[keyof OpenAPIV3_1.PathItemObject], data: OpenAPIV3_1.Document) => {
  if(typeof methodDesc === 'object' && 'responses' in methodDesc && '200' in methodDesc.responses) {
    return {
      description: methodDesc.responses[200].description,
      schema: 'content' in methodDesc.responses[200] && methodDesc.responses[200].content && 'application/json' in methodDesc.responses[200].content && methodDesc.responses[200].content['application/json'].schema ? parseSchemaWithReferenceAndArrays(methodDesc.responses[200].content['application/json'].schema, data) : []
    }
  } else {
    return {
     description: 'No description',
     paramName: 'No param name',
     paramType: 'No param type',
     required: false,
     schema: []
   }
  }
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
    inputParams: 'parameters' in methodDesc ? methodDesc?.parameters?.map((param: (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)): ParsedParam => '$ref' in param ? {
      description: param.description ?? 'Нет описания',
      paramName: param.$ref ?? 'Нет имени параметра'
    } : {
      paramName: param.name ?? 'Нет имени параметра',
      paramType: param.in,
      description: param.description ?? 'Нет описания',
      required: param.required,
      schema: param.schema ? parseSchemaWithReferenceAndArrays(param.schema, data) : []
    }) : []
  } : {
    path: key,
    method,
    responses: {
      description: 'No description',
      paramName: 'No param name',
      paramType: 'No param type',
      required: false,
      schema: []
    },
    inputParams: [],
  }) : []) : []
}
