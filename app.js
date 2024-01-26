const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/87a94c2cff";

    const options = {
        method: "POST",
        auth: "srujan:19779a8cbb92c2199c5305a159c8a29e-us14"
    };

    const request = https.request(url, options, function(response) {
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end(); // Corrected the function call

    // Respond to the client indicating success or failure
    // res.send("Thank you for signing up!");
});


app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000!!");
});
