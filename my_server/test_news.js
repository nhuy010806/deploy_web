require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URI || 'mongodb+srv://admin1:123123123@cluster0.kwb0xy7.mongodb.net/group04_db?appName=Cluster0';
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        const db = client.db('group04_db');
        const newsCount = await db.collection('news').countDocuments();
        console.log('News count in DB:', newsCount);
        if (newsCount > 0) {
            const news = await db.collection('news').find({}).limit(1).toArray();
            console.log('Sample news:', news[0].title);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
