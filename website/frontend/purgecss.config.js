module.exports = {
    content: ["html/*.html", "js/*.js"],
    whitelist: [/^hljs.*/],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
};
