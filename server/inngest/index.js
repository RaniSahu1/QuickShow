import {User} from "../models/User.js"; 
import connectDB from "../configs/db.js";
import { Inngest } from "inngest";
// connect to DB when Inngest loads
// connectDB()

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// inngest function to save user data to db

const  syncUserCreation  = inngest.createFunction(
  { id: 'Sync-User-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    // Import User model here to avoid circular dependency
    await connectDB()
    const {id , first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {
      _id: id,
      email : email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image : image_url
    }
    await User.create(userData);  
 return { ok: true };
}
)

// inngest function to delete user data to db

const  syncUserDeletion  = inngest.createFunction(
  { id: 'delete-User-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDB();
    const {id} = event.data;
    
    await User.findByIdAndDelete(id);  
 return { ok: true };
}
)
// inngest function to update user data to db
const  syncUserUpdation  = inngest.createFunction(
  { id: 'update-User-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    await connectDB();
    const {id , first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {
      email : email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image : image_url
    }
    await User.findByIdAndUpdate(id,userData);  
 return { ok: true };
}
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];