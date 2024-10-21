import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import Controllers from './Controllers';

type Style = "line" | "circle"

interface FeedItemProps {
    colorA: { h: number; s: number; b: number };
    colorB: { h: number; s: number; b: number };
    stripeCount: number;
    style: Style;
    onColorAChange?: (color: { h: number; s: number; b: number }) => void;
    onColorBChange?: (color: { h: number; s: number; b: number }) => void;
    onStripeCountChange?: (count: number) => void;
    onStyleChange?: (style: Style) => void;
}

const drawLineStyle = (p: p5, colorA: p5.Color, colorB: p5.Color, stripeCount: number) => {
    const stripeHeight = p.height / stripeCount;

    for (let y = 0; y < p.height; y += stripeHeight) {
        const fadeAmount = y / p.height;
        const betweenColor = p.lerpColor(colorA, colorB, fadeAmount);
        p.fill(betweenColor);
        p.rect(0, y, p.width, stripeHeight);
    }
}

const drawCircleStyle = (p: p5, colorA: p5.Color, colorB: p5.Color, stripeCount: number) => {
    const maxRadius = p.min(p.width, p.height) / 2;
    const radiusStep = maxRadius / stripeCount;

    for (let r = maxRadius; r > 0; r -= radiusStep) {
        const fadeAmount = 1 - r / maxRadius;
        const betweenColor = p.lerpColor(colorA, colorB, fadeAmount);
        p.fill(betweenColor);
        p.circle(p.width / 2, p.height / 2, r * 2);
    }
}

const drawLabels = (p: p5) => {
    const margin = 5;
    const boxWidth = 60;
    const cornerRadius = 5;
    const stripeHeight = p.height / 12;

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);
    p.rect(margin, margin, boxWidth, stripeHeight - margin * 2, cornerRadius);
    p.fill(0);
    p.text('Color A', margin, margin, boxWidth, stripeHeight - margin * 2);
    p.fill(255);
    p.rect(
        p.width - boxWidth - margin,
        p.height - stripeHeight + margin,
        boxWidth,
        stripeHeight - margin * 2,
        cornerRadius
    );
    p.fill(0);
    p.text('Color B', p.width - boxWidth - margin, p.height - stripeHeight + margin, boxWidth, stripeHeight - margin * 2);
}

const FeedItem: React.FC<FeedItemProps> = ({
    colorA,
    colorB,
    stripeCount,
    style,
    onColorAChange,
    onColorBChange,
    onStripeCountChange,
    onStyleChange
}) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const [p5Instance, setP5Instance] = useState<p5 | null>(null);

    useEffect(() => {
        if (sketchRef.current) {
            const sketch = (p: p5) => {
                p.setup = () => {
                    p.createCanvas(400, 400);
                    p.colorMode(p.HSB);
                    p.noStroke();
                };

                p.draw = () => {
                    const colorAP5 = p.color(colorA.h, colorA.s, colorA.b);
                    const colorBP5 = p.color(colorB.h, colorB.s, colorB.b);

                    if (style === 'line') {
                        drawLineStyle(p, colorAP5, colorBP5, stripeCount);
                    } else {
                        drawCircleStyle(p, colorAP5, colorBP5, stripeCount);
                    }

                    drawLabels(p);
                };
            };

            const newP5 = new p5(sketch, sketchRef.current);
            setP5Instance(newP5);

            return () => {
                newP5.remove();
            };
        }
    }, [colorA, colorB, stripeCount, style]);

    return (
        <div className="feed-item">
            <Controllers
                colorA={colorA}
                colorB={colorB}
                stripeCount={stripeCount}
                style={style}
                onColorAChange={onColorAChange || (() => { })}
                onColorBChange={onColorBChange || (() => { })}
                onStripeCountChange={onStripeCountChange || (() => { })}
                onStyleChange={onStyleChange || (() => { })}
            />
            <div className="mt-4" ref={sketchRef}></div>
        </div>
    );
};

export default FeedItem;
