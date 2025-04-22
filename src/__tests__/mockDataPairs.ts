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