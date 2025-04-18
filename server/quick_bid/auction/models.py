from django.db import models
from account.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AuctionItem(models.Model):
    STATUSES = { 'live':'live', 'ended':'ended', 'cancelled':'cancelled' }
    title = models.CharField(max_length=100)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='auctions')
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20,choices=STATUSES,default='live')
    payment_done = models.BooleanField(default=False)  # <--- ✅ ADD THIS
    
    def __str__(self):
        return self.title


class Bid(models.Model):
    auction_item = models.ForeignKey(AuctionItem, related_name='bids', on_delete=models.CASCADE)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE)
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    bid_time = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    auction = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.commenter} on {self.auction}'


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    auction = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='watched_by')

    class Meta:
        unique_together = ('user', 'auction')

class Winner(models.Model):
    winner = models.ForeignKey(User,on_delete=models.CASCADE,null=True, blank=True, related_name='winner')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, null=True, blank=True, related_name='winner_auction')
    paid = models.BooleanField(default= False)

class DeliveryDetails(models.Model):
    user = models.ForeignKey(Winner, on_delete=models.CASCADE, related_name='delivery_details_user')
    address1 = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    phone = models.CharField(max_length=10)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


