const fs = require('fs');
const net = require('net');
const http = require('https');
const path = require('path');
const cheerio = require('cheerio');

const NEWS_DIRECTORY = 'news';
const url = 'https://www.wsj.com/';
let news = [];

module.exports = {
    news: news,
    webScraper: webScraper,
    saveNews: saveNews
};

function webScraper() {
    news = [];

    http.get(url, (res) => {
        let html = '';
        res.on('data', (chunk) => {
            html += chunk;
        });
        res.on('end', () => {
            const $ = cheerio.load(html);
            $('.WSJTheme--story--XB4V2mLz').each(function () {
                const title = $(this).find('h3').text();
                const link = $(this).find('a').attr('href');
                const info = $(this).find('p').text();
                news.push({ title, info, link });
            });
            saveNews(news);
        });
    }).on('error', (err) => {
        console.log('Error: ' + err.message);
    });
}

setInterval(webScraper, 60000);

function saveNews(news) {
    let title;
    let info;
    let link;
    for (let i = 0; i < news.length; i++) {
        title = news[i].title;
        info = news[i].info;
        link = news[i].link;
        fs.mkdirSync(NEWS_DIRECTORY, {recursive: true});
        let fileContent;
        const fileName = title.toLowerCase().replace(/[^a-zA-Z0-9 ]|\s+/g, '_') + '.txt';
        if (info.length > 0) {
            fileContent = `Title: ${title}\n\nURL: ${link}\n\nNews: ${info}\n\n`;
        } else {
            fileContent = `Title: ${title}\n\nURL: ${link}\n\n`;
        }
        fs.writeFile(`${NEWS_DIRECTORY}/${fileName}`, fileContent, err => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Saved ${fileName}`);
            }
        });
    }
}


const server = net.createServer((socket) => {
    socket.setEncoding('utf-8');
    socket.on('data', (data) => {
        const request = data.toString();
        const requestLine = request.split('\n')[0];
        const requestParts = requestLine.split(' ');

        if (requestParts[0] === 'GET' && requestParts[1] === '/') {
            fs.readdir(NEWS_DIRECTORY, (err, files) => {
                if (err) {
                    socket.write('HTTP/1.1 500 Internal Server Error\n');
                    socket.write('Content-Type: text/plain\n\n');
                    socket.write('Internal Server Error');
                    socket.end();
                    return;
                }

                socket.write('HTTP/1.1 200 OK\n');
                socket.write('Content-Type: text/html\n\n');
                socket.write('<html>\n<head>\n<title>WSJ News</title>\n</head>\n<body>\n<h1>WSJ News</h1>\n');
                socket.write('<ul>');
                files.forEach((file) => {
                    const filePath = path.join(NEWS_DIRECTORY, file);
                    const fileStats = fs.statSync(filePath);
                    if (fileStats.isFile()) {
                        const title = file.replace('.txt', '').replace(/_/g, ' ');
                        socket.write(`<li><a href="/news/${file}">${title}</a></li>`);
                    }
                });
                socket.write('</ul>\n</body>\n</html>');
                socket.end();
            });
        }

        else if (requestParts[0] === 'GET' && requestParts[1].startsWith('/news/')) {
            const fileName = requestParts[1].substring('/news/'.length);
            console.log(fileName);

            fs.readFile(NEWS_DIRECTORY + '/' + fileName, 'utf-8', (err, data) => {
                if (err) {
                    socket.write('HTTP/1.1 404 Not Found\n');
                    socket.write('Content-Type: text/plain\n\n');
                    socket.write('Not Found');
                    socket.end();
                    return;
                }

                const lines = data.split('\n');
                const title = lines[0];
                const body = lines.slice(1).join('\n');

                socket.write('HTTP/1.1 200 OK\n');
                socket.write('Content-Type: text/html\n\n');
                socket.write(`<html>\n<head>\n<title>${title}</title>\n</head>\n<body>\n<h1>${title}</h1>\n`);
                socket.write(`<pre>${body}</pre>`);
                socket.write('</body>\n</html>');
                socket.end();
            });
        }

        else {
            socket.write('HTTP/1.1 404 Not Found\n');
            socket.write('Content-Type: text/plain\n\n');
            socket.write('Not Found');
            socket.end();
        }
    });
});

webScraper()
server.listen(3030, () => {
    console.log('Server running on port 3030');
});
