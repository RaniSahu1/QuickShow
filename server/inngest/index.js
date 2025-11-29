import { User } from "../models/User.js";
import connectDB from "../configs/db.js";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// CREATE
const syncUserCreation = inngest.createFunction(
  { id: "Sync-User-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, firstName, lastName, emailAddresses, imageUrl } = event.data;

      const data = {
        _id: id,
        email: emailAddresses?.[0]?.emailAddress,
        name: `${firstName} ${lastName}`,
        image: imageUrl,
      };

      await User.create(data);

      return { status: "ok", action: "create", user: id }; // <-- IMPORTANT
    } catch (err) {
      console.error("CREATE ERROR:", err);
      return { error: err.message }; // <-- return JSON
    }
  }
);

// UPDATE
const syncUserUpdation = inngest.createFunction(
  { id: "update-User-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, firstName, lastName, emailAddresses, imageUrl } = event.data;

      const data = {
        email: emailAddresses?.[0]?.emailAddress,
        name: `${firstName} ${lastName}`,
        image: imageUrl,
      };

      await User.findByIdAndUpdate(id, data);

      return { status: "ok", action: "update", user: id }; // <-- IMPORTANT
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      return { error: err.message };
    }
  }
);

// DELETE
const syncUserDeletion = inngest.createFunction(
  { id: "delete-User-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;

      await User.findByIdAndDelete(id);

      return { status: "ok", action: "delete", user: id }; // <-- IMPORTANT
    } catch (err) {
      console.error("DELETE ERROR:", err);
      return { error: err.message };
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
