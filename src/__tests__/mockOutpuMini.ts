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
      "schema": []
  },
  "requests": {
      "schema": [
          {
              "paramName": "generalInfo",
              "paramType": "object",
              "description": "Настройки вкладки \"Общая информация\" каталога заполнения",
              "required": true,
          }, // expand
          {
              "paramName": "attributes[index]",
              "paramType": "array[StringFillingCatalogAttribute,IntegerFillingCatalogAttribute,FloatFillingCatalogAttribute,DateFillingCatalogAttribute,BooleanFillingCatalogAttribute,FileFillingCatalogAttribute,DictFillingCatalogAttribute,LinkFillingCatalogAttribute,TableFillingCatalogAttribute]",
              "description": "Атрибут каталога заполнения",
              "required": false,
          },
          {
              "paramName": "meta",
              "paramType": "object",
              "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
              "required": false,
          },
          {
              "paramName": "constructor[index]",
              "paramType": "array[ConstructorPackageData]",
              "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
              "required": false,
          },
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
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index]",
              "paramType": "array[object]",
              "description": "Массив групп атрибутов",
              "required": true,
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index].groupTechName",
              "paramType": "string[^[a-zA-Z][_a-zA-Z0-9]*$]",
              "description": "Технологическое наименование группы атрибутов. Должно быть уникально в рамках групп одного каталога.",
              "required": true,
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index].groupName",
              "paramType": "string",
              "description": "Пользовательское наименование группы атрибутов.",
              "required": false,
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index].applyTableAttr",
              "paramType": "string",
              "description": "Группа атрибутов настраивается из табличного атрибута и применяется ко всему вложенному каталогу. Указывается табличный атрибут в формате attr.{TableTechName1}.{TableTechName11}.{TableTechName111}.{и т.д.}. То есть указывается вся последовательность табличных атрибутов от корня до того, для которого настраивается группа.\n\nЕсли передано данное поле, то в описании блоков могут использоваться только атрибуты внутри указанной таблицы.",
              "required": false,
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index].attributes",
              "paramType": "array[string]",
              "description":  "Массив атрибутов, входящих в группу. Указываются в формате attr.{techNameAttr}",
              "required": true,
          },
          {
              "paramName": "constructor[index].jsonFormat.groups[index].condition",
              "paramType": "string",
              "description": "Условие, описанное в синтаксисе условий конструктора проверок. Доступны все типы атрибутов каталога, включая системные.",
              "required": false,
          },
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
              "description": "",
              "required": false,
          },
          {
              "paramName": "map.hasGeo",
              "paramType": "boolean",
              "description": "Наличие геопривязки в каталоге",
              "required": true,
          },
          {
              "paramName": "map.typeGeoTagIds", // PARSE CORRECTLY
              "paramType": "array[string[MultiPoint,MultiLineString,MultiPolygon]]",
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
          }
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
              "required": false,
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
          },
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
              "required": false,
          },
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
              "required": false,
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
              "required": false,
          },
          {
              "paramName": "attributes[index].attribute.alterNames[index]",
              "paramType": "array[object]",
              "description": "Альтернативные названия атрибута",
              "required": false,
          },
          "AttributeAlterName": {
            "description": "Альтернативное наименование атрибута",
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Идентификатор альтернативного наименования\n\nЕсли он передается в методе PUT, альтернативное наименование атрибута будет изменено в БД. Иначе - создается новое альтернативное название."
                },
                "rusAlterName": {
                    "type": "string",
                    "description": "Русскоязычное альтернативное наименование атрибута\n\n_Должно быть уникальным для каждого атрибута_"
                },
                "enAlterName": {
                    "description": "Англоязычное альтернативное наименование атрибута",
                    "type": "string"
                }
            },
            "required": [
                "rusAlterName",
                "enAlterName"
            ],
            "example": {
                "id": 736,
                "rusAlterName": "Муниципальный район",
                "enAlterName": "District"
            }
        },
          "CommonAttribute": {
            "description": "Атрибут.\n\nСхема включает общие для всех типов атрибутов поля.",
            "type": "object",
            "properties": {
                "alterNames": {
                    "description": "Альтернативные названия атрибута",
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/AttributeAlterName"
                    }
                }
            },
            "required": [
                "type",
                "typeTag",
                "alterNames"
            ]
        },
          "CommonCatalogAttribute": {
            "description": "Общая информация об атрибуте каталога",
            "type": "object",
            "properties": {
                "attribute": {
                    "readOnly": true,
                    "description": "Информация об атрибуте ЕХД",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "attributes.yaml#/components/schemas/CommonAttribute"
                        }
                    ]
                },
                "attrId": {
                    "writeOnly": true,
                    "description": "Идентификатор атрибута ЕХД",
                    "type": "integer"
                },
                "catalogAttrId": {
                    "description": "Идентификатор атрибута каталога",
                    "type": "integer",
                    "readOnly": true
                },
                "selectedAlterNameId": {
                    "description": "Идентификатор выбранного альтернативного наименования атрибута в каталоге",
                    "type": "integer"
                },
                "order": {
                    "description": "Порядковый номер атрибута в каталоге",
                    "type": "integer"
                },
                "isMain": {
                    "description": "Свойство, что атрибут считается главным при связывании с другими каталогами",
                    "type": "boolean"
                }
            },
            "required": [
                "attribute",
                "attrId",
                "catalogAttrId",
                "order",
                "isMain"
            ]
        },
          "CommonFillingCatalogAttribute": {
            "description": "Общая информация атрибута каталога заполнения",
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/components/schemas/CommonCatalogAttribute"
                }
            ],
            "properties": {
                "isReq": {
                    "description": "Свойство обязательности атрибута",
                    "type": "boolean"
                },
                "isUniq": {
                    "description": "Свойство уникальности значения атрибута",
                    "type": "boolean"
                },
                "isUniqWithinParent": {
                    "description": "Признак, что уникальность значений атрибутов внутри табличного атрибута будет проверятся в рамках объекта-родителя.",
                    "type": "boolean",
                    "default": false
                },
                "isBanEdit": {
                    "description": "Свойство запрета на редактирование",
                    "type": "boolean"
                },
                "isSystemModify": {
                    "description": "Свойство, что значение атрибута изменяется системой",
                    "type": "boolean"
                },
                "objOperatingMode": {
                    "$ref": "#/components/schemas/FillingCatalogOperatingModeTagIdEnum"
                },
                "oivs": {
                    "description": "Список ОИВ, ответственных за значение, содержащееся в атрибуте",
                    "type": "array",
                    "items": {
                        "$ref": "oivs.yaml#/components/schemas/CommonOivInfo"
                    },
                    "readOnly": true,
                    "minItems": 1
                },
                "oivsIds": {
                    "description": "Список идентификаторов ОИВ, ответственных за значение, содержащееся в атрибуте",
                    "type": "array",
                    "items": {
                        "type": "integer"
                    },
                    "writeOnly": true,
                    "minItems": 1
                },
                "isManualInput": {
                    "description": "Настроено ли на этот атрибут заполнение значениями не из справочника (ручной ввод) в блоках Автозаполнения конструктора",
                    "type": "boolean",
                    "readOnly": true
                },
                "manualInputTargets": {
                    "description": "Массив атрибутов, значение которых зависит от заполнения данного атрибута при автозаполнении.\nОписываются в блоке `Автозаполнение` конструктора в массиве [[blocks.properties.mapping]].\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
                    "readOnly": true,
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "attrId": {
                                "description": "Идентификатор атрибута в ЕХД",
                                "type": "integer"
                            },
                            "isDependent": {
                                "description": "Является ли атрибут зависимым в рамках ручного ввода",
                                "type": "boolean"
                            }
                        }
                    }
                },
                "manualInputSources": {
                    "description": "Массив идентификаторов атрибутов, от значения которых зависит значение данного атрибута при Автозаполнении.\n\nПоле обязательное. Если атрибутов нет, то возвращается пустой массив.",
                    "readOnly": true,
                    "type": "array",
                    "items": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "required": [
                "isReq",
                "isUniq",
                "isUniqWithinParent",
                "isBanEdit",
                "isSystemModify",
                "objOperatingMode",
                "oivs",
                "oivsIds"
            ]
        },
        "StringFillingCatalogAttribute": {
          "description": "Строковый атрибут каталога заполнения",
          "type": "object",


          "allOf": [
              {
                  "$ref": "#/components/schemas/CommonFillingCatalogAttribute"
              },
              {
                  "$ref": "#/components/schemas/CommonCatalogAttributeWithDefaultValue"
              },
              {
                  "$ref": "#/components/schemas/CommonCatalogAttributeWithFieldMask"
              },
              {
                  "$ref": "#/components/schemas/CommonCatalogAttributeWithSearchIndex"
              },
              {
                  "$ref": "#/components/schemas/CommonCatalogAttributeWithFieldRegex"
              }
          ],
          "properties": {
              "maxLength": {
                  "description": "Максимальная длина строкового значения",
                  "type": "integer"
              }
          },
          "required": [
              "maxLength"
          ]
      },
          "FillingCatalogAttribute": {
            "description": "Атрибут каталога заполнения",
            "type": "object",
            "oneOf": [
                {
                    "$ref": "#/components/schemas/StringFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/IntegerFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/FloatFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/DateFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/BooleanFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/FileFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/DictFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/LinkFillingCatalogAttribute"
                },
                {
                    "$ref": "#/components/schemas/TableFillingCatalogAttribute"
                }
            ]
        },
          {
              "paramName": "attributes[index] Вариант 1",
              "paramType": "attributes[index] Вариант 1",
              "description": "attributes[index] Вариант 1",
              "required": false,
          },

          {
              "paramName": "meta",
              "paramIn": "object",
              "paramType": "unknown param type",
              "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
              "required": false,
              "schema": {
                  "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
                  "paramName": "meta",
                  "paramIn": "object",
                  "required": false,
                  "schema": {
                      "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
                      "paramName": "meta",
                      "paramIn": "object",
                      "required": false
                  }
              }
          },
          {
              "paramName": "constructor[index]",
              "paramIn": "array",
              "paramType": "unknown param type",
              "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
              "required": false,
              "schema": {
                  "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
                  "paramName": "constructor[index]",
                  "paramIn": "array",
                  "schema": {
                      "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
                      "paramName": "constructor[index]",
                      "paramIn": "array"
                  }
              }
          },
          {
              "paramName": "constructor[index].tomlFormat",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
              "required": true,
              "schema": {
                  "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
                  "paramName": "constructor[index].tomlFormat",
                  "paramIn": "unknown param type",
                  "required": true,
                  "schema": {
                      "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
                      "paramName": "constructor[index].tomlFormat",
                      "paramIn": "unknown param type",
                      "required": true
                  }
              }
          },
          {
              "paramName": "constructor[index].jsonFormat",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
              "required": true,
              "schema": {
                  "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
                  "paramName": "constructor[index].jsonFormat",
                  "paramIn": "unknown param type",
                  "required": true,
                  "schema": {
                      "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
                      "paramName": "constructor[index].jsonFormat",
                      "paramIn": "unknown param type",
                      "required": true
                  }
              }
          },
          {
              "paramName": "conditionalUniq",
              "paramIn": "string",
              "paramType": "unknown param type",
              "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
              "required": false,
              "schema": {
                  "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
                  "paramName": "conditionalUniq",
                  "paramIn": "string",
                  "required": false,
                  "schema": {
                      "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
                      "paramName": "conditionalUniq",
                      "paramIn": "string",
                      "required": false
                  }
              }
          },
          {
              "paramName": "groupUniq",
              "paramIn": "string",
              "paramType": "unknown param type",
              "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
              "required": false,
              "schema": {
                  "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
                  "paramName": "groupUniq",
                  "paramIn": "string",
                  "required": false,
                  "schema": {
                      "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
                      "paramName": "groupUniq",
                      "paramIn": "string",
                      "required": false
                  }
              }
          },
          {
              "paramName": "map",
              "paramIn": "object",
              "paramType": "unknown param type",
              "description": "",
              "required": false,
              "schema": {
                  "description": "",
                  "paramName": "map",
                  "paramIn": "object",
                  "schema": {
                      "description": "",
                      "paramName": "map",
                      "paramIn": "object"
                  }
              }
          },
          {
              "paramName": "map.hasGeo",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Наличие геопривязки в каталоге",
              "required": true,
              "schema": {
                  "description": "Наличие геопривязки в каталоге",
                  "paramName": "map.hasGeo",
                  "paramIn": "unknown param type",
                  "required": true,
                  "schema": {
                      "description": "Наличие геопривязки в каталоге",
                      "paramName": "map.hasGeo",
                      "paramIn": "unknown param type",
                      "required": true
                  }
              }
          },
          {
              "paramName": "map.typeGeoTagIds[index]",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Типы геометрии в geojson",
              "required": false,
              "schema": {
                  "description": "Типы геометрии в geojson",
                  "paramName": "map.typeGeoTagIds[index]",
                  "paramIn": "unknown param type",
                  "required": false,
                  "schema": {
                      "description": "Типы геометрии в geojson",
                      "paramName": "map.typeGeoTagIds[index]",
                      "paramIn": "unknown param type",
                      "required": false
                  }
              }
          },
          {
              "paramName": "map.isWGS84",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
              "required": false,
              "schema": {
                  "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
                  "paramName": "map.isWGS84",
                  "paramIn": "unknown param type",
                  "required": false,
                  "schema": {
                      "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
                      "paramName": "map.isWGS84",
                      "paramIn": "unknown param type",
                      "required": false
                  }
              }
          },
          {
              "paramName": "map.isReq",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Обязательность геопривязки",
              "required": false,
              "schema": {
                  "description": "Обязательность геопривязки",
                  "paramName": "map.isReq",
                  "paramIn": "unknown param type",
                  "required": false,
                  "schema": {
                      "description": "Обязательность геопривязки",
                      "paramName": "map.isReq",
                      "paramIn": "unknown param type",
                      "required": false
                  }
              }
          },
          {
              "paramName": "map.isOneTypeGeoForObj",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
              "required": false,
              "schema": {
                  "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
                  "paramName": "map.isOneTypeGeoForObj",
                  "paramIn": "unknown param type",
                  "required": false,
                  "schema": {
                      "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
                      "paramName": "map.isOneTypeGeoForObj",
                      "paramIn": "unknown param type",
                      "required": false
                  }
              }
          },
          {
              "paramName": "map.isNotReqGeoForService",
              "paramIn": "unknown param type",
              "paramType": "unknown param type",
              "description": "Необязательность геометрии при загрузке через сервис",
              "required": false,
              "schema": {
                  "description": "Необязательность геометрии при загрузке через сервис",
                  "paramName": "map.isNotReqGeoForService",
                  "paramIn": "unknown param type",
                  "required": false,
                  "schema": {
                      "description": "Необязательность геометрии при загрузке через сервис",
                      "paramName": "map.isNotReqGeoForService",
                      "paramIn": "unknown param type",
                      "required": false
                  }
              }
          }
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
              "required": false,
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
              "required": false,
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
              "required": false,
          },
          {
              "paramName": "generalInfo.accountingObject",
              "paramType": "string",
              "description": "Объект учёта",
              "required": false,
          },
          {
              "paramName": "generalInfo.keywords",
              "paramType": "string",
              "description": "Ключевые слова",
              "required": false,
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
              "paramName": "attributes[index]",
              "paramType": "array[object]",
              "description": "Настройки вкладки \"Атрибуты\" каталога заполнения",
              "required": false,
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
          },
              {
                  "paramName": "attributes[index]",
                  "paramType": "unknown param type",
                  "description": "Атрибут каталога заполнения",
                  "required": false,
                  "schema": {
                      "description": "Атрибут каталога заполнения",
                      "paramName": "attributes[index]",
                      "paramIn": "",
                      "required": false,
                      "schema": {
                          "description": "Атрибут каталога заполнения",
                          "paramName": "attributes[index]",
                          "paramIn": "",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "meta",
                  "paramIn": "object",
                  "paramType": "unknown param type",
                  "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
                  "required": false,
                  "schema": {
                      "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
                      "paramName": "meta",
                      "paramIn": "object",
                      "required": false,
                      "schema": {
                          "description": "Настройки вкладки \"Метаданные\" каталога заполнения",
                          "paramName": "meta",
                          "paramIn": "object",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "constructor[index]",
                  "paramIn": "array",
                  "paramType": "unknown param type",
                  "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
                  "required": false,
                  "schema": {
                      "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
                      "paramName": "constructor[index]",
                      "paramIn": "array",
                      "schema": {
                          "description": "Настройки конструктора процессов. Представляет собой массив пакетов.",
                          "paramName": "constructor[index]",
                          "paramIn": "array"
                      }
                  }
              },
              {
                  "paramName": "constructor[index].tomlFormat",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
                  "required": true,
                  "schema": {
                      "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
                      "paramName": "constructor[index].tomlFormat",
                      "paramIn": "unknown param type",
                      "required": true,
                      "schema": {
                          "description": "Настройка одного пакета конструктора процессов, описанная пользователем в формате TOML.\nПередаётся в качестве строки с экранированием символов.",
                          "paramName": "constructor[index].tomlFormat",
                          "paramIn": "unknown param type",
                          "required": true
                      }
                  }
              },
              {
                  "paramName": "constructor[index].jsonFormat",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
                  "required": true,
                  "schema": {
                      "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
                      "paramName": "constructor[index].jsonFormat",
                      "paramIn": "unknown param type",
                      "required": true,
                      "schema": {
                          "description": "Настройка одного пакета конструктора процессов, преобразованная из формата TOML в JSON.\nНеобходима для обработки на стороне клиента для реализации доп. функций, помогающих пользователю при создании настройки.",
                          "paramName": "constructor[index].jsonFormat",
                          "paramIn": "unknown param type",
                          "required": true
                      }
                  }
              },
              {
                  "paramName": "conditionalUniq",
                  "paramIn": "string",
                  "paramType": "unknown param type",
                  "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
                  "required": false,
                  "schema": {
                      "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
                      "paramName": "conditionalUniq",
                      "paramIn": "string",
                      "required": false,
                      "schema": {
                          "description": "Настройки условной уникальности. Передаётся строка с условием, которое описано в формате условий, используемом в конструкторе процессов.",
                          "paramName": "conditionalUniq",
                          "paramIn": "string",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "groupUniq",
                  "paramIn": "string",
                  "paramType": "unknown param type",
                  "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
                  "required": false,
                  "schema": {
                      "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
                      "paramName": "groupUniq",
                      "paramIn": "string",
                      "required": false,
                      "schema": {
                          "description": "Настройка групповой уникальности, описанная пользователем в формате TOML. Передаётся в качестве строки с экранированием символов.",
                          "paramName": "groupUniq",
                          "paramIn": "string",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "map",
                  "paramIn": "object",
                  "paramType": "unknown param type",
                  "description": "",
                  "required": false,
                  "schema": {
                      "description": "",
                      "paramName": "map",
                      "paramIn": "object",
                      "schema": {
                          "description": "",
                          "paramName": "map",
                          "paramIn": "object"
                      }
                  }
              },
              {
                  "paramName": "map.hasGeo",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Наличие геопривязки в каталоге",
                  "required": true,
                  "schema": {
                      "description": "Наличие геопривязки в каталоге",
                      "paramName": "map.hasGeo",
                      "paramIn": "unknown param type",
                      "required": true,
                      "schema": {
                          "description": "Наличие геопривязки в каталоге",
                          "paramName": "map.hasGeo",
                          "paramIn": "unknown param type",
                          "required": true
                      }
                  }
              },
              {
                  "paramName": "map.typeGeoTagIds[index]",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Типы геометрии в geojson",
                  "required": false,
                  "schema": {
                      "description": "Типы геометрии в geojson",
                      "paramName": "map.typeGeoTagIds[index]",
                      "paramIn": "unknown param type",
                      "required": false,
                      "schema": {
                          "description": "Типы геометрии в geojson",
                          "paramName": "map.typeGeoTagIds[index]",
                          "paramIn": "unknown param type",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "map.isWGS84",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
                  "required": false,
                  "schema": {
                      "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
                      "paramName": "map.isWGS84",
                      "paramIn": "unknown param type",
                      "required": false,
                      "schema": {
                          "description": "Система координат (СК), в которой хранятся геоданные объектов каталога. Если принимает значение\n  - true, то СК - WGS84\n  - false, то СК - MSK77",
                          "paramName": "map.isWGS84",
                          "paramIn": "unknown param type",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "map.isReq",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Обязательность геопривязки",
                  "required": false,
                  "schema": {
                      "description": "Обязательность геопривязки",
                      "paramName": "map.isReq",
                      "paramIn": "unknown param type",
                      "required": false,
                      "schema": {
                          "description": "Обязательность геопривязки",
                          "paramName": "map.isReq",
                          "paramIn": "unknown param type",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "map.isOneTypeGeoForObj",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
                  "required": false,
                  "schema": {
                      "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
                      "paramName": "map.isOneTypeGeoForObj",
                      "paramIn": "unknown param type",
                      "required": false,
                      "schema": {
                          "description": "Признак, указывающий, что объект может иметь только один тип геометрии",
                          "paramName": "map.isOneTypeGeoForObj",
                          "paramIn": "unknown param type",
                          "required": false
                      }
                  }
              },
              {
                  "paramName": "map.isNotReqGeoForService",
                  "paramIn": "unknown param type",
                  "paramType": "unknown param type",
                  "description": "Необязательность геометрии при загрузке через сервис",
                  "required": false,
                  "schema": {
                      "description": "Необязательность геометрии при загрузке через сервис",
                      "paramName": "map.isNotReqGeoForService",
                      "paramIn": "unknown param type",
                      "required": false,
                      "schema": {
                          "description": "Необязательность геометрии при загрузке через сервис",
                          "paramName": "map.isNotReqGeoForService",
                          "paramIn": "unknown param type",
                          "required": false
                      }
                  }
              }
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
  }
]