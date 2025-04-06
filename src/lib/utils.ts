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
  schema?: ParsedParam | ParsedParam[]
}

const sanitizeRef = (ref?: string) => ref ? ref.substring(ref.indexOf('#')) : ref
const parseObjectSchema = (schema: OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam[] => {
  
  const paramsArray = Object.entries(schema.properties ?? {}).map(([key, value]) => {
    if (typeof value === 'boolean' ) {
      return {
        name: key,
        in: 'unknown param type',
        description: 'Нет описания',
      }
    } else if ('$ref' in value) {
      const parsedReferenceParam = {
        name: key,
        description: value.description ?? '', 
        // @ts-expect-error tyypes are not for prototyping
        required: value.required || !!schema.required?.find(reqKey => reqKey === key),
        // type: 'object',
        ...parseReferenceSchema(data, value)
      }
      // console.log('parsedReferenceParam', parsedReferenceParam);
      
      return parsedReferenceParam
    } 
    //@ts-expect-error types are not for prototyping
    else if ('items' in value && '$ref' in value.items) {
      const parsedReferenceParam = {
        name: `${key}[index]`,
        paramType: 'array',
        required: value.required || !!schema.required?.find(reqKey => reqKey === key),
        description: value.description ?? '',
        ...parseReferenceSchema(data, value.items)
      }
      // console.log('parsedReferenceParam', parsedReferenceParam);
      
      return parsedReferenceParam
    } else if ('paramType' in value && value.paramType === 'array') {
      return {
        name: key,
        in: value.paramType,
        ...value,
      }
    } else if ('paramType' in value && value.paramType === 'object') {
      return {
        name: key,
        in: value.paramType,
        ...value,
      }
    }
     else if ('type' in value && value.type === 'array') {
      // console.log('primitive array to parse', value);
      const parsedArrSchema = parsePrimitiveArraySchema({
        //@ts-expect-error types are not for prototyping
        name: key,
        ...value
      }, data)
      return parsedArrSchema
    } else {
      return {
      name: key,
      in: value.type,
      required: value.required || !!schema.required?.find(reqKey => reqKey === key),
      description: value.description ?? 'Нет описания',
      ...(false ? { $ref: '' } : {})
    }
    }
  })
  // console.log('properties', schema.properties, 'paramsArray', paramsArray);

  // @ts-expect-error types are not for prototyping
  const parsedParameters = parseParameters(paramsArray, data)
  // console.log('parsedParameters', parsedParameters);
  
  return parsedParameters
}
const parsePrimitiveSchema = (schema: OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ParameterObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  if ('type' in schema) {
    if (schema.type === 'object') {
      // console.log('objectSchema to be parsed', schema);
      const parsedObject = parseObjectSchema(schema, data)
      // console.log('objectSchema just parsed', parsedObject);
      return parsedObject
    } else {
      // console.log('schema primitive', schema);
      const paramType = 'paramType' in schema ? schema.paramType : `${schema.type}${schema.format ? `($${schema.format})` : ''}${schema.enum ? `[\n${schema.enum.join(',\n')}\n]` : ''}` 
      // console.log('schema primitive paramType', paramType);
      return {
        description: schema.description ?? 'Primitive param description',
        paramName: 'primitive param name', //@ts-expect-error types are not for prototyping
        paramType,
      }
    }
  } else {
    return {
      description: schema.description ?? 'Нет описания', // @ts-expect-error just for build
      paramName: schema.name ?? 'Нет имени', // @ts-expect-error just for build
      paramIn: schema.in ?? '',
      required: typeof schema.required === 'boolean' ? schema.required : undefined,
      schema: {
        description: schema.description ?? 'Нет описания', // @ts-expect-error just for build
        paramName: schema.name ?? 'Нет имени', // @ts-expect-error just for build
        paramIn: schema.in ?? '',
        required: typeof schema.required === 'boolean' ? schema.required : undefined,

      }
    }
  }
}
const parseSchemaWithReference = (schema: OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | ParsedParam | ParsedParam[], data: OpenAPIV3_1.Document) => {
  // console.log('parsing schema with Reference', schema);
  
  if ('$ref' in schema) {
    return parseReferenceSchema(data, schema)
  } 
  else if(Array.isArray(schema)) {
    // console.log('schema just params', schema);
    return schema
  }
  else if ('0' in schema) {
    // console.log('nested schema to be parsed', schema);
    //@ts-expect-error types are not for prototyping
    const parentParamName = schema.name ?? 'parentParam'
    const parsedFields = Object.entries(schema).filter(([key]) => key !== 'name' && key !== 'paramType' && key !== 'description' && key !== 'required').map(([key, value]) => [`${parentParamName}.${value.paramName}`, {
      ...value,
      type: value.paramType,
      name: `${parentParamName}.${value.paramName}`
    }])
    const properties = Object.fromEntries([[parentParamName, {
      //@ts-expect-error types are not for prototyping
      paramType: schema.paramType ?? 'object',
      name: parentParamName,
      description: schema.description ?? ''
    }], ...parsedFields])

    return parseObjectSchema({
      properties
    }, data)
  } else {
    // console.log('primitive schema to be parsed', schema); 
    // @ts-expect-error just for build
    const parsedPrimitiveSchema = parsePrimitiveSchema(schema, data)
    // console.log('parsedPrimitiveSchema', parsedPrimitiveSchema);
    return parsedPrimitiveSchema
  }
}

const parseSchemaWithReferencendMixedObjects = (schema: OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.MixedSchemaObject, data: OpenAPIV3_1.Document) => {
  // console.log('mixed schema to be parsed', schema);
  if ('items' in schema) {
    return parsePrimitiveMixedSchema()
  } else {
    const parsedSchema = parseSchemaWithReference(schema as NonMixedSchema, data)
    // console.log('parsedMixedSchema', parsedSchema);
    
    return parsedSchema
  }
}
const parsePrimitiveArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  if (!schema.items) {
    // @ts-expect-error just for build
    return parsePrimitiveSchema(schema, data)
  }
  if(typeof schema === 'boolean') {
    return {
      description: 'Array of something',
      paramName: 'Unknown param'
    }
  } else if (typeof schema.items === 'boolean') {
    return {
      description: 'Nested Array of something',
      paramName: 'Unknown nested param'
    }
  } else if('$ref' in schema.items) {
    return parseSchemaWithReferenceAndArrays(schema.items, data)
  }
  else {
    
    // const parentParamName = schema.name ?? 'parentParam'
    // const parsedFields = Object.entries(schema).filter(([key]) => key !== 'name').map(([_, value]) => [`${parentParamName}.${value.paramName}`, {
    //   ...value,
    //   type: value.paramType,
    //   name: `${parentParamName}.${value.paramName}`
    // }])
    // const properties = Object.fromEntries(parsedFields)
    const enhancedSchema = {
      description: schema.description,
      //@ts-expect-error types are not for prototyping
      name: `Array[${schema.name}]`,
      ...schema.items
    }
    // console.log('schema with items to parse', enhancedSchema);
    
    return parseSchemaWithReferenceAndArrays(enhancedSchema, data)
  }
}
const parsePrimitiveMixedSchema = (): ParsedParam => ({
  description: 'Array of mixed types',
  paramName: 'Unknown mixed type param'
})
const parseSchemaWithReferenceAndArrays = (schema: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.ParameterObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
  // const parsedArraySchema = typeof schema !== 'boolean' && 'items' in schema && schema.type === 'array' ? parsePrimitiveArraySchema(schema, data) : ''
  // console.log('parseSchemaWithReferenceAndArrays - array', parsedArraySchema);
  // const parsedReferenceSchema = typeof schema === 'boolean' || ('items' in schema && schema.type === 'array') ? '' : parseSchemaWithReferencendMixedObjects(schema, data)
  // console.log('parseSchemaWithReferenceAndArrays - reference', parsedReferenceSchema);
  if (typeof schema === 'boolean') {
    return []
  }
  // else if ('type' in schema && schema.type === 'refArray') {
  // console.log('primitive ref array to parse', schema);
  // const parsedArrSchema = parsePrimitiveArraySchema(schema.items, data)
  // console.log('parsedArrSchema', parsedArrSchema);

  //   return parsedArrSchema
  // }
   else if ('type' in schema && schema.type === 'array') {
    // console.log('primitive array to parse', schema);
    const parsedArrSchema = parsePrimitiveArraySchema(schema, data)
    return parsedArrSchema
  } else {
    // console.log('non array to parse', schema);
    // @ts-expect-error just for build
    const parsedMixed = parseSchemaWithReferencendMixedObjects(schema, data)
    // console.log('parsedMixed', parsedMixed);
    return parsedMixed
  }

}

