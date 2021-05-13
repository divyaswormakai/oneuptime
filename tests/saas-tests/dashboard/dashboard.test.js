const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

require('should');

let browser, page;
const user = {
    email: utils.generateRandomBusinessEmail(),
    password: '1234567890',
};
// Rewriting dashboard without puppeteer cluster.
describe('Monitor API', () => {
    const operationTimeOut = init.timeout;

    const componentName = utils.generateRandomString();
    const monitorName = utils.generateRandomString();

    beforeAll(async done => {
        jest.setTimeout(init.timeout);
        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        );
        await init.registerUser(user, page);

        done();
    });

    afterAll(async done => {
        // delete monitor
        await page.goto(utils.DASHBOARD_URL, {
            waitUntil: 'domcontentloaded',
        });
        await page.waitForSelector('#components');
        await init.pageClick(page, '#components');
        await page.waitForSelector(`#more-details-${componentName}`);
        await init.pageClick(page, `#more-details-${componentName}`);
        await page.waitForSelector(`#more-details-${monitorName}`);
        await init.pageClick(page, `#more-details-${monitorName}`);
        await page.waitForSelector(`#delete_${monitorName}`);
        await init.pageClick(page, `#delete_${monitorName}`);
        await page.waitForSelector('#deleteMonitor');
        await init.pageClick(page, '#deleteMonitor');

        await page.waitForSelector('.ball-beat', { visible: true });
        await page.waitForSelector('.ball-beat', { hidden: true });

        // delete component
        await page.goto(utils.DASHBOARD_URL, {
            waitUntil: 'domcontentloaded',
        });
        await page.waitForSelector('#components');
        await init.pageClick(page, '#components');

        await page.waitForSelector(`#more-details-${componentName}`);
        await init.pageClick(page, `#more-details-${componentName}`);
        await page.waitForSelector(`#componentSettings`);
        await init.pageClick(page, `#componentSettings`);
        await page.waitForSelector(`#advanced`);
        await init.pageClick(page, `#advanced`);

        await page.waitForSelector(`#delete-component-${componentName}`);
        await init.pageClick(page, `#delete-component-${componentName}`);
        await page.waitForSelector('#deleteComponent');
        await init.pageClick(page, '#deleteComponent');
        await page.waitForSelector('#deleteComponent', { hidden: true });

        await browser.close();
        done();
    });

    it(
        'Should create new component',
        async done => {
            // Navigate to Components page
            await page.goto(utils.DASHBOARD_URL, {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForSelector('#components');
            await init.pageClick(page, '#components');

            // Fill and submit New Component form
            await page.waitForSelector('#form-new-component');
            await page.waitForSelector('input[id=name]', { visible: true });
            await init.pageClick(page, 'input[id=name]');
            await page.focus('input[id=name]');
            await init.pageType(page, 'input[id=name]', componentName);
            await init.pageClick(page, '#addComponentButton');

            await page.waitForSelector('#monitors', { visible: true });
            await page.goto(utils.DASHBOARD_URL, {
                waitUntil: 'domcontentloaded',
            });

            await page.waitForSelector('#components', { visible: true });
            await init.pageClick(page, '#components');

            let spanElement;
            spanElement = await page.waitForSelector(
                `span#component-title-${componentName}`
            );
            spanElement = await spanElement.getProperty('innerText');
            spanElement = await spanElement.jsonValue();
            spanElement.should.be.exactly(componentName);

            done();
        },
        operationTimeOut
    );

    it(
        'Should create new monitor with correct details',
        async done => {
            // Navigate to Components page
            await page.goto(utils.DASHBOARD_URL, {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForSelector('#components');
            await init.pageClick(page, '#components');

            // Navigate to details page of component created in previous test
            await page.waitForSelector(`#more-details-${componentName}`);
            await init.pageClick(page, `#more-details-${componentName}`);
            await page.waitForSelector('#form-new-monitor', {
                visible: true,
            });

            // Fill and submit New Monitor form
            await init.pageClick(page, 'input[id=name]', { visible: true });
            await page.focus('input[id=name]');
            await init.pageType(page, 'input[id=name]', monitorName);
            await init.pageClick(page, '[data-testId=type_url]');
            await page.waitForSelector('#url', { visible: true });
            await init.pageClick(page, '#url');
            await init.pageType(page, '#url', 'https://google.com');
            await init.pageClick(page, 'button[type=submit]');

            let spanElement;
            spanElement = await page.waitForSelector(
                `#monitor-title-${monitorName}`,
                { visible: true }
            );
            spanElement = await spanElement.getProperty('innerText');
            spanElement = await spanElement.jsonValue();
            spanElement.should.be.exactly(monitorName);

            done();
        },
        operationTimeOut
    );

    it(
        'Should not create new monitor when details that are incorrect',
        async done => {
            // Navigate to Components page
            await page.goto(utils.DASHBOARD_URL, {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForSelector('#components');
            await init.pageClick(page, '#components');

            // Navigate to details page of component created in previous test
            await page.waitForSelector(`#more-details-${componentName}`);
            await init.pageClick(page, `#more-details-${componentName}`);
            await page.waitForSelector('#form-new-monitor', {
                visible: true,
            });
            // Submit New Monitor form with incorrect details
            await init.pageClick(page, 'input[id=name]', { visible: true });
            await page.focus('input[id=name]');
            await init.pageType(page, 'input[id=name]', '');
            await init.pageClick(page, '[data-testId=type_url]');
            await page.waitForSelector('#url', { visible: true });
            await init.pageClick(page, '#url');
            await init.pageType(page, '#url', 'https://google.com');
            await init.pageClick(page, 'button[type=submit]');

            let spanElement;
            spanElement = await page.waitForSelector(
                '#form-new-monitor span#field-error',
                { visible: true }
            );
            spanElement = await spanElement.getProperty('innerText');
            spanElement = await spanElement.jsonValue();
            spanElement.should.be.exactly('This field cannot be left blank');

            done();
        },
        operationTimeOut
    );
});
