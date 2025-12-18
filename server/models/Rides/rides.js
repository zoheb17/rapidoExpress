import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  customerId: {
    type: String,
    require: true,
  },
  riderId: {
    type: String,
    require: true,
  },
  rideDetails: {
    from: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
    amount:{
      type:Number,
      require:true
    },
    paymentMethod:{
        type:String,
        enum:["cod","upi","card"]
    },
    rideStatus: {
      type: String,
      enum:["finished","ride-is-coming","cancel"],
      default:"ride-is-coming"
    },
  },
},{
    timestamps:true,
    strict:false
});

const rideModel = mongoose.model("rides",rideSchema)
export default rideModel;