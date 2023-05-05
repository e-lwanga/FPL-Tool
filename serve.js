console.clear();
const EXPRESS = require('express');
const CORS=require("cors");
const PATH = require('path');
const FPL_API_HELPER=require("./fpl_api_helper");

const app = EXPRESS();

app.use(CORS()); //disable in production mode

app.get("/get-bootstrap-static",function(requestObj,responser){
  FPL_API_HELPER.fetchBootstrapStatic().then(function(data){
    // console.log(Object.keys(data));
    responser.send(JSON.stringify(data));
  }).catch(function(e){
    responser.statusCode=500;
    responser.send(`${e}`);
  });
});

app.get("/get-element-detailed-data/:elementId",function(requestObj,responser){
  FPL_API_HELPER.fetchElementDetailedData(requestObj.params.elementId).then(function(data){
    responser.send(JSON.stringify(data));
  }).catch(function(e){
    responser.statusCode=500;
    responser.send(`${e}`);
  });
});

app.get("/get-manager-entry-data/:managerId",function(requestObj,responser){
  FPL_API_HELPER.fetchManagerEntryData(requestObj.params.managerId).then(function(data){
    responser.send(JSON.stringify(data));
  }).catch(function(e){
    responser.statusCode=500;
    responser.send(`${e}`);
  });
});

app.get("/get-manager-entry-event-data/:managerId/:eventId",function(requestObj,responser){
  FPL_API_HELPER.fetchManagerEntryEventData(requestObj.params.managerId,requestObj.params.eventId).then(function(data){
    responser.send(JSON.stringify(data));
  }).catch(function(e){
    responser.statusCode=500;
    responser.send(`${e}`);
  });
});

// Serve static files from the "public" directory
app.use(EXPRESS.static(PATH.join(__dirname, 'build'),{
    index:"index.html",
}));


// Start the server
const port = process.env.PORT||80;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});