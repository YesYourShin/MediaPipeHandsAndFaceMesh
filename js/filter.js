const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

var img = new Image();
img.src = "mafia_hat.png";

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    // canvasCtx.globalCompositeOperation = "source-over";
        


        if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                            {color: '#C0C0C070', lineWidth: 1});
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});

            let leftHeadx = 0;
            let leftHeady = 0;
            let rightHeadx = 0;
            let rightHeady = 0;
            for (let i = 0 ; i < landmarks.length ; i++) {

                for (let j = i ; j == i; j++) {
                    // 오른쪽 머리
                    if ( i == 389) {
                        rightHeadx = landmarks[i].x * canvasElement.width
                        rightHeady = landmarks[i].y * canvasElement.height
                    }
                    // 왼쪽 머리
                    if ( i == 162) {
                        leftHeadx = landmarks[i].x * canvasElement.width
                        leftHeady = landmarks[i].y * canvasElement.height
                    }
                }
                
            }

            imgWidth = 1125
            imgHeight = 701

            const canvasx = leftHeadx-((rightHeadx-leftHeadx)/2)
            
            console.log('leftHeadx: ' + leftHeadx + 'rightHeadx: ' + rightHeadx + 'canvasx: ' + canvasx)

            const canvasWidth = (rightHeadx-leftHeadx)*2 
            const canvasHeight = (imgHeight / imgWidth) * canvasWidth
            const canvasy = (leftHeady > rightHeady ? leftHeady-canvasHeight-(leftHeady - rightHeady) / 2 : leftHeady-canvasHeight+(rightHeady - leftHeady) / 2)

            img.onload = canvasCtx.drawImage(img,canvasx,canvasy,canvasWidth,canvasHeight)

                
            // for ((lm_id, lm) in landmarks) {
            //     console.log('lm_id : ' + lm_id)
            //     console.log('lm : ' + lm)
            // }
        }
    }

    canvasCtx.restore();
}

const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();