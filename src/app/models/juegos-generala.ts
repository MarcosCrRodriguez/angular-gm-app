import { Juegos } from './juego-int';

export const juegos: Juegos = {
  juegos: [
    {
      nombre: 'Poker',
      evaluar: (
        resultados: number[]
      ): { esPosible: boolean; puntaje: number | null } => {
        // reduce para contar cuantas veces aparece cada valor en el arreglo resultados
        const conteo = resultados.reduce((acumulador, valor) => {
          acumulador[valor] = (acumulador[valor] || 0) + 1;
          return acumulador;
          // acumulador es un objeto que puede tener numeros como claves y valores que son tambien numeros
        }, {} as Record<number, number>); // afirmación de tipo para acumulador

        const esPosible = Object.values(conteo).some((c) => c >= 4);
        const puntaje = esPosible ? 50 : null;

        return { esPosible, puntaje };
      },
    },
    // otros juegos generala
  ],
};
