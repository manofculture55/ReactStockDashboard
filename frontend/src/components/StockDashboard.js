import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components

const StockDashboard = () => {
    const [ticker, setTicker] = useState("INFY");
    const [exchange, setExchange] = useState("NSE");
    const [stockData, setStockData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [buyPrice, setBuyPrice] = useState(""); // State to store the user's entered buying price
    const [holdings, setHoldings] = useState([]); // ✅ State to store holdings

    const fetchStock = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/stock?ticker=${ticker}&exchange=${exchange}`);
            setStockData(response.data);
        } catch (error) {
            console.error("Error fetching stock data", error);
        }
    };

    const fetchHoldings = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/holdings");
            setHoldings(response.data);
        } catch (error) {
            console.error("Error fetching holdings", error);
        }
    };

    const handleBuy = async () => {
        if (!stockData) return;
        
        const qty = parseInt(quantity); // ✅ Convert to integer
        const price = parseFloat(buyPrice); // ✅ Convert to float
    
        if (!price || qty <= 0 || price <= 0) {
            alert("Please enter a valid quantity and buying price.");
            return;
        }
    
        try {
            await axios.post("http://127.0.0.1:5000/api/holdings", {
                Ticker: ticker,
                Quantity: qty,   // ✅ Send as integer
                BuyPrice: price  // ✅ Send as float
            });
            alert("Stock bought successfully!");
            fetchHoldings(); // ✅ Fetch updated holdings
        } catch (error) {
            console.error("Error buying stock", error);
        }
    };

    const handleSell = async () => {
        if (!stockData) return;
        try {
            await axios.put("http://127.0.0.1:5000/api/holdings", {
                Ticker: ticker,
                Quantity: parseInt(quantity), // ✅ Ensure it's a number
            });
            alert("Stock sold successfully!");
            fetchHoldings(); // ✅ Fetch updated holdings
        } catch (error) {
            console.error("Error selling stock", error);
        }
    };

    return (
        <Container>
            <h2 className="my-4 text-center">Stock Dashboard</h2>
            <Row className="mb-4">
                <Col sm={4}>
                    <Form.Control
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        placeholder="Enter Ticker"
                    />
                </Col>
                <Col sm={4}>
                    <Form.Control
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value)}
                        placeholder="Enter Exchange"
                    />
                </Col>
                <Col sm={4}>
                    <Button variant="primary" onClick={fetchStock} className="w-100">
                        Get Stock Info
                    </Button>
                </Col>
            </Row>

            {stockData && (
                <div>
                    <h3>{stockData.company}</h3>
                    <p>Current Price: ₹{stockData.price}</p>

                    <Row>
                        <Col sm={6}>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                placeholder="Quantity"
                            />
                        </Col>
                        <Col sm={6}>
                            <Form.Control
                                type="number"
                                value={buyPrice}
                                onChange={(e) => setBuyPrice(e.target.value)}
                                min="0"
                                placeholder="Buying Price"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col sm={3}>
                            <Button variant="success" onClick={handleBuy} className="w-100">
                                Buy
                            </Button>
                        </Col>
                        <Col sm={3}>
                            <Button variant="danger" onClick={handleSell} className="w-100">
                                Sell
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default StockDashboard;
