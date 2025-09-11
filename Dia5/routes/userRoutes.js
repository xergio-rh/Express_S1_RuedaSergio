import {Router} from "express";


export function buildUserRouter(UserController){
    const router=Router();
    router.get("/",UserController.list);
    router.get("/:id",serController.get);
    router.get("/",UserController.create);
    router.get("/:id",UserController.update);
    router.get("/:id",UserController.delete);



    return router;
}