import React , {useState , useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import {Form , Row ,Col , Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {useDispatch , useSelector } from 'react-redux'
import { getUserDetails,  updateUserProfile } from '../actions/userLoginActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { USER_PROFILE_UPDATE_RESET } from '../constants/userLoginConstants'
import { listMyOrders } from '../actions/orderActions'


function ProfileScreen({history}) {
    const [name , setName] = useState('')
    const [message , setMessage] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [confirmpassword , setConfirmPassword] = useState('')

    const userDetails = useSelector(state => state.userDetails)
    const { loading , error , user} = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const userProfileUpdate = useSelector(state => state.userProfileUpdate)
    const { success } = userProfileUpdate
    
    const orderListMy = useSelector(state => state.orderListMy)
    const { loading : loadingOrders , error: errorOrders ,orders } = orderListMy
    const dispatch = useDispatch()    

    useEffect(() => {
        if(!userInfo) {
            history.push('/login')
        }else{
            if(!user || !user.name || success || userInfo._id!== user._id ){
                dispatch({ type : USER_PROFILE_UPDATE_RESET})
                dispatch(getUserDetails())
                dispatch(listMyOrders())
            }else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    },[history ,dispatch, user,success, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmpassword){
            setMessage('Passwords do not match')
        }else{

         dispatch(updateUserProfile({
             'id':user._id,
             'name':name,
             'email':email,
             'password': password,
         }))
         setMessage('')
        }
        

    }
    return (
        <Row>
            <Col md={3}>
            <h2> User Profile</h2>
            {message && <Message variant='danger' >{message}</Message>}
                    { error && <Message variant="danger">{error}</Message>}

                    { loading && <Loader />}
                 <Form onSubmit={submitHandler}>
                 <Form.Group controlId="name">
                    <Form.Label>
                        Name 
                    </Form.Label>
                    <Form.Control
                     type='name'
                     placeholder='enter your name'
                     value = {name}
                     onChange = {(e) => setName(e.target.value)}
                     required>
                        
                    </Form.Control>


                 </Form.Group>
                 <Form.Group controlId="email">
                    <Form.Label>
                        Email Address
                    </Form.Label>
                    <Form.Control
                     type='email'
                     placeholder='enter your email'
                     value = {email}
                     onChange = {(e) => setEmail(e.target.value)}
                     required>

                    </Form.Control>


                 </Form.Group>


                 <Form.Group controlId="password" className="mt-3">
                    <Form.Label>
                        Password 
                    </Form.Label>
                    <Form.Control
                     type = 'password'
                     placeholder = 'enter your password'
                     value = {password}
                     onChange = {(e) => setPassword(e.target.value)}
                     >

                

                    </Form.Control> </Form.Group>
                 <Form.Group controlId="confirmpassword" className="mt-3">
                    <Form.Label>
                       Confirm Password 
                    </Form.Label>
                    <Form.Control
                     type = 'password'
                     placeholder = 'confirm your password'
                     value = {confirmpassword}
                     onChange = {(e) => setConfirmPassword(e.target.value)}
                     >



                    </Form.Control>


                 </Form.Group>
                 
                <Button type='submit' className="mt-3" variant='primary' >
                Update

                </Button>


                 </Form>

            </Col>
            <Col md={9}>
            <h2> My orders </h2>
            { loadingOrders ? <Loader /> : errorOrders ? 
            <Message variant='danger'> {errorOrders } </Message> : (
               <Table striped responsive className='table-sm'>
                   <thead>
                        <tr>
                            <th> ID</th>
                            <th> Date </th>
                            <th> Total</th>
                            <th> Paid</th>
                            <th> Details</th>

                        </tr>


                   </thead>

                   <tbody>
                       { orders.map((order)=> 
                       <tr key={order._id} >
                           <td>{order._id}</td>
                           <td>{order.createdAt.substring(0,10)}</td>
                           <td>{order.totalPrice}</td>
                           <td>{order.isPaid ? order.paidAt.substring(0,10)  : 
                           <i className='fas fa-times' ></i>}</td>
                           {/* <td> <LinkContainer to={`/order/${order._id}`} > <Button className='btn btn-block' >
                              Details </Button> </LinkContainer> </td> */}
                       </tr>
                       )}
                       </tbody>


               </Table>
            )}
            </Col>
            
        </Row>
    )
}

export default ProfileScreen
