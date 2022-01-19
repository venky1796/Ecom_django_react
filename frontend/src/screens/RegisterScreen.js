
import React , {useState , useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import {Form , Row ,Col , Button } from 'react-bootstrap'
import {Link } from 'react-router-dom'
import {useDispatch , useSelector } from 'react-redux'
import { register } from '../actions/userLoginActions'
import Message from '../components/Message'
import Loader from '../components/Loader'



function RegisterScreen({ location , history}) {

    const [name , setName] = useState('')
    const [message , setMessage] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [confirmpassword , setConfirmPassword] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'
    const userRegister = useSelector(state => state.userRegister)

    const dispatch = useDispatch()    
    const { loading , error , userInfo} = userRegister

    useEffect(() => {
        if(userInfo) {
            history.push(redirect)
        }
    },[history , userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmpassword){
            setMessage('Passwords do not match')
        }else{

            dispatch(register(name,email, password))
        }

    }
    return (
        
            <FormContainer>
                 <h1> Sign Up</h1>
                    {message && <Message variant='danger' >{message}</Message>}
                    { error && <Message variant="danger">{error}</Message>}

                    { loading && <Loader />}
                 <Form onSubmit={submitHandler}>
                 <Form.Group controlId="name">
                    <Form.Label>
                        Name Address
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
                     required>

                

                    </Form.Control> </Form.Group>
                 <Form.Group controlId="confirmpassword" className="mt-3">
                    <Form.Label>
                       Confirm Password 
                    </Form.Label>
                    <Form.Control
                     type = 'confirmpassword'
                     placeholder = 'confirm your password'
                     value = {confirmpassword}
                     onChange = {(e) => setConfirmPassword(e.target.value)}
                     required>



                    </Form.Control>


                 </Form.Group>
                 
                <Button type='submit' className="mt-3" variant='primary' >
                Register

                </Button>


                 </Form>

                 <Row className="py-3" >
                    <Col>
                    Have An account ? <Link to={redirect ? `/login/redirect?=${redirect}` : '/login'} >
                  LogIn </Link> </Col>
                 </Row>
                 
                 </FormContainer>
        
    )
}

export default RegisterScreen
