from datetime import datetime

def calculate_days_difference(date1: datetime, date2: datetime) -> int:
    delta = abs(date2 - date1)
    return delta.days
