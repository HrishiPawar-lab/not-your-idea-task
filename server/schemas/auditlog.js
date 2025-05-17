import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete' , 'reorder'],
    required: true
  },
  changes: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AuditLog', auditLogSchema);