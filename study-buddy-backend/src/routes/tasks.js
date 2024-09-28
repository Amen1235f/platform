const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"

    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            return res.sendStatus(403); // Other errors
        }
        req.user = user; // Attach user info to request
        next();
    });
};


router.post('/',authenticateToken,async(req,res)=>{
    const {title,description}=req.body;
    try{
        const task=await Task.create({
            title,
            description,
            userId:req.user.id
        })
        res.status(201).json({message:'Task created successfully',task})
    }catch(error){
        res.status(400).json({message:'error creating task',error:error.message})
    }
})


router.get('/',authenticateToken,async(req,res)=>{
    try{
        const tasks=await Task.findAll({
            where:{userId:req.user.id}
        })
        res.status(200).json(tasks)
    }catch (error) {
        res.status(400).json({ message: 'Error retrieving tasks', error: error.message });
    }
})
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        
        // Check if the flashcard exists and belongs to the authenticated user
        if (!task || task.userId !== req.user.id) {
            return res.status(404).json({ message: 'task not found or does not belong to the user' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving task', error: error.message });
    }
});

router.put('/:id',authenticateToken,async(req,res)=>{
    const {title,description,completed}=req.body
    try{
        const task=await Task.findByPk(req.params.id)
        if(!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId !== req.user.id) return res.sendStatus(403); // Forbidden
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error: error.message });
    }
    
})
router.delete('/:id', authenticateToken, async (req, res) => {
try{
    const task=await Task.findByPk(req.params.id)
    if(!task) return res.status(404).json({message:'Task not found'})
    if(task.userId!==task.user.id) return res.sendStatus(403);
    await task.destroy();
    res.status(200).json({ message: 'Task deleted successfully' });
} catch (error) {
    res.status(400).json({ message: 'Error deleting task', error: error.message });
}
})
module.exports=router