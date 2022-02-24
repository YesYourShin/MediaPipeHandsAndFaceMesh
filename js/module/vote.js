const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
videoElement.style.display='none'
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
    if (results.multiHandLandmarks) {
            let safe = false;
            let kill = false;
            let text = '';

        for (const landmarks of results.multiHandLandmarks) {
            
            if (landmarks[4]['y'] < landmarks[17]['y'] && landmarks[4]['y'] < landmarks[3]['y']){
                kill = true;
            }
            
            else if (landmarks[4]['y'] > landmarks[17]['y'] && landmarks[4]['y'] > landmarks[3]['y']){
                safe = true;
            }

            if (kill == true){
                text = "찬성";
            }else if(safe == true){
                text = "반대";
            }
            if (landmarks && kill == false && safe == false){
                text = "손을 정확하게 인식시켜 주세요.";
            }

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
        canvasCtx.restore();
        canvasCtx.font = "40px gulim"
        canvasCtx.fillStyle = "rgba(255,255,255,1)"
        canvasCtx.fillText("죽이겠습니까?", 50, 50);
        canvasCtx.fillText(text, 50, 100);
        console.log(text);
        
    }
}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
// hands.onResults(checkThumbs);

// 왜 캔버스 쪽 화면 안 뜸?
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();