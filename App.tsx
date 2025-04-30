import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface NewSchedule {
  title: string;
  hour: string;
  minute: string;
}

export default function App() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    title: '',
    hour: '12',
    minute: '00',
  });

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const addSchedule = () => {
    const schedule: Schedule = {
      id: Date.now().toString(),
      title: newSchedule.title,
      date: selectedDate.toISOString().split('T')[0],
      time: `${newSchedule.hour}:${newSchedule.minute}`,
    };
    setSchedules([...schedules, schedule]);
    setNewSchedule({ title: '', hour: '12', minute: '00' });
    setIsModalVisible(false);
  };

  const editSchedule = () => {
    if (!editingSchedule) return;
    
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === editingSchedule.id) {
        return {
          ...schedule,
          title: newSchedule.title,
          time: `${newSchedule.hour}:${newSchedule.minute}`,
        };
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    setEditingSchedule(null);
    setNewSchedule({ title: '', hour: '12', minute: '00' });
    setIsEditModalVisible(false);
  };

  const deleteSchedule = (id: string) => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const openEditModal = (schedule: Schedule) => {
    const [hour, minute] = schedule.time.split(':');
    setEditingSchedule(schedule);
    setNewSchedule({
      title: schedule.title,
      hour,
      minute,
    });
    setIsEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>스케줄 관리</Text>
      </View>
      
      <View style={styles.calendar}>
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <ScrollView style={styles.scheduleList}>
        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleItem}>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>{schedule.title}</Text>
              <Text style={styles.scheduleTime}>{schedule.time}</Text>
            </View>
            <View style={styles.scheduleActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(schedule)}
              >
                <Text style={styles.actionButtonText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deleteSchedule(schedule.id)}
              >
                <Text style={styles.actionButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>새 일정 추가</Text>
            
            <TextInput
              style={styles.input}
              placeholder="일정 제목"
              value={newSchedule.title}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, title: text })}
            />
            
            <View style={styles.timeContainer}>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={newSchedule.hour}
                  onChangeText={(text) => setNewSchedule({ ...newSchedule, hour: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>시</Text>
              </View>

              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={newSchedule.minute}
                  onChangeText={(text) => setNewSchedule({ ...newSchedule, minute: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>분</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button title="취소" onPress={() => setIsModalVisible(false)} />
              <Button title="추가" onPress={addSchedule} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>일정 수정</Text>
            
            <TextInput
              style={styles.input}
              placeholder="일정 제목"
              value={newSchedule.title}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, title: text })}
            />
            
            <View style={styles.timeContainer}>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={newSchedule.hour}
                  onChangeText={(text) => setNewSchedule({ ...newSchedule, hour: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>시</Text>
              </View>

              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={newSchedule.minute}
                  onChangeText={(text) => setNewSchedule({ ...newSchedule, minute: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>분</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button title="취소" onPress={() => setIsEditModalVisible(false)} />
              <Button title="저장" onPress={editSchedule} />
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  calendar: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleList: {
    flex: 1,
    padding: 10,
  },
  scheduleItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scheduleActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: 50,
    textAlign: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
  timeLabel: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
