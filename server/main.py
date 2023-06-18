# Import the os package
import os

# Import the openai package
import openai

from flask import Flask
from flask import request

openai.api_key = "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"

app = Flask(__name__)

@app.route("/ask_gpt", methods=["POST"])
def ask_gpt():
    requestJson = request.get_json()
    response = openai.Completion.create(
    engine = "text-davinci-003",
    prompt = requestJson["question"],
    temperature = 0.9,
    max_tokens = 150
    )
    return print(response.choices[0].text)

@app.route("/test")
def test():
    request.get_json()
    return request.method

if __name__ == '__main__':
    app.run(debug=True)