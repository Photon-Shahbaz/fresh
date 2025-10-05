import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { SwiperFlatList } from 'react-native-swiper-flatlist';


import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";


const Home = () => {
  // 🟨 CHANGED: ref type is SwiperFlatList
  const swiperRef = useRef<SwiperFlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      {/* Skip button */}
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      {/* 🟨 CHANGED: SwiperFlatList replaces Swiper */}
      <SwiperFlatList
        ref={swiperRef}
        data={onboarding} // 🟨 CHANGED: data prop instead of children map
        horizontal
        showPagination // 🟨 CHANGED: built-in pagination
        paginationStyleItem={{  // 🟨 CHANGED: dot styling
          width: 32,
          height: 4,
          borderRadius: 9999,
          marginHorizontal: 4,
        }}
        paginationActiveColor="#0286FF"   // 🟨 CHANGED
        paginationDefaultColor="#E2E8F0"  // 🟨 CHANGED
        onChangeIndex={({ index }) => setActiveIndex(index)} // 🟨 CHANGED: SwiperFlatList uses object param
        renderItem={({ item }) => ( // 🟨 CHANGED: renderItem instead of mapping children
          <View key={item.id} className="flex items-center justify-center p-5 w-full">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Next / Get Started */}
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() => {
          if (isLastSlide) {
            router.replace("/(auth)/sign-up");
          } else {
            // 🟨 CHANGED: scrollToIndex replaces scrollBy
            swiperRef.current?.scrollToIndex({
              index: activeIndex + 1,
              animated: true,
            });
          }
        }}
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Home;