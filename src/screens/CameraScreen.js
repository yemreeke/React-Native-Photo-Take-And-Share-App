import React,{useState,useEffect } from "react";
import {Platform,StyleSheet,Text,Image, View, TouchableOpacity} from "react-native";
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
const CameraScreen = ({navigation})=>{
  const [location, setLocation] = useState(null); // Konumu saklamak için
  const [adress, setAdress] = useState(); // Adresi saklamak için
  const [errorMsg, setErrorMsg] = useState(null); // Hata mesajlarını saklamak için
  const [hasPermission, setHasPermission] = useState(null); // Yetki verildi mi saklamak için
  const [type, setType] = useState(Camera.Constants.Type.back); // Kamera Yönünü saklamak için
  const [capturedImage, setCapturedImage] = useState(null); // Çekilen Resmi saklamak için
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off); // Kameranın flash modunu 
  const [previewVisible, setPreviewVisible] = useState(false); //Fotoğraf çekildi mi çekilmedimi (Önizleme)
  let camera;
  Location.setGoogleApiKey("***************************************"); // Sizin API anahtarınız.
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg('Hata , bu uygulama android emülatör üzerinde çalışmayacaktır. Cihazınızda deneyin!');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync(); // Konum İzni İsteği
      if (status !== 'granted') {  // Yetki Hatası 
        setErrorMsg('Konum erişim izni reddedildi!');
        return;
      }
      let location = await Location.getCurrentPositionAsync({}); // Konumu elde et
      let adres = await Location.reverseGeocodeAsync(location.coords); // API ile geocode'u Adres dizisine çeviriyoruz.
      console.log(adres); //Adres dizisini yazdırıyoruz
      setAdress(adres[0]); // Dizinin ilk elemanını adres olarak kaydediyoruz
      console.log("ADRES:"+adres[0]); // Adresi gösteriyoruz
      setLocation(location); // Konumu kaydediyoruz.
    })();
  }, []);

  let locationText = 'Konum Algılanıyor...'; // Konum algılanma metni
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = JSON.stringify(location);
  }
  const takePicture = async () => { // Fotoğraf Çekme Fonksiyonu
    if (!camera){ // Kamera hazır değilse 
      return
    } 
    const photo = await camera.takePictureAsync()
    setPreviewVisible(true); //Fotoğraf önizlemeyi görünür olarak ayarla 
    setCapturedImage(photo); // Yakalanmış görüntüyü kaydet
  }


  // Kamera yetki işlemi 
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted'); // Kamera iznini var olarak ayarla
    })();
  }, []);

  
  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <Text>Kameraya Erişim İzni Yok!</Text>;
  }
  return (
    <View style={styles.viewVertical}>
      <Camera style={styles.camera} type={type} ref={(r) => {camera = r}} flashMode={flashMode}>
        <View // Üst Taraftaki Butonlar
          style={styles.buttonContainer}>
          <TouchableOpacity  // Sil Butonu
            style={styles.silButton}  onPress={()=>{setPreviewVisible(false);}}>
              <Image style={styles.imageDelete} source={require("../../assets/x.png")}/>
          </TouchableOpacity>
          <TouchableOpacity // Flash Açma Kapatma Butonu
            style={styles.flashButton}
            onPress={()=>{
              if(flashMode==Camera.Constants.FlashMode.on){
                console.log("Flash Kapatıldı");
                setFlashMode(Camera.Constants.FlashMode.off)
              }
              else{
                console.log("Flash Açıldı");
                setFlashMode(Camera.Constants.FlashMode.on)
              }
              }
            }
            >
              {
              flashMode==Camera.Constants.FlashMode.on 
              ? 
              <Image style={styles.imageCameraFlash} source={require("../../assets/on.png")}/> 
              : 
              <Image style={styles.imageCameraFlash} source={require("../../assets/off.png")}/>
              
              }
          </TouchableOpacity>
        </View>
        <View // Alt taraftaki butonlar
          style={styles.buttonContainer}>
          <TouchableOpacity //Kamera Çevirme Butonu
              style={styles.button1}
              onPress={() => {
              setType(
                  type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
              }}>
              <Image style={styles.imageRotateCamera} source={require("../../assets/cevir.png")}/>

          </TouchableOpacity>
          <TouchableOpacity // Fotoğraf çekme Butonu
              style={styles.button2}
              onPress={() => {takePicture() }}>
              <Image style={styles.imageTakePicture} source={require("../../assets/kamera.png")}/>
          </TouchableOpacity>
        </View>
      </Camera>
      {locationText=="Konum Algılanıyor..." ? <Text style={styles.text2}>{locationText}</Text>:<Text style={styles.text2}>Konum Algılandı.</Text>}
      <View style={styles.container}>  
        {previewVisible==true // Ön İzleme Görünümü aktif ise 
          ? 
          <View>
            <Image  style={styles.image} source={{uri: capturedImage && capturedImage.uri}}/> 
            {locationText=="Konum Algılanıyor..."  // Konum algılandıysa 
            ?                                      
              null 
            :   
              // Fotoğrafı Düzenle butonunu göster
              <TouchableOpacity style={styles.photoEditButton} onPress={()=>{
                navigation.navigate( // Yönlendirirken çekilen fotoğrafı ve adresi parametre olarak gönder.
                  'PhotoEditorScreen',
                  {photo:capturedImage.uri,adres:adress}
                );
                }}>
                <Text style={styles.text2}>Fotoğrafı Düzenle</Text> 
              </TouchableOpacity>
            }
          </View>
          :
          <Text style={styles.text1}>Fotoğraf Çekiniz</Text> 
         }
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image:{
    height:300,
    width:300,
    margin:5,
  },
  photoEditButton:{
    alignItems: "center",
    backgroundColor: "#6B6A69",
    padding: 5,
    borderRadius:25,
    height:35,
    width:200,
    alignSelf:"center"
  },
  imageCameraFlash:{
    marginTop:3,
    width:50,
    height:50,
  },
  imageDelete:{
    margin:2,
    width:45,
    height:45,
    },
  imageRotateCamera:{
    marginLeft:3,
    width:60,
    height:40
  },
  imageTakePicture:{
    marginRight:2,
    width:50,
    height:45,
  },
  viewVertical:{
    flexDirection:"column",
    flex:6,
    alignItems:"center"
  },
  container: {
    flex:5,
  },
  camera: {
    marginTop:5,
    flex:4,
    borderWidth:5,
    borderColor:"black",
    width:300,
    height:300,
  },
  buttonContainer: {
    flex:1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flashButton:{
    flex:1,
    alignSelf: 'flex-start',
    alignItems: "flex-end",
  },
  silButton: {
    flex:1,
    alignSelf: 'flex-start',
    alignItems: "flex-start",
  }, 
  button1: {
    flex:1,
    alignSelf: 'flex-end',
    alignItems: "flex-start",
  }, 
  button2: {
    flex:1,
    alignSelf: 'flex-end',
    alignItems: "flex-end",
  },
  text1: {
    fontSize: 40,
    color: 'black',
    fontWeight:"bold",
    marginTop:100,
  },
  text2: {
    fontSize: 20,
    color: 'black',
    fontWeight:"bold"
  },

});
export default CameraScreen;