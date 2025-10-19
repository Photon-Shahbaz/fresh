import { isDriver } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
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

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (isLoading) {
    // You can add a loading component here if needed
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  // For now, both users and drivers go to the same home page
  // You can change this to redirect drivers to a different page later
  return <Redirect href="/(root)/(tabs)/home" />;
};

export default Page;
