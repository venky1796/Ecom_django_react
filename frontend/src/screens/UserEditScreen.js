
import React , {useState , useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import {Form , Row ,Col , Button } from 'react-bootstrap'
import {Link } from 'react-router-dom'
import {useDispatch , useSelector } from 'react-redux'
import { getUserDetails, register } from '../actions/userLoginActions'
import Message from '../components/Message'
import Loader from '../components/Loader'



function UserEditScreen({ match , history}) {

    const userId = match.params.id

    const [name , setName] = useState('')
    
    const [email , setEmail] = useState('')
    const [isAdmin , setIsAdmin] = useState(false)
   

  
    const userDetails = useSelector(state => state.userDetails)

    const dispatch = useDispatch()    
    const { loading , error , user} = userDetails

    useEffect(() => {
       if(!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId))
       }else {
           setName(user.name)
           setEmail(user.email)
           setIsAdmin(user.isAdmin)
       }
    },[user,userId])

    const submitHandler = (e) => {
        e.preventDefault()


    }
    return (
            <div>
                <Link to='/admin/usersList' >
                <Button variant='light' className='btn  mb-3' >Go back</Button>
                </Link>
            <FormContainer>
                 <h1> Edit User</h1>
                  {loading ?  <Loader /> : error ?
                   <Message variant='danger' > {error} </Message>
                : ( 
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
                     >
                           
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
                        >
   
                       </Form.Control>
   
   
                    </Form.Group>
   
   
                    <Form.Group controlId="isAdmin" className="mt-3">
                      
                       <Form.Check
                        type = 'checkbox'
                        label ='isAdmin'
                        checked = {isAdmin}
                        onChange = {(e) => setIsAdmin(e.target.checked)}
                        >
   
                   
   
                       </Form.Check> </Form.Group>
                   
                   <Button type='submit' className="mt-3" variant='primary' >
                   Update
   
                   </Button>
   
   
                    </Form>
      )}  

            
              
                 </FormContainer>
                 </div>
    )
}

export default UserEditScreen
