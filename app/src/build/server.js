
// example
module.exports = function err(req, res) {
    res.statusCode = 200;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({hello: 'there'}));
};

