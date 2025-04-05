import { parseData } from '@/lib/utils'
import { convertToDocxContent } from '@/utils/convert-to-docx'
import { Document, Packer } from 'docx'
import yaml from 'js-yaml'

export async function POST(request: Request) {
  const { text, type } = await request.json()
  let data
  console.log('text', text);
  
  if (type === 'json') {
    data = JSON.parse(text)
  } else if (type === 'yaml') {
    data = yaml.load(text)     
  } else {
    return Response.json('NOT OK')
  }
  const parsedData = parseData(data)      

  const doc = new Document({
    sections: [{
      properties: {},
      children: convertToDocxContent(parsedData)
    }]
  })

  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  return new Response(blob)
}