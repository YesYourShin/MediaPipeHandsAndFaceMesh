const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement2 = document.getElementsByClassName('output_canvas2')[0];
const canvasCtx2 = canvasElement2.getContext('2d');

// videoElement.style.display = 'none';

let onResults = results => {
    canvasCtx2.save();
    canvasCtx2.clearRect(0, 0, canvasElement2.width, canvasElement2.height);
    // 기준점을 지정한 크기(x,y)만큼 평행이동함
    canvasCtx2.translate(canvasElement2.width, 0);
    // scale(x,y)
    // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
    // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
    canvasCtx2.scale(-1, 1);
    canvasCtx2.drawImage(results.image, 0, 0, canvasElement2.width, canvasElement2.height);

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx2, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx2, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    canvasCtx2.restore();
};
const getMedia = async () => {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 },
            // video: true,
        });
        videoElement.srcObject = myStream;
        videoElement.play();
        await media();
    } catch (e) {
        console.log(e);
    }
};
const hands = new Hands({
    locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
hands.onResults(onResults);
const media = async () => {
    if (!videoElement) {
        requestAnimationFrame(media);
    } else {
        await hands.send({ image: videoElement });
        requestAnimationFrame(media);
    }
};
getMedia();
