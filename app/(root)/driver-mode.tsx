import * as Location from "expo-location";
import { useEffect } from "react";
import { Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import InputField from "@/components/InputField";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

export default function DriverMode() {
  const {
    userLatitude,
    userLongitude,
    userAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  useEffect(() => {
    (async () => {
      if (userLatitude && userLongitude) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0]?.name ?? "Current"}, ${address[0]?.region ?? ""}`,
      });
    })();
  }, [userLatitude, userLongitude, setUserLocation]);

  return (
    <RideLayout title="Driver Mode">
      <View className="flex-1">
        <View className="my-3">
          <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
          <InputField
            label=""
            icon={icons.target}
            value={userAddress ?? "Getting location..."}
            editable={false}
            containerStyle="bg-neutral-100"
            inputStyle="text-neutral-400"
          />
        </View>

        <View className="my-3">
          <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
          <GoogleTextInput
            icon={icons.map}
            initialLocation="Where would you like to go?"
            containerStyle="bg-neutral-100"
            textInputBackgroundColor="transparent"
            handlePress={(location) => setDestinationLocation(location)}
          />
        </View>

        <CustomButton
          title="Start driving and find ride"
          onPress={() => {
            // Placeholder: later wire to matching flow
          }}
          className="mt-5"
        />
      </View>
    </RideLayout>
  );
}
