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
  required?: boolean
  schema?: ParsedParam | ParsedParam[]
}

const sanitizeRef = (ref: string) => ref.substring(ref.indexOf('#'))
const parseObjectSchema = (schema: OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document, depth = 0): ParsedParam[] => {

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
        ...parseReferenceSchema(data, value, depth)
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
        ...parseReferenceSchema(data, value.items, depth)
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
  return parseParameters(paramsArray, data)
}
const parsePrimitiveSchema = (schema: OpenAPIV3_1.NonArraySchemaObject, data: OpenAPIV3_1.Document, depth = 0): ParsedParam | ParsedParam[] => {
  if (schema.type === 'object') {
    return parseObjectSchema(schema, data, depth)
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
}
const parseSchemaWithReference = (schema: OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document, depth = 0) => {
  if ('$ref' in schema) {
    return depth <  1 ? parseReferenceSchema(data, schema, depth + 1) : {
      description: schema.description ?? 'Recursive param description',
      paramName: schema.$ref,
      paramType: 'Deeply nested schema',
    }
  } else if ('0' in schema) {
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
    // console.log('properties', properties);

    return parseObjectSchema({
      properties
    }, data, depth)
  } else {
    // console.log('primitive schema to be parsed', schema);
    return parsePrimitiveSchema(schema, data, depth)
  }
}

const parseSchemaWithReferencendMixedObjects = (schema: OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.MixedSchemaObject, data: OpenAPIV3_1.Document, depth = 0) => {
  return 'items' in schema ? parsePrimitiveMixedSchema() : parseSchemaWithReference(schema as NonMixedSchema, data, depth)
}
const parsePrimitiveArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document): ParsedParam | ParsedParam[] => {
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
  }
  else {
    // console.log('array schema', schema);
    
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
const parseSchemaWithReferenceAndArrays = (schema: boolean | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.ParameterObject, data: OpenAPIV3_1.Document, depth = 0): ParsedParam | ParsedParam[] => {
  // const parsedArraySchema = typeof schema !== 'boolean' && 'items' in schema && schema.type === 'array' ? parsePrimitiveArraySchema(schema, data) : ''
  // console.log('parseSchemaWithReferenceAndArrays - array', parsedArraySchema);
  // const parsedReferenceSchema = typeof schema === 'boolean' || ('items' in schema && schema.type === 'array') ? '' : parseSchemaWithReferencendMixedObjects(schema, data)
  // console.log('parseSchemaWithReferenceAndArrays - reference', parsedReferenceSchema);
  if (typeof schema === 'boolean') {
    return []
  }
  else if (isParameter(schema)) {
    return parseParameters([schema], data)
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
    return parseSchemaWithReferencendMixedObjects(schema, data, depth)
  }

}

const parseReferenceSchema = (data: OpenAPIV3_1.Document, schema: OpenAPIV3_1.ReferenceObject, depth = 0) => {
  // console.log('parseReferenceSchema', schema);

  const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(schema.$ref)))
  // console.log('referenceSchema', referenceSchema);
  
  const res = referenceSchema && referenceSchema !== true ? parseSchemaWithReferenceAndArrays(referenceSchema, data, depth) : {
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
  return schemaKey && schemas ? schemas[schemaKey] : undefined
}

const parseParameters = (params: (OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.MixedSchemaObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)[], data: OpenAPIV3_1.Document, depth = 0): ParsedParam[] => params.flatMap((param) => {
  // console.log('param pre parsing', param);
  if ('$ref' in param) {
    const parsedSchema = parseReferenceSchema(data, param, depth)
    // console.log('parsedSchema with ref', parsedSchema);
    
    return parsedSchema instanceof Array ? parsedSchema : [{
      description: param.description ?? 'Нет описания',
      paramName: 'name' in param ? param.name as string : 'array',
      schema: parseReferenceSchema(data, param, depth)
    }]
  } else if ('items' in param && typeof param.items !== 'boolean' && param.items && '$ref' in param.items) {
    // console.log('param with items', param);
    
    const parsedItemsSchema = parseReferenceSchema(data, param.items, depth)
    // console.log('parsed param with items', parsedItemsSchema);
    
    return []
  }
  else {
    const schema = parseSchemaWithReferenceAndArrays(param, data, depth)
    // console.log('param', param, 'schema', schema);
    const paramParseResult = schema instanceof Array ? schema : [{
      paramName: 'name' in param ? param.name as string : 'array',
      paramType: 'in' in param ? param.in as string : !Array.isArray(schema) && schema.paramType ? schema.paramType : 'unknown param type',
      description: param.description ?? 'Нет описания',
      required: !!param.required, // TS is bugging about this. Or my types are wrong
      schema
    }]
    // console.log('paramParseResult', paramParseResult);
    return paramParseResult
  }
})

const parseResponseEntry = (methodDesc: OpenAPIV3_1.PathItemObject[keyof OpenAPIV3_1.PathItemObject], data: OpenAPIV3_1.Document) => {
  if (typeof methodDesc === 'object' && 'responses' in methodDesc && '200' in methodDesc.responses) {
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
      paramName: param.$ref ? sanitizeRef(param.$ref) : 'Нет имени параметра'
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
