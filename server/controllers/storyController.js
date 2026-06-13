import fs from 'fs';
import imagekit from '../configs/imageskit.js';
import story from '../models/Story.js';
import User from "../models/User.js";
import { inngest } from '../inngest/index.js';
// add user story
export const addUserStory =async(req,res)=>{
    try{
        const {userId}=req.auth();
        const {content,media_type,background_color}=req.body;
        const media=req.file
        let media_url =""

        //upload media to imagekit
        if(media_type =='image' || media_type == 'video'){
            const fileBuffer =fs.readFileSync(media.path)
            const response =await imagekit.upload({
                file:fileBuffer,
                fileName:media.originalname,
            })
            media_url =response.url
        }
        // create story
        const story =await story.create({
            user:userId,
            content,
            media_url,
            media_type,
            background_color
        })

        // schedule story deletion after 24 hours
        await inngest.send({
            name:"app/story.delete",
            data:{storyId: story._id}
        })


        res.json({success:true})
    }catch (error){
        console.log(error);
        res.json({succss:false,message:error.message});
    }
}

// get user Stories

export const getStories =async(req,res)=>{
    try{
        const {userId}=req.auth();
        const user =await User.findById(userId)


        // user connections and follownigs
        const userIds =[userId, ...user.connections, ...user.following]

        const Stories =await story.find({
            user:{$in:userIds}
        }).populate('user').sort({createdAt: -1});
        
        res.json({success:true, Stories});
    }catch (error){
        console.log(error);
        res.json({succss:false,message:error.message});
    }
}