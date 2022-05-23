import { Router } from 'express';
import taskController  from './controllers/TaskController.js';
import userController from './controllers/UserController.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        "statusCode": 200
    });
});

// Task
router.post('/task',  userController.verifyJWT, taskController.createTask);
router.get('/tasks', userController.verifyJWT, taskController.getTasks);
router.get('/task', userController.verifyJWT, taskController.getTask);
router.put('/task', userController.verifyJWT, taskController.updateTask);
router.delete('/task', userController.verifyJWT, taskController.deleteTask);

// User
router.post('/user', userController.createUser);
router.get('/users', userController.verifyJWT, userController.getUsers);
router.get('/user', userController.verifyJWT, userController.getUser);
router.put('/user', userController.verifyJWT, userController.updateUser);
router.delete('/user', userController.verifyJWT, userController.deleteUser);
router.post('/user/login', userController.login);

export default router;