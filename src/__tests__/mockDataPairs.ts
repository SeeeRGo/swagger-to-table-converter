import { ParsedNestedSchema, ParsedParam } from "@/lib/utils"
import { MockOutputMini } from "./mockOutpuMini"
import { OpenAPIV3_1 } from "@/open-api-types"
import { mockData } from "./mockInput"

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

export const mockOutputForObjectParsingJustProperties: ParsedParam[] = [
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

export const arrayPropTypeExpectedOutput: ParsedParam[] = [
  {
    "description": "Настройки периодичности обновления \"Настраиваемая (Календарные дни)\". Обязателен, если tagId = calendarDays.",
    "paramName": "[index]",
    "paramType": "array[object]",
    "required": false,
  },
  {
    "paramName": "[index].day",
    "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$]",
    "description":"День месяца в формате DD.MM",
    "required": false,
  },
]
export const mockDataInput = mockData as OpenAPIV3_1.Document
export const refPropInput: OpenAPIV3_1.ReferenceObject = {
  "$ref": "catalogs.yaml#/components/schemas/FillingCatalogMap"
}

export const refArrayInput = {
  "description": "Категории объекта",
  "type": "array",
  "items": {
      "$ref": "objectCategories.yaml#/components/schemas/ObjectCategory"
  },
  "minItems": 1,
  "readOnly": true
}

export const plainRefInput = {
  "$ref": "objectCategories.yaml#/components/schemas/ObjectCategory"
}

export const plainRefOutput: ParsedParam[] = [
  {
  "description": "Категория объектов",
   "paramName": "",
   "paramType": "object",
  },
  {
    "paramName": "id",
    "paramType": "integer[int32]",
    "description": "Идентификатор категории объектов",
    "required": true,
  },
  {
    "paramName": "rusName",
    "paramType": "string",
    "description": "Русскоязычное наименование категории объектов, должно быть уникальным",
    "required": true,
  },
  {
    "paramName": "enName",
    "paramType": "string",
    "description": "Англоязычное наименование категории объектов",
    "required": false,
  },
]

export const refArrayOutput: ParsedParam[] = [
  {
      "paramName": "[index]",
      "paramType": "object",
      "description": "Категории объекта",
      "required": true,
  },
  {
      "paramName": "[index].id",
      "paramType": "integer[int32]",
      "description": "Идентификатор категории объектов",
      "required": true,
  },
  {
      "paramName": "[index].rusName",
      "paramType": "string",
      "description": "Русскоязычное наименование категории объектов, должно быть уникальным",
      "required": true,
  },
  {
      "paramName": "[index].enName",
      "paramType": "string",
      "description": "Англоязычное наименование категории объектов",
      "required": false,
  },
]

export const refPropOutput: ParsedParam[] = [
  {
    "paramName": "hasGeo",
    "paramType": "boolean",
    "description": "Наличие геопривязки в каталоге",
    "required": true,
  },
  {
    "paramName": "typeGeoTagIds[index]",
    "paramType": "array[string[\nPoint,\nMultiPoint,\nMultiLineString,\nMultiPolygon\n]]",
    "description": "Массив строковых идентификаторов типов геометрии",
    "required": false,
  },
  {
    "paramName": "isWGS84",
    "paramType": "boolean",
    "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
    "required": false,
  },
  {
    "paramName": "isReq",
    "paramType": "boolean",
    "description": "Обязательность геопривязки",
    "required": false,
  },
  {
    "paramName": "isOneTypeGeoForObj",
    "paramType": "boolean",
    "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
    "required": false,
  },
  {
    "paramName": "isNotReqGeoForService",
    "paramType": "boolean",
    "description": "Необязательность геометрии при загрузке через сервис",
    "required": false,
  },
]

export const allOfInput = {
  "type": "object",
  "description": "Успешный ответ на запрос.",
  "allOf": [
      {
          "$ref": "#/components/schemas/ApiResponse"
      },
      {
          "properties": {
              "code": {
                  "enum": [
                      200
                  ]
              },
              "messageType": {
                  "enum": [
                      "Ok"
                  ]
              }
          }
      }
  ]
}

export const allOfOutput: ParsedParam[] = [
  {
    "description": "Ответ на запрос в API\nИспользуется для описания ошибок и базовых ответов (Ok, Created и пр.)",
     "paramName": "",
     "paramType": "object",
  },
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
  {
    "paramName": "code",
    "paramType": "number[\n200\n]",
    "description": "",
    "required": false,
  },
  {
    "paramName": "messageType",
    "paramType": "string[\nOk\n]",
    "description": "",
    "required": false,
  },
]

export const plainParamInput = {
  "name": "limit",
  "in": "query",
  "required": false,
  "description": "Количество возвращаемых каталогов (от `1` до `1000`).",
  "schema": {
      "type": "integer",
      "format": "int32",
      "default": 100,
      "minimum": 1,
      "maximum": 1000
  }
}

export const plainParamOutput = [{
  "paramName": "limit",
  "paramIn": "query",
  "paramType": "integer[int32]",
  "description": "Количество возвращаемых каталогов (от `1` до `1000`).",
  "required": false,
}]

export const refParamInput = {
  "$ref": "_common.yaml#/components/parameters/offsetQueryParam"
}

export const refParamOutput = [{
  "paramName": "offset",
  "paramIn": "query",
  "paramType": "integer[int32]",
  "description": "Позиция (индекс), с которой необходимо возвращать элементы из БД (не меньше `0`).\n\nПо умолчанию `0`.",
  "required": false,
}]

export const inputParamsInput: (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)[] =  [
  {
      "name": "limit",
      "in": "query",
      "required": false,
      "description": "Количество возвращаемых каталогов (от `1` до `1000`).",
      "schema": {
          "type": "integer",
          "format": "int32",
          "default": 100,
          "minimum": 1,
          "maximum": 1000
      }
  },
  {
      "$ref": "_common.yaml#/components/parameters/offsetQueryParam"
  },
  {
      "name": "search",
      "in": "query",
      "required": false,
      "description": "Текстовый поисковый запрос в списке каталогов.\nПоиск производится по атрибутам идентификатору и полному наименованию каталога.\n\nЗапрос со значением `12` вернет все каталоги, идентификатор или наименование которых содержит подстроку `12`.",
      "schema": {
          "type": "string"
      }
  },
  {
      "name": "sortBy",
      "in": "query",
      "description": "Поле, по которому производится сортировка.",
      "required": false,
      "schema": {
          "type": "string",
          "default": "id",
          "enum": [
              "id",
              "fullName",
              "responsiblePerson",
              "countActiveObjects",
              "countUnsignedObjects",
              "countObjects",
              "dateLastSign",
              "dateNextUpdate",
              "statusSignObjects",
              "statusSignMetadata"
          ]
      }
  },
  {
      "$ref": "_common.yaml#/components/parameters/orderByAscQueryParam"
  },
  {
      "name": "statusSigning",
      "in": "query",
      "required": false,
      "description": "Статус подписания каталога. Может принимать следующие значения:\n  - `signed` - подписанный, изменения отсутствуют. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = signed И statusSignMetadata = signed\n  - `neverSigned` - ни разу не подписан. Каталог имеет этот статус при выполнении условия:\n    dateLastSign=null И statusSignObjects != archive\n  - `hasChange` - подписанный, имеются изменения. Каталог имеет этот статус при выполнении условия:\n    dateLastSign = {value} И (statusSignObjects = unsigned ИЛИ statusSignMetadata = unsigned)\n  - `archive` - в архиве. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = archive И statusSignMetadata = archive",
      "schema": {
          "type": "array",
          "items": {
              "type": "string",
              "enum": [
                  "signed",
                  "neverSigned",
                  "hasChange",
                  "archive"
              ]
          }
      }
  },
  {
      "name": "planSigning",
      "in": "query",
      "required": false,
      "description": "Статус просрочки подписания каталога. Может принимать следующие значения:\n  - `ok` - срок планового подписания не нарушен. Включает каталоги, для которых dateNextUpdate строго больше текущей даты ИЛИ является null.\n  - `less3Day` - до планового подписания менее 3-х дней. Вклячает каталоги, у которых dateNextUpdate меньше или равна текущей даты + 3 дня.\n  - `expired` - плановое подписание просрочено. Включает каталоги, для которых dateNextUpdate строго меньше текущей даты.",
      "schema": {
          "type": "array",
          "items": {
              "type": "string",
              "enum": [
                  "ok",
                  "less3Day",
                  "expired"
              ]
          }
      }
  }
]

export const inputParamsOutput = [
  {
      "paramName": "limit",
      "paramIn": "query",
      "paramType": "integer[int32]",
      "description": "Количество возвращаемых каталогов (от `1` до `1000`).",
      "required": false,
  },
  {
      "paramName": "offset",
      "paramIn": "query",
      "paramType": "integer[int32]",
      "description": "Позиция (индекс), с которой необходимо возвращать элементы из БД (не меньше `0`).\n\nПо умолчанию `0`.",
      "required": false,
  },
  {
      "paramName": "search",
      "paramIn": "query",
      "paramType": "string",
      "description": "Текстовый поисковый запрос в списке каталогов.\nПоиск производится по атрибутам идентификатору и полному наименованию каталога.\n\nЗапрос со значением `12` вернет все каталоги, идентификатор или наименование которых содержит подстроку `12`.",
      "required": false,
  },
  {
      "paramName": "sortBy",
      "paramIn": "query",
      "paramType": "string[\nid,\nfullName,\nresponsiblePerson,\ncountActiveObjects,\ncountUnsignedObjects,\ncountObjects,\ndateLastSign,\ndateNextUpdate,\nstatusSignObjects,\nstatusSignMetadata\n]",
      "description": "Поле, по которому производится сортировка.",
      "required": false,
  },
  {
      "paramName": "orderBy",
      "paramIn": "query",
      "paramType": "string[\nasc,\ndesc\n]",
      "description": "Порядок сортировки. Допустимые значения:\n  - `asc` - по возрастанию;\n  - `desc` - по убыванию.\n\nПо умолчанию: `asc`.",
      "required": false
  },
  {
      "paramName": "statusSigning",
      "paramIn": "query",
      "paramType": "array[string[\nsigned,\nneverSigned,\nhasChange,\narchive\n]]",
      "description": "Статус подписания каталога. Может принимать следующие значения:\n  - `signed` - подписанный, изменения отсутствуют. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = signed И statusSignMetadata = signed\n  - `neverSigned` - ни разу не подписан. Каталог имеет этот статус при выполнении условия:\n    dateLastSign=null И statusSignObjects != archive\n  - `hasChange` - подписанный, имеются изменения. Каталог имеет этот статус при выполнении условия:\n    dateLastSign = {value} И (statusSignObjects = unsigned ИЛИ statusSignMetadata = unsigned)\n  - `archive` - в архиве. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = archive И statusSignMetadata = archive",
      "required": false,
  },
  {
      "paramName": "planSigning",
      "paramIn": "query",
      "paramType": "array[string[\nok,\nless3Day,\nexpired\n]]",
      "description": "Статус просрочки подписания каталога. Может принимать следующие значения:\n  - `ok` - срок планового подписания не нарушен. Включает каталоги, для которых dateNextUpdate строго больше текущей даты ИЛИ является null.\n  - `less3Day` - до планового подписания менее 3-х дней. Вклячает каталоги, у которых dateNextUpdate меньше или равна текущей даты + 3 дня.\n  - `expired` - плановое подписание просрочено. Включает каталоги, для которых dateNextUpdate строго меньше текущей даты.",
      "required": false,
  }
]

export const oneOfNoRefInput = {
  "type": "object",
  "properties": {
      "data": {
          "description": "Массив атрибутов и их значений в рамках удаляемых объектов",
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                  "attrId": {
                      "description": "Идентификатор атрибута",
                      "type": "integer",
                      "format": "int32"
                  },
                  "value": {
                      "description": "Значение атрибута, передаваемое при удалении.\nДля типов данных справочник, ссылка на объект, файл значение **всегда** передаётся в массиве, независимо от установленного свойства isMultiple на атрибуте.",
                      "oneOf": [
                          {
                              "description": "Значение атрибута типа строка",
                              "type": "string"
                          },
                          {
                              "description": "Значение атрибута типа целое число",
                              "type": "integer"
                          },
                          {
                              "description": "Значение атрибута типа дробное число",
                              "type": "number"
                          },
                          {
                              "description": "Значение атрибута типа дата (без времени) в формате dd.MM.YYYY",
                              "type": "string",
                              "pattern": "^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])\\.([1-2]\\d{3})$"
                          },
                          {
                              "description": "Значение атрибута типа дата (со временем) в формате dd.MM.YYYY hh:mm:ss",
                              "type": "string",
                              "pattern": "^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])\\.([1-2]\\d{3}) ([0-1]\\d|2[0-4])(:[0-5]\\d){2}$"
                          },
                          {
                              "description": "Значение атрибута типа файл, в массиве передается id (uuid) файла, загруженного на файловый сервер",
                              "type": "array",
                              "items": {
                                  "type": "string"
                              }
                          },
                          {
                              "description": "Значение атрибута типа справочник, в массиве передается id элемента справочника",
                              "type": "array",
                              "items": {
                                  "type": "string"
                              }
                          },
                          {
                              "description": "Значение атрибута типа ссылка, в массиве передается gloabl_id объекта, на который ссылается объект",
                              "type": "array",
                              "items": {
                                  "type": "integer"
                              }
                          }
                      ]
                  }
              }
          }
      }
  }
}
export const oneOfNoRefOutput = [
  {
    "paramName": "data[index]",
    "paramType": "array[object]",
    "description": "Массив атрибутов и их значений в рамках удаляемых объектов",
    "required": false,
  },
  {
    "paramName": "data[index].attrId",
    "paramType": "integer[int32]",
    "description": "Идентификатор атрибута",
    "required": false,
  },
  {
    "paramName": "data[index].value",
    "paramType": "Один из вариантов",
    "description": "Значение атрибута, передаваемое при удалении.\nДля типов данных справочник, ссылка на объект, файл значение **всегда** передаётся в массиве, независимо от установленного свойства isMultiple на атрибуте.",
    "required": false,
  },
  {
    "paramName": "Вариант 1 data[index].value",
    "paramType": "string",
    "description": "Значение атрибута типа строка",
    "required": false,
  },
  {
    "paramName": "Вариант 2 data[index].value",
    "paramType": "integer",
    "description": "Значение атрибута типа целое число",
    "required": false,
  },
  {
    "paramName": "Вариант 3 data[index].value",
    "paramType": "number",
    "description": "Значение атрибута типа дробное число",
    "required": false,
  },
  {
    "paramName": "Вариант 4 data[index].value",
    "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])\\.([1-2]\\d{3})$]",
    "description": "Значение атрибута типа дата (без времени) в формате dd.MM.YYYY",
    "required": false,
  },
  {
    "paramName": "Вариант 5 data[index].value",
    "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])\\.([1-2]\\d{3}) ([0-1]\\d|2[0-4])(:[0-5]\\d){2}$]",
    "description": "Значение атрибута типа дата (со временем) в формате dd.MM.YYYY hh:mm:ss",
    "required": false,
  },
  {
    "paramName": "Вариант 6 data[index].value[index]",
    "paramType": "array[string]",
    "description": "Значение атрибута типа файл, в массиве передается id (uuid) файла, загруженного на файловый сервер",
    "required": false,
  },
  {
    "paramName": "Вариант 7 data[index].value[index]",
    "paramType": "array[string]",
    "description": "Значение атрибута типа справочник, в массиве передается id элемента справочника",
    "required": false,
  },
  {
    "paramName": "Вариант 8 data[index].value[index]",
    "paramType": "array[integer]",
    "description": "Значение атрибута типа ссылка, в массиве передается gloabl_id объекта, на который ссылается объект",
    "required": false,
  },
]

