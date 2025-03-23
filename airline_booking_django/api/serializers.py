# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
import re

User = get_user_model()

def validate_password_complexity(password, user):
    if len(password) < 8:
        raise ValidationError(_("Password must be at least 8 characters long."))
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError(_("Password must contain at least one uppercase letter."))
    if not re.search(r'[a-z]', password):
        raise ValidationError(_("Password must contain at least one lowercase letter."))
    if not re.search(r'[0-9]', password):
        raise ValidationError(_("Password must contain at least one number."))
    if not re.search(r'[^A-Za-z0-9]', password):
        raise ValidationError(_("Password must contain at least one symbol."))
    
    email_prefix = user.email.split('@')[0].lower()
    first_name_lower = user.first_name.lower()
    last_name_lower = user.last_name.lower()
    password_lower = password.lower()
    
    if email_prefix in password_lower:
        raise ValidationError(_("Password cannot contain parts of your email address."))
    if first_name_lower and first_name_lower in password_lower:
        raise ValidationError(_("Password cannot contain your first name."))
    if last_name_lower and last_name_lower in password_lower:
        raise ValidationError(_("Password cannot contain your last name."))

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        
        validate_password(password)
        validate_password_complexity(password, user)
        
        return data

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')