const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

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
        right_hand = {};
        left_hand = {};
        text = '';
        n = 0;
        for (const landmarks of results.multiHandLandmarks) {
            if (results.multiHandedness) {
                if (results.multiHandedness[n].label == 'Right') {
                    right_hand = landmarks;
                }

                if (results.multiHandedness[n].label == 'Left') {
                    left_hand = landmarks;
                }
                n += 1;
            }

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            
        }
        canvasCtx.restore();
        if (right_hand.length > 0 && left_hand.length > 0) {
            if (right_hand[9]['x'] > left_hand[9]['x'] && right_hand[12]['y'] < right_hand[0]['y'] && left_hand[12]['y'] < left_hand[0]['y'] && right_hand[5]['x'] < right_hand[0]['x'] && left_hand[5]['x'] > left_hand[0]['x']) {
                text="네";
            }
            else if (right_hand[9]['x'] < left_hand[9]['x'] && right_hand[12]['y'] < right_hand[0]['y'] && left_hand[12]['y'] < left_hand[0]['y'] && right_hand[9]['x'] < right_hand[0]['x'] && left_hand[9]['x'] > left_hand[0]['x']) {
                text="아니요";
            }
                
            else {
                text="손을 정확하게 인식시켜주세요.";
            }
                
        }
        
        else if (right_hand.length > 0 || left_hand.length > 0) {
            text="손을 정확하게 인식시켜주세요.";
        }
        
        canvasCtx.font = "40px gulim"
        canvasCtx.fillStyle = "rgba(255,255,255,1)"
        canvasCtx.fillText("n번에게 투표하시겠습니까?", 50, 50);
        canvasCtx.fillText(text, 50, 100);

    
    }

}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
// hands.onResults(checkThumbs);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();