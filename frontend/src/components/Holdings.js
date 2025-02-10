import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card, Modal, Form } from "react-bootstrap";

const Holdings = () => {
    const [holdings, setHoldings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sellQuantity, setSellQuantity] = useState(1);
    const [sellPrice, setSellPrice] = useState("");
    const [selectedTicker, setSelectedTicker] = useState("");

    useEffect(() => {
        fetchHoldings();
    }, []);

    const fetchHoldings = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/holdings");
            setHoldings(response.data);
        } catch (error) {
            console.error("Error fetching holdings", error);
        }
    };

    const handleSell = async () => {
        const qty = parseInt(sellQuantity);
        const price = parseFloat(sellPrice);

        if (!selectedTicker || qty <= 0 || price <= 0) {
            alert("Please enter a valid quantity and selling price.");
            return;
        }

        try {
            await axios.put("http://127.0.0.1:5000/api/holdings", {
                Ticker: selectedTicker,
                Quantity: qty,
                SellPrice: price
            });

            alert("Stock sold successfully!");
            setShowModal(false);
            fetchHoldings(); // Refresh holdings after selling
        } catch (error) {
            console.error("Error selling stock", error);
        }
    };

    return (
        <Container>
            <h2 className="my-4 text-center">My Holdings</h2>
            <Row>
                {holdings.length > 0 ? (
                    holdings.map((stock, index) => (
                        <Col key={index} md={4} className="mb-3">
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{stock.Company} ({stock.Ticker})</Card.Title>
                                    <Card.Text><strong>Exchange:</strong> NSE</Card.Text>
                                    <Card.Text><strong>Quantity:</strong> {stock.Quantity}</Card.Text>
                                    <Card.Text><strong>Average Buy Price:</strong> ₹{stock.AverageBuyPrice}</Card.Text> {/* ✅ FIXED */}
                                    <Card.Text><strong>Current Price:</strong> ₹{stock.CurrentPrice || "Loading..."}</Card.Text>
                                    <Card.Text><strong>Total Invested:</strong> ₹{stock.TotalInvested}</Card.Text>
                                    <Card.Text style={{ color: stock.Returns >= 0 ? "green" : "red" }}>
                                        <strong>Returns:</strong> {stock.Returns}% (₹{stock.ReturnsValue})
                                    </Card.Text>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            setSelectedTicker(stock.Ticker);
                                            setShowModal(true);
                                        }}
                                        className="w-100"
                                    >
                                        Sell
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No holdings yet.</p>
                )}
            </Row>

            {/* Sell Stock Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sell Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={sellQuantity}
                            onChange={(e) => setSellQuantity(e.target.value)}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Selling Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            min="0"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleSell}>
                        Sell
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Holdings;
