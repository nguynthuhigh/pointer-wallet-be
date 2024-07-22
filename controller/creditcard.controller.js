const {CreditCard} = require('../models/creditcard.model')
const cryptoJS = require('../utils/crypto-js')
const ccType = require('../utils/cctype')
const {Response} = require('../utils/response')
module.exports = {
    addcard: async (req,res,next)=>{
       try {
        const userID = req.user
        const {number,name,cvv,expiryMonth,expiryYear,type} = req.body
        const typeCard = ccType.getCardType(number.replace(/\s+/g, ''))
        if(!typeCard){return Response(res,"Thẻ không hợp lệ",null,400)}
        const card = await CreditCard.find({userID:userID,number:number})
        if (card.length === 0){
            CreditCard.create({
                name:name,
                number:number,
                cvv:cvv,
                expiryMonth:expiryMonth,
                expiryYear:expiryYear,
                userID:userID,
                type:typeCard
            }).then(data =>{
                res.json({message:"Success",data:data})
            }).catch(err=>{
                res.status(400).json({error:err})
            })
        }
        else{
            res.status(400).json({message:"Thẻ đã tồn tại"})
        }
       } catch (error) {
            res.status(400).json({error:error})
       }
    },
    getCardS:async(req,res,next)=>{
        const userID = req.user
       try {
            const card = await CreditCard.find({userID:userID})
            if(card.length != 0){
                let list_card = []
                card.forEach(element => {
                    const decrypt = {
                            _id: element._id,
                            number: element.number,
                            type:element.type
                        }
                    list_card.push(decrypt)
                }); 
                res.status(200).json({message:"Success",data:list_card})
            }
            else{
                res.status(400).json({message:"Bạn chưa thêm thẻ"})
            }
       } catch (error) {
            res.status(400).json({error:error})
       }
    
    },
    getCardDetails: async (req, res) => {
        const id = req.params.id;
        try {
            const card = await CreditCard.findOne({ _id: id });
            if (!card) {
                return res.status(404).json({ message: "Card not found" });
            }
            const cardDecypt = {
                name: cryptoJS.decrypt(card.name),
                number: card.number,
                cvv: cryptoJS.decrypt(card.cvv),
                expiryMonth: cryptoJS.decrypt(card.expiryMonth),
                expiryYear: cryptoJS.decrypt(card.expiryYear),
                type:card.type
            }
            res.status(200).json({ message: "Success", data: cardDecypt });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    editCard:async (req,res)=>{
        const {cardID,name,number,cvv,expiryMonth,expiryYear} = req.body
        await CreditCard.findOneAndUpdate({_id:cardID},{name:name,number:number,cvv:cvv,expiryYear:expiryYear,expiryMonth:expiryMonth})
        .then(data=>{
            res.status(200).json({message:"Success",data})
        }).catch(err=>{
            res.status(400).json({error:err})
        })
 
    },
    deleteCard:async (req,res)=>{
        const id = req.params.id
        const data = await CreditCard.findOneAndDelete({_id:id})
        if(data === null){
            res.status(400).json({message:"Không tìm thấy thẻ"})
        }
        else{
            res.status(200).json({message:"Success"})
        }
    }
}