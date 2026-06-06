import { Plus } from "lucide-react";
import React from "react";
import { useState } from 'react'
import { useEffect } from 'react'
import { dummyStoriesData } from "../assets/assets"
import moment from "moment";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";

const Storiesbar = () => {

    const [stories, setStories] = useState([]);
    const [showModal,setShowModal]=useState(false)
    const [viewStory,setViewStory]=useState(null)

    const fetchStories = async () => {
        setStories(dummyStoriesData);
    }

    useEffect(() => {
        fetchStories();
    }, [])
    return (
        <div className="w-full sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
            <div className="flex gap-4 pb-5">
                {/* Add Stroy card*/}
                <div onClick={()=>{setShowModal(true)}} className="rounded-lg shadow-sm min-w-30 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center gap-2">
                    <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
                        <Plus className="w-5 h-5 text-white" />

                    </div>
                    <p className='text-sm font-medium text-slate-700 text-center'>
                        Create Story
                    </p>
                </div>
                {/*story card*/}
                {
                    stories.map((story, index) => (
                        <div  onClick={()=>setViewStory(story)} key={index} className={`relative rounded-lg shadow 
                        min-w-24 aspect-[3/4] cursor-pointer hover:shadow-lg
                        transition-all duration-200 bg-gradient-to-b from-indigo-500
                        to-purple-600 hover:from-indigo-700 hover:to-purple-800 
                        active:scale-95 overflow-hidden`}>
                            <img src={story.user.profile_picture} alt=""
                                className="absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-white shadow" />
                            <p className="absolute top-14 left-2 right-2 text-white/80 text-xs truncate">{story.content}</p>
                            <p className="absolute bottom-2 left-2 right-2 text-white/60 text-xs truncate">{moment(story.createdAt).fromNow()}</p>
                            {story.media_type !== 'text' && (
                                <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
                                    {story.media_type === "image" ? (
                                        <img
                                            src={story.media_url}
                                            alt=""
                                            className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-500 hover:opacity-80"
                                        />
                                    ) : (
                                        <video
                                            src={story.media_url}
                                            className="h-full w-full object-cover opacity-500"
                                        />
                                    )}
                                </div>
                            )
                            }

                        </div>
                    ))
                }
            </div>
            {/*add story modal */}
            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories}/>}
            {/* view Story modal */}

            {viewStory && <StoryViewer viewStory={viewStory} setViewStory ={setViewStory}/>}
        </div>

        
    )
}

export default Storiesbar;