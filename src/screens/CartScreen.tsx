import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Platform,
} from 'react-native';
import {useCart} from '../context/CartContext';
import Toast from 'react-native-toast-message';
import clevertap from 'clevertap-react-native';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const CartScreen = () => {
  const {cartItems, removeFromCart, clearCart} = useCart();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleCheckout = () => {
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Prepare items data for CleverTap
    const itemsData = cartItems.map((item, index) => ({
      [`Item ${index + 1} ID`]: item.id,
      [`Item ${index + 1} Name`]: item.title,
      [`Item ${index + 1} Price`]: item.price,
    }));

    // Combine all properties into single object
    const eventProperties = {
      'Transaction Date': new Date().toISOString(),
      'Total Amount': totalAmount,
      'Item Count': cartItems.length,
      'Payment Method': 'In-App',
      Currency: 'USD',
      ...itemsData.reduce((acc, item) => ({...acc, ...item}), {}),
      'Movie Names': cartItems.map(item => item.title).join(', '), // All movie names in one property
    };

    // Record single charged event with all items
    clevertap.recordEvent('Charged', eventProperties);

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Payment Successful',
      text2: `You've been charged for ${
        cartItems.length
      } items ($${totalAmount.toFixed(2)})`,
      visibilityTime: 3000,
      position: 'bottom',
    });

    // Clear cart after successful checkout
    clearCart();
  };

  const renderItem = ({item}: {item: any}) => {
    const itemAnim = new Animated.Value(1);

    const handleRemove = () => {
      Animated.timing(itemAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => removeFromCart(item.id));
    };

    const imageUrl =
      item.image ||
      (item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null);

    return (
      <Animated.View
        style={[
          styles.item,
          {
            opacity: itemAnim,
            transform: [
              {
                scale: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.itemTextContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.price && (
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleRemove}
          style={styles.removeBtn}
          activeOpacity={0.8}>
          <Text style={styles.removeText}>X</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <SafeAreaView style={styles.safeContent}>
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>My Cart</Text>
            {cartItems.length > 0 && (
              <Text style={styles.itemCount}>{cartItems.length} items</Text>
            )}
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.cartIcon}>🛒</Text>
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Text style={styles.emptySubtext}>
                Start shopping to add items
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={renderItem}
                ListFooterComponent={
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total: $
                      {cartItems
                        .reduce((sum, item) => sum + (item.price || 0), 0)
                        .toFixed(2)}
                    </Text>
                  </View>
                }
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.clearBtn]}
                  onPress={clearCart}
                  activeOpacity={0.8}>
                  <Text style={styles.actionBtnText}>Clear All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.checkoutBtn]}
                  onPress={handleCheckout}
                  activeOpacity={0.8}>
                  <Text style={styles.actionBtnText}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </SafeAreaView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
    paddingTop: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    fontFamily: 'Poppins-Bold',
  },
  itemCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cartIcon: {
    fontSize: 60,
    color: '#ccc',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#555',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  itemTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 8,
    fontFamily: 'Poppins-Bold',
  },
  removeBtn: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  totalContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Platform.select({ios: 24, android: 16}),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  checkoutBtn: {
    backgroundColor: '#4CAF50',
  },
  clearBtn: {
    backgroundColor: '#ff3b30',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default CartScreen;
