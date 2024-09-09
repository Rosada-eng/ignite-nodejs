import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './middlewares/routes.js';

const hostname = '0.0.0.0';
const port = 3333;


const server = http.createServer(async (request, response) => {

    const { url, method } = request;

    await json(request, response);

    const route = routes.find(route => {
        return route.method === method && route.path === url;
    })

    return await route.handler(request, response);

});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    }
);