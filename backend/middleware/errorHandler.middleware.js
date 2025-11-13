import {validationResult} from "ecpress-validator";

export const handleValidationErrors = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // If error exists send a 400 Bad Request response
        return res.status(400).json({errors:errors.array()})
    }//If no error exists pass control to the next middleware

    next()
}
