import PostSchema from "../models//Post.model.js"

export const addComment = async(req, res)=>{
   

    const {postId}=req.params
    const{userId, content} = req.body

    if(!content || !content.trim()){
        return res.status(400).json({message:"Comment content is required"})
    }
    if(!userId){
        return res.status(401).json({message:"User Id is missing or unauthorized"})
    }

    try{

        const newComment = {
            user: userId,
            content: content
        };

        const updatedPost = await PostSchema.findByIdAndUpdate(
            postId,
            {
                $push:{comments : newComment}
            },
            {
                new:true,
                runValidators:true
            }
        ).select('comments');//Selct only the comment array for the response

        if(!updatedPost){
            return res.status(404).json({message:"Post not found"});
        }

        const savedComment = updatedPost.comments[updatedPost.comments.length -1]
        
        res.status(201).json({
            message:"Comment successfully added",
            comment: savedComment
        })


    }catch(error){

        console.error("Error adding comment:", error);
        res.status(500).json({
            message:"Server Error: Could not add comment",
            error:error.message
        })

    }
}

export const getPostComments = async (req, res)=> {

    try{

        const {PostId}=req.params
        const post = await PostSchema.findById(PostId)
            .select("comments")
            .populate({
                path:'comments.user',
                select: "name username -_id"
            });
        
            if(!post){
                console.log("The post doesn't exists");
                return res.status(404).json({
                    message:"The post doesnt exist"
                });
            };

            res.status(200).json({

                count:post.comments.length,
                comments:post.comments
                
            }); 

    }catch(error){

        console.error("Server error", error);
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}

