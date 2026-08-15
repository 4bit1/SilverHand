from app.customer.search_engine import CustomerSearchEngine


class CustomerService:

    def __init__(self):

        self.engine = CustomerSearchEngine()

    async def search(
        self,
        query: str,
        location: str | None = None
    ):

        if not query.strip():

            return {
                "success": False,
                "error": "Search query cannot be empty"
            }

        result = await self.engine.search(
            query=query,
            location=location,
            limit=5
        )

        return {
            "success": True,
            "query": query,
            "detected_service": result["service"],
            "required_skills": result[
                "required_skills"
            ],
            "results": result["results"]
        }


customer_service = CustomerService()