// PetScreen.js
// npm install react-native-image-picker

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Modal, Alert } from 'react-native';
import { colors, icons } from '../constants';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { addNewPet, fetchAllPets, fetchPetByID, fetchPetCategories } from '../services/api';

const PetScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [userID, setUserID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  // State cho form nhập thú cưng
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petGender, setPetGender] = useState('Unknown');
  const [petCategory, setPetCategory] = useState(null);
  const [petImage, setPetImage] = useState(null);
  const [petDescription, setPetDescription] = useState(null);


  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userID');
        if (userId) {
          setUserID(userId);
          console.log("User ID from AsyncStorage:", userId);
        }
      } catch (error) {
        console.error('Error retrieving user info:', error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petData = await fetchAllPets();
        setPets(petData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load pets data.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetchPetCategories();
        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid category response');
        }
        setCategories(['All', ...response.map(cat => cat.CategoryName)]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchPets();
    fetchCategories();
    const interval = setInterval(fetchPets, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredPets = pets.filter(pet =>
    (selectedCategory === 'All' || pet.CategoryName === selectedCategory) &&
    pet.PetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPet = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('PetDetail', { petID: item.PetID })}>
      {item.PetImage ? (
        <Image source={{ uri: item.PetImage }} style={styles.petImage} />
      ) : (
        <View style={styles.noImageContainer}>
          {/* <Ionicons name="image-outline" size={50} color="#ccc" /> */}
          <Image source={icons.picture_outline} style={styles.imageIcon} />
          <Text style={styles.noImageText}>Không có ảnh</Text>
        </View>
      )}
      <Text style={styles.productName}>{item.PetName}</Text>
    </TouchableOpacity>
  );


  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetchPetCategories();
        setCategory(response);
      } catch (error) {
        console.error('Error retrieving user info:', error);
      }
    };

    getCategory();
  }, []);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        const imageUri = response.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setPetImage(imageUri); // Lưu ảnh để hiển thị trước khi tải lên
      }
    });
  };


  //   const handleAddPet = async () => {
  //     if (!petName || !petCategory || !userID) {
  //         Alert.alert('Error', 'Please fill in all required fields.');
  //         return;
  //     }

  //     // Additional validation can be added here
  //     if (isNaN(petAge) || petAge < 0) {
  //         Alert.alert('Error', 'Please enter a valid age.');
  //         return;
  //     }

  //     const newPet = new FormData();
  //     newPet.append('PetName', petName);
  //     newPet.append('PetAge', petAge ? parseInt(petAge) : 0);
  //     newPet.append('PetBreed', petBreed);
  //     newPet.append('PetGender', petGender);
  //     newPet.append('CategoryID', petCategory);
  //     newPet.append('UserID', userID); // Ensure this is the correct key
  //     newPet.append('PetWeight', petWeight ? parseFloat(petWeight) : 0);
  //     newPet.append('PetDescription', petDescription || '');

  //     if (petImage) {
  //         newPet.append('PetImage', {
  //             uri: petImage,
  //             type: 'image/jpeg',
  //             name: 'pet_image.jpg',
  //         });
  //     }

  //     try {
  //         const result = await addNewPet(newPet);
  //         console.log('API response:', result); // Log the response
  //         if (result.success) {
  //             Alert.alert('Success', 'Pet added successfully!');
  //             setModalVisible(false);
  //             resetFormFields();
  //         } else {
  //             Alert.alert('Error', result.message || 'Failed to add pet.');
  //         }
  //     } catch (error) {
  //         console.error('Error adding pet:', error);
  //         Alert.alert('Error', 'Failed to add pet. Please try again.');
  //     }
  // };


  const handleAddPet = async () => {
    // Kiểm tra các trường bắt buộc (bao gồm cả ảnh)
    if (!userID) {
      Alert.alert("Error", "Bạn phải đăng nhập để thêm thú cưng.");
      return;
    }
    if (!petName || !petCategory || !petImage) {
      Alert.alert("Error", "Vui lòng nhập đầy đủ thông tin và URL ảnh.");
      return;
    }

    // Tạo đối tượng mới theo cấu trúc mà API yêu cầu
    const newPet = {
      UserID: userID,
      CategoryID: petCategory,
      PetName: petName,
      PetAge: petAge ? parseInt(petAge) : 0,
      PetBreed: petBreed,
      PetGender: petGender,
      PetWeight: petWeight ? parseFloat(petWeight) : 0,
      PetDescription: petDescription || "",
      PetImage: petImage, // URL ảnh (nếu dùng image picker, hãy đảm bảo URL hợp lệ hoặc upload ảnh riêng)
    };

    try {
      const response = await addNewPet(newPet);
      console.log("API response:", response);
      if (response.success) {
        Alert.alert("Success", "Thú cưng đã được thêm thành công!");
        setModalVisible(false);
        // Reset các trường nhập liệu
        setPetName('');
        setPetAge('');
        setPetWeight('');
        setPetBreed('');
        setPetGender('Unknown');
        setPetCategory(null);
        setPetImage(null);
        setPetDescription('');
        // (Nếu cần) refresh lại danh sách thú cưng
      } else {
        Alert.alert("Error", response.message || "Thêm thú cưng thất bại.");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      Alert.alert("Error", "Thêm thú cưng thất bại. Vui lòng thử lại.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Modal thêm thú cưng */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Thú Cưng</Text>

            <TextInput
              style={styles.input}
              placeholder="Tên thú cưng"
              value={petName}
              onChangeText={setPetName}
            />
            <TextInput
              style={styles.input}
              placeholder="Tuổi thú cưng"
              keyboardType="numeric"
              value={petAge}
              onChangeText={setPetAge}
            />
            <TextInput
              style={styles.input}
              placeholder="Cân nặng"
              value={petWeight}
              onChangeText={setPetWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Giống loài"
              value={petBreed}
              onChangeText={setPetBreed}
            />
            <TextInput
              style={styles.input}
              placeholder="Mô tả"
              value={petDescription}
              onChangeText={setPetDescription}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {petImage ? (
                <Image source={{ uri: petImage }} style={styles.petImagePreview} />
              ) : (
                <Text style={styles.imageText}>Chọn ảnh</Text>
              )}
            </TouchableOpacity>
            {/* <TextInput
              style={styles.input}
              placeholder="URL ảnh thú cưng"
              value={petImage}
              onChangeText={setPetImage}
            /> */}

            <Text style={styles.label}>Giới tính:</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Unknown'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[styles.genderButton, petGender === gender && styles.selectedGender]}
                  onPress={() => setPetGender(gender)}
                >
                  <Text style={[styles.genderText, petGender === gender && styles.selectedGenderText]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Loại thú cưng:</Text>
            <ScrollView horizontal>
              {category.map(cat => (
                <TouchableOpacity
                  key={cat.CategoryID}
                  style={[styles.categoryButton, petCategory === cat.CategoryID && styles.selectedCategory]}
                  onPress={() => setPetCategory(cat.CategoryID)}
                >
                  <Text style={[styles.categoryText, petCategory === cat.CategoryID && styles.selectedCategoryText]}>
                    {cat.CategoryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
                <Text style={styles.buttonText}>Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm thú cưng..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={selectedCategory === category ? styles.selectedCategoryText : styles.categoryText}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredPets.length > 0 ? (
        <FlatList
          data={filteredPets}
          renderItem={renderPet}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={icons.sad_outline} style={styles.sadIcon} />
          <Text style={styles.emptyMessage}>Không tìm thấy thú cưng</Text>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Image source={icons.add} style={styles.addIcon} />
      </TouchableOpacity>
    </View>
  );
}

export default PetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue_light,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  searchBar: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: '#FF8C00',
  },
  categoryText: {
    color: '#555',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    // padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#aaa',
    marginTop: 5,
  },
  productName: {
    fontSize: 16,
    color: '#333',
    margin: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 18,
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF8C00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imageIcon: {
    width: 50,
    height: 50,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  sadIcon: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  selectedGender: {
    backgroundColor: '#FF8C00',
  },
  genderText: {
    color: '#555',
  },
  selectedGenderText: {
    color: '#fff',
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: '#FF8C00',
  },
  categoryText: {
    color: '#555',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF8C00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10
  },
  petImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  imageText: {
    fontSize: 16,
    color: '#666'
  }
});
