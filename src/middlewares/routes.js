import { TasksDatabase } from '../infraestructure/database/database.js';

const tasksDatabase = new TasksDatabase();

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
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
        path: '/tasks',
        handler: async (request, response) => {
            const { title, description } = request.body;

            const task = tasksDatabase.create(title, description);
            
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify(task));
        }
    }
]