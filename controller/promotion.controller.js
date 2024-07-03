const {Promotion,PromotionType} = require('../models/promotion.model')

module.exports = {
    //promotion type

    //promotion
    postProduct : (req,res) =>{
        Promotion.create(req.body).then(result => {
            res.status(201).json({ message: "Success", data: result });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        })
    },
    getPromotions: (req,res)=>{
        Product.find() 
        .then(products => {
            console.log("Get Successfully!");
            res.status(200).json(products); 
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    },
    getPromotionID:(req,res)=>{
        const id = req.params.id;
        Promotion.findById(id) 
        .then(data => {
            res.status(200).json({ message: "Success", data: data }); 
        })
        .catch(err => {
            res.status(500).json({error: err });
        });
    },
    deletePromotion:async (req,res) =>{
        const id = req.params.id;
        await Promotion.findByIdAndDelete(id) 
        .then(data => {
            console.log('Delete Successfully!')
            res.status(500).json({message: "Delete Successfull!",});
        })
        .catch(err => {
            res.status(500).json({message: "Delete Fail", error: err });
        });
    },
    putPromotion:(req,res) =>{
        const id = req.params.id;
        Promotion.findByIdAndUpdate(id,req.body) 
        .then(result => {
            res.status(200).json({message: "Success",data: result}); 
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }
};