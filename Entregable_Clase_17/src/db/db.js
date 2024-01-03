import mongoose from 'mongoose';

const dbConnect = {
  connect: () => {
    return mongoose.connect('mongodb+srv://julieta:julisdn2395@codercluster.34bufkv.mongodb.net/ecommerce', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  },
};

// mongodb+srv://julieta:<password>@codercluster.34bufkv.mongodb.net/?retryWrites=true&w=majority
export default dbConnect;