import * as Location from "expo-location";
import { useRef } from "react";
import { Image, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const ref = useRef<any>(null);

  const handlePlaceSelect = async (data: any, details: any) => {
    console.log("onPress fired - data:", data?.description, "details:", !!details);

    if (!data?.description) {
      console.error("No data description");
      return;
    }

    const address = data.description;

    // Try to use details first
    if (details?.geometry?.location) {
      console.log("Using details.geometry");
      handlePress({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address,
      });
      // Set the text in the input
      ref.current?.setAddressText(address);
      return;
    }

    // Fallback: geocode
    console.log("Geocoding:", address);
    try {
      const results = await Location.geocodeAsync(address);
      console.log("Geocode results:", results);
      if (results?.length > 0) {
        handlePress({
          latitude: results[0].latitude,
          longitude: results[0].longitude,
          address,
        });
        ref.current?.setAddressText(address);
      }
    } catch (e) {
      console.error("Geocode error:", e);
    }
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <GooglePlacesAutocomplete
        ref={ref}
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        minLength={2}
        enablePoweredByContainer={false}
        keepResultsAfterBlur={false}
        listEmptyComponent={() => null}
        predefinedPlaces={[]}
        renderDescription={(row) => row.description}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 999,
          },
          row: {
            padding: 10,
            height: "auto",
          },
          description: {
            fontSize: 14,
          },
        }}
        onPress={handlePlaceSelect}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        timeout={20000}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
