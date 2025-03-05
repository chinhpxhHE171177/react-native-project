// ScheduleScreen.js
import React, { useState, useEffect, useId } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { icons, colors } from '../constants';
import { Picker } from '@react-native-picker/picker';
import {
  fetchScheduled,
  fetchCancelled,
  fetchCompleted,
  fetchSlotsForDoctor,
  fetchAddAppointment,
  fetchUpdateAppointment,
  fetchCancelledAppointment,
  fetchDeleteAppointment,
  fetchDoctors,
  fetchPetsForUser,
  fetchPetCareServices,
  fetchScheduledForUser,
  fetchCompletedForUser,
  fetchCancelledForUSer,
} from '../services/api';

const ScheduleScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [userID, setUserID] = useState(null);
  const [activeTab, setActiveTab] = useState('Scheduled');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Dữ liệu cho lịch hẹn mới khi thêm
  const [newAppointment, setNewAppointment] = useState({
    doctorID: '',
    customerID: '',
    petID: '',
    serviceID: '',
    appointmentStart: '',
    appointmentEnd: '',
    slotID: ''
  });

  // Danh sách cho các dropdown
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Hàm định dạng datetime
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Khi component mount, load danh sách lịch hẹn, bác sĩ và dịch vụ
  useEffect(() => {
    loadAppointments();
    fetchDoctors()
      .then(data => setDoctors(data))
      .catch(err => Alert.alert('Error', 'Unable to fetch doctors'));
    fetchPetCareServices()
      .then(data => setServices(data))
      .catch(err => Alert.alert('Error', 'Unable to fetch services'));
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await fetchScheduledForUser(userID);
      setAppointments(data);

      const interval = setInterval(fetchScheduledForUser, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch hẹn');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userID) {
        try {
          let data = [];
          if (activeTab === 'Scheduled') {
            data = await fetchScheduledForUser(userID);
          } else if (activeTab === 'Completed') {
            data = await fetchCompletedForUser(userID);
          } else if (activeTab === 'Canceled') {
            data = await fetchCancelledForUSer(userID);
          }
          setAppointments(data);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          Alert.alert('Lỗi', 'Không thể tải lịch hẹn.');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [userID, activeTab]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userID');
        if (userId) {
          setUserID(userId);
          fetchPetsForUser(userId)
            .then(data => setPets(data))
            .catch(err => Alert.alert('Error', 'Unable to fetch pets'));
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };
    getUserId();
  }, []);


  // Khi bấm Edit, nếu trạng thái là Completed hoặc Cancelled thì không cho chỉnh sửa
  const handleEdit = (appointment) => {
    if (appointment.Status === 'Completed' || appointment.Status === 'Cancelled') {
      Alert.alert('Cannot Edit', 'You cannot edit appointments in the Completed or Cancelled status.');
      return;
    }
    setSelectedAppointment(appointment);
    setIsEditing(true);
  };

  // Khi bấm Add, khởi tạo newAppointment với customerID tự động từ state userID
  const handleAdd = () => {
    setNewAppointment({
      doctorID: '',
      customerID: userID,
      petID: '',
      serviceID: '',
      appointmentStart: '',
      appointmentEnd: '',
      slotID: ''
    });
    setIsAdding(true);
  };

  // Khi chọn bác sĩ trong form thêm, cập nhật newAppointment và load slot của bác sĩ đó
  const onDoctorChange = (doctorID) => {
    setNewAppointment({ ...newAppointment, doctorID, slotID: '', appointmentStart: '', appointmentEnd: '' });
    fetchSlotsForDoctor(doctorID)
      .then(data => setAvailableSlots(data))
      .catch(err => {
        Alert.alert('Error', 'Unable to fetch available slots');
        setAvailableSlots([]);
      });
  };

  // Tương tự, khi chọn bác sĩ trong form edit, cập nhật selectedAppointment và load slot của bác sĩ đó
  const onEditDoctorChange = (doctorID) => {
    setSelectedAppointment({ ...selectedAppointment, DoctorID: doctorID, slotID: '', AppointmentStart: '', AppointmentEnd: '' });
    fetchSlotsForDoctor(doctorID)
      .then(data => setAvailableSlots(data))
      .catch(err => {
        Alert.alert('Error', 'Unable to fetch available slots');
        setAvailableSlots([]);
      });
  };

  // Hàm lưu (add mới hoặc update) lịch hẹn
  const handleSave = async () => {
    if (isAdding) {
      // Kiểm tra các trường bắt buộc cho lịch hẹn mới
      if (
        !newAppointment.doctorID ||
        !newAppointment.petID ||
        !newAppointment.serviceID ||
        !newAppointment.appointmentStart ||
        !newAppointment.appointmentEnd
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      try {
        const response = await fetchAddAppointment(newAppointment);
        Alert.alert('Success', 'Appointment has been added!');
        setAppointments([...appointments, response]);
        setIsAdding(false);
      } catch (error) {
        Alert.alert('Error', `Unable to add appointment: ${error.message}`);
      }
    } else if (isEditing && selectedAppointment) {
      // Kiểm tra các trường bắt buộc cho cập nhật
      if (
        !selectedAppointment.DoctorID ||
        !selectedAppointment.PetID ||
        !selectedAppointment.ServiceID ||
        !selectedAppointment.AppointmentStart ||
        !selectedAppointment.AppointmentEnd
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      // Chuẩn bị payload theo định dạng của API
      const payload = {
        doctorID: selectedAppointment.DoctorID,
        customerID: userID, // Hoặc bạn có thể dùng selectedAppointment.CustomerID nếu đã có
        petID: selectedAppointment.PetID,
        serviceID: selectedAppointment.ServiceID,
        appointmentStart: selectedAppointment.AppointmentStart,
        appointmentEnd: selectedAppointment.AppointmentEnd,
      };
      try {
        console.log("Payload for update:", payload);
        const response = await fetchUpdateAppointment(selectedAppointment.ScheduleID, payload);
        const updatedAppointment = { ...response, ScheduleID: selectedAppointment.ScheduleID };
        Alert.alert('Success', 'Appointment has been updated!');
        setAppointments(
          appointments.map((appt) =>
            appt.ScheduleID === selectedAppointment.ScheduleID ? updatedAppointment : appt
          )
        );
        setIsEditing(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error("Update error:", error);
        Alert.alert('Error', `Unable to update appointment: ${error?.message || JSON.stringify(error)}`);
      }
    }
  };

  // const handleCancel = async (ScheduleID) => {
  //   try {
  //     await fetchCancelledAppointment(ScheduleID);
  //     Alert.alert('Success', 'Appointment has been cancelled');
  //     setAppointments(appointments.filter(appt => appt.ScheduleID !== ScheduleID));
  //   } catch (error) {
  //     Alert.alert('Error', 'Unable to cancel appointment');
  //   }
  // };

  const handleCancel = (ScheduleID) => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await fetchCancelledAppointment(ScheduleID);
              Alert.alert('Success', 'Appointment has been cancelled');
              setAppointments(appointments.filter(appt => appt.ScheduleID !== ScheduleID));
            } catch (error) {
              Alert.alert('Error', 'Unable to cancel appointment');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = (ScheduleID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await fetchDeleteAppointment(ScheduleID); // Giả sử bạn có API xóa
              Alert.alert('Success', 'Appointment has been deleted');
              setAppointments(appointments.filter(appt => appt.ScheduleID !== ScheduleID));
            } catch (error) {
              Alert.alert('Error', 'Unable to delete appointment');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  const filteredAppointments = appointments;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{activeTab}</Text>

      <View style={styles.tabContainer}>
        {['Scheduled', 'Completed', 'Canceled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.appointmentList}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.ScheduleID}
              style={[styles.card, activeTab !== 'Scheduled' && styles.disabledCard]}
              onPress={() => handleEdit(appointment)}
              disabled={activeTab !== 'Scheduled'}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Appointment No: {appointment.ScheduleID}</Text>
                  <Text style={styles.doctorName}>DoctorName: {appointment.DoctorName}</Text>
                  <Text style={styles.doctorName}>Pet: {appointment.PetName}</Text>
                  <Text style={styles.doctorName}>Owner: {appointment.CustomerName}</Text>
                  <Text style={styles.doctorName}>Service: {appointment.ServiceName}</Text>
                  <Text style={styles.doctorName}>Date and time: </Text>
                  <Text style={styles.appointmentInfo}>{formatDate(appointment.AppointmentStart)}</Text>
                  <Text style={styles.appointmentInfo}>to</Text>
                  <Text style={styles.appointmentInfo}>{formatDate(appointment.AppointmentEnd)}</Text>
                  <Text style={styles.appointmentInfo}>Status: {appointment.Status}</Text>
                </View>
                {/* <TouchableOpacity onPress={() => handleCancel(appointment.ScheduleID)}>
                  <Image source={icons.delete} style={styles.deleteIcon} />
                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() =>
                    activeTab === 'Scheduled'
                      ? handleCancel(appointment.ScheduleID)
                      : handleDelete(appointment.ScheduleID)
                  }
                >
                  <Image source={icons.delete} style={styles.deleteIcon} />
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No appointments found.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => handleAdd()}>
        <Image source={icons.cat} style={styles.deleteIcon} />
      </TouchableOpacity>

      {/* Modal Edit / Detail Appointment */}
      {selectedAppointment && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setSelectedAppointment(null);
            setIsEditing(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Schedule' : 'Detail Schedule'}</Text>
              {isEditing ? (
                <>
                  {/* Picker chọn bác sĩ */}
                  <Text style={styles.label}>Select Doctor:</Text>
                  <Picker
                    selectedValue={selectedAppointment.DoctorID}
                    onValueChange={(value) => onEditDoctorChange(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Doctor" value="" />
                    {doctors.map((doctor) => (
                      <Picker.Item
                        key={doctor.DoctorID}
                        label={doctor.FullName}
                        value={doctor.DoctorID}
                      />
                    ))}
                  </Picker>

                  {/* Picker chọn thú cưng */}
                  <Text style={styles.label}>Select Pet:</Text>
                  <Picker
                    selectedValue={selectedAppointment.PetID}
                    onValueChange={(value) =>
                      setSelectedAppointment({ ...selectedAppointment, PetID: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Pet" value="" />
                    {pets.map((pet) => (
                      <Picker.Item key={pet.PetID} label={pet.PetName} value={pet.PetID} />
                    ))}
                  </Picker>

                  {/* Picker chọn dịch vụ */}
                  <Text style={styles.label}>Select Service:</Text>
                  <Picker
                    selectedValue={selectedAppointment.ServiceID}
                    onValueChange={(value) =>
                      setSelectedAppointment({ ...selectedAppointment, ServiceID: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Service" value="" />
                    {services
                      .filter((service) => service.DoctorID === selectedAppointment.DoctorID)
                      .map((service) => (
                        <Picker.Item
                          key={service.ServiceID}
                          label={service.ServiceName}
                          value={service.ServiceID}
                        />
                      ))}
                  </Picker>

                  {/* Picker chọn Slot thời gian */}
                  <Text style={styles.label}>Select Time Slot:</Text>
                  <Picker
                    selectedValue={selectedAppointment.slotID}
                    onValueChange={(value) => {
                      const selectedSlot = availableSlots.find((slot) => slot.SlotID === value);
                      if (selectedSlot) {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          slotID: value,
                          AppointmentStart: selectedSlot.SlotStart,
                          AppointmentEnd: selectedSlot.SlotEnd,
                        });
                      }
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Time Slot" value="" />
                    {availableSlots.map((slot) => (
                      <Picker.Item
                        key={slot.SlotID}
                        label={`${formatDate(slot.SlotStart)} - ${formatDate(slot.SlotEnd)}`}
                        value={slot.SlotID}
                      />
                    ))}
                  </Picker>
                </>
              ) : (
                <>
                  <Text style={styles.detailText}>Doctor: {selectedAppointment.DoctorName}</Text>
                  <Text style={styles.detailText}>Pet: {selectedAppointment.PetName}</Text>
                  <Text style={styles.detailText}>Owner: {selectedAppointment.CustomerName}</Text>
                  <Text style={styles.detailText}>Service: {selectedAppointment.ServiceName}</Text>
                  <Text style={styles.detailText}>Start: {formatDate(selectedAppointment.AppointmentStart)}</Text>
                  <Text style={styles.detailText}>End: {formatDate(selectedAppointment.AppointmentEnd)}</Text>
                </>
              )}

              <View style={styles.buttonRow}>
                {isEditing && (
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                )}
                {!isEditing && (
                  <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setSelectedAppointment(null);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal Add New Appointment */}
      {isAdding && (
        <Modal
          visible={isAdding}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsAdding(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>😺 Book an Appointment 🐶</Text>
              <Text style={styles.modalSubTitle}>Please fill out the form below to make an appointment</Text>
              <Text style={styles.label}>Select Doctor:</Text>
              <Picker
                selectedValue={newAppointment.doctorID}
                onValueChange={(value) => onDoctorChange(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Doctor" value="" />
                {doctors.map(doctor => (
                  <Picker.Item key={doctor.DoctorID} label={doctor.FullName} value={doctor.DoctorID} />
                ))}
              </Picker>
              <Text style={styles.label}>Select Pet:</Text>
              <Picker
                selectedValue={newAppointment.petID}
                onValueChange={(value) => setNewAppointment({ ...newAppointment, petID: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select Pet" value="" />
                {pets.map(pet => (
                  <Picker.Item key={pet.PetID} label={pet.PetName} value={pet.PetID} />
                ))}
              </Picker>
              <Text style={styles.label}>Select Service:</Text>
              <Picker
                selectedValue={newAppointment.serviceID}
                onValueChange={(value) => setNewAppointment({ ...newAppointment, serviceID: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select Service" value="" />
                {services.map(service => (
                  <Picker.Item key={service.ServiceID} label={service.ServiceName} value={service.ServiceID} />
                ))}
              </Picker>
              <Text style={styles.label}>Select Time Slot:</Text>
              <Picker
                selectedValue={newAppointment.slotID}
                onValueChange={(value) => {
                  const selectedSlot = availableSlots.find(slot => slot.SlotID === value);
                  if (selectedSlot) {
                    setNewAppointment({
                      ...newAppointment,
                      slotID: value,
                      appointmentStart: selectedSlot.SlotStart,
                      appointmentEnd: selectedSlot.SlotEnd
                    });
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Time Slot" value="" />
                {availableSlots.map(slot => (
                  <Picker.Item
                    key={slot.SlotID}
                    label={`${formatDate(slot.SlotStart)} - ${formatDate(slot.SlotEnd)}`}
                    value={slot.SlotID}
                  />
                ))}
              </Picker>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsAdding(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6'
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#1E3A8A',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E5E7EB'
  },
  activeTabButton: {
    backgroundColor: '#2563EB'
  },
  tabText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600'
  },
  activeTabText: {
    color: '#FFFFFF'
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10
  },
  appointmentList: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: colors.blue_border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937'
  },
  appointmentInfo: {
    fontSize: 14,
    color: '#6B7280'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalSubTitle: {
    fontSize: 12,
    color: colors.inactive,
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#374151'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600'
  },
  picker: {
    width: 250,
    height: 50,
    marginBottom: 10
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: '#F59E0B',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  },
  closeButton: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  deleteIcon: {
    width: 20,
    height: 20
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20
  },
  disabledCard: {
    backgroundColor: colors.blue_border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5
  },
});
