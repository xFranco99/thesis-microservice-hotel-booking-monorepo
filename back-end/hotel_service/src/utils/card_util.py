def mask_card_pan(card_pan: str) -> str:
    card_pan = card_pan.replace(" ", "")

    if len(card_pan) < 4:
        return card_pan

    masked_pan = '*' * (len(card_pan) - 4) + card_pan[-4:]

    return masked_pan