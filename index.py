import cv2
import mediapipe as mp

#opencv에 대한 다양한 감지를 그리는데에 도움이 되는 유틸리티
mp_drawing = mp.solutions.drawing_utils

#모델을 가져옴
mp_hands = mp.solutions.hands 

#웹캠피드를 가져오는 코드

#비디오 캡처 장치를 가져옴
#사용 가능한 웹캠이 하나만 있기 때문에 기본적으로 0으로 설정
#다른 가져올 게 있다면 숫자를 높여서 테스트
#이미지가 비어있거나 하는 오류가 뜬다면 잘못된 캡처넘버일 가능성이 있으니 여러 숫자로 테스트
cap = cv2.VideoCapture(0)

#다음 할 일은 cap이 열려있는 동안 루프를 작성
while cap.isOpened():
    #비디오 캡처 피드를 읽고, 작성된 ret과 frame으로 이를 수행하도록 피드에서 두 값을 추출함
    ret, frame = cap.read()

    #웹캠에서 피드를 읽은 다음 해당 결과를 화면에 렌더링하여 프레임에 원하는 이름을 지정함
    cv2.imshow('Webcam Feed', frame)

    #루프에서 벗어날지 여부
    # 'q'를 눌러서 프레임을 종료할 수 있음
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

#루프가 종료되면 카메라를 해제
cap.release()

#cv2 창을 제거
cv2.destroyAllWindows()