import { v4 as uuidv4 } from 'uuid';

export class Task {
    id;
    title;
    completed_at;
    created_at;
    updated_at;
    
    constructor( title, description ) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.completed_at = null;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

}