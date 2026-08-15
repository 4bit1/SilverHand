from fastapi import APIRouter

from app.customer.customer_service import (
    customer_service
)

from app.customer.models import (
    CustomerSearchRequest
)


router = APIRouter(
    prefix="/api/customer",
    tags=["Customer Search"]
)


@router.post("/search")
async def customer_search(
    request: CustomerSearchRequest
):

    result = await customer_service.search(
        query=request.query,
        location=request.location
    )

    return result