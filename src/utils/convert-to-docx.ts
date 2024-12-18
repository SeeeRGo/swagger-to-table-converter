import { Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'

export function convertToDocxContent(data: unknown, depth: number = 0): Paragraph[] {
  const paragraphs: unknown[] = []
  const indent = depth * 40 // 40 points per level of indentation

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
            indent: { left: indent },
            children: [new TextRun(`Table - ${index + 1}. ${item.name}`)]
          })
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
              //@ts-expect-error typings are not for prototyping
              ...item.properties.map(prop => new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: prop.name
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: prop.description
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: prop.type
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),                  
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: prop.required ? 'Да' : 'Нет'
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                ],
              }))
            ],
          }),
        )
      } else {
        paragraphs.push(
          new Paragraph({
            indent: { left: indent },
            children: [new TextRun(`${index + 1}. ${item}`)]
          })
        )
      }
    })
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        paragraphs.push(
          new Paragraph({
            indent: { left: indent },
            children: [new TextRun({ text: key, bold: true })]
          })
        )
        paragraphs.push(...convertToDocxContent(value, depth + 1))
      } else {
        paragraphs.push(
          new Paragraph({
            indent: { left: indent },
            children: [
              new TextRun({ text: `${key}: `, bold: true }),
              new TextRun(String(value))
            ]
          })
        )
      }
    })
  } else {
    paragraphs.push(
      new Paragraph({
        indent: { left: indent },
        children: [new TextRun(String(data))]
      })
    )
  }

  return paragraphs as Paragraph[]
}

