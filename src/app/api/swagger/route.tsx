import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import yaml from 'js-yaml'

const websiteURL = 'https://spec.scrudge.answer-42.ru';
// const downloadFolder = './downloads';

// // Ensure the downloads folder exists
// if (!fs.existsSync(downloadFolder)) {
//     fs.mkdirSync(downloadFolder);
// }
const deepMerge = (a: any, b: any, fn: any) =>
    [...new Set([...Object.keys(a), ...Object.keys(b)])].reduce(
      (acc, key) => ({ ...acc, [key]: fn(key, a[key], b[key]) }),
      {}
    );
  
  const obj1 = {
    a: true,
    b: [1, 2, 3],
    c: { d: 4, e: 5 },
    f: 'foo',
  };
  const obj2 = {
    a: false,
    b: [4, 5, 6],
    c: { d: 6, g: 7 },
    f: 'bar',
  };
  
  const concatFn = (key: any, a: any, b: any) => {
    if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
    if (typeof a === 'object' && typeof b === 'object')
      return deepMerge(a, b, concatFn);
    if (typeof a === 'string' && typeof b === 'string') return [a, b].join(' ');
    return b ?? a;
  };
  
  deepMerge(obj1, obj2, concatFn);
export async function GET(request: NextRequest) {  
  /**
 * Downloads a file from a given URL
 * @param fileURL - The URL of the file to download
 */
let res = {}
const downloadFile = async (fileURL: string): Promise<void> => {
    try {
        // const fileName = path.basename(new URL(fileURL).pathname);
        // const filePath = path.join(downloadFolder, fileName);

        console.log(`Downloading: ${fileURL}`);

        const { data } = await axios({
            url: fileURL,
            method: 'GET',
            // responseType: 'stream',
            headers: {
                Authorization: 'Basic ' + process.env.SPEC_42_TOKEN ?? ''
            }
        });

        console.log('data', data);
        if (fileURL.endsWith('.json')) {
            const parsed = JSON.parse(data)
            console.log('parsed json', parsed);
            
            res = deepMerge(res, parsed, concatFn)
          } else if (fileURL.endsWith('.yaml') || fileURL.endsWith('.yml')) {
            const parsed = yaml.load(data)   
            console.log('parsed yaml', parsed);
            res = deepMerge(res, parsed, concatFn)
          }
        // const writer = fs.createWriteStream(filePath);
        // data.pipe(writer);

        // await new Promise((resolve, reject) => {
        //     writer.on('finish', resolve);
        //     writer.on('error', reject);
        // });

        // console.log(`Saved: ${filePath}`);
    } catch (error) {
        console.error(`Failed to download ${fileURL}:`, error);
    }
};
/**
 * Captures network requests and saves all downloadable files
 */
const captureNetworkRequests = async (): Promise<void> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Intercept network requests
    page.on('request', async (request: Request) => {
        const url = request.url();
        
        // Filter only downloadable file types
        if (url.match(/\.(json|yaml|yml)$/)) {
            await downloadFile(url);
        }
    });

    await page.authenticate({'username': process.env.SPEC_42_USERNAME ?? '', 'password': process.env.SPEC_42_PASSWORD ?? ''});
    await page.goto(websiteURL, { waitUntil: 'networkidle0' });

    console.log('Finished capturing network requests.');
    await browser.close();
};

    await captureNetworkRequests();
    return Response.json(res)
  }
  
