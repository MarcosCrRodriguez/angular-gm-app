import { Juegos } from './juego-int';

export const juegos: Juegos = {
  juegos: [
    {
      nombre: 'Generala',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const conteo: Record<number, number> = {};

        resultados.forEach((valor) => {
          conteo[valor] = (conteo[valor] || 0) + 1; // Incrementar el conteo del valor actual
        });

        // Verificar si hay un valor que se repita 5 veces (Generala)
        const esPosible = Object.values(conteo).some(
          (cantidad) => cantidad === 5
        );

        const puntaje = esPosible ? 50 : 0;

        return { esPosible, puntaje };
      },
    },
    {
      nombre: 'Escalera',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const escalera1 = [1, 2, 3, 4, 5];
        const escalera2 = [2, 3, 4, 5, 6];

        // Ordenar los resultados para compararlos
        const resultadosOrdenados = [...resultados].sort((a, b) => a - b);

        const esEscalera1 =
          JSON.stringify(resultadosOrdenados) === JSON.stringify(escalera1);
        const esEscalera2 =
          JSON.stringify(resultadosOrdenados) === JSON.stringify(escalera2);

        const esPosible = esEscalera1 || esEscalera2;

        const puntaje = esPosible ? 20 : 0;

        return { esPosible, puntaje };
      },
    },
    {
      nombre: 'Full',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const conteo: Record<number, number> = {};

        resultados.forEach((valor) => {
          conteo[valor] = (conteo[valor] || 0) + 1; // Incrementar el conteo del valor actual
        });

        // Verificar si hay un valor que se repite 3 veces y otro que se repite 2 veces
        const tieneTres = Object.values(conteo).some(
          (cantidad) => cantidad === 3
        );
        const tieneDos = Object.values(conteo).some(
          (cantidad) => cantidad === 2
        );

        const esPosible = tieneTres && tieneDos;

        const puntaje = esPosible ? 30 : 0;

        return { esPosible, puntaje };
      },
    },
    {
      nombre: 'Poker',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        // Crear un objeto para contar cuántas veces aparece cada valor en los dados
        const conteo: Record<number, number> = {};

        resultados.forEach((valor) => {
          conteo[valor] = (conteo[valor] || 0) + 1; // Incrementar el conteo del valor actual
        });

        // Verificar si existe algún valor que se repita 4 veces
        const esPosible = Object.values(conteo).some(
          (cantidad) => cantidad >= 4
        );

        const puntaje = esPosible ? 40 : 0;

        return { esPosible, puntaje };
      },
    },
    {
      nombre: 'Uno',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 1 ? acumulador + 1 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
    {
      nombre: 'Dos',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 2 ? acumulador + 2 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
    {
      nombre: 'Tres',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 3 ? acumulador + 3 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
    {
      nombre: 'Cuatro',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 4 ? acumulador + 4 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
    {
      nombre: 'Cinco',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 5 ? acumulador + 5 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
    {
      nombre: 'Seis',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        const suma = resultados.reduce(
          (acumulador, dado) => (dado === 6 ? acumulador + 6 : acumulador),
          0
        );
        return { esPosible: suma > 0, puntaje: suma };
      },
    },
  ],
};
