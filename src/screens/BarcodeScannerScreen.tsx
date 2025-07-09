import React, { useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Camera, CameraType } from 'react-native-camera-kit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnReadCodeData } from 'react-native-camera-kit/dist/CameraProps';


type RootStackParamList = {
  ProductDetails: { product: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  barcode: string;
};


export default function BarcodeScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const products = useSelector((state: any) => state.product.products as Product[]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  const onBarcodeRead = (event: OnReadCodeData) => {
    const code = event.nativeEvent.codeStringValue;
    const match = products.find((p) => p.barcode === code);

    if (match) {
      navigation.navigate('ProductDetails', { product: match });
    } else {
      Alert.alert('No product found for scanned barcode.');
    }
  };

  if (!hasPermission) return null;

  return (
    <View style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={onBarcodeRead}
        showFrame={true}
        laserColor="red"
        frameColor="yellow"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
