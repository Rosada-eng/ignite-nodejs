import http from 'node:http';
import { TasksDatabase } from './infraestructure/database/database.js';

const hostname = '0.0.0.0';
const port = 3333;
const tasksDatabase = new TasksDatabase();

const server = http.createServer(async (request, response) => {

    const { url, method } = request;

    const buffers = [];

    for await (const chunk of request) {
        buffers.push(chunk);
    }

    try {
        request.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
        request.body = null;
    }

    if (method === 'POST' && url === '/tasks') {
        const { title, description } = request.body;

        const task = tasksDatabase.create(title, description);
        
        response.statusCode = 201;
        response.setHeader('Content-Type', 'application/json');
        return response.end(JSON.stringify(task));

    }



});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    }
);