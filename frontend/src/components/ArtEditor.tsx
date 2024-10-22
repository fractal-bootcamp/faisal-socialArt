import React, { useState } from 'react';
import Controllers from './Controllers';
import Art from './ArtWork';
import { ArtWork } from '@/services/artService';

interface ArtEditorProps {
    initialArt: ArtWork;
    publishArt: (art: ArtWork) => void;
}

const ArtEditor: React.FC<ArtEditorProps> = ({
    initialArt,
    publishArt,
}) => {
    const [art, setArt] = useState(initialArt);

    const handlePublish = () => {
        publishArt(art);
    };

    return (
        <div className="feed-item">
            <Controllers
                art={art}
                setArt={setArt}
                initialArt={initialArt}
                handlePublish={handlePublish}
            />
            <Art art={art} />
        </div>
    );
};

export default ArtEditor;