const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

let browser;
let page;

app.post('/login', async (req, res) => {
    const { appstate } = req.body;
    
    try {
        fs.writeFileSync('appstate.json', JSON.stringify(appstate));
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        
        // Load the Facebook page with the appstate (pseudo code)
        await page.goto('https://www.facebook.com/');
        await page.setCookie(...JSON.parse(appstate));
        await page.reload({ waitUntil: 'networkidle0' });

        // Check if login is successful
        const loginCheck = await page.$('selector-for-checking-login-success');
        if (loginCheck) {
            res.json({ success: true, message: 'Login successful!' });
        } else {
            res.json({ success: false, message: 'Login failed. Please check your appstate.' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'An error occurred during login.' });
    }
});

app.get('/start-automation', async (req, res) => {
    try {
        // Schedule a post (pseudo code for scheduled tasks)
        setTimeout(async () => {
            await page.goto('https://www.facebook.com/some-page-to-post');
            await page.type('textarea[post-selector]', 'Scheduled post content');
            await page.click('button[post-button-selector]');
            console.log('Post published at scheduled time');
        }, 30000);  // Schedule to post after 30 seconds

        // Auto-accept friend requests every minute (pseudo code)
        setInterval(async () => {
            await page.goto('https://www.facebook.com/friends/requests/');
            const acceptButtons = await page.$$('button[accept-button-selector]');
            for (const button of acceptButtons) {
                await button.click();
                console.log('Friend request accepted');
            }
        }, 60000);  // Auto-accept friend requests every minute

        res.json({ message: 'Automation started successfully.' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Failed to start automation.' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});