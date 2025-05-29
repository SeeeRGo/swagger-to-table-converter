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

export type ParsedNestedSchema = {
  parentName: string
  parentType: string
  nestedParams: ParsedParam[]
}

type ParsedRequestBody = {
  schema: ParsedParam[],
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
        responses: parseResponse(methodDef.responses, data), //@ts-expect-error idk
        requests: parseRequestBody(methodDef.requestBody, data), //@ts-expect-error idk
        inputParams: parseParameters(methodDef?.parameters ?? [], data)
      })
    }))
}

export const parseParameters = (parameters: (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[], data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {
  return parameters.flatMap(parameter => parseParam(parameter, data, parentParamName, parentParamType))
}

export const parseParam = (param: OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | undefined, data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {  
  if (param === undefined) return [{
    paramName: 'Нет схемы - где-то ошибка логики парсинга',
    description: 'Нет схемы - где-то ошибка логики парсинга'
  }]
  if (typeof param === 'boolean') return [{
    paramName: `param - ${param}`,
    description: `param - ${param}`
  }]
  if ('$ref' in param) {
    const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(param?.$ref) ?? ''))
    if (typeof referenceSchema === 'object' && 'in' in referenceSchema) {
      return parseParam(referenceSchema, data, parentParamName, parentParamType)
    }
    if (typeof referenceSchema === 'object' && 'content' in referenceSchema) {
      return parseRequestBody(referenceSchema, data).schema
    }

    const res = parseParam(referenceSchema, data, parentParamName, parentParamType)
    return res
  }

  if ('schema' in param) {
    if (param.schema && ('$ref' in param.schema || 'allOf' in param.schema || 'oneOf' in param.schema || param.schema.type === 'array')) {
      const parsedSchema = parseSchema(param.schema, data, parentParamName, parentParamType)
      
      return [{
        paramName: param.name,
        paramIn: param.in,
        paramType: parsedSchema?.at(0)?.paramType ?? 'Не распарсился тип',
        description: param.description ?? '',
        required: !!param.required
      }]
    }

    const parsedType = parsePropertyType(param.schema, data, parentParamType)
    
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

export const parseSchema = (schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ParameterObject | undefined, data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {
  if (schema === undefined) return [{
    paramName: 'Нет схемы - где-то ошибка логики парсинга',
    description: 'Нет схемы - где-то ошибка логики парсинга'
  }]
  if (typeof schema === 'boolean') return [{
    paramName: `schema - ${schema}`,
    description: `schema - ${schema}`
  }]
  if ('$ref' in schema) return parseRefSchema(schema, data, parentParamName, parentParamType)
  if ('in' in schema) return parseParam(schema, data, parentParamName, parentParamType)
  if (schema.properties) {
    console.log('parentParamName', parentParamName, 'schema.required', schema.required);
    
    const res = [
      ...(parseAllOf(schema.allOf ?? [], data, parentParamName)),
      ...parseProperties(schema.properties, schema.required, data, parentParamName, parentParamType)
    ]
    // console.log('res in parse schema', parseProperties(schema.properties, schema.required, data, parentParamName, parentParamType).filter(({ paramName }) => paramName.includes('rusName')))
    return res
  }
  if ('items' in schema) {
    if (schema.type === 'array') {            
      return parseArraySchema(schema, data, schema.required, parentParamName, parentParamType ? parentParamType : parentParamType + 'array')
    }
    else return parseMixedSchema(schema)
  }
  if (schema.enum) return [{
    paramName: parentParamName,
    paramType: parsePropertyType(schema, data, parentParamType),
    description: schema.description ?? `Описание enum'а без описания`,
  }]
  if (schema.allOf) return parseAllOf(schema.allOf, data, parentParamName)
  if (schema.anyOf) return parseAnyOf({anyOf: schema.anyOf, description: schema.description}, data, parentParamName)
  if (schema.oneOf) return parseOneOf({
    oneOf: schema.oneOf,
    description: schema.description ?? ''
  }, data, parentParamName, parentParamType)
  if (schema.type === 'string' || schema.type === 'integer' || schema.type === 'boolean' || schema.type === 'number') return [{
    paramName: parentParamName,
    paramType: parsePropertyType(schema, data, parentParamType),
    description: schema.description ?? ''
  }]
      
  return [{
    paramName: 'Какой-то непонятный необработанный кейс - ошибка логики парсинга' + String(schema),
    description: 'Какой-то непонятный необработанный кейс - ошибка логики парсинга' + String(schema)
  }]
}

export const parseRefSchema = (ref: OpenAPIV3_1.ReferenceObject, data: OpenAPIV3_1.Document, parentparamName = '', parentParamType = ''): ParsedParam[] => {
  
  const referenceSchema = findSchema(data, getSchemaNameFromRef(sanitizeRef(ref.$ref) ?? ''))
  if (referenceSchema && typeof referenceSchema !== 'boolean' && 'content' in referenceSchema) return []
  if (typeof referenceSchema === 'object' && 'in' in referenceSchema) {
    return [
      {
        paramName: parentparamName,
        paramType: parsePropertyType(referenceSchema.schema, data, parentParamType),
        paramIn: referenceSchema.in,
        description: referenceSchema.description ?? '',
      },
      ...parseParam(referenceSchema, data, parentparamName, parentParamType)
    ]
  }
  const parentParamArr = typeof referenceSchema === 'object' ? [{
    paramName: parentparamName,
    paramType: parsePropertyType(referenceSchema, data, parentParamType),
    description: ref.description ?? referenceSchema.description ?? '',
  }] : []
  console.log('ref.$ref', ref.$ref, 'referenceSchema', referenceSchema, parentparamName);
  
  return [
    ...parentParamArr,
    ...parseSchema(referenceSchema, data, parentparamName, parentParamType)
  ]
}

export const parseRequestBody = (requestBody: OpenAPIV3_1.RequestBodyObject, data: OpenAPIV3_1.Document): ParsedRequestBody => {
  if (requestBody?.content && 'application/json' in requestBody.content) {
    return {
      schema: parseSchema(requestBody.content['application/json'].schema, data),
      description: requestBody.content['application/json'].example?.description ?? ''
    }
  }
  return {
    schema: [],
    description: ''
  }
}
export const parseResponse = (response: OpenAPIV3_1.ResponsesObject, data: OpenAPIV3_1.Document): ParsedResponse => {
  if (response['200'] && 'content' in response['200']) {
    return {
      description: response['200'].description ?? '',
      schema: parseSchema(response['200'].content, data)
    }
  }
  if (response['201'] && 'content' in response['201']) {
    return {
      description: response['201'].description ?? '',
      schema: parseSchema(response['201'].content, data)
    }
  }
  return {
    description: '',
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
  return true
}

export const parseArraySchema = (schema: OpenAPIV3_1.ArraySchemaObject, data: OpenAPIV3_1.Document, required: OpenAPIV3_1.NonArraySchemaObject['required'], parentParamName = '', parentParamType = ''): ParsedParam[] => {
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

      } 
    } else if ('type' in schema.items && typeof schema.items.type === 'string') {

      itemsType = schema.items.type
      
    }
  }
  
  const itemsSchema = parseSchema(items, data, `${parentParamName}[index]`, parentParamType)

  const parentParam: ParsedParam[] = typeof schema.items === 'object' && (isObjectSchema(schema.items, data)) ? [{
    paramName: `${parentParamName}[index]`,
    description: schema.description ?? '',
    paramType: `array[${itemsType}]`,
    required: required ? required.some(prop => {
      return parentParamName.endsWith(prop)
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

export const parseNestedParam = (name: string, property: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject, required:  OpenAPIV3_1.NonArraySchemaObject['required'], data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {
  // if (name.includes('rusName')) {
  //   console.log('required', required, 'name', name, 'property', property);
  // }
  
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
    const parsedRef = parseRefSchema(property, data, parentParamName + name)
    return parsedRef.map((param, i) => {
      if (i === 0) {
        return {
          ...param,
          required: required ? required.some(prop => {
            // if (name.includes('rusName')) {
            //   // console.log('required', required, 'name', name, 'property', property);
            //   console.log('prop', prop, 'param.paramName', param.paramName, 'param.paramName.endsWith(prop)', param.paramName.endsWith(prop));    
            // }

            return param.paramName.endsWith(prop)
          }) : false
        }
      }
      return param
    })
  }
    if ('items' in property) {
      if (property.type === 'array') {        
        const parsedArray = parseArraySchema(property, data, required, parentParamName + name, parentParamType ? parentParamType : parentParamType + 'array')
        // TODO aggregate required array to include nested params' paths
        // console.log('parsed array', parsedArray);
        
        return parsedArray.map(parsed => ({
          ...parsed,
          required: required ? required.some(prop => {
            if (parsed.paramName.includes('rusName')) {
              // console.log('required', required, 'parsed', parsed, 'property', property, 'property.required', property.required);
              // console.log('prop', prop, 'parsed.paramName', parsed.paramName, 'parsed.paramName.endsWith(prop)', parsed.paramName.endsWith(prop));    
            }
            return parsed.paramName.endsWith(prop)
          }) : false
        }))
      } else return parseMixedSchema(property)
    }
  if (property.properties) {
    const result = [{
      paramName: parentParamName + name,
      paramType: parsePropertyType(property, data, parentParamType),
      description: property.description ?? '',
      required: required ? required.some(prop => {
        // console.log('prop', prop, 'name', name, 'param.paramName.endsWith(prop)', name.endsWith(prop));  
        return name.endsWith(prop)
      }) : false
    }]
    const res = [
      ...result,
      ...(parseAllOf(property.allOf ?? [], data, parentParamName + name)),
      ...parseProperties(property.properties, property.required, data, parentParamName + name, parentParamType)
    ]
    // console.log('res', res.filter(({ paramName }) => paramName.includes('rusNmae')));
    
    return res
  }
  if (property.allOf) return parseAllOf(property.allOf, data, parentParamName + name)
  if (property.anyOf) return parseAnyOf({anyOf: property.anyOf, description: property.description}, data, parentParamName + name, parentParamType)
  if ('oneOf' in property) return parseOneOf({
    oneOf: property.oneOf ?? [],
    description: property.description
  }, data, parentParamName + name, parentParamType).map((oneOf, i) => ({
    ...oneOf,
    description: i === 0 ? property.description ?? '' : oneOf.description,
    required: required ? required.some(prop => {
      // console.log('prop', prop, 'oneOf.paramName', oneOf.paramName, 'param.paramName.endsWith(prop)', oneOf.paramName.endsWith(prop));  
      return oneOf.paramName.endsWith(prop)
    }) : false
  }))
  const result = [{
    paramName: parentParamName + name,
    paramType: parsePropertyType(property, data, parentParamType),
    description: property.description ?? '',
    required: required ? required.some(prop => {
      // if (name.includes('rusName')) {
      //   // console.log('required', required, 'name', name, 'property', property);
      //   console.log('prop', prop, 'name', name, 'name.endsWith(prop)', name.endsWith(prop));    
      // }
      // console.log('prop', prop, 'name', name, 'name.endsWith(prop)', name.endsWith(prop));  
      return name.endsWith(prop)
    }) : false
  }]
  if (name.includes('rusName')) {
    // console.log('required', required, 'name', name, 'property', property);
    console.log('result', result);    
  }
  return result
}

export const parseProperties = (properties: OpenAPIV3_1.NonArraySchemaObject['properties'], required:  OpenAPIV3_1.NonArraySchemaObject['required'], data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {
  if(parentParamName.includes('refColDict')) {
    console.log('required in parse p', required, 'properties', properties);
  }
  if (!properties) return [{
    paramName: '',
    description: 'Нет пропертей схемы типа объект - где-то ошибка логики парсинга',
    paramType: 'Нет пропертей схемы типа объект - где-то ошибка логики парсинга'
  }]
  const parsedProperties = Object.entries(properties).flatMap(([name, property]): ParsedParam[] => {
    // console.log('requred in parse properties', required);
    
    const parsed = parseNestedParam(name, property, required, data, parentParamName ? `${parentParamName}.` : '')
    if (name.includes('rusName')) {
      // console.log('required', required, 'name', name, 'property', property);
      // console.log('parsed', parsed)  
    }
    return parsed
  })
  if(parentParamName.includes('refColDict')) {
    console.log('parsedProperties in parse p', parsedProperties);
  }
  // console.log('parsedProperties', parsedProperties.filter(({ paramName }) => paramName.includes('rusName')));    

  return parsedProperties
}
export const parseAllOf = (allOfArr: NonNullable<OpenAPIV3_1.NonArraySchemaObject['allOf']>, data: OpenAPIV3_1.Document, parentParamName = ''): ParsedParam[] => {
  
  const parsedAllOf = allOfArr.flatMap(schema => {
    return parseSchema(schema, data, parentParamName)
  })
  return parsedAllOf
}
export const parseAnyOf = ({ anyOf, description }: AnyOfParsingParam, data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedParam[] => {
  const res: ParsedParam[] = anyOf.flatMap((anyOfItem, i) => {
    if (typeof anyOfItem === 'boolean') return [{
      paramName: `one of schema - ${anyOfItem}`,
      description: `one of schema - ${anyOfItem}`
    }]
    
    const parsedOneOf = parseSchema(anyOfItem, data, `Вариант ${i+1} ` + parentParamName, parentParamType)
    
    return parsedOneOf
  })
  
  return res.length <= 1 ? res.map(param => ({ ...param, description: description ?? '' })) : [
    {
      paramName: parentParamName,
      description: description ?? '',
      paramType: 'Любая комбинация вариантов'
    },
    ...res
  ]
}
export const parseOneOf = ({ oneOf, description }: OneOfParsingParam, data: OpenAPIV3_1.Document, parentParamName = '', parentParamType = ''): ParsedNestedSchema['nestedParams']=> {

  const res: ParsedParam[] = oneOf.flatMap((oneOfItem, i) => {
    if (typeof oneOfItem === 'boolean') return [{
      paramName: `one of schema - ${oneOfItem}`,
      description: `one of schema - ${oneOfItem}`
    }]
    
    const parsedOneOf = parseSchema(oneOfItem, data, `Вариант ${i+1} ` + parentParamName, parentParamType)

    return parsedOneOf
  })
  
  return res.length <= 1 ? res.map(param => ({ ...param, description: description ?? '' })) : [
    {
      paramName: parentParamName,
      description: description ?? '',
      paramType: 'Один из вариантов'
    },
    ...res
  ]
}

type PropertiesRecord = OpenAPIV3_1.NonArraySchemaObject['properties'] 
export const parsePropertyType = (property: NonNullable<PropertiesRecord>[string] | undefined, data: OpenAPIV3_1.Document, parentParamType = ''): string => {
  
  if (!property) return 'Не передано свойство - ошибка в логике парсинга'  
  if (typeof property === 'boolean') return `schema - ${property}`
  if ('$ref' in property) {
    const parsedRef = parseRefSchema(property, data)
    
    return parsedRef.at(0)?.paramType ?? ''
  }
  if('oneOf' in property) {
    const joinedType = property.oneOf?.map(propPart => {
      if (typeof property === 'boolean') return 'boolean schema'
      //@ts-expect-error idk
      if ('$ref' in propPart) {
        const parsedRef = parseRefSchema(propPart, data)
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

  const parsedType = property.type ?? typeof property.enum?.at(0) ?? ''
  const parsedFormat = property.format ? `[${property.format}]` : ''
  const parsedPattern = property.pattern ? `[${property.pattern}]` : ''
  const parsedEnum = property.enum ? `[\n${property.enum.join(',\n')}\n]` : ''
  const resType = `${parsedType}${parsedFormat}${parsedPattern}${parsedEnum}`
  return parentParamType ? `${parentParamType}[${resType}]` : resType
}