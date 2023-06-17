const {normalizeURL,getUrlsFromHTML} = require('./crawl.js')
const {test,expect} = require('@jest/globals')

test('normalizeURL strip protocol',()=>{
    const input = 'https://translate.google.com/path';
    const actual = normalizeURL(input);
    const expected ='translate.google.com/path';
    expect(actual).toEqual(expected);
});
test('normalizeURL strip trailing slash',()=>{
    const input = 'https://translate.google.com/path/';
    const actual = normalizeURL(input);
    const expected ='translate.google.com/path';
    expect(actual).toEqual(expected);
});
test('normalizeURL capitals',()=>{
    const input = 'https://TRANSLATE.google.com/path/';
    const actual = normalizeURL(input);
    const expected ='translate.google.com/path';
    expect(actual).toEqual(expected);
});
test('normalizeURL strip http',()=>{
    const input = 'http://translate.google.com/path/';
    const actual = normalizeURL(input);
    const expected ='translate.google.com/path';
    expect(actual).toEqual(expected);
});
test('getUrlsFromHTML absolute',()=>{
    const inputHtmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
    <a href="https://developer.mozilla.org/">Deshaaaa</a>
    </body>
    </html>
    `;
    const inputBaseUrl ="https://developer.mozilla.org";
    const actual = getUrlsFromHTML(inputHtmlBody,inputBaseUrl);
    const expected =['https://developer.mozilla.org/'];
    expect(actual).toEqual(expected);
});
test('getUrlsFromHTML relative',()=>{
    const inputHtmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
    <a href="/en-US/docs/Web/">Deshaaaa</a>
    </body>
    </html>
    `;
    const inputBaseUrl ="https://developer.mozilla.org";
    const actual = getUrlsFromHTML(inputHtmlBody,inputBaseUrl);
    const expected =['https://developer.mozilla.org/en-US/docs/Web/'];
    expect(actual).toEqual(expected);
});
test('getUrlsFromHTML both',()=>{
    const inputHtmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
    <a href="https://developer.mozilla.org/en-US/docs/Web1/">Deshaaaa-- 1</a>
    <a href="/en-US/docs/Web2/">Deshaaaa-- 2</a>
    </body>
    </html>
    `;
    const inputBaseUrl ="https://developer.mozilla.org";
    const actual = getUrlsFromHTML(inputHtmlBody,inputBaseUrl);
    const expected =['https://developer.mozilla.org/en-US/docs/Web1/','https://developer.mozilla.org/en-US/docs/Web2/'];
    expect(actual).toEqual(expected);
});
test('getUrlsFromHTML invalid',()=>{
    const inputHtmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <a href="invalid">Deshaaaa-- invalid</a>
    </body>
    </html>
    `;
    const inputBaseUrl ="https://developer.mozilla.org";
    const actual = getUrlsFromHTML(inputHtmlBody,inputBaseUrl);
    const expected =[];
    expect(actual).toEqual(expected);
});