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
const getPropetiesFromValueType = (value: Exclude<OpenAPIV3_1.SchemaObject, boolean>) => {
  if(value.type === 'array') {
    return []
  } else if (Array.isArray(value.type)) {
    return []
  } else {
    return []
  }
}

const parseSchema = (schema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject) => {
  
}
const findSchema = (data: OpenAPIV3_1.Document, schemaName: string) => {
  const schemaKey = data.components?.schemas ? Object.keys(data.components.schemas).find((key) => key === schemaName) : undefined
  return schemaKey && data.components?.schemas ? data.components?.schemas[schemaKey] : undefined
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
  return data?.paths ? Object.entries(data?.paths).flatMap(([key, value]) => value ? Object.entries(value).map(([method, methodDesc]) => typeof methodDesc === 'object' ? ({
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
  }) : {
    path: key,
    method,
    inputParams: [],
  }) : []) : []
}
