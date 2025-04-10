import { ParsedNestedSchema } from "@/lib/utils"
import { MockOutputMini } from "./mockOutpuMini"
import { OpenAPIV3_1 } from "@/open-api-types"

export const mockDataForEnumParsingInput1 = {
  "enum": [
      200
  ]
}

export const mockDataForEnumParsingExpectedOutput1 = 'number[\n200\n]'


export const mockDataForEnumParsingInput2 = {
  "enum": [
    "Missing parameter",
    "Missing header",
    "Missing request body fields"
  ]
}
export const mockDataForEnumParsingExpectedOutput2 = 'string[\nMissing parameter,\nMissing header,\nMissing request body fields\n]'

export const mockDataForEnumParsingInput3 = {
  "type": "string",
  "enum": [
      "empty",
      "notEmpty",
      "contains",
      "inEnum",
  ]
} as const
export const mockDataForEnumParsingExpectedOutput3 = 'string[\nempty,\nnotEmpty,\ncontains,\ninEnum\n]'

export const mockDataForEnumParsingInput4 = {
  "description": "Идентификатор атрибута, из которого берутся значения для идентификаторов элементов справочника\n\nДоступные значения -  global_id (-1), system_object_id (-2).",
  "type": "integer",
  "format": "int32",
  "enum": [
      -1,
      -2
  ]
} as const
export const mockDataForEnumParsingExpectedOutput4 = 'integer[int32][\n-1,\n-2\n]'
export const mockDataForObjectParsingJustProperties = {
  "description": "Ответ на запрос в API\nИспользуется для описания ошибок и базовых ответов (Ok, Created и пр.)",
  "type": "object",
  "readOnly": true,
  "properties": {
      "id": {
          "description": "Идентифкатор ресурса, для которого передан ответ\n\nВозможные варианты использования:\n  - Идентификатор созданного ресурса в POST-запросе;\n  - Идентификатор ресурса, для которого возвращена ошибка.",
          "type": "integer",
          "format": "int32"
      },
      "code": {
          "description": "HTTP-код ошибки",
          "type": "integer",
          "format": "int32"
      },
      "messageType": {
          "description": "Тип ответа",
          "type": "string"
      },
      "message": {
          "description": "Текст ответа",
          "type": "string"
      }
  },
  "required": [
      "code",
      "messageType",
      "message"
  ]
}

export const mockOutputForObjectParsingJustProperties: ParsedNestedSchema = {
  parentType: 'object',
  nestedParams: [
    {
      "paramName": "id",
      "paramType": "integer[int32]",
      "description": "Идентифкатор ресурса, для которого передан ответ\n\nВозможные варианты использования:\n  - Идентификатор созданного ресурса в POST-запросе;\n  - Идентификатор ресурса, для которого возвращена ошибка.",
      "required": false,
    },
    {
      "paramName": "code",
      "paramType": "integer[int32]",
      "description": "HTTP-код ошибки",
      "required": true,
    },
    {
      "paramName": "messageType",
      "paramType": "string",
      "description": "Тип ответа",
      "required": true,
    },
    {
      "paramName": "message",
      "paramType": "string",
      "description": "Текст ответа",
      "required": true,
    },
  ]
}

export const arrayPropTypeInput: OpenAPIV3_1.ArraySchemaObject = {
  "description": "Настройки периодичности обновления \"Настраиваемая (Календарные дни)\". Обязателен, если tagId = calendarDays.",
  "type": "array",
  "items": {
      "type": "object",
      "properties": {
          "day": {
              "description": "День месяца в формате DD.MM",
              "type": "string",
              "pattern": "^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$"
          }
      }
  },
  "minItems": 1
}

export const arrayPropTypeExpectedOutput: ParsedNestedSchema = {
  parentType: 'array[object]',
  nestedParams: [
    {
      "paramName": "day",
      "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$]",
      "description":"День месяца в формате DD.MM",
      "required": false,
    },
  ]
}

export const mockInputParamsExpectedOutput = MockOutputMini.at(0)?.inputParams
