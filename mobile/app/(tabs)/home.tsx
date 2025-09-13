import ModalCreatePlant from "@/components/ui/ModalCreatePlant";
import ModalDeletePlant from "@/components/ui/ModalDeletePlant";
import ModalEditPlant from "@/components/ui/ModalEditPlant";
import PlantCard from "@/components/ui/PlantCard";
import { Plant, usePlants } from "@/hooks/usePlants";
import { theme } from "@/theme";
import { Button } from "@rneui/base";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { plants, loading } = usePlants();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.lightColors?.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Minhas plantas</Text>

      {selectedPlant && (
        <ModalEditPlant
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          plant={selectedPlant}
        />
      )}

      {selectedPlant && (
        <ModalDeletePlant
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          plant={selectedPlant}
        />
      )}

      <Button
        title="Adicionar nova planta"
        buttonStyle={styles.addButton}
        titleStyle={styles.addButtonText}
        onPress={() => setModalVisible(true)}
      />

      <ModalCreatePlant
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            onEdit={() => {
              setSelectedPlant(item);
              setEditModalVisible(true);
            }}
            onDelete={() => {
              setSelectedPlant(item);
              setDeleteModalVisible(true);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightColors?.grey0,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.lightColors?.secondary,
  },
  addButton: {
    backgroundColor: theme.lightColors?.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.lightColors?.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
