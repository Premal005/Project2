var express = require("express");
var app = express();

app.set('strict routing',true);
var mysql2 = require('mysql2');

var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;

let dbConfig="mysql://avnadmin:AVNS_teE4tAHv6zo87ATA6QG@mysql-bce-premal-7abb.i.aivencloud.com:16113/defaultdb"
let mySqlServer=mysql2.createConnection(dbConfig);

app.use(express.static("public"));

app.listen(2004,function(){
    console.log("Server Started");
})

app.get("/",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/public/index.html";
    resp.sendFile(fullpath);
})


app.get("/angular-http",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/public/angular-http.html";
    resp.sendFile(fullpath);
})

mySqlServer.connect(function(err){
    if(err!=null) 
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB")
    
})

app.get("/save-details",function(req,resp){

        if(req.query.z=="none"){
            resp.send("User type can't be none!")
        }
        else{
            mySqlServer.query("INSERT INTO users VALUES (?,?,?,CURDATE(),?)", [req.query.x, req.query.y, req.query.z,"1"], function (err) {
                if (err == null) {
                    resp.send("Signup Successful!!");
                } else {
                    resp.send("Duplicate Entry!");
                }
            });
        }
        
    
    
})

app.get("/login-details",function(req,resp){
    
    mySqlServer.query("SELECT * from users where email=? and pwd=?", [req.query.x, req.query.y], function (err,resultAry)
     {
        if (err == null) {

        if(resultAry.length==0)
           // resp.status(401).send("Invalid credentials");
             resp.send("Invalid User Id or Password");
        else if(resultAry[0].statuss == 1) {
                // resp.send("logged in successfully");
                resp.send(resultAry[0].utype);
            }
            else {
                resp.send("Blocked");
            }
    }
    else
    {
        resp.send(err.message)
    }
  }
);     
})


app.use(express.urlencoded(true));
app.use(fileUploader());

cloudinary.config({ 
    cloud_name: 'dspfowrvd',
    api_key: '562259851986422',
    api_secret: 'mR68LWGahOXNSOPL3xL-w1vryn8' // Click 'View API Keys' above to copy your API secret
}); 


app.post("/do-register", async function (req, resp) {
    
        let email = req.body.txtEmail1;
        let name = req.body.txtName;
        let Address = req.body.inputAddress;
        let City = req.body.txtCity;
        let Gender = req.body.txtGender;
        let Dateb = req.body.txtDate;
        let Qualification = req.body.txtQualification;
        let Occupation = req.body.txtOccupation;
        let Other = req.body.txtOther;
        let Contact = req.body.txtContact;
        let fileName;
        let fileName1; 

        if (req.files && req.files.ppic1) {
            let file = req.files.ppic1;
            let locationToSave = __dirname + "/public/uploads/" + file.name;
            await file.mv(locationToSave);
            let result = await cloudinary.uploader.upload(locationToSave);
            fileName = result.secure_url;
        }
        else{
            fileName = "nopic.jpg";
        }

        
        if (req.files && req.files.ppic2) {
            let file = req.files.ppic2;
            let locationToSave = __dirname + "/public/uploads/" + file.name;
            await file.mv(locationToSave);

            let result = await cloudinary.uploader.upload(locationToSave);
            fileName1 = result.secure_url;
        }
        else{
            fileName1 = "nopic.jpg";
        }

        mySqlServer.query("INSERT INTO volkyc (email, vname, contact, address, city, gender, dob, qualification, info, picpath, idpath, occupation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[email, name, Contact, Address, City, Gender, Dateb, Qualification, Other, fileName, fileName1, Occupation],
            function (err) {
                if (err == null) {
                    resp.send("Record Saved Successfully.. Badhaiiii");
                } else {
                    resp.send("Database Error: " + err.message);
                }
            }
        );
    
});

