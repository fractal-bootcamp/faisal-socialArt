import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import "../index.css"

type Style = "line" | "circle"

interface ControllersProps {
    colorA: { h: number; s: number; b: number };
    colorB: { h: number; s: number; b: number };
    stripeCount: number;
    style: Style;
    onColorAChange: (color: { h: number; s: number; b: number }) => void;
    onColorBChange: (color: { h: number; s: number; b: number }) => void;
    onStripeCountChange: (count: number) => void;
    onStyleChange: (style: Style) => void;
}

const Controllers: React.FC<ControllersProps> = ({
    colorA,
    colorB,
    stripeCount,
    style,
    onColorAChange,
    onColorBChange,
    onStripeCountChange,
    onStyleChange
}) => {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Art Controllers</CardTitle>
                <CardDescription>Customize your art using HSB color model.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="colorA">Color A (Top)</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorA-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={colorA.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(360, value));
                                        onColorAChange({ ...colorA, h: valueSafety });
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
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(100, value));
                                        onColorAChange({ ...colorA, s: valueSafety });
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
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(100, value));
                                        onColorAChange({ ...colorA, b: valueSafety });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="colorB">Color B (Bottom)</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    id="colorB-hue"
                                    type="number"
                                    min="0"
                                    max="360"
                                    value={colorB.h}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(360, value));
                                        onColorBChange({ ...colorB, h: valueSafety });
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
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(100, value));
                                        onColorBChange({ ...colorB, s: valueSafety });
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
                                        const value = parseInt(e.target.value);
                                        const valueSafety = Math.max(0, Math.min(100, value));
                                        onColorBChange({ ...colorB, b: valueSafety });
                                    }}
                                    placeholder="Brightness"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="stripeCount">Number of Stripes</Label>
                            <Slider
                                id="stripeCount"
                                min={2}
                                max={50}
                                step={1}
                                value={[stripeCount]}
                                onValueChange={(value: number[]) => onStripeCountChange(value[0])}
                            />
                            <div className="text-center">{stripeCount}</div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="style">Style</Label>
                            <Select value={style} onValueChange={(value) => onStyleChange(value as Style)}>
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
                <Button variant="outline">Clear</Button>
                <Button>Generate</Button>
            </CardFooter>
        </Card>
    )
}

export default Controllers