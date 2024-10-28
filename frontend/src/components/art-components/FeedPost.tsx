import React, { useState } from 'react';
import { ArtType } from '@/services/artService';
import ArtWork from './ArtWork';
import ArtEditor from './ArtEditor';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash2 } from 'lucide-react';
import { updateLike } from '../../services/api';
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
import { useAuth } from '@/hooks/useAuth';


interface FeedPostProps {
    art: ArtType & { likeCount?: number, isLikedByUser?: boolean };
    userAvatar: string;
    userName: string;
    authorId: string;
    isAuthor: boolean;
    onLike: () => void;
    onEdit: (updatedArt: ArtType) => void;
    onDelete: () => void;
    isEditing?: boolean;
    displayAsGrid?: boolean;
    isProfilePage?: boolean;
    userId?: string;
}

const FeedPost: React.FC<FeedPostProps> = ({
    art,
    userAvatar,
    userName,
    isAuthor,
    onEdit,
    onDelete,
    displayAsGrid = false,
    isProfilePage = false,
}) => {
    const [isEditingState, setIsEditingState] = useState(false);
    const [isLiked, setIsLiked] = useState(art.isLikedByUser ?? false);
    const [likesCount, setLikesCount] = useState(art.likeCount ?? 0);
    const [currentArt, setCurrentArt] = useState(art);
    const { isAuthenticated, isLoaded } = useAuth();

    const handleEdit = () => {
        setIsEditingState(true);
    };

    const handleLike = async () => {
        // First check if everything is loaded
        if (!isLoaded) {
            toast.error('Please wait while we load your session');
            return;
        }

        // Then check authentication
        if (!isAuthenticated) {
            toast.error('Please sign in to like artworks');
            return;
        }

        const newIsLiked = !isLiked;

        // Optimistic update
        setIsLiked(newIsLiked);
        setLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

        try {
            // Make the API call
            const response = await updateLike(art.id || '', newIsLiked);

            // Update with actual server count
            setLikesCount(response.likeCount);
            toast.success(newIsLiked ? 'Artwork liked!' : 'Artwork unliked!');
        } catch (error) {
            // Revert optimistic update on error
            setIsLiked(!newIsLiked);
            setLikesCount(prevCount => !newIsLiked ? prevCount + 1 : prevCount - 1);
            console.error('Error updating like:', error);
            toast.error('Failed to update like status. Please try again.');
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
                            className={`p-1 sm:p-2 ${isLiked || likesCount > 0 ? "text-red-500 hover:text-red-600" : ""}`}
                        >
                            <Heart className="h-6 w-6 sm:h-8 sm:w-8" fill={isLiked || likesCount > 0 ? "currentColor" : "none"} />
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
                    initialArt={currentArt}
                    userAvatar={userAvatar}
                    userName={userName}
                    publishArt={handlePublish}
                    onClose={() => setIsEditingState(false)}
                    isEditing={isEditingState}
                />
            )}
        </div>
    );
};

export default FeedPost;
