import { useState } from "react"
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

type Style = "line" | "circle"

interface ControllersProps {
    style: Style
}

const Controllers: React.FC<ControllersProps> = ({ style }) => {
    const [colorA, setColorA] = useState<{ h: number, s: number, b: number }>({ h: 100, s: 90, b: 100 })
    const [colorB, setColorB] = useState<{ h: number, s: number, b: number }>({ h: 250, s: 80, b: 20 })
    const [stripeCount, setStripeCount] = useState<number>(12)
    const [selectedStyle, setSelectedStyle] = useState<Style>(style)

    const handleGenerate = () => {
        // TODO: Implement art generation logic using p5.js
        console.log("Generate art with:", { colorA, colorB, stripeCount, selectedStyle })
    }

    const handleClear = () => {
        // TODO: Implement clear art logic
        console.log("Clear art")
    }

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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorA({ ...colorA, h: parseInt(e.target.value) })}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorA-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorA.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorA({ ...colorA, s: parseInt(e.target.value) })}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorA-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorA.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorA({ ...colorA, b: parseInt(e.target.value) })}
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorB({ ...colorB, h: parseInt(e.target.value) })}
                                    placeholder="Hue"
                                />
                                <Input
                                    id="colorB-saturation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorB.s}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorB({ ...colorB, s: parseInt(e.target.value) })}
                                    placeholder="Saturation"
                                />
                                <Input
                                    id="colorB-brightness"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={colorB.b}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorB({ ...colorB, b: parseInt(e.target.value) })}
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
                                onValueChange={(value: number[]) => setStripeCount(value[0])}
                            />
                            <div className="text-center">{stripeCount}</div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="style">Style</Label>
                            <Select value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as Style)}>
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
                <Button variant="outline" onClick={handleClear}>Clear</Button>
                <Button onClick={handleGenerate}>Generate</Button>
            </CardFooter>
        </Card>
    )
}

export default Controllers