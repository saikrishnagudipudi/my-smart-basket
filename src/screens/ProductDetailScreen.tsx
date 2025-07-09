import React, { useLayoutEffect } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { Product } from '../navigation/type';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Props {
  route: {
    params: {
      product: Product;
    };
  };
}

export default function ProductDetailScreen({ route }: Props) {
  const { product } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const cartItems = useSelector((state: any) => state.cart.cartItems);
  const isInCart = cartItems.find((p: Product) => p.id === product.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image
        source={{ uri: product.imageUrls?.[0] }}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
        <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{product.description}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{`₹${product.price}`}</Text>
          <Text style={styles.strike}>{`₹${product.originalPrice}` ?? ''}</Text>
        </View>

        {!isInCart ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(addToCart({ ...product, qty: 1 }))}
          >
            <Icon name="cart-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}> Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(product.id))}>
              <Icon name="remove-circle-outline" size={24} color="#ff4d4d" />
            </TouchableOpacity>
            <Text style={styles.qty}>{isInCart.qty}</Text>
            <TouchableOpacity onPress={() => dispatch(addToCart({ ...product, qty: 1 }))}>
              <Icon name="add-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fa',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  strike: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  qty: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
