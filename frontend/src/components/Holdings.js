import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card } from "react-bootstrap"; // Import Bootstrap components

const Holdings = () => {
    const [holdings, setHoldings] = useState([]);

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

    const handleSellAll = async (ticker) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/holdings?ticker=${ticker}`);
            fetchHoldings();
        } catch (error) {
            console.error("Error selling stock", error);
        }
    };

    return (
        <Container>
            <h2 className="my-4 text-center">Holdings</h2>
            {holdings.length > 0 ? (
                holdings.map((stock, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <Row>
                                <Col sm={8}>
                                    <Card.Title>{stock.Company} ({stock.Ticker})</Card.Title>
                                    <Card.Text>Quantity: {stock.Quantity}</Card.Text>
                                    <Card.Text>Buy Price: ₹{stock.Price}</Card.Text>
                                </Col>
                                <Col sm={4}>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleSellAll(stock.Ticker)}
                                        className="w-100"
                                    >
                                        Sell All
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No holdings yet.</p>
            )}
        </Container>
    );
};

export default Holdings;
