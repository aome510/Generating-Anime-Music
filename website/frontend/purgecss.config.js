module.exports = {
    content: ["html/*.html", "js/*.js", "css/*.css"],
    whitelist: [/^hljs.*/],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
};
