import mongoose from "mongoose";

const Category = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        maxlength:[200, 'Description cannot be more than 200 characters' ]
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]

} , {
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
    }
);

//Creating a slug from name before saving a new category
Category.pre('save', function (next){
    if(!this.isModified('name')){
        return next();
    }

    //Simple slug generation 
    this.slug = this.name
        .toLowerCase()
        .replace(/[^\w]+/g,'')
        .replace(/-+/g,'-');

    next();

});

//Virtual to category URL
Category.virtual('url').get(function () {
    return `/categories/${this.slug}`
});

export default mongoose.model('Category',Category);