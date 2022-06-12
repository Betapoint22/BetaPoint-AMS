const express = require('express');
const cors = require('cors');
const mssql = require('mssql');
const nodemailer = require('nodemailer');
const moment = require('moment');

const port = 3000;

let app = express();

app.use(express.urlencoded({extended : false}));
app.use(
    cors({
        origin : '*',
        methods : ['GET', 'POST', 'PUT' , 'DELETE'],
        allowHeaders : ['Content-Type']
    })
);

const sqlConfig = {
    server: 'betapoint.database.windows.net',
    user : 'ams',
    password : 'Soulsvciot01',
    database : 'betap',
    // pool : {
    //     max : 10,
    //     min : 1,
    //     idleTimeoutMillis : 3000
    // },
    options : {
        encrypt : true,
        trustServerCertificate : false
    }
}

mssql.connect(sqlConfig, (err, result)=>{
    if(err) throw err
    else{
        console.log('connected to db');
    }
});

let transporter = nodemailer.createTransport({
    host : 'smtp.mail.yahoo.com',
    port: 465,
    service : 'yahoo',
    secure : false,
    auth : {
        user : 'assetsoul@yahoo.com',
        pass : 'tjyfimogvchahdja'
    },
    debug : false,
    logger : true
});

app.listen(port, ()=>{
    console.log('Listening on port : ' + port);
}).on('error', (err)=>{
    console.log('Error occurred : ' + err.message);
});

app.post('/login', (req, res)=>{
    // 1 - code for success
    // 0 - code for failure

    let userEmail = req.body.userEmail.toLowerCase();
    let userPass = req.body.userPass.toLowerCase();

   let query0 = `SELECT dept_work FROM Employees INNER JOIN Users ON Employees.emp_no = Users.user_id WHERE Users.email = '${userEmail}' AND Users.password = '${userPass}'`;
   let query1 = `INSERT INTO Session(users, start_time, session_status) values('${userEmail}', '${moment().format('hh:mm:ss')}', 'open')`;

   let queryResult0 = mssql.query(query0, (err0, result0)=>{
       if(err0) throw err0
       else if(result0.recordset.length > 0){
            let queryResult1 = mssql.query(query1, (err1, result1)=>{
                if(err1) throw err1
                else{
                    res.send(['1', Object.values(result0.recordset[0])[0]]);
                }
            })
       }
       else{
           console.log('user not found');
           res.send(['0']);
       }
   })
});
app.post('/logout', (req, res)=>{
    // 1 - success
    // 0 - failure

    let userEmail = req.body.userEmail;
    let query0 = `UPDATE Session SET end_time = '${moment().format('hh:mm:ss')}' , session_status = 'closed' WHERE users = '${userEmail}' AND session_status = 'open'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) {
            console.log('error in err0 in /logout');
            res.send('0');
        }
        else{
            res.send('1');
        }
    })
});

app.post('/reqAccess', (req, res)=>{

    // 1 - code for success
    // 0 - code for failure

    let appName = req.body.appName.replace(/\s+/g, " ").trim().toLowerCase();
    let appID = req.body.appID.toLowerCase();
    let appEmail = req.body.appEmail.toLowerCase();
    let appContact = req.body.appContact.toLowerCase();
    
    let firstName = appName.split(" ")[0];
    let lastName = appName.split(" ")[1];
    let uName = appName.replace(/\s+/g, " ").trim();
    // console.log(firstName.length);
    // console.log(lastName.length);

    let adminMail = '1804407@kiit.ac.in';
    let adminMailSubject = 'Access Request';
    let adminMailMsg = `Access request recived from ${appName} with ID : ${appID}. If needed, kindly contact the applicant at ${appContact} or at ${appEmail}`;

    let receiverMail = 'sayantansnt@gmail.com';
    let receiverMailSubject = 'Received request for access';
    let receiverMailMsg = `Request received. Our team will review your request and send a follow up mail`;

    let query = `SELECT * FROM Access_request WHERE applicant_id = '${appID}' AND Request_status = 'Pending'`;
    let query0 = `SELECT * FROM Employees WHERE emp_no = '${appID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
    let query1 = `SELECT * FROM Users WHERE user_id = '${appID}' AND user_name = '${uName}'`
    let query2 = `SELECT * FROM Users WHERE email = '${appEmail}'`;
    let query3 = `INSERT INTO Access_request(applicant_name, applicant_id, email, date, contact)values('${uName}','${appID}','${appEmail}','${moment().format('YYYY-MM-DD')}','${appContact}')`;

    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length == 1){
            let queryResult = mssql.query(query, (err, result)=>{
                if(err) throw err
                else if(result.recordset.length == 0){
                    // requestor is a valid employee
                    let queryResult1 = mssql.query(query1, (err1, result1)=>{
                        if(err1) throw err1
                        else if(result1.recordset.length == 0){
                            // requestor is not an existing user
                            let queryResult2 = mssql.query(query2, (err2, result2)=>{
                                if(err2) throw err2
                                else if(result2.recordset.length == 0){
                                    // requestors email is not present in any of the existing users records
                                    let queryResult3 = mssql.query(query3, (err3, result3)=>{
                                        if(err3) throw err3
                                        else{
                                            //  record inserted into the access request table
                                            let adminMailResponse = sendEmail(adminMail,adminMailSubject, adminMailMsg);
                                            let receiverMailResponse = sendEmail(receiverMail, receiverMailSubject, receiverMailMsg);
                                            res.send(['1','Kindly check your mail']);
                                        }
                                    })
                                }
                                else{
                                    // query2 else. email given by the requestor is present in another user record and hence cannot be accepted
                                    res.send(['0','Provided email already in use']);
                                }
                            })
                        }
                        else{
                            // query1 else. Requestor is an existing user
                            res.send(['0','User exists']);
                        }
                    });
                }
                else{
                    // query0 else. Not a valid employee
                    res.send(['0','previous request havent been resolved']);
                }
            });
        }
        else{
            // unresolved request exists
            res.send(['0','Kindly check your credentials']);
        }
    })
})

