import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import type { ArtWork } from '@/services/artService';
import { drawLineStyle, drawCircleStyle, drawLabels } from '../services/p5ColorInterpolation';

interface ArtWorkProps {
    art: ArtWork;
    isEditing: boolean;
}

const ArtWork: React.FC<ArtWorkProps> = ({ art }) => {
    const sketchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sketchRef.current) {
            const sketch = (p: p5) => {
                p.setup = () => {
                    p.createCanvas(400, 400);
                    p.colorMode(p.HSB);
                    p.noStroke();
                };

                p.draw = () => {
                    const colorAP5 = p.color(art.colorA.h, art.colorA.s, art.colorA.b);
                    const colorBP5 = p.color(art.colorB.h, art.colorB.s, art.colorB.b);

                    if (art.style === 'line') {
                        drawLineStyle(p, colorAP5, colorBP5, art.stripeCount);
                    } else {
                        drawCircleStyle(p, colorAP5, colorBP5, art.stripeCount);
                    }

                    drawLabels(p, art.style);
                };
            };

            const p5Instance = new p5(sketch, sketchRef.current);

            return () => {
                p5Instance.remove();
            };
        }
    }, [art]);

    return (<div ref={sketchRef}></div>);
};

export default ArtWork;