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