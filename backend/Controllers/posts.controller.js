import PostSchema from "../models/Post.model.js";
 // Create a post 
 export const createPost = async (req, res)=>{
    try{

        const {title,content, featuredImage, excerpt, author,category,tags,isPublished,viewCount,comments }= req.body;
        if(!title.trim()){
            return res.status(400).json({message:"Please enter the title"})

        }

        const newPost = new PostSchema({
            title,
            content,
            featuredImage,
            excerpt,
            author,
            category,
            tags,
            isPublished,
            viewCount,
            comments
        })

        const savedPost = await newPost.save();
         
        res.status(200).json({message:"Post successfully saved", savedPost});


    }catch(error){

        console.error("Could not save the Post", error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        })

    }
 }

 //Get all posts 
 export const getPosts = async (req, res)=>{
    try{

        const posts = await PostSchema.find()
            .populate("author","name username -_id")
            .populate("category","name slug description -_id")
            .sort({createdAt:-1});

        res.status(200).json({
            count:posts.length,
            posts
        })

    }catch(error){

        console.error("Error fetching posts ",error);
        res.status(500).json({message:"Server Error", error:error.message})
    }
 }

 //Get specific posts
 export const getSpecificPosts = async (req, res)=>{
    try {

        const {_id} = req.params
        const post = await PostSchema.findById(_id)
            .populate("author", "name username -_id")
            .populate("category", "name slug description -_id")

        res.status(200).json({
            post
        })       

    }catch(error){
        
        console.error("Their was an error in retrieving the post ",error )
        res.status(500).json({
            message:"Server error",
            error:error.message
        })

    }
 }

 //Update a post
 export const updatePost = async (req, res)=>{
    try{

        const {_id}=req.params
        const updatedPost = await PostSchema.findByIdAndUpdate(
            _id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        ).populate("author", "name username -_id")
        .populate("category", "name slug description -_id")

        res.status(200).json({
            updatedPost
        })


    }catch(error){

        console.error("An error occured ", error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        })

    }
 }

//Delete Post

 export const deletePost = async(res, res)=>{
    try{
        
        const {_id} = req.params
        if(!_id){
            console.log("The Post doesn't exist");
            return res.status(400).json({
                message:"The post doesn't exists",
            })
        }
    }catch(error){

        console.error("An error occured ",error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}
