import React, {useState , useEffect} from 'react'
import { Button,ListGroup ,Col,Row, Image, Card } from 'react-bootstrap'
import { useSelector ,useDispatch} from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { PayPalButton } from 'react-paypal-button-v2'
import { ORDER_PAY_RESET } from '../constants/orderConstants'

function OrderScreen({ match }) {
    const orderId = match.params.id
    const orderDetails = useSelector(state => state.orderDetails)
    const { order ,error , loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading : loadingPay , success: successPay} = orderPay

    const [sdkReady , setSdkReady] = useState(false)
    const dispatch = useDispatch()
    if(!loading && !error) {

        order.itemsPrice = order.orderItems.reduce(( acc,item)=> acc + item.price * item.qty , 0)
    }
    
    

    const addpayPalScript = () => {

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AQTbDJ7rKxxnEWGB6dQoHhZXFDSz63icuo274RCdwwVuvVeVDT5PdMmGKHHgDgvBHQbFvmAZpkNajTri'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)

    }


    useEffect(()=> {
        if(!order ||successPay ||order._id !== Number(orderId)){
            dispatch({ type : ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid) {
            if(!window.paypal){
                addpayPalScript();
                setSdkReady(true)
            }
        }
    },[dispatch,order,orderId])

    const successPayHandler = (paymentResult) => {
            dispatch(payOrder(orderId,paymentResult))
    }


   
    return  loading ? <Loader/> :
    error ? <Message variant='danger' >{ error}</Message> :(
        <div>
            <h1> Order : {order._id} </h1>
         <Row>
                <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2> Shipping</h2>
                        <p> <b> Name : {order.user.name}</b> </p>
                        <p> <b> Email : <a id='link' href={`mailto:${order.user.email}`} >{order.user.email}</a></b> </p>
                       
                        <p>
                            <b> Shipping to:</b>
                            {'     '}
                            { order.shippingAddress.address} , { order.shippingAddress.city} ,
                            {order.shippingAddress.postalCode} , {order.shippingAddress.country}
                        </p>
                        { order.isDelivered ? (
       <Message variant='success'>Delivered on {order.deliveredAt}</
Message>
   ): (
       <Message variant='warning'>Not Delivered!</Message>
   )
   }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2 className="mt-2"> Payment Method</h2>
                        <p> <b> Method : </b>
                        { order.paymentMethod}</p>

                        { order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ): (
                            <Message variant='warning'>Not Paid!</Message>
                        )

                        }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2> Order Items</h2>
                        { order.orderItems.length === 0 ? (<Message variant='info'> Your Cart is empty</Message>) : 
                        (<ListGroup variant='flush' >
                            { order.orderItems.map((item,index ) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col >
                                        <Link to={`/product/${item.product}`} id='link' > 
                                        {item.name}
                                        </Link>
                                        </Col>
                                        <Col>
                                        {item.qty}X${item.price}=${(item.qty*item.price).toFixed(2)}
                                        </Col>
                                    </Row>


                                </ListGroup.Item>
                            ))}

                        </ListGroup>

                        )}

                    </ListGroup.Item>

                </ListGroup>
                
                </Col>
            
                <Col md={4}>
                <Card>
                       <ListGroup>
                           <ListGroup.Item>
                               <Row>
                                <Col>
                                Item : 
                                </Col>
                                <Col>
                                ${order.itemsPrice}
                                </Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                <Col>
                                Shipping: 
                                </Col>
                                <Col>
                                ${order.shippingPrice}
                                </Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                <Col>
                                Tax : 
                                </Col>
                                <Col>
                                ${order.taxPrice}
                                </Col>
                               </Row>
                           </ListGroup.Item>
                           <ListGroup.Item>
                               <Row>
                                <Col>
                                Total : 
                                </Col>
                                <Col>
                                ${order.totalPrice}
                                </Col>
                               </Row>
                           </ListGroup.Item>
                           { !order.isPaid &&  (
                               <ListGroup.Item>
                                   {loadingPay && <Loader/>}
                                   {!sdkReady ? ( <Loader /> ):
                                  ( <PayPalButton 
                                      amount = {order.totalPrice}
                                      onSuccess= {successPayHandler}         />) }
                               </ListGroup.Item>
                           )}
                           
                           </ListGroup>    
                        
                </Card>
                </Col>
                          
            </Row>
            
        </div>
    )
}

export default OrderScreen
