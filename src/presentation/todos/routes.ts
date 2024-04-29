import { Router } from "express";
import { TodosController } from "./controller";




export class TodoRoutes {

    static get routes(): Router {

        const router = Router();
        const todoController = new TodosController();

        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodoById);
        router.delete('/:id', todoController.deleteTodoById);

        return router;

    }

}