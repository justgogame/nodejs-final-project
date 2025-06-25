import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    },
    progress: {
      type: Number,
      min: 0,
      max: 100
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Entry', entrySchema);
