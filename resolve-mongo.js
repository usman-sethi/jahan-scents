const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.a54grbt.mongodb.net', (err, addresses) => {
    if (err) console.error(err);
    else console.log(addresses);
});
dns.resolveTxt('cluster0.a54grbt.mongodb.net', (err, records) => {
    if (err) console.error(err);
    else console.log(records);
});
