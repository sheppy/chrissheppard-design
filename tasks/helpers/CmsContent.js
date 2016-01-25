// Custom nunjucks tag to load content mixins
// Usage in views: {% cmsContent contentObj %}
const CmsContent = function (env) {
    this.tags = ["cmsContent"];
    this.env = env;

    this.parse = function (parser, nodes) {
        let token = parser.nextToken();
        let args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        return new nodes.CallExtensionAsync(this, "run", args);
    };

    this.run = function (context, theContent, callback) {
        if (!theContent || !theContent.type) {
            return callback(null, "");
        }

        let mixinName = "content" + theContent.type[0].toUpperCase() + theContent.type.slice(1);
        let mixinFile = `mixins/content/_${theContent.type}.nunj`;

        env
            .getTemplate(mixinFile)
            .getExported(function (ctx, obj) {
                callback(null, obj[mixinName](theContent));
            });
    };
};

export default CmsContent;
