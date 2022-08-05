import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, method } = req

    const url = query.url ? query.url : ''
    const width = query.width ? Number(query.width) : 1280
    const height = query.height ? Number(query.height) : 960
    const scale = query.scale ? Number(query.scale) : 1

    if (!url || !(typeof url === 'string')) {
        res.status(422).end()
        return
    }
    if (width) {
        if (!(typeof Number(width) === 'number')) {
            res.status(422).end()
            return
        }
        if (width < 1 || width > 2000) {
            res.status(422).end()
            return
        }
    }
    if (height) {
        if (!(typeof height === 'number')) {
            res.status(422).end()
            return
        }
        if (height < 1 || height > 4000) {
            res.status(422).end()
            return
        }
    }
    if (scale) {
        if (!(typeof scale === 'number')) {
            res.status(422).end()
            return
        }
        if (scale < 1 || scale > 3) {
            res.status(422).end()
            return
        }
    }

    // ブラウザ起動
    let browser
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        //Vercel
        const chrome = require('chrome-aws-lambda')
        browser = await chrome.puppeteer.launch({
            args: [...chrome.args, '--no-sandbox', '--lang=ja'],
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        })
        await chrome.font("https://raw.githack.com/minoryorg/Noto-Sans-CJK-JP/master/fonts/NotoSansCJKjp-Regular.ttf")
    } else {
        //Local
        const puppeteer = require('puppeteer')
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--lang=ja'],
        })
    }

    let page = await browser.newPage()

    // スクリーンショット取得
    const imageType = 'png'
    await page.setViewport({ width, height, deviceScaleFactor: scale })
    await page.goto(url, { waitUntil: 'networkidle2' })
    const buffer = await page.screenshot({ type: imageType })
    await browser.close()

    const headers = {
        'Content-Type': `image/${imageType}`,
    }
    res.writeHead(200, headers).end(buffer)
}
