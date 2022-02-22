const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
videoElement.style.display='none'
var img = new Image();
img.src = "mafia_hat.png";

function onResults(results) {
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // 기준점을 지정한 크기(x,y)만큼 평행이동함
    canvasCtx.translate(canvasElement.width, 0);
    // scale(x,y)
    // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
    // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    // canvasCtx.globalCompositeOperation = "source-over";
        
        if (results.multiFaceLandmarks.length == 0) {
            const canvasWidth = 400
            const canvasHeight = 249
            const canvasx = canvasElement.width / 2 - canvasWidth / 2;
            const canvasy = canvasElement.height / 2 - canvasHeight / 2;

            // console.log(canvasx)
            img.onload = canvasCtx.drawImage(img,canvasx,canvasy,canvasWidth,canvasHeight)
            
        canvasCtx.restore();
        }

        else if (results.multiFaceLandmarks) {
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
                    if ( i == 162) {
                        rightHeadx = landmarks[i].x * canvasElement.width
                        rightHeady = landmarks[i].y * canvasElement.height
                    }
                    // 왼쪽 머리
                    if ( i == 389) {
                        leftHeadx = landmarks[i].x * canvasElement.width
                        leftHeady = landmarks[i].y * canvasElement.height
                    }
                }
                
            }

            imgWidth = 1125
            imgHeight = 701

            // if ((leftHeady > rightHeady ? leftHeady - rightHeady : rightHeady - leftHeady) > rightHeadx - leftHeadx) {
            //     const canvasWidth = 400
            //     const canvasHeight = 249
            //     const canvasx = canvasElement.width / 2 - canvasWidth / 2;
            //     const canvasy = canvasElement.height / 2 - canvasHeight / 2;

            //     // console.log(canvasx)
            //     img.onload = canvasCtx.drawImage(img,canvasx,canvasy,canvasWidth,canvasHeight)
            // }
            if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                const canvasWidth = 400
                const canvasHeight = 249
                const canvasx = canvasElement.width / 2 - canvasWidth / 2;
                const canvasy = canvasElement.height / 2 - canvasHeight / 2;

                // console.log(canvasx)
                img.onload = canvasCtx.drawImage(img,canvasx,canvasy,canvasWidth,canvasHeight)
            }
            else {
                // canvas x y는 화면상의 이미지 위치
                // canvas Width Height는 이미지의 크기
                const canvasx = rightHeadx - ((leftHeadx-rightHeadx)/2)
                const canvasWidth = (leftHeadx-rightHeadx)*2 
                const canvasHeight = (imgHeight / imgWidth) * canvasWidth
                const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)

                img.onload = canvasCtx.drawImage(img,canvasx,canvasy,canvasWidth,canvasHeight)
            
            
            }
            

            // for ((lm_id, lm) in landmarks) {
            //     console.log('lm_id : ' + lm_id)
            //     console.log('lm : ' + lm)
            // }
        }
        canvasCtx.restore();
    }

    
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