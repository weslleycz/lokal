import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { theme } from "@/theme";
import type { Plant } from "@/hooks/usePlants";
import ModalPlantDetails from "./ModalPlantDetails";
import { Button, Icon } from "@rneui/base";

interface PlantCardProps {
  plant: Plant;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PlantCard({ plant, onEdit, onDelete }: PlantCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{
            uri:
              plant.image ||
              "https://veiling.com.br/wp-content/uploads/2025/06/sam-dallas-mini-683ed87f9cc23.jpg",
          }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.detail}>{plant.location}</Text>
          <Text style={styles.detail}>{plant.date}</Text>

          <View style={styles.buttons}>
            <Button
              icon={<Icon name="edit" type="feather" size={16} color="#fff" />}
              buttonStyle={styles.editButton}
              onPress={onEdit}
            />
            <Button
              icon={
                <Icon name="trash-2" type="feather" size={16} color="#fff" />
              }
              buttonStyle={styles.deleteButton}
              onPress={onDelete}
            />
          </View>
        </View>
      </Pressable>

      <ModalPlantDetails
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plant={plant}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.lightColors?.background,
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginRight: 20,
  },
  info: { flex: 1 },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: theme.lightColors?.secondary,
  },
  detail: {
    fontSize: 14,
    color: theme.lightColors?.grey5,
    marginBottom: 2,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: theme.lightColors?.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: theme.lightColors?.error,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
