from rest_framework import serializers

from django.contrib.auth import get_user_model
User = get_user_model()

class UserDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ( 'id','first_name','last_name', 'username', 'password', 
			'email', 'gender','profile_pic','address','pincode','city','contact')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self,validated_data):
		return User.objects.create_user(**validated_data)
