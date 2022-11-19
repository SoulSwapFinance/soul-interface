export interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }
  
const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
      id: 'population',
      label: 'Population',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: 'Size\u00a0(km\u00b2)',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
  ];

  interface Data {
    name: number | string
    code: number | string
    population: number | string
    size: number | string
    density: number | string
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

//   export function createData(
//     col0: number | string,
//     col1: number | string,
//     col2: number | string,
//     col3: number | string,
//     col4?: number | string
//   ): Data {
//     return { col0, col1, col2, col3, col4 }
// }