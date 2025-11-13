import Category from "../models/Category.model.js";

//Creating a category
export const createCategory = async (req, res)=>{

    try{

        const {name,  description} = req.body
        if(!name || !name.trim()){ //Validation check of the entry of name
            console.log("Cannot have empty field in name");
            return res.status(400).json({message:"Please enter the name"})
        }
        const newCategory = new Category({
            name,
            description
        })
        const savedCategory =await  newCategory.save();
        res.status(200).json({message:"Category successfully created", savedCategory})


    }catch(error){

        console.error("Sever Error ", error);
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}

//Get all categories
export const getCategories = async (req, res)=>{
    try{

        const categories = await Category.find()
            .populate({
                path: "posts",
                select: "title content featuredImage author  ",
                populate:{
                    path:"author",
                    select:"username name -_id"
                }
            }).sort({createdAt:-1});

        res.status(200).json({
            count:categories.length,
            categories
        })

    }catch(error){

        console.error("Server error");
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}