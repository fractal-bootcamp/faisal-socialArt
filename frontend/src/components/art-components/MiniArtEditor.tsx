import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArtType } from '@/services/artService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MiniArtEditorProps {
    initialArt: ArtType;
    publishArt: (art: ArtType) => void;
    userAvatar: string;
    userName: string;
    onClose: () => void;
}

const MiniArtEditor: React.FC<MiniArtEditorProps> = ({
    initialArt,
    publishArt,
    userAvatar,
    userName,
    onClose,
}) => {
    const [art, setArt] = useState(initialArt);
    const [isOpen, setIsOpen] = useState(false);

    const handlePublish = () => {
        publishArt(art);
        setIsOpen(false);
        onClose();
    };

    return (
        <Popover open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) onClose();
        }}>
            <PopoverTrigger asChild>
                <Button variant="outline">Edit</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={userAvatar} alt={`${userName} Avatar`} />
                            <AvatarFallback>
                                {userName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-lg">
                            {userName}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="colorA">Color A</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorA-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={art.colorA.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorA: { ...art.colorA, h: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorA-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={art.colorA.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorA: { ...art.colorA, s: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorA-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={art.colorA.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorA: { ...art.colorA, b: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="colorB">Color B</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorB-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={art.colorB.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorB: { ...art.colorB, h: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorB-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={art.colorB.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorB: { ...art.colorB, s: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorB-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={art.colorB.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setArt({ ...art, colorB: { ...art.colorB, b: Math.floor(parseFloat(e.target.value)) } });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="stripeCount">Number of Stripes</Label>
                            <Slider
                                id="stripeCount"
                                min={2}
                                max={50}
                                step={1}
                                value={[art.stripeCount]}
                                onValueChange={(value: number[]) => setArt({ ...art, stripeCount: Math.floor(value[0]) })}
                            />
                            <div className="text-center">{art.stripeCount}</div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="style">Style</Label>
                            <Select value={art.style} onValueChange={(value) => setArt({ ...art, style: value as ArtType['style'] })}>
                                <SelectTrigger id="style">
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="line">Line</SelectItem>
                                    <SelectItem value="circle">Circle</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setArt(initialArt)}>
                            Reset
                        </Button>
                        <Button onClick={handlePublish}>
                            Update
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default MiniArtEditor;