const specialCases = (schema: OpenAPIV3_1.ReferenceObject) => {  
  return schema && typeof schema === 'object' && ('allOf' in schema || 'oneOf' in schema)
}

const parseCustomSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.ReferenceObject) => {

  switch (true) {
    case 'allOf' in schema: 
      const parsed = Array.isArray(schema.allOf) ? schema.allOf.flatMap((schema) => {
        if ('$ref' in schema) {
          const res = parseReferenceSchema(data, schema)        
          if(Array.isArray(res)) {
            return res
          } else {
            return [res]
          }
        } else if ('properties' in schema) {
          return parseObjectSchema({
            properties: schema.properties
          }, data)
        } else {
          return []
        }
      }) : schema.allOf 
          
      return parsed
    case 'oneOf' in schema:       
      const parsedOne = Array.isArray(schema.oneOf) ? schema.oneOf.flatMap(param => {
        if ('$ref' in param) {
          const res = parseReferenceSchema(data, param)    
          if(Array.isArray(res)) {
            return res
          } else {
            return [res]
          }
        } else {
          // @ts-expect-error just for build
          return [parsePrimitiveSchema(param)]
        }
      }) : schema.oneOf    
      return parsedOne
    default:
      return schema
  }
}
// @ts-expect-error just for build
const specialIgnoreCases = (schema: OpenAPIV3_1.ReferenceObject, referenceSchema: OpenAPIV3_1.ReferenceObject | OpenAPIV3.ParameterObject | OpenAPIV3_1.SchemaObject | undefined) => {
  if (!schema || !referenceSchema) return false
  const schemaRef =  getSchemaNameFromRef(sanitizeRef(schema?.$ref) ?? '')
  // @ts-expect-error just for build
  const refSchemaSameRef = typeof referenceSchema === 'object' && 'allOf' in referenceSchema && Array.isArray(referenceSchema?.allOf) && referenceSchema?.allOf.some(sch => sch && typeof sch === 'object' && '$ref' in sch && schema.$ref && getSchemaNameFromRef(sanitizeRef(schema.$ref) ?? '') === schemaRef)
  return refSchemaSameRef
}

const parseReferenceSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.ReferenceObject):ParsedParam | ParsedParam[] => {
  // console.log('parseReferenceSchema', schema);
  
  const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(schema.$ref) ?? ''))
  // console.log('referenceSchema', referenceSchema);
  if (specialIgnoreCases(schema, referenceSchema)) {
    return []
  }
  if(typeof referenceSchema === 'object' && 'in' in referenceSchema) {
    if('schema' in referenceSchema ) {
      // @ts-expect-error just for build
      const parsedSchema = referenceSchema.schema && !specialCases(referenceSchema.schema) ? parsePrimitiveSchema(referenceSchema.schema, data) : parseCustomSchema(data, referenceSchema.schema)
      return {
        paramName: 'name' in referenceSchema ? referenceSchema.name as string : 'array',
        paramIn: referenceSchema.in as string, // @ts-expect-error just for build
        paramType: Array.isArray(parsedSchema) ? parsedSchema.at(0)?.paramType ?? parsedSchema.at(0)?.schema?.paramType : parsedSchema?.paramType ?? 'Не найден тип',
        description: referenceSchema.description ?? 'Нет описания',
        required: !!referenceSchema.required, // TS is bugging about this. Or my types are wrong
        schema: Array.isArray(parsedSchema) ? {
          ...parsedSchema.at(0),
          paramType: parsedSchema.at(0)?.paramType ?? parsedSchema.at(0)?.schema?.paramType
        } : parsedSchema
      }
    } else {
      // @ts-expect-error just for build
      const parsedSchema = !specialCases(referenceSchema) ? parsePrimitiveSchema(referenceSchema, data) : parseCustomSchema(data, referenceSchema)
      return {
        paramName: 'name' in referenceSchema ? referenceSchema.name as string : 'array', 
        paramIn: referenceSchema.in, // @ts-expect-error just for build
        paramType: parsedSchema.paramType ?? 'Не найден тип',
        description: referenceSchema.description ?? 'Нет описания',
        required: !!referenceSchema.required, // @ts-expect-error just for build
        schema: parsedSchema
      }
    }
  }
  // @ts-expect-error just for build
  if (specialCases(referenceSchema)) {
    const parsedSchema = parseCustomSchema(data, referenceSchema)
    return {
      paramName: 'name' in referenceSchema ? referenceSchema.name as string : 'array', // @ts-expect-error just for build
      paramIn: referenceSchema.in, // @ts-expect-error just for build
      paramType: parsedSchema.paramType ?? 'Не найден тип',      description: referenceSchema.description ?? 'Нет описания', // @ts-expect-error just for build
      required: !!referenceSchema.required, // @ts-expect-error just for build
      schema: parsedSchema
    }
  }
  
  const res = referenceSchema && referenceSchema !== true ? parseSchemaWithReferenceAndArrays(referenceSchema, data) : {
    description: 'Some reference type',
    paramName: 'Unknown reference type param'
  }
  // console.log('parsedRef', res);

  return res
}

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

