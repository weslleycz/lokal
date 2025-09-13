import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View, Text } from "react-native";
import { Input, Button } from "@rneui/base";
import { theme } from "@/theme";
import { usePlants } from "@/hooks/usePlants";
import { TextInputMask } from "react-native-masked-text";
import type { Plant } from "@/hooks/usePlants";

interface ModalEditPlantProps {
  visible: boolean;
  onClose: () => void;
  plant: Plant;
}

function formatDateToISO(date: string) {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

function formatDateFromISO(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function ModalEditPlant({
  visible,
  onClose,
  plant,
}: ModalEditPlantProps) {
  const { updatePlant, plantSchema } = usePlants();

  const [name, setName] = useState(plant.name);
  const [location, setLocation] = useState(plant.location);
  const [date, setDate] = useState(formatDateFromISO(plant.date));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    date?: string;
  }>({});

  useEffect(() => {
    setName(plant.name);
    setLocation(plant.location);
  
    setDate(formatDateFromISO(plant.date));
    setErrors({});
  }, [plant]);

  const handleUpdate = async () => {
    try {
      const isoDate = formatDateToISO(date);
      const validatedData = plantSchema.parse({
        name,
        location,
        date: isoDate,
      });

      setLoading(true);
      await updatePlant({id: plant.id, data: validatedData});
      onClose();
    } catch (err: any) {
      if (err?.issues) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((i: any) => {
          const field = i.path[0] as string;
          fieldErrors[field] = i.message;
        });
        setErrors(fieldErrors);
      } else {
        console.log("Erro ao atualizar planta:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Editar Planta</Text>

          <Input
            placeholder="Nome da planta"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            errorMessage={errors.name}
            onFocus={() => setErrors((prev) => ({ ...prev, name: undefined }))}
          />

          <Input
            placeholder="Localização"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            errorMessage={errors.location}
            onFocus={() =>
              setErrors((prev) => ({ ...prev, location: undefined }))
            }
          />

          <Input
            placeholder="Data (DD/MM/YYYY)"
            value={date}
            onChangeText={setDate}
            errorMessage={errors.date}
            onFocus={() => setErrors((prev) => ({ ...prev, date: undefined }))}
            InputComponent={TextInputMask as any}
            type={"datetime" as any}
            options={{ format: "DD/MM/YYYY" }}
          />

          <Button
            title="Salvar alterações"
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={handleUpdate}
            loading={loading}
          />

          <Button
            title="Cancelar"
            type="clear"
            titleStyle={{ color: theme.lightColors?.secondary }}
            onPress={onClose}
          />
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
    width: "90%",
    backgroundColor: theme.lightColors?.background,
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.lightColors?.secondary,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: theme.lightColors?.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.lightColors?.background,
  },
});