app.post("/do-update", async function(req,resp){

    let email = req.body.txtEmail1;
    let name = req.body.txtName;
    let Address = req.body.inputAddress;
    let City = req.body.txtCity;
    let Gender = req.body.txtGender;
    let Dateb = req.body.txtDate;
    let Qualification = req.body.txtQualification;
    let Occupation = req.body.txtOccupation;
    let Other = req.body.txtOther;
    let Contact = req.body.txtContact;
    let fileName;
    let fileName1; 

    if (req.files && req.files.ppic1) {
        let file = req.files.ppic1;
        let locationToSave = __dirname + "/public/uploads/" + file.name;
        await file.mv(locationToSave);
        let result = await cloudinary.uploader.upload(locationToSave);
        fileName = result.secure_url; 
    }
    else{
        fileName = req.body.hdnFrm1;
    } 
    
    if (req.files && req.files.ppic2) {
        let file = req.files.ppic2;
        let locationToSave = __dirname + "/public/uploads/" + file.name;
        await file.mv(locationToSave);

        let result = await cloudinary.uploader.upload(locationToSave);
        fileName1 = result.secure_url; 
    }
    else{
        fileName1 = req.body.hdnFrm2;
    }

    mySqlServer.query("UPDATE volkyc set vname=?, contact=?, address=?, city=?, gender=?, dob=?, qualification=?, info=?, picpath=?, idpath=?, occupation=? where email=?",[name, Contact, Address, City, Gender, Dateb, Qualification, Other, fileName, fileName1, Occupation,email],
        function (err) {
            if (err == null) {
                resp.send("Data Updated Successfully.. Badhaiiii");
            } else {
                resp.send("Database Error: " + err.message);
            }
        }
    )


})

app.get("/do-fetch",function(req,resp){
    mySqlServer.query("SELECT * from volkyc where email=?", [req.query.x],
        function (err,responseinAry) {
            resp.send(responseinAry)
        }
    );
})  


app.post("/do-client-register",function (req, resp) {
    
    let CID = req.body.txtCID;
    let CName = req.body.txtCName;
    let CFirm = req.body.txtCFirm;
    let CBP = req.body.txtCBP;
    let CAddress = req.body.txtCAddress;
    let CCity = req.body.txtCCity;
    let CContact = req.body.txtCContact;
    let CIDP = req.body.txtCIDP;
    let CIDPN = req.body.txtCIDPN;
    let COther = req.body.txtCOther;
    

    mySqlServer.query("INSERT INTO cprofile (email, Cname, business, bprofile, address, city, contact, idproof, idpnumber, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[CID, CName, CFirm, CBP, CAddress, CCity, CContact, CIDP, CIDPN, COther],
        function (err) {
            if (err == null) {
                resp.send("Record Saved Successfully.. Badhaiiii");
            } else {
                resp.send("Database Error: " + err.message);
            }
        }
    );

});

app.post("/do-client-update",function(req,resp){

    let CID = req.body.txtCID;
    let CName = req.body.txtCName;
    let CFirm = req.body.txtCFirm;
    let CBP = req.body.txtCBP;
    let CAddress = req.body.txtCAddress;
    let CCity = req.body.txtCCity;
    let CContact = req.body.txtCContact;
    let CIDP = req.body.txtCIDP;
    let CIDPN = req.body.txtCIDPN;
    let COther = req.body.txtCOther;

    

    mySqlServer.query("UPDATE cprofile set Cname=?, business=?, bprofile=?, address=?, city=?, contact=?, idproof=?, idpnumber=?, info=? where email=?",[CName, CFirm, CBP, CAddress, CCity, CContact, CIDP, CIDPN, COther,CID],
        function (err) {
            if (err == null) {
                resp.send("Data Updated Successfully.. Badhaiiii");
            } else {
                resp.send("Database Error: " + err.message);
            }
        }
    )


})

app.get("/do-fetch-client",function(req,resp){
    mySqlServer.query("SELECT * from cprofile where email=?", [req.query.x],
        function (err,responseinAry) {
            resp.send(responseinAry)
        }
    );
}) 

app.post("/post-job",function(req,resp){

    let Client= req.body.txtClient;
    let Job = req.body.txtJob;
    let part_time = req.body.part_time;
    let txtAddress = req.body.txtAddress;
    let txtCity = req.body.txtCity;
    let txtEdu = req.body.txtEdu;
    let txtContact = req.body.txtContact;


    mySqlServer.query("INSERT INTO JOBS (jobid, cid, jobtitle, jobtype, address, city, education, contact) VALUES (null, ?, ?, ?, ?, ?, ?, ?)",[Client, Job, part_time, txtAddress, txtCity, txtEdu, txtContact],
        function (err) {
            if (err == null) {
                resp.send("Record Saved Successfully.. Badhaiiii");
            } else {
                resp.send("Database Error: " + err.message);
            }
        }
    );

})

