import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Modal } from "react-bootstrap"; // Import Bootstrap components

const StockDashboard = () => {
    const [ticker, setTicker] = useState("INFY");
    const [exchange, setExchange] = useState("NSE");
    const [stockData, setStockData] = useState(null);
    const [showModal, setShowModal] = useState(false); // ✅ State for modal visibility
    const [quantity, setQuantity] = useState(1);
    const [buyPrice, setBuyPrice] = useState(""); // ✅ State to store buying price
    const [holdings, setHoldings] = useState([]); // ✅ State to store holdings

    // Fetch stock details
    const fetchStock = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/stock?ticker=${ticker}&exchange=${exchange}`);
            setStockData(response.data);
        } catch (error) {
            console.error("Error fetching stock data", error);
        }
    };

    // Fetch holdings
    const fetchHoldings = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/holdings");
            setHoldings(response.data);
        } catch (error) {
            console.error("Error fetching holdings", error);
        }
    };

    // Buy stock
    const handleBuy = async () => {
        const qty = parseInt(quantity);
        const price = parseFloat(buyPrice);

        if (!price || qty <= 0 || price <= 0) {
            alert("Please enter a valid quantity and buying price.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:5000/api/holdings", {
                Ticker: ticker,
                Quantity: qty,
                BuyPrice: price
            });
            alert("Stock bought successfully!");
            setShowModal(false); // ✅ Close modal after purchase
            fetchHoldings(); // ✅ Fetch updated holdings
        } catch (error) {
            console.error("Error buying stock", error);
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

                    <Button variant="success" onClick={() => setShowModal(true)} className="mt-3">
                        Buy
                    </Button>
                </div>
            )}

            {/* ✅ Modal for buying stock */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Buy Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Buying Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                            min="0"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleBuy}>
                        Buy
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );


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


};

export default StockDashboard;
