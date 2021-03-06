from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import render
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress,Review
from .serializers import OrderSerializer, ProductSerializer,UserSerializer, UserSerializerWithToken
from django.contrib.auth.hashers import make_password
from rest_framework import status
from datetime import datetime

@api_view(['GET'])
def getRoutes(request):

    routes = [
        'api/products/',
        'api/products/create/',
         
        'api/products/upload/',

        'api/products/<id>/reviews/',
        'api/products/top.',

        'api/products/<id>',

        'api/products/delete/<id>',
        'api/products/<update>/<id>',




    ]    
    return Response(routes  )

#USER VIEWS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user  = request.user
    serializer = UserSerializer(user, many=False)
    return Response( serializer.data )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user  = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password =make_password( data['password'])

    user.save()
    return Response( serializer.data )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response( serializer.data )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response( serializer.data )



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request,pk):
    user  = User.objects.get(id=pk)
    

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

   

    user.save()
    serializer = UserSerializer(user, many=False)
    return Response( serializer.data )



@api_view(['POST'])
def userRegister(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
            )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail' : 'user with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request,pk):
    userForDeletion = User.objects.get(id=pk)

    userForDeletion.delete()

    return Response('User Was Deleted')






#PRODUCT VIEWS
@api_view(['GET'])
def getProducts(request):

    query = request.query_params.get('keyword')
    print('query:',query)
    if query == None:
        query = ''


    products = Product.objects.filter(name__icontains=query)
    serializer = ProductSerializer(products, many=True)
    return Response( serializer.data )


@api_view(['GET'])
def getTop(request):

    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    
    return Response(serializer.data)



@api_view(['GET'])
def getProduct(request, pk):
    product =Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response( serializer.data )

   
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product =Product.objects.get(_id=pk)
    product.delete()
    return Response( 'Product deleted!!!')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=34,
        brand='Sample Brand',
        countInStock=2,
        category='Sample Category',
        description='This is the most liked one'
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
   


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
   

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v


        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock
            
            product.countInStock -= item.qty
            
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user ==user:
            serializer = OrderSerializer(order,many=False)
           
            return Response( serializer.data )

        else:
            Response({'detail':'Not Authorized to view this order'},status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail':'Order does not exist'},status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):

    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders ,many=True)

    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid( request,pk):
    order = Order.objects.get(_id = pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order is improve ')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user = request.user
    product = Product.objects.create(_id = pk)
    data = request.data

    #1 -Review already exists

    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'details ' : 'Product already reviewed'} 
        return Response(content ,status= status.HTTP_400_BAD_REQUEST)
    #2 Num Reviews -0

    elif data['rating'] ==0:
        
        content = {'details ' : 'Product already reviewed'} 
        return Response(content ,status= status.HTTP_400_BAD_REQUEST)

    else:
        review = Review.objects.create(

            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0

        for i in reviews:
            total += i.rating
        
        product.rating = total/len(reviews)
        product.save()

        return Response({'detail':'Product Added'})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()
        
        return Response('Review Added')