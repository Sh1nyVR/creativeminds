const {createBareServer} = require('@tomphttp/bare-server-node');

const bareServer = createBareServer('/ov/');

module.exports = (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pathParam = (url.searchParams.get('path') || '').replace(/^\/+/, '');
    const barePath = `/ov/${pathParam}`;

    url.searchParams.delete('path');
    const forwardedQuery = url.searchParams.toString();
    const bareUrl = forwardedQuery ? `${barePath}?${forwardedQuery}` : barePath;

    const bareReq = Object.assign({}, req, {
        url: bareUrl,
        originalUrl: bareUrl
    });

    if (!bareServer.shouldRoute(bareReq)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
    }

    req.url = bareUrl;
    bareServer.routeRequest(req, res);
};

