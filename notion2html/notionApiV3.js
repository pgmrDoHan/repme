//module import
const request = require('request');

//class
class notionApiV3 {
    //url2id
    url2pageid(link) {
        //is like or id
        if (link.startsWith("http")) {
            var linkSplit = link.split("-");
            var tempId = linkSplit[linkSplit.length - 1];
            var id_properties = tempId.slice(0, 8);
            var id_properties = id_properties + "-" + tempId.slice(8, 12);
            var id_properties = id_properties + "-" + tempId.slice(12, 16);
            var id_properties = id_properties + "-" + tempId.slice(16, 20);
            var id_properties = id_properties + "-" + tempId.slice(20);
            return id_properties
        } else { return link }
    }

    notionPage(link) {
        var pageId = this.url2pageid(link);

        const options = {
            uri: 'https://www.notion.so/api/v3/loadPageChunk',
            method: 'POST',
            body: {
                pageId: pageId,
                limit: 100,
                cursor: {
                    stack: []
                },
                chunkNumber: 0,
                verticalColumns: false
            },
            json: true
        }

        return new Promise(function(resolve, reject) {
            request.post(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(response);
                } else {
                    reject(error);
                }
            });
        })
    }

    //get page setting
    async getPageSetting(link) {
        //basic var
        var pageId = this.url2pageid(link);
        var response = await this.notionPage(link);
        var pageInfo = response.body["recordMap"]['block'][pageId]["value"];
        var parentType = pageInfo["parent_table"];
        var parentId = pageInfo["parent_id"];
        var isRoot = parentType == "block" ? false : true;
        //init var
        var pageIcon = null;
        var pageCover = null;
        var fullWidth = false;
        var smallText = false;
        //error
        if (pageInfo["type"] != "page") { return { code: 403, msg: "NOT_PAGE_ERROR" } }
        //get page settings
        var pageTitle = pageInfo["properties"]["title"][0][0];
        if ("format" in pageInfo) {
            if ("page_icon" in pageInfo["format"]) {
                var pageIconTempLink = pageInfo["format"]["page_icon"];
                var pageIcon = "https://www.notion.so/image/" + encodeURIComponent(pageIconTempLink) + "?table=block&id=" + pageId;
                if (pageIconTempLink.startsWith("http") == false) { pageIcon = pageIconTempLink; }
            }
            if ("page_cover" in pageInfo["format"]) {
                var pageCoverTempLink = pageInfo["format"]["page_cover"];
                var pageCover = "https://www.notion.so/image/" + encodeURIComponent(pageCoverTempLink) + "?table=block&id=" + pageId;
                if (pageCoverTempLink.startsWith("http") == false) { pageCover = "https://www.notion.so" + pageCoverTempLink; }
            }
            if (pageInfo['format']['page_full_width'] != undefined) { fullWidth = pageInfo['format']['page_full_width']; }
            if (pageInfo['format']['page_small_text'] != undefined) { smallText = pageInfo['format']['page_small_text']; }
        }
        //return
        let pageSetting = {
            pageTitle: pageTitle,
            pageIcon: pageIcon,
            pageCover: pageCover,
            fullWidth: fullWidth,
            smallText: smallText,
            isRoot: isRoot,
            parentId: parentId
        };
        return pageSetting;
    }

    async page2content(link) {
        //basic var
        var pageId = this.url2pageid(link);
        var response = await this.notionPage(link);
        var pageContentList = response.body["recordMap"]['block'][pageId]["value"]["content"];
        var pageContent = {};
        for (var i = 0; i < pageContentList.length; i++) {
            var blockId = pageContentList[i];
            var blockInfo = response.body["recordMap"]['block'][blockId];
            var isRoot = blockInfo["value"]["parent_table"] == "block" ? false : true;
            var block = {
                id: blockInfo["value"]["id"],
                type: blockInfo["value"]["type"],
                properties: blockInfo["value"]["properties"],
                format: blockInfo["value"]["format"],
                isRoot: isRoot,
                parentId: blockInfo["value"]["parent_id"]
            }
            pageContent[blockId] = block;
        }
        return pageContent;
    }
}

module.exports = notionApiV3;