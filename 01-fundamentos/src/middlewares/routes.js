import { TasksDatabase } from '../infraestructure/database/database.js';
import { buildRouteRegex } from '../utils/build-route-path.js';

const tasksDatabase = new TasksDatabase();

export const routes = [
    {
        method: 'GET',
        path: buildRouteRegex('/tasks'),
        handler: async (request, response) => {
            const title = request.body?.title ?? null;
            const description = request.body?.description ?? null;

            const tasks = tasksDatabase.getAll({ title, description });

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRouteRegex('/tasks'),
        handler: async (request, response) => {
            const { title, description } = request.body;

            // TODO: Validar input -- title e description são obrigatórios

            const task = tasksDatabase.create(title, description);
            
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify(task));
        }
    },
    {
        method: 'PUT',
        path: buildRouteRegex('/tasks/:id'),
        handler: async (request, response) => {
            const { id } = request.params;
            const { title, description } = request.body;

            const task = tasksDatabase.getOne(id);

            if (!task) {
                response.statusCode = 404;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: 'Task not found' }));
            }

            if (!title && !description) {
                response.statusCode = 400;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: 'Title or description is required' }));
            }

            tasksDatabase.update(task, { title, description });
            response.statusCode = 200;
            
            return response.end();

        }
    },
    {
        method: 'DELETE',
        path: buildRouteRegex('/tasks/:id'),
        handler: async (request, response) => {
            const {id} = request.params;
            
            const task = tasksDatabase.getOne(id);

            if (!task) {
                response.statusCode = 404;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: 'Task not found' }));
            }

            tasksDatabase.delete(task);

            response.statusCode = 204;

            return response.end()

        }
    },
    {
        method: 'PATCH',
        path: buildRouteRegex('/tasks/:id/complete'),
        handler: async (request, response) => {
            const { id } = request.params;
            
            const task = tasksDatabase.getOne(id);

            if (!task) {
                response.statusCode = 404;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: 'Task not found' }));
            }

            tasksDatabase.completeTask(task);

            response.statusCode = 200;

            return response.end();

        }
    }
]