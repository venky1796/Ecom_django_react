import React from 'react'
import { Container ,Row ,Col } from 'react-bootstrap'

function Footer() {
    return (
        <footer>
            <Container >
            <Row>
                <Col className="text-center">
                    Copyright &copy; 2020
                </Col>
            </Row>
            
            </Container>
        </footer>
    )
}

export default Footer
