var express = require('express');
var router = express.Router();

const responseWithResult = (success,status)=>{
    return {
        success,status
    };
};

const trueResult = (status)=>{
    return responseWithResult(true,status);
};

const falseResult = (status)=>{
    return responseWithResult(false,status);
};

const checkRestrictions = (params)=>{
    // children cannot be more than 3 times of number of adults
    if(params.children && params.children/3>params.adults){
        return falseResult('children are too many');
    }

    // infants cannot be more than 3 times of number of adults
    if(params.infants){
        if(params.infants/3>params.adults){
            return falseResult('infants are too many');
        }
        if(params.infants/3>3){ //only 3 infants per room and max 3 rooms
            return falseResult('infants requiring more than 3 rooms cannot be made in one booking');
        }
    }

    // restrictions passed
    return trueResult('pass');
};

const countTotalRooms = (params)=>{
    // convert all inputs to integer number to prevent calculation error
    const adults = params.adults;
    const children = params.children?params.children:0;
    const infants = params.infants?params.infants:0;

    const adults_space_usage = Math.ceil(adults/3);
    const children_space_usage = Math.ceil(children/3);

    // return the number of rooms per max guests number
    return Math.ceil(total_guests/9);
};

router.post('/', function(req, res, next) {
    // get the body
    let body = req.body;

    // get each param from the body
    let adults = body.adults;
    let children = body.children;
    let infants = body.infants;

    // adults must be present
    if(adults && adults>0){

        // check for restrictions
        if(!(results = checkRestrictions({adults,children,infants})).success){
            return res.send(results);
        }

        // process the counting
        total_rooms = countTotalRooms({adults,children,infants});

        // more than 3 rooms are not allowed for booking
        if(total_rooms>3){
            return res.send(falseResult('we cannot allow a booking with more than 3 rooms'));
        }

        // successful response with room number calculated
        return res.send(trueResult('total_rooms: '+total_rooms));
    }else{
        // unsuccessful response for the insufficient number of adults
        return res.send(falseResult('adult must be present'));
    }
});

module.exports = router;
