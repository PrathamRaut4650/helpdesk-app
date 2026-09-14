const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose =require("mongoose")
const userModel = require("./models/user")
const taskModel = require("./models/task")
const authMiddleware = require("./middleware/auth");
const adminMiddleware = require("./middleware/admin")
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cors = require("cors");
require("dotenv").config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb Connected")
})
.catch((err)=>{
    console.log("Mongodb connection error",err)
})

app.use(express.json());
app.use(cors());

app.get('/',(req, res)=>{
    res.send("helpdesk api is running")
});

app.get('/test-user',async(req, res)=>{
    const user = await userModel.create({
        username:"Pratham",
        email:"pratham@gmail.com",
        password:"test123",
        role:"employee"
    })
    res.json(user);
})

app.post("/api/register", async(req, res)=>{

    const {username, email, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role: "employee"
    });

    res.status(201).json({
        message: "User registered successfully",
        user
    });
});

app.post("/api/login",async(req,res)=>{
    let {email, password}=req.body;
    let user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Incorrect Credentials"
        })
    }
    let isMatch =await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({
            message:"Incorrect Credentials"
        })
    }
    let token = jwt.sign(
        {
            userId:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    )
    res.json({
        message:"login successfully",
        token,
        role:user.role,
    })
})

app.get("/api/profile", authMiddleware, async(req, res)=>{
    const user = await userModel.findById(req.user.userId);
    res.json(user)
})

app.post("/api/tasks",authMiddleware,adminMiddleware ,async(req, res)=>{
    const {title, description, priority, assignedTo}=req.body;

    const task = await taskModel.create({
        title,
        description,
        priority,
        assignedTo,
        createdBy:req.user.userId
    })
    res.status(201).json(task)
})

app.get("/api/tasks", authMiddleware, adminMiddleware, async(req, res)=>{
    const tasks = await taskModel.find();
    res.json(tasks);
});

app.get("/api/tasks/my",authMiddleware,async(req, res)=>{
    const tasks =await taskModel.find({
        assignedTo:req.user.userId
    })
    res.json(tasks)
})
app.get("/api/tasks/:id", authMiddleware, async(req, res)=>{

    const task = await taskModel.findById(req.params.id);

    if(!task){
        return res.status(404).json({
            message:"Task not found"
        });
    }

    if(
        req.user.role !== "admin" &&
        task.assignedTo.toString() !== req.user.userId
    ){
        return res.status(403).json({
            message:"You are not allowed to view this task"
        });
    }

    res.json(task);
});
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Employees can update only tasks assigned to them
    if (
      req.user.role === "employee" &&
      task.assignedTo &&
      task.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can update only your assigned tasks",
      });
    }

    // Employees should update only the status
    if (req.user.role === "employee") {
      task.status = req.body.status;
    }

    // Admins can update the complete task
    if (req.user.role === "admin") {
      task.title = req.body.title ?? task.title;
      task.description = req.body.description ?? task.description;
      task.priority = req.body.priority ?? task.priority;
      task.status = req.body.status ?? task.status;
      task.assignedTo = req.body.assignedTo ?? task.assignedTo;
    }

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

app.delete("/api/tasks/:id", authMiddleware, adminMiddleware, async(req, res)=>{
const task =await taskModel.findByIdAndDelete(req.params.id);
if(!task){
    return res.status(404).json({
        message:"Task not found"
    })
}
res.json({
    message:"Task deleted sucessfully",
    task
})
})

app.get("/api/users",authMiddleware, adminMiddleware,async(req, res)=>{
    try{
        const users = await userModel
        .find({role:"employee"})
        .select("_id username email")
        res.json(users);
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch employees"
        });
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});