app.post('/reqAsset', (req, res)=>{

    // 1 - code for success
    // 0 - code for failure

    let reqName = req.body.reqName.toLowerCase();
    let reqID = req.body.reqID.toLowerCase();
    let assetDept = req.body.assetDept.toLowerCase();
    let assetID = req.body.assetID.toLowerCase();
    let startingPoint = req.body.source.toLowerCase();
    let destination = req.body.destination.toLowerCase();

    let firstName = reqName.split(" ")[0];
    let lastName = reqName.split(" ")[1];

    // check if the requestor is a valid employee or not and retrieve their dept
    let query0 = `SELECT dept_work FROM Employees WHERE emp_no = '${reqID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
    // check if the entered asset id and its corresponding dept matches a record. Also check if the requestors department matdches the assets department
    let query1 = `SELECT dept_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${assetDept}' AND asset_id = '${assetID}'`;
    // check if the entered starting point and destination are valid or not
    let query2 = `SELECT * FROM location WHERE location_name = '${startingPoint}'  OR location_name = '${destination}'`;
    // check if asset is already present in the requested destination or not 
    let query3 = `SELECT location_name FROM assets INNER JOIN location ON assets.location_id = location.location_id WHERE asset_id = '${assetID}'`;
    // check if there are any request pending for the requested asset
    let query4 = `SELECT * FROM Movement_request WHERE asset_id = '${assetID}' AND Request_status = 'pending'`;
    // check if there is an ongoing activity regarding the asset that has been requested
    let query5 = `SELECT * FROM Activity INNER JOIN assets ON assets.tag_id = Activity.tag_id WHERE asset_id = '${assetID}'`;
    // Insert the request into the Movement request table
    let query6 = `INSERT INTO Movement_request(asset_id, starting_point, destination, date, time, requester_name, requester_id)values('${assetID}', '${startingPoint}', '${destination}', '${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}', '${reqName}', '${reqID}')`;


    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0){
            console.log('error in /reqAsset query 0');
        }
        else if(result0.recordset.length > 0){
            let emp_dept = Object.values(result0.recordset[0])[0];
            let queryResult1 = mssql.query(query1, (err1, result1)=>{
                if(err1){
                    // console.log('error in /reqAsset query 1');
                    
                }
                else if(result1.recordset.length > 0 ){
                    if(emp_dept == Object.values(result1.recordset[0])[0]){
                        // dept of requestor and asset matches
                        let queryResult2 = mssql.query(query2, (err2, result2)=>{
                            if(err2){
                                console.log('error in /reqAsset query 2'); 
                            }
                            else if(result2.recordset.length == 2){
                                let queryResult3 = mssql.query(query3,(err3, result3)=>{
                                    if(err3){
                                        console.log('error in /reqAsset query 3');
                                    }
                                    else if(result3.recordset.length > 0){
                                        if(startingPoint == Object.values(result3.recordset[0])[0]){
                                            if(destination != Object.values(result3.recordset[0])[0]){
                                                let queryResult4 = mssql.query(query4, (err4, result4)=>{
                                                    if(err4){
                                                        console.log('error in /reqAsset query 4');
                                                    }
                                                    else if(result4.recordset == 0){
                                                        let queryResult5 = mssql.query(query5, (err5, result5)=>{
                                                            if(err5){
                                                                console.log('error in /reqAsset query 5');
                                                            }
                                                            else if(result5.recordset.length == 0){
                                                                let queryResult6 = mssql.query(query6, (err6, result6)=>{
                                                                    if(err6){
                                                                        // console.log('error in /reqAsset query 6');
                                                                        throw err6
                                                                    }
                                                                    else{
                                                                        // data passed all the checks
                                                                        res.send(['1', 'Request received.']);
                                                                    }
                                                                })
                                                            }
                                                            else{
                                                                // asset is on the move or have been approved for movement / the asset is being moved
                                                                res.send(['2', 'Requested asset is being moved']);
                                                            }
                                                        })
                                                    }
                                                    else{
                                                        // request for the requested asset is pending 
                                                        res.send(['2', 'Unresolved request for the asset exists']);
                                                    }
                                                })
                                            }
                                            else{
                                                // asset is present in the destination
                                                res.send(['2', 'Asset already present at the destination']);
                                            }
                                        }
                                        else{
                                            // wrong starting point for the requested asset
                                            res.send(['2', 'Invalid starting point for the asset']);
                                        }
                                    }
                                    else{
                                        // the asset is either present in the requested location or the asset is not present in the provided starting location
                                        res.send(['2', 'The asset is either present in the requested location or is not present at the requested starting location']);
                                    }
                                })
                            }
                            else{
                                // either the starting point or the destination doesnt match the value
                                res.send(['2', 'Either the starting point or the destination is not valid']);
                            }
                        })
                    }
                    else{
                        // requested asset exists but the user cannot request for it
                        res.send(['2', 'User unauthorized to request the asset']);
                    }
                }
                else{
                    // requested asset does not exist
                    res.send(['2', 'Requested asset does not exist']);
                }
            })
        }
        else{
            // requestor is not a valid employee
            res.send(['2', 'Invalid employee credentials']);
        }
    });
});


