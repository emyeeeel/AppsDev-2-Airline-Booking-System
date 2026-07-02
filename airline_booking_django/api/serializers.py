# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
import re
from .models import Booking, Country, City, Airport, Flight, Passenger

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


class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ['id', 'name', 'IATA_code', 'city'] 

class CitySerializer(serializers.ModelSerializer):
    airports = AirportSerializer(many=True, read_only=True, source='airport_set')
    
    class Meta:
        model = City
        fields = ['id', 'name', 'country', 'code', 'airports']  # Include 'country'

class CountrySerializer(serializers.ModelSerializer):
    # Include all cities in this country
    cities = CitySerializer(many=True, read_only=True, source='city_set')
    
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'cities']

class FlightSerializer(serializers.ModelSerializer):
    departure_airport = AirportSerializer(read_only=True)
    arrival_airport = AirportSerializer(read_only=True)
    departure_airport_id = serializers.PrimaryKeyRelatedField(
        queryset=Airport.objects.all(), 
        source='departure_airport',
        write_only=True
    )
    arrival_airport_id = serializers.PrimaryKeyRelatedField(
        queryset=Airport.objects.all(), 
        source='arrival_airport',
        write_only=True
    )

    class Meta:
        model = Flight
        fields = [
            'id', 'flight_number', 'departure_airport', 'arrival_airport',
            'departure_time', 'arrival_time', 'duration', 'price',
            'total_seats', 'available_seats', 'airline',
            'departure_airport_id', 'arrival_airport_id'
        ]

# Add to existing serializers
class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'
        read_only_fields = ('booking',)

class BookingSerializer(serializers.ModelSerializer):
    passengers = PassengerSerializer(many=True)
    departing_flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(),
        source='departing_flight'
    )
    returning_flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(),
        source='returning_flight',
        required=False,
        allow_null=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_reference', 'user', 'departing_flight_id',
            'returning_flight_id', 'travel_insurance', 'total_price',
            'created_at', 'passengers'
        ]
        read_only_fields = ['user', 'total_price', 'booking_reference']

    def create(self, validated_data):
        request = self.context.get('request')  # Get the request from the serializer context
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to create a booking.")

        passengers_data = validated_data.pop('passengers')

        # Set the user field
        booking = Booking.objects.create(
            **validated_data,
            user=request.user,  # Assign the authenticated user
            total_price=0  # Temporary value
        )

        # Create passengers after booking has an ID
        for passenger_data in passengers_data:
            Passenger.objects.create(booking=booking, **passenger_data)

        # Calculate actual price with passenger count
        passenger_count = booking.passengers.count()
        booking.total_price = booking.calculate_total_price()
        booking.save()

        # Update flight seats after final save
        departing_flight = booking.departing_flight
        departing_flight.available_seats -= passenger_count
        departing_flight.save()

        if booking.returning_flight:
            returning_flight = booking.returning_flight
            returning_flight.available_seats -= passenger_count
            returning_flight.save()

        return booking
