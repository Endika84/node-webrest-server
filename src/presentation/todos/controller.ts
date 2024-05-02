import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


// const todos= [
//     {id: 1, text: 'Buy milk', completedAt: new Date()},
//     {id: 2, text: 'Buy bread', completedAt: null},
//     {id: 3, text: 'Buy butter', completedAt: new Date()},
// ];

export class TodosController {

    //* Injeccion de dependencias
    constructor(){}

    public getTodos = async(req: Request, res: Response) => {

        const todos = await prisma.todo.findMany();
        if(todos.length === 0) return res.status(404).json({error: `Todos are empty`});
        return res.json(todos);

    };
    
    public getTodoById = async(req: Request, res: Response) => {

        const id= +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
        
        // const todo= todos.find(todo => todo.id === id);

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        
        (todo)
            ? res.json(todo)
            : res.status(404).json({error: `TODO with id ${id} not found`})
    };

    public createTodo = async(req: Request, res: Response) => {
    
        const [error, createTodoDto]= CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({error});

        const todo= await prisma.todo.create({
            data: createTodoDto!
        });

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: null,
        // };

        // todos.push(newTodo);

        res.json(todo);

    };

    public updateTodoById = async (req: Request, res: Response) => {
        
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.update({
            ...req.body, id
        });

        if(error) return res.status(400).json({error});

        const todo = await prisma.todo.findFirst({
            where: {id}
        });

        if(!todo) return res.status(404).json({error: `Todo with ${id} not found`});
        
        const updatedTodo= await prisma.todo.update({
            where: {id},
            data: updateTodoDto!.values
        });
        

        return res.json(updatedTodo);
    };

    public deleteTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
        
        // const todo= todos.find(todo => todo.id === id);
        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        if(!todo) return res.status(404).json({error: `Todo with ${id} not found`});
        
        // todos = todos.filter(todo => todo.id !== id);
        //todos.splice(todos.indexOf(todo), 1);

        const deletedTodo= await prisma.todo.delete({
            where: {
                id: id
            }
        });

        (deletedTodo)
            ? res.json(deletedTodo)
            : res.status(400).json({error: `Todo with id ${id} not found`});

        return res.json({todo, deletedTodo});
    };

}