export const requestBodyPlainInput = {
  "content": {
      "application/json": {
          "schema": {
              "type": "object",
              "properties": {
                  "constructor": {
                      "type": "array",
                      "items": {
                        "description": "Конструктор атрибута",
                        "type": "integer",
                        "format": "int32"
                      }
                  },
                  "attributes": {
                      "type": "array",
                      "items": {
                        "description": "Атрибуты",
                        "type": "string",
                      }
                  }
              },
              "required": [
                  "constructor",
                  "attributes"
              ]
          },
          "examples": {
              "Пример": {
                  "$ref": "#/components/examples/ConstructorValidationRequest"
              }
          }
      }
  }
}

export const requestBodyPlainOutput = {
  description: '',
  schema: [
    {
      "paramName": "constructor[index]",
      "paramType": "array[integer[int32]]",
      "description": "Конструктор атрибута",
      "required": true,
    },
    {
      "paramName": "attributes[index]",
      "paramType": "array[string]",
      "description": "Атрибуты",
      "required": true,
    },
  ],
}

export const objectWithNestedInput = {
  "description": "Настройки каталога заполнения",
  "type": "object",
  "properties": {
      "map": {
          "$ref": "#/components/schemas/FillingCatalogMap"
      }
  },
  "required": [
      "map"
  ]
}

