import { isDriver } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import 'react-native-get-random-values';

const Page = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isDriverUser, setIsDriverUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && user) {
        setIsLoading(true);
        try {
          const driverStatus = await isDriver(user);
          setIsDriverUser(driverStatus);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsDriverUser(false); // Default to user if error
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUserRole();
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (isDriverUser === null) return;
    if (isDriverUser) {
      router.replace("/(root)/driver-mode" as any);
    } else {
      router.replace("/(root)/(tabs)/home");
    }
  }, [isSignedIn, isDriverUser]);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Render nothing while redirecting
  return null;
};

export default Page;
