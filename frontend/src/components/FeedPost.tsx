import React, { useState } from 'react';
import { ArtType } from '@/services/artService';
import ArtWork from './ArtWork';
import ArtEditor from './ArtEditor';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash2 } from 'lucide-react';

interface FeedPostProps {
    art: ArtType;
    userAvatar: string;
    userName: string;
    isAuthor: boolean;
    onLike: () => void;
    onEdit: (updatedArt: ArtType) => void;
    onDelete: () => void;
}

const FeedPost: React.FC<FeedPostProps> = ({
    art,
    userAvatar,
    userName,
    isAuthor,
    onLike,
    onEdit,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const [likesCount, setLikesCount] = useState(0);
    const [currentArt, setCurrentArt] = useState(art);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
        onLike();
    };

    const handlePublish = (updatedArt: ArtType) => {
        setCurrentArt(updatedArt);
        onEdit(updatedArt);
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md lg:max-w-lg mb-4 sm:mb-8">
            <div className="p-3 sm:p-4">
                <div className="flex items-center mb-3 sm:mb-4">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-base sm:text-lg">{userName}</span>
                </div>
                <div className="mb-3 sm:mb-4">
                    <ArtWork art={currentArt} />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`p-1 sm:p-2 ${isLiked ? "text-red-500" : ""}`}
                        >
                            <Heart className="h-6 w-6 sm:h-8 sm:w-8" fill={isLiked ? "currentColor" : "none"} />
                        </Button>
                        <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-500">{likesCount}</span>
                    </div>
                    {isAuthor && (
                        <div className="flex">
                            <Button variant="ghost" size="sm" onClick={handleEdit} className="p-1 sm:p-2">
                                <Edit className="h-6 w-6 sm:h-8 sm:w-8" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onDelete} className="p-1 sm:p-2">
                                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {isEditing && (
                <ArtEditor
                    userAvatar={userAvatar}
                    userName={userName}
                    initialArt={currentArt}
                    publishArt={handlePublish}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};

export default FeedPost;