import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    },
    position: {
        type: Number,
        default: 0
    },
    dueDate: Date,
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Task', taskSchema);
