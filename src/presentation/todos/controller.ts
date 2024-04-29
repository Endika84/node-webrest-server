import { Request, Response } from "express";


const todos= [
    {id: 1, text: 'Buy milk', completedAt: new Date()},
    {id: 2, text: 'Buy bread', completedAt: null},
    {id: 3, text: 'Buy butter', completedAt: new Date()},
];

export class TodosController {

    //* Injeccion de dependencias
    constructor(){}

    public getTodos = (req: Request, res: Response) => {

        return res.json(todos);

    };
    
    public getTodoById = (req: Request, res: Response) => {

        const id= +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
        
        const todo= todos.find(todo => todo.id === id);
        
        (todo)
            ? res.json(todo)
            : res.status(404).json({error: `TODO with id ${id} not found`})
    };

    public createTodo = (req: Request, res: Response) => {
    
        const {text} = req.body;

        if(!text) return res.status(400).json({error: "Text is undefined"});

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null,

        };

        todos.push(newTodo);

        console.log(newTodo);

        res.json(todos);

    };

    public updateTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
        
        const updatedTodo= todos.find(todo => todo.id === id)
        if(!updatedTodo) return res.status(404).json({error: `Todo with ${id} not found`});
        
        const {text, completedAt} = req.body;
        if(!text) return res.status(400).json({error: "Text property is required"});
        

        updatedTodo.text = text || updatedTodo.text;
        (completedAt === 'null')
            ? updatedTodo.completedAt = null
            : updatedTodo.completedAt = new Date(completedAt || updatedTodo.completedAt);

        console.log(todos);

        return res.json(updatedTodo);
    };

    public deleteTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
        
        const todo= todos.find(todo => todo.id === id);
        if(!todo) return res.status(404).json({error: `Todo with ${id} not found`});
        
        // todos = todos.filter(todo => todo.id !== id);
        todos.splice(todos.indexOf(todo), 1);

        return res.json(todo);
    };

}