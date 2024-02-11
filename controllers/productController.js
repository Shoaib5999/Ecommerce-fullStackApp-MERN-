import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs"


export const createProductController = async(req,res)=>{
try{
    const {name,slug,description,price,category,quantity,shipping}= req.fields
    const{photo}=req.files
    switch(true){
        case !name:
            return res.status(500).send({error:"Name Is Required"})
            case !slug:
            return res.status(500).send({error:"Slug Is Required"})
            case !description:
            return res.status(500).send({error:"Description Is Required"})
            case !price:
            return res.status(500).send({error:"Price Is Required"})
            case !category:
            return res.status(500).send({error:"Category Is Required"})
            case !quantity:
            return res.status(500).send({error:"Quantity Is Required"})
            case !photo || (photo && photo.size > 1000000):
    return res.status(500).send({ error: "Photo Is Required And Should Be <1mb" });

    }
    const products = new productModel({...req.fields,slug:slugify(name)})
    if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType =photo.type
    }
    await products.save()
    res.status(200).send({
        success:true,
        message:"Product Created Successfully",
        product:products,
    })

}catch(error){
    console.log(error)
    return res.status(500).send({
        success:false,
        message:"Error In Creating Product",
        error:error,
    })
}
}