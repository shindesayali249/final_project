from django.urls import path
from . import views

app_name = 'auction'

urlpatterns = [
    path('auctions/', views.AuctionItemListCreateView.as_view(), name='auction_item_list_create'),
    path('auctionscreate/', views.AuctionItemCreateView.as_view(), name='auction_item_create'),

    path('auctions/<int:pk>/', views.AuctionItemRetrieveUpdateDestroyView.as_view(), name='auction_item_detail'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category_list_create'),
    path('category/<int:pk>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('place_bid/<int:auction_item_id>/', views.BidListCreateView.as_view(), name='place_bid'),
    path('watchlist/', views.WatchListListCreateView.as_view(), name='watchlist'),
    path('comments/', views.CommentsListCreateView.as_view(), name='comments'),
    path('watchlistfiltter/', views.WachListFiltterView.as_view(), name='watchlistfiltter'),
    path('myauctions/', views.MyAuctionListView.as_view(), name='myauctions'),
    path('auctionwinner/<int:auction_item_id>/', views.WinnerAuctionListCreateView.as_view(), name='auction_winner'),
    path('auctionwinner/', views.WinnerAuctionListCreateView.as_view(), name='auction_winner_list'),
    path('payment/<int:winner_id>/', views.PaymentListCreateView.as_view(), name='auction_payment'),
    path('payment/', views.PaymentListCreateView.as_view(), name='auction_payment'),
    path('winner/<int:pk>/', views.WinnerRetrieveView.as_view(), name='auction_payment'),
    path('auction/delete/<pk>/', views.AuctionDeleteAPIView.as_view()),
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),

]
