import mongoose from 'mongoose';
import { config } from './env.js';
export async function connectDatabase() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});
//# sourceMappingURL=database.js.map