export const objectWithNestedOutput = [
  {
    "paramName": "map",
    "paramType": "object",
    "description": "Настройки карты каталога заполнения",
    "required": true,
  }, // FillingCatalogMap start
  {
    "paramName": "map.hasGeo",
    "paramType": "boolean",
    "description": "Наличие геопривязки в каталоге",
    "required": true,
  },
  {
    "paramName": "map.typeGeoTagIds[index]",
    "paramType": "array[string[\nPoint,\nMultiPoint,\nMultiLineString,\nMultiPolygon\n]]",
    "description": "Массив строковых идентификаторов типов геометрии",
    "required": false,
  },
  {
    "paramName": "Вариант 1 map.typeGeoTagIds[index]",
    "paramType": "array[string[\nPoint,\nMultiPoint,\nMultiLineString,\nMultiPolygon\n]]",
    "description": "Типы геометрии в geojson",
    "required": false,
  },
  {
    "paramName": "map.isWGS84",
    "paramType": "boolean",
    "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
    "required": false,
  },
  {
    "paramName": "map.isReq",
    "paramType": "boolean",
    "description": "Обязательность геопривязки",
    "required": false,
  },
  {
    "paramName": "map.isOneTypeGeoForObj",
    "paramType": "boolean",
    "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
    "required": false,
  },
  {
    "paramName": "map.isNotReqGeoForService",
    "paramType": "boolean",
    "description": "Необязательность геометрии при загрузке через сервис",
    "required": false,
  }, 
]
export const catalogspostPathInput = {
  "tags": [
      "catalogs"
  ],
  "summary": "Первичное сохранение каталога",
  "description": "Метод используется при создании каталога заполнения.\nПри создании каталога необходимо обязательно заполнить общую информацию и атрибутивный состав.\n\nЕсли при сохранении передаются настройки конструктора, условной или групповой уникальности,\nто код проверок проходит валидацию.\n\nВ случае наличия ошибок в настройках каталога возвращается одна.\n\nВ результате сохранения каталога создаются соответствующие структуры для объектов каталога в БД заполнения.",
  "requestBody": {
      "content": {
          "application/json": {
              "schema": {
                  "$ref": "#/components/schemas/FillingCatalogSettings"
              },
              "examples": {
                  "Пример": {
                      "$ref": "#/components/examples/FillingCatalogSettingsRequest"
                  }
              }
          }
      }
  },
  "responses": {
      "201": {
          "description": "Успешный ответ",
          "content": {
              "application/json": {
                  "schema": {
                      "$ref": "_common.yaml#/components/schemas/CreatedResponse"
                  },
                  "examples": {
                      "Пример": {
                          "$ref": "#/components/examples/CatalogCreatedResponse"
                      }
                  }
              }
          }
      },
      "400": {
          "$ref": "#/components/responses/FillingCatalogBadRequestErrors"
      },
      "404": {
          "$ref": "#/components/responses/FillingCatalogEntitiesNotFoundError"
      }
  }
}
export const catalogsPostOutput = {
  "requests": {
    "schema": [
        {
            "paramName": "generalInfo",
            "paramType": "object",
            "description": "Настройки вкладки \"Общая информация\" каталога заполнения",
            "required": true,
        },
        {
            "paramName": "generalInfo.id",
            "paramType": "integer",
            "description": "Идентификатор каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.fullName",
            "paramType": "string",
            "description": "Полное наименование каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.technicalName",
            "paramType": "string",
            "description": "Технологическое наименование каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.shortName",
            "paramType": "string",
            "description": "Краткое наименование каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.kindCatalog",
            "paramType": "object",
            "description": "Вид каталога",
            "required": false,
        },
        {
            "paramName": "generalInfo.kindCatalog.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор вида каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.kindCatalog.name",
            "paramType": "string",
            "description": "Название вида каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.kindCatalogId",
            "paramType": "integer",
            "description": "Идентификатор вида каталога",
            "required": false,
        },
        {
            "paramName": "generalInfo.typeCatalog",
            "paramType": "object",
            "description": "Тип каталога",
            "required": false,
        },
        {
            "paramName": "generalInfo.typeCatalog",
            "paramType": "object",
            "description": "Тип каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.typeCatalog.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор типа каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.typeCatalog.name",
            "paramType": "string",
            "description": "Название типа каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.typeCatalogId",
            "paramType": "integer",
            "description": "Идентификатор типа каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.thematicCategory",
            "paramType": "object",
            "description": "Тематическая категория каталога",
            "required": true,
        },
        {
          "paramName": "generalInfo.thematicCategory.id",
          "paramType": "integer[int32]",
          "description": "Идентификатор тематической категории",
          "required": true,
        },
        {
            "paramName": "generalInfo.thematicCategory.name",
            "paramType": "string",
            "description": "Русскоязычное наименование тематической категории",
            "required": true,
        },
        {
            "paramName": "generalInfo.thematicCategoryId",
            "paramType": "integer",
            "description": "Идентификатор тематической категории каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.objectCategories[index]",
            "paramType": "array[object]",
            "description": "Категории объекта",
            "required": true,
        },
        {
            "paramName": "generalInfo.objectCategories[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор категории объектов",
            "required": true,
        },
        {
            "paramName": "generalInfo.objectCategories[index].rusName",
            "paramType": "string",
            "description": "Русскоязычное наименование категории объектов, должно быть уникальным",
            "required": true,
        },
        {
            "paramName": "generalInfo.objectCategories[index].enName",
            "paramType": "string",
            "description": "Англоязычное наименование категории объектов",
            "required": false,
        },
        {
            "paramName": "generalInfo.oivs[index]",
            "paramType": "array[object]",
            "description": "Поставщики информации каталога (ответственные ОИВы)",
            "required": true,
        },
        {
            "paramName": "generalInfo.oivs[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор ОИВа",
            "required": true,
        },
        {
            "paramName": "generalInfo.oivs[index].name",
            "paramType": "string",
            "description": "Наименование ОИВа",
            "required": true,
        },
        {
            "paramName": "generalInfo.oivsIds",
            "paramType": "array[integer]",
            "description": "Список идентификаторов поставщиков информации каталога (ответственные ОИВы)",
            "required": true,
        },
        {
            "paramName": "generalInfo.accountingObject",
            "paramType": "string",
            "description": "Объект учёта",
            "required": true,
        },
        {
            "paramName": "generalInfo.keywords",
            "paramType": "string",
            "description": "Ключевые слова",
            "required": true,
        },
        {
            "paramName": "generalInfo.systemsConsumers[index]",
            "paramType": "array[object]",
            "description": "Системы потребители данных каталога",
            "required": false,
        },
        {
            "paramName": "generalInfo.systemsConsumers[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор информационной системы",
            "required": true,
        },
        {
            "paramName": "generalInfo.systemsConsumers[index].name",
            "paramType": "string",
            "description": "Название информационной системы",
            "required": true,
        },
        {
            "paramName": "generalInfo.systemsConsumersIds",
            "paramType": "array[integer]",
            "description": "Список идентификаторов систем потребителей данных",
            "required": false,
        },
        {
            "paramName": "generalInfo.isShowDeleteObjects",
            "paramType": "boolean",
            "description": "Признак \"Показывать удалённые объекты\"",
            "required": true,
        },          
        {
            "paramName": "generalInfo.isShowDeleteObjects",
            "paramType": "boolean",
            "description": "Признак \"Показывать удалённые объекты\"",
            "required": true,
        },          
        {
            "paramName": "generalInfo.periodUpdate",
            "paramType": "object",
            "description": "Периодичность обновления каталога заполнения",
            "required": true,
        },          
        {
            "paramName": "generalInfo.periodUpdate.tagId",
            "paramType": "string[\ndaily,\nweekly\n,monthly\n,quarterly\n,yearly\n,minutely\n,hourly\n,numDays\n,calendarDays\n,multiple\n,withChanges\n,realTime\n]",
            "description": "Техническое название периодичности обновления",
            "required": true,
        },           
        {
            "paramName": "generalInfo.periodUpdate.name",
            "paramType": "string",
            "description": "Название периодичности обновления каталога",
            "required": true,
        },               
        {
            "paramName": "generalInfo.periodUpdate.numDays",
            "paramType": "integer",
            "description": "Настройки периодичности обновления \"Настраиваемая (произвольный срок)\". Обязателен, если tagId = numDays.",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.calendarDays[index]",
            "paramType": "array[object]",
            "description": "Настройки периодичности обновления \"Настраиваемая (Календарные дни)\". Обязателен, если tagId = calendarDays.",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.calendarDays[index].day",
            "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$]",
            "description":"День месяца в формате DD.MM",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.isCheckLastDay",
            "paramType": "boolean",
            "description":"Дополнительное свойство для периодичности обновления \"Ежемесячно\" - \"Обновлять не позднее последнего дня следующего месяца за месяцем последнего подписания\"",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index]",
            "paramType": "array[object]",
            "description":"Настройки периодичности обновления \"Множественная периодичность\". Обязателен, если tagId = multiple.",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].tagId",
            "paramType": "string[\ndaily,\nweekly,\nmonthly,\nquarterly,\nyearly,\nminutely,\nhourly,\nnumDays,\ncalendarDays,\nmultiple,\nwithChanges,\nrealTime\n]",
            "description": "Техническое название периодичности обновления",
            "required": true,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].name",
            "paramType": "string",
            "description": "Название периодичности обновления каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].dateStart",
            "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$]",
            "description": "Название периодичности обновления каталога",
            "required": true,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].numDays",
            "paramType": "integer",
            "description": "Настройки периодичности обновления \"Настраиваемая (произвольный срок)\". Обязателен, если tagId = numDays.",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].calendarDays[index]",
            "paramType": "array[object]",
            "description": "Настройки периодичности обновления \"Настраиваемая (Календарные дни)\". Обязателен, если tagId = calendarDays.",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].calendarDays[index].day",
            "paramType": "string[^(0[1-9]|[1-2]\\d|3[0-1])\\.(0[1-9]|1[0-2])$]",
            "description":"День месяца в формате DD.MM",
            "required": false,
        },
        {
            "paramName": "generalInfo.periodUpdate.multiple[index].isCheckLastDay",
            "paramType": "boolean",
            "description":"Дополнительное свойство для периодичности обновления \"Ежемесячно\" - \"Обновлять не позднее последнего дня следующего месяца за месяцем последнего подписания\"",
            "required": false,
        },
        {
            "paramName": "generalInfo.systemsSuppliers[index]",
            "paramType": "array[object]",
            "description": "Системы-поставщики данных в каталог заполнения",
            "required": false,
        },
        {
            "paramName": "generalInfo.systemsSuppliers[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор информационной системы",
            "required": true,
        },
        {
            "paramName": "generalInfo.systemsSuppliers[index].name",
            "paramType": "string",
            "description": "Название информационной системы",
            "required": true,
        },
        {
            "paramName": "generalInfo.systemsSuppliersIds",
            "paramType": "array[integer]",
            "description": "Список идентификаторов систем поставщиков данных",
            "required": false,
        },
        {
            "paramName": "generalInfo.hasBackgroundCheck",
            "paramType": "boolean",
            "description": "Признак наличия в каталоге периодической фоновой проверки",
            "required": true,
        },
        {
            "paramName": "generalInfo.backgroundCheckPeriodTagId",
            "paramType": "string[\ndaily,\nweekly,\nmonthly,\nquarterly,\nyearly\n]",
            "description": "Строковый идентификатор периода фоновой проверки",
            "required": false,
        },
        {
            "paramName": "generalInfo.backgroundCheckPeriod",
            "paramType": "object",
            "description": "Период фоновой проверки в каталоге",
            "required": false,
        },
        {
            "paramName": "generalInfo.backgroundCheckPeriod.name",
            "paramType": "string",
            "description": "Название периодичности обновления каталога",
            "required": false,
        },
        {
            "paramName": "generalInfo.backgroundCheckPeriod.tagId",
            "paramType": "string[\ndaily,\nweekly,\nmonthly,\nquarterly,\nyearly\n]",
            "description": "Строковый идентификатор периода фоновой проверки",
            "required": false,
        },
        {
            "paramName": "generalInfo.backgroundCheckEmails",
            "paramType": "string",
            "description": "Список электронных почт получателей результатов фоновой проверки, перечисленные через запятую БЕЗ пробела",
            "required": false,
        },
        {
            "paramName": "generalInfo.isDeleteAllObjects",
            "paramType": "boolean",
            "description": "Признак \"Возможно одновременное удаление всех объектов\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.isPriorityProcess",
            "paramType": "boolean",
            "description": "Признак \"Установить приоритет подписания данных\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.outOivsBlockEditObjectsGUI[index]",
            "paramType": "array[object]",
            "description": "Поставщики информации, которым остаётся доступным редактирование содержания каталога при отмеченном свойстве \"Заблокировать редактирование данных (веб)\"",
            "required": false,
        },
        {
            "paramName": "generalInfo.outOivsBlockEditObjectsGUI[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор ОИВа",
            "required": true,
        },
        {
            "paramName": "generalInfo.outOivsBlockEditObjectsGUI[index]",
            "paramType": "array[integer]",
            "description": "Список идентификаторов поставщиков информации, которым остаётся доступным редактирование содержания каталога при отмеченном свойстве \"Заблокировать редактирование данных (веб)\"",
            "required": false,
        },
        {
            "paramName": "generalInfo.isBlockEditObjectsService",
            "paramType": "boolean",
            "description": "Признак \"Заблокировать подписание данных (сервис)\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.isBlockRestoreObjects",
            "paramType": "boolean",
            "description": "Признак \"Заблокировать восстановление данных\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.isBlockSignObjectsGUI",
            "paramType": "boolean",
            "description": "Признак \"Заблокировать подписание данных (веб)\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.isCopyObjects",
            "paramType": "boolean",
            "description": "Признак \"Возможно копирование объектов\"",
            "required": true,
        },
        {
            "paramName": "generalInfo.isBlockEditObjectsGUI",
            "paramType": "boolean",
            "description": "Признак \"Заблокировать редактирование данных (веб)\"",
            "required": true,
        },
        {
            "paramName": "attributes[index]",
            "paramType": "array[object]",
            "description": "Настройки вкладки \"Атрибуты\" каталога заполнения",
            "required": true,
        },
        {
            "paramName": "attributes[index]",
            "paramType": "array[object[Один из вариантов]]",
            "description": "Настройки вкладки \"Атрибуты\" каталога заполнения",
            "required": false,
        },
        {
            "paramName": " Вариант 1 attributes[index]",
            "paramType": " Вариант 1 attributes[index]",
            "description": " Вариант 1 attributes[index]",
            "required": false,
        }, // StringFillingCatalogAttribute start
        {
            "paramName": " Вариант 1 attributes[index]",
            "paramType": "object",
            "description": "Строковый атрибут каталога заполнения",
            "required": false,
        },
        {
            "paramName": " Вариант 1 attributes[index].attribute",
            "paramType": "object",
            "description": "Информация об атрибуте ЕХД",
            "required": true,
        }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start
        {
            "paramName": " Вариант 1 attributes[index].attribute.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор атрибута",
            "required": true,
        },
        {
            "paramName": " Вариант 1 attributes[index].attribute.techName",
            "paramType": "string",
            "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
            "required": true,
        },
        {
            "paramName": " Вариант 1 attributes[index].attribute.rusName",
            "paramType": "string",
            "description": "Русскоязычное наименование атрибута, должно быть уникальным",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.enName",
            "paramType": "string",
            "description": "Англоязычное наименование атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.description",
            "paramType": "string",
            "description": "Описание атрибута",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.type",
            "paramType": "object",
            "description": "Тип атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.type.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.type.name",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.type.typeTag",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.type.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.alterNames[index]",
            "paramType": "array[object]",
            "description": "Альтернативные названия атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].rusAlterName",
            "paramType": "string",
            "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].enAlterName",
            "paramType": "string",
            "description": "Англоязычное альтернативное наименование атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].attrId",
            "paramType": "integer",
            "description": "Идентификатор атрибута ЕХД",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].catalogAttrId",
            "paramType": "integer",
            "description": "Идентификатор атрибута каталога",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].selectedAlterNameId",
            "paramType": "integer",
            "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].order",
            "paramType": "integer",
            "description": "Порядковый номер атрибута в каталоге",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].isMain",
            "paramType": "boolean",
            "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
            "required": true,
        }, // CommonFillingCatalogAttribute end //CommonCatalogAttribute end
        {
            "paramName": "Вариант 1 attributes[index].isReq",
            "paramType": "boolean",
            "description": "Свойство обязательности атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].isUniq",
            "paramType": "boolean",
            "description": "Свойство уникальности значения атрибута",
            "required": true,
        }, 
        {
            "paramName": "Вариант 1 attributes[index].isUniqWithinParent",
            "paramType": "boolean",
            "description": "Признак, что уникальность значений атрибутов внутри табличного атрибута будет проверятся в рамках объекта-родителя.",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].isBanEdit",
            "paramType": "boolean",
            "description": "Свойство запрета на редактирование",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].isSystemModify",
            "paramType": "boolean",
            "description": "Свойство, что значение атрибута изменяется системой",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].objOperatingMode",
            "paramType": "string[\ncreateObj,\nupdateObj,\ndeleteObj\n]",
            "description": "Режим работы с объектом, при котором доступно изменение значений атрибута:\n  - `createObj` - только при создании,\n  - `updateObj` - при редактировании (в т.ч. создании),\n  - `deleteObj` - при удалении.",
            "required": true,
        }, // FillingCatalogOperatingModeTagIdEnum full
        {
            "paramName": "Вариант 1 attributes[index].oivs[index]",
            "paramType": "array[object]",
            "description": "Список ОИВ, ответственных за значение, содержащееся в атрибуте",
            "required": true,
        }, // CommonOivInfo start
        {
            "paramName": "Вариант 1 attributes[index].oivs[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор ОИВа",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].oivs[index].name",
            "paramType": "string",
            "description": "Наименование ОИВа",
            "required": true,
        }, // CommonOivInfo end
        {
            "paramName": "Вариант 1 attributes[index].oivsIds",
            "paramType": "array[integer]",
            "description": "Список идентификаторов ОИВ, ответственных за значение, содержащееся в атрибуте",
            "required": true,
        },
        {
            "paramName": "Вариант 1 attributes[index].isManualInput",
            "paramType": "boolean",
            "description": "Настроено ли на этот атрибут заполнение значениями не из справочника (ручной ввод) в блоках Автозаполнения конструктора",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].manualInputTargets[index]",
            "paramType": "array[object]",
            "description": "Массив атрибутов, значение которых зависит от заполнения данного атрибута при автозаполнении.\nОписываются в блоке `Автозаполнение` конструктора в массиве [[blocks.properties.mapping]].\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].manualInputTargets[index].attrId",
            "paramType": "integer",
            "description": "Идентификатор атрибута в ЕХД",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].manualInputTargets[index].isDependent",
            "paramType": "boolean",
            "description": "Является ли атрибут зависимым в рамках ручного ввода",
            "required": false,
        },
        {
            "paramName": "Вариант 1 attributes[index].manualInputTargets[index].manualInputSources[index]",
            "paramType": "array[integer[int32]]",
            "description": "Массив идентификаторов атрибутов, от значения которых зависит значение данного атрибута при Автозаполнении.\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
            "required": false,
        }, // CommonFillingCatalogAttribute end
        {
            "paramName": "Вариант 1 attributes[index].defaultValue",
            "paramType": "string",
            "description": "Значение атрибута по умолчанию",
            "required": false,
        }, // CommonCatalogAttributeWithDefaultValue full
        {
            "paramName": "Вариант 1 attributes[index].maxLength",
            "paramType": "integer",
            "description": "Максимальная длина строкового значения",
            "required": true,
        }, // StringFillingCatalogAttribute end
        {
          "paramName": "Вариант 2 attributes[index]",
          "paramType": "Вариант 2 attributes[index]",
          "description": "Вариант 2 attributes[index]",
          "required": false,
        }, // DictFillingCatalogAttribute start
        {
          "paramName": "Вариант 2 attributes[index]",
          "paramType": "Вариант 2 attributes[index]",
          "description": "Вариант 2 attributes[index]",
          "required": false,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute",
            "paramType": "object",
            "description": "Информация об атрибуте ЕХД",
            "required": true,
        }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start DictionaryAttribute start
        {
            "paramName": "Вариант 2 attributes[index].attribute.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.techName",
            "paramType": "string",
            "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.rusName",
            "paramType": "string",
            "description": "Русскоязычное наименование атрибута, должно быть уникальным",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.enName",
            "paramType": "string",
            "description": "Англоязычное наименование атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.description",
            "paramType": "string",
            "description": "Описание атрибута",
            "required": false,
        }, // CommonAttributeInfo end
        {
            "paramName": "Вариант 2 attributes[index].attribute.type",
            "paramType": "object",
            "description": "Тип атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.type.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.type.name",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": false,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.alterNames[index]",
            "paramType": "array[object]",
            "description": "Альтернативные названия атрибута",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
            "required": false,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].rusAlterName",
            "paramType": "string",
            "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].enAlterName",
            "paramType": "string",
            "description": "Англоязычное альтернативное наименование атрибута",
            "required": true,
        }, // CommonAttribute end
        {
            "paramName": "Вариант 2 attributes[index].attrId",
            "paramType": "integer",
            "description": "Идентификатор атрибута ЕХД",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].catalogAttrId",
            "paramType": "integer",
            "description": "Идентификатор атрибута каталога",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].selectedAlterNameId",
            "paramType": "integer",
            "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
            "required": false,
        },
        {
            "paramName": "Вариант 2 attributes[index].order",
            "paramType": "integer",
            "description": "Порядковый номер атрибута в каталоге",
            "required": true,
        },
        {
            "paramName": "Вариант 2 attributes[index].isMain",
            "paramType": "boolean",
            "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
            "required": true,
        }, // CommonFillingCatalogAttribute end // CommonCatalogAttribute end
        {
            "paramName": "Вариант 2 attributes[index].isMultiple",
            "paramType": "boolean",
            "description": "Указывает, что атрибут может содержать несколько значений одновременно",
            "required": true,
        }, // CommonCatalogAttributeWithMultipleValues start
        {
            "paramName": "Вариант 2 attributes[index].maxCntElement",
            "paramType": "integer",
            "description": "Максимально допустимое количество элементов, которое возможно добавить в рамках атрибута",
            "required": false,
        },
        {
            "paramName": "Вариант 2 attributes[index].minCntElement",
            "paramType": "integer",
            "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
            "required": false,
        }, // CommonCatalogAttributeWithMultipleValues end
        {
            "paramName": "Вариант 2 attributes[index].attribute",
            "paramType": "integer",
            "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
            "required": false,
        },
        {
          "paramName": "Вариант 2 attributes[index].attribute",
          "paramType": "object",
          "description": "Информация об атрибуте ЕХД",
          "required": true,
      }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start
      {
          "paramName": "Вариант 2 attributes[index].attribute.id",
          "paramType": "integer[int32]",
          "description": "Идентификатор атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.techName",
          "paramType": "string",
          "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.rusName",
          "paramType": "string",
          "description": "Русскоязычное наименование атрибута, должно быть уникальным",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.enName",
          "paramType": "string",
          "description": "Англоязычное наименование атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.description",
          "paramType": "string",
          "description": "Описание атрибута",
          "required": false,
      }, // CommonAttributeInfo end
      {
          "paramName": "Вариант 2 attributes[index].attribute.type",
          "paramType": "object",
          "description": "Тип атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.type.id",
          "paramType": "integer[int32]",
          "description": "Идентификатор типа атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.type.name",
          "paramType": "string",
          "description": "Наименование типа атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
          "paramType": "string",
          "description": "Наименование типа атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
          "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
          "description": "Техническое наименование типа атрибута",
          "required": false,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.typeTag",
          "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
          "description": "Техническое наименование типа атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.alterNames[index]",
          "paramType": "array[object]",
          "description": "Альтернативные названия атрибута",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].id",
          "paramType": "integer[int32]",
          "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
          "required": false,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].rusAlterName",
          "paramType": "string",
          "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].enAlterName",
          "paramType": "string",
          "description": "Англоязычное альтернативное наименование атрибута",
          "required": true,
      }, // CommonAttribute end
      {
          "paramName": "Вариант 2 attributes[index].attribute.dictionary",
          "paramType": "object",
          "description": "Информация о справочнике в справочном атрибуте",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.dictionary.id",
          "paramType": "integer[int32]",
          "description": "Идентификатор справочника",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.dictionary.name",
          "paramType": "string",
          "description": "Наименование справочника",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].attribute.dictionary.parentId",
          "paramType": "integer",
          "description": "Идентификатор справочника-родителя",
          "required": false,
      }, 
      {
          "paramName": "Вариант 2 attributes[index].attribute.dictionaryId",
          "paramType": "integer[int32]",
          "description": "Идентификатор справочника",
          "required": true,
      }, // DictionaryAttribute end
      {
          "paramName": "Вариант 2 attributes[index].parentDictAttrId",
          "paramType": "integer",
          "description": "Идентификатор справочного атрибута, который содержит элементы более высокого уровня иерархии. При заполнении атрибута будет ограничиваться список элементов, связанных с элементом родительского справочника.",
          "required": false,
      },
      {
          "paramName": "Вариант 2 attributes[index].refColDictTechName",
          "paramType": "string",
          "description": "Указывает значения какого атрибута будут использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].refColDict",
          "paramType": "object",
          "description": "Атрибут справочника, который будет использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].refColDict.techName",
          "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
          "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].refColDict.rusName",
          "paramType": "string",
          "description": "Русскоязычное название столбца",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].defaultColDictTechName",
          "paramType": "string",
          "description": "Позволяет выбрать атрибут справочника, который будет отображаться в каталоге. По умолчанию поле \"Наименование\".",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].defaultColDict",
          "paramType": "object",
          "description": "Атрибут справочника, который будет отображаться в каталоге.",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].defaultColDict.techName",
          "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
          "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].defaultColDict.rusName",
          "paramType": "string",
          "description": "Русскоязычное название столбца",
          "required": true,
      },
      {
          "paramName": "Вариант 2 attributes[index].defaultColDict.sort",
          "paramType": "string[\nasc,\ndesc\n]",
          "description": "Сортировка элементов справочника при заполнении атрибута",
          "required": true,
      },
      {
          "paramName": "meta",
          "paramType": "object",
          "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
          "required": false,
      }, // FillingCatalogMetadata start CommonCatalogMetadata start
      {
          "paramName": "meta.respPersonFIO",
          "paramType": "string",
          "description": "ФИО ответственного за каталог",
          "required": false,
      },
      {
          "paramName": "meta.respPersonEmail",
          "paramType": "string",
          "description": "Адрес электронной почты ответственного за каталог",
          "required": false,
      },
      {
          "paramName": "meta.respPersonPhone",
          "paramType": "string",
          "description": "Телефон ответственного за каталог",
          "required": false,
      },
      {
          "paramName": "meta.description",
          "paramType": "string",
          "description": "Описание каталога",
          "required": false,
      }, // CommonCatalogMetadata end FillingCatalogMetadata end
      {
          "paramName": "constructor[index]",
          "paramType": "array[object]",
          "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
          "required": false,
      }, // ConstructorPackageData start
      {
          "paramName": "constructor[index].tomlFormat",
          "paramType": "string",
          "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat",
          "paramType": "object",
          "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
          "required": true,
      }, // ConstructorPackage start ConstructorPackageCommonInfo start
      {
          "paramName": "constructor[index].jsonFormat.packName",
          "paramType": "string",
          "description": "Название пакета",
          "required": false,
      },
      {
          "paramName": "constructor[index].jsonFormat.packTechName",
          "paramType": "string",
          "description": "Технологическое наименование пакета. Должно быть уникально в рамках каталога.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.isMain",
          "paramType": "boolean",
          "description": "Признак главного процесса. Если для каталога настраивается конструктор, то обязательно должен быть только 1 файл со значением true. С файла со свойством isMain: true начинается обработка описанного процесса.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.event",
          "paramType": "string[\ncreate,\change,\ndelete\n]",
          "description": "Событие, при котором запускается процесс, описанный в конструкторе. Может принимать значения:\n  - change - изменение объекта, включая создание\n  - create - создание объекта,\n  - delete - удаление объекта.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.applyTableAttr",
          "paramType": "string",
          "description": "Применить процесс пакета к объектам табличного атрибута. Указывается табличный атрибут в формате attr.{TableTechName1}.{TableTechName11}.{TableTechName111}.{и т.д.}. То есть указывается вся последовательность табличных атрибутов от корня до того, для которого настраивается пакет.\nЕсли передано данное поле, то в описании блоков могут использоваться только атрибуты внутри указанной таблицы.",
          "required": false,
      }, // ConstructorPackageCommonInfo end
      {
          "paramName": "constructor[index].jsonFormat.mode",
          "paramType": "string[\noff,\nevent,\nbackground,\neventAndBackground\n]",
          "description": "Режим работы процесса. Может принимать значения:\n  - event - событие,\n  - backgroung - фоновый процесс,\n  - eventAndBackground - событие и фоновый процесс,\n  - off - отключён.\nЗначение off является приоритетным над остальными. Если указано в массиве, то считается, что процесс отключен и не будет выполняться.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index]",
          "paramType": "array[object]",
          "description": "Массив блоков конструктора. Каждый блок представляет набор общих свойств и дополнительных настроек в зависимости от типа блока.\nБлок \"START\" явно не указывается. Процесс начинается с блока идущего первым в массиве.\nБлок \"END\" явно не указывается, но чтобы сослаться на него необходимо указать идентификатор \"end\".\nЕсли блок не ссылается на другие блоки, например \"Уведомление\", то в ссылках указывается пустая строка \"\".",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].tagId",
          "paramType": "string",
          "description": "Строковый идентификатор блока конструктора. Должен быть уникален в рамках пакета каталога.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].type",
          "paramType": "string[\npackage,\ncondition,\nnotice,\nemail,\nautochange,\nautofill\n]",
          "description": "Тип блока конструктора. Возможные значения:\n  - package - пакет,\n  - condition - условие,\n  - notice - уведомление,\n  - email - письмо на электронную почту,\n  - autochange - автоизменение,\n  - autofill - автозаполнение.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].name",
          "paramType": "string",
          "description": "Наименование блока.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].trueBlockTagId",
          "paramType": "string",
          "description": "Идентификатор блока, который должен обрабатываться следующим в случае истинности условия/корректной обработки блока.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].falseBlockTagId",
          "paramType": "string",
          "description": "Идентификатор блока, который должен обрабатываться следующим в случае ложности условия/некорректной обработки блока.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Набор дополнительных свойств блока, зависящих от типа блока.",
          "required": true,
      },
      {
          "paramName": "Вариант 1 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"Пакет\"",
          "required": false,
      }, // ConstructorBlockPackage start
      {
          "paramName": "Вариант 1 constructor[index].jsonFormat.blocks[index].properties.packTechName",
          "paramType": "string",
          "description": "Технологическое наименование пакета, который должен выполниться в данном блоке.",
          "required": false,
      }, // ConstructorBlockPackage end
      {
          "paramName": "Вариант 2 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"Условие\"",
          "required": false,
      }, // ConstructorBlockCondition start
      {
          "paramName": "Вариант 2 constructor[index].jsonFormat.blocks[index].properties.condition",
          "paramType": "string",
          "description": "Условие проверки значений атрибутов. Cинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
          "required": false,
      },
      {
          "paramName": "Вариант 2 constructor[index].jsonFormat.blocks[index].properties.uniqAttr",
          "paramType": "string",
          "description": "Технологическое наименование атрибута каталога, для которого будет производиться проверка уникальности в рамках исполнения блока.\nАтрибут прописывается как и в настройках условий - attr.{techName}\nМожно указать атрибуты всех типов данных, кроме типов: таблица, файл, флаг. Указывается непосредственно корневой атрибут.",
          "required": false,
      }, // ConstructorBlockCondition end
      {
          "paramName": "Вариант 3 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"Уведомление\"",
          "required": false,
      }, // ConstructorBlockNotice start
      {
          "paramName": "Вариант 3 constructor[index].jsonFormat.blocks[index].properties.message",
          "paramType": "string",
          "description": "В блоке \"notice\":\nТекст уведомления, который должен получить пользователь/система при работе с объектом каталога.",
          "required": false,
      }, // ConstructorBlockNotice end
      {
          "paramName": "Вариант 4 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"E-mail\"",
          "required": false,
      }, // ConstructorBlockEmail start
      {
          "paramName": "Вариант 4 constructor[index].jsonFormat.blocks[index].properties.message",
          "paramType": "string",
          "description": "Текст письма, который должен быть отправлен на указанный адрес электронной почты при выполнении блока.",
          "required": false,
      },
      {
          "paramName": "Вариант 4 constructor[index].jsonFormat.blocks[index].properties.email",
          "paramType": "string",
          "description": "Адрес электронной почты, на который должно быть отправлено письмо при выполнении блока.",
          "required": false,
      }, // ConstructorBlockEmail end
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"Автоизменение\"",
          "required": false,
      }, // ConstructorBlockAutochange start
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties.condition",
          "paramType": "string",
          "description": "Условие при выполнении, которого будет происходит заполнение атрибутов. В условии можно использовать атрибуты любого типа, включая системные.\nCинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
          "required": false,
      },
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties.markObjDelete",
          "paramType": "boolean",
          "description": "Позволяет после изменения значений в атрибутах пометить объект как удаленный.\nДанное свойство может быть true, только в случае, если в режиме работы пакета указан фоновый процесс event = \"background\".",
          "required": false,
      },
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
          "paramType": "array[object]",
          "description": "Список сопоставления атрибутов каталога и значений, которые должны подставиться в рамках выполнения автоизменения.",
          "required": false,
      },
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
          "paramType": "string",
          "description": "Атрибут каталога, которому необходимо присвоить значение автоизменением.\nУказывается в формате attr.{techName}\nВозможно указать все типы атрибутов, кроме: файл, ссылка на объект, таблица.",
          "required": false,
      },
      {
          "paramName": "Вариант 5 constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
          "paramType": "string",
          "description": "Значение, которое будет подставляться в указанный атрибут.\nДоступен ввод конкретного значения в формате строки. Если в catalogAttr указан атрибут с типом:\n- \"Строка\", \"Целое число\", \"Дробное число\", \"Дата\", то в value указывается значение в кавычках, далее на стороне сервиса эти значения будут преобразованы к типу данных атрибута.\n- \"Флаг\", то в value указывается значение в кавычках 1 или 0, true или false.\n- \"Справочник\", то в value передаётся в кавычках идентификатор значения из справочника этого атрибута.\nТакже для всех вышеперечисленных типов атрибутов можно указать в value функцию, описанную в пакете, в виде func.{tagId}",
          "required": false,
      }, // ConstructorBlockAutochange end
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties",
          "paramType": "object",
          "description": "Настройки для блока \"Автозаполнение\"",
          "required": false,
      }, // ConstructorBlockAutofill start
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.refValue",
          "paramType": "string",
          "description": "Значение для сопоставления со справочником",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.dictId",
          "paramType": "integer",
          "description": "Идентификатор справочника, с которым сопоставляется значение",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.dictAttr",
          "paramType": "string",
          "description": "Столбец справочника, по которому производится сопоставление в формате dictAttr.{techName}",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.caseSensitive",
          "paramType": "boolean",
          "description": "Учитывать ли регистр значения при сопоставлении со справочником\n\nЕсли не указан, то сравнение выполняется без учета регистра",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.allowManualInput",
          "paramType": "boolean",
          "description": "Признак позволяющий пользователю при работе с объектам указывать значение не из справочника, для атрибута, который участвует в сопоставлении со справочным.",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
          "paramType": "array[object]",
          "description": "Список сопоставления атрибутов каталога и атрибутов справочника.",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
          "paramType": "string",
          "description": "Атрибут каталога, которому необходимо присвоить значение автозаполнением.\nУказывается в формате attr.{techName}\nВозможно указать только атрибуты, имеющие свойство \"Изменяемый системой\" (isSystemModify: true).\nТакими атрибутами могут быть все типы атрибутов, кроме: файл, таблица.",
          "required": false,
      },
      {
          "paramName": "Вариант 6 constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
          "paramType": "string",
          "description": "Атрибут справочника, из которого необходимо использовать значение для автозаполнения.\nУказывается в формате dictAttr.{techName}",
          "required": false,
      }, // ConstructorBlockAutofill end
      {
          "paramName": "constructor[index].jsonFormat.functions[index]",
          "paramType": "array[object]",
          "description": "Массив функций, которые используются в рамках пакета.",
          "required": false,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].tagId",
          "paramType": "string",
          "description": "Строковый идентификатор функции. Должен быть уникален в рамках пакета.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].outputType",
          "paramType": "string[\nstring,\nnumber,\ndate\n]",
          "description": "Выходной тип данных функции. Может принимать значения:\n  - string - строка,\n  - number - целое или дробное число,\n  - date - дата.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].func",
          "paramType": "string",
          "description": "Тело функции. Cинтаксис описания функций подробно описан в статье в вики в разделе \"Конструктор процессов\".",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].varables[index]",
          "paramType": "array[object]",
          "description": "Массив функций, которые будут использоваться в основной функции в качестве переменных.\nПри описании функций важен их порядок в массиве. Функцию-переменную F1 можно использовать в другой функции-переменной F2, если F1 описана раньше чем F2.",
          "required": false,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].varables[index].tagId",
          "paramType": "string",
          "description": "Строковый идентификатор функции-переменной. Должен быть уникален в рамках пакета.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].varables[index].outputType",
          "paramType": "string[\nstring,\nnumber,\ndate\n]",
          "description": "Выходной тип данных функции-переменной. Может принимать значения:\n  - string - строка,\n  - number - целое или дробное число,\n  - date - дата.",
          "required": true,
      },
      {
          "paramName": "constructor[index].jsonFormat.functions[index].varables[index].func",
          "paramType": "string",
          "description": "Тело функции-переменной. Cинтаксис описания функций подробно описан в статье в вики в разделе \"Конструктор процессов\".",
          "required": true,
      }, // ConstructorPackage end ConstructorPackageData end
      {
          "paramName": "conditionalUniq",
          "paramType": "string",
          "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
          "required": false,
      },
      {
          "paramName": "groupUniq",
          "paramType": "string",
          "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
          "required": false,
      },
      {
          "paramName": "map",
          "paramType": "object",
          "description": "Настройки карты каталога заполнения",
          "required": true,
      }, // FillingCatalogMap start
      {
          "paramName": "map.hasGeo",
          "paramType": "boolean",
          "description": "Наличие геопривязки в каталоге",
          "required": true,
      },
      {
          "paramName": "map.typeGeoTagIds[index]",
          "paramType": "array[string[\nPoint,\nMultiPoint,\nMultiLineString,\nMultiPolygon\n]]",
          "description": "Массив строковых идентификаторов типов геометрии",
          "required": false,
      },
      {
          "paramName": "map.isWGS84",
          "paramType": "boolean",
          "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
          "required": false,
      },
      {
          "paramName": "map.isReq",
          "paramType": "boolean",
          "description": "Обязательность геопривязки",
          "required": false,
      },
      {
          "paramName": "map.isOneTypeGeoForObj",
          "paramType": "boolean",
          "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
          "required": false,
      },
      {
          "paramName": "map.isNotReqGeoForService",
          "paramType": "boolean",
          "description": "Необязательность геометрии при загрузке через сервис",
          "required": false,
      }, // FillingCatalogMap end
    ]
},
}