//-Angular AJAX

app.get("/all-records",function(req,resp){
    mySqlServer.query("select * from curdTable",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/do-delete-one",function(req,resp){
    let userMail=req.query.emailKuch;

    mySqlServer.query("delete from curdTable where email=?",[userMail],function(err,result){

        if(err==null){
            if(result.affectedRows==1){
                resp.send("Record Deleted Successfully");
            }
            else{
                resp.send("Invalid User Id");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})


app.get("/do-fetch-l",function(req,resp){


    if(req.query.emailKuch=="All"){
        query="select * from curdTable";
    }
    else
        query="select * from curdTable where email=?"
    mySqlServer.query(query,[req.query.emailKuch],function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/client-manager",function(req,resp){
    mySqlServer.query("select * from cprofile",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/volunteer-manager",function(req,resp){
    mySqlServer.query("select * from volkyc",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/check-vol-block",function(req,resp){
    mySqlServer.query("select statuss from users where email=? and utype=?",[req.query.emailKuch,'volunteer'],function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/vol-block",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=? and utype=?",[0,req.query.emailKuch,'volunteer'],function(err,result)
    {
        if(err==null){
            if(result.affectedRows===1){
                resp.send("Volunteer has been Blocked");
            }
            else {
                resp.status(404).send("No volunteer found with this email");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/vol-Unblock",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=?",[1,req.query.emailKuch,'volunteer'],function(err,result)
    {
        if(err==null){
            if(result.affectedRows===1){
                resp.send("Volunteer has been Unblocked");
            }
            else {
                resp.status(404).send("No volunteer found with this email");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/checkblockstatuss",function(req,resp){
    mySqlServer.query("select statuss from users where email=? and utype=?",[req.query.emailKuch,'client'],function(err,result)
    {
        if(err==null){
           
            resp.send(result);
            
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/client-block",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=? and utype=?",[0,req.query.emailKuch,'client'],function(err,result)
    {
        if(err==null){
            if(result.affectedRows===1){
                resp.send("Client has been Blocked");
            }
            else {
                resp.status(404).send("No Client found with this email");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/client-Unblock",function(req,resp){
    mySqlServer.query("update users set statuss=? where email=? and utype=?",[1,req.query.emailKuch,'client'],function(err,result)
    {
        if(err==null){
            if(result.affectedRows===1){
                resp.send("Client has been Unblocked");
            }
            else {
                resp.status(404).send("No Client found with this email");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})


//------------access all cities of client post
app.get("/all-records-client-city", function (req, resp) {
    mySqlServer.query("select distinct city from JOBS ", function (err, result) {
        resp.send(result);
    })
})
//-----------access all job titles of client post
app.get("/all-records-client-title", function (req, resp) {
    mySqlServer.query("select distinct jobtitle from JOBS ", function (err, result) {
        resp.send(result);
    })
})

app.get("/all-jobs", function (req, resp) {
    mySqlServer.query("select * from JOBS ", function (err, result) {
        resp.send(result);
    })
})



app.get("/search-job", function (req, resp) {
    mySqlServer.query("select * from JOBS where city=? and jobtitle=? and education=? ",[req.query.Citykuch,req.query.Jobtitle,req.query.edu], function (err, result) {
        resp.send(result);
    })
})

app.get("/do-get-jobs",function(req,resp){
    mySqlServer.query("select * from JOBS where cid=?",[req.query.emailKuch], function (err, result) {
        resp.send(result);
    })
})

app.get("/do-delete-jobs",function(req,resp){
    mySqlServer.query("DELETE FROM JOBS WHERE cid=? and jobtitle=? and jobtype=? and address=? and city=? and education=? and contact=?",[req.query.emailKuch,req.query.jobTitle,req.query.jobtype,req.query.location,req.query.city,req.query.edu,req.query.contact], function (err, result) {
        resp.send(result);
    })
})