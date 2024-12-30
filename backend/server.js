const express = require("express")
const mongoose = require("mongoose")
const Schema = require("mongoose")
const model = require("mongoose")

const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const corsOptions = {
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false, useNewUrlParser: true, useUnifiedTopology: true }))
app.use(cors(corsOptions));


mongoose.connect("mongodb://127.0.0.1:27017")
    .then(e => console.log("MongoDB Connected"));

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
});


const Task = mongoose.model("Task", taskSchema);


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/tasks', async (req, res) => {
    const { text } = req.body;
    try {
        const task = new Task({ text });
        await task.save();
        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task removed" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});