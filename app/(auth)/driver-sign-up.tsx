import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import DriverOAuth from "@/components/DriverOAuth";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const DriverSignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    carSeats: "",
    profileImageUrl: "",
    carImageUrl: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        try {
          await fetchAPI("/(api)/driver", {
            method: "POST",
            body: JSON.stringify({
              first_name: form.firstName,
              last_name: form.lastName,
              clerkId: completeSignUp.createdUserId,
              car_seats: form.carSeats,
              profile_image_url: form.profileImageUrl,
              car_image_url: form.carImageUrl,
            }),
          });
          await setActive({ session: completeSignUp.createdSessionId });
          
          // Driver role is determined by which table they're stored in
          // Drivers are stored in the 'drivers' table
          
          setVerification({
            ...verification,
            state: "success",
          });
        } catch (apiError: any) {
          if (apiError.message?.includes("409") || apiError.message?.includes("already exists")) {
            Alert.alert("Driver Already Exists", "You are already registered as a driver with this account.");
            await setActive({ session: completeSignUp.createdSessionId });
            router.replace("/(root)/(tabs)/home");
          } else {
            throw apiError;
          }
        }
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Become a Driver
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="First Name"
            placeholder="Enter first name"
            icon={icons.person}
            value={form.firstName}
            onChangeText={(value) => setForm({ ...form, firstName: value })}
          />
          <InputField
            label="Last Name"
            placeholder="Enter last name"
            icon={icons.person}
            value={form.lastName}
            onChangeText={(value) => setForm({ ...form, lastName: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <InputField
            label="Car Seats"
            placeholder="Enter number of seats"
            icon={icons.person}
            keyboardType="numeric"
            value={form.carSeats}
            onChangeText={(value) => setForm({ ...form, carSeats: value })}
          />
          <InputField
            label="Profile Image URL (Optional)"
            placeholder="Enter profile image URL"
            icon={icons.person}
            value={form.profileImageUrl}
            onChangeText={(value) => setForm({ ...form, profileImageUrl: value })}
          />
          <InputField
            label="Car Image URL (Optional)"
            placeholder="Enter car image URL"
            icon={icons.person}
            value={form.carImageUrl}
            onChangeText={(value) => setForm({ ...form, carImageUrl: value })}
          />
          <CustomButton
            title="Sign Up as Driver"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <DriverOAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Driver registered
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully registered as a driver.
            </Text>
            <CustomButton
              title="Start driving"
              onPress={() => router.push(`/(root)/driver-mode`)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default DriverSignUp;
