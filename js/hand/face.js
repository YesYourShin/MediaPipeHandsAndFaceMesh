

const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

export const drawMesh = (predictions, ctx) => {
    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const keypoints = prediction.scaledMesh;

            //  Draw Triangles
            for (let i = 0; i < TRIANGULATION.length / 3; i++) {
                // Get sets of three keypoints for the triangle
                const points = [TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1], TRIANGULATION[i * 3 + 2]].map(index => keypoints[index]);
                //  Draw triangle
                drawPath(ctx, points, true);
            }

            // Draw Dots
            for (let i = 0; i < keypoints.length; i++) {
                const x = keypoints[i][0];
                const y = keypoints[i][1];

                ctx.beginPath();
                ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI);
                ctx.fillStyle = 'aqua';
                ctx.fill();
            }
        });
    }
};

const runFacemesh = async () => {
    // OLD MODEL
    const net = await facemesh.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
    });
    setInterval(() => {
        detect(net);
    }, 100);
};

const detect = async net => {
    // Make Detections
    const face = await net.estimateFaces(videoElement);
    console.log(face);

    requestAnimationFrame(() => {
        drawMesh(face, canvasCtx);
    });
};

runFacemesh();
