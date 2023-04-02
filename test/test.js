const fs = require('fs');
const assert = require('assert');
const index = require('../index');

describe('webScraper', function() {
    this.timeout(10000);

    it('should scrape and save news articles', async function() {
        await index.webScraper();

        setTimeout(function() {
            assert.ok(index.news.length > 0);
            done();
        }, 5000);
    });
});

describe('saveNews', function() {
    const news = [
        {
            title: 'Breaking News',
            info: 'Breaking',
            link: 'https://example.com/breaking-news'
        },
        {
            title: 'Sports News',
            info: 'Sports ',
            link: 'https://example.com/sports-news'
        }
    ];

    it('should create a directory named "news" if it does not exist', function() {
        index.saveNews(news);
        const dirExists = fs.existsSync('./news');
        assert.strictEqual(dirExists, true);
    });

    it('should create a text file for each news item with the correct file name', function() {
        index.saveNews(news);
        const fileNames = news.map(item => `${item.title.toLowerCase().replace(/[^a-zA-Z0-9 ]|\s+/g, '_')}.txt`);
        fileNames.forEach(fileName => {
            const fileExists = fs.existsSync(`./news/${fileName}`);
            assert.strictEqual(fileExists, true);
        });
    });

    it('should create a text file with the correct content', function() {
        index.saveNews(news);
        news.forEach(item => {
            const fileName = `${item.title.toLowerCase().replace(/[^a-zA-Z0-9 ]|\s+/g, '_')}.txt`;
            const expectedContent = `Title: ${item.title}\n\nURL: ${item.link}\n\nNews: ${item.info}\n\n`;
            fs.readFile(`./news/${fileName}`, 'utf-8', (err, data) => {
                if (err) {
                    assert.strictEqual(data, undefined);
                }
                assert.strictEqual(data, expectedContent);
            });

        });
    });
});


