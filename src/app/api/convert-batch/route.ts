import { parseData } from '@/lib/utils'
// import { convertToDocxContent } from '@/utils/convert-to-docx'
// import { Document, Packer } from 'docx'
import yaml from 'js-yaml'

export async function POST(request: Request) {
  const body = await request.json()
  
  const res = body.map((data: { type: string, text: string }) => {
    if (data.type === 'json') {
      return parseData(JSON.parse(data.text))
    } else if (data.type === 'yaml') { // @ts-expect-error idk
      return parseData(yaml.load(data.text))     
    }
    return ''
    
  })
  return Response.json(res)
  // const doc = new Document({
  //   sections: [{
  //     properties: {},
  //     children: convertToDocxContent(parsedData)
  //   }]
  // })

  // const buffer = await Packer.toBuffer(doc)
  // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  // return new Response(blob)
}