from fastapi import APIRouter
from services.currency_convertor import convert_currency

router = APIRouter()

@router.get("/convert")
def convert(from_currency: str, to_currency: str, amount: float):

    result = convert_currency(from_currency, to_currency, amount)

    return {
        "from": from_currency,
        "to": to_currency,
        "amount": amount,
        "converted_amount": result
    }