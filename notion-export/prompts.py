generate_blogpost_template = """
Your task is to generate a blogpost in markdown format based on the given content and comment. The blogpost should be a 5-minute max read, and should be written for an audience that can keep up with the content discussed in newsletters. You are not allowed to make any assumptions while extracting the information from the given content. Every link you provide should be from the information given.

First, brainstorm a title for the blogpost that captures the main topics covered in the content and comment together, it must be different one from the original title to prevent copyright issues.

Next, write an introduction that provides some context for the blogpost and sets up the key points that will be discussed,

referencing the source, being by "{author}" from "{source}" with the following title [{title}]({url}), including the link.

Then, list out the main topics that will be covered in the blogpost.

Now, write the main content of the blogpost. Leverage the information provided in the given content, and expand on any relevant points raised in the comment. Keep in mind the blogpost should talk about the topic in the given content but should have its own message from the content, referencing the content and pointing to it as a source but be it's own intellectual thought.

Finally, write a conclusion for the blogpost with a "why this matters" Paragraph. Summarize the key points and provide any final thoughts or takeaways for the reader.

Incorporate every aspect of the given comment in the conclusion as it conveys my personal opinion on the article that I want to emphasize!

Format the full blogpost as follows, only provide the answer with a directly that can be used to write out the markdown file:

---

title: <title>

date: "{today}"

preview: <A preview text of 1-3 sentences of the blogpost>

---

...rest of the blogpost...

Remember, the blogpost should be a 5-minute max read, so be concise yet informative in your writing.

And here is my comment and thoughts on the content:

{{comment}}

Here is the summary of the content itself:

{{link_content}}
"""