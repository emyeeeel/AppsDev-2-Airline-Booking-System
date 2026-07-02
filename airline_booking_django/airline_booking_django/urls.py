"""
URL configuration for airline_booking_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  # Add include
from rest_framework.routers import DefaultRouter
from api.views import (
    BookingViewSet,
    UserRegistrationView, 
    UserLoginView, 
    UserListView,
    CountryViewSet,   # Import ViewSets
    CityViewSet,
    AirportViewSet,
    FlightViewSet  
)

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'countries', CountryViewSet)
router.register(r'cities', CityViewSet)
router.register(r'airports', AirportViewSet)
router.register(r'flights', FlightViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')  # Add basename

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('api/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/login/', UserLoginView.as_view(), name='user-login'),
    path('api/getAllUsers/', UserListView.as_view(), name='get-all-users'),
    
    # Include router URLs under 'api/' (countries, cities, airports)
    path('api/', include(router.urls)),  
]