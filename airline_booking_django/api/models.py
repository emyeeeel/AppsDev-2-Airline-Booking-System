# api/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields
        )

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()

    def __str__(self):
        return self.email
    
class Country(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)  # ISO country code (e.g., "PH")

# Example with city code
class City(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, blank=True)  # Optional
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

class Airport(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    IATA_code = models.CharField(max_length=3)

class Flight(models.Model):
    flight_number = models.CharField(max_length=10)
    departure_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures')
    arrival_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals')
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    duration = models.DurationField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.PositiveIntegerField(default=180)
    available_seats = models.PositiveIntegerField(default=180)
    airline = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.flight_number} - {self.departure_airport} to {self.arrival_airport}"
    
# Add to existing models
class Passenger(models.Model):
    ADULT = 'AD'
    CHILD = 'CH'
    INFANT = 'IN'
    PASSENGER_TYPES = [
        (ADULT, 'Adult'),
        (CHILD, 'Child'),
        (INFANT, 'Infant'),
    ]
    
    booking = models.ForeignKey('Booking', on_delete=models.CASCADE, related_name='passengers')
    title = models.CharField(max_length=10)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100)
    passenger_type = models.CharField(max_length=2, choices=PASSENGER_TYPES, default=ADULT)
    is_pwd = models.BooleanField(default=False)
    go_rewards_id = models.CharField(max_length=100, blank=True)

def generate_booking_reference():
    return uuid.uuid4().hex[:8].upper()

class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    departing_flight = models.ForeignKey(Flight, on_delete=models.PROTECT, related_name='departing_bookings')
    returning_flight = models.ForeignKey(Flight, on_delete=models.PROTECT, related_name='returning_bookings', null=True, blank=True)
    travel_insurance = models.DecimalField(max_digits=10, decimal_places=2, default=1155.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    booking_reference = models.CharField(
        max_length=8,
        unique=True,
        default=generate_booking_reference  # Use the module-level function
    )

    def save(self, *args, **kwargs):
        # Remove the automatic total_price calculation from save()
        super().save(*args, **kwargs)  # Save first to get an ID

    def calculate_total_price(self):
        # Calculate after passengers exist
        passenger_count = self.passengers.count()
        base_price = self.departing_flight.price * passenger_count
        if self.returning_flight:
            base_price += self.returning_flight.price * passenger_count
        return base_price + self.travel_insurance