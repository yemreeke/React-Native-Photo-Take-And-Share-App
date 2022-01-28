import React,{useState,useRef } from "react";
import {ScrollView,FlatList,TextInput, Share,StyleSheet, ImageBackground,Text, View, TouchableOpacity} from "react-native";
import ViewShot from "react-native-view-shot";
import {Ionicons } from '@expo/vector-icons';


const PhotoEditorScreen = ({navigation})=>{
  const viewShotRef = useRef();
  const [InputText, setInputText] = useState();
  const [photo, setPhoto] = useState(null);
  const [photoTextColor, setPhotoTextColor] = useState("blue");

  //Renklerin bulunduğu dizi
  const colors = ["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange"];
  
  async function captureViewShot(){ // View'ın ekran görüntüsünü yakaladığımız kısım
    const imageURI = await viewShotRef.current.capture();
    setPhoto(imageURI); // Görüntüyü kaydet
    Share.share({title:"Image",url:photo}); // Görüntüyü Paylaş
  }

  const uri = navigation.state.params.photo; // Parametre olarak gelen fotoğrafı elde et ve uri ye aktar.

  // Parametre olarak gelen adres verilerini elde et ve dizide sakla
  const locationText =
    [ navigation.state.params.adres.name,
      navigation.state.params.adres.street,
      navigation.state.params.adres.district,
      navigation.state.params.adres.postalCode,
      navigation.state.params.adres.subregion,
      navigation.state.params.adres.country ];
  
  return ( 
    <ScrollView >
      <View style= {{alignItems:"center"}}>
        <ViewShot style={styles.viewShot}  ref={viewShotRef} options={{format:"png",quality:1.0,result:"data-uri"}}>
          <ImageBackground  style={styles.image} source={{uri:uri}}/>
          <Text  style = {
            {color:photoTextColor,
              position: "absolute",
              fontSize: 30,
              fontWeight:"bold",}
            } >{InputText}</Text>
        </ViewShot>
        <TextInput  
            style={styles.input}
            onChangeText={setInputText} 
            value={InputText} 
            placeholder="Not Giriniz"
            />

        <FlatList 
          horizontal
          keyExtractor={(item)=>item}
          data = {colors}
          renderItem = {({item})=>{
            return(
              <TouchableOpacity style={{height:30,width:30,margin:5,flexDirection:"row"}} onPress={()=>{setPhotoTextColor(item)}}>
                <View style={{height:30,width:30,backgroundColor:item,borderRadius:20}}/>
              </TouchableOpacity>
            );
          }}/>

        <Text style={styles.text2}>{"ADRES"}</Text>
        <Text style={styles.text1}>{locationText[0]}</Text>
        <Text style={styles.text1}>{locationText[1]}</Text>
        <Text style={styles.text1}>{locationText[2]}</Text>
        <Text style={styles.text1}>{locationText[3]}</Text>
        <Text style={styles.text1}>{locationText[4]+" "+locationText[5]}</Text>
        <TouchableOpacity onPress={()=>{captureViewShot();}}>
          <Ionicons name="ios-share-outline" size={100} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  input: {
    height:50,
    fontSize:25,
    width:375,
    margin:10,
    borderWidth: 2,
    padding: 10,
    borderRadius:15
  },
  viewShot:{
    marginTop:5,
    height:300,
    width:300,
    justifyContent:"flex-end", 
    alignItems: "center", 
  },
  image:{
    height:300,
    width:300,
  },
  text1:{
    fontSize:20,
    color:"black"
  },
  text2:{
    fontSize:25,
    color:"black",
    fontWeight:"bold"
  }
  });

export default PhotoEditorScreen;