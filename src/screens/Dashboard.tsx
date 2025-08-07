import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import CleverTap from 'clevertap-react-native';

import Header from '../components/UI/Header';
import BannerCarousel from '../components/UI/BannerCarousel';
import MovieHomeScreen from '../components/MovieHomeScreen';
import {NativeDisplayCard} from '../components/NativeDisplayCard';
import ImagePlayer from '../components/UI/ImagePlayer';

const Dashboard = () => {
  const route = useRoute<any>();

  const userName = route.params?.name || 'User';
  const email = route.params?.email || '';
  const phone = route.params?.phone || '';

  const [displayUnit, setDisplayUnit] = useState<any>(null);
  const [isNativeDisplayVisible, setIsNativeDisplayVisible] = useState(false);

  useEffect(() => {
    // Track main screen view
    CleverTap.recordEvent('MainScreen Viewed', {
      Name: userName,
      Email: email,
      Phone: phone,
    });

    // Listener for Native Display
    const handleDisplayUnitsLoaded = (event: any) => {
      const units = event?.units || [];
      if (units.length > 0) {
        setDisplayUnit(units[0]);
        setIsNativeDisplayVisible(true);
      }
    };

    CleverTap.addListener('onDisplayUnitsLoaded', handleDisplayUnitsLoaded);
    CleverTap.getAllDisplayUnits((units: any) => {
      handleDisplayUnitsLoaded({units});
    });

    return () => {
      CleverTap.removeListener('onDisplayUnitsLoaded');
    };
  }, [userName, email, phone]);

  //!! ADD THIS - InApp campaign After 5 pauses by the user, trigger an In-App Campaign (create this manually on CleverTap dashboard using below criteria):Trigger Condition: Show when a video_paused event has happened 5 times in the same session.

  return (
    <>
      <ScrollView style={styles.container}>
        <Header name={userName} />
        {displayUnit && (
          <NativeDisplayCard
            visible={isNativeDisplayVisible}
            onClose={() => setIsNativeDisplayVisible(false)}
            displayUnit={displayUnit}
          />
        )}
        <BannerCarousel />
        <ImagePlayer />

        <MovieHomeScreen />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default Dashboard;
