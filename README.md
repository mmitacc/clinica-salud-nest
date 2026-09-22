# API de Backend de Clínica: "Salud Integral" (Versión NestJS 1.0.0)

## Descripción

Este API es una API RESTful que permite la gestión de usuarios, pacientes, medicos, especialidades, consultas y historial de pacientes. Se adjuntan 2 archivos de detalles panoramicos del proyecto: el archivo `requerimientos.md` y el archivo `ERD-salud integral.png` (con el esquema gráfico de la base de datos).


## Instalación
1.- Clonar el repositorio de la url
    `https://github.com/mmitacc/clinica-salud-nest`
2.- Instalar las dependencias
    `npm install`
3.- Actualizar/crear el archivo .env con tu nombre de base de datos, numero puerto local host (3000)
    y password de Postgresql (se tiene un ejemplo en el archivo .env.ejemplo)
4.- Para migrar/crear los schemas/tablas y base de datos postgresql con prisma: 
    `npx prisma migrate dev --name init`
5.- Para crear/actualizar el cliente prisma que se comunica con tu base de datos: 
    `npx prisma generate`
6.- Para cargar data de test en base de datos: 
    `npm run seed-data`
7.- Finalmente, para levantar el servidor backend 
    `pnpm run start:dev`
8.- Existe una ruta para la documentación completa de la API en el puerto
    `http://localhost:3000/api-docs`


## Autor

Para mayores detalles sobre el proyecto, puedes visitar el repositorio de mi proyecto o contactarme en:
[Manuel Mitacc](https://github.com/mmitacc)
Telefono: +051 996 080 313
Email: manuelmitacc@hotmail.com


## Licencia

MIT License

Copyright (c) 2026 [Manuel Mitacc](https://github.com/mmitacc)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
