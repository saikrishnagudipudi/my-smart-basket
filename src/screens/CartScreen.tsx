import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';
import { Product } from '../navigation/type';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const cartItems = useSelector((state: any) => state.cart.cartItems);

  const total = cartItems.reduce((sum: number, item: Product) => {
    return sum + item.price * (item.qty || 1);
  }, 0);

  const handleOrder = () => {
    Toast.show({
      type: 'success',
      text1: 'Order placed successfully',
    });
    dispatch(clearCart());
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
    GoogleSignin.signOut();
    navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price} x {item.qty} = ₹{item.price * (item.qty || 1)}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
          <Icon name="remove-circle-outline" size={24} color="#ff4d4d" />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.qty}</Text>
        <TouchableOpacity onPress={() => dispatch(addToCart({ ...item, qty: 1 }))}>
          <Icon name="add-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Cart</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Cart is empty</Text>}
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ₹{total}</Text>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#388E3C',
    padding: 8,
    borderRadius: 6,
  },
  logoutBtn: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qty: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color:"#000"
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
