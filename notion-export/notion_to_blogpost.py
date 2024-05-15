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
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain.chains import LLMChain
from youtube_transcript_api import YouTubeTranscriptApi

NOTION_TOKEN = os.getenv('NOTION_TOKEN')
DATABASE_ID = os.getenv('NOTION_DATABASE_ID')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

headers = {
    'Authorization': 'Bearer ' + NOTION_TOKEN,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
}


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
    llm = ChatAnthropic(temperature=0, model_name="claude-3-opus-20240229")
    today = date.today().strftime("%Y-%m-%d")
    template = f"""
    Your task is to generate a blogpost in markdown format based on the given content and comment. The blogpost should be a 5-minute max read, and should be written for an audience that can keep up with the content discussed in newsletters. You are not allowed to make any assumptions while extracting the information from the given content. Every link you provide should be from the information given. 

    First, brainstorm a title for the blogpost that captures the main topics covered in the link content and comment together, using a different one from the original content.
    
    Next, write an introduction that provides some context for the blogpost and sets up the key points that will be discussed, 
    referencing the source, being by "{author}" from "{source}" with the following title [{title}]({url}), including the link.
    
    Then, list out the main topics that will be covered in the blogpost, with each topic on a new line preceded by a "-".
    
    Now, write the main content of the blogpost. Leverage the information provided in the link content, and expand on any relevant points raised in the comment. Keep in mind the target audience's level of understanding as you explain the concepts.
    
    Finally, write a conclusion for the blogpost. Summarize the key points and provide any final thoughts or takeaways for the reader.
    Incorporate every aspect of the given comment in the conclusion as it conveys my personal opinion on the article that I want to emphasize!
    
    Format the full blogpost as follows, only provide the answer with a direct string that can be used to write out the markdown file:
    
    ---
    title: <title>
    date: "{today}"
    ---
    
    ...rest of the blogpost...
    
    
    
    Remember, the blogpost should be a 5-minute max read, so be concise yet informative in your writing.
    
    And here is my comment and thoughts on the content:
    {{comment}}
    
    Here is the content itself:
    {{link_content}}
    """

    prompt = PromptTemplate(
        input_variables=[content, comment],
        template=template,
    )

    chain = prompt | llm

    return chain.invoke({"link_content": content, "comment": comment}).content


# data = {
#     "filter": {
#         "or": [
#             {
#                 "property": "Source",
#                 "contains": "Turing Post"
#             }
#         ]
#     }
# }
data = None

results_pages = get_pages(filter=data)

link_content = None
for page in results_pages:
    logging.log(level=20, msg="Fetching content...")
    files = page['properties'].get('Dateien und Medien')
    if len(files['files']) > 0:
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

