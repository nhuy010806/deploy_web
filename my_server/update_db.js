const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient('mongodb+srv://admin1:123123123@cluster0.kwb0xy7.mongodb.net/group04_db?appName=Cluster0');
    try {
        await client.connect();
        const db = client.db('group04_db');
        const res = await db.collection('news').updateOne({id: 'n1'}, {$set: {title: 'Ngày hội đọc sách LightBook 2026 (Live từ DB)'}});
        console.log('Updated:', res.modifiedCount);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
