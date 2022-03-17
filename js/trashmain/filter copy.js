const videoElement = document.getElementsByClassName('input_video')[0];
const videoElement2 = document.getElementsByClassName('input_video2')[0];
const canvasElement = document.getElementsByClassName('canvasmemo1')[0];
const canvasCtx = canvasElement.getContext('2d');
// videoElement.style.display = 'none';
var img = new Image();
img.src = '';
imgWidth = 0;
imgHeight = 0;

function memo(job) {
    if (job == 'citizen') {
        img.src = '';
        imgWidth = 0;
        imgHeight = 0;
    } else if (job == 'police') {
        img.src = '../image/police_hat.png';
        imgWidth = 600;
        imgHeight = 451;
    } else if (job == 'doctor') {
        img.src = '../image/doctor_hat.png';
        imgWidth = 1000;
        imgHeight = 630;
    } else if (job == 'soldier') {
        img.src = '../image/military_helmet.png';
        imgWidth = 246;
        imgHeight = 250;
    } else if (job == 'mafia') {
        img.src = '../image/mafia_hat.png';
        imgWidth = 1125;
        imgHeight = 701;
    } else if (job == 'none') {
        img.src = '';
        imgWidth = 0;
        imgHeight = 0;
    }
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // 기준점을 지정한 크기(x,y)만큼 평행이동함
    canvasCtx.translate(canvasElement.width, 0);
    // scale(x,y)
    // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
    // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // canvasCtx.globalCompositeOperation = "source-over";

    if (results.multiFaceLandmarks.length == 0) {
        // canvas x y는 화면상의 이미지 위치
        // canvas Width Height는 이미지의 크기
        const canvasWidth = canvasElement.width / 2;
        const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
        const canvasx = canvasElement.width / 2 - canvasWidth / 2;
        // const canvasy = canvasElement.height / 2 - canvasHeight / 2;
        const canvasy = 0;

        // console.log(canvasx)
        img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);

        canvasCtx.restore();
    } else if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });

            let leftHeadx = 0;
            let leftHeady = 0;
            let rightHeadx = 0;
            let rightHeady = 0;
            for (let i = 0; i < landmarks.length; i++) {
                for (let j = i; j == i; j++) {
                    // 오른쪽 머리
                    if (i == 162) {
                        rightHeadx = landmarks[i].x * canvasElement.width;
                        rightHeady = landmarks[i].y * canvasElement.height;
                    }
                    // 왼쪽 머리
                    if (i == 389) {
                        leftHeadx = landmarks[i].x * canvasElement.width;
                        leftHeady = landmarks[i].y * canvasElement.height;
                    }
                }
            }

            if (img.src.includes('mafia_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = 249;
                    const canvasx = canvasElement.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement.height / 2 - canvasHeight / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img.src.includes('police_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasx = canvasElement.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement.height / 2 - canvasHeight / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;
                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img.src.includes('doctor_hat.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasx = canvasElement.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement.height / 2 - canvasHeight / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasy = rightHeady > leftHeady ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2 : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            } else if (img.src.includes('military_helmet.png')) {
                if ((rightHeady > leftHeady ? rightHeady - leftHeady : leftHeady - rightHeady) > leftHeadx - rightHeadx) {
                    const canvasWidth = 400;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    const canvasx = canvasElement.width / 2 - canvasWidth / 2;
                    const canvasy = canvasElement.height / 2 - canvasHeight / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                } else {
                    // canvas x y는 화면상의 이미지 위치
                    // canvas Width Height는 이미지의 크기
                    const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                    const canvasWidth = (leftHeadx - rightHeadx) * 2;
                    const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
                    // const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)
                    const canvasy =
                        rightHeady > leftHeady
                            ? rightHeady - (canvasHeight / 2 + canvasHeight / 5) - (rightHeady - leftHeady) / 2
                            : leftHeady - (canvasHeight / 2 + canvasHeight / 5) - (leftHeady - rightHeady) / 2;

                    img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
                }
            }
        }
        canvasCtx.restore();
    }
}

const faceMesh = new FaceMesh({
    locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

faceMesh.onResults(onResults);

// async function step(videoElement) {
//     await faceMesh.send({ image: videoElement });
//     if (videoElement) {
//         window.requestAnimationFrame(step);
//     }
// }

// window.requestAnimationFrame(step);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    width: 640,
    height: 480,
});
camera.start();
// videoElement.onplay = function () {
//     // Set the source of one <video> element to be a stream from another.
//     var stream = videoElement.captureStream();
//     videoElement2.srcObject = stream;
//     faceMesh.send({ image: videoElement });
// };

// MediaStream 캡처
// https://developers.google.com/web/updates/2016/10/capture-stream

// mediapipe js
// https://github.com/google/mediapipe/issues/3018
// https://github.com/google/mediapipe/issues/1672
// https://github.com/google/mediapipe/issues/1727#issuecomment-799844456

// requestAnimationFrame
// https://webisfree.com/2020-03-19/[%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8]-requestanimationframe()%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-%EB%B0%8F-%EC%98%88%EC%A0%9C
