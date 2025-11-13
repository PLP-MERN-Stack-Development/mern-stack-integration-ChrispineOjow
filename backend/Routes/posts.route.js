import {createPost, getPosts, getSpecificPosts, updatePost, deletePost} from "../Controllers/posts.controller";
import {Router}from "express"
import {body} from "express-validator";
import {handleValidationErrors} from "../middleware/errorHandler.middleware"

//Importing the comment router
import {commentRouter} from "./comments.route"

const router = Router()

router.use('/:postId/comments', commentRouter);

router.route("/")
    .get(getPosts)
    .post(
        .body('')
        createPost);

router.route("/:_id")
    .get(getSpecificPosts)
    .put(updatePost)
    .delete(deletePost);

export default router;
