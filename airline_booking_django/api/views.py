# api/views.py
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import (
    BookingSerializer,
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    CountrySerializer, 
    CitySerializer, 
    AirportSerializer
)
from django.contrib.auth import get_user_model


from rest_framework import viewsets
from .models import Booking, Country, City, Airport

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "email": user.email
        }, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.prefetch_related('city_set__airport_set').all()
    serializer_class = CountrySerializer

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.prefetch_related('airport_set').all()
    serializer_class = CitySerializer

class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer

from .models import Flight
from .serializers import FlightSerializer

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.select_related(
        'departure_airport__city__country', 
        'arrival_airport__city__country'
    ).all()
    serializer_class = FlightSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # Pass the request to the serializer context
        return context