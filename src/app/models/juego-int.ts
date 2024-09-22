export interface Juego {
  nombre: string;
  evaluar: (resultados: number[]) => {
    esPosible: boolean;
    puntaje: number | null;
  };
}

export interface Juegos {
  juegos: Juego[];
}
