import { ArtStyle, ArtWork, updateColor } from "@/services/artService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";

interface ControllersProps {
    art: ArtWork;
    setArt: (art: ArtWork) => void;
    initialArt: ArtWork;
    handlePublish: () => void;
    isEditing: boolean;
}

const Controllers: React.FC<ControllersProps> = ({
    art,
    setArt,
    initialArt,
    handlePublish,
    isEditing,
}) => {
    const { colorA, colorB, stripeCount, style } = art

    const onColorAChange = (colorA: { h: number; s: number; b: number }) => {
        setArt(updateColor(art, "colorA", colorA));
    }

    const onColorBChange = (colorB: { h: number; s: number; b: number }) => {
        setArt(updateColor(art, "colorB", colorB));
    }

    const onStripeCountChange = (stripeCount: number) => {
        setArt({ ...art, stripeCount });
    }

    const onStyleChange = (style: ArtStyle) => {
        setArt({ ...art, style });
    }

    const handleReset = () => {
        setArt(initialArt);
    }

    // 1. render a controller using art
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>
                    Art Controllers
                </CardTitle>
                <CardDescription>
                    Customize your art.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="colorA">
                                Color A
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorA-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={colorA.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorAChange({ ...colorA, h: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorA-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorA.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorAChange({ ...colorA, s: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorA-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorA.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorAChange({ ...colorA, b: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="colorB">
                                Color B
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorB-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={colorB.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorBChange({ ...colorB, h: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorB-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorB.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorBChange({ ...colorB, s: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorB-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorB.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onColorBChange({ ...colorB, b: Math.floor(parseFloat(e.target.value)) });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="stripeCount">
                                Number of Stripes
                            </Label>
                            <Slider
                                id="stripeCount"
                                min={2}
                                max={50}
                                step={1}
                                value={[stripeCount]}
                                onValueChange={(value: number[]) => onStripeCountChange(Math.floor(value[0]))}
                            />
                            <div className="text-center">{stripeCount}</div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="style">Style</Label>
                            <Select value={style} onValueChange={(value) => onStyleChange(value as ArtStyle)}>
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
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                    Reset
                </Button>
                <Button onClick={() => handlePublish()}>
                    {isEditing ? "Update" : "Publish"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Controllers;