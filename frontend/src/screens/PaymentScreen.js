import React, {useState , useEffect} from 'react'
import { Form,Button ,Col,Row } from 'react-bootstrap'
import { useSelector ,useDispatch} from 'react-redux'
import FormContainer from '../components/FormContainer'
import {savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen({ history }) {

    const cart = useSelector( state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()

    const [paymentMethod , setPaymentMethod ] = useState('')

    if( !shippingAddress.address ){
        history.push('/shipping')
    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
            <div> <h5><CheckoutSteps step1 step2 step3 /></h5>
        <FormContainer>

            <Form onSubmit={submitHandler} >
                <Form.Group>
                    <Form.Label as="legend" >
                        Select Method
                    </Form.Label>
                    <Col>
                           <Col>
                                <Form.Check
                                className='m-2'
                                type='radio'
                                label='paypal'
                                id='paypal'
                                name='paymentMethod'
                                value='paypal'
                                checked 
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                                </Form.Check>
                           </Col>
                           <Col>
                                <Form.Check
                                className='my-2 mx-2'
                                type='radio'
                                label='gpay'
                                id='gpay'
                                value='gpay'
                                name='paymentMethod'
                                 
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                                </Form.Check>
                           </Col>
                           <Col>
                                <Form.Check
                                className='m-2'
                                type='radio'
                                label='phonePay'
                                id='phonePay'
                                value='phonepay'
                                name='paymentMethod'
                                 
                                onChange={(e) => setPaymentMethod(e.target.value)}>

                                </Form.Check>
                           </Col>
                    </Col>


                </Form.Group>

            <Button
            type = 'submit'
            varian='primary'>
                Continue
            </Button>
            </Form>
        </FormContainer></div>
    )
}

export default PaymentScreen
