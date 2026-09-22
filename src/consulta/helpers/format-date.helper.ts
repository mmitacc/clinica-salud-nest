export const formatDateOut = (consulta: any) => {
  if (!consulta || !consulta.citadate) return consulta;
  const d = new Date(consulta.citadate);
  // Extraemos la fecha (AAAA-MM-DD)
  const anio = d.getUTCFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  const fecha = `${anio}-${mes}-${dia}`;
  // Extraemos el horario (HH:MM)
  const horas = String(d.getHours()).padStart(2, '0');
  const minutos = String(d.getMinutes()).padStart(2, '0');
  const horario = `${horas}:${minutos}`;
  // Desestructuramos para remover el campo original 'datecita'
  const { citadate, ...restoDatosConsulta } = consulta;
  return {
    ...restoDatosConsulta,
    fecha, // "2026-03-16"
    horario, // "14:30"
  };
};
