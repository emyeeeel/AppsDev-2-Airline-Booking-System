from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Flight, Airport
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Create Cebu Pacific mock flight data'

    def handle(self, *args, **kwargs):
        Flight.objects.all().delete()
        self.stdout.write("Deleted existing flights...")
        
        airports = list(Airport.objects.all())
        
        for i in range(5000):
            departure = random.choice(airports)
            arrival = random.choice([a for a in airports if a != departure])
            
            # Generate random departure time components
            days_ahead = random.randint(1, 30)
            departure_hour = random.randint(5, 23)  # 5 AM to 11 PM
            departure_minute = random.choice([0, 15, 30, 45])  # 15-minute increments
            
            # Create base departure datetime
            departure_time = timezone.now() + timedelta(days=days_ahead)
            departure_time = departure_time.replace(
                hour=departure_hour,
                minute=departure_minute,
                second=0,
                microsecond=0
            )
            
            # Generate realistic flight duration (1-6 hours)
            flight_hours = random.randint(1, 6)
            flight_minutes = random.choice([0, 15, 30, 45])
            duration = timedelta(hours=flight_hours, minutes=flight_minutes)
            
            # Calculate arrival time based on departure + duration
            arrival_time = departure_time + duration
            
            Flight.objects.create(
                flight_number=f"5J {random.randint(100, 999)}",
                departure_airport=departure,
                arrival_airport=arrival,
                departure_time=departure_time,
                arrival_time=arrival_time,
                duration=duration,
                price=random.randint(1500, 15000),
                total_seats=180,
                available_seats=180,
                airline='Cebu Pacific'
            )
            
        self.stdout.write(self.style.SUCCESS('Successfully created 5000 randomized Cebu Pacific flights'))