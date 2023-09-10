from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class JWTSerializer(serializers.Serializer):
    jwt = serializers.CharField(max_length=255, read_only=True)


class DetectSerializer(serializers.Serializer):
    image = serializers.ImageField()


class DetectQuerySerializer(serializers.Serializer):
    score_threshold = serializers.DecimalField(required=False, max_digits=5, decimal_places=4, max_value=1, min_value=0.0001)
    max_results = serializers.IntegerField(required=False, min_value=0)
    color = serializers.CharField(required=False, max_length=6, min_length=6)


class HistorySerializer(serializers.Serializer):
    page = serializers.IntegerField()