app.post('/contactUs',(req, res)=>{
    let visitorName = req.body.visitorName;
    let visitorID = req.body.visitorID;
    let visitorMsg = req.body.visitorMsg;
    
    let firstName = visitorName.split(" ")[0];
    let lastName = visitorName.split(" ")[1];


    let adminMail = '1804407@kiit.ac.in';
    let adminMailSubject = 'Contact us mail';

    let query0 = `SELECT * FROM Employees WHERE emp_no = '${visitorID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(result0.recordset.length > 0){
            let mailResponse = sendEmail(adminMail, adminMailSubject, visitorMsg);
            if(mailResponse == 1){
                res.send('1');
            }
            else{
                res.send('0');
            }
        }
        else{
            // visitor not allowed to send a mail
        }
    })
});

function sendEmail(addr, subject, msg){
    let mailOptions= {
        from : 'assetsoul@yahoo.com',
        to : addr,
        subject : subject,
        text : msg
    }

    transporter.sendMail(mailOptions, (err, data)=>{
        if(err){
            console.log(`Failed to send the mail to ${addr}`);
            return 0;
        }
        else{
            console.log(`Mail sent to : ${addr}`);
            return 1;
        }
    })
}

// Dashboard page

app.post('/setCards', (req,res)=>{
    let arr = [];

    let dept = req.body.userDept;

    // count the total number of assets in the department
    let query0 = `SELECT COUNT(*) FROM assets WHERE dept_id = (SELECT dept_id FROM department WHERE dept_name = '${dept}')`;
    // count the total number of assets on move that belong to that department
    let query1 = `SELECT COUNT(*) FROM Activity INNER JOIN assets ON assets.tag_id = Activity.tag_id WHERE dept_id = (SELECT dept_id FROM department WHERE dept_name = '${dept}')`;
    // using the above two results count the number of assets available for movement in that department
    // count the total number of tags available in that department
    let query2 = `SELECT count(*) FROM tags INNER JOIN department ON tags.dept_id = department.dept_id WHERE dept_name = '${dept}'`;
    // count the number of tags that have been assigned to an asset in that department
    let query3 = `SELECT count(*) FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE tag_id IS NOT NULL AND dept_name = '${dept}'`;
    // using the above two results count the number of taga available for assignment in that department
    // count the total number of readers in that department
    let query4 = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE dept_name = '${dept}'`;
    // count the number of readers online for that department
    let query5  = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE reader_status = 'Connected' AND dept_name = '${dept}'`;
    // count the number of readers offline for that department
    let query6 = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE reader_status = 'Disconnected' AND dept_name = '${dept}'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else{
            let val0 = Object.values(result0.recordset[0])[0]; // total number of assets
            arr.push(val0); 
            let queryResult1 = mssql.query(query1, (err1, result1)=>{
                if(err1) throw err1
                else{
                    let val1 = Object.values(result1.recordset[0])[0]; // assets on move that belong to the department
                    arr.push(val0 - val1); // assets that are not on the move
                    arr.push(val1);
                    let queryResult2 = mssql.query(query2, (err2, result2)=>{
                        if(err2) throw err2
                        else{
                            let val2 = Object.values(result2.recordset[0])[0]; // total number of tags assigned to a department
                            arr.push(val2);
                            let queryResult3 = mssql.query(query3, (err3, result3)=>{
                                if(err3) throw err3
                                else{
                                    let val3 = Object.values(result3.recordset[0])[0]; // total number of tags assigned to assets
                                    arr.push(val2 - val3); // total number of tags that have not been assigned to assets
                                    arr.push(val3);
                                    let queryResult4 = mssql.query(query4, (err4, result4)=>{
                                        if(err4) throw err4
                                        else{
                                            let val4 = Object.values(result4.recordset[0])[0]; // count the total number of readers in that department
                                            arr.push(val4);
                                            let queryResult5 = mssql.query(query5, (err5, result5)=>{
                                                if(err5) throw err5
                                                else{
                                                    let val5 = Object.values(result5.recordset[0])[0]; // count the total number of readers in that department that are online
                                                    arr.push(val5);
                                                    let queryResult6 = mssql.query(query6, (err6, result6)=>{
                                                        if(err6) throw err6
                                                        else{
                                                            let val6 = Object.values(result6.recordset[0])[0]; // count the total number of readers in that department that are offline
                                                            arr.push(val6);
                                                            res.send(arr);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

app.post('/getChartData', (req, res)=>{
    let arr = [
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        [120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
    ];
    res.send(arr);
})
app.post('/setTable', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT TOP(20) Movement_request.serial,Movement_request.asset_id,Movement_request.date, Movement_request.time,Movement_request.custodian_name,Movement_request.custodian_id,Movement_request.requester_name,Movement_request.requester_id,Movement_request.Request_status,Movement_request.starting_point,Movement_request.destination  FROM Movement_request INNER JOIN assets ON assets.asset_id = Movement_request.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}';`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else{
            res.send(result0.recordset);
        }
    })
})

