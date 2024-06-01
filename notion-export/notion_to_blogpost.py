"""
This script retrieves pages from a Notion database, extracts the URL and text properties,
scrapes the text content from the URL, and generates a blogpost using the scraped content and
the text property as a comment. The blogpost generation is done using Langchain with the
Claude 3.0 Opus model by Anthropic AI.
"""
import logging
import os
import requests
import html2text

from datetime import date
from bs4 import BeautifulSoup
from langchain_anthropic import ChatAnthropic
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from youtube_transcript_api import YouTubeTranscriptApi

from prompts import generate_blogpost_template

NOTION_TOKEN = os.getenv('NOTION_TOKEN')
DATABASE_ID = os.getenv('NOTION_DATABASE_ID')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

headers = {
    'Authorization': 'Bearer ' + NOTION_TOKEN,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
}


# Create a logger instance
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Create a console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)

# Create a file handler
file_handler = logging.FileHandler('app.log', mode='w')
file_handler.setLevel(logging.DEBUG)
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

# Add the handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Log messages during development
logger.debug('This is a debug message')
logger.info('This is an info message')
logger.warning('This is a warning message')
logger.error('This is an error message')
logger.critical('This is a critical message')


def get_pages(filter=None):
    """
    Get notion pages based on data query filter
    :param filter:
    :return:
    """
    url = f'https://api.notion.com/v1/databases/{DATABASE_ID}/query'

    response = requests.post(url, json=filter, headers=headers)

    data = response.json()

    results = data['results']

    return results


def update_notion_page(page):
    url = f"https://api.notion.com/v1/pages/{page['id']}"
    response = requests.patch(url, headers=headers, json=page)

    if response.status_code == 200:
        logger.info("Page updated successfully!")
    else:
        logger.error(f"Error updating page: {response.text}")


def extract_transcript_from_youtube(video_url):
    # Extract the video ID from the URL
    video_id = video_url.split("v=")[1]

    try:
        # Fetch the available transcripts for the video
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Get the transcript in the desired language (e.g., English)
        transcript = transcript_list.find_transcript(['en'])

        # Fetch the actual transcript data
        transcript_data = transcript.fetch()

        # Extract the text from the transcript data
        text = ' '.join([data['text'] for data in transcript_data])

        return text
    except Exception as e:
        raise Exception(f"Failed to retrieve the transcript. Error: {str(e)}")


def extract_text_from_html(s3_url):
    response = requests.get(s3_url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        excluded_tagNames = ['footer', 'nav']
        # Exclude elements with class names 'footer' and 'navbar'
        excluded_tags = excluded_tagNames or []  # Default to an empty list if not provided
        for tag_name in excluded_tags:
            for unwanted_tag in soup.find_all(tag_name):
                unwanted_tag.extract()

        # Convert HTML to plain text using html2text
        text_content = html2text.html2text(str(soup))
        return text_content
    else:
        raise Exception(f"Failed to retrieve the file. Status code: {response.status_code}")


def scrape_text_from_url(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    return ' '.join(soup.get_text().split())


def generate_blogpost(content, comment, author, title, source, url):
    # llm = OpenAI(temperature=0, model_name="gpt-4o")
    llm = ChatAnthropic(temperature=0, model_name="claude-3-opus-20240229")
    today = date.today().strftime("%Y-%m-%d")

    formatted_template = generate_blogpost_template.format(
        today=today,
        author=author,
        source=source,
        title=title,
        url=url
    )

    prompt = PromptTemplate(
        input_variables=[content, comment],
        template=formatted_template,
    )

    chain = prompt | llm

    return chain.invoke({"link_content": content, "comment": comment}).content


def convert_markdown_to_blocks(markdown_content):
    # Split the Markdown content into lines
    lines = markdown_content.split("\n")

    blocks = []
    for line in lines:
        # Check if the line starts with a heading (#)
        if line.startswith("#"):
            # Count the number of # to determine the heading level
            heading_level = line.count("#")
            # Remove the # and trim the heading text
            heading_text = line[heading_level:].strip()

            blocks.append({
                "object": "block",
                "type": f"heading_{heading_level}",
                f"heading_{heading_level}": {
                    "rich_text": [{
                        "type": "text",
                        "text": {
                            "content": heading_text
                        }
                    }]
                }
            })
        else:
            # Add the line as a paragraph block
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{
                        "type": "text",
                        "text": {
                            "content": line
                        }
                    }]
                }
            })

    return blocks


if __name__ == '__main__':

    data = None

    results_pages = get_pages(filter=data)

    link_content = None
    for page in results_pages:
        logger.info("Fetching content...")
        logger.debug(f"Fetched page: {page}")
        files = page['properties'].get('Dateien und Medien')
        if page['properties']['Name']['title'][0]['text']['content'] != 'Spannende Folge zu outcomes der Thüringer Kommunalwahl':
            continue
        if page['properties'].get('Content Summary'):
            link_content = page['properties'].get('Content Summary')['rich_text'][0]['text']['content']
        elif len(files['files']) > 0:
            filename = files['files'][0].get("name")
            if ".html" in filename:
                link_content = extract_text_from_html(files['files'][0]['file']['url'])
            elif ".pdf" in filename:
                raise NotImplementedError("pdf parser not implemented yet, please be patient")
            elif ".png" in filename or ".jpg" in filename:
                logging.log(level=20, msg="images present but not used")
        else:
            url = page['properties'].get('URL')['url']
            if "youtube" in url:
                extract_transcript_from_youtube(url)
            else:
                raise NotImplementedError("Generic Parser not implemented yet!")

        try:
            text_comment = page['properties']['Text']['rich_text'][0]['plain_text']
            title = page['properties']['Name']['title'][0]['text']['content']
            source = page['properties']['Source']['multi_select'][0]['name']
            author = page['properties']['Autor']["rich_text"][0]['text']['content']
            url = page['properties']['URL']["url"]
        except Exception as ex:
            raise Exception(f"One of the following fields isn't present: text_comment={text_comment}, title={title}, source={source}, author={author}")

        if text_comment:
            if link_content:
                blogpost = generate_blogpost(link_content, text_comment, author, title, source, url)
                print(blogpost)

                # # Update page
                # blocks = convert_markdown_to_blocks(blogpost)
                # if page.get('children'):
                #     page['children'].extend(blocks)
                # else:
                #     page['children'] = blocks
                #
                # update_notion_page(page)

