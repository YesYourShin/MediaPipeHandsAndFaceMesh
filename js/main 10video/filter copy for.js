let videoElements = [];
let canvasElements = [];
let canvasCtxs = [];
let imgs = [];
let imgsWidth = [];
let imgsHeight = [];
for (i = 0; i < 10; i++) {
    videoElements[i] = document.getElementsByClassName("input_video" + i)[0];
    canvasElements[i] = document.getElementsByClassName("output_canvas" + i)[0];
    canvasCtxs[i] = canvasElements[i].getContext("2d");
    videoElements[i].style.display = "none";
    imgs[i] = new Image();
    imgs[i].src = "";
    imgsWidth[i] = 0;
    imgsHeight[i] = 0;

    function memo(job) {
        if (job == "citizen") {
            imgs[i].src = "";
            imgsWidth[i] = 0;
            imgsHeight[i] = 0;
        } else if (job == "police") {
            imgs[i].src = "../image/police_hat.png";
            imgsWidth[i] = 600;
            imgsHeight[i] = 451;
        } else if (job == "doctor") {
            imgs[i].src = "../image/doctor_hat.png";
            imgsWidth[i] = 1000;
            imgsHeight[i] = 630;
        } else if (job == "soldier") {
            imgs[i].src = "../image/military_helmet.png";
            imgsWidth[i] = 246;
            imgsHeight[i] = 250;
        } else if (job == "mafia") {
            imgs[i].src = "../image/mafia_hat.png";
            imgsWidth[i] = 1125;
            imgsHeight[i] = 701;
        } else if (job == "none") {
            imgs[i].src = "";
            imgsWidth[i] = 0;
            imgsHeight[i] = 0;
        }
    }

    function onResults(results) {
        canvasCtxs[i].save();
        canvasCtxs[i].clearRect(
            0,
            0,
            canvasElements[i].width,
            canvasElements[i].height
        );
        // 기준점을 지정한 크기(x,y)만큼 평행이동함
        canvasCtxs[i].translate(canvasElements[i].width, 0);
        // scale(x,y)
        // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
        // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
        canvasCtxs[i].scale(-1, 1);
        canvasCtxs[i].drawImage(
            results.image,
            0,
            0,
            canvasElements[i].width,
            canvasElements[i].height
        );

        // canvasCtxs[i].globalCompositeOperation = "source-over";

        if (results.multiFaceLandmarks.length == 0) {
            // canvas x y는 화면상의 이미지 위치
            // canvas Width Height는 이미지의 크기
            const canvasWidth = canvasElements[i].width / 2;
            const canvasHeight = canvasElements[i].height / 2;
            const canvasx = canvasElements[i].width / 2 - canvasWidth / 2;
            // const canvasy = canvasElements[i].height / 2 - canvasHeight / 2;
            const canvasy = 0;

            // console.log(canvasx)
            imgs[i].onload = canvasCtxs[i].drawImage(
                imgs[i],
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
            );

            canvasCtxs[i].restore();
        } else if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_TESSELATION,
                //                 {color: '#C0C0C070', lineWidth: 1});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
                // drawConnectors(canvasCtxs[i], landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});

                let leftHeadx = 0;
                let leftHeady = 0;
                let rightHeadx = 0;
                let rightHeady = 0;
                for (let i = 0; i < landmarks.length; i++) {
                    for (let j = i; j == i; j++) {
                        // 오른쪽 머리
                        if (i == 162) {
                            rightHeadx =
                                landmarks[i].x * canvasElements[i].width;
                            rightHeady =
                                landmarks[i].y * canvasElements[i].height;
                        }
                        // 왼쪽 머리
                        if (i == 389) {
                            leftHeadx =
                                landmarks[i].x * canvasElements[i].width;
                            leftHeady =
                                landmarks[i].y * canvasElements[i].height;
                        }
                    }
                }

                if (imgs[i].src.includes("mafia_hat.png")) {
                    if (
                        (rightHeady > leftHeady
                            ? rightHeady - leftHeady
                            : leftHeady - rightHeady) >
                        leftHeadx - rightHeadx
                    ) {
                        const canvasWidth = canvasElements[i].width / 2;
                        const canvasHeight = canvasElements[i].height / 2;
                        const canvasx =
                            canvasElements[i].width / 2 - canvasWidth / 2;
                        const canvasy = 0;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    } else {
                        // canvas x y는 화면상의 이미지 위치
                        // canvas Width Height는 이미지의 크기
                        const canvasx =
                            rightHeadx - (leftHeadx - rightHeadx) / 2;
                        const canvasWidth = (leftHeadx - rightHeadx) * 2;
                        const canvasHeight =
                            (imgsHeight[i] / imgsWidth[i]) * canvasWidth;
                        const canvasy =
                            rightHeady > leftHeady
                                ? rightHeady -
                                  canvasHeight -
                                  (rightHeady - leftHeady) / 2
                                : rightHeady -
                                  canvasHeight +
                                  (leftHeady - rightHeady) / 2;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    }
                } else if (imgs[i].src.includes("police_hat.png")) {
                    if (
                        (rightHeady > leftHeady
                            ? rightHeady - leftHeady
                            : leftHeady - rightHeady) >
                        leftHeadx - rightHeadx
                    ) {
                        const canvasWidth = canvasElements[i].width / 2;
                        const canvasHeight = canvasElements[i].height / 2;
                        const canvasx =
                            canvasElements[i].width / 2 - canvasWidth / 2;
                        const canvasy = 0;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    } else {
                        // canvas x y는 화면상의 이미지 위치
                        // canvas Width Height는 이미지의 크기
                        const canvasx =
                            rightHeadx - (leftHeadx - rightHeadx) / 2;
                        const canvasWidth = (leftHeadx - rightHeadx) * 2;
                        const canvasHeight =
                            (imgsHeight[i] / imgsWidth[i]) * canvasWidth;
                        const canvasy =
                            rightHeady > leftHeady
                                ? rightHeady -
                                  canvasHeight -
                                  (rightHeady - leftHeady) / 2
                                : rightHeady -
                                  canvasHeight +
                                  (leftHeady - rightHeady) / 2;
                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    }
                } else if (imgs[i].src.includes("doctor_hat.png")) {
                    if (
                        (rightHeady > leftHeady
                            ? rightHeady - leftHeady
                            : leftHeady - rightHeady) >
                        leftHeadx - rightHeadx
                    ) {
                        const canvasWidth = canvasElements[i].width / 2;
                        const canvasHeight = canvasElements[i].height / 2;
                        const canvasx =
                            canvasElements[i].width / 2 - canvasWidth / 2;
                        const canvasy = 0;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    } else {
                        // canvas x y는 화면상의 이미지 위치
                        // canvas Width Height는 이미지의 크기
                        const canvasx =
                            rightHeadx - (leftHeadx - rightHeadx) / 2;
                        const canvasWidth = (leftHeadx - rightHeadx) * 2;
                        const canvasHeight =
                            (imgsHeight[i] / imgsWidth[i]) * canvasWidth;
                        const canvasy =
                            rightHeady > leftHeady
                                ? rightHeady -
                                  canvasHeight -
                                  (rightHeady - leftHeady) / 2
                                : rightHeady -
                                  canvasHeight +
                                  (leftHeady - rightHeady) / 2;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    }
                } else if (imgs[i].src.includes("military_helmet.png")) {
                    if (
                        (rightHeady > leftHeady
                            ? rightHeady - leftHeady
                            : leftHeady - rightHeady) >
                        leftHeadx - rightHeadx
                    ) {
                        const canvasWidth = canvasElements[i].width / 2;
                        const canvasHeight = canvasElements[i].height / 2;
                        const canvasx =
                            canvasElements[i].width / 2 - canvasWidth / 2;
                        const canvasy = 0;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    } else {
                        // canvas x y는 화면상의 이미지 위치
                        // canvas Width Height는 이미지의 크기
                        const canvasx =
                            rightHeadx - (leftHeadx - rightHeadx) / 2;
                        const canvasWidth = (leftHeadx - rightHeadx) * 2;
                        const canvasHeight =
                            (imgsHeight[i] / imgsWidth[i]) * canvasWidth;
                        // const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)
                        const canvasy =
                            rightHeady > leftHeady
                                ? rightHeady -
                                  (canvasHeight / 2 + canvasHeight / 5) -
                                  (rightHeady - leftHeady) / 2
                                : leftHeady -
                                  (canvasHeight / 2 + canvasHeight / 5) -
                                  (leftHeady - rightHeady) / 2;

                        imgs[i].onload = canvasCtxs[i].drawImage(
                            imgs[i],
                            canvasx,
                            canvasy,
                            canvasWidth,
                            canvasHeight
                        );
                    }
                }
            }
            canvasCtxs[i].restore();
        }
    }
    let faceMeshs = [];

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

    let camera = [];
    camera = new Camera(videoElements[i], {
        onFrame: async () => {
            await faceMesh.send({ image: videoElements[i] });
        },
        width: 640,
        height: 480,
    });
    camera.start();
}
