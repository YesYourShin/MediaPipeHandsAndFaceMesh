const videoElement = document.getElementsByClassName('video1')[0];
const canvasElement = document.getElementsByClassName('canvas1')[0];
const canvasCtx = canvasElement.getContext('2d');
// videoElement.style.display = 'none';
let i = 0;
let myStream;
const getMedia = async () => {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 },
            // video: true,
        });
        videoElement.srcObject = myStream;
        videoElement.play();
        // main();
    } catch (e) {
        console.log(e);
    }
};

const detectFacesTest = async () => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);

    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // canvasCtx.restore();
    // canvasCtx.save();
    const returnTensors = false;
    const predictions = await model.estimateFaces(videoElement, returnTensors);
    // canvasCtx.restore();
    this.img[i] = new Image();
    if (this.imgSrc[i]) this.img[i].src = this.imgSrc[i];
    let img = this.img[i];
    let imgWidth = this.imgWidth[i];
    let imgHeight = this.imgHeight[i];

    // console.log(this.results[this.userNum - 1]);
    // console.log(this.results[i]);

    if (!predictions[i]) {
        const canvasWidth = canvasElement.width / 2;
        const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
        const canvasx = canvasElement.width / 2 - canvasWidth / 2;
        const canvasy = 0;
        img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);

        canvasCtx.restore();
    } else {
        let leftEyex;
        let leftEyey;
        let rightEyex;
        let rightEyey;
        let leftEarx;
        let leftEary;
        let rightEarx;
        let rightEary;
        let nosey;
        let mousey;
        let bottomRightx = predictions[i].bottomRight[0];
        let bottomRighty = predictions[i].bottomRight[1];
        let topLeftx = predictions[i].topLeft[0];
        let topLefty = predictions[i].topLeft[1];

        let imgCitizenHat = '';
        let imgPoliceHat = img.src.includes('police_hat.png');
        let imgDoctorHat = img.src.includes('doctor_hat.png');
        let imgMilitaryHelmet = img.src.includes('military_helmet.png');
        let imgMafiaHat = img.src.includes('mafia_hat.png');

        for (let j = 0; j < predictions[i].landmarks.length; j++) {
            switch (j) {
                case 0: // 오른쪽 눈
                    rightEyex = predictions[i].landmarks[j][0];
                    rightEyey = predictions[i].landmarks[j][1];
                    break;
                case 1: // 왼쪽 눈
                    leftEyex = predictions[i].landmarks[j][0];
                    leftEyey = predictions[i].landmarks[j][1];
                    break;
                case 2: // 코
                    nosey = predictions[i].landmarks[j][1];
                    break;
                case 3: // 입
                    mousey = predictions[i].landmarks[j][1];
                    break;
                case 4: // 오른쪽 귀
                    rightEarx = predictions[i].landmarks[j][0];
                    rightEary = predictions[i].landmarks[j][1];
                    break;
                case 5: // 왼쪽 귀
                    leftEarx = predictions[i].landmarks[j][0];
                    leftEary = predictions[i].landmarks[j][1];
                    break;
            }
            // console.log(this.results[0][0]);
            canvasCtx.fillRect(predictions[i].landmarks[j][0], predictions[i].landmarks[j][1], 5, 5);
            // console.log(this.topLeftLandmarks);
            if (imgCitizenHat || imgPoliceHat || imgDoctorHat || imgMafiaHat || imgMilitaryHelmet) {
                // const canvasWidth = (leftEarx - rightEarx) * 2;
                // const canvasHeight = (mousey - nosey) * 8;
                // const canvasx =
                //   rightEyex - canvasWidth / 2 + (leftEyex - rightEyex) / 2;
                // const canvasy =
                //   rightEyey < leftEyey
                //     ? rightEyey - canvasHeight - (leftEarx - rightEarx) / 6
                //     : leftEyey - canvasHeight - (leftEarx - rightEarx) / 6;

                const canvasWidth = bottomRightx - topLeftx;
                const canvasHeight = bottomRighty - topLefty;
                const canvasx = topLeftx;
                const canvasy = topLefty - canvasHeight;

                img.onload = canvasCtx.drawImage(img, canvasx, canvasy, canvasWidth, canvasHeight);
            }
        }
        canvasCtx.restore();
    }
    // canvasCtx.restore();
};

const main = async () => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);

    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
    const predictions = await model.estimateFaces(canvasElement, returnTensors);

    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            // Render a rectangle over each detected face.
            canvasCtx.fillRect(start[0], start[1], size[0], size[1]);
        }
    }
    canvasCtx.restore();
};
getMedia();
videoElement.addEventListener('loadeddata', async () => {
    model = await blazeface.load();
    setInterval(main, 30);
    // detectFaces();
});
