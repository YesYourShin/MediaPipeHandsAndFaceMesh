import cv2
import mediapipe as mp
from PIL import ImageFont, ImageDraw, Image
import numpy as np

# opencv에 대한 다양한 감지를 그리는데에 도움이 되는 유틸리티
mp_drawing = mp.solutions.drawing_utils

# 모델을 가져옴
mp_hands = mp.solutions.hands

# 웹캠피드를 가져오는 코드

# 비디오 캡처 장치를 가져옴
# 사용 가능한 웹캠이 하나만 있기 때문에 기본적으로 0으로 설정
# 다른 가져올 게 있다면 숫자를 높여서 테스트
# 이미지가 비어있거나 하는 오류가 뜬다면 잘못된 캡처넘버일 가능성이 있으니 여러 숫자로 테스트
cap = cv2.VideoCapture(0)

# mp_hands의 hands모델에 액세스하여 감지 신뢰도와 추적 신뢰도를 지정
with mp_hands.Hands(min_detection_confidence=0.5,min_tracking_confidence=0.5, max_num_hands=1) as hands:

    # cap이 열려있는 동안 루프를 작성
    while cap.isOpened():
        # 비디오 캡처 피드를 읽고, 작성된 success와 frame으로 이를 수행하도록 피드에서 두 값을 추출함
        success, image = cap.read()

        # opencv를 사용할 때는 bgr에서 피드를 얻음 
        # 해당 이미지의 색상이 rgb로 표시되기를 원하므로 다시 채색을 수행해 변환된 이미지를 가져와서
        # 모델에 전달하여 프로세스를 작성하여 특정 이미지를 처리함
        # 이 모델 프로세스를 얻은 다음 그 결과를 표시할 수 있도록 이미지를 처리함
        # flip은 좌우나 상하를 반전시킴. 1은 좌우반전.
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)

        image.flags.writeable = False
        results = hands.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        keypoints = []

        # 화면에 손 랜드마크가 찍히면
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                
                for data_point in hand_landmarks.landmark:
                    keypoints.append({
                                        'X': data_point.x,
                                        'Y': data_point.y,
                                        })

                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        safe = False
        kill = False

        if keypoints:
            #엄지 4번(y)가 검지 5번(y)보다 위에 있을 때
            if keypoints[4]['Y'] < keypoints[17]['Y'] and keypoints[4]['Y'] < keypoints[3]['Y']:
                kill = True

            #엄지 4번(y)가 손목 0번(y)보다 아래에 있을 때
            if keypoints[4]['Y'] > keypoints[17]['Y'] and keypoints[4]['Y'] > keypoints[3]['Y']:
                safe = True

        text = ""
        if kill == True:
            text = "찬성"
        elif safe == True:
            text = "반대"
        if keypoints and kill == False and safe == False:
            text = "손을 정확하게 인식시켜 주세요."

        # 한글 띄우기
        image = Image.fromarray(image)
        draw = ImageDraw.Draw(image)
        font = ImageFont.truetype("fonts/gulim.ttc", 40)
        
        draw.text((50, 50), "죽이겠습니까?", font = font, fill=(255, 255, 255))
        draw.text((50, 100), text, font = font, fill=(255, 255, 255))

        image = np.array(image)

        # 창의 이름과 출력할 이미지
        cv2.imshow('Vote', image)
        
        # 키보드 입력을 처리함
        # ESC를 눌러 나갈 수 있음
        if cv2.waitKey(5) & 0xFF == 27:
            break

# 루프가 종료되면 카메라를 해제
cap.release()

# cv2 창을 제거
cv2.destroyAllWindows()