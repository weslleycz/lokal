import React, { useState } from "react";
import { Modal, StyleSheet, View, Text } from "react-native";
import { Button } from "@rneui/base";
import { theme } from "@/theme";
import { usePlants } from "@/hooks/usePlants";
import type { Plant } from "@/hooks/usePlants";

interface ModalDeletePlantProps {
  visible: boolean;
  onClose: () => void;
  plant: Plant;
}

export default function ModalDeletePlant({
  visible,
  onClose,
  plant,
}: ModalDeletePlantProps) {
  const { deletePlant } = usePlants();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePlant(plant.id);
      onClose();
    } catch (err) {
      console.log("Erro ao deletar planta:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Deletar Planta</Text>
          <Text style={styles.message}>
            Tem certeza que deseja deletar a planta{" "}
            <Text style={styles.plantName}>{plant.name}</Text>?
          </Text>

          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              type="outline"
              buttonStyle={styles.cancelButton}
              titleStyle={{ color: theme.lightColors?.secondary }}
              onPress={onClose}
            />
            <Button
              title="Deletar"
              buttonStyle={styles.deleteButton}
              loading={loading}
              onPress={handleDelete}
            />
          </View>
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.lightColors?.secondary,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: theme.lightColors?.grey5,
    textAlign: "center",
    marginBottom: 20,
  },
  plantName: {
    fontWeight: "bold",
    color: theme.lightColors?.primary,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: theme.lightColors?.error,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
