from django.urls import path
from .views import ( SignInView, UserInfoView, LogoutView,
	SignUpView, JwtTokenRefreshView, OtpView, OtpView2, ForgotPwView, ChangePwView,DeleteUserView )

urlpatterns = [
	path('signin/',SignInView.as_view() ),
	path('signup/',SignUpView.as_view() ),
	path('user/info/',UserInfoView.as_view()),
	path('logout/',LogoutView.as_view() ),
	path('refresh/',JwtTokenRefreshView.as_view()),
	path('otp/',OtpView.as_view() ),
	path('otp2/',OtpView2.as_view() ),
    path('forgotpw/',ForgotPwView.as_view() ),
    path('changepw/',ChangePwView.as_view() ),
    path('deleteuser/',DeleteUserView.as_view())
]
