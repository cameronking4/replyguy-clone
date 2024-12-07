import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

// Load environment variables from a .env file (Make sure to store your API token in this file)
dotenv.config();

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN, // Store your token in an environment variable
});

// Prepare Actor input

// ToDo: dynamically fetch Linkedin Cookie from fake account or pull from file updated periodically using Github Action
const input = {
    "cookie": [
        {
            "domain": ".linkedin.com",
            "expirationDate": 1733522945,
            "hostOnly": false,
            "httpOnly": false,
            "name": "mbox",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "session#e99c7151960a4ccda3f7f497f146fb0e#1717972805|PC#e99c7151960a4ccda3f7f497f146fb0e.35_0#1733522945"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1726044004.154742,
            "hostOnly": false,
            "httpOnly": false,
            "name": "lms_ads",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQGVA9fiTEwuAAAAAZFFvpPg1KFf4Tei_SAk6Xlf91ypYFX1xTMEz2nbph1xNxpTWV0FlLzDJJNvtSQe1PBxV9tOuQKbfgtV"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1755385866.125253,
            "hostOnly": false,
            "httpOnly": false,
            "name": "bcookie",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "\"v=2&55233b3b-0382-46d5-821d-8dc6cd8e11e7\""
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1726044004.154889,
            "hostOnly": false,
            "httpOnly": false,
            "name": "lms_analytics",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQGVA9fiTEwuAAAAAZFFvpPg1KFf4Tei_SAk6Xlf91ypYFX1xTMEz2nbph1xNxpTWV0FlLzDJJNvtSQe1PBxV9tOuQKbfgtV"
        },
        {
            "domain": ".linkedin.com",
            "hostOnly": false,
            "httpOnly": true,
            "name": "fptctx2",
            "path": "/",
            "sameSite": "lax",
            "secure": true,
            "session": true,
            "storeId": null,
            "value": "taBcrIH61PuCVH7eNCyH0OPzOrGnaCb%252f7mTjN%252fuIW2vln%252f1dJzpm1PL0nUg06MSJA4J%252fWkDB43z2Jku8I20tmE0Z30GmZTGzxCXo556Xq6T023Y2YIuDm1usFo%252bZNLVSyYgZcyHXOjlFCd2I6PwivjZ1fYn%252fP6ISPruehSmqKfCg%252bgIbyakeKiByvkXUvI8W8d5%252bY2IT64XagBavmRaUTPAj6ITXf03WgBZ4DTmQTUupEV1eOU1ZZ%252b0wQTp%252fweHuAJK%252bAPdzt%252bgQSjxv9UgRz913Mq2p6LBYDk%252f7nBTLJ%252bR7UsmKi8ddUJTjUY6A7%252fq55X4UEo61LVjVwCJireCt4CmnmkJppWQne0aMRQpbaFw%253d"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1755323479.695653,
            "hostOnly": false,
            "httpOnly": true,
            "name": "li_at",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQEDARa_hy0ApSfeAAABkKVVJxIAAAGRfcoIBlYAPc90_pNsrvMbvnmwg5uoQ4e4q1ulLfdFgfCm7C-EH2Q5jTbdtNMhoE3KOZUlq1kcTXEtel-GnYutTpBzwZ8Wvf4eXV8JehjJJRNIoK-u1w95fwKf"
        },
        {
            "domain": ".linkedin.com",
            "hostOnly": false,
            "httpOnly": false,
            "name": "lang",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": true,
            "storeId": null,
            "value": "v=2&lang=en-us"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1723923202.238096,
            "hostOnly": false,
            "httpOnly": false,
            "name": "lidc",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "\"b=OB33:s=O:r=O:a=O:p=O:g=4290:u=996:x=1:i=1723851395:t=1723923200:v=2:sig=AQGDVU7rN3apbtBYrirFE0QUAz0YpxIo\""
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1726433904.962072,
            "hostOnly": false,
            "httpOnly": false,
            "name": "AnalyticsSyncHistory",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQLrvRVUshPMHQAAAZFc-_zamRmGj8KQo2VDDBPzR7M3RX2F0dTznW3v6Sn3cUBHS3j5dPdGjTaYx7mZQTALOA"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1755379044.596219,
            "hostOnly": false,
            "httpOnly": true,
            "name": "bscookie",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "\"v=1&20210916012926e96ec1b6-b4d4-4403-8fce-f8ec6382ccc3AQE4uLobSdIlzdkZL_zmsA9EdCvxwwGD\""
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1738110044.172999,
            "hostOnly": false,
            "httpOnly": true,
            "name": "dfpfpt",
            "path": "/",
            "sameSite": "lax",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "caf1e3c8d7ae4fae8f2d3d415b0c71b5"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1755323479.695788,
            "hostOnly": false,
            "httpOnly": false,
            "name": "JSESSIONID",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "\"ajax:9183856364211229455\""
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1752296740.247833,
            "hostOnly": false,
            "httpOnly": true,
            "name": "li_rm",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQGwF1gMoRONNQAAAYs5trPKZNQH9yb-PAVCdZYtU05QU3uMFDGYdyNc9oOyDNyhvSxiwYQmAXwp-dFIoZYXtRhJphioc9tZ1mjuFtb7v1Otfd2eR2aY468i"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1731625865.124884,
            "hostOnly": false,
            "httpOnly": false,
            "name": "li_sugr",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "5ab22659-2fd6-49a8-a364-11e922e19fd6"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1739405182,
            "hostOnly": false,
            "httpOnly": false,
            "name": "li_theme",
            "path": "/",
            "sameSite": null,
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "light"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1739405182,
            "hostOnly": false,
            "httpOnly": false,
            "name": "li_theme_set",
            "path": "/",
            "sameSite": null,
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "app"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1755323479.695759,
            "hostOnly": false,
            "httpOnly": false,
            "name": "liap",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "true"
        },
        {
            "domain": ".www.linkedin.com",
            "expirationDate": 1725059181,
            "hostOnly": false,
            "httpOnly": false,
            "name": "timezone",
            "path": "/",
            "sameSite": null,
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "America/Los_Angeles"
        },
        {
            "domain": ".linkedin.com",
            "expirationDate": 1726433904.961949,
            "hostOnly": false,
            "httpOnly": false,
            "name": "UserMatchHistory",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": null,
            "value": "AQJzdr5ff4j8sQAAAZFc-_zaH2uw53-hm6DeOFoZi4B7YQzyv2xVTds3AdZdfyws-8vrnC3ZBEttsw"
        }
    ],
    "deepScrape": true,
    "maxDelay": 5,
    "minDelay": 1,
    "startPage": 1,
    "strictMode": false
};

const fetchLinkedinPosts = async () => {
    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor("curious_coder~linkedin-post-search-scraper").call(input);

        // Fetch and print Actor results from the run's dataset (if any)
        console.log('Results from dataset');
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        items.forEach((item) => {
            console.dir(item);
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export default fetchLinkedinPosts;
