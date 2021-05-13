/* eslint-disable quotes */

const puppeteer = require('puppeteer');
const should = require('should');
const utils = require('../../test-utils');

let browser;
let page;

describe('Resend Verification API', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        );
    });

    afterAll(async () => {
        await browser.close();
    });

    it('Should not resend verification token if a user associated with the email does not exist', async () => {
        await page.goto(utils.ACCOUNTS_URL + '/user-verify/resend', {
            waitUntil: 'networkidle2',
        });
        await page.waitForSelector('#email');
        await init.pageClick(page, 'input[name=email]');
        await init.pageType(page, 'input[name=email]', 'invalid@email.com');
        await init.pageClick(page, 'button[type=submit]');
        await page.waitForSelector('#error-msg');
        const html = await page.$eval('#error-msg', e => {
            return e.innerHTML;
        });
        should.exist(html);
        html.should.containEql('No user associated with this account');
    }, 160000);
});
