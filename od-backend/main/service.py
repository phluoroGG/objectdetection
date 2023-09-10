from io import BytesIO
import cv2
import numpy as np
import mediapipe as mp
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from mediapipe import ImageFormat
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from transliterate import translit

from main.models import ResultModel, PictureModel


def detect(image, user, score_threshold=0.5, max_results=None, color='ff0000'):
    image.name = translit(image.name.lower(), "ru", reversed=True)
    if user.is_anonymous:
        picture = PictureModel.objects.create(image=image, color=color)
    else:
        picture = PictureModel.objects.create(image=image, color=color, user=user)

    base_options = python.BaseOptions(model_asset_path='efficientdet.tflite')
    options = vision.ObjectDetectorOptions(base_options=base_options,
                                           score_threshold=score_threshold,
                                           max_results=max_results)
    detector = vision.ObjectDetector.create_from_options(options)

    image = mp.Image.create_from_file(str(picture.image))

    res = detector.detect(image)
    results = [ResultModel(picture=picture,
                           origin_x=i.bounding_box.origin_x,
                           origin_y=i.bounding_box.origin_y,
                           width=i.bounding_box.width,
                           height=i.bounding_box.height,
                           category=i.categories[0].category_name,
                           score=i.categories[0].score) for i in res.detections]
    ResultModel.objects.bulk_create(results)

    return visualize(image, picture)


class LenException(BaseException):
    pass


def history(page, user):
    pictures = list(PictureModel.objects.filter(user=user).order_by('time'))
    if len(pictures) <= page:
        raise LenException()
    image = mp.Image.create_from_file(str(pictures[page].image))
    return visualize(image, pictures[page])


def visualize(image, picture) -> np.ndarray:
    image = np.copy(image.numpy_view())
    if image.shape[2] == 4:
        image = np.delete(image, 3, 2)
    color = (int(picture.color[0:2], 16), int(picture.color[2:4], 16), int(picture.color[4:6], 16))
    for res in picture.results.all():
        start_point = res.origin_x, res.origin_y
        end_point = res.origin_x + res.width, res.origin_y + res.height
        cv2.rectangle(image, start_point, end_point, color, 3)

        category_name = res.category
        probability = round(res.score, 2)
        result_text = category_name + ' (' + str(probability) + ')'
        text_location = (10 + res.origin_x,
                         10 + 10 + res.origin_y)
        cv2.putText(image, result_text, text_location, cv2.FONT_HERSHEY_PLAIN,
                    1, color, 1)

    pil_image = Image.fromarray(image, 'RGB')
    bytes_io = BytesIO()
    pil_image.save(bytes_io, format='JPEG')
    file = InMemoryUploadedFile(bytes_io, None, picture.image.name.split('/')[-1], 'image/jpeg',
                                bytes_io.getbuffer().nbytes, None)
    return file