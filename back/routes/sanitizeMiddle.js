const sanitizeHtml = require('sanitize-html');
const sanitizeOption = {
    allowedTags : [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'pre',
        'blockquote'
    ],
    allowedAttributes : {
        a : ['href', 'name', 'target'],
        img : ['src'],
        li : ['class'],
        pre : ['class']
    },
    allowedSchemes : ['data', 'http'],
};


exports.removeHtmlAndShorten = (req, res, next) => {
    const filtered = sanitizeHtml(req.body.content, {
        ...sanitizeOption
    });
    filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`
    req.filtered = filtered;
    next();
}