export const attributeInput = {
  "description": "Настройки каталога заполнения",
  "type": "object",
  "properties": {
      "attributes": {
          "description": "Настройки вкладки \"Атрибуты\" каталога заполнения",
          "type": "array",
          "items": {
              "$ref": "#/components/schemas/FillingCatalogAttribute"
          },
          "minItems": 1
      },
  },
  "required": [
      "generalInfo",
      "attributes",
      "map"
  ]
}
export const attributeOutput = [
  {
    "paramName": "attributes[index]",
    "paramType": "array[object]",
    "description": "Настройки вкладки \"Атрибуты\" каталога заполнения",
    "required": true,
},
{
    "paramName": "attributes[index]",
    "paramType": "array[object[Один из вариантов]]",
    "description": "Атрибут каталога заполнения",
    "required": true,
}, // StringFillingCatalogAttribute start
{
    "paramName": "Вариант 1 attributes[index]",
    "paramType": "object",
    "description": "Строковый атрибут каталога заполнения",
    "required": true,
},
{
    "paramName": " Вариант 1 attributes[index].attribute",
    "paramType": "object",
    "description": "Информация об атрибуте ЕХД",
    "required": true,
}, // CommonFillingCatalogAttribute start CommonCatalogAttribute start
{
    "paramName": " Вариант 1 attributes[index].attribute.id",
    "paramType": "integer[int32]",
    "description": "Идентификатор атрибута",
    "required": true,
},
{
    "paramName": " Вариант 1 attributes[index].attribute.techName",
    "paramType": "string",
    "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
    "required": true,
},
{
    "paramName": " Вариант 1 attributes[index].attribute.rusName",
    "paramType": "string",
    "description": "Русскоязычное наименование атрибута, должно быть уникальным",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.enName",
    "paramType": "string",
    "description": "Англоязычное наименование атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.description",
    "paramType": "string",
    "description": "Описание атрибута",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.type",
    "paramType": "object",
    "description": "Тип атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.type.id",
    "paramType": "integer[int32]",
    "description": "Идентификатор типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.type.name",
    "paramType": "string",
    "description": "Наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.type.typeTag",
    "paramType": "string",
    "description": "Наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.type.typeTag",
    "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
    "description": "Техническое наименование типа атрибута",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.typeTag",
    "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
    "description": "Техническое наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.alterNames[index]",
    "paramType": "array[object]",
    "description": "Альтернативные названия атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].id",
    "paramType": "integer[int32]",
    "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].rusAlterName",
    "paramType": "string",
    "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attribute.alterNames[index].enAlterName",
    "paramType": "string",
    "description": "Англоязычное альтернативное наименование атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].attrId",
    "paramType": "integer",
    "description": "Идентификатор атрибута ЕХД",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].catalogAttrId",
    "paramType": "integer",
    "description": "Идентификатор атрибута каталога",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].selectedAlterNameId",
    "paramType": "integer",
    "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].order",
    "paramType": "integer",
    "description": "Порядковый номер атрибута в каталоге",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].isMain",
    "paramType": "boolean",
    "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
    "required": true,
}, // CommonFillingCatalogAttribute end //CommonCatalogAttribute end
{
    "paramName": "Вариант 1 attributes[index].isReq",
    "paramType": "boolean",
    "description": "Свойство обязательности атрибута",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].isUniq",
    "paramType": "boolean",
    "description": "Свойство уникальности значения атрибута",
    "required": true,
}, 
{
    "paramName": "Вариант 1 attributes[index].isUniqWithinParent",
    "paramType": "boolean",
    "description": "Признак, что уникальность значений атрибутов внутри табличного атрибута будет проверятся в рамках объекта-родителя.",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].isBanEdit",
    "paramType": "boolean",
    "description": "Свойство запрета на редактирование",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].isSystemModify",
    "paramType": "boolean",
    "description": "Свойство, что значение атрибута изменяется системой",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].objOperatingMode",
    "paramType": "string[\ncreateObj,\nupdateObj,\ndeleteObj\n]",
    "description": "Режим работы с объектом, при котором доступно изменение значений атрибута:\n  - `createObj` - только при создании,\n  - `updateObj` - при редактировании (в т.ч. создании),\n  - `deleteObj` - при удалении.",
    "required": true,
}, // FillingCatalogOperatingModeTagIdEnum full
{
    "paramName": "Вариант 1 attributes[index].oivs[index]",
    "paramType": "array[object]",
    "description": "Список ОИВ, ответственных за значение, содержащееся в атрибуте",
    "required": true,
}, // CommonOivInfo start
{
    "paramName": "Вариант 1 attributes[index].oivs[index].id",
    "paramType": "integer[int32]",
    "description": "Идентификатор ОИВа",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].oivs[index].name",
    "paramType": "string",
    "description": "Наименование ОИВа",
    "required": true,
}, // CommonOivInfo end
{
    "paramName": "Вариант 1 attributes[index].oivsIds",
    "paramType": "array[integer]",
    "description": "Список идентификаторов ОИВ, ответственных за значение, содержащееся в атрибуте",
    "required": true,
},
{
    "paramName": "Вариант 1 attributes[index].isManualInput",
    "paramType": "boolean",
    "description": "Настроено ли на этот атрибут заполнение значениями не из справочника (ручной ввод) в блоках Автозаполнения конструктора",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].manualInputTargets[index]",
    "paramType": "array[object]",
    "description": "Массив атрибутов, значение которых зависит от заполнения данного атрибута при автозаполнении.\nОписываются в блоке `Автозаполнение` конструктора в массиве [[blocks.properties.mapping]].\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].manualInputTargets[index].attrId",
    "paramType": "integer",
    "description": "Идентификатор атрибута в ЕХД",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].manualInputTargets[index].isDependent",
    "paramType": "boolean",
    "description": "Является ли атрибут зависимым в рамках ручного ввода",
    "required": false,
},
{
    "paramName": "Вариант 1 attributes[index].manualInputTargets[index].manualInputSources[index]",
    "paramType": "array[integer[int32]]",
    "description": "Массив идентификаторов атрибутов, от значения которых зависит значение данного атрибута при Автозаполнении.\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
    "required": false,
}, // CommonFillingCatalogAttribute end
{
    "paramName": "Вариант 1 attributes[index].defaultValue",
    "paramType": "string",
    "description": "Значение атрибута по умолчанию",
    "required": false,
}, // CommonCatalogAttributeWithDefaultValue full
{
    "paramName": "Вариант 1 attributes[index].maxLength",
    "paramType": "integer",
    "description": "Максимальная длина строкового значения",
    "required": true,
}, // StringFillingCatalogAttribute end
{
  "paramName": "Вариант 2 attributes[index]",
  "paramType": "Вариант 2 attributes[index]",
  "description": "Вариант 2 attributes[index]",
  "required": false,
}, // DictFillingCatalogAttribute start
{
  "paramName": "Вариант 2 attributes[index]",
  "paramType": "Вариант 2 attributes[index]",
  "description": "Вариант 2 attributes[index]",
  "required": false,
},
{
    "paramName": "Вариант 2 attributes[index].attribute",
    "paramType": "object",
    "description": "Информация об атрибуте ЕХД",
    "required": true,
}, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start DictionaryAttribute start
{
    "paramName": "Вариант 2 attributes[index].attribute.id",
    "paramType": "integer[int32]",
    "description": "Идентификатор атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.techName",
    "paramType": "string",
    "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.rusName",
    "paramType": "string",
    "description": "Русскоязычное наименование атрибута, должно быть уникальным",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.enName",
    "paramType": "string",
    "description": "Англоязычное наименование атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.description",
    "paramType": "string",
    "description": "Описание атрибута",
    "required": false,
}, // CommonAttributeInfo end
{
    "paramName": "Вариант 2 attributes[index].attribute.type",
    "paramType": "object",
    "description": "Тип атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.type.id",
    "paramType": "integer[int32]",
    "description": "Идентификатор типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.type.name",
    "paramType": "string",
    "description": "Наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
    "paramType": "string",
    "description": "Наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
    "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
    "description": "Техническое наименование типа атрибута",
    "required": false,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.typeTag",
    "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
    "description": "Техническое наименование типа атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.alterNames[index]",
    "paramType": "array[object]",
    "description": "Альтернативные названия атрибута",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].id",
    "paramType": "integer[int32]",
    "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
    "required": false,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].rusAlterName",
    "paramType": "string",
    "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].enAlterName",
    "paramType": "string",
    "description": "Англоязычное альтернативное наименование атрибута",
    "required": true,
}, // CommonAttribute end
{
    "paramName": "Вариант 2 attributes[index].attrId",
    "paramType": "integer",
    "description": "Идентификатор атрибута ЕХД",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].catalogAttrId",
    "paramType": "integer",
    "description": "Идентификатор атрибута каталога",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].selectedAlterNameId",
    "paramType": "integer",
    "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
    "required": false,
},
{
    "paramName": "Вариант 2 attributes[index].order",
    "paramType": "integer",
    "description": "Порядковый номер атрибута в каталоге",
    "required": true,
},
{
    "paramName": "Вариант 2 attributes[index].isMain",
    "paramType": "boolean",
    "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
    "required": true,
}, // CommonFillingCatalogAttribute end // CommonCatalogAttribute end
{
    "paramName": "Вариант 2 attributes[index].isMultiple",
    "paramType": "boolean",
    "description": "Указывает, что атрибут может содержать несколько значений одновременно",
    "required": true,
}, // CommonCatalogAttributeWithMultipleValues start
{
    "paramName": "Вариант 2 attributes[index].maxCntElement",
    "paramType": "integer",
    "description": "Максимально допустимое количество элементов, которое возможно добавить в рамках атрибута",
    "required": false,
},
{
    "paramName": "Вариант 2 attributes[index].minCntElement",
    "paramType": "integer",
    "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
    "required": false,
}, // CommonCatalogAttributeWithMultipleValues end
{
    "paramName": "Вариант 2 attributes[index].attribute",
    "paramType": "integer",
    "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
    "required": false,
},
{
  "paramName": "Вариант 2 attributes[index].attribute",
  "paramType": "object",
  "description": "Информация об атрибуте ЕХД",
  "required": true,
}, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start
{
  "paramName": "Вариант 2 attributes[index].attribute.id",
  "paramType": "integer[int32]",
  "description": "Идентификатор атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.techName",
  "paramType": "string",
  "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.rusName",
  "paramType": "string",
  "description": "Русскоязычное наименование атрибута, должно быть уникальным",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.enName",
  "paramType": "string",
  "description": "Англоязычное наименование атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.description",
  "paramType": "string",
  "description": "Описание атрибута",
  "required": false,
}, // CommonAttributeInfo end
{
  "paramName": "Вариант 2 attributes[index].attribute.type",
  "paramType": "object",
  "description": "Тип атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.type.id",
  "paramType": "integer[int32]",
  "description": "Идентификатор типа атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.type.name",
  "paramType": "string",
  "description": "Наименование типа атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
  "paramType": "string",
  "description": "Наименование типа атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.type.typeTag",
  "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
  "description": "Техническое наименование типа атрибута",
  "required": false,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.typeTag",
  "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
  "description": "Техническое наименование типа атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.alterNames[index]",
  "paramType": "array[object]",
  "description": "Альтернативные названия атрибута",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].id",
  "paramType": "integer[int32]",
  "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
  "required": false,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].rusAlterName",
  "paramType": "string",
  "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.alterNames[index].enAlterName",
  "paramType": "string",
  "description": "Англоязычное альтернативное наименование атрибута",
  "required": true,
}, // CommonAttribute end
{
  "paramName": "Вариант 2 attributes[index].attribute.dictionary",
  "paramType": "object",
  "description": "Информация о справочнике в справочном атрибуте",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.dictionary.id",
  "paramType": "integer[int32]",
  "description": "Идентификатор справочника",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.dictionary.name",
  "paramType": "string",
  "description": "Наименование справочника",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].attribute.dictionary.parentId",
  "paramType": "integer",
  "description": "Идентификатор справочника-родителя",
  "required": false,
}, 
{
  "paramName": "Вариант 2 attributes[index].attribute.dictionaryId",
  "paramType": "integer[int32]",
  "description": "Идентификатор справочника",
  "required": true,
}, // DictionaryAttribute end
{
  "paramName": "Вариант 2 attributes[index].parentDictAttrId",
  "paramType": "integer",
  "description": "Идентификатор справочного атрибута, который содержит элементы более высокого уровня иерархии. При заполнении атрибута будет ограничиваться список элементов, связанных с элементом родительского справочника.",
  "required": false,
},
{
  "paramName": "Вариант 2 attributes[index].refColDictTechName",
  "paramType": "string",
  "description": "Указывает значения какого атрибута будут использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].refColDict",
  "paramType": "object",
  "description": "Атрибут справочника, который будет использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].refColDict.techName",
  "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
  "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].refColDict.rusName",
  "paramType": "string",
  "description": "Русскоязычное название столбца",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].defaultColDictTechName",
  "paramType": "string",
  "description": "Позволяет выбрать атрибут справочника, который будет отображаться в каталоге. По умолчанию поле \"Наименование\".",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].defaultColDict",
  "paramType": "object",
  "description": "Атрибут справочника, который будет отображаться в каталоге.",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].defaultColDict.techName",
  "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
  "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].defaultColDict.rusName",
  "paramType": "string",
  "description": "Русскоязычное название столбца",
  "required": true,
},
{
  "paramName": "Вариант 2 attributes[index].defaultColDict.sort",
  "paramType": "string[\nasc,\ndesc\n]",
  "description": "Сортировка элементов справочника при заполнении атрибута",
  "required": true,
},
]