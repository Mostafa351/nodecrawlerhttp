const {JSDOM} = require('jsdom');

async function crawlPage(baseUrl,currentUrl,pages){
    const baseUrlObj = new URL(baseUrl);
    const currentUrlObj = new URL(currentUrl);

    if(baseUrlObj.hostname !== currentUrlObj.hostname){
        return pages;
    }

    const normalizeURLCurrentUrl = normalizeURL(currentUrl);
    if(pages[normalizeURLCurrentUrl]>0){
        pages[normalizeURLCurrentUrl]++;
        return pages;
    }

    pages[normalizeURLCurrentUrl] =1;
    console.log(`activly crawling : ${currentUrl}`);


    try {
        const resp = await fetch(currentUrl);
        if(resp.status>399){
            console.log(`error in fetch with status code: ${resp.status} on page ${currentUrl}`);
            return pages;
        }
        const contentType = resp.headers.get("content-type");
        if(!contentType.includes("text/html")){
            console.log(`not html response: ${contentType} on page ${currentUrl}`);
            return pages;
        }
        const htmlBody =await resp.text();
        const nextUrls = getUrlsFromHTML(htmlBody,baseUrl);
        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseUrl,nextUrl,pages);
        }
        
    } catch (error) {
        console.log(`error in fetch : ${error.message}, on page ${currentUrl}`);
    }
    return pages;
}
function getUrlsFromHTML(htmlBody,baseUrl){
    const urls =[];
    const dom = new JSDOM(htmlBody);
    const linkElements =  dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements ) {
        if(linkElement.href.slice(0,1) === '/'){
            //realative
            try {
                const urlObj = new URL(`${baseUrl}${linkElement.href}`)
                
                urls.push(urlObj.href); 
            } catch (error) {
                console.log( `error with relative url: ${  error.message}`);
            }
        }else{
            // absolute
            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href);
            } catch (error) {
                console.log( `error with absolute url: ${  error.message}`);
            }
        }
    }
    return urls;
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length>0&&hostPath.slice(-1)=== '/'){
        return hostPath.slice(0,-1);
    }
    return hostPath;
}



module.exports = {
    normalizeURL,
    getUrlsFromHTML,
    crawlPage
}