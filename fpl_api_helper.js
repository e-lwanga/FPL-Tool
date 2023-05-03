const HTTPS = require('https');




exports.fetchBootstrapStatic=function(){
    return new Promise(function(resolve,reject){
        const requestOptions={
            method:"GET",
            host:"fantasy.premierleague.com",
            path:`/api/bootstrap-static/`,
        };
        const request=HTTPS.request(requestOptions,function(responseObj){
            let responsePayload="";
            responseObj.on("data",function(data){
                responsePayload+=data;
            });
            responseObj.on("end",function(){
                resolve(JSON.parse(responsePayload));
            });
        });
        request.on("error",function(e){
            reject(e);
        });
        request.end();
    });
}






exports.fetchManagerEntryData=function(managerId){
    return new Promise(function(resolve,reject){
        const requestOptions={
            method:"GET",
            host:"fantasy.premierleague.com",
            path:`/api/entry/${managerId}/`,
        };
        const request=HTTPS.request(requestOptions,function(responseObj){
            let responsePayload="";
            responseObj.on("data",function(data){
                responsePayload+=data;
            });
            responseObj.on("end",function(){
                resolve(JSON.parse(responsePayload));
            });
        });
        request.on("error",function(e){
            reject(e);
        });
        request.end();
    });
}






exports.fetchElementDetailedData=function(elementId){
    return new Promise(function(resolve,reject){
        const requestOptions={
            method:"GET",
            host:"fantasy.premierleague.com",
            path:`/api/element-summary/${elementId}/`,
        };
        const request=HTTPS.request(requestOptions,function(responseObj){
            let responsePayload="";
            responseObj.on("data",function(data){
                responsePayload+=data;
            });
            responseObj.on("end",function(){
                resolve(JSON.parse(responsePayload));
            });
        });
        request.on("error",function(e){
            reject(e);
        });
        request.end();
    });
}






exports.fetchManagerEntryEventData=function(managerId,eventId){
    return new Promise(function(resolve,reject){
        const requestOptions={
            method:"GET",
            host:"fantasy.premierleague.com",
            path:`/api/entry/${managerId}/event/${eventId}/picks/`,
        };
        const request=HTTPS.request(requestOptions,function(responseObj){
            let responsePayload="";
            responseObj.on("data",function(data){
                responsePayload+=data;
            });
            responseObj.on("end",function(){
                resolve(JSON.parse(responsePayload));
            });
        });
        request.on("error",function(e){
            reject(e);
        });
        request.end();
    });
}