from django.middleware import csrf
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserDetailSerializer
from .utils import getOtp
from .models import Otp
from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth import get_user_model, authenticate
User = get_user_model()


class SignUpView( APIView ):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        otp = get_object_or_404( Otp, email=email, otp=otp )
        if otp:
            serializer = UserDetailSerializer( data=request.data )
            if serializer.is_valid():
                serializer.save()
                otp.delete()
                return Response( data=serializer.data , status=201 )
            return Response( data=serializer.errors, status=400 )
        return Response( data={ "details": "incorrect otp." }, status=400 )

# for singup
class OtpView( APIView ):
    def post(self, request):
        email = request.data.get("email")
        if User.objects.filter( email=email ).count() == 0:
            try:
                otpObj = get_object_or_404( Otp, email=email )
                if otpObj:
                    otpObj.delete()
            except Exception as e :
                print(e)

            otp = getOtp()
            # Compose email content
            subject = "Your OTP Code for Pro"
            message = f"Your OTP code is {otp}. Please use this to complete your registration process."
            from_email = settings.DEFAULT_FROM_EMAIL
            '''
            # Send the OTP via email
            try:
                send_mail(subject, message, from_email, [email])
                print(f"OTP sent to {email}: {otp}")
            except Exception as e:
                print(f"Error sending OTP email: {e}")
                return Response({"details": "Failed to send OTP email."}, status=500)
            '''
            # --- compose mail ---
            print( otp )
            Otp.objects.create( email=email, otp=otp )
            return Response( status=200 )
        return Response( data={ "details": "User with this email already exist." }, status=400 )


# for forgot pw
class OtpView2( APIView ):
    def post(self, request):
        email = request.data.get("email")
        user = get_object_or_404( User, email=email )
        Otp.objects.filter( email=email ).delete()
        otp = getOtp()
        # --- compose mail ---
        print( otp )
        Otp.objects.create( email=email, otp=otp )
        return Response( status=200 )


class ForgotPwView( APIView ):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        otp = get_object_or_404( Otp, email=email, otp=otp )
        if otp:
            user = get_object_or_404( User, email=email )
            user.set_password( new_password )
            user.save()
            return Response( data={"details":"pw reset successfully."}, status=200 )
        return Response( data={ "details": "incorrect otp." }, status=400 )


class ChangePwView( APIView ):
    authentication_classes = [ JWTAuthentication, ]
    permission_classes = [ IsAuthenticated, ]
    def post(self, request):
        username = request.data.get("username")
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        user = authenticate( username=username,password=old_password )
        if user and (user==request.user):
            user.set_password( new_password )
            user.save()
            return Response( data={"details":"pw reset successfully."}, status=200 )
        return Response(data={"detail":"Incorrect un/pw."},status=400)
    

class DeleteUserView( APIView ):
    authentication_classes = [ JWTAuthentication, ]
    permission_classes = [ IsAuthenticated, ]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate( username=username,password=password )
        if user and (user==request.user):
            user.delete()
            return Response( data={"details":"User Account Deleted."}, status=200 )
        return Response(data={"detail":"Incorrect un/pw."},status=400)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated,]
    authentication_classes = [JWTAuthentication,]
    def get(self,request):
        serializer = UserDetailSerializer(request.user)
        return Response( data=serializer.data, status=200 )
    

class SignInView(APIView):
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')
        user = authenticate( username=username, password=password )
        if user:
            refresh = RefreshToken.for_user(user)
            tokens = {'refresh':str(refresh),'access':str(refresh.access_token) }
            response = Response(data=tokens)
            response.set_cookie(
                    key = 'refresh', 
                    value = tokens["refresh"],
                    expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure = True,
                    httponly = True,
                    samesite = 'None'
                )
            response["X-CSRFToken"] = csrf.get_token(request)
            return response
        return Response(data={"detail":"Incorrect un/pw."},status=400)
            



class LogoutView(APIView):
    def post(self,request):
        response = Response()
        try:
            refreshToken = request.COOKIES.get('refresh')
            token = RefreshToken(refreshToken)
            token.blacklist()
        except Exception as e:
            print(e,"-----")
            response = Response(data={"detail": "Invalid Token."},status=400)
        finally:
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            response.delete_cookie("X-CSRFToken")
            response.delete_cookie("csrftoken")
            response["X-CSRFToken"]=None
        return response



class JwtTokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                data = {'access': str(refresh.access_token)}
                return Response(data)
            except Exception as e:
                return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Refresh token not found'}, status=status.HTTP_400_BAD_REQUEST)

