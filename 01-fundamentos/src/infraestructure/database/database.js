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
            tasks = tasks.filter(task => task.title.toLowerCase().includes(title.toLowerCase()));
        }

        if (description) {
            tasks = tasks.filter(task => task.description.toLowerCase().includes(description.toLowerCase()));
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

    getOne(id) {
        return this.#db['tasks'].find(task => task.id === id);
    }
   
    update(task, newData) {
        Object.assign(task, newData);
        task.updated_at = new Date();
        
        this.#persist();
        return task;

    }

    delete(task) {
        this.#db['tasks'] = this.#db['tasks'].filter(t => t.id !== task.id);
        this.#persist();
    }

    completeTask(task) {
        task.completed = !task.completed;

        task.completed_at = new Date();
        task.updated_at = new Date();


        this.#persist();
    }
}
