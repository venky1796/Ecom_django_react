import React , { useEffect , useState} from 'react'
import { Row ,Col , Image , Button ,Card ,ListGroup, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch , useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import { ListProductDetails,createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET} from '../constants/productConstants'


function ProductScreen({ match ,history }) {

    const [qty , setQty ] = useState(1)
    const [rating , setRating ] = useState(0)
    const [comment , setComment ] = useState('')
    const dispatch = useDispatch()

    const productDetails = useSelector( state => state.productDetails)
    const {loading , error , product } = productDetails
    
    const productReviewCreate = useSelector( state => state.productReviewCreate)
    const {loading:loadingReview , error:errorReview , success:successReview } = productReviewCreate
    
    const userLogin = useSelector( state => state.userLogin)
    const {userInfo} = userLogin


    useEffect(() => {
        if(successReview){
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(ListProductDetails(match.params.id))
       
   },[dispatch,match,successReview,userInfo])

   const submitHandler = () => {
      history.push(`/cart/${match.params.id}?qty=${qty}`)
   }

   const reviewHandler = (e) => {
      e.preventDefault()
      dispatch(createProductReview(
          match.params.id,{
              rating,
              comment
          }
      ))
   }
  
    return (
        <div>
            <Link to='/' className='btn btn-dark my-3' > Go Back
            </Link> 
            { loading ? <Loader/>
              : error ? <Message variant="danger">{error}</Message>

            :
            <div>
            <Row>
                    <Col  md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>

                    <Col md={3} >
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3> {product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                               <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />


                            </ListGroup.Item>
                            <ListGroup.Item>
                               Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                               Description: ${product.description}{product.price}
                            </ListGroup.Item>
                            
                        </ListGroup>
                        </Col>

                        <Col md={3} >
                            <ListGroup  >

                        <ListGroup.Item>
                          <Row>
                              <Col>
                              Price :
                              </Col>
                              <Col>
                              <strong>
                                  ${product.price}
                              </strong>
                              </Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                              <Col>
                              Status :
                              </Col>
                              <Col>
                              {product.countInStock >0 ? 'Instock' : 'OutOf Stock' } 
                              </Col>
                          </Row>

                        </ListGroup.Item>
                        { product.countInStock > 0  &&  (
                            <ListGroup.Item>
                            <Row>
                                <Col>
                                    Qty :
                                </Col>
                                <Col>
                                <Form.Control as="select"
                                value={qty}
                                onChange = {(e) => setQty(e.target.value)} >
                                    {
                                        [...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x+1} value={x+1}>

                                                {x+1}
                                            </option>
                                        ))
                                    }
                                </Form.Control>
                                </Col>
                            </Row>
                            </ListGroup.Item>
                        )}
                        
                        <ListGroup.Item>
                            <Button className="btn btn-block" type='button' disabled={product.countInStock <= 0}
                            onClick = {submitHandler} >
                            Add To Cart
                            </Button>
                        </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    
                </Row>

                <Row className='mt-4'>
                   <Col md={6}>
                   
                  <h4 > REVIEWS 
                      </h4> 
                      {
                      product.reviews.length === 0 && <Message variant='info'>NO reviews</Message>}
                  <ListGroup variant='flush'>
                     {product.reviews.map((review) => (
                         <ListGroup.Item key={review._id}>
                             <strong> {review.name}</strong>
                            <Rating value={review.rating} color='#f8e825'  />
                            
                            <p> {review.createdAt.substring(0,10)} </p>
                            <p> {review.comment} </p>
                         </ListGroup.Item>
                     ))} 
                     <ListGroup.Item>
                        <h4> Write A review </h4>
                        {loadingReview && <Loader/>}
                        {successReview && <Message variant='success'>Review Submitted</Message> }
                        {errorReview && <Message variant='warning'>{errorReview}</Message>}
                        {
                            userInfo ? (
                                <Form onSubmit={reviewHandler} >
                                <Form.Group controlId='rating'>
                                <Form.Label>Rating</Form.Label>
                                   <Form.Control
                                   as='select'
                                   value = {rating}
                                   onChange = {(e) => setRating(e.target.value)}>
                                   
                                       <option value=''>Select..</option>

                                       <option value='1'>1-poor</option>
                                       <option value='2'>2-Fair</option>
                                       <option value='3'>3-Good</option>
                                       <option value='4'>4-VeryGood</option>
                                <option value='5'>5-Excellent</option>
                                   </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='comment'>
                                    <Form.Label>Review</Form.Label>
                                <Form.Control 
                                as='textarea'
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}>

                                </Form.Control>
                                </Form.Group>

                                <Button 
                               disabled={loadingReview}
                               type='submit'
                               className='mt-2'
                               variant='primary' >
                                   Submit
                                </Button>

                            </Form>
                            
                                ) : (
                            <Message variant='info'>
                           please <Link to='/login'>login </Link>to write a review  
                            </Message>
                            )
                        }
                         </ListGroup.Item>
                      
                      
                      </ListGroup> 
                   
                   </Col> 
                    
                    
                    </Row> 
                </div>
                
                
                }      
        </div>
    )
}

export default ProductScreen
