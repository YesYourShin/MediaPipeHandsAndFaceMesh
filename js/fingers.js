const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks) {
        let rightHandLandmarks = {};
        let leftHandLandmarks = {};
        let rightFingersStatus = {'RIGHT_THUMB': false, 'RIGHT_INDEX_FINGER': false, 'RIGHT_MIDDLE_FINGER': false, 'RIGHT_RING_FINGER': false, 'RIGHT_PINKY': false}
        let leftFingersStatus = {'LEFT_THUMB': false, 'LEFT_INDEX_FINGER': false, 'LEFT_MIDDLE_FINGER': false, 'LEFT_RING_FINGER': false, 'LEFT_PINKY': false}
        let text = '';
        let n = 0;
        for (const landmarks of results.multiHandLandmarks) {
            if (results.multiHandedness) {
                // 오른손
                if (results.multiHandedness[n].label == 'Right') {
                    rightHandLandmarks = landmarks;

                    // 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 바닥면)
                    if (rightHandLandmarks[4]['x'] < rightHandLandmarks[17]['x']) {
                        // 엄지 4번(x)가 엄지 3번 (x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                        if (rightHandLandmarks[4]['x'] < rightHandLandmarks[3]['x'] && rightHandLandmarks[4]['y'] > rightHandLandmarks[6]['y']) {
                            rightFingersStatus["RIGHT_THUMB"] = true
                        }
                    }
                        
                    // 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 등면)
                    else if (rightHandLandmarks[17]['x'] < rightHandLandmarks[4]['x']) {
                        // 엄지 4번(x)가 엄지 2번(x)보다 오른쪽에 있고 엄지 4번 (y)가 검지 6번(y)보다 위에 있을 경우
                        if (rightHandLandmarks[4]['x'] > rightHandLandmarks[2]['x'] && rightHandLandmarks[4]['y'] > rightHandLandmarks[6]['y']) {
                            rightFingersStatus["RIGHT_THUMB"] = true
                        }
                    }

                    // 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
                    if (rightHandLandmarks[8]['y'] < rightHandLandmarks[6]['y']) {
                        rightFingersStatus["RIGHT_INDEX_FINGER"] = true
                    }
                    if (rightHandLandmarks[12]['y'] < rightHandLandmarks[10]['y']) {
                        rightFingersStatus["RIGHT_MIDDLE_FINGER"] = true
                    }
                    if (rightHandLandmarks[16]['y'] < rightHandLandmarks[14]['y']) {
                        rightFingersStatus["RIGHT_RING_FINGER"] = true
                    }
                    if (rightHandLandmarks[20]['y'] < rightHandLandmarks[18]['y']) {
                        rightFingersStatus["RIGHT_PINKY"] = true
                    }
                }
                // 왼손
                if (results.multiHandedness[n].label == 'Left') {
                    leftHandLandmarks = landmarks;

                    // 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 바닥면)
                    if (leftHandLandmarks[17]['x'] < leftHandLandmarks[4]['x']) {
                        // 엄지 4번(x)가 엄지 3번 (x)보다 오른쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                        if (leftHandLandmarks[4]['x'] > leftHandLandmarks[3]['x'] && leftHandLandmarks[4]['y'] > leftHandLandmarks[6]['y']) {
                            leftFingersStatus["LEFT_THUMB"] = true
                        }
                    }

                    // 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 등면)
                    else if (leftHandLandmarks[17]['x'] > leftHandLandmarks[4]['x']) {
                        // 엄지 4번(x)가 엄지 2번(x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                        if (leftHandLandmarks[4]['x'] < leftHandLandmarks[2]['x'] && leftHandLandmarks[4]['y'] > leftHandLandmarks[6]['y']) {
                            leftFingersStatus["LEFT_THUMB"] = true
                        }
                    }

                    // 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
                    if (leftHandLandmarks[8]['y'] < leftHandLandmarks[6]['y']) {
                        leftFingersStatus["LEFT_INDEX_FINGER"] = true
                    }
                    if (leftHandLandmarks[12]['y'] < leftHandLandmarks[10]['y']) {
                        leftFingersStatus["LEFT_MIDDLE_FINGER"] = true
                    }
                    if (leftHandLandmarks[16]['y'] < leftHandLandmarks[14]['y']) {
                        leftFingersStatus["LEFT_RING_FINGER"] = true
                    }
                    if (leftHandLandmarks[20]['y'] < leftHandLandmarks[18]['y']) {
                        leftFingersStatus["LEFT_PINKY"] = true
                    }
                }
                n += 1
            }

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});

            // draw.text((50, 50), text="몇 번을 지목하겠습니까?", font = font, fill=(255, 255, 255))

            if (rightHandLandmarks.length > 0) {
                if (rightHandLandmarks[0]['y'] < rightHandLandmarks[1]['y'] || (rightHandLandmarks[0]['y'] - rightHandLandmarks[5]['y'])/2 > rightHandLandmarks[0]['y'] - rightHandLandmarks[17]['y']) {
                    // draw.text((50, 100), text="손을 정확하게 인식시켜주세요.", font = font, fill=(255, 255, 255))
                    text = "손을 정확하게 인식시켜주세요."
                }
                    
            }
                
            if (leftHandLandmarks.length > 0) {
                if (leftHandLandmarks[0]['y'] < leftHandLandmarks[1]['y'] || (leftHandLandmarks[0]['y'] - leftHandLandmarks[5]['y'])/2 > leftHandLandmarks[0]['y'] - leftHandLandmarks[17]['y']) {

                    // draw.text((50, 100), text="손을 정확하게 인식시켜주세요.", font = font, fill=(255, 255, 255))
                    text = "손을 정확하게 인식시켜주세요."
                }
                
            }
                
            if (rightHandLandmarks.length > 0 || leftHandLandmarks.length > 0) {
                rightFingersCount = 0
                leftFingersCount = 0

                for (fingersStatus of Object.values(rightFingersStatus)) {
                    if (fingersStatus == true) {
                        rightFingersCount += 1 
                    }
                }
                    

                for (fingers of Object.values(leftFingersStatus)) {
                    if (fingers == true) {
                        leftFingersCount += 1 
                    }
                    
                }
                    

                totalFingers = rightFingersCount + leftFingersCount
                if (totalFingers == 0) {
                    // draw.text((50, 100), "0번은 없습니다.", font = font, fill=(255, 255, 255))
                    text =  "0번은 없습니다.";
                }
                    
                else {
                    // draw.text((50, 100), str(total_fingers) + "번", font = font, fill=(255, 255, 255))
                    text = totalFingers + "번";
                }
                    
            }
        }

        
        
        console.log(text);

    canvasCtx.restore();
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

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();