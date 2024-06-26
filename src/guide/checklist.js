const express = require('express');
var router = express.Router();

const guide_model = require('../gpt/models/guide_model');
const checklist_model = require('./models/checklist_model');
const user_model = require('../signup/models/reg_model');

router.post('/show/:userid', async(req, res)=>{
    try{

        let userId = req.params.userid;   //인증된 사용자의 ID 가져오기 :njh
        const month = req.body.month;   //5
        const WeekNumber= req.body.WeekNumber;  //2

        const user= new user_model(userId);
        userId = await user.findId();
        userId = userId.id; //12 (njh)


        let result = []
    
        
        const guide = new guide_model();
        for (let i=1; i<=WeekNumber; i++){
            let cnt = 0;
            const checklist = new checklist_model(userId, month, i);
            let mychecklist = await checklist.findAll();
            let jsoncheck = {
                "WeekNumber":i,
                "success":[],
                "fail":[]
            };
            result.push(jsoncheck);
            for(let j=1;j<=5;j++){
                let IsWeekList = mychecklist[0][0][`IsWeekList${j}`];
                let WeekList_guide= await guide.findwithguideId(mychecklist[0][0][`WeekListID${j}`]);
                WeekList_guide = WeekList_guide[0][0].guide_NM;
                if(IsWeekList==1) { 
                    result[i-1].success.push(WeekList_guide); 
                    cnt += 1;
                }
                else {result[i-1].fail.push(WeekList_guide);}
            }
            
            result[i-1].rate = cnt*20;
        }

        
        res.send(result);
    }
    catch(error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");

    }
})

module.exports = router;