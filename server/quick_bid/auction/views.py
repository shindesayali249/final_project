from rest_framework import generics, serializers,status, filters
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import AuctionItem, Category,Bid, Watchlist,Comment, Winner,DeliveryDetails, Notification
from .serializers import AuctionItemSerializer, NotificationSerializer, CategorySerializer, BidSerializer, WatchlistSerializer, WatchlistDetailSerializer,CommentSerializer,WinnerAuctionSerializer, DeliveryDetailSerializer,AuctionItemCreateSerializer,WinnerAuctionGetSerializer,DeliveryDetailGetSerializer, AuctionDeleteSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.response import Response
from django.utils import timezone
from decimal import Decimal
from rest_framework.generics import DestroyAPIView
from django.core.mail import send_mail
from rest_framework.generics import ListAPIView
 


# List and Create Auction Items (for authenticated users)
class AuctionItemListCreateView(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.filter(status='live')  # Filter for live auctions
    serializer_class = AuctionItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)  # Set the seller to the current user

class AuctionItemCreateView(generics.ListCreateAPIView):
    queryset = AuctionItem.objects.filter(status='live')  # Filter for live auctions
    serializer_class = AuctionItemCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)  # Set the seller to the current user

# Retrieve, Update, and Delete a single AuctionItem
class AuctionItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


# List Categories
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


# Retrieve a single Category
class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class BidListCreateView(generics.ListCreateAPIView):
    serializer_class = BidSerializer
    queryset = Bid.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, auction_item_id):
        # Get the auction item using the auction_item_id
        auction_item = get_object_or_404(AuctionItem, id=auction_item_id)
        placed_bid_amount = request.data.get('bid_amount')
        
        # Convert the placed bid amount from string to Decimal
        try:
            placed_bid_amount = Decimal(placed_bid_amount)
        except ValueError:
            raise ValidationError("Invalid bid amount.")
        
        starting_bid = auction_item.starting_bid
        current_bid = auction_item.current_bid
        seller = auction_item.seller
        bidder = request.user
        
        # Ensure the seller is not placing the bid
        if seller == bidder:
            raise ValidationError("Seller cannot place a bid on their own auction item.")
        
        # Determine the minimum bid amount (either the current bid or starting bid if no bids exist)
        min_bid = current_bid if current_bid else starting_bid
        
        # Ensure the placed bid is greater than the minimum bid
        if placed_bid_amount <= min_bid:
            raise ValidationError(f"Bid amount must be greater than the current bid of {min_bid}.")
        
        # Ensure the auction is live and not ended
        if auction_item.status != 'live':
            raise ValidationError("This auction is not live, and you cannot place a bid.")
        
        # Ensure the auction has not ended
        if auction_item.end_time <= timezone.now():
            raise ValidationError("This auction has ended. No more bids can be placed.")
        
        # Create the bid using the serializer
        serializer = BidSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the bid and associate the auction item and bidder
            serializer.save(bidder=bidder, auction_item=auction_item)
            # Optionally, update the auction item with the new current bid (if needed)
            auction_item.current_bid = placed_bid_amount
            auction_item.save()
            
            # Return a success response with the bid data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # If the serializer is invalid, return the error messages
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class WatchListListCreateView(generics.ListCreateAPIView):
    queryset = Watchlist.objects.all() 
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return WatchlistDetailSerializer
        return super().get_serializer_class()

class CommentsListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.filter()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user)

class WachListFiltterView(generics.ListAPIView):
    queryset = Watchlist.objects.all() 
    serializer_class = WatchlistDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        search = self.request.query_params.get("search")
        return super().get_queryset().filter(user=self.request.user, auction__category__name=search )
    
class MyAuctionListView(generics.ListAPIView):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return super().get_queryset().filter(seller=self.request.user)
    
class WinnerAuctionListCreateView(generics.ListCreateAPIView):
    queryset = Winner.objects.all()
    serializer_class = WinnerAuctionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    # GET: Return all winners related to the logged-in user
    def get(self, request):
        winner_auction = Winner.objects.filter(winner=self.request.user)
        serializer = WinnerAuctionGetSerializer(winner_auction, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: End the auction and save the winner
    def post(self, request, auction_item_id):
        # Get the auction item using the auction_item_id
        auction_item = get_object_or_404(AuctionItem, id=auction_item_id)
        current_bid = auction_item.current_bid
        
        # Get the current bid for the auction item
        bid = get_object_or_404(Bid, auction_item=auction_item, bid_amount=current_bid)
        
        seller = auction_item.seller
        user = request.user
        bidder = bid.bidder
        
        if seller != user:
            raise ValidationError("Seller can only end the auction.")
        
        # Ensure the auction is live and not ended
        if auction_item.status != 'live':
            raise ValidationError("This auction is not live and cannot be ended.")
        
        # Serialize the incoming request data and save the winner
        serializer = WinnerAuctionSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(winner=bidder, auction_item=auction_item, bid_amount=current_bid)
            
            # Change the auction status to "ended"
            auction_item.status = 'ended'
            auction_item.save()
            
            # Return the serialized winner data with success
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # If the serializer is invalid, return the error messages
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class PaymentListCreateView(generics.ListCreateAPIView):

    queryset = DeliveryDetails.objects.all()
    serializer_class = DeliveryDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        paid_auction = DeliveryDetails.objects.filter(user__winner=self.request.user, user__paid=True)
        serializer = DeliveryDetailGetSerializer(paid_auction, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, winner_id):
        winner = get_object_or_404(Winner, id=winner_id)
        user = request.user
        serializer = DeliveryDetailSerializer(data=request.data)

        if winner.winner == user:
            if serializer.is_valid():
                delivery = serializer.save(user=winner)

                # ✅ Update the Winner's paid field
                winner.paid = True
                winner.save()

                # ✅ Notify seller: mark auction as paid
                auction = winner.auction_item
                auction.payment_done = True
                auction.save()
                Notification.objects.create(
                user=auction.seller,
                message=f"{user.username} has paid for the item: {auction.title}"
            )

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            send_mail(
                subject='Payment Received for Your Auction Item',
                message=f'Your item "{auction.title}" has been paid for by {user.username}.',
                from_email='noreply@yourapp.com',
                recipient_list=[auction.seller.email],
            )


class WinnerRetrieveView(generics.RetrieveAPIView):
    queryset = Winner.objects.all()
    serializer_class = WinnerAuctionGetSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class AuctionDeleteAPIView(DestroyAPIView):
    authentication_classes = [JWTAuthentication,]
    permission_classes = [IsAuthenticated]
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionDeleteSerializer



class NotificationListView(ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
