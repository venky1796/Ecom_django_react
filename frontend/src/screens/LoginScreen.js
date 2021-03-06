import React , {useState , useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import {Form , Row ,Col , Button } from 'react-bootstrap'
import {Link } from 'react-router-dom'
import {useDispatch , useSelector } from 'react-redux'
import { login } from '../actions/userLoginActions'
import Message from '../components/Message'
import Loader from '../components/Loader'



function LoginScreen({ location , history}) {

    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'
    const userLogin = useSelector(state => state.userLogin)

    const dispatch = useDispatch()    
    const { loading , error , userInfo} = userLogin

    useEffect(() => {
        if(userInfo) {
            history.push(redirect)
        }
    },[history , userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
       dispatch(login(email, password))
    }
    return (
        
            <FormContainer >
                 <h1 > Sign In</h1>
                    { error && <Message variant="danger">{error}</Message>}

                    { loading && <Loader />}
                 <Form onSubmit={submitHandler}>
                 <Form.Group controlId="email">
                    <Form.Label>
                        Email Address
                    </Form.Label>
                    <Form.Control
                     type='email'
                     placeholder='enter your email'
                     value = {email}
                     onChange = {(e) => setEmail(e.target.value)}
                     required >


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
                     required>



                    </Form.Control>


                 </Form.Group>
                 
                <Button type='submit' className="mt-3" variant='primary' >
                Login

                </Button>


                 </Form>

                 <Row className="py-3" >
                    <Col>
                    New Customer ? <Link to={redirect ? `/register/redirect?=${redirect}` : '/register'} >
                  Register </Link> </Col>
                 </Row>
                 
                 </FormContainer>
        
    )
}

export default LoginScreen
