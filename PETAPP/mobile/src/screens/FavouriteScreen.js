// FavouriteScreen.js 
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, icons } from '../constants';
import {
  fetchGetFavouritesByDoctor,
  fetchGetFavouritesByPet,
  fetchGetFavouritesByService,
} from '../services/api';

const categories = ['❤️ Doctor', '❤️ Service', '❤️ Pet'];

const FavouriteScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('❤️ Doctor');
  const [userID, setUserID] = useState(null);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userID');
        if (userId) setUserID(userId);
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };
    getUserId();
  }, []);

  const fetchData = useCallback(async () => {
    if (userID) {
      try {
        let data = [];
        if (activeTab === '❤️ Doctor') {
          data = await fetchGetFavouritesByDoctor(userID);
        } else if (activeTab === '❤️ Service') {
          data = await fetchGetFavouritesByService(userID);
        } else if (activeTab === '❤️ Pet') {
          data = await fetchGetFavouritesByPet(userID);
        }
        setFavourites(data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
      }
    }
  }, [userID, activeTab]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const renderCategory = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, activeTab === category && styles.selectedCategoryButton]}
            onPress={() => setActiveTab(category)}
          >
            <Text style={activeTab === category ? styles.selectedCategoryText : styles.categoryText}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderItem = ({ item }) => {
    if (activeTab === '❤️ Doctor') {
      return (
        <View style={styles.card}>
          <Image source={{ uri: item.Avatar }} style={styles.image} />
          <TouchableOpacity style={styles.favoriteIcon}>
            {/* <Image source={icons.heart} style={{ width: 20, height: 20 }} /> */}
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.DoctorName}</Text>
            <Text style={styles.subText}>{item.Specialty}</Text>
            <Text style={styles.ingredientText}>{item.Experience} years experience</Text>
            <Text style={styles.rating}>{item.AverageRating} ⭐</Text>
          </View>
        </View>
      );
    } else if (activeTab === '❤️ Service') {
      return (
        <View style={styles.card}>
          <Image source={{ uri: item.Url }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.ServiceName}</Text>
            <Text style={styles.subText}>{item.ServiceCategory}</Text>
            <Text style={styles.ingredientText}>Doctor: {item.DoctorName}</Text>
            <Text style={styles.rating}>Cost: {item.Cost} $</Text>
            <Text style={styles.rating}>{item.AverageRating} ⭐</Text>
          </View>
        </View>
      );
    } else if (activeTab === '❤️ Pet') {
      return (
        <View style={styles.card}>
          <Image source={{ uri: item.PetImage }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.PetName}</Text>
            <Text style={styles.subText}>Breed: {item.PetBreed}</Text>
            <Text style={styles.subText}>Age: {item.PetAge}</Text>
            <Text style={styles.ingredientText}>Gender: {item.PetGender}</Text>
            <Text style={styles.rating}>Weight: {item.PetWeight} kg</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={icons.back} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favourites</Text>
        </View>
        {renderCategory()}
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.FavouriteID}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.flatListCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === '❤️ Doctor' && 'No favourite doctors found.'}
              {activeTab === '❤️ Service' && 'No favourite services found.'}
              {activeTab === '❤️ Pet' && 'No favourite pets found.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContent: {
    paddingHorizontal: 20,
    height: 130,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#000',
  },
  categoryText: {
    color: '#555',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  flatListCard: {
    marginHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  ingredientText: {
    fontSize: 14,
    color: '#ff9f43',
  },
  rating: {
    fontSize: 16,
    color: '#f1c40f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
});
