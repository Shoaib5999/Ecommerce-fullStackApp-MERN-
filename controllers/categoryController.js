import categoryModel from "../models/categoryModel.js"
import slugify from "slugify";
export const createCategoryController = async (req,res)=>{
    try{
        const {name}= req.body;
        if(!name) return res.status(401).send({message:"Name is required"})

        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory) return res.status(200).send({success:true,message:"Category Already Exist"})

        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(200).send({
            success:true,
            message:"New Category Created",
            category:category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error:error,
            message:"Error in category"
        })
    }
}

export const updateCategoryController = async (req,res)=>{
    try{
        const {name} =req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},
            {new:true}
        );
        console.log(category)
        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category:category,
        })

    }catch(error){
        console.error(error)
        res.status(500).send({
            success:false,
            error:error,
            message:"Error In Update Category"
        })
    }
}
//get all category 
export const getCategoryControlller = async(req, res)=>{
try{
const category = await categoryModel.find();
res.status(200).send({
    success:true,
    message:"Here's The List Of All Category",
    category:category,
})
}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error:error,
        message:"Error In Getting Categories"
    })
}
}

export const deleteCategoryController = async(req,res)=>{
    try{

        const category = await categoryModel.findByIdAndDelete({_id:req.params.id})
        console.log(category)
        res.status(204).send({
            success:true,
            category:category,
            message:"Deleted Succesfully",
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error:error,
            message:"Error In Deleting Category"
        })
    }
}

//single category controller
export const singleCategoryController = async(req,res)=>{
try{
const category = await categoryModel.findOne({_id:req.params.id})
res.status(200).send({
    success:true,
    message:"A Fetched Successfully",
    category:category,
    
})
}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error:error,
        message:"Unable To Get A Category"
    })
}
}