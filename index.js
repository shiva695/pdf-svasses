const express = require('express');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const timestamp = require('time-stamp');
const options = require('./helpers/options');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const router = express.Router();
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(expressLayouts);
app.use('/',router);


// RENDER REPORT FROM THE SERVER

router.post('/server', function (req, res) {
    let chilDetails = {
        Child_ID : req.body.childId,
        Child_name : req.body.name,
         Child_age : req.body.age,
         Child_City: req.body.city,
        Gender : req.body.gender,
        Activity_name : req.body.activity_name,
        Score : req.body.score,
        Grade : req.body.grade,
        HealthAtt : req.body.healthAtt
   } 
   

    const time = (timestamp('YYYY_MM_DD_HH_mm_ss'));
    const html = fs.readFileSync(path.join(__dirname, 'views/template.html'), 'utf-8');
    const filename = req.body.name+'_'+time+'.pdf';

        let activity = '';
            activity = (req.body.activity_name)
        let name = '';
            name = (req.body.name)
        let age = '';
            age = (req.body.age)
        let gender = '';
            gender = (req.body.gender)
            let city = '';
            city = (req.body.city)    
        let score = '';
            score = (req.body.score)
        let grade = '';
            grade = (req.body.grade)
        let healthatt = '';
            healthatt = (req.body.healthAtt)
        // 
        const childData = {
            // 
            activity: activity,
            score: score,
            grade:grade,
            name:name,
            age:age,
            city:city,
            healthatt: healthatt,
            gender:gender,
            // 
        }
        const document = {
            html: html,
            data: childData,
            // 
            path: './docs/' + filename,
            type:"buffer"
        }
        pdf.create(document, options)
            .then(result => {
                console.log(result);
                var file = fs.createReadStream(result.filename);
                var stat = fs.statSync(result.filename);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename = ${filename}`);
                file.pipe(res);

                
                }).catch(error => {
                    
                    console.log(error)
                });
})
                
            
app.listen(3000, () => console.log('App is listening on url http://localhost:3000'));


