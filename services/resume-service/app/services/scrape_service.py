import httpx
from app.core.config import settings

async def scrape_job_posting(url: str) -> str:
    """
    Scrape a job posting URL using Firecrawl v2 API.
    Returns the main content as clean Markdown text.
    """
    api_url = "https://api.firecrawl.dev/v2/scrape"
    headers = {
        "Authorization": f"Bearer {settings.FIRE_CRAWL_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "url": url,
        "scrapeOptions": {
            "onlyMainContent": True,
            "formats": ["markdown"]
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

    # Firecrawl v2 returns: { "data": { "markdown": "..." } }
    markdown_content = data.get("data", {}).get("markdown", "").strip()
    return markdown_content