const parseParameters = (params: (OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)[], data: OpenAPIV3_1.Document): ParsedParam[] => params.flatMap((param) => {
  // console.log('param pre parsing', param);
  if ('$ref' in param) {
    const parsedSchema = parseReferenceSchema(data, param)
    // console.log('parsedSchema with ref', parsedSchema);
    
    return parsedSchema instanceof Array ? parsedSchema : [{
      description: param.description ?? 'Нет описания',
      paramName: 'name' in param ? param.name as string : 'array',
      schema: parseReferenceSchema(data, param)
    }]
  } else if ('items' in param && typeof param.items !== 'boolean' && param.items && '$ref' in param.items) {
    // console.log('param with items', param);
    
    const parsedItemsSchema = parseReferenceSchema(data, param.items)
    // console.log('parsed param with items', parsedItemsSchema);
    
    return parsedItemsSchema
  }
  else {
    const schema = parseSchemaWithReferenceAndArrays(param, data)
    // console.log('param', param, 'schema', schema);
    const paramParseResult = schema instanceof Array ? schema : [{
      paramName: 'name' in param ? param.name as string : 'array',
      paramIn: 'in' in param ? param.in as string : undefined,
      paramType: !Array.isArray(schema) && schema.paramType ? schema.paramType : 'unknown param type',
      description: param.description ?? 'Нет описания',
      required: !!param.required,
      schema: schema.paramType === 'undefined' ? {
        paramName: 'name' in param ? param.name as string : 'array',
        paramType: !Array.isArray(schema) && schema.paramType ? schema.paramType : 'unknown param type',
        description: param.description ?? 'Нет описания',
        required: !!param.required, 
      } : schema
    }]
    // console.log('paramParseResult', paramParseResult);
    return paramParseResult
  }
})

