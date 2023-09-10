from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from main.models import PictureModel
from main.serializers import RegisterSerializer, JWTSerializer, DetectSerializer, HistorySerializer, \
    DetectQuerySerializer
from django.contrib.auth.models import User
from main.service import detect, history, LenException


class RegisterView(APIView):
    @swagger_auto_schema(
        operation_summary="Register",
        responses={200: JWTSerializer(), 400: 'user already exist'},
        request_body=RegisterSerializer
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.create(username=serializer.validated_data['username'])
            user.set_password(serializer.validated_data['password'])
            user.save()
        except IntegrityError:
            return JsonResponse({'error': 'user already exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status=status.HTTP_200_OK)


class DetectView(APIView):
    @swagger_auto_schema(
        operation_summary="Detect",
        request_body=DetectSerializer,
        query_serializer=DetectQuerySerializer,
        responses={200: 'image/jpeg'},
    )
    def post(self, request):
        serializer = DetectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query_serializer = DetectQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        res = detect(**query_serializer.validated_data, **serializer.validated_data, user=request.user)
        return HttpResponse(res, content_type='image/jpeg')


class HistoryView(APIView):
    @swagger_auto_schema(
        operation_summary="History",
        request_body=HistorySerializer,
        responses={200: 'image/jpeg'},
    )
    def post(self, request):
        serializer = HistorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return HttpResponse(history(**serializer.validated_data, user=request.user), content_type='image/jpeg')
        except LenException:
            return Response(status=400)
