import { parseData } from '@/lib/utils'
import { Paragraph, Table, TableCell, TableRow, WidthType } from 'docx'
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;
type ParsedData = ReturnType<typeof parseData>
type InputParams =  ElementType<ParsedData>['inputParams']
type ParsedResponses =  ElementType<ParsedData>['responses']
const parseParamsToTable = (params: InputParams) => params?.flatMap(param => typeof param.schema === 'string' ? [new TableRow({
  children: [
    new TableCell({
      children: [
        new Paragraph({
          text: param.paramName
        })
      ],
      width: { size: 1500, type: WidthType.DXA },
    }),
    new TableCell({
      children: [
        new Paragraph({
          text: param.description
        })
      ],
      width: { size: 5000, type: WidthType.DXA },
    }),                  
    new TableCell({
      children: [
        new Paragraph({
          text: param.schema
        })
      ],
      width: { size: 2000, type: WidthType.DXA },
    }),                  
    new TableCell({
      children: [
        new Paragraph({
          text: param.paramType
        })
      ],
      width: { size: 1000, type: WidthType.DXA },
    }),                  
    new TableCell({
      children: [
        new Paragraph({
          text: param.required ? 'Да' : 'Нет'
        })
      ],
      width: { size: 500, type: WidthType.DXA },
    }),
  ],
})] : [

]) ?? []
const parseParams = (parsedParams: Exclude<ParsedResponses['schema'], string>): TableRow[] => parsedParams.flatMap(param => !param.schema || typeof param.schema === 'string' ? [
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: param.paramName
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: param.description
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),                  
      new TableCell({
        children: [
          new Paragraph({
            text: param.schema ?? 'Нет схемы'
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),                  
      new TableCell({
        children: [
          new Paragraph({
            text: param.required ? 'Да' : 'Нет'
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),
    ],
  })
] : parseParams(param.schema))
const parseResponses = (responses: ParsedResponses): TableRow[] => typeof responses.schema === 'string' ? [
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: 'prop.name'
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: 'description' in responses ? responses.description : 'Нет описания'
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),                  
      new TableCell({
        children: [
          new Paragraph({
            text: responses.schema
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),                  
      new TableCell({
        children: [
          new Paragraph({
            text: 'prop.required'
          })
        ],
        width: { size: 2500, type: WidthType.DXA },
      }),
    ],
  })
] : parseParams(responses.schema)
export function convertToDocxContent(
  data: ParsedData, 
  // depth: number = 0
): Paragraph[] {
  const paragraphs: unknown[] = []
  // const indent = depth * 40 // 40 points per level of indentation

  if (Array.isArray(data)) {
    // data.forEach((item, index) => {
    //   if (typeof item === 'object' && item !== null) {
    //     paragraphs.push(
    //       new Paragraph({
    //         indent: { left: indent },
    //         children: [new TextRun(`${index + 1}.`)]
    //       })
    //     )
    //     paragraphs.push(...convertToDocxContent(item, depth + 1))
    //   } else {
    //     paragraphs.push(
    //       new Paragraph({
    //         indent: { left: indent },
    //         children: [new TextRun(`${index + 1}. ${item}`)]
    //       })
    //     )
    //   }
    // })    
    data.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        paragraphs.push(
          new Paragraph(`${index + 1} - ${item.path}`)
        )
        paragraphs.push(
          new Paragraph('Основные сведения')
        )
        paragraphs.push(
          new Table({
            columnWidths: [2500, 5000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Назначение'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.methodDesc ?? 'Нет описания метода'
                      })
                    ],
                    width: { size: 5000, type: WidthType.DXA },
                  }),                  
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Метод'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.method ?? 'Неизвестный метод'
                      })
                    ],
                    width: { size: 5000, type: WidthType.DXA },
                  }),                  
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Адрес'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.path ?? 'Неизвестный адрес'
                      })
                    ],
                    width: { size: 5000, type: WidthType.DXA },
                  }),                  
                ],
              }),
            ],
          })
        )
        paragraphs.push(
          new Paragraph('Входные параметры')
        )
        paragraphs.push(
          new Table({
            columnWidths: [1500, 5000, 2000, 1000, 500],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Параметр'
                      })
                    ],
                    width: { size: 1500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Описание'
                      })
                    ],
                    width: { size: 5000, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Тип данных'
                      })
                    ],
                    width: { size: 2000, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Тип параметра'
                      })
                    ],
                    width: { size: 1000, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Обязательность'
                      })
                    ],
                    width: { size: 500, type: WidthType.DXA },
                  }),
                ],
              }),
              ...parseParamsToTable(item.inputParams)
            ],
          }),
        )
        paragraphs.push(
          new Paragraph('Описание объекта')
        )
        // paragraphs.push(...convertToDocxContent(item, depth + 1))
        paragraphs.push(
          new Table({
            columnWidths: [2500, 2500, 2500, 2500],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Параметр'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Описание'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Тип данных'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Обязательность'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                ],
              }),
              ...parseResponses(item.responses),
              // ...item.responses.map(prop => new TableRow({
              //   children: [
              //     new TableCell({
              //       children: [
              //         new Paragraph({
              //           text: 'prop.name'
              //         })
              //       ],
              //       width: { size: 2500, type: WidthType.DXA },
              //     }),
              //     new TableCell({
              //       children: [
              //         new Paragraph({
              //           text: 'prop.description'
              //         })
              //       ],
              //       width: { size: 2500, type: WidthType.DXA },
              //     }),                  
              //     new TableCell({
              //       children: [
              //         new Paragraph({
              //           text: prop.type
              //         })
              //       ],
              //       width: { size: 2500, type: WidthType.DXA },
              //     }),                  
              //     new TableCell({
              //       children: [
              //         new Paragraph({
              //           text: prop.required ? 'Да' : 'Нет'
              //         })
              //       ],
              //       width: { size: 2500, type: WidthType.DXA },
              //     }),
              //   ],
              // }))
            ],
          }),
        )
      } else {
        // paragraphs.push(
        //   new Paragraph({
        //     indent: { left: indent },
        //     children: [new TextRun(`${index + 1}. ${item}`)]
        //   })
        // )
      }
    })
  } else if (typeof data === 'object' && data !== null) {
    // Object.entries(data).forEach(([key, value]) => {
    //   if (typeof value === 'object' && value !== null) {
    //     paragraphs.push(
    //       new Paragraph({
    //         indent: { left: indent },
    //         children: [new TextRun({ text: key, bold: true })]
    //       })
    //     )
    //     paragraphs.push(...convertToDocxContent(value, depth + 1))
    //   } else {
    //     paragraphs.push(
    //       new Paragraph({
    //         indent: { left: indent },
    //         children: [
    //           new TextRun({ text: `${key}: `, bold: true }),
    //           new TextRun(String(value))
    //         ]
    //       })
    //     )
    //   }
    // })
  } else {
    // paragraphs.push(
    //   new Paragraph({
    //     indent: { left: indent },
    //     children: [new TextRun(String(data))]
    //   })
    // )
  }

  return paragraphs as Paragraph[]
}

