import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js"

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

// inngest function to send Reminder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
    { id: "send-new-connection-request-reminder", triggers: [{ event: "app/connection-request" }] },
    async ({event, step}) => {
        const { connectionId } = event.data;

        await step.run('send-connection-request-mail', async () => {
            const connection = await Connection.findById(connectionId).populate("from_user_id to_user_id");
            const subject = `New Connection Request`;
            const body = `<div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks, <br/> Auraverse - Stay Connected</p>
            </div>`;

            await sendEmail({
                to:connection.to_user_id.email,
                subject,
                body
            })
        })

        const in24Hours =new Date(Date.now() + 24 *60*60*1000)
        await step.sleepUntil("wait-for-24-hours",in24Hours);
        await step.run('send-connection-request-reminder',async()=>{
            const connection =await Connection.findById(connectionId).populate("from_user_id to_user_id");

            if(connection.status === "accepted"){
                return {message:"Already accepted"}
            }

            const subject = `New Connection Request`;
            const body = `<div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks, <br/> Auraverse - Stay Connected</p>
            </div>`;

            await sendEmail({
                to:connection.to_user_id.email,
                subject,
                body
            })

            return {message:"Reminder sent."}
        })
    }
)


export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder
];