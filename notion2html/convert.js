class notion2html {
    resultHtml="";

    async contentTypeCheck(blocks) {
        for(var i=0; i<Object.keys(blocks).length; i++) {
            var blockType= blocks[Object.keys(blocks)[i]]["type"];
            if(blockType=="text"){this.textBlock(blocks[Object.keys(blocks)[i]])}
        }
        return this.resultHtml;
    }

    textBlock(block) {
        if(block!=undefined && block['properties']!=undefined) {
            for(var i=0; i<block['properties']['title'].length; i++){
                var text=block['properties']['title'][i][0];
                this.resultHtml+=`${text} : `;
            }
        }
    }
}

module.exports = notion2html;