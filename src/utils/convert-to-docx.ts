import { Paragraph, TextRun } from 'docx'

export function convertToDocxContent(data: unknown, depth: number = 0): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const indent = depth * 40 // 40 points per level of indentation

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        paragraphs.push(
          new Paragraph({
            indent: { left: indent },
            children: [new TextRun(`${index + 1}.`)]
          })
        )
        paragraphs.push(...convertToDocxContent(item, depth + 1))
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

  return paragraphs
}

