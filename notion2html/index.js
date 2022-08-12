const notionApiV3 = require("./notionApiV3");
const block2html = require("./convert");

var notionApi = new notionApiV3();
var block2 = new block2html();

async function main(link) {
    var setting = await notionApi.getPageSetting(link)
    var content = await notionApi.page2content(link);
    var html = await block2.contentTypeCheck(content);
    console.log(setting);
    console.log(html);
}

main("https://dohanspace.notion.site/Kwon-DoHan-34f1bf3d841c4a70ba7c8bcbf941c443")