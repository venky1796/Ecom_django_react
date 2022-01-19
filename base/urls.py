from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,

)

urlpatterns = [
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.userRegister, name='register'),

    path('',views.getRoutes , name='routes' ),
    path('users/profile/',views.getUserProfile , name='user-profile' ),
    path('users/profile/update/',views.updateUserProfile , name='user-profile-update' ),
    path('users/',views.getUsers , name='users' ),
    path('users/<str:pk>',views.getUserById , name='user' ),
    path('users/update/<str:pk>/',views.updateUser , name='user-update' ),
    path('users/delete/<str:pk>/',views.deleteUser , name='user-delete' ),

    path('products/',views.getProducts , name='products' ),
    path('products/top/',views.getTop , name='top-products' ),
    path('products/<str:pk>/',views.getProduct , name='product' ),
    path('products/<str:pk>/reviews/',views.createProductReview, name='product-review' ),
    path('products/delete/<str:pk>/',views.deleteProduct , name='product-delete' ),
    path('products/create/',views.createProduct , name='product-create' ),
    
    path('orders/add/',views.addOrderItems,name='orders-add'),
    path('orders/myorders/',views.getMyOrders,name='my-orders'),
    path('orders/<str:pk>',views.getOrderById,name='user-order'),
    path('orders/<str:pk>/pay/',views.updateOrderToPaid,name='pay'),
    
]
