import React, {useState } from 'react'
import { Form,Button } from 'react-bootstrap'
import { useSelector ,useDispatch} from 'react-redux'
import FormContainer from '../components/FormContainer'
import {saveShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
function ShippingScreen({ history }) {

    const cart = useSelector( state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
   
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(saveShippingAddress({ address,city,postalCode, country}))
        history.push('/payment')
    }


    return (
        <div>
      <h5>  <CheckoutSteps step1 step2  /> </h5>
        <FormContainer>
          
<h3> Shipping Screen</h3>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>
                        Address
                    </Form.Label>
                    <Form.Control 
                    type='text'
                    value={address ? address : ''}
                    placeholder="enter Your Address"
                    onChange ={ (e)=> setAddress(e.target.value)}
                    required  >
     
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <Form.Label>
                        City
                    </Form.Label>
                    <Form.Control 
                    type='text'
                    value={city ? city : ''}
                    placeholder="enter Your Address"
                    onChange ={ (e)=> setCity(e.target.value)}
                    required  >
     
                    </Form.Control>
                </Form.Group>
                
                <Form.Group controlId='postalCode'>
                    <Form.Label>
                        Postal Code
                    </Form.Label>
                    <Form.Control 
                    type='text'
                    value={postalCode ? postalCode : ''}
                    placeholder="enter Your postal Code"
                    onChange ={ (e)=> setPostalCode(e.target.value)}
                    required  >
     
                    </Form.Control>
                </Form.Group>
                
                <Form.Group controlId='country'>
                    <Form.Label>
                        Country
                    </Form.Label>
                    <Form.Control 
                    type='text'
                    value={country ? country : ''}
                    placeholder="enter Your Address"
                    onChange ={ (e)=> setCountry(e.target.value)}
                    required  >
     
                    </Form.Control>
                </Form.Group>

            <Button
             type='submit'
             variant='primary'
             className="mt-3" >
               Continue

            </Button>

            </Form>



          
        </FormContainer></div>
    )
}

export default ShippingScreen
