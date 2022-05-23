import user from '../models/User.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv/config';

let sisToken;

const controller = {
    createUser: (req, res) => {
        user.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password

        }).then( () => {
            return res.status(200).json({
                error: false,
                msg: "usuário adicionado"
            });
        }).catch(() => {
            return res.status(400).json({
                error: true,
                msg: "não foi possivel adicionar o usuário."
            });
        });
    },

    login: (req, res, next) => {
        user.findAll({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        }).then( admin => {
            const id = admin[0].id;

            sisToken = jwt.sign({id}, process.env.SECRET,  {
                expiresIn: '24h'
            });

            return res.status(200).json({
                error: false,
                msg: "Login realizado com sucesso",
                auth: true,
                token: sisToken
            });
        }).catch( (e) => {
            return res.status(200).json({
                error: true,
                msg: "Login inválido",
                auth: false,
                token: null
            });
        });
    },  

    verifyJWT: (req, res, next) => {
        const token = sisToken;

        if (!token) {
            return res.status(400).json({
                auth: false,
                message: "Não há um token válido"
            })
        }

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    auth: false,
                    message: "Falha ao autenticar token"
                })
            }
            
            req.id = decoded.id;
            next();
        });
    },

    getUsers: (req, res) => {
        user.findAll().then( (tasks) => {
            return res.status(200).json({
                error: false,
                msg: "dados encontrados",
                tasks
            });
        }).catch(() => {
            return res.status(400).json({
                error: true,
                msg: "não foi possivel encontrar os dados."
            });
        });
    },

    getUser: (req, res) => {
        user.findAll({where: { id: req.body.id }}).then(user => {
            return res.status(200).json({
                error: false,
                msg: "usuário encontrado",
                user
            });
        }).catch(() => {
            return res.status(400).json({
                error: true,
                msg: "não foi possivel encontrar o usuário."
            });
        });
    },

    updateUser: (req, res) => {
        user.update({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            return res.status(200).json({
                error: false,
                msg: "usuário atualizado"
            })
        }).catch(() => {
            return res.status(400).json({
                error: true,
                msg: "não foi possível atualizar o usuário"
            });
        });;
    },

    deleteUser: (req, res) => {
        user.destroy({where: { id: req.body.id }}).then(() => {
            return res.status(200).json({
                error: false,
                msg: "usuário deletado",
            });
        }).catch(() => {
            return res.status(400).json({
                error: true,
                msg: "não foi possivel deletar o usuário."
            });
        });
    }
};

export default controller;