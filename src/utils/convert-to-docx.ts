import { parseData, ParsedParam } from '@/lib/utils'
import { Paragraph, Table, TableCell, TableRow, WidthType } from 'docx'
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;
type ParsedData = ReturnType<typeof parseData>
type InputParams =  ElementType<ParsedData>['inputParams']
type ParsedResponses =  ElementType<ParsedData>['responses']
const parseParamsToTable = (params: InputParams) => params?.flatMap(param => true ? [new TableRow({
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
          text: param?.paramType
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
    // @ts-expect-error just for build
})] : parseParams(param)) ?? []
const parseParams = (parsedParams: Exclude<ParsedResponses['schema'], ParsedParam>): TableRow[] => parsedParams.flatMap(param => {
  // @ts-expect-error just for build
  if(!param.schema || !Array.isArray(param.schema)) {
    return [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: param.paramName
              })
            ],
            width: { size: 4000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: param.description
              })
            ],
            width: { size: 4500, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: param.paramType ?? 'Нет схемы'
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
      })
    ]
  } else {
    // @ts-expect-error just for build
    return parseParams(param.schema);
  }
})

const parseResponses = (responses: ParsedResponses): TableRow[] => {
  if(!Array.isArray(responses.schema)) {    
    return [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ // @ts-expect-error just for build
                text: responses.paramName
              })
            ],
            width: { size: 3500, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'description' in responses ? responses.description : 'Нет описания'
              })
            ],
            width: { size: 3500, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({ // @ts-expect-error just for build
                text: responses.paramType ?? responses.schema?.paramType ?? 'Нет схемы'
              })
            ],
            width: { size: 2000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({ // @ts-expect-error just for build
                text: responses.required ? 'Да' : 'Нет'
              })
            ],
            width: { size: 1000, type: WidthType.DXA },
          }),
        ],
      })
    ]
  } else {
    // console.log('responses', responses);
    return parseParams(responses.schema);
  }
}
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
          new Paragraph({
            text: `${index + 1} - ${item.path}`,
            heading: 'Heading3'
          })
        )
        paragraphs.push(
          new Paragraph({
            text: 'Основные сведения',
            heading: 'Heading5'
          })
        )
        paragraphs.push(
          new Table({
            columnWidths: [3000, 7000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Назначение'
                      })
                    ],
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.methodDesc ?? 'Нет описания метода'
                      })
                    ],
                    width: { size: 7000, type: WidthType.DXA },
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
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.method ?? 'Неизвестный метод'
                      })
                    ],
                    width: { size: 7000, type: WidthType.DXA },
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
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: item.path ?? 'Неизвестный адрес'
                      })
                    ],
                    width: { size: 7000, type: WidthType.DXA },
                  }),                  
                ],
              }),
            ],
          })
        )
        paragraphs.push(new Paragraph({}))
        paragraphs.push(
          new Paragraph({
            text: 'Входные параметры',
            heading: 'Heading5'
          })
        )
        paragraphs.push(
          new Table({
            columnWidths: [3000, 2500, 2500, 1000, 1000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Параметр'
                      })
                    ],
                    width: { size: 3000, type: WidthType.DXA },
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
                    width: { size: 1000, type: WidthType.DXA },
                  }),
                ],
              }),
              ...parseParamsToTable(item.inputParams)
            ],
          }),
        )
        paragraphs.push(new Paragraph({}))
        paragraphs.push(
          new Paragraph({
            text: 'Описание запроса',
            heading: 'Heading5'
          })
        )
        // paragraphs.push(...convertToDocxContent(item, depth + 1))
        paragraphs.push(
          new Table({
            columnWidths: [3500, 3500, 2000, 1000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Параметр'
                      })
                    ],
                    width: { size: 3500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Описание'
                      })
                    ],
                    width: { size: 3500, type: WidthType.DXA },
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
                        text: 'Обязательность'
                      })
                    ],
                    width: { size: 1000, type: WidthType.DXA },
                  }),
                ],
              }),
              ...parseResponses(item.requests),
            ],
          }),
        )
        paragraphs.push(new Paragraph({}))
        paragraphs.push(
          new Paragraph({
            text: 'Описание ответа',
            heading: 'Heading5'
          })
        )
        // paragraphs.push(...convertToDocxContent(item, depth + 1))
        paragraphs.push(
          new Table({
            columnWidths: [3500, 3500, 2000, 1000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Параметр'
                      })
                    ],
                    width: { size: 3500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Описание'
                      })
                    ],
                    width: { size: 3500, type: WidthType.DXA },
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
                        text: 'Обязательность'
                      })
                    ],
                    width: { size: 1000, type: WidthType.DXA },
                  }),
                ],
              }),
              ...parseResponses(item.responses),
            ],
          }),
        )
        paragraphs.push(new Paragraph({}))
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

