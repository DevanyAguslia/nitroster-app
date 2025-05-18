import mongoose from 'mongoose';

// Connect to MongoDB with caching to avoid redundant connections
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Use existing database connection
    return;
  }

  try {
    await mongoose.connect(process.env.MongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;