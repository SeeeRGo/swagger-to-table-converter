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
export const parseData = (data: any) => {
  const parsedSchemas = Object.entries(data?.components?.schemas).map(([key, value]) => ({
    name: key,
    //@ts-expect-error typings are not for prototyping
    properties: Object.entries(value?.properties ?? {}).map(([valKey, valValue]) => ({
      name: valKey,
      //@ts-expect-error typings are not for prototyping
      type: valValue?.type, 
      //@ts-expect-error typings are not for prototyping
      required: Array.isArray(value.required) ? !!value.required?.some(reqField => reqField === valKey) : false,
      //@ts-expect-error typings are not for prototyping
      description: valValue?.description ?? 'no Desc'
    }))
  }))
  return parsedSchemas
  // return Object.entries(data?.paths).flatMap(([key, value]: any) => Object.entries(value).map(([method, methodDesc]: any) => ({
  //   path: key,
  //   method,
  //   methodDesc: methodDesc?.summary ?? '',
  //   inputParams: methodDesc?.parameters?.map((param: any) => ({
  //     paramName: param.name,
  //     paramType: param.in,
  //     description: param.description,
  //     required: param.required,
  //     schema: `${param.schema}`
  //   })) ?? []
  // })))
}
