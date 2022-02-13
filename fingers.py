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
with mp_hands.Hands(min_detection_confidence=0.5,min_tracking_confidence=0.5, max_num_hands=2) as hands:

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
        
        right_hand_keypoints = []
        left_hand_keypoints = []
        right_fingers_status = {'RIGHT_THUMB': False, 'RIGHT_INDEX_FINGER': False, 'RIGHT_MIDDLE_FINGER': False, 'RIGHT_RING_FINGER': False, 'RIGHT_PINKY': False}
        left_fingers_status = {'LEFT_THUMB': False, 'LEFT_INDEX_FINGER': False, 'LEFT_MIDDLE_FINGER': False, 'LEFT_RING_FINGER': False, 'LEFT_PINKY': False}
        # 화면에 손 랜드마크가 찍히면
        if results.multi_hand_landmarks:
            n = 0
            for hand_landmarks in results.multi_hand_landmarks:
                if results.multi_handedness:

                    #오른손
                    if results.multi_handedness[n].classification[0].label == 'Right':
                        for data_point in hand_landmarks.landmark:
                            right_hand_keypoints.append({
                                                'X': data_point.x,
                                                'Y': data_point.y,
                                                })
                        #엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 바닥면)
                        if right_hand_keypoints[4]['X'] < right_hand_keypoints[17]['X']:
                            # 엄지 4번(x)가 엄지 3번 (x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                            if right_hand_keypoints[4]["X"] < right_hand_keypoints[3]["X"] and right_hand_keypoints[4]["Y"] > right_hand_keypoints[6]["Y"]:
                                right_fingers_status["RIGHT_THUMB"] = True
                        # 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 등면)
                        elif right_hand_keypoints[17]['X'] < right_hand_keypoints[4]['X']:
                            #엄지 4번(x)가 엄지 2번(x)보다 오른쪽에 있고 엄지 4번 (y)가 검지 6번(y)보다 위에 있을 경우
                            if right_hand_keypoints[4]["X"] > right_hand_keypoints[2]["X"] and right_hand_keypoints[4]["Y"] > right_hand_keypoints[6]["Y"]:
                                right_fingers_status["RIGHT_THUMB"] = True
                        
                        # 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
                        if right_hand_keypoints[8]['Y'] < right_hand_keypoints[6]['Y']:
                            right_fingers_status["RIGHT_INDEX_FINGER"] = True
                        if right_hand_keypoints[12]['Y'] < right_hand_keypoints[10]['Y']:
                            right_fingers_status["RIGHT_MIDDLE_FINGER"] = True
                        if right_hand_keypoints[16]['Y'] < right_hand_keypoints[14]['Y']:
                            right_fingers_status["RIGHT_RING_FINGER"] = True
                        if right_hand_keypoints[20]['Y'] < right_hand_keypoints[18]['Y']:
                            right_fingers_status["RIGHT_PINKY"] = True

                    #왼손
                    if results.multi_handedness[n].classification[0].label == 'Left':
                        for data_point in hand_landmarks.landmark:
                            left_hand_keypoints.append({
                                                'X': data_point.x,
                                                'Y': data_point.y,
                                                })
                        #엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 바닥면)
                        if left_hand_keypoints[17]['X'] < left_hand_keypoints[4]['X']:
                            # 엄지 4번(x)가 엄지 3번 (x)보다 오른쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                            if left_hand_keypoints[4]["X"] > left_hand_keypoints[3]["X"] and left_hand_keypoints[4]["Y"] > left_hand_keypoints[6]["Y"]:
                                left_fingers_status["LEFT_THUMB"] = True
                        # 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 등면)
                        elif left_hand_keypoints[17]['X'] > left_hand_keypoints[4]['X']:
                            #엄지 4번(x)가 엄지 2번(x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                            if left_hand_keypoints[4]["X"] < left_hand_keypoints[2]["X"] and left_hand_keypoints[4]["Y"] > left_hand_keypoints[6]["Y"]:
                                left_fingers_status["LEFT_THUMB"] = True

                        # 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
                        if left_hand_keypoints[8]['Y'] < left_hand_keypoints[6]['Y']:
                            left_fingers_status["LEFT_INDEX_FINGER"] = True
                        if left_hand_keypoints[12]['Y'] < left_hand_keypoints[10]['Y']:
                            left_fingers_status["LEFT_MIDDLE_FINGER"] = True
                        if left_hand_keypoints[16]['Y'] < left_hand_keypoints[14]['Y']:
                            left_fingers_status["LEFT_RING_FINGER"] = True
                        if left_hand_keypoints[20]['Y'] < left_hand_keypoints[18]['Y']:
                            left_fingers_status["LEFT_PINKY"] = True
                    n += 1

                #화면에 손 관절 그리기
                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
        
        # 한글 띄우기
        image = Image.fromarray(image)
        draw = ImageDraw.Draw(image)
        font = ImageFont.truetype("fonts/gulim.ttc", 40)

        hand = right_hand_keypoints or left_hand_keypoints

        draw.text((50, 50), text="몇 번을 지목하겠습니까?", font = font, fill=(255, 255, 255))

        if hand:
            if hand[0]['Y'] < hand[1]['Y'] or hand[17]['Y'] > hand[2]['Y']:
                draw.text((50, 100), text="손을 정확하게 인식시켜주세요.", font = font, fill=(255, 255, 255))

            else:
                right_fingers_count = 0
                left_fingers_count = 0

                for fingers in right_fingers_status.values():
                    if fingers == True:
                        right_fingers_count += 1 

                for fingers in left_fingers_status.values():
                    if fingers == True:
                        left_fingers_count += 1 

                total_fingers = right_fingers_count + left_fingers_count
                if total_fingers == 0:
                    draw.text((50, 100), "0번은 없습니다.", font = font, fill=(255, 255, 255))
                else:
                    draw.text((50, 100), str(total_fingers) + "번", font = font, fill=(255, 255, 255))
            
        image = np.array(image)

        # 창의 이름과 출력할 이미지
        cv2.imshow('Fingers Count', image)
        
        # 키보드 입력을 처리함
        # ESC를 눌러 나갈 수 있음
        if cv2.waitKey(5) & 0xFF == 27:
            break

# 루프가 종료되면 카메라를 해제
cap.release()

# cv2 창을 제거
cv2.destroyAllWindows()