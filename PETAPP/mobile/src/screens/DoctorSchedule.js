// DoctorSchedule.js 
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { icons, colors } from '../constants';
import { Picker } from '@react-native-picker/picker';
import {
    fetchSlotsForDoctor,
    fetchAllSlotsForDoctor,
    fetchDoctors,
    fetchPetsForUser,
    fetchPetCareServices,
    fetchScheduledForDoctor,
    fetchCompletedForDoctor,
    fetchAddSlot,
    fetchDeleteSlot,
    fetchCancelSlot,
    fetchActiveSlot,
    fetchUpdateSlot,
    fetchDoctorByUserID,
    fetchDeleteAppointment,
    fetchApproveAppointment,
    fetchCancelledAppointment
} from '../services/api';

const DoctorScheduleScreen = () => {
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [userID, setUserID] = useState(null);
    const [activeTab, setActiveTab] = useState('Scheduled');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Dữ liệu cho lịch slot mới khi thêm
    const [newSlot, setNewSlot] = useState({
        doctorID: '',
        slotStart: '',
        slotEnd: '',
        isVailable: true,
    });

    // Danh sách cho các dropdown
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState(null);
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
            const data = await fetchScheduledForDoctor(userID);
            setAppointments(data);

            const interval = setInterval(fetchScheduledForDoctor, 5000);
            return () => clearInterval(interval);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải lịch hẹn');
        }
    };


    // Load lại lịch hẹn theo activeTab, poll mỗi 5 giây
    // useEffect(() => {
    //     const fetchAppointmentsInterval = async () => {
    //         if (userID) {
    //             try {
    //                 let data = [];
    //                 if (activeTab === 'Scheduled') {
    //                     data = await fetchScheduledForDoctor(userID);
    //                 } else if (activeTab === 'Completed') {
    //                     data = await fetchCompletedForDoctor(userID);
    //                 } else if (activeTab === 'List Slots') {
    //                     data = await fetchAllSlotsForDoctor(doctor?.DoctorID);
    //                 }
    //                 setAppointments(data);
    //             } catch (error) {
    //                 console.error('Error fetching appointments:', error);
    //                 Alert.alert('Lỗi', 'Không thể tải lịch hẹn.');
    //             }
    //         }
    //     };

    //     fetchAppointmentsInterval();
    //     const interval = setInterval(fetchAppointmentsInterval, 5000);
    //     return () => clearInterval(interval);
    // }, [userID, activeTab]);

    useEffect(() => {
        const fetchAppointmentsInterval = async () => {
            if (userID) {
                try {
                    let data = [];
                    if (activeTab === 'Scheduled') {
                        data = await fetchScheduledForDoctor(userID);
                        setAppointments(data);
                    } else if (activeTab === 'Completed') {
                        data = await fetchCompletedForDoctor(userID);
                        setAppointments(data);
                    } else if (activeTab === 'List Slots') {
                        const slotsData = await fetchAllSlotsForDoctor(doctor?.DoctorID);
                        setAvailableSlots(slotsData);
                    }
                } catch (error) {
                    console.error('Error fetching appointments:', error);
                    Alert.alert('Lỗi', 'Không thể tải dữ liệu.');
                }
            }
        };

        fetchAppointmentsInterval();
        const interval = setInterval(fetchAppointmentsInterval, 5000);
        return () => clearInterval(interval);
    }, [userID, activeTab, doctor]);


    // Lấy userID từ AsyncStorage và load danh sách thú cưng của user đó
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

    // Get Doctor Data By UserID
    useEffect(() => {
        const getDoctorDetails = async () => {
            if (!userID) {
                setError("User ID is missing");
                //setLoading(false);
                return;
            }
            try {
                //setLoading(true);
                console.log("Fetching doctor with userId:", userID); // Kiểm tra userID
                const response = await fetchDoctorByUserID(userID);
                console.log("API Response:", response); // Kiểm tra response từ API
                if (response) {
                    setDoctor(response);
                } else {
                    setError("Doctor not found");
                }
            } catch (err) {
                console.error("API Error:", err); // Xem chi tiết lỗi nếu có
                setError("Failed to load doctor details");
            }
        };

        getDoctorDetails();
    }, [userID]);


    // Khi bấm Edit, nếu trạng thái là Completed hoặc Cancelled thì không cho chỉnh sửa
    // const handleEdit = (appointment) => {
    //     if (appointment.Status === 'Completed' || appointment.Status === 'Cancelled') {
    //         Alert.alert('Cannot Edit', 'You cannot edit appointments in the Completed or Cancelled status.');
    //         return;
    //     }
    //     setSelectedAppointment(appointment);
    //     setIsEditing(true);
    // };


    // Hàm lưu (add mới hoặc update) lịch hẹn
    const handleSave = async () => {
        if (!newSlot.doctorID || !newSlot.slotStart || !newSlot.slotEnd) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        try {
            const response = await fetchAddSlot(newSlot);
            Alert.alert('Success', 'Slot has been added!');
            setSlots([...slots, response]);
            setIsAdding(false);
        } catch (error) {
            Alert.alert('Error', `Unable to add slot: ${error.message}`);
        }
    };

    const handleAdd = () => {
        setNewSlot({
            doctorID: doctor?.DoctorID || '',
            slotStart: new Date(),
            slotEnd: new Date(),
            isAvailable: true,
        });
        setIsAdding(true);
    };

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

    const handleApprove = (ScheduleID) => {
        Alert.alert(
            'Confirm Approval',
            'Are you sure you want to approve this appointment?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await fetchApproveAppointment(ScheduleID);
                            Alert.alert('Success', 'Appointment marked as Completed');
                            loadAppointments(); // Reload lại danh sách sau khi cập nhật
                        } catch (error) {
                            Alert.alert('Error', 'Unable to approve appointment');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Function to handle deleting a slot
    const handleDeleteSlot = async (slotID) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this slot?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await fetchDeleteSlot(slotID, doctor?.DoctorID);
                            setSlots(slots.filter(slot => slot.SlotID !== slotID));
                            Alert.alert('Success', 'Slot has been deleted');
                        } catch (error) {
                            Alert.alert('Error', 'Unable to delete slot');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Function to handle updating a slot (you can implement this based on your requirements)
    // Hàm mở modal cập nhật với thông tin slot cần sửa
    const handleUpdateSlot = (slot) => {
        setSelectedSlot(slot);
        setNewSlot({
            ...slot,
            slotID: slot.SlotID,
            doctorID: doctor?.DoctorID,
            slotStart: new Date(slot.SlotStart),
            slotEnd: new Date(slot.SlotEnd),
        });
        setIsUpdate(true);
    };

    // Hàm lưu thay đổi slot
    const handleSaveUpdate = async () => {
        if (!newSlot.slotStart || !newSlot.slotEnd) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        try {
            await fetchUpdateSlot(newSlot);
            Alert.alert('Success', 'Slot has been updated!');
            setIsUpdate(false);
            const updatedSlots = await fetchAllSlotsForDoctor(doctor?.DoctorID);
            setAvailableSlots(updatedSlots);
        } catch (error) {
            Alert.alert('Error', `Unable to update slot: ${error.message}`);
        }
    };

    // Function to handle cancelling a slot
    const handleCancelSlot = (slotID) => {
        Alert.alert(
            'Confirm Cancelation',
            'Are you sure you want to unvaliable this slot?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await fetchCancelSlot(slotID, doctor?.DoctorID);
                            setSlots(slots.filter(slot => slot.SlotID !== slotID));
                            Alert.alert('Success', 'Slot has been unvaliable');
                        } catch (error) {
                            Alert.alert('Error', 'Unable to unvaliable slot');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    // Function to handle cancelling a slot
    const handleActive = (slotID) => {
        Alert.alert(
            'Confirm Active',
            'Are you sure you want to active this slot?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await fetchActiveSlot(slotID, doctor?.DoctorID);
                            setSlots(slots.filter(slot => slot.SlotID !== slotID));
                            Alert.alert('Success', 'Slot has been available');
                        } catch (error) {
                            Alert.alert('Error', 'Unable to available slot');
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
                {['Scheduled', 'Completed', 'List Slots'].map((tab) => (
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
                {activeTab === 'List Slots' ? (
                    availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                            <View key={slot.SlotID} style={styles.slotCard}>
                                <Text style={styles.slotInfo}>
                                    {`Slot Start: ${new Date(slot.SlotStart).toLocaleString()}`}
                                </Text>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: colors.inactive }}></View>
                                <Text style={styles.slotInfo}>
                                    {`Slot End: ${new Date(slot.SlotEnd).toLocaleString()}`}
                                </Text>
                                <Text style={styles.slotInfo}>
                                    {`Status: ${slot.IsAvailable ? 'Available' : 'UnAvailable'}`}
                                </Text>
                                <View style={styles.buttonSlotContainer}>
                                    <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateSlot(slot)}>
                                        <Text style={styles.buttonText}>UPDATE</Text>
                                    </TouchableOpacity>
                                    {slot.IsAvailable ? (
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => handleCancelSlot(slot.SlotID)}
                                        >
                                            <Text style={styles.buttonText}>CANCEL</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.activeButton} // Thêm style cho nút Active nếu cần
                                            onPress={() => handleActive(slot.SlotID)}
                                        >
                                            <Text style={styles.buttonText}>ACTIVE</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSlot(slot.SlotID)}>
                                        <Text style={styles.buttonText}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyMessage}>No slots found.</Text>
                    )
                ) : (
                    filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <TouchableOpacity
                                key={appointment.ScheduleID}
                                style={[styles.card, activeTab !== 'Scheduled' && styles.disabledCard]}
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

                                    {appointment.Status === 'Scheduled' && (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(appointment.ScheduleID)}>
                                                <Text style={styles.buttonText}>Approve</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() =>
                                            activeTab === 'Scheduled'
                                                ? handleCancel(appointment.ScheduleID)
                                                : handleDelete(appointment.ScheduleID)
                                        }
                                    >
                                        <Image source={activeTab === 'Scheduled' ? '' : icons.delete} style={styles.deleteIcon} />
                                    </TouchableOpacity>

                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.emptyMessage}>No appointments found.</Text>
                    )
                )}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => handleAdd()}>
                <Image source={icons.cat} style={styles.deleteIcon} />
            </TouchableOpacity>

            {/* // Modal cập nhật slot */}
            {isUpdate && (
                <Modal visible={isUpdate} animationType="slide" transparent={true}>
                    <View style={styles.modalSlotContainer}>
                        <View style={styles.modalSlotContent}>
                            <Text style={styles.modalSlotTitle}>Update Slot</Text>
                            <Text>Start Time:</Text>
                            <TextInput
                                style={styles.inputSlot}
                                placeholder="YYYY-MM-DD HH:MM"
                                value={newSlot.slotStart || ''}
                                onChangeText={(text) => setNewSlot({ ...newSlot, slotStart: text })}
                            />
                            <Text>End Time:</Text>
                            <TextInput
                                style={styles.inputSlot}
                                placeholder="YYYY-MM-DD HH:MM"
                                value={newSlot.slotEnd || ''}
                                onChangeText={(text) => setNewSlot({ ...newSlot, slotEnd: text })}
                            />
                            <View style={styles.modalSlotButtons}>
                                <TouchableOpacity style={styles.buttonSlotSave} onPress={handleSaveUpdate}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonSlotCancel} onPress={() => setIsUpdate(false)}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Modal Add New Slot */}
            {isAdding && (
                <Modal
                    visible={isAdding}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsAdding(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Slot</Text>
                            {/* <Text style={styles.label}>Select Doctor:</Text>
                            <Picker
                                selectedValue={newSlot.doctorID}
                                onValueChange={onDoctorChange}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Doctor" value="" />
                                {doctors.map(doctor => (
                                    <Picker.Item key={doctor.DoctorID} label={doctor.FullName} value={doctor.DoctorID} />
                                ))}
                            </Picker> */}
                            <Text style={styles.label}>Select Start Time:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD HH:MM"
                                value={newSlot.slotStart}
                                onChangeText={(text) => setNewSlot({ ...newSlot, slotStart: text })}
                            />
                            <Text style={styles.label}>Select End Time:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD HH:MM"
                                value={newSlot.slotEnd}
                                onChangeText={(text) => setNewSlot({ ...newSlot, slotEnd: text })}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Add Slot</Text>
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

export default DoctorScheduleScreen;

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
    approveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    slotCard: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 5,
    },
    slotInfo: {
        fontSize: 16,
        marginBottom: 5,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 50,
        marginTop: 150,
    },
    buttonSlotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    updateButton: {
        backgroundColor: colors.background_color,
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: colors.inactive,
        padding: 10,
        borderRadius: 5,
    },
    activeButton: {
        backgroundColor: '#4CAF50', // Màu xanh lá cây để phân biệt
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: colors.alert,
        padding: 10,
        borderRadius: 5,
    },
    modalSlotContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalSlotContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalSlotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputSlot: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    modalSlotButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonSlotSave: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    buttonSlotCancel: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonSlotText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
