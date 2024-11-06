from datetime import datetime

def convert_datetime_to_timestamp(obj):
    # Recursively convert datetime objects to timestamps in a dictionary.
    if isinstance(obj, dict):
        return {key: convert_datetime_to_timestamp(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_datetime_to_timestamp(element) for element in obj]
    elif isinstance(obj, datetime):
        return obj.timestamp()
    return obj