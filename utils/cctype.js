const ccType = require('credit-card-type');
module.exports ={
    getCardType:(number) =>{
        const cardTypes = ccType(number);
        if (cardTypes.length > 0) {
            return cardTypes[0].type; 
        } else {
            false
        }
    }
}