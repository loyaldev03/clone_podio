var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; //Have also tried Schema.Types.ObjectId, mongoose.ObjectId

/* GET home page. */
router.get('/statistics', auth, function(req, res, next) {
	res.json({
        acc_properties_stats: {
          number_of_deals: 100,
          number_of_active_deals: 50,
          number_of_under_contracts: 50,
          number_of_offers_made: 10,
          number_of_closed_deals: 10,
          number_of_offers_accepted: 20,
          number_of_work_in_progress: 10,
          number_of_tasks_past_due: 50,
          number_of_tasks_due_today: 50
        },
        tasks_due_today: [
          {task_name: "first_task", workspace_name: "first_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "second_task", workspace_name: "second_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "third_task", workspace_name: "third_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "fourth_task", workspace_name: "fourth_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "fifth_task", workspace_name: "fifth_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."}
        ],
        tasks_past_due : [
          {task_name: "first_task", workspace_name: "first_workspace", due_date: "5"},
          {task_name: "second_task", workspace_name: "second_workspace", due_date: "4"},
          {task_name: "third_task", workspace_name: "third_workspace", due_date: "3"},
          {task_name: "fourth_task", workspace_name: "fourth_workspace", due_date: "3"},
          {task_name: "fifth_task", workspace_name: "fifth_workspace", due_date: "2"}
        ],
        work_in_progress : [
          {task_name: "first_task", workspace_name: "first_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "second_task", workspace_name: "second_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "third_task", workspace_name: "third_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "fourth_task", workspace_name: "fourth_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."},
          {task_name: "fifth_task", workspace_name: "fifth_workspace", task_description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."}
        ],
        properties_not_updated_in : [
          {number: "99", property: "summer", date: "80"},
          {number: "67", property: "chokee", date: "19"},
          {number: "88", property: "branch", date: "25"},
          {number: "103", property: "win", date: "16"},
        ]
    });
});

module.exports = router;
