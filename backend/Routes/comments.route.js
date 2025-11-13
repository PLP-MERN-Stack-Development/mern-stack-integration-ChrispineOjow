import {Router} from "express";
import {getPostComments,addComment} from "../Controllers/comment.controller";
import {body} from "express-validator";
import {handleValidationErrors} from "../middleware/errorHandler.middleware"

const commentRouter = Router({mergeParams:true});// This allows this ruter to acces postId from teh parent router



commentRouter.route('/')
    .get(getPostComments)
    .post(
        body('content')
            .trim()
            .notEmpty().withMessage('Comment content is required'),
        body('userId')
            .isMongoId().withMessage("Invalid user Id format"),

        handleValidationErrors,
        
        addComment);

//The final path is /api/posts/:postId/comments


export default commentRouter;

 
