const express = require('express');
const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');
const app = express();
app.use(express.json());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,resp)=>{
    resp.render('chatbot');
});


const projectId = "mychatbot-degq";
const sessionClient = new dialogflow.SessionsClient({
    keyFilename : path.join(__dirname,"service-account.json")
});
const sessionPath = sessionClient.projectAgentSessionPath(projectId,'102');


app.post("/chat", async (req,resp)=>{
    let message = req.body.message;

    const request =  {
        session:sessionPath,
        queryInput: {
            text:{
                text : message,
                languageCode:'en'
            }
        }
    };
    try
    {
        const response = await sessionClient.detectIntent(request);
        var result = response[0].queryResult;
        var replymessage = result.fulfillmentText;
        return resp.status(200).json({"status":true,"message":replymessage});
    }
    catch(error)
    {
        return resp.status(500).json({"status":false,"message":error.message});
    }
})



app.listen(3000,()=>{
    console.log("Connected")
})