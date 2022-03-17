const videoElement2 = document.getElementsByClassName('input_video2')[0];
const canvasElement2 = document.getElementsByClassName('output_canvas2')[0];
const canvasCtx2 = canvasElement2.getContext('2d');
videoElement2.style.display = 'none';
var img2 = new Image();
img2.src = '';
imgWidth2 = 0;
imgHeight2 = 0;

function memo2(job) {
    if (job == 'citizen') {
        img2.src = '';
        imgWidth2 = 0;
        imgHeight2 = 0;
    } else if (job == 'police') {
        img2.src = '../image/police_hat.png';
        imgWidth2 = 600;
        imgHeight2 = 451;
    } else if (job == 'doctor') {
        img2.src = '../image/doctor_hat.png';
        imgWidth2 = 1000;
        imgHeight2 = 630;
    } else if (job == 'soldier') {
        img2.src = '../image/military_helmet.png';
        imgWidth2 = 246;
        imgHeight2 = 250;
    } else if (job == 'mafia') {
        img2.src = '../image/mafia_hat.png';
        imgWidth2 = 1125;
        imgHeight2 = 701;
    } else if (job == 'none') {
        img2.src = '';
        imgWidth2 = 0;
        imgHeight2 = 0;
    }
}

function onResults(results) {
    canvasCtx2.save();
    canvasCtx2.clearRect(0, 0, canvasElement2.width, canvasElement2.height);
    // 기준점을 지정한 크기(x,y)만큼 평행이동함
    canvasCtx2.translate(canvasElement2.width, 0);
    // scale(x,y)
    // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
    // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
    canvasCtx2.scale(-1, 1);
    canvasCtx2.drawImage(results.image, 0, 0, canvasElement2.width, canvasElement2.height);

    // canvasCtx2.globalCompositeOperation = "source-over";

    if (results.multiFaceLandmarks.length == 0) {
        // canvas x y는 화면상의 이미지 위치
        // canvas Width Height는 이미지의 크기
        const canvasWidth = canvasElement2.width / 2;
        const canvasHeight = canvasElement2.height / 2;
        const canvasx = canvasElement2.width / 2 - canvasWidth / 2;
        // const canvasy = canvasElement2.height / 2 - canvasHeight / 2;
        const canvasy = 0;

        // console.log(canvasx)
        img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);

        canvasCtx2.restore();
    } else if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_TESSELATION,
            //                 {color: '#C0C0C070', lineWidth: 1});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
            // drawConnectors(canvasCtx2, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});

            let leftHeadx = 0;
            let leftHeady = 0;
            let rightHeadx = 0;
            let rightHeady = 0;
            for (let i = 0; i < landmarks.length; i++) {
                for (let j = i; j == i; j++) {
                    // 오른쪽 머리
                    if (i == 162) {
                        rightHeadx = landmarks[i].x * canvasElement2.width;
                        rightHeady = landmarks[i].y * canvasElement2.height;
                    }
                    // 왼쪽 머리
                    if (i == 389) {
                        leftHeadx = landmarks[i].x * canvasElement2.width;
                        leftHeady = landmarks[i].y * canvasElement2.height;
                    }
                }
            }

            if (img2.src.includes('mafia_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = 249;
                    const canvasx = canvasElement2.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement2.height / 2 - canvasHeight / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img2.src.includes('police_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasx = canvasElement2.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement2.height / 2 - canvasHeight / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;
                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img2.src.includes('doctor_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasx = canvasElement2.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement2.height / 2 - canvasHeight / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img2.src.includes('military_helmet.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    const canvasx = canvasElement2.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement2.height / 2 - canvasHeight / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight2 / imgWidth2) * canvasWidth;
                    // const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)
                    const canvasy =
                        rightHeady > leftHeady
                            ? rightHeady - (canvasHeight / 2 + canvasHeight / 5) - (rightHeady - leftHeady) / 2
                            : leftHeady - (canvasHeight / 2 + canvasHeight / 5) - (leftHeady - rightHeady) / 2;

                    img2.onload = canvasCtx2.drawImage(img2, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            }
        }
        canvasCtx2.restore();
    }
}

const faceMesh2 = new FaceMesh({
    locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
});
faceMesh2.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
faceMesh2.onResults(onResults);

const camera2 = new Camera(videoElement2, {
    onFrame: async () => {
        await faceMesh2.send({ image: videoElement2 });
    },
    width: 640,
    height: 480,
});
camera2.start();
