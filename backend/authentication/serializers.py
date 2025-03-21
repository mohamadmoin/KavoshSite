from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="A user with this email already exists."
        )]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'username': {
                'validators': [UniqueValidator(
                    queryset=User.objects.all(),
                    message="A user with this username already exists."
                )]
            }
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            logger.warning(f"Password validation failed: {e.messages}")
            raise serializers.ValidationError(e.messages)
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password2": "The two password fields didn't match."
            })
            
        # Log validation attempt
        logger.info(f"Validating registration data for username: {attrs.get('username')}")
        return attrs

    def create(self, validated_data):
        try:
            # Remove password2 from the data as it's not needed for user creation
            validated_data.pop('password2', None)
            
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
            user.set_password(validated_data['password'])
            user.save()
            
            logger.info(f"Successfully created user: {user.username}")
            return user
            
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise serializers.ValidationError({
                "detail": "Unable to create user. Please try again."
            }) 