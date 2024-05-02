"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const postgres_1 = require("../../data/postgres");
const dtos_1 = require("../../domain/dtos");
// const todos= [
//     {id: 1, text: 'Buy milk', completedAt: new Date()},
//     {id: 2, text: 'Buy bread', completedAt: null},
//     {id: 3, text: 'Buy butter', completedAt: new Date()},
// ];
class TodosController {
    //* Injeccion de dependencias
    constructor() {
        this.getTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const todos = yield postgres_1.prisma.todo.findMany();
            if (todos.length === 0)
                return res.status(404).json({ error: `Todos are empty` });
            return res.json(todos);
        });
        this.getTodoById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id))
                return res.status(400).json({ error: 'ID argument is not a number' });
            // const todo= todos.find(todo => todo.id === id);
            const todo = yield postgres_1.prisma.todo.findFirst({
                where: {
                    id: id
                }
            });
            (todo)
                ? res.json(todo)
                : res.status(404).json({ error: `TODO with id ${id} not found` });
        });
        this.createTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, createTodoDto] = dtos_1.CreateTodoDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgres_1.prisma.todo.create({
                data: createTodoDto
            });
            // const newTodo = {
            //     id: todos.length + 1,
            //     text: text,
            //     completedAt: null,
            // };
            // todos.push(newTodo);
            res.json(todo);
        });
        this.updateTodoById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [error, updateTodoDto] = dtos_1.UpdateTodoDto.update(Object.assign(Object.assign({}, req.body), { id }));
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgres_1.prisma.todo.findFirst({
                where: { id }
            });
            if (!todo)
                return res.status(404).json({ error: `Todo with ${id} not found` });
            const updatedTodo = yield postgres_1.prisma.todo.update({
                where: { id },
                data: updateTodoDto.values
            });
            return res.json(updatedTodo);
        });
        this.deleteTodoById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id))
                return res.status(400).json({ error: 'ID argument is not a number' });
            // const todo= todos.find(todo => todo.id === id);
            const todo = yield postgres_1.prisma.todo.findUnique({
                where: {
                    id: id
                }
            });
            if (!todo)
                return res.status(404).json({ error: `Todo with ${id} not found` });
            // todos = todos.filter(todo => todo.id !== id);
            //todos.splice(todos.indexOf(todo), 1);
            const deletedTodo = yield postgres_1.prisma.todo.delete({
                where: {
                    id: id
                }
            });
            (deletedTodo)
                ? res.json(deletedTodo)
                : res.status(400).json({ error: `Todo with id ${id} not found` });
            return res.json({ todo, deletedTodo });
        });
    }
}
exports.TodosController = TodosController;
