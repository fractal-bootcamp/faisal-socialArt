import React, { useState } from 'react';
import Controllers from './Controllers';
import ArtWork from './ArtWork';
import { ArtType } from '@/services/artService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArtEditorProps {
    initialArt: ArtType;
    publishArt: (art: ArtType) => void;
    onClose: () => void;
    userAvatar: string;
    userName: string;
    isEditing: boolean;
}

const ArtEditor: React.FC<ArtEditorProps> = ({
    initialArt,
    publishArt,
    onClose,
    userAvatar,
    userName,
    isEditing,
}) => {
    const [art, setArt] = useState(initialArt);

    const handlePublish = () => {
        publishArt(art);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-4xl mx-4">
                <button
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    &#x2715; {/* X symbol */}
                </button>
                <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback>
                            {userName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-lg">
                        {userName}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 p-4">
                        <Controllers
                            art={art}
                            setArt={setArt}
                            initialArt={initialArt}
                            handlePublish={handlePublish}
                            isEditing={isEditing}
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                        <ArtWork art={art} isEditing={isEditing} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtEditor;