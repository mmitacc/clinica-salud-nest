export class CreateHistorialDto {
  id_paciente: number;
  motivo: string;
  triaje: string;
  antecedentes?: string;
  diagnostico?: string;
  tratamiento?: string;
  receta?: string;
}
