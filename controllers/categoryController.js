import categoryModel from "../models/categoryModel.js"
import slugify from "slugify";
import productModel from "../models/productModel.js";
export const createCategoryController = async (req,res)=>{
    try{
        console.log("req.body", req.body);
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
    category,
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

export const deleteCategoryController = async (req, res) => {
    try {
      const { id } = req.params;
  
      const products = await productModel.find({category:id});
      if (products.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Category has products, cannot delete",
        });
      }
  
      const category = await categoryModel.findByIdAndDelete(id);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        category,
        message: "Deleted successfully",
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error in deleting category",
        error,
      });
    }
  };
  

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