const parseResponseEntry = (methodDesc: OpenAPIV3_1.PathItemObject[keyof OpenAPIV3_1.PathItemObject], data: OpenAPIV3_1.Document) => {
  if (typeof methodDesc === 'object' && 'responses' in methodDesc && ('200' in methodDesc.responses || '201' in methodDesc.responses)) {
    if ('200' in methodDesc.responses) {
        const hasContent = 'content' in methodDesc.responses[200] && methodDesc.responses[200].content && ('application/json' in methodDesc.responses[200].content || 'application/soap+xml' in methodDesc.responses[200].content)
        console.log('hasContent', hasContent, 'methodDesc', methodDesc); // @ts-expect-error just for build
        const content = methodDesc.responses[200]?.content['application/json']?.schema ?? methodDesc.responses[200]?.content['application/soap+xml']?.schema ?? undefined
        console.log('content', content);
        const parsedResponseSchema = content ? parseSchemaWithReferenceAndArrays(content, data) : []
        console.log('parsedResponseSchema', parsedResponseSchema);
        return {
          description: methodDesc.responses[200]?.description,
          schema: parsedResponseSchema
        }
      
    } else if ('201' in methodDesc.responses) {
      const hasContent = 'content' in methodDesc.responses[201] && methodDesc.responses[201].content && ('application/json' in methodDesc.responses[201].content || 'application/soap+xml' in methodDesc.responses[201].content)
      console.log('hasContent', hasContent, 'methodDesc', methodDesc); // @ts-expect-error just for build
      const content = methodDesc.responses[201]?.content['application/json']?.schema ?? methodDesc.responses[201]?.content['application/soap+xml']?.schema ?? undefined
        console.log('content', content);
        const parsedResponseSchema = content ? parseSchemaWithReferenceAndArrays(content, data) : []
        console.log('parsedResponseSchema', parsedResponseSchema);
        
        return {
          description: methodDesc.responses[201]?.description,
          schema: parsedResponseSchema
        }
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
const parseRequestBodyEntry = (methodDesc: OpenAPIV3_1.PathItemObject[keyof OpenAPIV3_1.PathItemObject], data: OpenAPIV3_1.Document) => {
  // @ts-expect-error just for build
  if (typeof methodDesc === 'object' && 'requestBody' in methodDesc && 'content' in methodDesc.requestBody && ('application/json' in methodDesc.requestBody.content || 'application/soap+xml' in methodDesc.requestBody.content)) {
        const content = methodDesc.requestBody?.content['application/json']?.schema ?? methodDesc.requestBody?.content['application/soap+xml']?.schema ?? undefined
        // console.log('request bodycontent', content);
        const parsedRequestBodySchema = content ? parseSchemaWithReferenceAndArrays(content, data) : []
        // console.log('parsedRequestBodySchema', parsedRequestBodySchema);
        return {
          description: methodDesc.requestBody?.description,
          schema: parsedRequestBodySchema
        }
        // @ts-expect-error just for build
  } else if (typeof methodDesc === 'object' && 'requestBody' in methodDesc && '$ref' in methodDesc.requestBody) {
    return parseSchemaWithReferenceAndArrays(methodDesc.requestBody, data)
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
  console.log('data parsing');
  
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
  // return []
    const parsedPaths = data?.paths ? Object.entries(data?.paths).flatMap(([key, value]) => {
      console.log('value', value);
      if (value) {
        const parsedPath = Object.entries(value).map(([method, methodDesc]) => {
          const parsedInputParams = typeof methodDesc === 'object' && 'parameters' in methodDesc ? methodDesc?.parameters?.flatMap((param: (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)): ParsedParam | ParsedParam[] => {
            // console.log('param', param);
            if ('$ref' in param) {
              const parsedSchema = parseReferenceSchema(data, param)
              // console.log('param parsedSchema', parsedSchema);            
              return Array.isArray(parsedSchema) ? parsedSchema : [parsedSchema]
            } else {
              const parsedSchema = param.schema ? parseSchemaWithReferenceAndArrays(param.schema, data) : []
              return [{
                paramName: param.name ?? 'Нет имени параметра',
                paramIn: param.in,
                paramType: Array.isArray(parsedSchema) ? parsedSchema.at(0)?.paramType : parsedSchema.paramType,
                description: param.description ?? 'Нет описания',
                required: param.required,
                schema: parsedSchema
              }]
            }
            }) : []         
              if (typeof methodDesc === 'object') {
                const parsedMethodDesc = {
                  path: key,
                  method,
                  methodDesc: 'summary' in methodDesc ? methodDesc?.summary : '',
                  responses: parseResponseEntry(methodDesc, data),
                  requests: parseRequestBodyEntry(methodDesc, data),
                  inputParams: parsedInputParams
                } 
                return parsedMethodDesc
              } else {
                return {
                  path: key,
                  method,
                  responses: {
                    description: 'No description',
                    paramName: 'No param name',
                    paramType: 'No param type',
                    required: false,
                    schema: []
                  },
                  requests: {
                    description: 'No description',
                    paramName: 'No param name',
                    paramType: 'No param type',
                    required: false,
                    schema: []
                  },
                  inputParams: [],
                }
              }
        })
        console.log('parsedPath', parsedPath);
        
        return parsedPath
      } else return []
    }) : []
    return parsedPaths 
}
