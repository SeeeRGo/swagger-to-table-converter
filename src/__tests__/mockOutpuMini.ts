export const MockOutputMini = [
  {
    "path": "/catalogs/search",
    "method": "post",
    "methodDesc": "Поиск по списку каталогов заполнения",
    "responses": {
        "description": "Успешный ответ.\nПри отсутствии элементов, удовлетворяющих условиям запроса, возвращается пустой массив.\nЕсли переданы несуществующие идентификаторы категории, ОИВ, системы-потребителя, то также возвращается пустой массив.",
        "schema": []
    },
    "requests": {
        "description": "Some reference type",
        "paramName": "Unknown reference type param"
    },
    "inputParams": [
        {
            "paramName": "limit",
            "paramIn": "query",
            "paramType": "integer($int32)",
            "description": "Количество возвращаемых каталогов (от `1` до `1000`).",
            "required": false,
        },
        {
            "paramName": "offset",
            "paramIn": "query",
            "paramType": "integer($int32)",
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
            "paramType": "string[\nsigned,\nneverSigned,\nhasChange,\narchive\n]",
            "description": "Статус подписания каталога. Может принимать следующие значения:\n  - `signed` - подписанный, изменения отсутствуют. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = signed И statusSignMetadata = signed\n  - `neverSigned` - ни разу не подписан. Каталог имеет этот статус при выполнении условия:\n    dateLastSign=null И statusSignObjects != archive\n  - `hasChange` - подписанный, имеются изменения. Каталог имеет этот статус при выполнении условия:\n    dateLastSign = {value} И (statusSignObjects = unsigned ИЛИ statusSignMetadata = unsigned)\n  - `archive` - в архиве. Каталог имеет этот статус при выполнении условия:\n    statusSignObjects = archive И statusSignMetadata = archive",
            "required": false,
        },
        {
            "paramName": "planSigning",
            "paramIn": "query",
            "paramType": "string[\nok,\nless3Day,\nexpired\n]",
            "description": "Статус просрочки подписания каталога. Может принимать следующие значения:\n  - `ok` - срок планового подписания не нарушен. Включает каталоги, для которых dateNextUpdate строго больше текущей даты ИЛИ является null.\n  - `less3Day` - до планового подписания менее 3-х дней. Вклячает каталоги, у которых dateNextUpdate меньше или равна текущей даты + 3 дня.\n  - `expired` - плановое подписание просрочено. Включает каталоги, для которых dateNextUpdate строго меньше текущей даты.",
            "required": false,
        }
    ]
},
{
  "path": "/catalogs",
  "method": "post",
  "methodDesc": "Первичное сохранение каталога",
  "responses": {
      "description": "Успешный ответ",
      "schema": [
        {
            "paramName": "",
            "paramType": "",
            "description": "",
            "required": false,
        },
      ]
  },
  "ApiResponse": {
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
},
  "CreatedResponse": {
    "type": "object",
    "description": "Успешное создание объекта.",
    "allOf": [
        {
            "$ref": "#/components/schemas/ApiResponse"
        },
        {
            "properties": {
                "code": {
                    "enum": [
                        201
                    ]
                },
                "messageType": {
                    "enum": [
                        "Created"
                    ]
                }
            }
        }
    ]
},
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
            "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramName": "attributes[index] Вариант 1",
              "paramType": "attributes[index] Вариант 1",
              "description": "attributes[index] Вариант 1",
              "required": false,
          }, // StringFillingCatalogAttribute start
          {
              "paramName": "attributes[index]",
              "paramType": "object",
              "description": "Строковый атрибут каталога заполнения",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute",
              "paramType": "object",
              "description": "Информация об атрибуте ЕХД",
              "required": true,
          }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start
          {
              "paramName": "attributes[index].attribute.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.techName",
              "paramType": "string",
              "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.rusName",
              "paramType": "string",
              "description": "Русскоязычное наименование атрибута, должно быть уникальным",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.enName",
              "paramType": "string",
              "description": "Англоязычное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.description",
              "paramType": "string",
              "description": "Описание атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.type",
              "paramType": "object",
              "description": "Тип атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.name",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index]",
              "paramType": "array[object]",
              "description": "Альтернативные названия атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
              "paramType": "string",
              "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
              "paramType": "string",
              "description": "Англоязычное альтернативное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута ЕХД",
              "required": true,
          },
          {
              "paramName": "attributes[index].catalogAttrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута каталога",
              "required": true,
          },
          {
              "paramName": "attributes[index].selectedAlterNameId",
              "paramType": "integer",
              "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
              "required": false,
          },
          {
              "paramName": "attributes[index].order",
              "paramType": "integer",
              "description": "Порядковый номер атрибута в каталоге",
              "required": true,
          },
          {
              "paramName": "attributes[index].isMain",
              "paramType": "boolean",
              "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
              "required": true,
          }, // CommonFillingCatalogAttribute end //CommonCatalogAttribute end
          {
              "paramName": "attributes[index].isReq",
              "paramType": "boolean",
              "description": "Свойство обязательности атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].isUniq",
              "paramType": "boolean",
              "description": "Свойство уникальности значения атрибута",
              "required": true,
          }, 
          {
              "paramName": "attributes[index].isUniqWithinParent",
              "paramType": "boolean",
              "description": "Признак, что уникальность значений атрибутов внутри табличного атрибута будет проверятся в рамках объекта-родителя.",
              "required": true,
          },
          {
              "paramName": "attributes[index].isBanEdit",
              "paramType": "boolean",
              "description": "Свойство запрета на редактирование",
              "required": true,
          },
          {
              "paramName": "attributes[index].isSystemModify",
              "paramType": "boolean",
              "description": "Свойство, что значение атрибута изменяется системой",
              "required": true,
          },
          {
              "paramName": "attributes[index].objOperatingMode",
              "paramType": "string[\ncreateObj,\nupdateObj,\ndeleteObj\n]",
              "description": "Режим работы с объектом, при котором доступно изменение значений атрибута:\n  - `createObj` - только при создании,\n  - `updateObj` - при редактировании (в т.ч. создании),\n  - `deleteObj` - при удалении.",
              "required": true,
          }, // FillingCatalogOperatingModeTagIdEnum full
          {
              "paramName": "attributes[index].oivs[index]",
              "paramType": "array[object]",
              "description": "Список ОИВ, ответственных за значение, содержащееся в атрибуте",
              "required": true,
          }, // CommonOivInfo start
          {
              "paramName": "attributes[index].oivs[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор ОИВа",
              "required": true,
          },
          {
              "paramName": "attributes[index].oivs[index].name",
              "paramType": "string",
              "description": "Наименование ОИВа",
              "required": true,
          }, // CommonOivInfo end
          {
              "paramName": "attributes[index].oivsIds",
              "paramType": "array[integer]",
              "description": "Список идентификаторов ОИВ, ответственных за значение, содержащееся в атрибуте",
              "required": true,
          },
          {
              "paramName": "attributes[index].isManualInput",
              "paramType": "boolean",
              "description": "Настроено ли на этот атрибут заполнение значениями не из справочника (ручной ввод) в блоках Автозаполнения конструктора",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index]",
              "paramType": "array[object]",
              "description": "Массив атрибутов, значение которых зависит от заполнения данного атрибута при автозаполнении.\nОписываются в блоке `Автозаполнение` конструктора в массиве [[blocks.properties.mapping]].\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута в ЕХД",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].isDependent",
              "paramType": "boolean",
              "description": "Является ли атрибут зависимым в рамках ручного ввода",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].manualInputSources[index]",
              "paramType": "array[integer[int32]]",
              "description": "Массив идентификаторов атрибутов, от значения которых зависит значение данного атрибута при Автозаполнении.\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
              "required": false,
          }, // CommonFillingCatalogAttribute end
          {
              "paramName": "attributes[index].defaultValue",
              "paramType": "string",
              "description": "Значение атрибута по умолчанию",
              "required": false,
          }, // CommonCatalogAttributeWithDefaultValue full
          {
              "paramName": "attributes[index].maxLength",
              "paramType": "integer",
              "description": "Максимальная длина строкового значения",
              "required": true,
          }, // StringFillingCatalogAttribute end
          {
            "paramName": "attributes[index] Вариант 2",
            "paramType": "attributes[index] Вариант 2",
            "description": "attributes[index] Вариант 2",
            "required": false,
          }, // DictFillingCatalogAttribute start
          {
            "paramName": "attributes[index] Вариант 2",
            "paramType": "attributes[index] Вариант 2",
            "description": "attributes[index] Вариант 2",
            "required": false,
          },
          {
              "paramName": "attributes[index].attribute",
              "paramType": "object",
              "description": "Информация об атрибуте ЕХД",
              "required": true,
          }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start DictionaryAttribute start
          {
              "paramName": "attributes[index].attribute.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.techName",
              "paramType": "string",
              "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.rusName",
              "paramType": "string",
              "description": "Русскоязычное наименование атрибута, должно быть уникальным",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.enName",
              "paramType": "string",
              "description": "Англоязычное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.description",
              "paramType": "string",
              "description": "Описание атрибута",
              "required": false,
          }, // CommonAttributeInfo end
          {
              "paramName": "attributes[index].attribute.type",
              "paramType": "object",
              "description": "Тип атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.name",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index]",
              "paramType": "array[object]",
              "description": "Альтернативные названия атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
              "paramType": "string",
              "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
              "paramType": "string",
              "description": "Англоязычное альтернативное наименование атрибута",
              "required": true,
          }, // CommonAttribute end
          {
              "paramName": "attributes[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута ЕХД",
              "required": true,
          },
          {
              "paramName": "attributes[index].catalogAttrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута каталога",
              "required": true,
          },
          {
              "paramName": "attributes[index].selectedAlterNameId",
              "paramType": "integer",
              "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
              "required": false,
          },
          {
              "paramName": "attributes[index].order",
              "paramType": "integer",
              "description": "Порядковый номер атрибута в каталоге",
              "required": true,
          },
          {
              "paramName": "attributes[index].isMain",
              "paramType": "boolean",
              "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
              "required": true,
          }, // CommonFillingCatalogAttribute end // CommonCatalogAttribute end
          {
              "paramName": "attributes[index].isMultiple",
              "paramType": "boolean",
              "description": "Указывает, что атрибут может содержать несколько значений одновременно",
              "required": true,
          }, // CommonCatalogAttributeWithMultipleValues start
          {
              "paramName": "attributes[index].maxCntElement",
              "paramType": "integer",
              "description": "Максимально допустимое количество элементов, которое возможно добавить в рамках атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].minCntElement",
              "paramType": "integer",
              "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
              "required": false,
          }, // CommonCatalogAttributeWithMultipleValues end
          {
              "paramName": "attributes[index].attribute",
              "paramType": "integer",
              "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
              "required": false,
          },
          {
            "paramName": "attributes[index].attribute",
            "paramType": "object",
            "description": "Информация об атрибуте ЕХД",
            "required": true,
        }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start
        {
            "paramName": "attributes[index].attribute.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.techName",
            "paramType": "string",
            "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.rusName",
            "paramType": "string",
            "description": "Русскоязычное наименование атрибута, должно быть уникальным",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.enName",
            "paramType": "string",
            "description": "Англоязычное наименование атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.description",
            "paramType": "string",
            "description": "Описание атрибута",
            "required": false,
        }, // CommonAttributeInfo end
        {
            "paramName": "attributes[index].attribute.type",
            "paramType": "object",
            "description": "Тип атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.name",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.typeTag",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": false,
        },
        {
            "paramName": "attributes[index].attribute.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index]",
            "paramType": "array[object]",
            "description": "Альтернативные названия атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
            "required": false,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
            "paramType": "string",
            "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
            "paramType": "string",
            "description": "Англоязычное альтернативное наименование атрибута",
            "required": true,
        }, // CommonAttribute end
        {
            "paramName": "attributes[index].attribute.dictionary",
            "paramType": "object",
            "description": "Информация о справочнике в справочном атрибуте",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор справочника",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.name",
            "paramType": "string",
            "description": "Наименование справочника",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.parentId",
            "paramType": "integer",
            "description": "Идентификатор справочника-родителя",
            "required": false,
        }, 
        {
            "paramName": "attributes[index].attribute.dictionaryId",
            "paramType": "integer[int32]",
            "description": "Идентификатор справочника",
            "required": true,
        }, // DictionaryAttribute end
        {
            "paramName": "attributes[index].parentDictAttrId",
            "paramType": "integer",
            "description": "Идентификатор справочного атрибута, который содержит элементы более высокого уровня иерархии. При заполнении атрибута будет ограничиваться список элементов, связанных с элементом родительского справочника.",
            "required": false,
        },
        {
            "paramName": "attributes[index].refColDictTechName",
            "paramType": "string",
            "description": "Указывает значения какого атрибута будут использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict",
            "paramType": "object",
            "description": "Атрибут справочника, который будет использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict.techName",
            "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
            "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict.rusName",
            "paramType": "string",
            "description": "Русскоязычное название столбца",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDictTechName",
            "paramType": "string",
            "description": "Позволяет выбрать атрибут справочника, который будет отображаться в каталоге. По умолчанию поле \"Наименование\".",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict",
            "paramType": "object",
            "description": "Атрибут справочника, который будет отображаться в каталоге.",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.techName",
            "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
            "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.rusName",
            "paramType": "string",
            "description": "Русскоязычное название столбца",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.sort",
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
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "required": false,
        }, // ConstructorBlockPackage start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.packTechName",
            "paramType": "string",
            "description": "Технологическое наименование пакета, который должен выполниться в данном блоке.",
            "required": false,
        }, // ConstructorBlockPackage end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "required": false,
        }, // ConstructorBlockCondition start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.condition",
            "paramType": "string",
            "description": "Условие проверки значений атрибутов. Cинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.uniqAttr",
            "paramType": "string",
            "description": "Технологическое наименование атрибута каталога, для которого будет производиться проверка уникальности в рамках исполнения блока.\nАтрибут прописывается как и в настройках условий - attr.{techName}\nМожно указать атрибуты всех типов данных, кроме типов: таблица, файл, флаг. Указывается непосредственно корневой атрибут.",
            "required": false,
        }, // ConstructorBlockCondition end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "required": false,
        }, // ConstructorBlockNotice start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.message",
            "paramType": "string",
            "description": "В блоке \"notice\":\nТекст уведомления, который должен получить пользователь/система при работе с объектом каталога.",
            "required": false,
        }, // ConstructorBlockNotice end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "required": false,
        }, // ConstructorBlockEmail start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.message",
            "paramType": "string",
            "description": "Текст письма, который должен быть отправлен на указанный адрес электронной почты при выполнении блока.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.email",
            "paramType": "string",
            "description": "Адрес электронной почты, на который должно быть отправлено письмо при выполнении блока.",
            "required": false,
        }, // ConstructorBlockEmail end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "required": false,
        }, // ConstructorBlockAutochange start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.condition",
            "paramType": "string",
            "description": "Условие при выполнении, которого будет происходит заполнение атрибутов. В условии можно использовать атрибуты любого типа, включая системные.\nCинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.markObjDelete",
            "paramType": "boolean",
            "description": "Позволяет после изменения значений в атрибутах пометить объект как удаленный.\nДанное свойство может быть true, только в случае, если в режиме работы пакета указан фоновый процесс event = \"background\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
            "paramType": "array[object]",
            "description": "Список сопоставления атрибутов каталога и значений, которые должны подставиться в рамках выполнения автоизменения.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
            "paramType": "string",
            "description": "Атрибут каталога, которому необходимо присвоить значение автоизменением.\nУказывается в формате attr.{techName}\nВозможно указать все типы атрибутов, кроме: файл, ссылка на объект, таблица.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
            "paramType": "string",
            "description": "Значение, которое будет подставляться в указанный атрибут.\nДоступен ввод конкретного значения в формате строки. Если в catalogAttr указан атрибут с типом:\n- \"Строка\", \"Целое число\", \"Дробное число\", \"Дата\", то в value указывается значение в кавычках, далее на стороне сервиса эти значения будут преобразованы к типу данных атрибута.\n- \"Флаг\", то в value указывается значение в кавычках 1 или 0, true или false.\n- \"Справочник\", то в value передаётся в кавычках идентификатор значения из справочника этого атрибута.\nТакже для всех вышеперечисленных типов атрибутов можно указать в value функцию, описанную в пакете, в виде func.{tagId}",
            "required": false,
        }, // ConstructorBlockAutochange end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "required": false,
        }, // ConstructorBlockAutofill start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.refValue",
            "paramType": "string",
            "description": "Значение для сопоставления со справочником",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.dictId",
            "paramType": "integer",
            "description": "Идентификатор справочника, с которым сопоставляется значение",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.dictAttr",
            "paramType": "string",
            "description": "Столбец справочника, по которому производится сопоставление в формате dictAttr.{techName}",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.caseSensitive",
            "paramType": "boolean",
            "description": "Учитывать ли регистр значения при сопоставлении со справочником\n\nЕсли не указан, то сравнение выполняется без учета регистра",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.allowManualInput",
            "paramType": "boolean",
            "description": "Признак позволяющий пользователю при работе с объектам указывать значение не из справочника, для атрибута, который участвует в сопоставлении со справочным.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
            "paramType": "array[object]",
            "description": "Список сопоставления атрибутов каталога и атрибутов справочника.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
            "paramType": "string",
            "description": "Атрибут каталога, которому необходимо присвоить значение автозаполнением.\nУказывается в формате attr.{techName}\nВозможно указать только атрибуты, имеющие свойство \"Изменяемый системой\" (isSystemModify: true).\nТакими атрибутами могут быть все типы атрибутов, кроме: файл, таблица.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
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
        },
        {
            "paramName": "constructor[index].jsonFormat.functions[index].varables[index].func",
            "paramType": "string",
            "description": "Тело функции-переменной. Cинтаксис описания функций подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
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
  "inputParams": []
},
{
  "path": "/catalogs",
  "method": "delete",
  "methodDesc": "Отметка каталога удалённым",
  "responses": {
      "description": "Успешный ответ",
      "schema": []
  },
  "requests": {
      "description": "No description",
      "paramName": "No param name",
      "paramType": "No param type",
      "required": false,
      "schema": []
  },
  "inputParams": [
      {
          "paramName": "catalogIds",
          "paramIn": "query",
          "paramType": "array[integer]",
          "description": "Массив идентификаторов каталогов.\n\nЧисло элементов в списке от `1` до `100`.",
          "required": true,
      }
  ]
},
{
  "path": "/catalogs/{catalogId}",
  "method": "put",
  "methodDesc": "Изменение настроек каталога заполнения",
  "responses": {
      "description": "Успешный ответ",
      "schema": []
  },
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
            "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramType": "integer(int32)",
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
              "paramName": "attributes[index] Вариант 1",
              "paramType": "attributes[index] Вариант 1",
              "description": "attributes[index] Вариант 1",
              "required": false,
          }, // StringFillingCatalogAttribute start
          {
              "paramName": "attributes[index]",
              "paramType": "object",
              "description": "Строковый атрибут каталога заполнения",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute",
              "paramType": "object",
              "description": "Информация об атрибуте ЕХД",
              "required": true,
          }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start
          {
              "paramName": "attributes[index].attribute.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.techName",
              "paramType": "string",
              "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.rusName",
              "paramType": "string",
              "description": "Русскоязычное наименование атрибута, должно быть уникальным",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.enName",
              "paramType": "string",
              "description": "Англоязычное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.description",
              "paramType": "string",
              "description": "Описание атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.type",
              "paramType": "object",
              "description": "Тип атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.name",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index]",
              "paramType": "array[object]",
              "description": "Альтернативные названия атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
              "paramType": "string",
              "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
              "paramType": "string",
              "description": "Англоязычное альтернативное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута ЕХД",
              "required": true,
          },
          {
              "paramName": "attributes[index].catalogAttrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута каталога",
              "required": true,
          },
          {
              "paramName": "attributes[index].selectedAlterNameId",
              "paramType": "integer",
              "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
              "required": false,
          },
          {
              "paramName": "attributes[index].order",
              "paramType": "integer",
              "description": "Порядковый номер атрибута в каталоге",
              "required": true,
          },
          {
              "paramName": "attributes[index].isMain",
              "paramType": "boolean",
              "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
              "required": true,
          }, // CommonFillingCatalogAttribute end //CommonCatalogAttribute end
          {
              "paramName": "attributes[index].isReq",
              "paramType": "boolean",
              "description": "Свойство обязательности атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].isUniq",
              "paramType": "boolean",
              "description": "Свойство уникальности значения атрибута",
              "required": true,
          }, 
          {
              "paramName": "attributes[index].isUniqWithinParent",
              "paramType": "boolean",
              "description": "Признак, что уникальность значений атрибутов внутри табличного атрибута будет проверятся в рамках объекта-родителя.",
              "required": true,
          },
          {
              "paramName": "attributes[index].isBanEdit",
              "paramType": "boolean",
              "description": "Свойство запрета на редактирование",
              "required": true,
          },
          {
              "paramName": "attributes[index].isSystemModify",
              "paramType": "boolean",
              "description": "Свойство, что значение атрибута изменяется системой",
              "required": true,
          },
          {
              "paramName": "attributes[index].objOperatingMode",
              "paramType": "string[\ncreateObj,\nupdateObj,\ndeleteObj\n]",
              "description": "Режим работы с объектом, при котором доступно изменение значений атрибута:\n  - `createObj` - только при создании,\n  - `updateObj` - при редактировании (в т.ч. создании),\n  - `deleteObj` - при удалении.",
              "required": true,
          }, // FillingCatalogOperatingModeTagIdEnum full
          {
              "paramName": "attributes[index].oivs[index]",
              "paramType": "array[object]",
              "description": "Список ОИВ, ответственных за значение, содержащееся в атрибуте",
              "required": true,
          }, // CommonOivInfo start
          {
              "paramName": "attributes[index].oivs[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор ОИВа",
              "required": true,
          },
          {
              "paramName": "attributes[index].oivs[index].name",
              "paramType": "string",
              "description": "Наименование ОИВа",
              "required": true,
          }, // CommonOivInfo end
          {
              "paramName": "attributes[index].oivsIds",
              "paramType": "array[integer]",
              "description": "Список идентификаторов ОИВ, ответственных за значение, содержащееся в атрибуте",
              "required": true,
          },
          {
              "paramName": "attributes[index].isManualInput",
              "paramType": "boolean",
              "description": "Настроено ли на этот атрибут заполнение значениями не из справочника (ручной ввод) в блоках Автозаполнения конструктора",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index]",
              "paramType": "array[object]",
              "description": "Массив атрибутов, значение которых зависит от заполнения данного атрибута при автозаполнении.\nОписываются в блоке `Автозаполнение` конструктора в массиве [[blocks.properties.mapping]].\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута в ЕХД",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].isDependent",
              "paramType": "boolean",
              "description": "Является ли атрибут зависимым в рамках ручного ввода",
              "required": false,
          },
          {
              "paramName": "attributes[index].manualInputTargets[index].manualInputSources[index]",
              "paramType": "array[integer[int32]]",
              "description": "Массив идентификаторов атрибутов, от значения которых зависит значение данного атрибута при Автозаполнении.\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
              "required": false,
          }, // CommonFillingCatalogAttribute end
          {
              "paramName": "attributes[index].defaultValue",
              "paramType": "string",
              "description": "Значение атрибута по умолчанию",
              "required": false,
          }, // CommonCatalogAttributeWithDefaultValue full
          {
              "paramName": "attributes[index].maxLength",
              "paramType": "integer",
              "description": "Максимальная длина строкового значения",
              "required": true,
          }, // StringFillingCatalogAttribute end
          {
            "paramName": "attributes[index] Вариант 2",
            "paramType": "attributes[index] Вариант 2",
            "description": "attributes[index] Вариант 2",
            "required": false,
          }, // DictFillingCatalogAttribute start
          {
            "paramName": "attributes[index] Вариант 2",
            "paramType": "attributes[index] Вариант 2",
            "description": "attributes[index] Вариант 2",
            "required": false,
          },
          {
              "paramName": "attributes[index].attribute",
              "paramType": "object",
              "description": "Информация об атрибуте ЕХД",
              "required": true,
          }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start DictionaryAttribute start
          {
              "paramName": "attributes[index].attribute.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.techName",
              "paramType": "string",
              "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.rusName",
              "paramType": "string",
              "description": "Русскоязычное наименование атрибута, должно быть уникальным",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.enName",
              "paramType": "string",
              "description": "Англоязычное наименование атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.description",
              "paramType": "string",
              "description": "Описание атрибута",
              "required": false,
          }, // CommonAttributeInfo end
          {
              "paramName": "attributes[index].attribute.type",
              "paramType": "object",
              "description": "Тип атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.id",
              "paramType": "integer[int32]",
              "description": "Идентификатор типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.name",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string",
              "description": "Наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.type.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.typeTag",
              "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
              "description": "Техническое наименование типа атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index]",
              "paramType": "array[object]",
              "description": "Альтернативные названия атрибута",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].id",
              "paramType": "integer[int32]",
              "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
              "paramType": "string",
              "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
              "required": true,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
              "paramType": "string",
              "description": "Англоязычное альтернативное наименование атрибута",
              "required": true,
          }, // CommonAttribute end
          {
              "paramName": "attributes[index].attrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута ЕХД",
              "required": true,
          },
          {
              "paramName": "attributes[index].catalogAttrId",
              "paramType": "integer",
              "description": "Идентификатор атрибута каталога",
              "required": true,
          },
          {
              "paramName": "attributes[index].selectedAlterNameId",
              "paramType": "integer",
              "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
              "required": false,
          },
          {
              "paramName": "attributes[index].order",
              "paramType": "integer",
              "description": "Порядковый номер атрибута в каталоге",
              "required": true,
          },
          {
              "paramName": "attributes[index].isMain",
              "paramType": "boolean",
              "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
              "required": true,
          }, // CommonFillingCatalogAttribute end // CommonCatalogAttribute end
          {
              "paramName": "attributes[index].isMultiple",
              "paramType": "boolean",
              "description": "Указывает, что атрибут может содержать несколько значений одновременно",
              "required": true,
          }, // CommonCatalogAttributeWithMultipleValues start
          {
              "paramName": "attributes[index].maxCntElement",
              "paramType": "integer",
              "description": "Максимально допустимое количество элементов, которое возможно добавить в рамках атрибута",
              "required": false,
          },
          {
              "paramName": "attributes[index].minCntElement",
              "paramType": "integer",
              "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
              "required": false,
          }, // CommonCatalogAttributeWithMultipleValues end
          {
              "paramName": "attributes[index].attribute",
              "paramType": "integer",
              "description": "Минимальное количество элементов, которое должно быть добавлено в атрибут",
              "required": false,
          },
          {
            "paramName": "attributes[index].attribute",
            "paramType": "object",
            "description": "Информация об атрибуте ЕХД",
            "required": true,
        }, // CommonFillingCatalogAttribute start CommonCatalogAttribute start CommonAttributeInfo start CommonAttribute start
        {
            "paramName": "attributes[index].attribute.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.techName",
            "paramType": "string",
            "description": "Техническое наименование атрибута, не может иметь значение \"id\"",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.rusName",
            "paramType": "string",
            "description": "Русскоязычное наименование атрибута, должно быть уникальным",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.enName",
            "paramType": "string",
            "description": "Англоязычное наименование атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.description",
            "paramType": "string",
            "description": "Описание атрибута",
            "required": false,
        }, // CommonAttributeInfo end
        {
            "paramName": "attributes[index].attribute.type",
            "paramType": "object",
            "description": "Тип атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.name",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.typeTag",
            "paramType": "string",
            "description": "Наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.type.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": false,
        },
        {
            "paramName": "attributes[index].attribute.typeTag",
            "paramType": "string[\nSTRING,\nNUMBER,\nDATE,\nDICTIONARY,\nCATALOG,\nFLAG,\nFILE,\nLINK\n]",
            "description": "Техническое наименование типа атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index]",
            "paramType": "array[object]",
            "description": "Альтернативные названия атрибута",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].id",
            "paramType": "integer[int32]",
            "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название.",
            "required": false,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].rusAlterName",
            "paramType": "string",
            "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.alterNames[index].enAlterName",
            "paramType": "string",
            "description": "Англоязычное альтернативное наименование атрибута",
            "required": true,
        }, // CommonAttribute end
        {
            "paramName": "attributes[index].attribute.dictionary",
            "paramType": "object",
            "description": "Информация о справочнике в справочном атрибуте",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.id",
            "paramType": "integer[int32]",
            "description": "Идентификатор справочника",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.name",
            "paramType": "string",
            "description": "Наименование справочника",
            "required": true,
        },
        {
            "paramName": "attributes[index].attribute.dictionary.parentId",
            "paramType": "integer",
            "description": "Идентификатор справочника-родителя",
            "required": false,
        }, 
        {
            "paramName": "attributes[index].attribute.dictionaryId",
            "paramType": "integer[int32]",
            "description": "Идентификатор справочника",
            "required": true,
        }, // DictionaryAttribute end
        {
            "paramName": "attributes[index].parentDictAttrId",
            "paramType": "integer",
            "description": "Идентификатор справочного атрибута, который содержит элементы более высокого уровня иерархии. При заполнении атрибута будет ограничиваться список элементов, связанных с элементом родительского справочника.",
            "required": false,
        },
        {
            "paramName": "attributes[index].refColDictTechName",
            "paramType": "string",
            "description": "Указывает значения какого атрибута будут использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict",
            "paramType": "object",
            "description": "Атрибут справочника, который будет использоваться для сопоставления с объектом справочника при загрузке данных через сервис.",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict.techName",
            "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
            "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
            "required": true,
        },
        {
            "paramName": "attributes[index].refColDict.rusName",
            "paramType": "string",
            "description": "Русскоязычное название столбца",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDictTechName",
            "paramType": "string",
            "description": "Позволяет выбрать атрибут справочника, который будет отображаться в каталоге. По умолчанию поле \"Наименование\".",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict",
            "paramType": "object",
            "description": "Атрибут справочника, который будет отображаться в каталоге.",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.techName",
            "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
            "description": "Техническое название столбца определенного формата.\nНазвание может содержать английские буквы, цифры и символы нижнего подчеркивания _. Должно начинаться с буквы",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.rusName",
            "paramType": "string",
            "description": "Русскоязычное название столбца",
            "required": true,
        },
        {
            "paramName": "attributes[index].defaultColDict.sort",
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
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 1",
            "required": false,
        }, // ConstructorBlockPackage start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.packTechName",
            "paramType": "string",
            "description": "Технологическое наименование пакета, который должен выполниться в данном блоке.",
            "required": false,
        }, // ConstructorBlockPackage end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 2",
            "required": false,
        }, // ConstructorBlockCondition start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.condition",
            "paramType": "string",
            "description": "Условие проверки значений атрибутов. Cинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.uniqAttr",
            "paramType": "string",
            "description": "Технологическое наименование атрибута каталога, для которого будет производиться проверка уникальности в рамках исполнения блока.\nАтрибут прописывается как и в настройках условий - attr.{techName}\nМожно указать атрибуты всех типов данных, кроме типов: таблица, файл, флаг. Указывается непосредственно корневой атрибут.",
            "required": false,
        }, // ConstructorBlockCondition end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 3",
            "required": false,
        }, // ConstructorBlockNotice start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.message",
            "paramType": "string",
            "description": "В блоке \"notice\":\nТекст уведомления, который должен получить пользователь/система при работе с объектом каталога.",
            "required": false,
        }, // ConstructorBlockNotice end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 4",
            "required": false,
        }, // ConstructorBlockEmail start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.message",
            "paramType": "string",
            "description": "Текст письма, который должен быть отправлен на указанный адрес электронной почты при выполнении блока.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.email",
            "paramType": "string",
            "description": "Адрес электронной почты, на который должно быть отправлено письмо при выполнении блока.",
            "required": false,
        }, // ConstructorBlockEmail end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 5",
            "required": false,
        }, // ConstructorBlockAutochange start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.condition",
            "paramType": "string",
            "description": "Условие при выполнении, которого будет происходит заполнение атрибутов. В условии можно использовать атрибуты любого типа, включая системные.\nCинтаксис условий подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.markObjDelete",
            "paramType": "boolean",
            "description": "Позволяет после изменения значений в атрибутах пометить объект как удаленный.\nДанное свойство может быть true, только в случае, если в режиме работы пакета указан фоновый процесс event = \"background\".",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
            "paramType": "array[object]",
            "description": "Список сопоставления атрибутов каталога и значений, которые должны подставиться в рамках выполнения автоизменения.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
            "paramType": "string",
            "description": "Атрибут каталога, которому необходимо присвоить значение автоизменением.\nУказывается в формате attr.{techName}\nВозможно указать все типы атрибутов, кроме: файл, ссылка на объект, таблица.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
            "paramType": "string",
            "description": "Значение, которое будет подставляться в указанный атрибут.\nДоступен ввод конкретного значения в формате строки. Если в catalogAttr указан атрибут с типом:\n- \"Строка\", \"Целое число\", \"Дробное число\", \"Дата\", то в value указывается значение в кавычках, далее на стороне сервиса эти значения будут преобразованы к типу данных атрибута.\n- \"Флаг\", то в value указывается значение в кавычках 1 или 0, true или false.\n- \"Справочник\", то в value передаётся в кавычках идентификатор значения из справочника этого атрибута.\nТакже для всех вышеперечисленных типов атрибутов можно указать в value функцию, описанную в пакете, в виде func.{tagId}",
            "required": false,
        }, // ConstructorBlockAutochange end
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "paramType": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "description": "constructor[index].jsonFormat.blocks[index].properties Вариант 6",
            "required": false,
        }, // ConstructorBlockAutofill start
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.refValue",
            "paramType": "string",
            "description": "Значение для сопоставления со справочником",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.dictId",
            "paramType": "integer",
            "description": "Идентификатор справочника, с которым сопоставляется значение",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.dictAttr",
            "paramType": "string",
            "description": "Столбец справочника, по которому производится сопоставление в формате dictAttr.{techName}",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.caseSensitive",
            "paramType": "boolean",
            "description": "Учитывать ли регистр значения при сопоставлении со справочником\n\nЕсли не указан, то сравнение выполняется без учета регистра",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.allowManualInput",
            "paramType": "boolean",
            "description": "Признак позволяющий пользователю при работе с объектам указывать значение не из справочника, для атрибута, который участвует в сопоставлении со справочным.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index]",
            "paramType": "array[object]",
            "description": "Список сопоставления атрибутов каталога и атрибутов справочника.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].catalogAttr",
            "paramType": "string",
            "description": "Атрибут каталога, которому необходимо присвоить значение автозаполнением.\nУказывается в формате attr.{techName}\nВозможно указать только атрибуты, имеющие свойство \"Изменяемый системой\" (isSystemModify: true).\nТакими атрибутами могут быть все типы атрибутов, кроме: файл, таблица.",
            "required": false,
        },
        {
            "paramName": "constructor[index].jsonFormat.blocks[index].properties.mapping[index].value",
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
        },
        {
            "paramName": "constructor[index].jsonFormat.functions[index].varables[index].func",
            "paramType": "string",
            "description": "Тело функции-переменной. Cинтаксис описания функций подробно описан в статье в вики в разделе \"Конструктор процессов\".",
            "required": false,
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
  "inputParams": [
      {
          "paramName": "catalogId",
          "paramIn": "path",
          "paramType": "integer",
          "description": "Идентификатор сборного каталога.",
          "required": true,
          "schema": {
              "description": "Primitive param description",
              "paramName": "primitive param name",
              "paramType": "integer"
          }
      }
  ]
},
]