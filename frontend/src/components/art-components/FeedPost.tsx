import React, { useState } from 'react';
import { ArtType } from '@/services/artService';
import ArtWork from './ArtWork';
import ArtEditor from './ArtEditor';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface FeedPostProps {
    art: ArtType & { likeCount?: number };
    userAvatar: string;
    userName: string;
    isAuthor: boolean;
    onLike: () => void;
    onEdit: (updatedArt: ArtType) => void;
    onDelete: () => void;
    isEditing?: boolean;
    displayAsGrid?: boolean;
    isProfilePage?: boolean;
}

const FeedPost: React.FC<FeedPostProps> = ({
    art,
    userAvatar,
    userName,
    isAuthor,
    onLike,
    onEdit,
    onDelete,
    displayAsGrid = false,
    isProfilePage = false
}) => {
    const [isEditingState, setIsEditingState] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(art.likeCount || 0);
    const [currentArt, setCurrentArt] = useState(art);

    const handleEdit = () => {
        setIsEditingState(true);
    };

    const handleLike = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);
        onLike();
        if (newIsLiked) {
            toast.success('Liked!');
        } else {
            toast.success('Unliked!');
        }
    };

    const handlePublish = (updatedArt: ArtType) => {
        setCurrentArt(updatedArt);
        onEdit(updatedArt);
        setIsEditingState(false);
    };

    if (displayAsGrid) {
        return (
            <div className="relative group w-full">
                {/* Artwork container with exact width */}
                <div className="aspect-square overflow-hidden rounded-lg w-full flex items-center justify-center">
                    <ArtWork art={currentArt} isEditing={false} />
                </div>
                {/* Hover overlay with exact width */}
                <div className="absolute rounded-lg inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full">
                    <Button variant="ghost" className="text-white bg-gray-400" onClick={() => setIsEditingState(true)}>
                        Edit
                    </Button>
                </div>
                {/* Like count at bottom left */}
                {likesCount > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" fill={likesCount > 0 ? "currentColor" : "none"} />
                        <span className="text-sm text-white">{likesCount}</span>
                    </div>
                )}
                {/* Delete button at bottom right */}
                {isAuthor && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 p-1">
                                <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your artwork.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction onClick={onDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {isEditingState && (
                    <ArtEditor
                        userAvatar={userAvatar}
                        userName={userName}
                        initialArt={currentArt}
                        publishArt={handlePublish}
                        onClose={() => setIsEditingState(false)}
                        isEditing={isEditingState}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md lg:max-w-lg mb-4 sm:mb-8">
            <div className="p-3 sm:p-4">
                {!isProfilePage && (
                    <div className="flex items-center mb-3 sm:mb-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                            <AvatarImage src={userAvatar} alt={`${userName} Avatar`} />
                            <AvatarFallback>{userName?.charAt(0) || ''}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-base sm:text-lg">
                            {userName}
                        </span>
                    </div>
                )}

                <div className="mb-3 sm:mb-4">
                    <ArtWork art={currentArt} isEditing={isEditingState} />
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`p-1 sm:p-2 ${isLiked ? "text-red-500 hover:text-red-600" : ""}`}
                        >
                            <Heart className="h-6 w-6 sm:h-8 sm:w-8" fill={isLiked ? "currentColor" : "none"} />
                        </Button>
                        <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-500">
                            {likesCount}
                        </span>
                    </div>

                    {isAuthor && (
                        <div className="flex">
                            <Button variant="ghost" size="sm" onClick={handleEdit} className="p-1 sm:p-2">
                                <Edit className="h-6 w-6 sm:h-8 sm:w-8" />
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                                        <Trash2 className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to delete this artwork?
                                        </AlertDialogTitle>

                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your artwork.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>

                                        <AlertDialogAction onClick={onDelete}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>

            {isEditingState && (
                <ArtEditor
                    userAvatar={userAvatar || ''}
                    userName={userName || ''}
                    initialArt={currentArt}
                    publishArt={handlePublish}
                    onClose={() => setIsEditingState(false)}
                    isEditing={isEditingState}
                />
            )}
        </div>
    );
};

export default FeedPost;
