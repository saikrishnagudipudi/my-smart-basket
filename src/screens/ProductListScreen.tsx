import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Product, RootStackParamList } from '../navigation/type';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../redux/slices/authSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { AppDispatch } from '../redux/store';

const screenWidth = Dimensions.get('window').width;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

export default function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products as Product[]);
  const cartItems = useSelector((state: any) => state.cart.cartItems as Product[]);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
    GoogleSignin.signOut();
    navigation.replace('Login');
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    setIsLoading(true);
    await dispatch(fetchProducts({ page }));
    setIsLoading(false);
  };

  const loadMore = () => {
    if (!isLoading) setPage(prev => prev + 1);
  };

  const renderItem: ListRenderItem<Product> = ({ item }) => {
    const inCart = cartItems.find(p => p.id === item.id);
    const percentOff = item.originalPrice && item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
        activeOpacity={0.9}
      >
        {percentOff > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{percentOff}% OFF</Text>
          </View>
        )}
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.brand || 'Brand'}</Text>
        <Text style={styles.weight}>{item.description || 'Description'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{`₹${item.price ?? 0}`}</Text>
          <Text style={styles.strike}>{`₹${item.originalPrice ?? ''}`}</Text>
        </View>
        <View style={styles.cartActions}>
          {!inCart ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => dispatch(addToCart({ ...item, qty: 1 }))}
            >
              <Icon name="cart-outline" size={16} color="#ff4d4d" />
              <Text style={styles.addButtonText}> Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                <Icon name="remove-circle-outline" size={24} color="#ff4d4d" />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{inCart.qty}</Text>
              <TouchableOpacity onPress={() => dispatch(addToCart({ ...item, qty: 1 }))}>
                <Icon name="add-circle-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>🛒 My Smart Basket</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: 10 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator size="small" color="#4CAF50" /> : <View style={{ height: 40 }} />}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Icon name="barcode-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Icon name="cart" size={24} color="#fff" />
        {cartItems.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: 'space-between', marginBottom: 15 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  logoutBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 8,
    alignSelf: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  weight: {
    fontSize: 12,
    color: '#333',
    marginVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  strike: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#999',
    marginLeft: 8,
  },
  cartActions: {
    marginTop: 8,
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#ff4d4d',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ff4d4d',
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  scanButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
