"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
class TodoRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const todoController = new controller_1.TodosController();
        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createTodo);
        router.put('/:id', todoController.updateTodoById);
        router.delete('/:id', todoController.deleteTodoById);
        return router;
    }
}
exports.TodoRoutes = TodoRoutes;
