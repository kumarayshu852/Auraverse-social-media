import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "auraverse" });

const syncUserCreation = inngest.createFunction(
    // 1st Argument: Config Object
    { 
        id: "sync-user-from-clerk",
        triggers: [{ event: "clerk/user.created" }] 
    },
    // 2nd Argument: Handler Function
    async ({ event, step }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        await step.run("save-user-to-db", async () => {
            let username = email_addresses[0].email_address.split('@')[0];
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                username = username + Math.floor(Math.random() * 10000);
            }
            await User.create({
                _id: id,
                email: email_addresses[0].email_address,
                full_name: `${first_name} ${last_name}`,
                profile_picture: image_url,
                username
            });
        });
    }
);

// Baaki functions (Update/Delete) ke liye bhi yahi format follow karein:
const syncUserUpdation = inngest.createFunction(
    { 
        id: "update-user-from-clerk",
        triggers: [{ event: "clerk/user.updated" }] 
    },
    async ({ event, step }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        await step.run("update-user-in-db", async () => {
            await User.findByIdAndUpdate(id, {
                email: email_addresses[0].email_address,
                full_name: `${first_name} ${last_name}`,
                profile_picture: image_url
            });
        });
    }
);

const syncUserDeletion = inngest.createFunction(
    { 
        id: "delete-user-from-clerk",
        triggers: [{ event: "clerk/user.deleted" }] 
    },
    async ({ event, step }) => {
        const { id } = event.data;
        await step.run("delete-user-from-db", async () => {
            await User.findByIdAndDelete(id);
        });
    }
);

export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];