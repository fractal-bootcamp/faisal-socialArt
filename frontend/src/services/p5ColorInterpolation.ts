import p5 from "p5";

export const drawLineStyle = (p: p5, colorA: p5.Color, colorB: p5.Color, stripeCount: number) => {
    const stripeHeight = p.height / stripeCount;

    for (let y = 0; y < p.height; y += stripeHeight) {
        const fadeAmount = y / p.height;
        const betweenColor = p.lerpColor(colorA, colorB, fadeAmount);
        p.fill(betweenColor);
        p.rect(0, y, p.width, stripeHeight);
    }
}

export const drawCircleStyle = (p: p5, colorA: p5.Color, colorB: p5.Color, stripeCount: number) => {
    const maxRadius = p.min(p.width, p.height) / 2;
    const radiusStep = maxRadius / stripeCount;

    for (let r = maxRadius; r > 0; r -= radiusStep) {
        const fadeAmount = 1 - r / maxRadius;
        const betweenColor = p.lerpColor(colorA, colorB, fadeAmount);
        p.fill(betweenColor);
        p.circle(p.width / 2, p.height / 2, r * 2);
    }
}

export const drawLabels = (p: p5, style: "line" | "circle") => {
    const margin = 5;
    const boxWidth = 60;
    const cornerRadius = 5;
    const stripeHeight = p.height / 12;

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);

    switch (style) {
        case "line":
            // For line style, keep labels at top and bottom of each end
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
            break;
        case "circle":
            // Position Color A at the center top
            p.rect(p.width / 2 - boxWidth / 2, margin, boxWidth, stripeHeight - margin * 2, cornerRadius);
            p.fill(0);
            p.text('Color A', p.width / 2 - boxWidth / 2, margin, boxWidth, stripeHeight - margin * 2);
            p.fill(255);

            // Position Color B at the center bottom
            p.rect(p.width / 2 - boxWidth / 2, p.height - stripeHeight + margin, boxWidth, stripeHeight - margin * 2, cornerRadius);
            p.fill(0);
            p.text('Color B', p.width / 2 - boxWidth / 2, p.height - stripeHeight + margin, boxWidth, stripeHeight - margin * 2);
            break;
    }
}