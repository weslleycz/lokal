import type { Plant } from "@/hooks/usePlants";
import { theme } from "@/theme";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ModalPlantDetailsProps {
  visible: boolean;
  onClose: () => void;
  plant: Plant;
}

export default function ModalPlantDetails({
  visible,
  onClose,
  plant,
}: ModalPlantDetailsProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Image
              source={{
                uri:
                  plant.image ||
                  "https://veiling.com.br/wp-content/uploads/2025/06/sam-dallas-mini-683ed87f9cc23.jpg",
              }}
              style={styles.image}
            />

            <Text style={styles.name}>{plant.name}</Text>
            <Text style={styles.detail}>Localização: {plant.location}</Text>
            <Text style={styles.detail}>Data plantada: {plant.date}</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Fechar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: theme.lightColors?.background,
    borderRadius: 15,
    padding: 15,
    maxHeight: "80%",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.lightColors?.secondary,
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    color: theme.lightColors?.grey5,
    marginBottom: 5,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: theme.lightColors?.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center", 
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
