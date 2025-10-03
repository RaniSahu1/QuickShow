import {User} from "../models/User.js";
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// inngest function to save user data to db

const  syncUserCreation  = inngest.createFunction(
  { id: "Sync-User-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Import User model here to avoid circular dependency
    const {id , first_name, last_name, emai_addresses, image_url} = event.data;
    const userData = {
      _id: id,
      email : emai_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image : image_url
    }
    await User.create(userData);  

}
)

// inngest function to delete user data to db

const  syncUserDeletion  = inngest.createFunction(
  { id: "delete-User-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    
    const {id} = event.data;
    
    await User.findByIdAndDelete(id);  

}
)
// inngest function to update user data to db
const  syncUserUpdation  = inngest.createFunction(
  { id: "update-User-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    
    const {id , first_name, last_name, emai_addresses, image_url} = event.data;
    const userData = {
      email : emai_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image : image_url
    }
    await User.findByIdAndUpdate(id,userData);  

}
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];