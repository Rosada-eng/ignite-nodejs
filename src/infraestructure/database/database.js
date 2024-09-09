import { Task } from "../entities/task.js";
import fs from "node:fs/promises";

const databasePath = new URL('db.json', import.meta.url);

export class TasksDatabase {
    // in-memory database to store Tasks

    #db = {}

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#db));
    }

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#db = JSON.parse(data);
        })
        .catch(() => {
            this.#persist();
        });
    }
    
    getAll({ title, description }) {
        let tasks = this.#db['tasks'] ?? [];

        if (title) {
            tasks = tasks.filter(task => title.toLowerCase().includes(task.title.toLowerCase()));
        }

        if (description) {
            tasks = tasks.filter(task => description.toLowerCase().includes(task.description.toLowerCase()));
        }

        return tasks;
    }

    create(title, description) {
        const task = new Task(title, description);

        if (Array.isArray(this.#db['tasks'])) {
            this.#db['tasks'].push(task);
        } else {
            this.#db['tasks'] = [task];
        }

        this.#persist();

        return task;
    }

   
}
