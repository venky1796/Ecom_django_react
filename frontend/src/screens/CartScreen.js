import React,{useEffect} from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {Row , Card,Col ,Button, ListGroup ,Form, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../actions/cartActions'
import Message from '../components/Message'



function CartScreen({ match, history,location}) {

    const productId = match.params.id
    const qty = location.search ?Number( location.search.split('=')[1]): 1
   

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    const {cartItems } = cart



    useEffect(() => {
        if(productId) {
            dispatch(addToCart(productId,qty))
        }
    },[dispatch, productId,qty])

const clickHandler=(id) =>{
   dispatch(removeFromCart(id))
}
const checkOutHandler = () => {
    history.push('/login?redirect=shipping')
}
    return (
       
           <Row>
               <Col md={8}>
                   <h1> 
                       Shopping Cart
                   </h1>
                   {cartItems.length === 0 ? (
                       <Message variant="info">
                           Your cart is empty <Link to='/'>  Go back</Link>
                           </Message>
                   ):(
                       <ListGroup variant='flush' >
                           {cartItems.map( item => (
                               <ListGroup.Item key={item.product}>
                                   <Row>
                                       <Col  md={2}>
                                           <Image src={item.image} alt={item.name} fluid rounded/>
                                       </Col>
                                       <Col md={3}>
                                       <Link id="link" to={`/product/${item.product}`}>
                                       {item.name}
                                       </Link>
                                       </Col>
                                       <Col md={2}>
                                           ${item.price}
                                       </Col>
                                       <Col md={2}>
                                       { item.countInStock >= 0 && (<Form.Control as="select"
                                value={item.qty}
                                onChange = {(e) => dispatch(addToCart(item.product,Number(e.target.value)))} >
                                    {
                                        [...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x+1} value={x+1}>

                                                {x+1}
                                            </option>
                                        ))
                                    }
                                </Form.Control> )}    
                                       
                                       </Col>
                                       <Col>
                                       <Button
                                      variant="light"
                                      type ="button"
                                      onClick={() => clickHandler(item.product)}>
                                        <i className="fas fa-trash" > </i>
                                        </Button>
                                       </Col>
                                      
                                   </Row>
                                 
                               </ListGroup.Item>
                           ))}

                           </ListGroup>
                   )

                   }
               </Col>
               <Col md={4}>
                <Card>
                    <ListGroup vaiant='flush'>
                        <ListGroup.Item>

                        <h3> <strong>
                            subtotal ({ cartItems.reduce((acc, item) => acc+Number(item.qty) , 0 )}) items
                            </strong> </h3>
                           <strong> ${ cartItems.reduce((acc, item) => acc+Number(item.qty)*item.price , 0 ).toFixed(2)}</strong>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <Button
                        type='button'
                        className= 'btn-block'
                        disabled={cartItems.length === 0} 
                        onClick = {checkOutHandler}
                        >
                            Proceed To Checkout

                        </Button>

                        </ListGroup.Item>
                    </ListGroup>
                </Card>
                </Col>

           </Row>
       
    )
}

export default CartScreen