app.post('/getTileData', (req, res)=>{   
    let query0 = `SELECT dept_name, count(*) as Total from assets INNER JOIN department ON assets.dept_id = department.dept_id group by dept_name`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else{
            let depts = [];
            let items = [];
            let arr = [];
                for(x in result0.recordset){
                    depts.push(Object.values(result0.recordset[x])[0]);
                    items.push(Object.values(result0.recordset[x])[1]);
                }
                arr.push(depts, items);
                res.send(arr);
        }
    })
})

app.post('/getPerformanceData', (req, res)=>{
    let specName = [];
    let specValue = [];
    let performance = [];

    let query0 = `SELECT TOP 1 * FROM Performance`;
    let queryResult0  = mssql.query(query0, (err0, result0)=>{
        specName = Object.keys(result0.recordset[0]);
        specValue = Object.values(result0.recordset[0]);

        performance.push(specName, specValue);
        res.send(performance);
    })
})

// alerts page 

app.post('/alertCard', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${dept}'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length > 0){
            res.send(Object.values(result0.recordset[0])[0].toString());
        }
    })
})
app.post('/totalAlertsTable', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Alert.alert_id, Alert.reader_id, Alert.tag_id, Alert.location_name, Alert.alert_status, Alert.alert, Alert.room_name, Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${dept}' order by date desc, time desc`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length > 0){
            res.send(result0.recordset);
        }
    })
})


