from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# File for saving holdings
HOLDINGS_FILE = "holdings.json"

# Load holdings from file
def load_holdings():
    try:
        with open(HOLDINGS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save holdings to file
def save_holdings(holdings):
    with open(HOLDINGS_FILE, "w") as file:
        json.dump(holdings, file, indent=4)

# Fetch current stock price
def fetch_stock_price(ticker, exchange):
    url = f'https://www.google.com/finance/quote/{ticker}:{exchange}'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    title_tag = soup.find('title')
    company_name = title_tag.text.split(' Stock Price')[0] if title_tag else ticker

    price_element = soup.find(class_="YMlKec fxKbKc")

    # ✅ Handle missing price
    if price_element:
        try:
            current_price = float(price_element.text.strip()[1:].replace(",", ""))
        except ValueError:
            current_price = None
    else:
        current_price = None

    return {"company": company_name, "price": current_price}

# API Route to get stock details
@app.route("/api/stock", methods=["GET"])
def get_stock():
    ticker = request.args.get("ticker")
    exchange = request.args.get("exchange", "NSE")

    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    data = fetch_stock_price(ticker, exchange)

    if data["price"] is None:
        return jsonify({"error": "Failed to fetch stock price"}), 500  # ✅ Return error if price not found

    return jsonify(data)

# API Route to manage holdings
@app.route("/api/holdings", methods=["GET", "POST", "PUT", "DELETE"])
def manage_holdings():
    holdings = load_holdings()

    if request.method == "GET":
        return jsonify(holdings)

    elif request.method == "POST":  # Buying a stock
        data = request.json  # ✅ Correct indentation
        ticker = data.get("Ticker")
        quantity = int(data.get("Quantity", 0))
        buy_price = float(data.get("BuyPrice", 0))

        if not ticker or quantity <= 0 or buy_price <= 0:
            return jsonify({"error": "Invalid stock data"}), 400

        # ✅ Check if stock already exists in holdings
        for stock in holdings:
            if stock["Ticker"] == ticker:
                # ✅ Debugging logs
                print(f"Before Buy: {stock}")  # Log before updating

                # ✅ Correct calculation of average buy price
                total_cost = (stock["AverageBuyPrice"] * stock["Quantity"]) + (buy_price * quantity)
                new_quantity = stock["Quantity"] + quantity
                new_average_price = total_cost / new_quantity

                stock["Quantity"] = new_quantity
                stock["AverageBuyPrice"] = round(new_average_price, 2)
                stock["Price"] = round(buy_price, 2)  # ✅ Store latest buy price
                stock["BuyPrice"] = round(buy_price, 2)  # ✅ Update BuyPrice

                print(f"After Buy: {stock}")  # Log after updating
                break
        else:
            # ✅ Store user-entered BuyPrice instead of market price
            new_stock = {
                "Ticker": ticker,
                "Company": ticker,  # Keep same as before
                "Quantity": quantity,
                "Price": round(buy_price, 2),  # ✅ Ensure proper rounding
                "BuyPrice": round(buy_price, 2),
                "AverageBuyPrice": round(buy_price, 2)
            }
            print(f"New Stock Added: {new_stock}")  # Debugging
            holdings.append(new_stock)

        save_holdings(holdings)
        return jsonify({"message": "Stock bought successfully"}), 201

    elif request.method == "PUT":  # Selling a stock
        data = request.json
        ticker = data.get("Ticker")
        quantity = int(data.get("Quantity", 0))

        if not ticker or quantity <= 0:
            return jsonify({"error": "Invalid stock data"}), 400

        for stock in holdings:
            if stock["Ticker"] == ticker:
                if stock["Quantity"] > quantity:
                    stock["Quantity"] -= quantity
                elif stock["Quantity"] == quantity:
                    holdings.remove(stock)
                else:
                    return jsonify({"error": "Not enough stocks to sell"}), 400  # ✅ Prevent selling more than available

                save_holdings(holdings)
                return jsonify({"message": "Stock sold successfully"}), 200

        return jsonify({"error": "Stock not found"}), 404

    return jsonify({"error": "Invalid request"}), 400

# ✅ Correct placement of app.run()
if __name__ == "__main__":
    app.run(debug=True)
