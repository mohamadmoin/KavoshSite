import os
import asyncio
from pathlib import Path
from typing import Optional, List
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig

SCIHUB_MIRRORS = [
    "https://sci-hub.wf",  # Try this mirror first
    "https://sci-hub.ru",
    "https://sci-hub.se",
    "https://sci-hub.st"
]

async def download_paper(doi: str, download_path: Optional[str] = None) -> List[str]:
    """
    Download a paper from Sci-Hub using its DOI.
    
    Args:
        doi (str): The DOI of the paper to download
        download_path (Optional[str]): Path where to save the downloaded file. 
                                     If None, uses default .crawl4ai/downloads directory
    
    Returns:
        List[str]: List of paths to downloaded files
    """
    # Setup download path
    if download_path is None:
        download_path = os.path.join(Path.home(), ".crawl4ai", "downloads")
    os.makedirs(download_path, exist_ok=True)
    print(f"Download path: {download_path}")
    
    # Configure browser for downloads
    browser_config = BrowserConfig(
        accept_downloads=True,
        downloads_path=download_path,
        headless=False  # Set to False to see what's happening
    )
    
    # Try each mirror until successful
    for mirror in SCIHUB_MIRRORS:
        paper_url = f"{mirror}/{doi}"
        print(f"\nTrying mirror: {paper_url}")
        
        # Configure crawler to wait for and click download button
        crawler_config = CrawlerRunConfig(
            js_code="""
                function waitForElement(selector, timeout = 5000) {
                    return new Promise((resolve) => {
                        if (document.querySelector(selector)) {
                            return resolve(document.querySelector(selector));
                        }
                        
                        const observer = new MutationObserver(() => {
                            if (document.querySelector(selector)) {
                                resolve(document.querySelector(selector));
                                observer.disconnect();
                            }
                        });
                        
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                        
                        setTimeout(() => {
                            observer.disconnect();
                            resolve(null);
                        }, timeout);
                    });
                }
                
                async function findAndDownloadPDF() {
                    // Log page title and URL for debugging
                    console.log('Page title:', document.title);
                    console.log('Page URL:', window.location.href);
                    
                    // First try: look for the save button
                    const saveButton = document.querySelector('a[href^="save"]');
                    if (saveButton) {
                        console.log('Found save button:', saveButton.href);
                        return saveButton.href;
                    }
                    
                    // Second try: look for the PDF iframe
                    const pdfFrame = document.querySelector('#pdf');
                    if (pdfFrame && pdfFrame.src) {
                        console.log('Found PDF in iframe:', pdfFrame.src);
                        return pdfFrame.src;
                    }
                    
                    // Third try: look for direct PDF links
                    const pdfLinks = Array.from(document.querySelectorAll('a')).filter(a => 
                        a.href.toLowerCase().includes('.pdf') ||
                        a.href.toLowerCase().includes('/pdf/') ||
                        a.href.toLowerCase().includes('download') ||
                        a.textContent.toLowerCase().includes('pdf') ||
                        a.textContent.toLowerCase().includes('download')
                    );
                    
                    if (pdfLinks.length > 0) {
                        console.log('Found PDF-related links:', pdfLinks.length);
                        pdfLinks.forEach(link => {
                            console.log('- Link:', link.href, '(Text:', link.textContent, ')');
                        });
                        return pdfLinks[0].href;
                    }
                    
                    // Fourth try: look for embedded PDF viewers
                    const objects = document.querySelectorAll('object, embed');
                    for (const obj of objects) {
                        if (obj.data) {
                            console.log('Found object/embed:', obj.data);
                            return obj.data;
                        }
                    }
                    
                    // Fifth try: look for meta tags with PDF info
                    const metaTags = document.querySelectorAll('meta');
                    for (const meta of metaTags) {
                        const content = meta.getAttribute('content');
                        if (content && content.toLowerCase().includes('.pdf')) {
                            console.log('Found PDF in meta tag:', content);
                            return content;
                        }
                    }
                    
                    console.log('No PDF source found');
                    return null;
                }
                
                (async () => {
                    const pdfSource = await findAndDownloadPDF();
                    if (pdfSource && pdfSource !== 'clicked') {
                        console.log('Initiating download from:', pdfSource);
                        const link = document.createElement('a');
                        link.href = pdfSource;
                        link.download = '';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                })();
            """,
            wait_for="30s",  # Wait up to 30 seconds for the download to start
            page_timeout=60000  # 60 seconds timeout
        )
        
        try:
            async with AsyncWebCrawler(config=browser_config) as crawler:
                print("Starting crawler...")
                result = await crawler.arun(url=paper_url, config=crawler_config)
                
                if result.downloaded_files:
                    print(f"Successfully downloaded paper with DOI: {doi}")
                    return result.downloaded_files
                else:
                    print(f"No files were downloaded from {mirror}")
                    print("Page content:")
                    print(result.markdown[:500] + "..." if result.markdown else "No content")
                    
        except Exception as e:
            print(f"Error accessing {mirror}: {str(e)}")
            if "timeout" in str(e).lower():
                print("The request timed out. Trying next mirror...")
            continue
    
    print("\nFailed to download from all mirrors")
    return []

async def main():
    """
    Example usage of the download_paper function
    """
    doi = "10.1016/0039-6257(93)90141-s"  # Example DOI
    downloaded_files = await download_paper(doi)
    
    if downloaded_files:
        print("\nDownloaded files:")
        for file_path in downloaded_files:
            print(f"- {file_path}")
            file_size = os.path.getsize(file_path)
            print(f"  Size: {file_size / 1024:.2f} KB")

if __name__ == "__main__":
    asyncio.run(main()) 