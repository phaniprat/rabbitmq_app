const amqp = require('amqplib');

const url = 'amqp://guest:guest@localhost:5672';
const queue = 'nodequeue01';

async function sendMessage(msg) {
    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(msg));

        console.log(`Sent ${msg}`);
        await channel.close();
        await conn.close();
    } catch (error) {
        console.error('Failed to send message', error);
    }
}

async function sendMessages() {
    const messages = [
        "First Message from NodeJs",
        "Second Message from NodeJs",
        "Third Message from NodeJs",
        "Fourth Message from NodeJs",
        "Fifth Message from NodeJs"
    ];

    for (const msg of messages) {
        await sendMessage(msg);
    }
}




async function consumeMessage() {
    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`Received ${msg.content.toString()}`);
                channel.ack(msg); 
            }
        });
    } catch (error) {
        console.error('Failed to consume message', error);
    }
}

async function homeFun(){
    await sendMessages();
    await consumeMessage();
}

homeFun();
