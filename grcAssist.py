from flask import Flask, jsonify, request
import csv
import requests
import datetime
import urllib.parse

app = Flask(__name__)

def search_news(keyword, api_key, category="technology", language="en"):
    url = f"https://newsdata.io/api/1/news?apikey={api_key}&q={keyword}&language={language}&category={category}"
    response = requests.get(url)
    try:
        data = response.json()
        articles = []
        if data["status"] == "success":
            for article in data["results"]:
                articles.append({
                    "headline": article["title"],
                    "description": article["description"],
                    "url": article["link"],
                })
            # Write articles to spreadsheet
            filename = "grcdata.csv"
            write_to_spreadsheet(articles, filename, keyword)
        return articles
    except (requests.exceptions.RequestException, KeyError):
        return []

def write_to_spreadsheet(articles, filename, keyword):
    today = datetime.date.today().strftime("%Y-%m-%d")
    with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        for article in articles:
            writer.writerow([today, keyword, article["headline"], article["description"], article["url"]])

@app.route('/news', methods=['GET'])
def get_news():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400
    api_key = "YOUR_API_KEY_HERE"  # Replace with your actual API key
    articles = search_news(keyword.strip(), api_key)
    return jsonify(articles)

if __name__ == "__main__":
    app.run(debug=True)