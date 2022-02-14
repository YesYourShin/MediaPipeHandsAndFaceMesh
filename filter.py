import cv2
import mediapipe as mp
from math import hypot

cap = cv2.VideoCapture(0)

nose_img = cv2.imread('mediapipe/pig_nose.jpeg') # (860, 563) w,h ratio=563/860=0.65

nose_landmarks = [49,279,197,2,5] # 5 = center nose point

# total 468 landmarks
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

drawSpec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

with mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as face_mesh:
    while cap.isOpened():

        ret, image = cap.read()

        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        
        image.flags.writeable = False
        results = face_mesh.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # 랜드마크 그리기
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                    .get_default_face_mesh_tesselation_style())
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_CONTOURS,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                    .get_default_face_mesh_contours_style())
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_IRISES,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                    .get_default_face_mesh_iris_connections_style())

                # nose landmarks
                leftnosex = 0
                lefttnosey = 0
                rightnosex = 0
                rightnosey = 0
                centernosex = 0
                centernosey = 0
                
                # get each landmark info
                for lm_id, lm in enumerate(face_landmarks.landmark):
                    
                    # getting original value
                    h, w, c = image.shape
                    x, y = int(lm.x * w), int(lm.y * h)
                    
                    # calculating nose width
                    if lm_id == nose_landmarks[0]:
                        leftnosex, lefttnosey = x, y
                    if lm_id == nose_landmarks[1]:
                        rightnosex, rightnosey = x, y
                    if lm_id == nose_landmarks[4]:
                        centernosex, centernosey = x, y

                    # display only nose landmarks
                    # if lm_id in nose_landmarks:
                    #     cv2.putText(
                    #         frame,
                    #         str(lm_id),
                    #         (x, y), 
                    #         cv2.FONT_HERSHEY_SIMPLEX, 
                    #         0.3, 
                    #         (0,0,255),
                    #         1
                    #     )
                    
                nose_width = int(hypot(leftnosex-rightnosex, lefttnosey-rightnosey*1.2))
                nose_height = int(nose_width*0.77)

                if (nose_width and nose_height) != 0:
                    pig_nose = cv2.resize(nose_img, (nose_width, nose_height))

                top_left = (int(centernosex-nose_width/2),int(centernosey-nose_height/2))
                bottom_right = (int(centernosex+nose_width/2),int(centernosey+nose_height/2))

                nose_area = image[
                    top_left[1]: top_left[1]+nose_height,
                    top_left[0]: top_left[0]+nose_width
                ]

                # creating nose mask
                pig_nose_gray = cv2.cvtColor(pig_nose, cv2.COLOR_BGR2GRAY)
                _, nose_mask = cv2.threshold(pig_nose_gray, 25, 255, cv2.THRESH_BINARY_INV)
                # removing nose
                no_nose = cv2.bitwise_and(nose_area, nose_area, mask=nose_mask)
                # superimposing nose on no_nose
                final_nose = cv2.add(no_nose, pig_nose)
                # finally putting pig nose filter on original nose
                image[
                    top_left[1]: top_left[1]+nose_height,
                    top_left[0]: top_left[0]+nose_width
                ] = final_nose


        cv2.imshow("filter", image)
        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()