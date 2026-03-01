import mongoose from 'mongoose';

export class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  public async connect(mongoUri: string): Promise<void> {
    try {
      if (this.isConnected) {
        console.log('Already connected to MongoDB');
        return;
      }

      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB Disconnected');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  public isMongoConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

export default MongoDBService.getInstance();