// requests page

app.post('/reqCards', (req, res)=>{
    let arr = [];
    let dept = req.body.userDept;
    let query0 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}'`;
    let query1 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Pending'`;
    let query2 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Approved'`;
    let query3 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Denied';`
    let query4 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}'`;
    let query5 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Pending'`;
    let query6 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Approved'`;
    let query7 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Denied'`;

    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length > 0){
            arr.push(Object.values(result0.recordset[0])[0]);
            let queryResult1 = mssql.query(query1, (err1, result1)=>{
                if(err1) throw err1
                else if(result1.recordset.length > 0){
                    arr.push(Object.values(result1.recordset[0])[0]);
                    let queryResult2 = mssql.query(query2, (err2, result2)=>{
                        if(err2) throw err2
                        else if(result2.recordset.length > 0){
                            arr.push(Object.values(result2.recordset[0])[0]);
                            let queryResult3 = mssql.query(query3, (err3, result3)=>{
                                if(err3) throw err3
                                else if(result3.recordset.length > 0){
                                    arr.push(Object.values(result3.recordset[0])[0]);
                                    let queryResult4 = mssql.query(query4, (err4, result4)=>{
                                        if(err4) throw err4
                                        else if(result4.recordset.length > 0){
                                            arr.push(Object.values(result4.recordset[0])[0]); 
                                            let queryResult5 = mssql.query(query5, (err5, result5)=>{
                                                if(err5) throw err5
                                                else if(result5.recordset.length > 0){
                                                    arr.push(Object.values(result5.recordset[0])[0]);
                                                    let queryResult6 = mssql.query(query6, (err6, result6)=>{
                                                        if(err6) throw err6
                                                        else if(result6.recordset.length > 0){
                                                            arr.push(Object.values(result6.recordset[0])[0]);
                                                            let queryResult7 = mssql.query(query7, (err7, result7)=>{
                                                                if(err7) throw err7
                                                                else if(result7.recordset.length > 0){
                                                                    arr.push(Object.values(result7.recordset[0])[0]);
                                                                    res.send(arr);
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post('/totalMovementRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Movement_request.serial, Movement_request.asset_id, Movement_request.starting_point, Movement_request.destination, Movement_request.date, Movement_request.time, Movement_request.custodian_name, Movement_request.custodian_id, Movement_request.requester_name, Movement_request.requester_id, Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/pendingMovementRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Movement_request.serial, Movement_request.asset_id, Movement_request.starting_point, Movement_request.destination, Movement_request.date, Movement_request.time, Movement_request.custodian_name, Movement_request.custodian_id, Movement_request.requester_name, Movement_request.requester_id, Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Pending'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/approvedMovementRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Movement_request.serial, Movement_request.asset_id, Movement_request.starting_point, Movement_request.destination, Movement_request.date, Movement_request.time, Movement_request.custodian_name, Movement_request.custodian_id, Movement_request.requester_name, Movement_request.requester_id, Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Approved'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/deniedMovementRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Movement_request.serial, Movement_request.asset_id, Movement_request.starting_point, Movement_request.destination, Movement_request.date, Movement_request.time, Movement_request.custodian_name, Movement_request.custodian_id, Movement_request.requester_name, Movement_request.requester_id, Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Denied'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/totalAccessRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/pendingAccessRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Pending'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/approvedAccessRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Approved'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})

app.post('/deniedAccessRequests', (req, res)=>{
    let dept = req.body.userDept;
    let query0 = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Denied'`;
    let queryResult0 = mssql.query(query0, (err0, result0)=>{
        if(err0) throw err0
        else if(result0.recordset.length >= 0){
            res.send(result0.recordset);
        }
    })
})


app.post('/mAppr', (req, res)=>{
    let id = req.body.reqID;
    let serial = req.body.reqSerial;
    let start = req.body.start;
    let dest = req.body.dest;
    let empID = req.body.empID;

    // console.log(serial);
    // console.log(start);
    // console.log(dest);
    console.log(res.body);

    let q0 = `SELECT  (
        SELECT location_id
        FROM   location where location_name='${start}'
    ) AS start,
    (
         SELECT location_id
        FROM   location where location_name='${dest}'
    ) AS dest`;
    let queryResult0 = mssql.query(q0, (err0, result0)=>{
        if(err0) console.log('/mAppr err 0');
        else{
            // console.log(result0.recordset);
            let start_id = Object.values(result0.recordset[0])[0];
            let dest_id = Object.values(result0.recordset[0])[1];
            let q1 = `SELECT tag_id FROM assets WHERE asset_id = '${id}'`;
            let queryResult1 = mssql.query(q1, (err1, result1)=>{
            if(err1) throw err1
            else{
                let tagID = result1.recordset[0].tag_id;
                let q2 = `INSERT INTO Activity (approve_date, approve_time, emp_id, starting_point, destination, tag_id, approve_status) values('${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}','${empID}', '${start_id}', '${dest_id}', '${tagID}', 'Approved' )`;
                // console.log(q2);
                    let queryResult1 = mssql.query(q2, (err2, result2)=>{
                    if(err2) console.log('failed appr query2')
                    else{
                        let q3 = `UPDATE Movement_request SET Request_status='Approved' from Movement_request where asset_id='${id}' AND serial = '${serial}'`;
                        let queryResult2 = mssql.query(q3, (err3, result3)=>{
                            if(err3) console.log(err3)
                            else{
                                res.send(id.toString());
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/aAppr', (req, res)=>{
    let id = req.body.reqID;
    let serial = req.body.reqSerial;
    let userName = req.body.userName;
    let email = req.body.email;
    let pass = `user`;
    let q0 = `SELECT * FROM Users WHERE user_id = '${id}'`;
    let q1 = `UPDATE Access_request SET Request_status='Approved' where serial='${serial}' and applicant_id='${id}'`;
    let q2 = `INSERT INTO Users(user_id,user_name,email,password)values(` + `'${id}',` + `'${userName}',` + `'${email}',` +  `'${[pass]}'` +`)`;
    // console.log(q1);

    let queryResult0 = mssql.query(q0, (err0, result0)=>{
        if(err0) console.log("error in /aAppr query 0");
        else if(result0.recordset.length == 0 ){
            let queryResult1 = mssql.query(q1,(err1, result1)=>{
                if(err1) {
                    console.log('/appr err1');
                }
                else{
                    let queryResult2 = mssql.query(q2, (err2, result2)=>{
                        if(err2) throw err2
                        else{
                            res.send('success');
                        }
                    })
                }
            })
        }
        else{
            console.log('User exists');
        }
    })
})

app.post('/mdeny', (req, res)=>{
    let id = req.body.reqID;
    let serial = req.body.reqSerial;
    
    let q1 = `UPDATE Movement_request SET Request_status='Denied' from Movement_request where asset_id='${id}' AND serial = '${serial}'`;
    // console.log(q2);
    let queryResult1 = mssql.query(q1, (err1, result1)=>{
        if(err1) console.log('failed deny query1')
        else{
            res.send('Denied');
        }
    })
})
app.post('/aDeny', (req, res)=>{
    let serial = req.body.reqSerial;
    let id = req.body.reqID;
    let q = `UPDATE Access_request SET Request_status='Denied' where serial='${serial}' and applicant_id='${id}'`;
    console.log(q);
    let queryResult = mssql.query(q, (err, result)=>{
        if(err) throw err
        else{
            res.send('Denied');
        }
    })
})