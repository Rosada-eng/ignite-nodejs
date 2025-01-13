import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './middlewares/routes.js';

const hostname = '0.0.0.0';
const port = 3333;

const server = http.createServer(async (request, response) => {

    const { url, method } = request;

    await json(request, response);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    })

    if (route) {
        const routeParams = request.url.match(route.path);

        request.params = routeParams.groups;
    
        return route.handler(request, response);
    
    }

    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ message: 'Not found' }));
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    }
);