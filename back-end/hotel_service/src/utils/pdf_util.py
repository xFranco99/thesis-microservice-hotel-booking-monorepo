from io import BytesIO
from datetime import datetime
from decimal import Decimal
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from schemas.hotel_schema import BookingRoomOut


def generate_booking_pdf(booking: BookingRoomOut) -> BytesIO:

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)

    # Draw the Booking ID
    p.drawString(100, 750, f"Booking ID: {booking.booking_id}")

    # Draw the Hotel Information
    hotel = booking.room.hotel
    if hotel:
        p.drawString(100, 730, f"Hotel Name: {hotel.hotel_name}")
        p.drawString(100, 710, f"Hotel Address: {hotel.hotel_address}")

    # Draw the Room Information
    room = booking.room
    if room:
        p.drawString(100, 690, f"Room Number: {room.room_number}")
        p.drawString(100, 670, f"Room Type: {room.room_type}")

    # Booking Information
    p.drawString(100, 650,
                 f"Check-in Date: {booking.booked_from.strftime('%Y-%m-%d') if booking.booked_from else 'N/A'}")
    p.drawString(100, 630, f"Check-out Date: {booking.booked_to.strftime('%Y-%m-%d') if booking.booked_to else 'N/A'}")
    p.drawString(100, 610, f"Number of Adults: {booking.adult_no}")
    p.drawString(100, 590, f"Number of Children: {booking.children_no}")
    p.drawString(100, 570, f"Credit Card No: {'*****' if booking.credit_card_no else 'N/A'}")

    # Payment Information
    p.drawString(100, 550, f"Payment Amount: ${booking.payment_amount if booking.payment_amount else 0.00:.2f}")

    # Add a footer
    p.drawString(100, 50, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Save the PDF
    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer